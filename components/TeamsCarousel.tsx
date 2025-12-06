"use client";

import { useMemo } from "react";
import Image from "next/image";

interface TeamsCarouselProps {
  images: string[];
}

export default function TeamsCarousel({ images }: TeamsCarouselProps) {
  const tripledImages = useMemo(
    () => [...images, ...images, ...images],
    [images]
  );

  const trackWidth = useMemo(() => {
    const itemWidth = 100;
    const gap = 32;
    return (images.length * itemWidth + (images.length - 1) * gap) * 3;
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <section className="teams-carousel-section">
      <div className="container">
        <div className="teams-carousel-wrapper">
          <div
            className="teams-carousel-track"
            style={{
              display: "flex",
              width: `${trackWidth}px`,
              animation: "teamsScroll 20s linear infinite",
            }}
          >
            {tripledImages.map((src, index) => (
              <div key={`${src}-${index}`} className="teams-carousel__item">
                <Image
                  src={src}
                  alt={`Team logo ${index + 1}`}
                  width={100}
                  height={100}
                  className="teams-carousel__image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
