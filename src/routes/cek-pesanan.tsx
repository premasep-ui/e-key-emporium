import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/cek-pesanan")({
  head: () => ({
    meta: [
      { title: "Cek Pesanan — RILZPEDIA" },
      {
        name: "description",
        content:
          "Lacak status pesanan digital Anda di RILZPEDIA dengan Order ID dan email pembelian.",
      },
      { property: "og:title", content: "Cek Pesanan — RILZPEDIA" },
      { property: "og:description", content: "Lacak status pembayaran dan pengiriman pesanan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CekPesanan,
});

const statuses = [
  { label: "WAITING PAYMENT", cls: "bg-warning/15 text-warning" },
  { label: "PAID", cls: "bg-primary/15 text-primary" },
  { label: "PROCESSING", cls: "bg-accent text-accent-foreground" },
  { label: "DELIVERED", cls: "bg-success/15 text-success" },
  { label: "EXPIRED", cls: "bg-muted text-muted-foreground" },
  { label: "FAILED", cls: "bg-destructive/15 text-destructive" },
];

function CekPesanan() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [notFound, setNotFound] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Cek Pesanan</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Masukkan Order ID dan email yang Anda gunakan saat checkout.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNotFound(true);
        }}
        className="mt-6 rounded-2xl border border-border bg-card p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="RZP123456"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email pembelian</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              required
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">
          Cek Status
        </Button>
      </form>

      {notFound && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <FileSearch className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">Pesanan tidak ditemukan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pastikan Order ID dan email sudah benar. Sistem pesanan online masih dalam proses
            pemasangan.
          </p>
          <Button asChild variant="secondary" className="mt-4">
            <Link to="/faq">Hubungi bantuan</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Arti status pesanan</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {statuses.map((s) => (
            <span key={s.label} className={`rounded-md px-2 py-1 text-xs font-semibold ${s.cls}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
