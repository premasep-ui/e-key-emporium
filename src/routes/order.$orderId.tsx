import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AlertTriangle, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/catalog";
import { getOrderDetail } from "@/lib/payments.functions";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({
    meta: [
      { title: "Detail Pesanan — RILZPEDIA" },
      { name: "description", content: "Lihat detail pesanan dan data produk digital Anda." },
      { property: "og:title", content: "Detail Pesanan — RILZPEDIA" },
      { property: "og:description", content: "Data produk digital dan status pesanan RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetailPage,
});

type Detail = Awaited<ReturnType<typeof getOrderDetail>>;

const statusTone: Record<string, string> = {
  DELIVERED: "border-success/30 bg-success/10 text-success",
  PAID: "border-success/30 bg-success/10 text-success",
  PROCESSING: "border-warning/30 bg-warning/10 text-warning",
  PENDING_PAYMENT: "border-primary/30 bg-primary/10 text-primary",
  EXPIRED: "border-warning/30 bg-warning/10 text-warning",
  FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
};

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const load = useServerFn(getOrderDetail);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    void load({ data: { orderId } }).then(setDetail);
  }, [load, orderId]);

  if (!detail) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Memuat pesanan…</p>
      </div>
    );
  }

  if (!detail.ok) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <AlertTriangle className="mx-auto size-10 text-warning" />
        <h1 className="mt-4 text-xl font-bold">Pesanan tidak ditemukan</h1>
        <Button asChild className="mt-5">
          <Link to="/products">Kembali ke katalog</Link>
        </Button>
      </div>
    );
  }

  const { order, items, payment, delivered } = detail;

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Data disalin");
    } catch {
      toast.error("Gagal menyalin data");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Order ID</p>
          <h1 className="font-display text-2xl font-bold">#{order.order_code}</h1>
        </div>
        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusTone[order.status] ?? ""}`}
        >
          {order.status}
        </span>
      </div>

      {order.status === "DELIVERED" && (
        <section className="mt-7 rounded-3xl border border-success/25 bg-card/75 p-6 shadow-card backdrop-blur-sm">
          <h2 className="font-semibold">Data produk Anda</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Simpan data ini dengan aman dan jangan dibagikan ke orang lain.
          </p>
          <ul className="mt-4 space-y-3">
            {delivered.map((row, index) => (
              <li key={index} className="rounded-2xl border border-border bg-background/60 p-4">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm">
                  {revealed[index] ? row.data : row.data.replace(/[^\n]/g, "•")}
                </pre>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setRevealed((prev) => ({ ...prev, [index]: !prev[index] }))}
                  >
                    {revealed[index] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {revealed[index] ? "Sembunyikan" : "Tampilkan Data"}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => void copy(row.data)}>
                    <Copy className="size-4" /> Salin Data
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {order.status === "PENDING_PAYMENT" && (
        <div className="mt-7 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
          Pembayaran belum selesai.{" "}
          <Link to="/payment/$orderId" params={{ orderId }} className="font-semibold underline">
            Lanjutkan pembayaran
          </Link>
        </div>
      )}

      <section className="mt-7 rounded-3xl border border-border bg-card/75 p-6 shadow-card backdrop-blur-sm">
        <h2 className="font-semibold">Rincian pesanan</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between gap-4">
              <span>
                {item.product_name}
                <span className="block text-xs text-muted-foreground">
                  {item.qty} × {formatIDR(item.unit_price_idr)}
                </span>
              </span>
              <span className="font-semibold">{formatIDR(item.unit_price_idr * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-between border-t border-border pt-4">
          <span className="text-sm">Total</span>
          <span className="text-lg font-bold text-primary">{formatIDR(order.total_idr)}</span>
        </div>

        <dl className="mt-5 grid gap-2 border-t border-border pt-4 text-sm">
          <Info label="Nama" value={order.buyer_name} />
          <Info label="Email" value={order.buyer_email} />
          <Info label="WhatsApp" value={order.buyer_wa} />
          <Info label="Tanggal" value={new Date(order.created_at).toLocaleString("id-ID")} />
          {payment && (
            <>
              <Info label="Pembayaran" value={`${payment.provider.toUpperCase()} — ${payment.status}`} />
              {payment.provider_transaction_id && (
                <Info label="ID transaksi" value={payment.provider_transaction_id} />
              )}
            </>
          )}
        </dl>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => window.print()}>
          Download Invoice
        </Button>
        <Button asChild variant="secondary">
          <Link to="/products">Belanja lagi</Link>
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate text-right">{value}</dd>
    </div>
  );
}
