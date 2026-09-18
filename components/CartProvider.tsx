"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  MAX_CART_QTY,
  cartItemCount,
  cartSubtotalCents,
  type CartItem,
} from "@/lib/cart";

type AddItemInput = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  note: string;
  isOpen: boolean;
  itemCount: number;
  subtotalCents: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: AddItemInput) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  setNote: (note: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): { items: CartItem[]; note: string } {
  if (typeof window === "undefined") return { items: [], note: "" };
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [], note: "" };
    const parsed = JSON.parse(raw) as { items?: CartItem[]; note?: string };
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      note: typeof parsed.note === "string" ? parsed.note : "",
    };
  } catch {
    return { items: [], note: "" };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [note, setNoteState] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadCart();
    setItems(data.items);
    setNoteState(data.note);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items, note })
    );
  }, [items, note, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const addItem = useCallback((item: AddItemInput) => {
    const qty = Math.min(MAX_CART_QTY, Math.max(1, item.quantity ?? 1));
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? {
                ...p,
                quantity: Math.min(MAX_CART_QTY, p.quantity + qty),
                name: item.name,
                priceLabel: item.priceLabel,
                unitAmountCents: item.unitAmountCents,
                image: item.image ?? p.image,
              }
            : p
        );
      }
      return [
        ...prev,
        {
          productId: item.productId,
          name: item.name,
          priceLabel: item.priceLabel,
          unitAmountCents: item.unitAmountCents,
          image: item.image,
          quantity: qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    const next = Math.min(MAX_CART_QTY, Math.max(0, quantity));
    setItems((prev) => {
      if (next <= 0) return prev.filter((p) => p.productId !== productId);
      return prev.map((p) =>
        p.productId === productId ? { ...p, quantity: next } : p
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setNoteState("");
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      note,
      isOpen,
      itemCount: cartItemCount(items),
      subtotalCents: cartSubtotalCents(items),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
      addItem,
      removeItem,
      setQuantity,
      setNote: setNoteState,
      clearCart,
    }),
    [items, note, isOpen, addItem, removeItem, setQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
