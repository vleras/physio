"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import IonIcon from "@/components/IonIcon";
import { parsePriceToCents } from "@/lib/parsePrice";

type BuyNowButtonProps = {
  productId: number;
  price: string;
};

export default function BuyNowButton({ productId, price }: BuyNowButtonProps) {
  const locale = useLocale();
  const t = useTranslations("products");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCheckout = parsePriceToCents(price) != null;

  const handleBuy = async () => {
    if (!canCheckout || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, locale }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error || t("buyError"));
        return;
      }

      window.location.href = data.url;
    } catch {
      setError(t("buyError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buy-now-wrap">
      <button
        type="button"
        className="contact-btn contact-btn-buy"
        onClick={handleBuy}
        disabled={!canCheckout || loading}
        aria-busy={loading}
      >
        <IonIcon name="card-outline" size={18} />
        {loading ? t("buying") : t("buyNow")}
      </button>
      {error ? <p className="buy-now-error">{error}</p> : null}
      {!canCheckout ? (
        <p className="buy-now-error">{t("buyUnavailable")}</p>
      ) : null}
    </div>
  );
}
