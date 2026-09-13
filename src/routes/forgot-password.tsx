import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Lupa Password — RILZPEDIA" },
      {
        name: "description",
        content: "Atur ulang password akun RILZPEDIA Anda melalui email terdaftar.",
      },
      { property: "og:title", content: "Lupa Password — RILZPEDIA" },
      { property: "og:description", content: "Atur ulang password akun RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-bold">Lupa Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Kami akan mengirim tautan untuk membuat password baru.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.info("Fitur ini belum aktif", {
            description: "Akan berfungsi setelah bagian akun dipasang.",
          });
        }}
        className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-5"
      >
        <div className="grid gap-2">
          <Label htmlFor="email">Email terdaftar</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@contoh.com"
            required
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Kirim Tautan Reset
        </Button>
        <Link to="/login" className="text-center text-sm text-primary hover:underline">
          Kembali ke halaman masuk
        </Link>
      </form>
    </div>
  );
}
