"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { productsData, Product } from "@/data/products";
import HeroSlider2 from "@/components/HeroSlider2";
import IonIcon from "@/components/IonIcon";

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
              <IonIcon name="chevron-back-outline" size={24} />
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
                        <IonIcon name="eye-outline" size={16} className="icon icon-eye icon-sm" />
                        <span className="sr-only">Shiko</span>
                      </button>
                      <Link
                        className="block relative media media--square media--contain"
                        href={{ pathname: "/product/[id]", params: { id: String(product.id) } }}
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
                          href={{ pathname: "/product/[id]", params: { id: String(product.id) } }}
                          title={product.company}
                        >
                          {product.company}
                        </Link>
                      </div>
                      <div className="product-card__details">
                        <p className="grow">
                          <Link
                            className="product-card__title reversed-link text-base-xl font-medium leading-tight"
                            href={{ pathname: "/product/[id]", params: { id: String(product.id) } }}
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
              <IonIcon name="chevron-forward-outline" size={24} />
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
                <IonIcon name="mail-outline" size={20} />
                <span>vsoclinic@gmail.com</span>
              </div>
              <div className="contact-item">
                <IonIcon name="call-outline" size={20} />
                <span>+383 49 459 111</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
