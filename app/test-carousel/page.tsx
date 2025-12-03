"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/carousel";
import Autoplay from "embla-carousel-autoplay";
import ContinuousCarousel from "@/components/ContinuousCarousel";
import VerticalContinuousCarousel from "@/components/VerticalContinuousCarousel";
import VerticalProductCarousel from "@/components/VerticalProductCarousel";
import { getProducts } from "@/lib/getProducts";

interface SupabaseProduct {
  id: number;
  name: string;
  price: string;
  description_1?: string;
  description_2?: string;
  description_3?: string;
  images?: string[];
}

export default function TestCarouselPage() {
  const [logos, setLogos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<SupabaseProduct[]>([]);

  useEffect(() => {
    const fetchTeamLogos = async () => {
      try {
        const response = await fetch("/api/teamlogos");
        const data = await response.json();
        if (data.images && Array.isArray(data.images)) {
          setLogos(data.images);
        }
      } catch (error) {
        console.error("Error fetching team logos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 6)); // Get first 6 products like sidebar
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    fetchTeamLogos();
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Carousel Test Page
        </h1>

        {/* Basic Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Basic Carousel</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {logos.length > 0 ? (
                  logos.map((logo, index) => (
                    <CarouselItem
                      key={`${logo}-${index}`}
                      className="basis-1/3"
                    >
                      <div className="p-2">
                        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                          <Image
                            src={logo}
                            alt={`Logo ${index + 1}`}
                            width={120}
                            height={120}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                ) : isLoading ? (
                  <CarouselItem className="basis-full">
                    <div className="flex items-center justify-center h-32">
                      <p>Loading...</p>
                    </div>
                  </CarouselItem>
                ) : (
                  <CarouselItem className="basis-full">
                    <div className="flex items-center justify-center h-32">
                      <p>No logos available</p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Autoplay Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Autoplay Carousel</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {logos.length > 0 ? (
                  logos.map((logo, index) => (
                    <CarouselItem
                      key={`autoplay-${logo}-${index}`}
                      className="sm:basis-1/4 lg:basis-1/5 pl-4"
                    >
                      <div className="p-2">
                        <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
                          <Image
                            src={logo}
                            alt={`Logo ${index + 1}`}
                            width={100}
                            height={100}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                ) : isLoading ? (
                  <CarouselItem className="basis-full">
                    <div className="flex items-center justify-center h-24">
                      <p>Loading...</p>
                    </div>
                  </CarouselItem>
                ) : (
                  <CarouselItem className="basis-full">
                    <div className="flex items-center justify-center h-24">
                      <p>No logos available</p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Single Item Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Single Item Carousel</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {logos.length > 0 ? (
                  logos.slice(0, 5).map((logo, index) => (
                    <CarouselItem
                      key={`single-${logo}-${index}`}
                      className="basis-full"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                          <Image
                            src={logo}
                            alt={`Logo ${index + 1}`}
                            width={200}
                            height={200}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))
                ) : isLoading ? (
                  <CarouselItem className="basis-full">
                    <div className="flex items-center justify-center h-64">
                      <p>Loading...</p>
                    </div>
                  </CarouselItem>
                ) : (
                  <CarouselItem className="basis-full">
                    <div className="flex items-center justify-center h-64">
                      <p>No logos available</p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Continuous Moving Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Continuous Moving Carousel
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <p>Loading...</p>
              </div>
            ) : logos.length > 0 ? (
              <ContinuousCarousel
                items={logos}
                speed={20}
                direction="left"
                pauseOnHover={true}
                className="py-4"
              />
            ) : (
              <div className="flex items-center justify-center h-24">
                <p>No logos available</p>
              </div>
            )}
          </div>
        </section>

        {/* Continuous Moving Carousel - Faster */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Continuous Moving (Faster)
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <p>Loading...</p>
              </div>
            ) : logos.length > 0 ? (
              <ContinuousCarousel
                items={logos}
                speed={10}
                direction="left"
                pauseOnHover={true}
                className="py-4"
              />
            ) : (
              <div className="flex items-center justify-center h-24">
                <p>No logos available</p>
              </div>
            )}
          </div>
        </section>

        {/* Continuous Moving Carousel - Right Direction */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Continuous Moving (Right Direction)
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <p>Loading...</p>
              </div>
            ) : logos.length > 0 ? (
              <ContinuousCarousel
                items={logos}
                speed={20}
                direction="right"
                pauseOnHover={true}
                className="py-4"
              />
            ) : (
              <div className="flex items-center justify-center h-24">
                <p>No logos available</p>
              </div>
            )}
          </div>
        </section>

        {/* Vertical Continuous Moving Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Vertical Continuous Moving Carousel
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-24">
                <p>Loading...</p>
              </div>
            ) : logos.length > 0 ? (
              <div className="flex justify-center">
                <VerticalContinuousCarousel
                  items={logos}
                  speed={20}
                  direction="up"
                  pauseOnHover={true}
                  className="py-4"
                  maxWidth="700px"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-24">
                <p>No logos available</p>
              </div>
            )}
          </div>
        </section>

        {/* Vertical Continuous Moving Carousel - Down Direction */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Vertical Continuous Moving (Down Direction)
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {products.length === 0 ? (
              <div className="flex items-center justify-center h-24">
                <p>Loading products...</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <VerticalProductCarousel
                  products={products}
                  speed={15}
                  direction="down"
                  pauseOnHover={true}
                  className="py-4"
                  maxWidth="400px"
                  height="600px"
                />
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Carousel Info</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Total Logos:</strong> {logos.length}
            </p>
            <p>
              <strong>Status:</strong> {isLoading ? "Loading..." : "Loaded"}
            </p>
            <div className="mt-4">
              <strong>Features Tested:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Basic carousel with navigation arrows</li>
                <li>Autoplay functionality (2 second delay)</li>
                <li>Loop mode</li>
                <li>Drag free scrolling</li>
                <li>Responsive breakpoints</li>
                <li>Single item display</li>
                <li>Continuous moving carousel (smooth infinite scroll)</li>
                <li>Pause on hover</li>
                <li>Customizable speed and direction</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
