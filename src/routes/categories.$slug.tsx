import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { getCategory, products } from "@/lib/catalog";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Kategori tidak ditemukan — RILZPEDIA" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `Produk ${loaderData.category.name} Murah — RILZPEDIA`;
    const desc = `Daftar produk digital kategori ${loaderData.category.name} dengan stok realtime dan pengiriman otomatis.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-xl font-bold">Kategori tidak ditemukan</h1>
      <Button asChild className="mt-5">
        <Link to="/categories">Lihat semua kategori</Link>
      </Button>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = products.filter((p) => p.category === category.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-xs text-muted-foreground">
        <Link to="/categories" className="hover:text-foreground">
          Kategori
        </Link>{" "}
        / <span className="text-foreground">{category.name}</span>
      </nav>
      <h1 className="mt-4 text-2xl font-bold">{category.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{list.length} produk tersedia.</p>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <h2 className="font-semibold">Belum ada produk di kategori ini</h2>
          <Button asChild className="mt-4" variant="secondary">
            <Link to="/products">Lihat semua produk</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
