export type CategorySlug =
  | "streaming"
  | "music"
  | "ai"
  | "vpn"
  | "gaming"
  | "software"
  | "voucher"
  | "membership"
  | "lainnya";

export type Badge = "Best Seller" | "Promo" | "New" | "Limited";

export type Product = {
  id: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  price: number;
  promoPrice?: number;
  duration: string;
  category: CategorySlug;
  stock: number;
  badges: Badge[];
  rating: number;
  reviewCount: number;
  sold: number;
  createdAt: string;
  benefits: string[];
  warranty: string;
  howTo: string[];
  terms: string[];
  logo: string;
};

export const categories: { slug: CategorySlug; name: string; icon: string }[] = [
  { slug: "streaming", name: "Streaming", icon: "MonitorPlay" },
  { slug: "music", name: "Music", icon: "Music" },
  { slug: "ai", name: "AI", icon: "Sparkles" },
  { slug: "vpn", name: "VPN", icon: "ShieldCheck" },
  { slug: "gaming", name: "Gaming", icon: "Gamepad2" },
  { slug: "software", name: "Software", icon: "AppWindow" },
  { slug: "voucher", name: "Voucher", icon: "Ticket" },
  { slug: "membership", name: "Membership", icon: "Crown" },
  { slug: "lainnya", name: "Lainnya", icon: "Boxes" },
];

