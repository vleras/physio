"use client";

import { useTranslations } from "next-intl";
import IonIcon from "./IonIcon";

export default function MobileMessagingButton() {
  const t = useTranslations("common");
  const phoneNumber = "38349459111";
  const message = t("whatsappMessage");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mobile-messaging-btn"
      aria-label={t("messageUs")}
    >
      <IonIcon name="logo-whatsapp" size={28} color="#fff" />
    </a>
  );
}
