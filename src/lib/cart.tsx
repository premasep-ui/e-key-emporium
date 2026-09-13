import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { finalPrice, getProduct } from "./catalog";

export type CartItem = { slug: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rilzpedia.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupt cart */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const add = useCallback((slug: string, qty = 1) => {
    const product = getProduct(slug);
    if (!product || product.stock === 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      const nextQty = Math.min(product.stock, (existing?.qty ?? 0) + qty);
      return existing
        ? prev.map((i) => (i.slug === slug ? { ...i, qty: nextQty } : i))
        : [...prev, { slug, qty: nextQty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const product = getProduct(slug);
    if (!product) return;
    const clamped = Math.max(1, Math.min(product.stock, qty));
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: clamped } : i)));
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => {
      const product = getProduct(i.slug);
      return product ? sum + finalPrice(product) * i.qty : sum;
    }, 0);
    return { items, count, subtotal, add, setQty, remove, clear };
  }, [items, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