const base = {
  benefits: [
    "Aktivasi cepat, data dikirim otomatis setelah pembayaran",
    "Kualitas terjamin dan siap pakai",
    "Bantuan admin via WhatsApp jika ada kendala",
  ],
  howTo: [
    "Selesaikan pembayaran QRIS pada halaman pembayaran.",
    "Data produk akan terbuka otomatis di halaman pesanan.",
    "Login memakai data yang diberikan, jangan ubah email/password.",
  ],
  terms: [
    "Tidak boleh mengubah data akun (email, password, profil utama).",
    "Wajib merekam video saat pemakaian pertama untuk klaim garansi.",
    "Garansi hangus jika terjadi pelanggaran ketentuan pemakaian.",
  ],
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "netflix-premium-1-bulan",
    name: "Netflix Premium 1 Bulan",
    short: "Sharing profil, kualitas 4K UHD",
    description:
      "Akses Netflix Premium dengan kualitas hingga 4K UHD. Sudah termasuk 1 profil privat yang bisa dipakai di HP, TV, maupun laptop.",
    price: 35000,
    promoPrice: 25000,
    duration: "30 hari",
    category: "streaming",
    stock: 8,
    badges: ["Best Seller", "Promo"],
    rating: 4.9,
    reviewCount: 214,
    sold: 1820,
    createdAt: "2026-08-02",
    warranty: "Garansi penuh 30 hari, replace jika akun bermasalah.",
    logo: "NF",
    ...base,
  },
  {
    id: "p2",
    slug: "spotify-premium-1-bulan",
    name: "Spotify Premium 1 Bulan",
    short: "Bebas iklan, unduh offline",
    description:
      "Upgrade akun Spotify pribadi Anda ke Premium. Bebas iklan, kualitas audio tinggi, dan bisa mendengarkan lagu secara offline.",
    price: 20000,
    promoPrice: 15000,
    duration: "30 hari",
    category: "music",
    stock: 12,
    badges: ["Best Seller"],
    rating: 4.8,
    reviewCount: 176,
    sold: 1440,
    createdAt: "2026-08-10",
    warranty: "Garansi 30 hari penuh.",
    logo: "SP",
    ...base,
  },
  {
    id: "p3",
    slug: "chatgpt-plus-1-bulan",
    name: "ChatGPT Plus 1 Bulan",
    short: "Model terbaru, respon prioritas",
    description:
      "Akun ChatGPT Plus siap pakai dengan akses model terbaru, limit lebih besar, dan respon lebih cepat pada jam sibuk.",
    price: 95000,
    promoPrice: 79000,
    duration: "30 hari",
    category: "ai",
    stock: 4,
    badges: ["Promo", "Limited"],
    rating: 4.7,
    reviewCount: 98,
    sold: 610,
    createdAt: "2026-09-01",
    warranty: "Garansi login 30 hari.",
    logo: "AI",
    ...base,
  },
  {
    id: "p4",
    slug: "youtube-premium-1-bulan",
    name: "YouTube Premium 1 Bulan",
    short: "Tanpa iklan + YouTube Music",
    description:
      "Undangan family plan YouTube Premium untuk email pribadi Anda. Tanpa iklan, background play, dan YouTube Music included.",
    price: 15000,
    duration: "30 hari",
    category: "streaming",
    stock: 25,
    badges: ["Best Seller"],
    rating: 4.9,
    reviewCount: 320,
    sold: 2510,
    createdAt: "2026-07-21",
    warranty: "Garansi 30 hari.",
    logo: "YT",
    ...base,
  },
  {
    id: "p5",
    slug: "nordvpn-premium-1-tahun",
    name: "NordVPN Premium 1 Tahun",
    short: "Koneksi cepat, multi device",
    description:
      "Akun NordVPN premium dengan masa aktif 1 tahun. Cocok untuk keamanan browsing dan akses konten global.",
    price: 120000,
    promoPrice: 89000,
    duration: "365 hari",
    category: "vpn",
    stock: 6,
    badges: ["Promo"],
    rating: 4.6,
    reviewCount: 64,
    sold: 380,
    createdAt: "2026-08-28",
    warranty: "Garansi replace 6 bulan.",
    logo: "VPN",
    ...base,
  },
  {
    id: "p6",
    slug: "steam-wallet-idr-60000",
    name: "Steam Wallet Rp60.000",
    short: "Kode voucher region Indonesia",
    description:
      "Kode Steam Wallet region Indonesia senilai Rp60.000. Langsung bisa ditukar di akun Steam Anda.",
    price: 65000,
    duration: "Sekali pakai",
    category: "voucher",
    stock: 30,
    badges: [],
    rating: 5,
    reviewCount: 41,
    sold: 290,
    createdAt: "2026-08-19",
    warranty: "Garansi kode valid saat penukaran pertama.",
    logo: "ST",
    ...base,
  },
  {
    id: "p7",
    slug: "canva-pro-1-tahun",
    name: "Canva Pro 1 Tahun",
    short: "Invite email pribadi",
    description:
      "Canva Pro untuk email pribadi Anda dengan masa aktif 1 tahun. Akses semua template, elemen premium, dan background remover.",
    price: 45000,
    promoPrice: 29000,
    duration: "365 hari",
    category: "software",
    stock: 18,
    badges: ["Promo", "Best Seller"],
    rating: 4.8,
    reviewCount: 152,
    sold: 990,
    createdAt: "2026-09-04",
    warranty: "Garansi 1 tahun full replace.",
    logo: "CV",
    ...base,
  },
  {
    id: "p8",
    slug: "mobile-legends-diamond-100",
    name: "Mobile Legends 100 Diamond",
    short: "Proses cepat via user ID",
    description:
      "Top up 100 Diamond Mobile Legends. Cukup kirimkan User ID dan Zone ID setelah pembayaran berhasil.",
    price: 28000,
    duration: "Sekali pakai",
    category: "gaming",
    stock: 0,
    badges: ["Best Seller"],
    rating: 4.9,
    reviewCount: 210,
    sold: 3120,
    createdAt: "2026-06-30",
    warranty: "Garansi jika diamond tidak masuk.",
    logo: "ML",
    ...base,
  },
  {
    id: "p9",
    slug: "disney-plus-hotstar-1-bulan",
    name: "Disney+ Hotstar 1 Bulan",
    short: "Sharing profil premium",
    description:
      "Disney+ Hotstar premium sharing dengan 1 profil khusus untuk Anda. Nikmati film Disney, Marvel, dan Star.",
    price: 22000,
    duration: "30 hari",
    category: "streaming",
    stock: 3,
    badges: ["Limited"],
    rating: 4.5,
    reviewCount: 57,
    sold: 420,
    createdAt: "2026-09-06",
    warranty: "Garansi 30 hari.",
    logo: "D+",
    ...base,
  },
  {
    id: "p10",
    slug: "capcut-pro-1-bulan",
    name: "CapCut Pro 1 Bulan",
    short: "Semua efek & template pro",
    description:
      "CapCut Pro untuk akun pribadi Anda. Semua efek, template, dan ekspor tanpa watermark terbuka.",
    price: 25000,
    promoPrice: 18000,
    duration: "30 hari",
    category: "software",
    stock: 14,
    badges: ["New", "Promo"],
    rating: 4.7,
    reviewCount: 44,
    sold: 260,
    createdAt: "2026-09-10",
    warranty: "Garansi 30 hari.",
    logo: "CC",
    ...base,
  },
  {
    id: "p11",
    slug: "rilzpedia-member-vip",
    name: "RILZPEDIA Member VIP",
    short: "Harga khusus seumur hidup",
    description:
      "Membership VIP RILZPEDIA. Dapatkan potongan harga khusus member untuk semua produk dan prioritas stok baru.",
    price: 50000,
    duration: "Lifetime",
    category: "membership",
    stock: 50,
    badges: ["New"],
    rating: 5,
    reviewCount: 22,
    sold: 130,
    createdAt: "2026-09-11",
    warranty: "Tanpa masa berlaku.",
    logo: "VIP",
    ...base,
  },
  {
    id: "p12",
    slug: "google-one-2tb-1-tahun",
    name: "Google One 2TB 1 Tahun",
    short: "Penyimpanan besar untuk email pribadi",
    description:
      "Google One 2TB untuk email pribadi Anda selama 1 tahun. Cocok untuk backup foto, dokumen, dan project besar.",
    price: 90000,
    promoPrice: 69000,
    duration: "365 hari",
    category: "lainnya",
    stock: 5,
    badges: ["Promo"],
    rating: 4.6,
    reviewCount: 33,
    sold: 180,
    createdAt: "2026-08-24",
    warranty: "Garansi 1 tahun.",
    logo: "G1",
    ...base,
  },
];

