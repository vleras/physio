"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/getProducts";

interface SupabaseProduct {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

export default function ProductsSidebar() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error loading products:", error);
      }
    }
    fetchProducts();
  }, []);

  // Set sidebar max-height to match from start to end of location section
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const updateHeight = () => {
      const mainContentArea = document.querySelector(
        ".main-content-area"
      ) as HTMLElement;
      const locationSection = document.querySelector(
        ".location-section"
      ) as HTMLElement;

      if (mainContentArea && locationSection) {
        const mainContentTop = mainContentArea.getBoundingClientRect().top;
        const locationBottom = locationSection.getBoundingClientRect().bottom;
        const totalHeight = locationBottom - mainContentTop;

        sidebar.style.maxHeight = `${totalHeight}px`;
        sidebar.style.height = `${totalHeight}px`;
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    const timeoutId = setTimeout(updateHeight, 500);

    return () => {
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  // CAROUSEL-STYLE DOWNWARD AUTO-SCROLLING
  useEffect(() => {
    if (products.length === 0) return;

    const productsContainer = sidebarRef.current?.querySelector(
      ".sidebar-products"
    ) as HTMLElement;
    if (!productsContainer) return;

    console.log("🎬 Starting DOWNWARD carousel-style auto-scroll");

    let animationId: number;
    let lastTime: number | null = null;
    const scrollSpeed = 50; // pixels per second - DOWNWARD

    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;

      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Get container and item measurements
      const container = sidebarRef.current;
      if (!container) return;

      const containerHeight = container.clientHeight;
      const firstItem = productsContainer.querySelector(
        ".sidebar-product-item"
      ) as HTMLElement;
      if (!firstItem) return;

      const itemHeight = firstItem.offsetHeight;
      const gap = 16; // 1rem gap from CSS
      const totalContentHeight = (itemHeight + gap) * products.length;

      // Calculate current scroll position
      const currentScroll = productsContainer.scrollTop || 0;

      // MOVE DOWNWARD (increase scroll position)
      const newScroll = currentScroll + scrollSpeed * deltaTime;

      // Reset when we reach the end (carousel loop)
      if (newScroll >= totalContentHeight) {
        productsContainer.scrollTop = 0; // Loop back to top
      } else {
        productsContainer.scrollTop = newScroll; // Continue scrolling down
      }

      // Update current index for tracking
      const visibleIndex =
        Math.floor(newScroll / (itemHeight + gap)) % products.length;
      setCurrentIndex(visibleIndex);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
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
            CR<span className="sidebar-cr7-number">7</span>
          </div>
        </div>
        <h2>Produktet</h2>
      </div>

      {/* CAROUSEL-STYLE CONTENT AREA */}
      <div
        className="sidebar-products"
        style={{ overflowY: "auto", height: "100%" }}
      >
        {/* DUPLICATE CONTENT FOR SEAMLESS LOOPING */}
        {[...products, ...products].map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            ref={(el) => {
              const actualIndex = index % products.length;
              if (index < products.length) {
                itemsRef.current[actualIndex] = el;
              }
            }}
            className="sidebar-product-item"
            style={{
              opacity: 1,
              transform: "translateY(0)",
              transition: `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${
                (index % products.length) * 0.1
              }s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${
                (index % products.length) * 0.1
              }s`,
            }}
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
