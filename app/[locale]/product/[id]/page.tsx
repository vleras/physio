"use client";

import { useState, use, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { type Locale } from "@/lib/getProducts";
import { useProduct } from "@/hooks/useProducts";
import IonIcon from "@/components/IonIcon";
import "./product-detail.css";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetails({ params }: PageProps) {
  const { id } = use(params);
  const locale = useLocale() as Locale;
  const t = useTranslations("products");
  const productId = parseInt(id);
  const { data: product, isLoading: loading } = useProduct(productId, locale);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const productImages =
    product?.images && product.images.length > 0
      ? product.images
      : product
        ? ["/images/services/hero1.png"]
        : [];

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (productImages.length <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || productImages.length <= 1) return;
    const currentX = e.touches[0].clientX;
    const offset = currentX - touchStartX.current;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || productImages.length <= 1) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const minSwipeDistance = 50;
    const swipeThreshold = 100;

    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > swipeThreshold) {
        prevImage();
      } else if (dragOffset < -swipeThreshold) {
        nextImage();
      } else if (dragOffset > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }

    touchStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  return (
    <main className="main-content">
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-layout">
            {/* Product Image Section */}
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
                    className="product-image-wrapper"
                    ref={imageWrapperRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      transform: isDragging ? `translateX(${dragOffset}px)` : "none",
                      transition: isDragging ? "none" : "transform 0.3s ease-out",
                      touchAction: "pan-y pinch-zoom",
                    }}
                  >
                    {productImages.map((src, index) => (
                      <Image
                        key={src}
                        src={src}
                        alt={`${product.name} - Image ${index + 1}`}
                        className={`product-detail-image${
                          index === currentImageIndex ? " is-active" : ""
                        }`}
                        width={800}
                        height={800}
                        priority
                        loading="eager"
                        draggable={false}
                        aria-hidden={index !== currentImageIndex}
                      />
                    ))}
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

            {/* Product Details Section */}
            <div className="product-info-section">
              <div className="product-breadcrumb" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
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
                  href={`https://wa.me/38349459111?text=${encodeURIComponent(
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
