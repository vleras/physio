"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import IonIcon from "@/components/IonIcon";
import "./checkout-result.css";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");

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
            <Link href="/" className="checkout-result-btn checkout-result-btn--ghost">
              {t("backHome")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
