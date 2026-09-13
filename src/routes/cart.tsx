import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockBadge } from "@/components/site/StockBadge";
import { finalPrice, formatIDR, getProduct, LOW_STOCK } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Keranjang — RILZPEDIA" },
      { name: "description", content: "Periksa produk digital di keranjang sebelum checkout." },
      { property: "og:title", content: "Keranjang — RILZPEDIA" },
      { property: "og:description", content: "Ringkasan produk digital yang akan Anda beli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Keranjang masih kosong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Belum ada produk di keranjang Anda. Yuk pilih produk digital favorit Anda.
        </p>
        <Button asChild className="mt-5">
          <Link to="/products">Mulai belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Keranjang</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((item) => {
            const product = getProduct(item.slug);
            if (!product) return null;
            return (
              <div
                key={item.slug}
                className="flex gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-accent/50 font-display font-bold text-gradient">
                  {product.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="line-clamp-1 text-sm font-semibold hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.duration}</p>
                  <div className="mt-2">
                    <StockBadge stock={product.stock} lowAt={LOW_STOCK} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        aria-label="Kurangi"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <Button
                        size="icon"
                        variant="secondary"
                        aria-label="Tambah"
                        disabled={item.qty >= product.stock}
                        onClick={() => setQty(item.slug, item.qty + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Hapus"
                        onClick={() => remove(item.slug)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {formatIDR(finalPrice(product) * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">Ringkasan</h2>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">{formatIDR(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-muted-foreground">
              <span>Biaya layanan</span>
              <span className="text-success">Gratis</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4">
              <span className="text-sm">Total</span>
              <span className="text-lg font-bold text-primary">{formatIDR(subtotal)}</span>
            </div>
            <Button asChild size="lg" className="mt-5 w-full">
              <Link to="/checkout">Lanjut ke Checkout</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/products">Tambah produk lain</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
