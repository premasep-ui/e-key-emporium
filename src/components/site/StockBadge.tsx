import { AlertTriangle, PackageCheck, PackageX } from "lucide-react";

export function StockBadge({ stock, lowAt = 5 }: { stock: number; lowAt?: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2 py-1 text-[11px] font-semibold text-destructive">
        <PackageX className="size-3" /> STOK HABIS
      </span>
    );
  }
  if (stock <= lowAt) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-2 py-1 text-[11px] font-semibold text-warning">
        <AlertTriangle className="size-3" /> STOK MENIPIS: {stock} tersedia
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-1 text-[11px] font-semibold text-success">
      <PackageCheck className="size-3" /> STOK: {stock} tersedia
    </span>
  );
}
