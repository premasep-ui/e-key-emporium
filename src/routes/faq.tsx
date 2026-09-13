import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/catalog";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Bantuan & FAQ — RILZPEDIA" },
      {
        name: "description",
        content:
          "Pertanyaan umum seputar pembelian produk digital, pembayaran QRIS, garansi, dan klaim di RILZPEDIA.",
      },
      { property: "og:title", content: "Bantuan & FAQ — RILZPEDIA" },
      { property: "og:description", content: "Jawaban cepat untuk pertanyaan pelanggan RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Bantuan &amp; FAQ</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Belum menemukan jawabannya? Hubungi admin kami lewat WhatsApp atau email.
      </p>

      <Accordion
        type="single"
        collapsible
        className="mt-6 rounded-2xl border border-border bg-card px-4"
      >
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <MessageCircle className="size-5 text-primary" />
          <h2 className="mt-3 text-sm font-semibold">WhatsApp admin</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Respon tercepat, aktif setiap hari 08.00–22.00 WIB.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Mail className="size-5 text-primary" />
          <h2 className="mt-3 text-sm font-semibold">support@rilzpedia.id</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Untuk klaim garansi dan pertanyaan invoice.
          </p>
        </div>
      </div>

      <Button asChild variant="secondary" className="mt-6">
        <Link to="/cek-pesanan">Cek status pesanan saya</Link>
      </Button>
    </div>
  );
}
