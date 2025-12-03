"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { productsData, Product } from "@/data/products";
import HeroSlider2 from "@/components/HeroSlider2";

export default function Home2() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProducts(productsData);
  }, []);

  const getProductsPerView = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 768) return 3;
    return 2;
  };

  const [productsPerView, setProductsPerView] = useState(getProductsPerView());

  useEffect(() => {
    const handleResize = () => {
      setProductsPerView(getProductsPerView());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - productsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <main className="main-content">
      {/* Hero Section - Full Width */}
      <section
        className="hero-section"
        style={{ width: "100%", maxWidth: "100vw", padding: 0 }}
      >
        <HeroSlider2 />
        <div style={{ width: "100%", maxWidth: "100%", padding: 0 }}>
          <div className="hero-content"></div>
        </div>
      </section>

      {/* Products Section - Slider */}
      <section className="page-section" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <h2 className="section-title">Produktet</h2>
          <div
            className="products-slider-wrapper"
            style={{ position: "relative" }}
          >
            <button
              className="slider-arrow slider-arrow-left"
              onClick={prevSlide}
              aria-label="Produktet e mëparshme"
              disabled={currentIndex === 0}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div
              className="products-slider-container"
              ref={sliderRef}
              style={{
                overflow: "hidden",
                position: "relative",
                width: "100%",
              }}
            >
              <div
                className="products-slider-track"
                style={{
                  display: "flex",
                  transform: `translateX(-${
                    currentIndex * (100 / productsPerView)
                  }%)`,
                  transition: "transform 0.5s ease-in-out",
                  gap: "1.5rem",
                }}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    style={{
                      minWidth: `calc(${100 / productsPerView}% - ${
                        (1.5 * (productsPerView - 1)) / productsPerView
                      }rem)`,
                      flexShrink: 0,
                    }}
                  >
                    <div className="product-card__media">
                      <button
                        type="button"
                        className="quick-view__button"
                        aria-label={`Shiko shpejt ${product.name}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <svg
                          className="icon icon-eye icon-sm"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            d="M18.3334 10C18.3334 12.0833 15.8334 16.6667 10 16.6667C4.16669 16.6667 1.66669 12.0833 1.66669 10C1.66669 7.91668 4.16669 3.33334 10 3.33334C15.8334 3.33334 18.3334 7.91668 18.3334 10Z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            d="M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61931 12.5 7.50002 11.3807 7.50002 10C7.50002 8.6193 8.61931 7.50001 10 7.50001C11.3807 7.50001 12.5 8.6193 12.5 10Z"
                          ></path>
                        </svg>
                        <span className="sr-only">Shiko</span>
                      </button>
                      <Link
                        className="block relative media media--square media--contain"
                        href={`/product/${product.id}`}
                        aria-label={product.name}
                        tabIndex={-1}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <div
                          className="media media--height media--contain w-full h-full overflow-hidden"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            className="product-card__image"
                            width={300}
                            height={300}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="product-card__content grow flex flex-col justify-start text-left">
                      <div className="product-card__top w-full">
                        <span className="sr-only">Shitësi:</span>
                        <Link
                          className="caption reversed-link uppercase leading-none tracking-widest"
                          href={`/product/${product.id}`}
                          title={product.company}
                        >
                          {product.company}
                        </Link>
                      </div>
                      <div className="product-card__details">
                        <p className="grow">
                          <Link
                            className="product-card__title reversed-link text-base-xl font-medium leading-tight"
                            href={`/product/${product.id}`}
                          >
                            {product.name}
                          </Link>
                        </p>
                        <div className="price">
                          <span className="price__regular whitespace-nowrap">
                            €{product.price.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="slider-arrow slider-arrow-right"
              onClick={nextSlide}
              aria-label="Produktet e ardhshme"
              disabled={currentIndex >= maxIndex}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Location/Map Section */}
      <section className="location-section">
        <div className="container">
          <h2 className="section-title">Lokacioni Ynë</h2>
          <div className="location-content">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.5!2d21.1775131!3d42.6495972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM4JzU4LjYiTiAyMcKwMTAnMzkuMSJF!5e0!3m2!1sen!2s!4v1736789123456!5m2!1sen!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="location-info">
              <h3>Informacioni i Kontaktit</h3>
              <div className="contact-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>vsoclinic@gmail.com</span>
              </div>
              <div className="contact-item">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>+383 49 459 111</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
