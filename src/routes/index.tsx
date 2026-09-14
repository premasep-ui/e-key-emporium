import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  Clock,
  Headphones,
  MonitorPlay,
  Music,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
  Gamepad2,
  AppWindow,
  Ticket,
  Crown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/site/ProductCard";
import { categories, faqs, finalPrice, formatIDR, products, reviews } from "@/lib/catalog";
import { productImage } from "@/lib/product-images";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RILZPEDIA — Toko Produk Digital Murah & Otomatis 24 Jam" },
      {
        name: "description",
        content:
          "Beli akun premium, voucher, lisensi, dan membership digital di RILZPEDIA. Bayar QRIS, produk terkirim otomatis dalam hitungan detik.",
      },
      { property: "og:title", content: "RILZPEDIA — Toko Produk Digital Otomatis" },
      {
        property: "og:description",
        content: "Akun premium, voucher, dan lisensi digital dengan pengiriman otomatis 24 jam.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  MonitorPlay,
  Music,
  Sparkles,
  ShieldCheck,
  Gamepad2,
  AppWindow,
  Ticket,
  Crown,
  Boxes,
};

type SectionDecor = "glow" | "shapes" | "gradient" | "grid" | "none";

function SectionDecoration({ decor }: { decor: SectionDecor }) {
  if (decor === "none") return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {decor === "glow" && (
        <div className="decor-orb animate-glow-pulse absolute left-1/4 top-0 size-[360px] opacity-45" />
      )}
      {decor === "shapes" && (
        <>
          <div className="animate-float absolute right-[6%] top-2 size-20 rotate-45 rounded-xl border border-primary/15" />
          <div className="animate-drift absolute left-[4%] bottom-0 size-28 rounded-full border border-white/[0.06]" />
        </>
      )}
      {decor === "gradient" && (
        <div className="decor-orb animate-drift absolute right-[10%] top-6 size-[380px] opacity-35" />
      )}
      {decor === "grid" && <div className="bg-line-grid decor-fade-mask absolute inset-0 opacity-60" />}
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  decor = "none",
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  decor?: SectionDecor;
  children: React.ReactNode;
}) {
  return (
    <section className="relative mx-auto mt-14 max-w-6xl px-4">
      <SectionDecoration decor={decor} />
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const popular = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const latest = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  const inStock = products.filter((p) => p.stock > 0).slice(0, 4);
  const promos = products.filter((p) => p.promoPrice !== undefined).slice(0, 3);

  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="bg-hero-grid relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-line-grid decor-fade-mask absolute inset-0" />
          <div className="decor-orb animate-glow-pulse absolute left-1/2 top-[-220px] size-[560px] -translate-x-1/2" />
          <div className="animate-float absolute left-[8%] top-[22%] size-16 rotate-12 rounded-2xl border border-primary/20 bg-primary/5" />
          <div className="animate-drift absolute right-[10%] bottom-[14%] size-24 rounded-full border border-white/10" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="size-3.5" /> Pengiriman otomatis 24 jam
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Produk digital premium, <span className="text-gradient">harga santai</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Akun premium, voucher, lisensi, dan membership resmi. Bayar pakai QRIS, produk langsung
            terkirim otomatis tanpa menunggu admin.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/products", search: { q: q || undefined } });
            }}
            className="mx-auto mt-7 flex max-w-xl gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari Netflix, Spotify, ChatGPT..."
                aria-label="Cari produk"
                className="h-12 rounded-xl pl-9"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-xl">
              Cari
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary" /> Bergaransi
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-primary" /> Proses instan
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 text-warning" /> 4.9 dari 1.200+ ulasan
            </span>
          </div>
        </div>
      </section>

      {/* Kategori */}
      <Section title="Kategori" subtitle="Pilih kebutuhan digital Anda">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {categories.map((c) => {
            const Icon = icons[c.icon] ?? Boxes;
            return (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="card-hover flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center"
              >
                <Icon className="size-5 text-primary" />
                <span className="text-xs font-medium">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Promo */}
      <Section title="Promo hari ini" subtitle="Hemat lebih banyak, stok terbatas">
        <div className="grid gap-3 sm:grid-cols-3">
          {promos.map((p) => {
            const off = Math.round((1 - finalPrice(p) / p.price) * 100);
            return (
              <Link
                key={p.id}
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="card-hover flex items-center gap-3 rounded-2xl border border-primary/25 bg-card p-4"
              >
                <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 font-display font-bold text-primary">
                  {productImage(p.slug) ? (
                    <img
                      src={productImage(p.slug)}
                      alt={`Gambar aplikasi ${p.name}`}
                      loading="lazy"
                      width={512}
                      height={512}
                      className="size-10 object-contain"
                    />
                  ) : (
                    p.logo
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="line-through">{formatIDR(p.price)}</span>{" "}
                    <span className="font-semibold text-primary">{formatIDR(finalPrice(p))}</span>
                  </p>
                </div>
                <span className="ml-auto flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-1 text-xs font-bold text-destructive">
                  <BadgePercent className="size-3" /> {off}%
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Populer */}
      <Section
        title="Produk populer"
        subtitle="Paling banyak dibeli pelanggan"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to="/products">
              Lihat semua <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Terbaru */}
      <Section title="Produk terbaru" subtitle="Baru masuk di RILZPEDIA">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Ready stock */}
      <Section title="Siap kirim sekarang" subtitle="Stok tersedia, langsung proses otomatis">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {inStock.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Keunggulan */}
      <Section title="Kenapa belanja di RILZPEDIA?">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Zap,
              title: "Otomatis 24 jam",
              text: "Data produk terbuka sendiri setelah pembayaran terverifikasi.",
            },
            {
              icon: ShieldCheck,
              title: "Bergaransi",
              text: "Setiap produk punya masa garansi yang jelas dan bisa diklaim.",
            },
            {
              icon: BadgePercent,
              title: "Harga bersaing",
              text: "Promo rutin dan harga khusus untuk member VIP.",
            },
            {
              icon: Headphones,
              title: "Admin responsif",
              text: "Tim bantuan siap membantu lewat WhatsApp setiap hari.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-5">
              <f.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Ulasan */}
      <Section title="Kata pelanggan" subtitle="Ulasan asli dari pembeli RILZPEDIA">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-warning text-warning" />
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">"{r.text}"</p>
              <p className="mt-3 text-xs font-semibold">
                {r.name} <span className="font-normal text-muted-foreground">• {r.product}</span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Pertanyaan yang sering ditanya">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-4">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </div>
  );
}
