"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
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
              width={40}
              height={40}
            />
            <span className="logo-text">VSO Clinic</span>
          </Link>
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
        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Ballina
          </Link>
          <Link
            href="/services"
            className={`nav-link ${pathname === "/services" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Shërbimet
          </Link>
          <Link
            href="/catalog"
            className={`nav-link ${pathname === "/catalog" ? "active" : ""}`}
            onClick={closeMenu}
          >
            Produktet
          </Link>
        </nav>
        <div className="header-contact">
          <a
            href="tel:+38349459111"
            className="header-contact-item"
            title="Call us"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span className="phone-text">+383 49 459 111</span>
          </a>
        </div>
      </div>
    </header>
  );
}
