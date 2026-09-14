import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { z } from "zod";

const cartSchema = z.object({
  buyer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(160),
    wa: z.string().trim().min(8).max(20),
  }),
  items: z
    .array(z.object({ slug: z.string().min(1).max(120), qty: z.number().int().min(1).max(10) }))
    .min(1)
    .max(20),
});

/**
 * Creates a PENDING_PAYMENT order and a matching PayPal order, then returns the
 * official PayPal approval URL. Prices and stock come from the database only.
 */
export const createPaypalCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => cartSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { assertStockAvailable, newOrderCode, priceCart } = await import("./orders.server");
    const paypal = await import("./paypal.server");

    if (!paypal.isPayPalConfigured()) {
      return { ok: false as const, error: "PAYPAL_NOT_CONFIGURED" };
    }

    let priced: Awaited<ReturnType<typeof priceCart>>["priced"];
    let subtotal: number;
    try {
      const result = await priceCart(data.items);
      priced = result.priced;
      subtotal = result.subtotal;
      await assertStockAvailable(priced);
    } catch (error) {
      const message = error instanceof Error ? error.message : "CART_INVALID";
      return { ok: false as const, error: message };
    }

    const orderCode = newOrderCode();
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_code: orderCode,
        buyer_name: data.buyer.name,
        buyer_email: data.buyer.email,
        buyer_wa: data.buyer.wa,
        subtotal_idr: subtotal,
        total_idr: subtotal,
        payment_method: "paypal",
      })
      .select("id, order_code, total_idr")
      .single();
    if (orderError || !order) {
      console.error("Failed to create order", orderError);
      return { ok: false as const, error: "ORDER_CREATE_FAILED" };
    }

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      priced.map((line) => ({
        order_id: order.id,
        product_id: line.productId,
        product_name: line.name,
        unit_price_idr: line.unitPriceIdr,
        qty: line.qty,
      })),
    );
    if (itemsError) {
      console.error("Failed to create order items", itemsError);
      return { ok: false as const, error: "ORDER_CREATE_FAILED" };
    }

    const origin = new URL(getRequestUrl()).origin;
    const amountUsd = paypal.idrToUsd(order.total_idr);

    try {
      const remote = await paypal.createPayPalOrder({
        orderCode: order.order_code,
        amountUsd,
        returnUrl: `${origin}/payment/${order.id}`,
        cancelUrl: `${origin}/payment/${order.id}?cancelled=1`,
        requestId: order.id,
      });

      await supabaseAdmin.from("payments").insert({
        order_id: order.id,
        provider: "paypal",
        provider_order_id: remote.id,
        amount: Number(amountUsd),
        currency: "USD",
        status: "PENDING",
      });
      await supabaseAdmin.from("audit_logs").insert({
        order_id: order.id,
        action: "paypal_order_created",
        to_status: "PENDING_PAYMENT",
        meta: { provider_order_id: remote.id, amount_usd: amountUsd },
      });

      const approveUrl = paypal.approvalLink(remote);
      if (!approveUrl) return { ok: false as const, error: "PAYPAL_NO_APPROVAL_URL" };
      return { ok: true as const, orderId: order.id, orderCode: order.order_code, approveUrl };
    } catch (error) {
      console.error("PayPal order creation failed", error);
      await supabaseAdmin.from("orders").update({ status: "FAILED" }).eq("id", order.id);
      return { ok: false as const, error: "PAYPAL_UNAVAILABLE" };
    }
  });

const orderIdSchema = z.object({ orderId: z.string().uuid() });

/** Server-side status check. The browser can never mark an order as paid. */
export const checkPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderIdSchema.parse(data))
  .handler(async ({ data }) => {
    const { verifyAndFulfillPaypal } = await import("./orders.server");
    try {
      const result = await verifyAndFulfillPaypal(data.orderId);
      return { ok: true as const, status: result.status };
    } catch (error) {
      console.error("Payment status check failed", error);
      return { ok: false as const, status: "UNKNOWN" as const };
    }
  });

/** Order detail. Digital data is only returned once the order is DELIVERED. */
export const getOrderDetail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderIdSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "id, order_code, buyer_name, buyer_email, buyer_wa, total_idr, status, payment_method, created_at, paid_at, expires_at",
      )
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order) return { ok: false as const, error: "ORDER_NOT_FOUND" };

    const { data: items } = await supabaseAdmin
      .from("order_items")
      .select("product_name, unit_price_idr, qty")
      .eq("order_id", order.id);

    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("provider, provider_transaction_id, status, amount, currency, updated_at")
      .eq("order_id", order.id)
      .maybeSingle();

    let delivered: { data: string }[] = [];
    if (order.status === "DELIVERED") {
      const { data: stock } = await supabaseAdmin
        .from("product_stock")
        .select("secret_data")
        .eq("order_id", order.id)
        .eq("status", "SOLD");
      delivered = (stock ?? []).map((s) => ({ data: s.secret_data }));
    }

    return {
      ok: true as const,
      order,
      items: items ?? [],
      payment: payment ?? null,
      delivered,
    };
  });
