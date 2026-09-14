/**
 * PayPal REST helpers (server-only).
 * Credentials come from environment variables and are read per-call:
 * PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENVIRONMENT ("sandbox" | "live").
 * The client secret never leaves the server.
 */

type PayPalConfig = { clientId: string; clientSecret: string; baseUrl: string };

const SANDBOX = "https://api-m.sandbox.paypal.com";
const LIVE = "https://api-m.paypal.com";

export function isPayPalConfigured(): boolean {
  return Boolean(process.env["PAYPAL_CLIENT_ID"] && process.env["PAYPAL_CLIENT_SECRET"]);
}

function getConfig(): PayPalConfig {
  const clientId = process.env["PAYPAL_CLIENT_ID"];
  const clientSecret = process.env["PAYPAL_CLIENT_SECRET"];
  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_NOT_CONFIGURED");
  }
  const env = (process.env["PAYPAL_ENVIRONMENT"] ?? "sandbox").toLowerCase();
  return { clientId, clientSecret, baseUrl: env === "live" ? LIVE : SANDBOX };
}

/** Rupiah is not a PayPal transaction currency, so orders are charged in USD. */
export function idrToUsd(amountIdr: number): string {
  const rate = Number(process.env["PAYPAL_IDR_TO_USD_RATE"] ?? "16500");
  const safeRate = Number.isFinite(rate) && rate > 0 ? rate : 16500;
  return (Math.max(1, Math.round((amountIdr / safeRate) * 100)) / 100).toFixed(2);
}

async function accessToken(cfg: PayPalConfig): Promise<string> {
  const res = await fetch(`${cfg.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${cfg.clientId}:${cfg.clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PAYPAL_AUTH_FAILED_${res.status}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

async function call<T>(
  path: string,
  init: { method: string; body?: unknown; headers?: Record<string, string> },
): Promise<T> {
  const cfg = getConfig();
  const token = await accessToken(cfg);
  const res = await fetch(`${cfg.baseUrl}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("PayPal API error", path, res.status, text.slice(0, 500));
    throw new Error(`PAYPAL_REQUEST_FAILED_${res.status}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

export type PayPalOrder = {
  id: string;
  status: string;
  links?: { href: string; rel: string; method?: string }[];
  purchase_units?: {
    payments?: { captures?: { id: string; status: string; amount?: { value: string; currency_code: string } }[] };
  }[];
};

export async function createPayPalOrder(params: {
  orderCode: string;
  amountUsd: string;
  returnUrl: string;
  cancelUrl: string;
  requestId: string;
}): Promise<PayPalOrder> {
  return call<PayPalOrder>("/v2/checkout/orders", {
    method: "POST",
    headers: { "PayPal-Request-Id": params.requestId },
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: params.orderCode,
          custom_id: params.orderCode,
          invoice_id: params.orderCode,
          amount: { currency_code: "USD", value: params.amountUsd },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "RILZPEDIA",
            user_action: "PAY_NOW",
            return_url: params.returnUrl,
            cancel_url: params.cancelUrl,
          },
        },
      },
    },
  });
}

export async function getPayPalOrder(paypalOrderId: string): Promise<PayPalOrder> {
  return call<PayPalOrder>(`/v2/checkout/orders/${paypalOrderId}`, { method: "GET" });
}

export async function capturePayPalOrder(paypalOrderId: string): Promise<PayPalOrder> {
  return call<PayPalOrder>(`/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: { "PayPal-Request-Id": `cap-${paypalOrderId}` },
    body: {},
  });
}

export function approvalLink(order: PayPalOrder): string | undefined {
  return order.links?.find((l) => l.rel === "payer-action" || l.rel === "approve")?.href;
}

export function capturedAmount(order: PayPalOrder): { value: string; currency: string } | undefined {
  const capture = order.purchase_units?.[0]?.payments?.captures?.find((c) => c.status === "COMPLETED");
  if (!capture?.amount) return undefined;
  return { value: capture.amount.value, currency: capture.amount.currency_code };
}

export function capturedTransactionId(order: PayPalOrder): string | undefined {
  return order.purchase_units?.[0]?.payments?.captures?.find((c) => c.status === "COMPLETED")?.id;
}

/** Verifies a webhook using PayPal's own verification endpoint. */
export async function verifyWebhookSignature(params: {
  headers: Headers;
  rawBody: string;
}): Promise<boolean> {
  const webhookId = process.env["PAYPAL_WEBHOOK_ID"];
  if (!webhookId) {
    console.error("PAYPAL_WEBHOOK_ID is not configured; rejecting webhook");
    return false;
  }
  const h = params.headers;
  const payload = {
    auth_algo: h.get("paypal-auth-algo"),
    cert_url: h.get("paypal-cert-url"),
    transmission_id: h.get("paypal-transmission-id"),
    transmission_sig: h.get("paypal-transmission-sig"),
    transmission_time: h.get("paypal-transmission-time"),
    webhook_id: webhookId,
    webhook_event: JSON.parse(params.rawBody),
  };
  if (
    !payload.auth_algo ||
    !payload.cert_url ||
    !payload.transmission_id ||
    !payload.transmission_sig ||
    !payload.transmission_time
  ) {
    return false;
  }
  try {
    const res = await call<{ verification_status: string }>(
      "/v1/notifications/verify-webhook-signature",
      { method: "POST", body: payload },
    );
    return res.verification_status === "SUCCESS";
  } catch (error) {
    console.error("PayPal webhook verification failed", error);
    return false;
  }
}
