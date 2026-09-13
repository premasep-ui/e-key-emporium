import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/lib/catalog";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Kategori Produk Digital — RILZPEDIA" },
      {
        name: "description",
        content:
          "Telusuri kategori produk digital RILZPEDIA: streaming, music, AI, VPN, gaming, software, voucher, membership, dan lainnya.",
      },
      { property: "og:title", content: "Kategori Produk Digital — RILZPEDIA" },
      { property: "og:description", content: "Semua kategori produk digital di RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Kategori</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pilih kategori untuk melihat produk di dalamnya.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          const ready = products.filter((p) => p.category === c.slug && p.stock > 0).length;
          return (
            <Link
              key={c.slug}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="card-hover rounded-2xl border border-border bg-card p-5"
            >
              <h2 className="font-semibold">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {count} produk • {ready} siap kirim
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
