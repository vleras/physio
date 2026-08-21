"use client";

import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import IonIcon from "./IonIcon";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("sidebar");
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  if (products.length === 0) return null;

  return (
    <aside className="products-sidebar-mobile" style={{ width: "100%" }}>
      <div className="sidebar-header" style={{ padding: "1rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
          }}
        >
          {t("products")}
        </h2>
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
            BY
            <Image
              src="/cr7.jpg"
              alt="7"
              width={20}
              height={20}
              className="sidebar-cr7-number"
            />
          </div>
        </div>
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
                  flexBasis: "58%",
                  minWidth: "58%",
                }}
              >
                <Link
                  href={{ pathname: "/product/[id]", params: { id: String(product.id) } }}
                  className="mobile-product-card"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.75rem",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.3s ease",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: 0,
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
                  {/* Product Image — taller portrait like avacr7 */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        overflow: "hidden",
                        backgroundColor: "#f3f4f6",
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
                        sizes="(max-width: 768px) 45vw, 200px"
                      />
                    </div>
                  </div>

                  {/* Title + price only */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2rem",
                      padding: "0.55rem 0.65rem 0.75rem",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        margin: 0,
                        color: "#111111",
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
                        margin: 0,
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        color: "#111111",
                        lineHeight: "1.3",
                      }}
                    >
                      {product.price || "N/A"}
                    </p>
                  </div>
                </Link>
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
          href="/products"
          scroll={true}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
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
          {t("seeMore")}
          <IonIcon name="arrow-forward-outline" size={16} />
        </Link>
      </div>
    </aside>
  );
}
