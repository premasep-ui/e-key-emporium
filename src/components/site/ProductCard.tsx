import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { finalPrice, formatIDR, LOW_STOCK, type Product } from "@/lib/catalog";
import { productImage } from "@/lib/product-images";
import { StockBadge } from "./StockBadge";

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-primary/15 text-primary border-primary/30",
  Promo: "bg-destructive/15 text-destructive border-destructive/30",
  New: "bg-success/15 text-success border-success/30",
  Limited: "bg-warning/15 text-warning border-warning/30",
};

export function ProductCard({ product }: { product: Product }) {
  const price = finalPrice(product);
  const discounted = product.promoPrice !== undefined;
  const img = productImage(product.slug);

  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/75 shadow-[var(--shadow-card)] backdrop-blur-sm"
    >
      <div className="bg-dot-grid relative flex h-28 items-center justify-center border-b border-border bg-accent/40">
        {img ? (
          <img
            src={img}
            alt={`Gambar aplikasi ${product.name}`}
            loading="lazy"
            width={512}
            height={512}
            className="size-20 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-3xl font-bold text-gradient">{product.logo}</span>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeStyles[b]}`}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{product.duration}</p>

        <div className="mt-auto space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary">{formatIDR(price)}</span>
            {discounted && (
              <span className="text-xs text-muted-foreground line-through">
                {formatIDR(product.price)}
              </span>
            )}
          </div>
          <StockBadge stock={product.stock} lowAt={LOW_STOCK} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3 fill-warning text-warning" />
            {product.rating.toFixed(1)}
            <span className="opacity-60">• {product.sold} terjual</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
