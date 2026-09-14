CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  price_idr integer NOT NULL CHECK (price_idr >= 0),
  promo_price_idr integer CHECK (promo_price_idr >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code text NOT NULL UNIQUE,
  buyer_name text NOT NULL,
  buyer_email text NOT NULL,
  buyer_wa text NOT NULL,
  subtotal_idr integer NOT NULL CHECK (subtotal_idr >= 0),
  total_idr integer NOT NULL CHECK (total_idr >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('qris','paypal')),
  status text NOT NULL DEFAULT 'PENDING_PAYMENT'
    CHECK (status IN ('PENDING_PAYMENT','PAID','PROCESSING','DELIVERED','EXPIRED','FAILED')),
  paid_at timestamptz,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '60 minutes',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX orders_email_idx ON public.orders (lower(buyer_email));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  product_name text NOT NULL,
  unit_price_idr integer NOT NULL CHECK (unit_price_idr >= 0),
  qty integer NOT NULL CHECK (qty > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX order_items_order_idx ON public.order_items (order_id);

CREATE TABLE public.product_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  secret_data text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'AVAILABLE'
    CHECK (status IN ('AVAILABLE','RESERVED','SOLD','INVALID')),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  sold_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.product_stock TO service_role;
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;
CREATE INDEX product_stock_available_idx ON public.product_stock (product_id, status);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('qris','paypal')),
  provider_order_id text,
  provider_transaction_id text,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'CREATED'
    CHECK (status IN ('CREATED','PENDING','COMPLETED','FAILED','EXPIRED','CANCELLED')),
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_order_id)
);
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE INDEX payments_order_idx ON public.payments (order_id);

CREATE TABLE public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_id text NOT NULL,
  event_type text,
  payload jsonb,
  processed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);
GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  actor text NOT NULL DEFAULT 'system',
  action text NOT NULL,
  from_status text,
  to_status text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.fulfill_paid_order(
  p_order_id uuid,
  p_provider text,
  p_provider_txn text,
  p_amount numeric,
  p_currency text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders;
  v_item record;
  v_stock_id uuid;
  v_assigned integer := 0;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'order_not_found');
  END IF;

  IF v_order.status IN ('PAID', 'DELIVERED') THEN
    RETURN jsonb_build_object('ok', true, 'already', true, 'status', v_order.status);
  END IF;

  UPDATE public.payments
     SET status = 'COMPLETED',
         provider_transaction_id = COALESCE(p_provider_txn, provider_transaction_id),
         amount = COALESCE(p_amount, amount),
         currency = COALESCE(p_currency, currency),
         updated_at = now()
   WHERE order_id = p_order_id AND provider = p_provider;

  UPDATE public.orders
     SET status = 'PAID', paid_at = COALESCE(paid_at, now())
   WHERE id = p_order_id;

  FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id LOOP
    FOR i IN 1..v_item.qty LOOP
      SELECT id INTO v_stock_id
        FROM public.product_stock
       WHERE product_id = v_item.product_id AND status = 'AVAILABLE'
       ORDER BY created_at
         FOR UPDATE SKIP LOCKED
       LIMIT 1;

      IF v_stock_id IS NULL THEN
        UPDATE public.orders SET status = 'PROCESSING' WHERE id = p_order_id;
        INSERT INTO public.audit_logs(order_id, action, from_status, to_status, meta)
        VALUES (p_order_id, 'delivery_out_of_stock', 'PAID', 'PROCESSING',
                jsonb_build_object('product_id', v_item.product_id, 'assigned', v_assigned));
        RETURN jsonb_build_object('ok', false, 'reason', 'out_of_stock', 'status', 'PROCESSING');
      END IF;

      UPDATE public.product_stock
         SET status = 'SOLD', order_id = p_order_id, sold_at = now()
       WHERE id = v_stock_id;
      v_assigned := v_assigned + 1;
    END LOOP;
  END LOOP;

  UPDATE public.orders SET status = 'DELIVERED' WHERE id = p_order_id;

  INSERT INTO public.audit_logs(order_id, action, from_status, to_status, meta)
  VALUES (p_order_id, 'payment_verified_delivered', v_order.status, 'DELIVERED',
          jsonb_build_object('provider', p_provider, 'transaction_id', p_provider_txn, 'assigned', v_assigned));

  RETURN jsonb_build_object('ok', true, 'status', 'DELIVERED', 'assigned', v_assigned);
END;
$$;

REVOKE ALL ON FUNCTION public.fulfill_paid_order(uuid, text, text, numeric, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fulfill_paid_order(uuid, text, text, numeric, text) TO service_role;

INSERT INTO public.products (slug, name, price_idr, promo_price_idr) VALUES
  ('netflix-premium-1-bulan', 'Netflix Premium 1 Bulan', 35000, 25000),
  ('spotify-premium-1-bulan', 'Spotify Premium 1 Bulan', 20000, 15000),
  ('chatgpt-plus-1-bulan', 'ChatGPT Plus 1 Bulan', 95000, 79000),
  ('youtube-premium-1-bulan', 'YouTube Premium 1 Bulan', 15000, NULL),
  ('nordvpn-premium-1-tahun', 'NordVPN Premium 1 Tahun', 120000, 89000),
  ('steam-wallet-idr-60000', 'Steam Wallet Rp60.000', 65000, NULL),
  ('canva-pro-1-tahun', 'Canva Pro 1 Tahun', 45000, 29000),
  ('mobile-legends-diamond-100', 'Mobile Legends 100 Diamond', 28000, NULL),
  ('disney-plus-hotstar-1-bulan', 'Disney+ Hotstar 1 Bulan', 22000, NULL),
  ('capcut-pro-1-bulan', 'CapCut Pro 1 Bulan', 25000, 18000),
  ('rilzpedia-member-vip', 'RILZPEDIA Member VIP', 50000, NULL),
  ('google-one-2tb-1-tahun', 'Google One 2TB 1 Tahun', 90000, 69000);

INSERT INTO public.product_stock (product_id, secret_data, note)
SELECT p.id,
       'DEMO ' || upper(p.slug) || ' #' || g.n || E'\nEmail: demo' || g.n || '@rilzpedia.id' || E'\nPassword: DemoRilz' || g.n || '!',
       'Data contoh untuk pengujian'
FROM public.products p
CROSS JOIN generate_series(1, 3) AS g(n)
WHERE p.slug <> 'mobile-legends-diamond-100';