import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Kebijakan Refund — RILZPEDIA" },
      {
        name: "description",
        content:
          "Ketentuan pengembalian dana dan penggantian produk digital yang dibeli di RILZPEDIA.",
      },
      { property: "og:title", content: "Kebijakan Refund — RILZPEDIA" },
      { property: "og:description", content: "Aturan refund dan replace produk digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefundPage,
});

const sections = [
  {
    title: "Refund karena stok tidak tersedia",
    body: "Jika pembayaran berhasil namun stok ternyata tidak tersedia, dana dikembalikan 100% atau diganti produk lain sesuai pilihan Anda.",
  },
  {
    title: "Penggantian (replace)",
    body: "Produk bermasalah dalam masa garansi akan diganti dengan unit baru. Replace adalah solusi utama sebelum refund.",
  },
  {
    title: "Refund tidak berlaku",
    body: "Refund tidak berlaku jika data akses sudah dipakai dan diubah sendiri oleh pembeli, atau jika pembeli melanggar ketentuan pemakaian produk.",
  },
  {
    title: "Waktu proses",
    body: "Permintaan refund yang disetujui diproses dalam 1×24 jam kerja ke rekening atau e-wallet pembeli.",
  },
];

function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Kebijakan Refund</h1>
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
