"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/components/CartProvider";
import { parsePriceToCents } from "@/lib/parsePrice";
import "./product-cart-button.css";
import IonIcon from "@/components/IonIcon";

export default function ProductCartButton({ product }: {
  product: { id: number; name: string; price: string; images?: string[] };
}) {
  const t = useTranslations("products");
  const { addItem } = useCart();
  const cents = parsePriceToCents(product.price);
  return (
    <button
      type="button"
      className="product-image-cart-button"
      aria-label={`${t("addToCart")}: ${product.name}`}
      title={t("addToCart")}
      disabled={cents == null}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (cents == null) return;
        addItem({ productId: product.id, name: product.name, priceLabel: product.price,
          unitAmountCents: cents, image: product.images?.[0], quantity: 1 });
      }}
    >
      <IonIcon name="cart-outline" size={24} />
    </button>
  );
}
