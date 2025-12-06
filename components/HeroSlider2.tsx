"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const heroImages = [
  "/vsonew1.jpg",
  "/homepage3.jpg",
  "/images/services/hero3.jpg",
  "/images/services/hero4.jpg",
  "/images/services/hero5.jpg",
  "/images/services/hero6.jpg",
  "/images/services/needle.jpg",
  // "/images/hero10.jpg",
];

export default function HeroSlider2() {
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
              style={{ objectFit: "cover" }}
              priority={index === 0}
              quality={90}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-slider-arrow hero-slider-arrow-left"
        onClick={prevSlide}
        aria-label="Slide e mëparshme"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        className="hero-slider-arrow hero-slider-arrow-right"
        onClick={nextSlide}
        aria-label="Slide e ardhshme"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
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
            aria-label={`Shko te slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
