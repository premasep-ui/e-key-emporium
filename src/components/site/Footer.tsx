import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-xs font-bold text-primary-foreground">
              R
            </span>
            <span className="font-display font-extrabold">
              RILZ<span className="text-primary">PEDIA</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Toko produk digital resmi dengan proses otomatis 24 jam. Pembayaran QRIS, produk
            terkirim dalam hitungan detik.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Navigasi</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/products" className="hover:text-foreground">
                Semua Produk
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-foreground">
                Kategori
              </Link>
            </li>
            <li>
              <Link to="/cek-pesanan" className="hover:text-foreground">
                Cek Pesanan
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-foreground">
                Bantuan / FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/terms" className="hover:text-foreground">
                Syarat &amp; Ketentuan
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link to="/refund" className="hover:text-foreground">
                Kebijakan Refund
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Kontak</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 text-primary" /> WhatsApp admin
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> support@rilzpedia.id
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4 text-primary" /> @rilzpedia
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RILZPEDIA. Seluruh produk dijual sesuai ketentuan penggunaan
        yang berlaku.
      </div>
    </footer>
  );
}
