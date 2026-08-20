"use client";

import { useLocale, useTranslations } from "next-intl";
import IonIcon from "./IonIcon";
import { getContactPhone } from "@/lib/phone";

export default function MobileMessagingButton() {
  const t = useTranslations("common");
  const locale = useLocale();
  const phone = getContactPhone(locale);
  const message = t("whatsappMessage");

  return (
    <a
      href={`https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mobile-messaging-btn"
      aria-label={t("messageUs")}
    >
      <IonIcon name="logo-whatsapp" size={28} color="#fff" />
    </a>
  );
}
