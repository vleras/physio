"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import IonIcon from "@/components/IonIcon";
import "../success/checkout-result.css";

function CheckoutCancelContent() {
  const t = useTranslations("checkout");
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const productHref = productId ? `/product/${productId}` : "/products";

  return (
    <main className="main-content">
      <section className="checkout-result-section">
        <div className="checkout-result-card">
          <div className="checkout-result-icon checkout-result-icon--cancel">
            <IonIcon name="close-circle-outline" size={48} />
          </div>
          <h1>{t("cancelTitle")}</h1>
          <p>{t("cancelBody")}</p>
          <div className="checkout-result-actions">
            <Link href={productHref} className="checkout-result-btn">
              {t("tryAgain")}
            </Link>
            <Link href="/products" className="checkout-result-btn checkout-result-btn--ghost">
              {t("backToProducts")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutCancelContent />
    </Suspense>
  );
}
