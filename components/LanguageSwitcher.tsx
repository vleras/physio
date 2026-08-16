"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import IonIcon from "./IonIcon";
import { persistLocaleCookie } from "@/i18n/localeCookie";

const LOCALE_LABELS: Record<Locale, string> = {
  sq: "Shqip",
  en: "English",
  mk: "Македонски",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    persistLocaleCookie(next);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-switcher-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
      >
        <IonIcon name="globe-outline" size={12} className="lang-switcher-icon" />
        <span className="lang-switcher-code">{locale.toUpperCase()}</span>
        <span
          className={`lang-switcher-caret${open ? " is-open" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul className="lang-switcher-menu" role="menu">
          {routing.locales.map((l) => (
            <li key={l} role="none">
              <button
                type="button"
                role="menuitem"
                className={`lang-switcher-item${l === locale ? " is-active" : ""}`}
                onClick={() => switchTo(l)}
              >
                <span className="lang-switcher-item-code">{l.toUpperCase()}</span>
                <span className="lang-switcher-item-name">{LOCALE_LABELS[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
