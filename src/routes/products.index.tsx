import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PackageSearch, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, finalPrice, products } from "@/lib/catalog";

export type ProductSearch = {
  q?: string | undefined;
  cat?: string | undefined;
  sort?: string | undefined;
  stock?: string | undefined;
};

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: str(search["q"]),
    cat: str(search["cat"]),
    sort: str(search["sort"]),
    stock: str(search["stock"]),
  }),
  head: () => ({
    meta: [
      { title: "Semua Produk Digital — RILZPEDIA" },
      {
        name: "description",
        content:
          "Katalog lengkap produk digital RILZPEDIA: streaming, music, AI, VPN, gaming, software, voucher, dan membership.",
      },
      { property: "og:title", content: "Semua Produk Digital — RILZPEDIA" },
      {
        property: "og:description",
        content: "Cari dan urutkan produk digital termurah dengan stok realtime.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q = "", cat = "all", sort = "populer", stock = "all" } = Route.useSearch();
  const navigate = Route.useNavigate();

  const setSearch = (patch: Partial<ProductSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const list = useMemo(() => {
    let items = products.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.short.toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "all" || p.category === cat;
      const matchStock =
        stock === "all" || (stock === "ready" ? p.stock > 0 : p.stock === 0);
      return matchQ && matchCat && matchStock;
    });

    items = [...items].sort((a, b) => {
      if (sort === "termurah") return finalPrice(a) - finalPrice(b);
      if (sort === "termahal") return finalPrice(b) - finalPrice(a);
      if (sort === "terbaru") return b.createdAt.localeCompare(a.createdAt);
      return b.sold - a.sold;
    });

    return items;
  }, [q, cat, sort, stock]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Semua Produk</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {list.length} produk ditemukan{q ? ` untuk "${q}"` : ""}.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setSearch({ q: e.target.value || undefined })}
            placeholder="Cari produk..."
            aria-label="Cari produk"
            className="pl-9"
          />
        </div>

        <Select value={cat} onValueChange={(v) => setSearch({ cat: v === "all" ? undefined : v })}>
          <SelectTrigger aria-label="Kategori">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stock}
          onValueChange={(v) => setSearch({ stock: v === "all" ? undefined : v })}
        >
          <SelectTrigger aria-label="Status stok">
            <SelectValue placeholder="Stok" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua stok</SelectItem>
            <SelectItem value="ready">Stok tersedia</SelectItem>
            <SelectItem value="empty">Stok habis</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => setSearch({ sort: v === "populer" ? undefined : v })}
        >
          <SelectTrigger aria-label="Urutkan">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="populer">Terlaris</SelectItem>
            <SelectItem value="terbaru">Terbaru</SelectItem>
            <SelectItem value="termurah">Harga termurah</SelectItem>
            <SelectItem value="termahal">Harga tertinggi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center">
          <PackageSearch className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">Produk tidak ditemukan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba kata kunci lain atau ubah filter kategori.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => navigate({ search: {} })}
          >
            Reset filter
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
