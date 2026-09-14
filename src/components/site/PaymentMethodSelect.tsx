import { QrCode, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "qris" | "paypal";

const methods: {
  id: PaymentMethod;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: "qris",
    name: "QRIS",
    desc: "Bayar dengan QRIS — semua e-wallet & mobile banking (Rupiah).",
    icon: QrCode,
  },
  {
    id: "paypal",
    name: "PayPal",
    desc: "Bayar dengan saldo PayPal atau kartu internasional.",
    icon: Wallet,
  },
];

export function PaymentMethodSelect({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  return (
    <fieldset>
      <legend className="font-semibold">Pilih metode pembayaran</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {methods.map((m) => {
          const active = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              aria-pressed={active}
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-primary/40",
                active
                  ? "border-primary/60 bg-primary/10 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card/70",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                  active ? "bg-primary/20 text-primary" : "bg-accent/50 text-muted-foreground",
                )}
              >
                <m.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{m.name}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{m.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
