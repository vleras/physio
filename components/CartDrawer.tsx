"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import IonIcon from "@/components/IonIcon";
import { useCart } from "@/components/CartProvider";
import { formatEur } from "@/lib/cart";
import { useProducts } from "@/hooks/useProducts";
import { type Locale } from "@/lib/getProducts";
import { parsePriceToCents } from "@/lib/parsePrice";
import "./cart-drawer.css";

export default function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const {
    items,
    isOpen,
    itemCount,
    subtotalCents,
    closeCart,
    removeItem,
    setQuantity,
    addItem,
    clearCart,
  } = useCart();
  const { data: products = [] } = useProducts(locale);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [suggestIndex, setSuggestIndex] = useState(0);

  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId));
    return products
      .filter((p) => !inCart.has(p.id) && parsePriceToCents(p.price) != null)
      .slice(0, 8);
  }, [products, items]);

  useEffect(() => {
    if (suggestIndex >= suggestions.length) setSuggestIndex(0);
  }, [suggestions.length, suggestIndex]);

  const suggestion = suggestions[suggestIndex] ?? null;

  const handleCheckout = async () => {
    if (!items.length || checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error(data.error || t("checkoutError"));
        return;
      }
      clearCart();
      closeCart();
      window.location.href = data.url;
    } catch {
      toast.error(t("checkoutError"));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const addSuggestion = () => {
    if (!suggestion) return;
    const cents = parsePriceToCents(suggestion.price);
    if (cents == null) return;
    addItem({
      productId: suggestion.id,
      name: suggestion.name,
      priceLabel: suggestion.price,
      unitAmountCents: cents,
      image: suggestion.images?.[0],
      quantity: 1,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-root" role="dialog" aria-modal="true" aria-label={t("title")}>
      <button
        type="button"
        className="cart-drawer-backdrop"
        aria-label={t("close")}
        onClick={closeCart}
      />
      <aside className="cart-drawer-panel">
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            {t("title")}
            {itemCount > 0 ? (
              <sup className="cart-drawer-count">{itemCount}</sup>
            ) : null}
          </h2>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label={t("close")}
          >
            ×
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-drawer-empty">
              <p>{t("empty")}</p>
              <Link href="/products" className="cart-drawer-link" onClick={closeCart}>
                {t("browseProducts")}
              </Link>
            </div>
          ) : (
            <ul className="cart-drawer-items">
              {items.map((item) => (
                <li key={item.productId} className="cart-drawer-item">
                  <div className="cart-drawer-item-media">
                    <Image
                      src={item.image || "/images/services/hero1.png"}
                      alt={item.name}
                      width={72}
                      height={72}
                    />
                  </div>
                  <div className="cart-drawer-item-info">
                    <div className="cart-drawer-item-name">{item.name}</div>
                    <div className="cart-drawer-item-meta">{t("oneSize")}</div>
                    <div className="cart-drawer-item-price">
                      {formatEur(item.unitAmountCents)}
                    </div>
                  </div>
                  <div className="cart-drawer-item-actions">
                    <div className="cart-qty-box">
                      <span>{item.quantity}</span>
                      <div className="cart-qty-chevrons">
                        <button
                          type="button"
                          aria-label={t("increase")}
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                        />
                        <button
                          type="button"
                          aria-label={t("decrease")}
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => removeItem(item.productId)}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {suggestion ? (
            <div className="cart-suggest">
              <div className="cart-suggest-head">
                <span>{t("youMayAlsoLike")}</span>
                <div className="cart-suggest-nav">
                  <button
                    type="button"
                    aria-label={t("previous")}
                    disabled={suggestions.length < 2}
                    onClick={() =>
                      setSuggestIndex(
                        (i) => (i - 1 + suggestions.length) % suggestions.length
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label={t("next")}
                    disabled={suggestions.length < 2}
                    onClick={() =>
                      setSuggestIndex((i) => (i + 1) % suggestions.length)
                    }
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="cart-suggest-row">
                <div className="cart-suggest-media">
                  <Image
                    src={suggestion.images?.[0] || "/images/services/hero1.png"}
                    alt={suggestion.name}
                    width={64}
                    height={64}
                  />
                </div>
                <div className="cart-suggest-info">
                  <div className="cart-suggest-name">{suggestion.name}</div>
                  <div className="cart-suggest-price">{suggestion.price}</div>
                </div>
                <button
                  type="button"
                  className="cart-suggest-add"
                  onClick={addSuggestion}
                >
                  + {t("add")}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-subtotal-row">
            <p className="cart-tax-note">{t("taxNote")}</p>
            <div className="cart-subtotal">
              <span>{t("subtotal")}</span>
              <strong>
                {formatEur(subtotalCents)} {t("currencyCode")}
              </strong>
            </div>
          </div>
          <div className="cart-footer-actions">
            <button
              type="button"
              className="cart-checkout-btn"
              disabled={!items.length || checkoutLoading}
              onClick={handleCheckout}
            >
              <IonIcon name="lock-closed-outline" size={16} />
              {checkoutLoading ? t("checkingOut") : t("checkout")}
            </button>
            <Link
              href="/cart"
              className="cart-view-btn"
              onClick={closeCart}
            >
              {t("viewCart")}
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
