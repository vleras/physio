"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface SupabaseProduct {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

interface ProductsSidebarDesktopProps {
  products: SupabaseProduct[];
}

export default function ProductsSidebarDesktop({
  products,
}: ProductsSidebarDesktopProps) {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Tripled products for seamless infinite scroll
  const tripledProducts =
    products.length > 0 ? [...products, ...products, ...products] : [];

  // Set sidebar max-height to match from start to end of location section
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const updateHeight = () => {
      if (window.innerWidth <= 768) {
        sidebar.style.maxHeight = "";
        sidebar.style.height = "";
        return;
      }

      const mainContentArea = document.querySelector(
        ".main-content-area"
      ) as HTMLElement;
      const locationSection = document.querySelector(
        ".location-section"
      ) as HTMLElement;

      if (mainContentArea && locationSection) {
        requestAnimationFrame(() => {
          const mainContentTop = mainContentArea.getBoundingClientRect().top;
          const locationBottom = locationSection.getBoundingClientRect().bottom;
          const totalHeight = locationBottom - mainContentTop;

          sidebar.style.maxHeight = `${totalHeight}px`;
          sidebar.style.height = `${totalHeight}px`;
        });
      }
    };

    // Wait for location section to be available, then calculate
    const checkAndUpdate = () => {
      const locationSection = document.querySelector(".location-section");
      if (locationSection) {
        updateHeight();
      } else {
        // Retry if location section not found yet (for async rendering)
        setTimeout(checkAndUpdate, 100);
      }
    };

    checkAndUpdate();

    // Recalculate on resize
    window.addEventListener("resize", updateHeight);

    // Recalculate after delays to account for async rendering and iframe loading
    const timeoutId1 = setTimeout(updateHeight, 500);
    const timeoutId2 = setTimeout(updateHeight, 1000);

    // Also recalculate when images/content loads
    const imageLoadHandler = () => {
      setTimeout(updateHeight, 100);
    };
    window.addEventListener("load", imageLoadHandler);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("load", imageLoadHandler);
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, []);

  // CSS Animation-based continuous scrolling
  useEffect(() => {
    if (products.length === 0 || !trackRef.current) return;

    const track = trackRef.current;
    const duration = 20;

    const initAnimation = () => {
      track.style.animation = "none";
      void track.offsetHeight; // Force reflow
      track.style.animation = `scroll-down ${duration}s linear infinite`;
    };

    requestAnimationFrame(initAnimation);

    return () => {
      if (trackRef.current) {
        trackRef.current.style.animation = "none";
      }
    };
  }, [products.length]);

  return (
    <aside className="products-sidebar" ref={sidebarRef}>
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo">
            <Image
              src="/avalogo.svg"
              alt="AVA Logo"
              width={100}
              height={70}
              className="sidebar-logo-image"
              priority
            />
          </div>
          <div className="sidebar-cr7">
            BY CR
            <Image
              src="/7.png"
              alt="7"
              width={20}
              height={20}
              className="sidebar-cr7-number"
            />
          </div>
        </div>
        <h2>Produktet</h2>
      </div>

      {/* CAROUSEL-STYLE CONTENT AREA */}
      <div className="sidebar-products">
        {/* Track container for seamless looping */}
        <div ref={trackRef} className="sidebar-products-track">
          {/* DUPLICATE CONTENT FOR SEAMLESS LOOPING */}
          {tripledProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="sidebar-product-item shrink-0"
              style={{ opacity: 1 }}
            >
              <div className="sidebar-product-image">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/images/services/hero1.png"
                  }
                  alt={product.name}
                  width={130}
                  height={130}
                  loading="lazy"
                />
              </div>
              <div className="sidebar-product-content">
                <div className="sidebar-product-name">{product.name}</div>
                <div className="sidebar-product-description">
                  {product.description_1 ||
                    product.description_2 ||
                    product.description_3 ||
                    ""}
                </div>
                <Link
                  href={`/product/${product.id}`}
                  className="sidebar-product-link"
                >
                  Shiko Detajet
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-see-more">
        <Link href="/catalog" className="sidebar-see-more-button">
          Shiko Më Shumë
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
