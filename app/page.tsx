"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductsSidebar from "@/components/ProductsSidebar";
import HeroSlider2 from "@/components/HeroSlider2";
import Image from "next/image";
import "./home.css";

export default function Home() {
  const professionalsImages = [
    "/images/professionals/professionals.webp",
    "/images/professionals/professionals1.webp",
    "/images/professionals/professionals3.jpg",
    "/images/professionals/professionals4.webp",
    "/images/professionals/professionals5.webp",
    "/images/professionals/professionals6.webp",
  ];
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Fetch team logos using React Query
  const { data: teamsImages = [] } = useQuery<string[]>({
    queryKey: ["teamLogos"],
    queryFn: async () => {
      const response = await fetch("/api/teamlogos");
      if (!response.ok) {
        throw new Error("Failed to fetch team logos");
      }
      const data = await response.json();
      return data.images && Array.isArray(data.images) ? data.images : [];
    },
  });

  useEffect(() => {
    // Trigger animations on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  // Infinite auto-scrolling carousel - optimized for smooth continuous scrolling
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrame: number;
    let lastTime = performance.now();
    let scrollPosition = 0;

    const scrollSpeed = 1.5; // Increased speed for smoother feel

    const animate = (currentTime: number) => {
      if (!carousel) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTime;
      const normalizedSpeed = scrollSpeed * (deltaTime / 16.67); // Normalize to 60fps

      // Always update scroll position for continuous movement
      scrollPosition += normalizedSpeed;

      // Get the width of one set of images (non-duplicated)
      const singleSetWidth = carousel.scrollWidth / 2;

      // Reset scroll position when we exceed one full set width
      // This creates the seamless loop without visual jump
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
      }

      // Apply the scroll position
      carousel.scrollLeft = scrollPosition;

      lastTime = currentTime;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [professionalsImages.length]);

  return (
    <main className="main-content">
      <div className="content-layout">
        <div className="main-content-area">
          <section className="hero-section">
            <HeroSlider2 />
            <div className="container">
              <div className="hero-content"></div>
            </div>
          </section>

          {/* Location/Map Section - Desktop Only */}
          <section className="location-section location-section-desktop">
            <div className="container">
              <h2 className="section-title animate-on-scroll">Lokacioni Ynë</h2>
              <p className="location-address animate-on-scroll">
                Adresa: Rruga Valbona, Rruga C
              </p>
              <div className="location-content">
                <div className="map-container animate-on-scroll">
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
              </div>
            </div>
          </section>
        </div>

        {/* Products Sidebar */}
        <ProductsSidebar />
      </div>

      {/* Professionals Section - Full Width */}
      <section className="professionals-section">
        <div className="container">
          <h2 className="professionals-title animate-on-scroll">
            Profesionistët që na besojnë
          </h2>
          <div className="professionals-grid" ref={carouselRef}>
            {/* Duplicate images for seamless infinite scroll */}
            {[...professionalsImages, ...professionalsImages].map(
              (src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="professionals-grid__item"
                >
                  <Image
                    src={src}
                    alt={`Professional testimonial ${index + 1}`}
                    width={320}
                    height={420}
                    className="professionals-grid__image"
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Teams Carousel Section - Full Width */}
      {teamsImages.length > 0 && (
        <section className="teams-carousel-section">
          <div className="container">
            <div className="teams-carousel-wrapper">
              {/* Wrapper with CSS animation */}
              <div
                className="teams-carousel-track"
                style={{
                  // Create a seamless loop with 3 duplicates
                  // Width calculation: (itemWidth * count + gap * (count - 1)) * 3
                  // Item width: 100px, Gap: 2rem (32px)
                  display: "flex",
                  width: `${
                    (teamsImages.length * 100 + (teamsImages.length - 1) * 32) *
                    3
                  }px`, // 3 copies of all images with gaps
                  animation: `teamsScroll 20s linear infinite`,
                }}
              >
                {/* Render 3 copies for seamless looping */}
                {[...teamsImages, ...teamsImages, ...teamsImages].map(
                  (src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="teams-carousel__item"
                    >
                      <Image
                        src={src}
                        alt={`Team logo ${index + 1}`}
                        width={100}
                        height={100}
                        className="teams-carousel__image"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Location/Map Section - Mobile Only */}
      <section className="location-section location-section-mobile">
        <div className="container">
          <h2 className="section-title animate-on-scroll">Lokacioni Ynë</h2>
          <p className="location-address animate-on-scroll">
            Adresa: Rruga Valbona, Rruga C
          </p>
          <div className="location-content">
            <div className="map-container animate-on-scroll">
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
          </div>
        </div>
      </section>
    </main>
  );
}
