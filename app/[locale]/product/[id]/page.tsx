"use client";

import { useState, use, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { type Locale } from "@/lib/getProducts";
import { useProduct } from "@/hooks/useProducts";
import IonIcon from "@/components/IonIcon";
import { getContactPhone } from "@/lib/phone";
import "./product-detail.css";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetails({ params }: PageProps) {
  const { id } = use(params);
  const locale = useLocale() as Locale;
  const phone = getContactPhone(locale);
  const t = useTranslations("products");
  const productId = parseInt(id);
  const { data: product, isLoading: loading } = useProduct(productId, locale);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const dragOffset = useRef(0);
  const isDragging = useRef(false);
  const axisLocked = useRef<"x" | "y" | null>(null);
  const currentIndexRef = useRef(0);

  const productImages =
    product?.images && product.images.length > 0
      ? product.images
      : product
        ? ["/images/services/hero1.png"]
        : [];

  const applyTrackTransform = (
    index: number,
    offsetPx: number,
    animate: boolean
  ) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const width = viewport.clientWidth || 1;
    track.style.transition = animate
      ? "transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)"
      : "none";
    track.style.transform = `translate3d(${-index * width + offsetPx}px, 0, 0)`;
  };

  useEffect(() => {
    currentIndexRef.current = currentImageIndex;
    if (isDragging.current) return;
    applyTrackTransform(currentImageIndex, 0, true);
  }, [currentImageIndex]);

  // Prefetch every gallery image as soon as the product is available
  useEffect(() => {
    if (!product?.images?.length) return;

    product.images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [product?.images]);

  if (loading) {
    return (
      <main className="main-content">
        <section className="product-detail-section">
          <div className="container">
            <div className="modern-loader">
              <div className="modern-loader-spinner" />
              <span className="modern-loader-text">{t("loadingProduct")}</span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const priceValue = product.price || "N/A";
  const message = t("whatsappMessage", { name: product.name, price: priceValue });

  const goToImage = (index: number) => {
    const len = productImages.length;
    if (len <= 1) return;
    const next = ((index % len) + len) % len;
    setCurrentImageIndex(next);
  };

  const nextImage = () => goToImage(currentIndexRef.current + 1);
  const prevImage = () => goToImage(currentIndexRef.current - 1);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (productImages.length <= 1) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    dragOffset.current = 0;
    isDragging.current = true;
    axisLocked.current = null;
    applyTrackTransform(currentIndexRef.current, 0, false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || productImages.length <= 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (!axisLocked.current) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
      axisLocked.current = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      if (axisLocked.current === "y") {
        isDragging.current = false;
        return;
      }
    }

    if (axisLocked.current !== "x") return;

    // Soft resistance at the ends
    let offset = deltaX;
    const atStart = currentIndexRef.current === 0 && deltaX > 0;
    const atEnd =
      currentIndexRef.current === productImages.length - 1 && deltaX < 0;
    if (atStart || atEnd) {
      offset = deltaX * 0.35;
    }

    dragOffset.current = offset;
    applyTrackTransform(currentIndexRef.current, offset, false);
  };

  const handleTouchEnd = () => {
    if (productImages.length <= 1) {
      isDragging.current = false;
      dragOffset.current = 0;
      axisLocked.current = null;
      return;
    }

    if (!isDragging.current || axisLocked.current !== "x") {
      isDragging.current = false;
      dragOffset.current = 0;
      axisLocked.current = null;
      applyTrackTransform(currentIndexRef.current, 0, true);
      return;
    }

    const viewport = viewportRef.current;
    const width = viewport?.clientWidth || 1;
    const offset = dragOffset.current;
    const threshold = Math.min(80, width * 0.22);
    let nextIndex = currentIndexRef.current;

    if (offset <= -threshold) {
      nextIndex = Math.min(currentIndexRef.current + 1, productImages.length - 1);
    } else if (offset >= threshold) {
      nextIndex = Math.max(currentIndexRef.current - 1, 0);
    }

    isDragging.current = false;
    dragOffset.current = 0;
    axisLocked.current = null;

    if (nextIndex !== currentIndexRef.current) {
      setCurrentImageIndex(nextIndex);
    } else {
      applyTrackTransform(currentIndexRef.current, 0, true);
    }
  };

  return (
    <main className="main-content">
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-image-section">
              <div className="product-image-container">
                {productImages.length > 1 && (
                  <button
                    className="carousel-arrow carousel-arrow-left"
                    onClick={prevImage}
                    aria-label={t("previousImage")}
                  >
                    <IonIcon name="chevron-back-outline" size={24} />
                  </button>
                )}
                {productImages.length > 0 && (
                  <div
                    className="product-image-viewport"
                    ref={viewportRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                  >
                    <div
                      className="product-image-track"
                      ref={trackRef}
                    >
                      {productImages.map((src, index) => (
                        <div className="product-image-slide" key={`${src}-${index}`}>
                          <Image
                            src={src}
                            alt={`${product.name} - Image ${index + 1}`}
                            className="product-detail-image"
                            width={800}
                            height={800}
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            draggable={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {productImages.length > 1 && (
                  <button
                    className="carousel-arrow carousel-arrow-right"
                    onClick={nextImage}
                    aria-label={t("nextImage")}
                  >
                    <IonIcon name="chevron-forward-outline" size={24} />
                  </button>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="product-image-indicators">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      className={`image-indicator ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={t("goToImage", { number: index + 1 })}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="product-info-section">
              <div
                className="product-breadcrumb"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Image
                  src="/images/services/avalogo.svg"
                  alt="AVA Logo"
                  width={80}
                  height={56}
                  style={{ display: "inline-block" }}
                  className="product-breadcrumb-logo"
                />
                <span className="product-breadcrumb-text">AVA STORE</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <h1 className="product-detail-title">{product.name}</h1>
                <div className="product-pricing">
                  <span className="product-current-price">
                    {product.price || "N/A"}
                  </span>
                </div>
              </div>

              <div className="product-description">
                {product.description_1 && <p>{product.description_1}</p>}
                {product.description_2 && (
                  <p style={{ marginTop: "1rem" }}>{product.description_2}</p>
                )}
                {product.description_3 && (
                  <p style={{ marginTop: "1rem" }}>{product.description_3}</p>
                )}
              </div>

              <div className="contact-buttons">
                <a
                  href={`https://wa.me/${phone.whatsapp}?text=${encodeURIComponent(
                    message
                  )}`}
                  className="contact-btn contact-btn-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IonIcon name="logo-whatsapp" size={18} />
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/vsoclinic/"
                  className="contact-btn contact-btn-instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IonIcon name="logo-instagram" size={18} />
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@vsoclinic"
                  className="contact-btn contact-btn-tiktok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IonIcon name="logo-tiktok" size={18} />
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
