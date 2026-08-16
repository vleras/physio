"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import "./services.css";

export default function Services() {
  const t = useTranslations("services");

  const serviceKeys = [
    "womensHealth",
    "postSurgery",
    "tmj",
    "vertigo",
    "sports",
    "acupuncture",
    "spine",
    "chiropractic",
  ] as const;

  const services = serviceKeys.map((key) => ({
    title: t(`${key}.title`),
    description: t(`${key}.description`),
  }));

  // Split services into two groups
  const firstGroup = services.slice(0, 4);
  const secondGroup = services.slice(4, 8);

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

  return (
    <main className="main-content">
      {/* Alternating Sections */}
      <section className="page-section services-flow">
        <div className="container">
          <h1
            className="page-title animate-on-scroll"
            style={{ marginBottom: "3rem", textAlign: "center" }}
          >
            {t("pageTitle")}
          </h1>
          {/* First Section: Content Left, Image Right */}
          <div className="service-layout">
            <div className="service-layout__content animate-on-scroll">
              <ul className="service-list">
                {firstGroup.map((service, index) => (
                  <li
                    key={index}
                    className="service-list__item"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <h3>
                      <span className="service-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>{" "}
                      {service.title}
                    </h3>
                    <p>{service.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="service-layout__image animate-on-scroll">
              <Image
                src="/images/hero7.jpg"
                alt={t("imageAlt")}
                fill
                className="service-layout__image-el"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Second Section: Image Left, Content Right */}
          <div className="service-layout">
            <div className="service-layout__image animate-on-scroll">
              <Image
                src="/images/hero8.jpg"
                alt={t("imageAlt")}
                fill
                className="service-layout__image-el"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="service-layout__content animate-on-scroll">
              <ul className="service-list">
                {secondGroup.map((service, index) => (
                  <li
                    key={index}
                    className="service-list__item"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <h3>
                      <span className="service-number">
                        {String(index + 5).padStart(2, "0")}
                      </span>{" "}
                      {service.title}
                    </h3>
                    <p>{service.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
