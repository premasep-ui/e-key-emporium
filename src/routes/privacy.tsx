import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Kebijakan Privasi — RILZPEDIA" },
      {
        name: "description",
        content:
          "Cara RILZPEDIA mengumpulkan, memakai, dan melindungi data pribadi pelanggan toko digital.",
      },
      { property: "og:title", content: "Kebijakan Privasi — RILZPEDIA" },
      { property: "og:description", content: "Perlindungan data pribadi pelanggan RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "Data yang kami kumpulkan",
    body: "Nama, email, nomor WhatsApp, dan riwayat pesanan. Data pembayaran diproses langsung oleh penyedia pembayaran, bukan disimpan di server kami.",
  },
  {
    title: "Cara kami memakai data",
    body: "Data dipakai untuk memproses pesanan, mengirim produk digital, memberikan bantuan, dan mengirim informasi promo bila Anda menyetujuinya.",
  },
  {
    title: "Pembagian data",
    body: "Kami tidak menjual data Anda. Data hanya dibagikan kepada penyedia pembayaran dan pengiriman notifikasi sejauh diperlukan untuk memproses pesanan.",
  },
  {
    title: "Keamanan",
    body: "Kredensial dan kunci rahasia disimpan di sisi server. Data akses produk hanya ditampilkan setelah pembayaran terverifikasi dan hanya kepada pemilik pesanan.",
  },
  {
    title: "Hak Anda",
    body: "Anda dapat meminta salinan, perbaikan, atau penghapusan data pribadi Anda dengan menghubungi support@rilzpedia.id.",
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Kebijakan Privasi</h1>
      <p className="mt-1 text-sm text-muted-foreground">Terakhir diperbarui: September 2026</p>
      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-base font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
