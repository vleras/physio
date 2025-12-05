"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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

// Whitelist of allowed product names in exact order for sidebar
const ALLOWED_SIDEBAR_PRODUCTS = [
  "Cryo Sport",
  "LedBoots",
  "AVABoots",
  "Actin One",
  "Warm Pro",
  "Foot massager",
  "Deep Light",
  "Bioimpedance scale",
];

export default function ProductsSidebar() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Tripled products for seamless infinite scroll
  const tripledProducts = useMemo(() => {
    if (products.length === 0) return [];
    return [...products, ...products, ...products];
  }, [products]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();

        // Filter and sort products according to whitelist order
        const filteredProducts = ALLOWED_SIDEBAR_PRODUCTS.map((allowedName) => {
          // Find product by name (case-insensitive match)
          return data.find(
            (product) =>
              product.name.toLowerCase().trim() ===
              allowedName.toLowerCase().trim()
          );
        }).filter(
          (product): product is SupabaseProduct => product !== undefined
        );

        setProducts(filteredProducts);
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

  // CSS Animation-based continuous scrolling (like VerticalProductCarousel)
  useEffect(() => {
    if (products.length === 0 || !trackRef.current) return;

    const track = trackRef.current;
    const duration = 20; // Total animation duration in seconds

    // Clean up any existing animations
    track.style.animation = "none";
    // Force reflow
    void track.offsetHeight;

    // Apply the CSS animation based on screen size
    // Mobile: horizontal scroll (scroll-left), Desktop: vertical scroll (scroll-down)
    const animationName = isMobile ? "scroll-left" : "scroll-down";
    track.style.animation = `${animationName} ${duration}s linear infinite`;

    return () => {
      track.style.animation = "none";
    };
  }, [products.length, isMobile]);

  // Pause/resume animation on hover
  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;

    if (isHovered) {
      // Pause the animation smoothly
      track.style.animationPlayState = "paused";
    } else {
      // Resume the animation smoothly
      track.style.animationPlayState = "running";
    }
  }, [isHovered]);

  return (
    <aside
      className="products-sidebar"
      ref={sidebarRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
            by CR<span className="sidebar-cr7-number">7</span>
          </div>
        </div>
        <h2>Produktet</h2>
      </div>

      {/* CAROUSEL-STYLE CONTENT AREA */}
      <div
        className="sidebar-products"
        style={{ overflow: "hidden", height: "100%" }}
      >
        {/* Track container for seamless looping */}
        <div
          ref={trackRef}
          className={isMobile ? "flex flex-row" : "flex flex-col"}
          style={{
            willChange: "transform",
          }}
        >
          {/* DUPLICATE CONTENT FOR SEAMLESS LOOPING */}
          {tripledProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              ref={(el) => {
                const actualIndex = index % products.length;
                if (index < products.length) {
                  itemsRef.current[actualIndex] = el;
                }
              }}
              className="sidebar-product-item shrink-0"
              style={{
                opacity: 1,
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
