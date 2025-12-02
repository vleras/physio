"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface ContinuousCarouselProps {
  items: string[];
  speed?: number; // Duration in seconds for one full cycle
  direction?: "left" | "right";
  className?: string;
  itemClassName?: string;
  pauseOnHover?: boolean;
}

export default function ContinuousCarousel({
  items,
  speed = 20,
  direction = "left",
  className = "",
  itemClassName = "",
  pauseOnHover = false,
}: ContinuousCarouselProps) {
  const [duplicatedItems, setDuplicatedItems] = useState<string[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Duplicate items multiple times for seamless infinite scroll
    if (items.length > 0) {
      setDuplicatedItems([...items, ...items, ...items]);
    }
  }, [items]);

  useEffect(() => {
    if (trackRef.current) {
      const track = trackRef.current;
      const animationName = direction === "left" ? "scroll-left" : "scroll-right";
      const animationDuration = `${speed}s`;
      
      track.style.animation = `${animationName} ${animationDuration} linear infinite`;
      if (pauseOnHover) {
        track.style.animationPlayState = "running";
      }
    }
  }, [speed, direction, pauseOnHover]);

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-24 ${className}`}>
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => {
        if (pauseOnHover && trackRef.current) {
          trackRef.current.style.animationPlayState = "paused";
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover && trackRef.current) {
          trackRef.current.style.animationPlayState = "running";
        }
      }}
    >
      <div
        ref={trackRef}
        className="flex w-fit"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={`flex-shrink-0 px-4 ${itemClassName}`}
          >
            <div className="flex items-center justify-center h-24 w-24">
              <Image
                src={item}
                alt={`Item ${index + 1}`}
                width={100}
                height={100}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

