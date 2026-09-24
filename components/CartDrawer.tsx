"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import IonIcon from "@/components/IonIcon";
import { useCart } from "@/components/CartProvider";
import { formatEur } from "@/lib/cart";
import { getContactPhone } from "@/lib/phone";
import { useProducts } from "@/hooks/useProducts";
import { type Locale } from "@/lib/getProducts";
import { parsePriceToCents } from "@/lib/parsePrice";
import "./cart-drawer.css";

export default function CartDrawer({ page = false }: { page?: boolean }) {
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const phone = getContactPhone(locale);
  const {
    items,
    isOpen,
    itemCount,
    subtotalCents,
    closeCart,
    removeItem,
    setQuantity,
    addItem,
    note,
    setNote,
  } = useCart();
  const { data: products = [] } = useProducts(locale);
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

  const handleCheckout = () => {
    if (!items.length) return;
    const message = [
      t("whatsappIntro"),
      "",
      ...items.map((item, index) => {
        const name = products.find((product) => product.id === item.productId)?.name || item.name;
        return `${index + 1}. ${name} × ${item.quantity}`;
      }),
      ...(note.trim() ? ["", `${t("orderNote")}: ${note.trim()}`] : []),
      "",
      t("whatsappConfirm"),
    ].join("\n");
    window.location.href = `https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(message)}`;
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

  if (!page && !isOpen) return null;

  return (
    <div className={page ? "cart-page" : "cart-drawer-root"} role={page ? undefined : "dialog"} aria-modal={page ? undefined : true} aria-label={t("title")}>
      {!page && <button
        type="button"
        className="cart-drawer-backdrop"
        aria-label={t("close")}
        onClick={closeCart}
      />}
      <aside className="cart-drawer-panel">
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            {t("title")}
            {itemCount > 0 ? (
              <sup className="cart-drawer-count">{itemCount}</sup>
            ) : null}
          </h2>
          {!page && <button
            type="button"
            className="cart-drawer-close"
            onClick={closeCart}
            aria-label={t("close")}
          >
            ×
          </button>}
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
          <label className="cart-order-note">
            {t("orderNote")}
            <textarea value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} placeholder={t("orderNotePlaceholder")} />
          </label>
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
              disabled={!items.length}
              onClick={handleCheckout}
            >
              <IonIcon name="logo-whatsapp" size={16} />
              {t("checkout")}
            </button>
            <Link
              href={page ? "/products" : "/cart"}
              className="cart-view-btn"
              onClick={closeCart}
            >
              {t(page ? "continueShopping" : "viewCart")}
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
