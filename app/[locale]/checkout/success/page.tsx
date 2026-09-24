"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/CartProvider";
import { useTranslations } from "next-intl";
import IonIcon from "@/components/IonIcon";
import "./checkout-result.css";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");
  const { clearCart } = useCart();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) return;
    let cancelled = false;
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => {
        if (response.ok && !cancelled) clearCart();
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [clearCart]);

  return (
    <main className="main-content">
      <section className="checkout-result-section">
        <div className="checkout-result-card">
          <div className="checkout-result-icon checkout-result-icon--success">
            <IonIcon name="checkmark-circle-outline" size={48} />
          </div>
          <h1>{t("successTitle")}</h1>
          <p>{t("successBody")}</p>

          <div className="checkout-result-actions">
            <Link href="/products" className="checkout-result-btn">
              {t("backToProducts")}
            </Link>
            <Link
              href="/"
              className="checkout-result-btn checkout-result-btn--ghost"
            >
              {t("backHome")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
