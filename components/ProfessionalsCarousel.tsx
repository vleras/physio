"use client";

import { useRef, useEffect, useMemo } from "react";
import Image from "next/image";

interface ProfessionalsCarouselProps {
  images: readonly string[] | string[];
}

export default function ProfessionalsCarousel({
  images,
}: ProfessionalsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const duplicatedImages = useMemo(() => [...images, ...images], [images]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationFrame: number;
    let lastTime = performance.now();
    let scrollPosition = 0;
    const scrollSpeed = 1.5;

    const animate = (currentTime: number) => {
      if (!carousel) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTime;
      const normalizedSpeed = scrollSpeed * (deltaTime / 16.67);
      scrollPosition += normalizedSpeed;

      const singleSetWidth = carousel.scrollWidth / 2;
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = 0;
      }

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
  }, []);

  return (
    <div className="professionals-grid" ref={carouselRef}>
      {duplicatedImages.map((src, index) => (
        <div key={`${src}-${index}`} className="professionals-grid__item">
          <Image
            src={src}
            alt={`Professional testimonial ${index + 1}`}
            width={320}
            height={420}
            className="professionals-grid__image"
          />
        </div>
      ))}
    </div>
  );
}
