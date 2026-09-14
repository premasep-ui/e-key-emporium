import { createFileRoute } from "@tanstack/react-router";

/**
 * PayPal webhook. Every event is signature-verified with PayPal before it is
 * trusted, recorded once for idempotency, and then re-verified against the
 * PayPal API before any product is delivered.
 */
export const Route = createFileRoute("/api/public/paypal/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const { verifyWebhookSignature } = await import("@/lib/paypal.server");

        const valid = await verifyWebhookSignature({ headers: request.headers, rawBody });
        if (!valid) return new Response("Invalid signature", { status: 401 });

        let event: {
          id?: string;
          event_type?: string;
          resource?: { id?: string; supplementary_data?: { related_ids?: { order_id?: string } } };
        };
        try {
          event = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }
        if (!event.id) return new Response("Missing event id", { status: 400 });

        const { claimPaymentEvent, orderIdByProviderOrderId, verifyAndFulfillPaypal } = await import(
          "@/lib/orders.server"
        );

        const fresh = await claimPaymentEvent("paypal", event.id, event.event_type, event);
        if (!fresh) return Response.json({ ok: true, duplicate: true });

        const providerOrderId =
          event.resource?.supplementary_data?.related_ids?.order_id ?? event.resource?.id;
        if (!providerOrderId) return Response.json({ ok: true, ignored: true });

        const orderId = await orderIdByProviderOrderId(providerOrderId);
        if (!orderId) return Response.json({ ok: true, ignored: true });

        const result = await verifyAndFulfillPaypal(orderId);
        return Response.json({ ok: true, status: result.status });
      },
    },
  },
});
