import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Daftar Akun — RILZPEDIA" },
      {
        name: "description",
        content: "Buat akun RILZPEDIA gratis untuk menyimpan riwayat pesanan dan invoice Anda.",
      },
      { property: "og:title", content: "Daftar Akun — RILZPEDIA" },
      { property: "og:description", content: "Daftar akun toko digital RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", wa: "", password: "" });

  const soon = () =>
    toast.info("Pendaftaran belum aktif", {
      description: "Akan berfungsi setelah bagian akun & database dipasang.",
    });

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-bold">Daftar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Masuk di sini
        </Link>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          soon();
        }}
        className="mt-6 grid gap-4 rounded-2xl border border-border bg-card p-5"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama lengkap</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="wa">Nomor WhatsApp</Label>
          <Input
            id="wa"
            inputMode="tel"
            value={form.wa}
            onChange={(e) => setForm({ ...form, wa: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" size="lg" className="mt-1 w-full">
          Buat Akun
        </Button>
        <Button type="button" variant="secondary" size="lg" className="w-full" onClick={soon}>
          Daftar dengan Google
        </Button>
      </form>
    </div>
  );
}
