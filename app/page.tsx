"use client";

import { useQuery } from "@tanstack/react-query";
import ProductsSidebar from "@/components/ProductsSidebar";
import HeroSlider2 from "@/components/HeroSlider2";
import ProfessionalsCarousel from "@/components/ProfessionalsCarousel";
import TeamsCarousel from "@/components/TeamsCarousel";
import LocationSection from "@/components/LocationSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import "./home.css";

const PROFESSIONALS_IMAGES: string[] = [
  "/images/professionals/professionals.webp",
  "/images/professionals/professionals1.webp",
  "/images/professionals/professionals3.jpg",
  "/images/professionals/professionals4.webp",
  "/images/professionals/professionals5.webp",
  "/images/professionals/professionals6.webp",
];

export default function Home() {
  useScrollAnimation();

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
          <div className="location-section-desktop">
            <LocationSection isMobile={false} />
          </div>
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
          <ProfessionalsCarousel images={PROFESSIONALS_IMAGES} />
        </div>
      </section>

      {/* Teams Carousel Section - Full Width */}
      <TeamsCarousel images={teamsImages} />

      {/* Location/Map Section - Mobile Only */}
      <div className="location-section-mobile">
        <LocationSection isMobile={true} />
      </div>
    </main>
  );
}
