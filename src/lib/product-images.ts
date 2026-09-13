import netflix from "@/assets/products/netflix-premium-1-bulan.png";
import spotify from "@/assets/products/spotify-premium-1-bulan.png";
import chatgpt from "@/assets/products/chatgpt-plus-1-bulan.png";
import youtube from "@/assets/products/youtube-premium-1-bulan.png";
import nordvpn from "@/assets/products/nordvpn-premium-1-tahun.png";
import steam from "@/assets/products/steam-wallet-idr-60000.png";
import canva from "@/assets/products/canva-pro-1-tahun.png";
import mlbb from "@/assets/products/mobile-legends-diamond-100.png";
import disney from "@/assets/products/disney-plus-hotstar-1-bulan.png";
import capcut from "@/assets/products/capcut-pro-1-bulan.png";
import vip from "@/assets/products/rilzpedia-member-vip.png";
import googleOne from "@/assets/products/google-one-2tb-1-tahun.png";

/** Gambar aplikasi per produk (key = slug produk). */
export const productImages: Record<string, string> = {
  "netflix-premium-1-bulan": netflix,
  "spotify-premium-1-bulan": spotify,
  "chatgpt-plus-1-bulan": chatgpt,
  "youtube-premium-1-bulan": youtube,
  "nordvpn-premium-1-tahun": nordvpn,
  "steam-wallet-idr-60000": steam,
  "canva-pro-1-tahun": canva,
  "mobile-legends-diamond-100": mlbb,
  "disney-plus-hotstar-1-bulan": disney,
  "capcut-pro-1-bulan": capcut,
  "rilzpedia-member-vip": vip,
  "google-one-2tb-1-tahun": googleOne,
};

export const productImage = (slug: string): string | undefined => productImages[slug];
