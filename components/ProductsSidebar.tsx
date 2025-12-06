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
  const [isTouching, setIsTouching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tripled products for seamless infinite scroll
  const tripledProducts = useMemo(() => {
    if (products.length === 0) return [];
    return [...products, ...products, ...products];
  }, [products]);

  // Detect mobile viewport - set immediately to prevent layout shifts
  useEffect(() => {
    // Set initial state immediately (synchronously) to prevent height calculation from running
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);
      // Mark as initialized after a brief delay to allow page to settle
      setTimeout(() => {
        setIsInitialized(true);
      }, 50);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

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

  // Set sidebar max-height to match from start to end of location section (desktop only)
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Early return for mobile - never run height calculations on mobile
    const isMobileWidth = window.innerWidth <= 768;
    if (isMobileWidth) {
      // Ensure mobile styles are applied immediately
      sidebar.style.maxHeight = "";
      sidebar.style.height = "";
      return;
    }

    const updateHeight = () => {
      // Double-check we're still on desktop
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
        // Use requestAnimationFrame to prevent layout shifts during scroll
        requestAnimationFrame(() => {
          const mainContentTop = mainContentArea.getBoundingClientRect().top;
          const locationBottom = locationSection.getBoundingClientRect().bottom;
          const totalHeight = locationBottom - mainContentTop;

          sidebar.style.maxHeight = `${totalHeight}px`;
          sidebar.style.height = `${totalHeight}px`;
        });
      }
    };

    // Only run on desktop
    if (!isMobileWidth) {
      updateHeight();
      window.addEventListener("resize", updateHeight);
      // Only set timeout on desktop
      const timeoutId = setTimeout(() => {
        if (window.innerWidth > 768) {
          updateHeight();
        }
      }, 500);

      return () => {
        window.removeEventListener("resize", updateHeight);
        clearTimeout(timeoutId);
      };
    }
  }, [isMobile]);

  // CSS Animation-based continuous scrolling (like VerticalProductCarousel)
  useEffect(() => {
    if (products.length === 0 || !trackRef.current) return;

    const track = trackRef.current;
    const duration = 20; // Total animation duration in seconds

    // On mobile, wait for initialization to prevent scroll jumps
    const initAnimation = () => {
      // Clean up any existing animations
      track.style.animation = "none";
      // Force reflow
      void track.offsetHeight;

      // Apply the CSS animation based on screen size
      // Mobile: horizontal scroll (scroll-left), Desktop: vertical scroll (scroll-down)
      const animationName = isMobile ? "scroll-left" : "scroll-down";
      track.style.animation = `${animationName} ${duration}s linear infinite`;
    };

    // Use requestAnimationFrame to prevent layout shifts during initial render
    // On mobile, wait a tiny bit for page to settle, but not too long
    if (isMobile && !isInitialized) {
      // Very short delay just to let initial render complete
      const timer = setTimeout(() => {
        requestAnimationFrame(initAnimation);
      }, 50);
      return () => {
        clearTimeout(timer);
        if (trackRef.current) {
          trackRef.current.style.animation = "none";
        }
      };
    } else {
      // Desktop or after initialization - start immediately
      requestAnimationFrame(initAnimation);
    }

    return () => {
      if (trackRef.current) {
        trackRef.current.style.animation = "none";
      }
    };
  }, [products.length, isMobile, isInitialized]);

  // Pause/resume animation on hover or touch (mobile)
  useEffect(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;

    if (isHovered || isTouching) {
      // Pause the animation smoothly
      track.style.animationPlayState = "paused";
    } else {
      // Resume the animation smoothly
      track.style.animationPlayState = "running";
    }
  }, [isHovered, isTouching]);

  // Handle touch events on mobile to pause animation and allow page scroll
  useEffect(() => {
    if (!isMobile || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    let touchStartY = 0;
    let touchStartX = 0;
    let isVerticalScroll = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isVerticalScroll = false;
      setIsTouching(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY || !touchStartX) return;

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = Math.abs(touchY - touchStartY);
      const deltaX = Math.abs(touchX - touchStartX);

      // Determine if this is primarily a vertical scroll
      if (deltaY > deltaX && deltaY > 10) {
        isVerticalScroll = true;
        // Allow default behavior for vertical scrolling (page scroll)
        return;
      }

      // For horizontal scrolling within sidebar, prevent default to allow horizontal scroll
      if (deltaX > deltaY && deltaX > 10) {
        isVerticalScroll = false;
      }
    };

    const handleTouchEnd = () => {
      // Small delay before resuming to ensure smooth transition
      setTimeout(() => {
        setIsTouching(false);
      }, 100);
      touchStartY = 0;
      touchStartX = 0;
      isVerticalScroll = false;
    };

    sidebar.addEventListener("touchstart", handleTouchStart, { passive: true });
    sidebar.addEventListener("touchmove", handleTouchMove, { passive: true });
    sidebar.addEventListener("touchend", handleTouchEnd, { passive: true });
    sidebar.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      sidebar.removeEventListener("touchstart", handleTouchStart);
      sidebar.removeEventListener("touchmove", handleTouchMove);
      sidebar.removeEventListener("touchend", handleTouchEnd);
      sidebar.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMobile]);

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
            by CR
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
      <div
        className="sidebar-products"
        style={{
          overflow: "hidden",
          height: isMobile ? "auto" : "100%",
        }}
      >
        {/* Track container for seamless looping */}
        <div
          ref={trackRef}
          className={isMobile ? "flex flex-row" : "flex flex-col"}
          style={{
            willChange: "transform",
            touchAction: isMobile ? "pan-y pan-x" : "auto",
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
