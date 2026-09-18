"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import IonIcon from "@/components/IonIcon";
import { useCart } from "@/components/CartProvider";
import { parsePriceToCents } from "@/lib/parsePrice";
import { MAX_CART_QTY } from "@/lib/cart";

type AddToCartButtonProps = {
  productId: number;
  name: string;
  price: string;
  image?: string;
  quantity?: number;
};

export default function AddToCartButton({
  productId,
  name,
  price,
  image,
  quantity = 1,
}: AddToCartButtonProps) {
  const t = useTranslations("products");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const unitAmountCents = parsePriceToCents(price);
  const canAdd = unitAmountCents != null;

  const handleAdd = () => {
    if (!canAdd || unitAmountCents == null) return;
    addItem({
      productId,
      name,
      priceLabel: price,
      unitAmountCents,
      image,
      quantity: Math.min(MAX_CART_QTY, Math.max(1, quantity)),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      type="button"
      className="contact-btn contact-btn-cart"
      onClick={handleAdd}
      disabled={!canAdd}
    >
      <IonIcon name="bag-handle-outline" size={18} />
      {added ? t("addedToCart") : t("addToCart")}
    </button>
  );
}
