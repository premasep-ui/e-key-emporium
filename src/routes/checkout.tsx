import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Check, ShoppingBag, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { finalPrice, formatIDR, getProduct } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { PaymentMethodSelect, type PaymentMethod } from "@/components/site/PaymentMethodSelect";
import { createPaypalCheckout } from "@/lib/payments.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — RILZPEDIA" },
      { name: "description", content: "Isi data pembeli dan lanjutkan pembayaran QRIS." },
      { property: "og:title", content: "Checkout — RILZPEDIA" },
      { property: "og:description", content: "Checkout cepat dengan pembayaran QRIS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const steps = ["Data pembeli", "Ringkasan", "Pembayaran", "Verifikasi", "Produk dikirim"];

function errorMessage(code: string) {
  if (code.startsWith("OUT_OF_STOCK")) {
    const name = code.split(":")[1];
    return `Stok ${name ?? "produk"} tidak mencukupi. Kurangi jumlah atau pilih produk lain.`;
  }
  if (code === "PRODUCT_UNAVAILABLE") return "Ada produk yang sudah tidak tersedia.";
  if (code === "PAYPAL_NOT_CONFIGURED") return "Pembayaran PayPal belum dikonfigurasi.";
  if (code === "PAYPAL_UNAVAILABLE" || code === "PAYPAL_NO_APPROVAL_URL")
    return "PayPal sedang tidak dapat dihubungi. Coba lagi sebentar.";
  return "Gagal membuat pesanan. Coba lagi sebentar.";
}

function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState({ name: "", email: "", wa: "" });
  const [coupon, setCoupon] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("paypal");
  const [loading, setLoading] = useState(false);
  const startPaypal = useServerFn(createPaypalCheckout);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Tidak ada produk untuk di-checkout</h1>
        <Button asChild className="mt-5">
          <Link to="/products">Pilih produk</Link>
        </Button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.wa) {
      toast.error("Lengkapi data pembeli terlebih dahulu");
      return;
    }
    if (method === "qris") {
      toast.info("Pembayaran QRIS belum aktif", {
        description: "Untuk sekarang silakan gunakan PayPal.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await startPaypal({
        data: {
          buyer: { name: form.name.trim(), email: form.email.trim(), wa: form.wa.trim() },
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        },
      });
      if (!result.ok) {
        toast.error(errorMessage(result.error));
        return;
      }
      window.location.href = result.approveUrl;
    } catch {
      toast.error("Gagal membuat pesanan. Coba lagi sebentar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <ol className="mt-5 flex flex-wrap gap-2 text-xs">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${
              i === 0
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            <span className="font-semibold">{i + 1}</span> {s}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Data pembeli</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Data produk digital akan dikirim ke email dan nomor WhatsApp ini.
          </p>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama lengkap</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama Anda"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email aktif</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="wa">Nomor WhatsApp</Label>
              <Input
                id="wa"
                inputMode="tel"
                value={form.wa}
                onChange={(e) => setForm({ ...form, wa: e.target.value })}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
          </div>

          <div className="mt-7 border-t border-border pt-6">
            <PaymentMethodSelect value={method} onChange={setMethod} />
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-accent/30 px-4 py-3">
              <span className="text-sm text-muted-foreground">Total pembayaran</span>
              <span className="text-lg font-bold text-primary">{formatIDR(subtotal)}</span>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-6 w-full transition-transform duration-200 hover:-translate-y-0.5"
          >
            {method === "qris" ? "Buat Pesanan & Bayar QRIS" : "Buat Pesanan & Bayar PayPal"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Dengan melanjutkan, Anda menyetujui{" "}
            <Link to="/terms" className="text-primary hover:underline">
              syarat &amp; ketentuan
            </Link>{" "}
            RILZPEDIA.
          </p>
        </form>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Ringkasan pesanan</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => {
                const product = getProduct(item.slug);
                if (!product) return null;
                return (
                  <li key={item.slug} className="flex justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="line-clamp-1">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.qty} × {formatIDR(finalPrice(product))}
                      </span>
                    </span>
                    <span className="font-semibold">
                      {formatIDR(finalPrice(product) * item.qty)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 border-t border-border pt-4">
              <Label htmlFor="coupon" className="text-xs">
                Kode voucher
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="RILZ10"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => toast.info("Sistem voucher menyusul di tahap berikutnya")}
                >
                  <Ticket className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex justify-between border-t border-border pt-4">
              <span className="text-sm">Total bayar</span>
              <span className="text-lg font-bold text-primary">{formatIDR(subtotal)}</span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="size-3.5 text-success" /> Pembayaran QRIS, semua e-wallet &amp; bank
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
