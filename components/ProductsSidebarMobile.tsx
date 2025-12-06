"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/carousel";

interface SupabaseProduct {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

interface ProductsSidebarMobileProps {
  products: SupabaseProduct[];
}

export default function ProductsSidebarMobile({
  products,
}: ProductsSidebarMobileProps) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  if (products.length === 0) return null;

  return (
    <aside className="products-sidebar-mobile" style={{ width: "100%" }}>
      <div className="sidebar-header" style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/avalogo.svg"
              alt="AVA Logo"
              width={100}
              height={70}
              className="sidebar-logo-image"
              priority
            />
          </div>
          <div className="sidebar-cr7">
            BY CR
            <Image
              src="/7.png"
              alt="7"
              width={20}
              height={20}
              className="sidebar-cr7-number"
            />
          </div>
        </div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginTop: "0.5rem",
          }}
        >
          Produktet
        </h2>
      </div>

      {/* Carousel with navigation buttons */}
      <div style={{ position: "relative", padding: "0 1rem 1rem" }}>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          style={{ width: "100%" }}
        >
          <CarouselContent style={{ marginLeft: "-0.5rem" }}>
            {[...products].reverse().map((product) => (
              <CarouselItem
                key={product.id}
                style={{
                  paddingLeft: "0.5rem",
                  flexBasis: "calc(50% - 0.25rem)",
                  minWidth: "calc(50% - 0.25rem)",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    padding: "0.75rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      flexShrink: 0,
                      marginBottom: "0.5rem",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "150px",
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <Image
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "/images/services/hero1.png"
                        }
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="100vw"
                      />
                    </div>
                  </div>

                  {/* Product Content */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        marginBottom: "0.375rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.25",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#4b5563",
                        marginBottom: "0.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        flexGrow: 1,
                        lineHeight: "1.25",
                      }}
                    >
                      {product.description_1 ||
                        product.description_2 ||
                        product.description_3 ||
                        ""}
                    </p>
                    <Link
                      href={`/product/${product.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        color: "#000000",
                        border: "none",
                        borderRadius: "0.375rem",
                        padding: "0.375rem 0.75rem 0.375rem 0",
                        marginTop: "auto",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#000000";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#000000";
                      }}
                    >
                      Shiko Detajet
                      <svg
                        style={{
                          marginLeft: "0.5rem",
                          width: "1rem",
                          height: "1rem",
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            style={{
              left: "-0.5rem",
              height: "2.5rem",
              width: "2.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #d1d5db",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";
            }}
          />
          <CarouselNext
            style={{
              right: "-0.5rem",
              height: "2.5rem",
              width: "2.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #d1d5db",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";
            }}
          />
        </Carousel>
      </div>

      {/* See More Button */}
      <div
        style={{
          padding: "0.5rem 1rem 1rem",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Link
          href="/catalog"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            background: "linear-gradient(to right, #000000, #1f2937)",
            color: "#ffffff",
            borderRadius: "0.5rem",
            fontWeight: "600",
            textDecoration: "none",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #1f2937, #000000)";
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(to right, #000000, #1f2937)";
            e.currentTarget.style.boxShadow =
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
          }}
        >
          Shiko Më Shumë
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
