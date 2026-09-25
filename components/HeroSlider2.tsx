"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import IonIcon from "./IonIcon";

const heroImages = [
  "/images/Recovery-Boots.png",
  "/images/IMG_0458.png", // cryosports
  "/images/Ledboots.png",
  "/images/IMG_0457.png", // avaboots
  "/images/Light_Heat_Cold.png",
  "/images/HOME_Exercise.png",
  "/images/Pro_Physio_2.png",
  "/images/All_Products.png",
];
const mobileHeroImages = ["/images/mobile-comeback.png", ...heroImages];

export default function HeroSlider2() {
  const t = useTranslations("common");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const slides = isMobile ? mobileHeroImages : heroImages;

  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="hero-slider">
      <div className="hero-slider-container">
        {slides.map((image, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentIndex ? "active" : ""}`}
          >
            <Image
              src={image}
              alt={`Hero slide ${index + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority={index === 0}
              quality={75}
            />
            {index === 0 && !isMobile && (
              <Link className="hero-buy-now-bottom" href="/products">Buy Now</Link>
            )}
            {index === 0 && isMobile && <Link className="mobile-comeback-title-button" href="/products">Buy Now</Link>}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-slider-arrow hero-slider-arrow-left"
        onClick={prevSlide}
        aria-label={t("previousSlide")}
      >
        <IonIcon name="chevron-back-outline" size={24} />
      </button>
      <button
        className="hero-slider-arrow hero-slider-arrow-right"
        onClick={nextSlide}
        aria-label={t("nextSlide")}
      >
        <IonIcon name="chevron-forward-outline" size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="hero-slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-slider-dot ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={t("goToSlide", { number: index + 1 })}
          />
        ))}
      </div>
    </div>
  );
}
