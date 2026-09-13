import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus, Plus, ShieldCheck, ShoppingCart, Star, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockBadge } from "@/components/site/StockBadge";
import { ProductCard } from "@/components/site/ProductCard";
import { finalPrice, formatIDR, getProduct, LOW_STOCK, products } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produk tidak ditemukan — RILZPEDIA" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} — ${formatIDR(finalPrice(p))} | RILZPEDIA`;
    return {
      meta: [
        { title },
        { name: "description", content: p.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: p.description.slice(0, 155) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-xl font-bold">Produk tidak tersedia</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Produk ini mungkin sudah dihapus atau tautannya salah.
      </p>
      <Button asChild className="mt-5">
        <Link to="/products">Lihat produk lain</Link>
      </Button>
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const price = finalPrice(product);
  const outOfStock = product.stock === 0;
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const changeQty = (delta: number) =>
    setQty((v) => Math.max(1, Math.min(product.stock || 1, v + delta)));

  const addToCart = () => {
    add(product.slug, qty);
    toast.success("Ditambahkan ke keranjang", { description: `${product.name} × ${qty}` });
  };

  const buyNow = () => {
    add(product.slug, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/products" className="hover:text-foreground">
          Produk
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="grid h-56 place-items-center rounded-3xl border border-border bg-accent/40 sm:h-72">
            <span className="font-display text-6xl font-bold text-gradient">{product.logo}</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-warning text-warning" />
              <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>(
              {product.reviewCount} ulasan)
            </span>
            <span>• {product.sold} terjual</span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" /> {product.duration}
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <Tabs defaultValue="benefit" className="mt-8">
            <TabsList className="flex-wrap">
              <TabsTrigger value="benefit">Benefit</TabsTrigger>
              <TabsTrigger value="cara">Cara pakai</TabsTrigger>
              <TabsTrigger value="garansi">Garansi</TabsTrigger>
              <TabsTrigger value="snk">Syarat &amp; ketentuan</TabsTrigger>
            </TabsList>
            <TabsContent value="benefit" className="rounded-2xl border border-border bg-card p-5">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {product.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" /> {b}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="cara" className="rounded-2xl border border-border bg-card p-5">
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                {product.howTo.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="garansi" className="rounded-2xl border border-border bg-card p-5">
              <p className="flex gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" /> {product.warranty}
              </p>
            </TabsContent>
            <TabsContent value="snk" className="rounded-2xl border border-border bg-card p-5">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {product.terms.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>

        {/* Buy box */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{formatIDR(price)}</span>
              {product.promoPrice !== undefined && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatIDR(product.price)}
                </span>
              )}
            </div>
            <div className="mt-3">
              <StockBadge stock={product.stock} lowAt={LOW_STOCK} />
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Jumlah</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Kurangi"
                  disabled={outOfStock || qty <= 1}
                  onClick={() => changeQty(-1)}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Tambah"
                  disabled={outOfStock || qty >= product.stock}
                  onClick={() => changeQty(1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold">{formatIDR(price * qty)}</span>
            </div>

            <div className="mt-5 grid gap-2">
              <Button size="lg" disabled={outOfStock} onClick={buyNow}>
                {outOfStock ? "Stok Habis" : "Beli Sekarang"}
              </Button>
              <Button size="lg" variant="secondary" disabled={outOfStock} onClick={addToCart}>
                <ShoppingCart className="mr-2 size-4" /> Tambah ke Keranjang
              </Button>
            </div>

            {outOfStock && (
              <p className="mt-3 text-xs text-muted-foreground">
                Stok sedang kosong. Stok biasanya diisi ulang setiap hari.
              </p>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold">Produk serupa</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
