"use client";

import { useQuery } from "@tanstack/react-query";
import ProductsSidebar from "@/components/ProductsSidebar";
import HeroSlider2 from "@/components/HeroSlider2";
import ProfessionalsCarousel from "@/components/ProfessionalsCarousel";
import TeamsCarousel from "@/components/TeamsCarousel";
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

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.5!2d21.1775131!3d42.6495972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM4JzU4LjYiTiAyMcKwMTAnMzkuMSJF!5e0!3m2!1sen!2s!4v1736789123456!5m2!1sen!2s";

export default function Home() {
  // useScrollAnimation();

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
          <section className="location-section location-section-desktop">
            <div className="container">
              <h2 className="section-title animate-on-scroll">Lokacioni Ynë</h2>
              <p className="location-address animate-on-scroll">
                Adresa: Rruga Valbona, Rruga C
              </p>
              <div className="location-content">
                <div className="map-container animate-on-scroll">
                  <iframe
                    src={MAP_EMBED_URL}
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
          <ProfessionalsCarousel images={PROFESSIONALS_IMAGES} />
        </div>
      </section>

      {/* Teams Carousel Section - Full Width */}
      <TeamsCarousel images={teamsImages} />

      {/* Location/Map Section - Mobile Only */}
      {/* <section className="location-section location-section-mobile">
        <div className="container">
          <h2 className="section-title animate-on-scroll">Lokacioni Ynë</h2>
          <p className="location-address animate-on-scroll">
            Adresa: Rruga Valbona, Rruga C
          </p>
          <div className="location-content">
            <div className="map-container animate-on-scroll">
              <iframe
                src={MAP_EMBED_URL}
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
      </section> */}
    </main>
  );
}
