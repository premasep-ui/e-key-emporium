/**
 * Server-only order + payment logic. Never imported by client code directly.
 * All money is authoritative from the database, never from the browser.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  capturePayPalOrder,
  capturedAmount,
  capturedTransactionId,
  getPayPalOrder,
} from "./paypal.server";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "DELIVERED"
  | "EXPIRED"
  | "FAILED";

export function newOrderCode(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `RZP${n}`;
}

export async function priceCart(items: { slug: string; qty: number }[]) {
  const slugs = items.map((i) => i.slug);
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, slug, name, price_idr, promo_price_idr, active")
    .in("slug", slugs);
  if (error) throw new Error(error.message);

  const priced = items.map((item) => {
    const product = products?.find((p) => p.slug === item.slug);
    if (!product || !product.active) throw new Error("PRODUCT_UNAVAILABLE");
    const unit = product.promo_price_idr ?? product.price_idr;
    return {
      productId: product.id,
      name: product.name,
      qty: item.qty,
      unitPriceIdr: unit,
      lineTotalIdr: unit * item.qty,
    };
  });

  const subtotal = priced.reduce((sum, p) => sum + p.lineTotalIdr, 0);
  return { priced, subtotal };
}

/** Verifies real availability server-side before an order is created. */
export async function assertStockAvailable(priced: { productId: string; qty: number; name: string }[]) {
  for (const line of priced) {
    const { count, error } = await supabaseAdmin
      .from("product_stock")
      .select("id", { count: "exact", head: true })
      .eq("product_id", line.productId)
      .eq("status", "AVAILABLE");
    if (error) throw new Error(error.message);
    if ((count ?? 0) < line.qty) throw new Error(`OUT_OF_STOCK:${line.name}`);
  }
}

export async function expireIfNeeded(order: {
  id: string;
  status: string;
  expires_at: string;
}): Promise<string> {
  if (order.status !== "PENDING_PAYMENT") return order.status;
  if (new Date(order.expires_at).getTime() > Date.now()) return order.status;

  await supabaseAdmin.from("orders").update({ status: "EXPIRED" }).eq("id", order.id);
  await supabaseAdmin
    .from("payments")
    .update({ status: "EXPIRED", updated_at: new Date().toISOString() })
    .eq("order_id", order.id)
    .neq("status", "COMPLETED");
  await supabaseAdmin.from("audit_logs").insert({
    order_id: order.id,
    action: "payment_expired",
    from_status: "PENDING_PAYMENT",
    to_status: "EXPIRED",
  });
  return "EXPIRED";
}

/**
 * Server-side verification for a PayPal order. Never trusts the browser:
 * it asks PayPal for the real order state, captures when approved, and only
 * then runs the locking auto-delivery routine. Safe to call repeatedly.
 */
export async function verifyAndFulfillPaypal(orderId: string): Promise<{ status: string; reason?: string }> {
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, status, expires_at, total_idr")
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) return { status: "NOT_FOUND" };
  if (order.status === "DELIVERED" || order.status === "PAID") return { status: order.status };

  const { data: payment } = await supabaseAdmin
    .from("payments")
    .select("id, provider_order_id, status")
    .eq("order_id", orderId)
    .eq("provider", "paypal")
    .maybeSingle();

  if (!payment?.provider_order_id) {
    return { status: await expireIfNeeded({ ...order, status: order.status }) };
  }

  let remote = await getPayPalOrder(payment.provider_order_id);
  if (remote.status === "APPROVED") {
    remote = await capturePayPalOrder(payment.provider_order_id);
  }

  if (remote.status === "COMPLETED") {
    return { status: await fulfillPaidOrder(orderId, capturedTransactionId(remote), capturedAmount(remote)) };
  }

  if (remote.status === "VOIDED") {
    await supabaseAdmin.from("orders").update({ status: "FAILED" }).eq("id", orderId);
    await supabaseAdmin
      .from("payments")
      .update({ status: "CANCELLED", updated_at: new Date().toISOString() })
      .eq("id", payment.id);
    await supabaseAdmin.from("audit_logs").insert({
      order_id: orderId,
      action: "paypal_voided",
      from_status: order.status,
      to_status: "FAILED",
    });
    return { status: "FAILED" };
  }

  return { status: await expireIfNeeded({ ...order, status: order.status }) };
}

/** Runs the database transaction that assigns and marks stock as sold. */
export async function fulfillPaidOrder(
  orderId: string,
  transactionId?: string,
  amount?: { value: string; currency: string },
): Promise<string> {
  const { data, error } = await supabaseAdmin.rpc("fulfill_paid_order", {
    p_order_id: orderId,
    p_provider: "paypal",
    p_provider_txn: transactionId ?? null,
    p_amount: amount ? Number(amount.value) : null,
    p_currency: amount?.currency ?? null,
  });
  if (error) throw new Error(error.message);
  const result = data as { ok: boolean; status?: string; reason?: string };
  return result.status ?? (result.ok ? "DELIVERED" : "PROCESSING");
}

/** Looks up the order behind a PayPal order id (used by the webhook). */
export async function orderIdByProviderOrderId(providerOrderId: string): Promise<string | undefined> {
  const { data } = await supabaseAdmin
    .from("payments")
    .select("order_id")
    .eq("provider", "paypal")
    .eq("provider_order_id", providerOrderId)
    .maybeSingle();
  return data?.order_id;
}

/** Idempotency guard: returns false when this provider event was already handled. */
export async function claimPaymentEvent(
  provider: string,
  eventId: string,
  eventType: string | undefined,
  payload: unknown,
): Promise<boolean> {
  const { error } = await supabaseAdmin.from("payment_events").insert({
    provider,
    event_id: eventId,
    event_type: eventType ?? null,
    payload: payload as never,
  });
  if (error) {
    if (error.code === "23505" || error.code === "23505".slice(0) || error.message.includes("duplicate")) {
      return false;
    }
    throw new Error(error.message);
  }
  return true;
}
