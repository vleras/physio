"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

interface VerticalProductCarouselProps {
  products: Product[];
  speed?: number;
  direction?: "up" | "down";
  className?: string;
  pauseOnHover?: boolean;
  maxWidth?: string;
  height?: string;
}

export default function VerticalProductCarousel({
  products,
  speed = 20,
  direction = "up",
  className = "",
  pauseOnHover = false,
  maxWidth = "400px",
  height = "600px",
}: VerticalProductCarouselProps) {
  const [duplicatedProducts, setDuplicatedProducts] = useState<Product[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Duplicate products multiple times for seamless infinite scroll
    if (products.length > 0) {
      setDuplicatedProducts([...products, ...products, ...products]);
    }
  }, [products]);

  useEffect(() => {
    if (trackRef.current) {
      const track = trackRef.current;
      const animationName = direction === "up" ? "scroll-up" : "scroll-down";
      const animationDuration = `${speed}s`;
      
      track.style.animation = `${animationName} ${animationDuration} linear infinite`;
      if (pauseOnHover) {
        track.style.animationPlayState = "running";
      }
    }
  }, [speed, direction, pauseOnHover]);

  if (products.length === 0) {
    return (
      <div className={`flex items-center justify-center h-24 ${className}`} style={{ maxWidth }}>
        <p className="text-gray-500">No products to display</p>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ maxWidth, height }}
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
        className="flex flex-col"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
          willChange: "transform",
          animationPlayState: "running",
        }}
      >
        {duplicatedProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 py-4 px-2"
            style={{
              minHeight: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "/images/services/hero1.png"
                    }
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {product.description_1 ||
                      product.description_2 ||
                      product.description_3 ||
                      ""}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mb-2">
                    {product.price}
                  </p>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Shiko Detajet →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

