"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ProductCartButton from "@/components/ProductCartButton";
import IonIcon from "./IonIcon";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
  const t = useTranslations("sidebar");
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef(false);
  const pendingPointer = useRef(false);
  const didDrag = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const autoPaused = useRef(false);
  const rafId = useRef<number | null>(null);

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

    const checkAndUpdate = () => {
      const locationSection = document.querySelector(".location-section");
      if (locationSection) {
        updateHeight();
      } else {
        setTimeout(checkAndUpdate, 100);
      }
    };

    checkAndUpdate();
    window.addEventListener("resize", updateHeight);
    const timeoutId1 = setTimeout(updateHeight, 500);
    const timeoutId2 = setTimeout(updateHeight, 1000);
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

  // Slow auto-scroll top → bottom + infinite loop (paused while dragging / hovering)
  useEffect(() => {
    if (products.length === 0) return;
    const el = productsRef.current;
    if (!el) return;

    // Start in the middle copy so we can keep scrolling "down" forever
    const syncStart = () => {
      const loopAt = el.scrollHeight / 3;
      if (loopAt > 0) el.scrollTop = loopAt;
    };
    requestAnimationFrame(syncStart);

    const tick = () => {
      if (!autoPaused.current && !isDragging.current && window.innerWidth > 768) {
        const loopAt = el.scrollHeight / 3;
        el.scrollTop -= 0.45;
        if (loopAt > 0 && el.scrollTop <= loopAt * 0.5) {
          el.scrollTop += loopAt;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [products.length]);

  const pauseAuto = () => {
    autoPaused.current = true;
  };

  const resumeAuto = () => {
    if (!isDragging.current) autoPaused.current = false;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 768) return;
    if (e.button !== 0) return;
    const el = productsRef.current;
    if (!el) return;

    // Don't capture yet — wait for real movement so clicks still work
    pendingPointer.current = true;
    isDragging.current = false;
    didDrag.current = false;
    dragStartY.current = e.clientY;
    dragStartScroll.current = el.scrollTop;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pendingPointer.current && !isDragging.current) return;
    const el = productsRef.current;
    if (!el) return;

    const delta = e.clientY - dragStartY.current;

    if (!isDragging.current) {
      if (Math.abs(delta) < 6) return;
      isDragging.current = true;
      didDrag.current = true;
      autoPaused.current = true;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);
    }

    el.scrollTop = dragStartScroll.current - delta;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = productsRef.current;
    const wasDragging = isDragging.current;
    pendingPointer.current = false;
    isDragging.current = false;
    el?.classList.remove("is-dragging");

    if (wasDragging) {
      try {
        el?.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    if (!el?.matches(":hover")) {
      autoPaused.current = false;
    }
  };

  return (
    <aside
      className="products-sidebar"
      ref={sidebarRef}
      onMouseEnter={pauseAuto}
      onMouseLeave={resumeAuto}
    >
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
        <h2>{t("products")}</h2>
      </div>

      <div
        className="sidebar-products"
        ref={productsRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="sidebar-products-track">
          {tripledProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="sidebar-product-item shrink-0"
              style={{ position: "relative", opacity: 1, textDecoration: "none", display: "flex" }}
              draggable={false}
              onClick={(e) => {
                // Only block navigation after a real drag
                if (didDrag.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  didDrag.current = false;
                }
              }}
              onDragStart={(e) => e.preventDefault()}
            >
              <Link className="product-card-hit-area" href={{ pathname: "/product/[id]", params: { id: product.id } }} aria-label={product.name} draggable={false} />
              <div className="sidebar-product-image" style={{ position: "relative" }}>
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
                  draggable={false}
                />
                <ProductCartButton product={product} />
              </div>
              <div className="sidebar-product-content">
                <div className="sidebar-product-name">{product.name}</div>
                <div className="sidebar-product-description">
                  {product.description_1 ||
                    product.description_2 ||
                    product.description_3 ||
                    ""}
                </div>
                <span className="sidebar-product-link">
                  {t("viewDetails")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-see-more">
        <Link
          href="/products"
          className="sidebar-see-more-button"
        >
          {t("seeMore")}
          <IonIcon name="arrow-forward-outline" size={16} />
        </Link>
      </div>
    </aside>
  );
}