export const LOW_STOCK = 5;

export const formatIDR = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(value)
    .replace(/\s/g, "");

export const finalPrice = (p: Product) => p.promoPrice ?? p.price;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const reviews = [
  {
    name: "Dimas A.",
    product: "Netflix Premium",
    rating: 5,
    text: "Ordernya cepat banget, bayar QRIS langsung dapat akunnya. Recommended!",
  },
  {
    name: "Sarah P.",
    product: "Canva Pro 1 Tahun",
    rating: 5,
    text: "Harga paling murah dan aman. Sudah 3 kali beli di RILZPEDIA.",
  },
  {
    name: "Rafi H.",
    product: "ChatGPT Plus",
    rating: 4,
    text: "Akun normal, adminnya fast respon waktu saya tanya cara login.",
  },
  {
    name: "Nadia S.",
    product: "Spotify Premium",
    rating: 5,
    text: "Prosesnya otomatis, gak perlu nunggu admin online. Puas!",
  },
];

export const faqs = [
  {
    q: "Berapa lama produk dikirim setelah pembayaran?",
    a: "Otomatis dalam hitungan detik. Setelah pembayaran QRIS terverifikasi, data produk langsung terbuka di halaman pesanan Anda.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Saat ini kami memakai QRIS, sehingga bisa dibayar dari semua e-wallet dan mobile banking di Indonesia.",
  },
  {
    q: "Apakah produk bergaransi?",
    a: "Ya. Setiap produk memiliki masa garansi yang tertulis pada halaman detail produk. Klaim dilakukan melalui halaman Bantuan.",
  },
  {
    q: "Bagaimana kalau stok habis?",
    a: "Produk dengan stok habis tidak bisa dibeli. Stok biasanya diisi ulang setiap hari, jadi silakan cek kembali nanti.",
  },
  {
    q: "Saya lupa Order ID, bagaimana cek pesanan?",
    a: "Login ke akun Anda untuk melihat semua riwayat pesanan, atau hubungi kami dengan menyertakan email pembelian.",
  },
];
