import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Produk" },
  { to: "/categories", label: "Kategori" },
  { to: "/cek-pesanan", label: "Cek Pesanan" },
  { to: "/faq", label: "Bantuan" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { count } = useCart();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q: q || undefined } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
            R
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            RILZ<span className="text-primary">PEDIA</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground bg-accent/60" }}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submit} className="hidden lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk..."
                aria-label="Cari produk"
                className="w-56 pl-9"
              />
            </div>
          </form>

          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart" aria-label="Keranjang">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/login">
              <User className="mr-1 size-4" /> Masuk
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-3 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk..."
                aria-label="Cari produk"
                className="pl-9"
              />
            </div>
          </form>
          <nav className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              Masuk / Daftar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
