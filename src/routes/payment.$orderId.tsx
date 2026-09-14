import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { checkPaymentStatus, getOrderDetail } from "@/lib/payments.functions";

export const Route = createFileRoute("/payment/$orderId")({
  head: () => ({
    meta: [
      { title: "Status Pembayaran — RILZPEDIA" },
      { name: "description", content: "Pantau status pembayaran pesanan RILZPEDIA Anda." },
      { property: "og:title", content: "Status Pembayaran — RILZPEDIA" },
      { property: "og:description", content: "Verifikasi pembayaran berjalan otomatis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentStatusPage,
});

type Detail = Awaited<ReturnType<typeof getOrderDetail>>;

function PaymentStatusPage() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const { clear } = useCart();
  const loadDetail = useServerFn(getOrderDetail);
  const verify = useServerFn(checkPaymentStatus);

  const [detail, setDetail] = useState<Detail | null>(null);
  const [status, setStatus] = useState<string>("PENDING_PAYMENT");
  const [checking, setChecking] = useState(true);
  const cleared = useRef(false);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      const verified = await verify({ data: { orderId } });
      if (verified.ok) setStatus(verified.status);
      const next = await loadDetail({ data: { orderId } });
      setDetail(next);
      if (next.ok) setStatus(next.order.status);
    } finally {
      setChecking(false);
    }
  }, [loadDetail, orderId, verify]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Automatic re-checking while payment is still open. Status always comes
  // from the server, never from the URL the browser came back with.
  useEffect(() => {
    if (status !== "PENDING_PAYMENT") return;
    const timer = setInterval(() => void refresh(), 5000);
    return () => clearInterval(timer);
  }, [refresh, status]);

  useEffect(() => {
    if ((status === "DELIVERED" || status === "PAID" || status === "PROCESSING") && !cleared.current) {
      cleared.current = true;
      clear();
    }
    if (status === "DELIVERED") {
      const timer = setTimeout(() => void navigate({ to: "/order/$orderId", params: { orderId } }), 1400);
      return () => clearTimeout(timer);
    }
  }, [clear, navigate, orderId, status]);

  if (detail && !detail.ok) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <AlertTriangle className="mx-auto size-10 text-warning" />
        <h1 className="mt-4 text-xl font-bold">Pesanan tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted-foreground">Periksa kembali tautan pesanan Anda.</p>
        <Button asChild className="mt-5">
          <Link to="/products">Kembali ke katalog</Link>
        </Button>
      </div>
    );
  }

  const order = detail?.ok ? detail.order : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/75 p-7 shadow-card backdrop-blur-sm">
        <div className="pointer-events-none absolute -right-16 -top-20 size-60 decor-orb animate-glow-pulse" aria-hidden />

        <p className="text-xs uppercase tracking-widest text-muted-foreground">Order ID</p>
        <h1 className="font-display text-2xl font-bold">#{order?.order_code ?? "…"}</h1>

        <div className="mt-6">
          <StatusPanel status={status} checking={checking} />
        </div>

        {order && (
          <dl className="mt-7 grid gap-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-bold text-primary">{formatIDR(order.total_idr)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Metode</dt>
              <dd className="font-semibold uppercase">{order.payment_method}</dd>
            </div>
            {detail?.ok && detail.payment?.provider_transaction_id && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">ID transaksi</dt>
                <dd className="truncate font-mono text-xs">{detail.payment.provider_transaction_id}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Batas pembayaran</dt>
              <dd>{new Date(order.expires_at).toLocaleString("id-ID")}</dd>
            </div>
          </dl>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Button onClick={() => void refresh()} disabled={checking} variant="secondary">
            <RefreshCw className={`size-4 ${checking ? "animate-spin" : ""}`} /> Saya Sudah Bayar
          </Button>
          {(status === "DELIVERED" || status === "PAID" || status === "PROCESSING") && (
            <Button asChild>
              <Link to="/order/$orderId" params={{ orderId }}>
                Lihat pesanan
              </Link>
            </Button>
          )}
          {(status === "EXPIRED" || status === "FAILED") && (
            <Button asChild variant="secondary">
              <Link to="/products">Pesan ulang</Link>
            </Button>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Tombol ini hanya memeriksa status. Produk dikirim otomatis setelah pembayaran
          terverifikasi di sisi server.
        </p>
      </div>
    </div>
  );
}

function StatusPanel({ status, checking }: { status: string; checking: boolean }) {
  if (status === "DELIVERED" || status === "PAID") {
    return (
      <Row
        tone="success"
        icon={<CheckCircle2 className="size-6" />}
        title="Pembayaran berhasil"
        note={status === "DELIVERED" ? "Produk Anda sudah dikirim." : "Menyiapkan pengiriman produk…"}
      />
    );
  }
  if (status === "PROCESSING") {
    return (
      <Row
        tone="warning"
        icon={<Loader2 className="size-6 animate-spin" />}
        title="Pembayaran diterima, pesanan diproses"
        note="Stok sedang disiapkan manual oleh tim kami."
      />
    );
  }
  if (status === "EXPIRED") {
    return (
      <Row
        tone="warning"
        icon={<Clock className="size-6" />}
        title="Pembayaran kedaluwarsa"
        note="Batas waktu pembayaran terlewat. Silakan buat pesanan baru."
      />
    );
  }
  if (status === "FAILED") {
    return (
      <Row
        tone="destructive"
        icon={<XCircle className="size-6" />}
        title="Pembayaran gagal"
        note="Pembayaran dibatalkan atau tidak berhasil. Tidak ada produk yang dikirim."
      />
    );
  }
  return (
    <Row
      tone="primary"
      icon={<Loader2 className="size-6 animate-spin" />}
      title="Menunggu pembayaran…"
      note={checking ? "Memeriksa status di PayPal…" : "Selesaikan pembayaran di jendela PayPal."}
    />
  );
}

const tones: Record<string, string> = {
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  primary: "border-primary/30 bg-primary/10 text-primary",
};

function Row({
  tone,
  icon,
  title,
  note,
}: {
  tone: keyof typeof tones;
  icon: React.ReactNode;
  title: string;
  note: string;
}) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${tones[tone]}`}>
      <span className="mt-0.5">{icon}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{note}</span>
      </span>
    </div>
  );
}
