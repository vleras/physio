"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import IonIcon from "./IonIcon";

const heroImages = [
  "/images/Recovery-Boots.png",
  "/images/Light_Heat_Cold.png",
  "/images/HOME_Exercise.png",
  "/images/Ledboots.png",
  "/images/Pro_Physio_2.png",
  "/images/All_Products.png",
];

export default function HeroSlider2() {
  const t = useTranslations("common");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="hero-slider">
      <div className="hero-slider-container">
        {heroImages.map((image, index) => (
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
        {heroImages.map((_, index) => (
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
