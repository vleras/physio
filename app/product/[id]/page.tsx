"use client";

import { useState, useEffect, use, useRef } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/lib/getProducts";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface SupabaseProduct {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

export default function ProductDetails({ params }: PageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productId = parseInt(id);
        if (isNaN(productId)) {
          console.error("Invalid product ID:", id);
          notFound();
          return;
        }
        const data = await getProductById(productId);
        setProduct(data);
        if (!data) {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="main-content">
        <section className="product-detail-section">
          <div className="container">
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <Image
                src="/images/services/avalogo.svg"
                alt="AVA Logo"
                width={40}
                height={40}
                style={{ display: "inline-block", marginBottom: "1rem" }}
              />
              <div>Loading product...</div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ["/images/services/hero1.png"];
  const priceValue = product.price || "N/A";
  const message = `Hi! I'm interested in purchasing: ${product.name} (${priceValue})`;

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

    const minSwipeDistance = 50; // Minimum distance to trigger navigation
    const swipeThreshold = 100; // Distance for a strong swipe

    if (Math.abs(dragOffset) > minSwipeDistance) {
      if (dragOffset > swipeThreshold) {
        // Swiped right - previous image
        prevImage();
      } else if (dragOffset < -swipeThreshold) {
        // Swiped left - next image
        nextImage();
      } else if (dragOffset > 0) {
        // Small right swipe
        prevImage();
      } else {
        // Small left swipe
        nextImage();
      }
    }

    // Reset
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
                    aria-label="Previous image"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                      transform: isDragging ? `translateX(${dragOffset}px)` : 'none',
                      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                      touchAction: 'pan-y pinch-zoom',
                    }}
                  >
                    <Image
                      key={currentImageIndex}
                      src={productImages[currentImageIndex]}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className="product-detail-image"
                      width={800}
                      height={800}
                      priority={currentImageIndex === 0}
                      draggable={false}
                    />
                  </div>
                )}
                {productImages.length > 1 && (
                  <button
                    className="carousel-arrow carousel-arrow-right"
                    onClick={nextImage}
                    aria-label="Next image"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 18L15 12L9 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                      aria-label={`Go to image ${index + 1}`}
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
                  width={40}
                  height={40}
                  style={{ display: "inline-block" }}
                />
                <span>AVA STORE</span>
              </div>
              <h1 className="product-detail-title">{product.name}</h1>

              <div className="product-pricing">
                <span className="product-current-price">
                  {product.price || "N/A"}
                </span>
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/vsoclinic/"
                  className="contact-btn contact-btn-instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@vsoclinic"
                  className="contact-btn contact-btn-tiktok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
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
