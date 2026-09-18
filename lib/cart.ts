export type CartItem = {
  productId: number;
  name: string;
  priceLabel: string;
  unitAmountCents: number;
  image?: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "vso-clinic-cart-v1";
export const MAX_CART_QTY = 20;

export function formatEur(cents: number) {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  } catch {
    return `€${(cents / 100).toFixed(2)}`;
  }
}

export function cartSubtotalCents(items: CartItem[]) {
  return items.reduce(
    (sum, item) => sum + item.unitAmountCents * item.quantity,
    0
  );
}

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
