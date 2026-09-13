import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Masuk Akun — RILZPEDIA" },
      {
        name: "description",
        content: "Masuk ke akun RILZPEDIA untuk melihat riwayat pesanan dan produk digital Anda.",
      },
      { property: "og:title", content: "Masuk Akun — RILZPEDIA" },
      { property: "og:description", content: "Masuk ke akun toko digital RILZPEDIA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const soon = () =>
    toast.info("Sistem akun belum aktif", {
      description: "Login akan berfungsi setelah bagian akun & database dipasang.",
    });

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Daftar gratis
        </Link>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          soon();
        }}
        className="mt-6 rounded-2xl border border-border bg-card p-5"
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Lupa password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-5 w-full">
          Masuk
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> atau <span className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="secondary" size="lg" className="w-full" onClick={soon}>
          Masuk dengan Google
        </Button>
      </form>
    </div>
  );
}
