"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import IonIcon from "./IonIcon";
import { getContactPhone } from "@/lib/phone";

export default function Header() {
  const pathname = usePathname();
  const nextPathname = useNextPathname();
  const isAdmin = nextPathname.startsWith("/admin");
  const locale = useLocale();
  const phone = getContactPhone(locale);
  const t = useTranslations("nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="header" ref={headerRef}>
      <div className="container">
        <div className="header-mobile-top">
          <Link href="/" className="logo" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="VSO Clinic Logo"
              className="logo-image"
              width={52}
              height={52}
            />
            <span className="logo-text">VSO Clinic</span>
          </Link>
          <div className="header-mobile-actions">
            {!isAdmin ? (
              <a
                href={`tel:${phone.tel}`}
                className="mobile-phone-btn"
                aria-label="Call us"
              >
                <IonIcon name="call-outline" size={20} />
              </a>
            ) : null}
            <LanguageSwitcher />
            <button
              className="menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <span className={`hamburger ${isMenuOpen ? "active" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
            onClick={closeMenu}
          >
            {t("home")}
          </Link>
          <a
            href="https://avacr7.com/collections/all"
            className="nav-link"
            onClick={(e) => {
              closeMenu();
              e.preventDefault();
              window.open(
                "https://avacr7.com/collections/all",
                "_blank",
                "noopener,noreferrer"
              );
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("products")}
          </a>
        </nav>
        <div className="header-contact">
          {!isAdmin ? (
            <a
              href={`tel:${phone.tel}`}
              className="header-contact-item"
              title="Call us"
            >
              <IonIcon name="call-outline" size={18} />
              <span className="phone-text">{phone.display}</span>
            </a>
          ) : null}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
