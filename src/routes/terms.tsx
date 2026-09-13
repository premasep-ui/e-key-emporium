import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Syarat & Ketentuan — RILZPEDIA" },
      {
        name: "description",
        content:
          "Syarat dan ketentuan penggunaan layanan serta pembelian produk digital di RILZPEDIA.",
      },
      { property: "og:title", content: "Syarat & Ketentuan — RILZPEDIA" },
      { property: "og:description", content: "Aturan penggunaan layanan RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "1. Ketentuan umum",
    body: "Dengan menggunakan RILZPEDIA, Anda setuju untuk mematuhi seluruh ketentuan pada halaman ini. Kami dapat memperbarui ketentuan sewaktu-waktu dan perubahan berlaku sejak dipublikasikan.",
  },
  {
    title: "2. Produk yang dijual",
    body: "RILZPEDIA hanya menjual produk digital yang memang berhak didistribusikan oleh pemilik toko, seperti voucher resmi, lisensi, dan membership. Kami tidak memperjualbelikan akses yang diperoleh secara ilegal.",
  },
  {
    title: "3. Pembelian dan pembayaran",
    body: "Pesanan dianggap sah setelah pembayaran diterima dan diverifikasi oleh penyedia pembayaran. Nominal pembayaran harus sesuai dengan yang tertera pada invoice.",
  },
  {
    title: "4. Pengiriman produk",
    body: "Produk digital dikirim otomatis setelah pembayaran terverifikasi. Data sensitif hanya ditampilkan pada halaman pesanan milik pembeli.",
  },
  {
    title: "5. Garansi dan klaim",
    body: "Masa garansi setiap produk tertera pada halaman detail produk. Klaim wajib disertai bukti dan dilakukan dalam masa garansi. Garansi hangus jika terjadi pelanggaran aturan pemakaian.",
  },
  {
    title: "6. Larangan",
    body: "Pembeli dilarang menjual ulang tanpa izin, mengubah data akun, atau memakai produk untuk aktivitas melanggar hukum.",
  },
  {
    title: "7. Batas tanggung jawab",
    body: "RILZPEDIA tidak bertanggung jawab atas kerugian akibat kelalaian pembeli, termasuk kehilangan data akses karena diubah sendiri oleh pembeli.",
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Syarat &amp; Ketentuan</h1>
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
