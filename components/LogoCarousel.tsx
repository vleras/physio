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
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

interface LogoCarouselProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const LogoCarousel = ({ logos }: { logos: string[] }) => {
  return (
    <div className="w-full">
      <div className="container px-4 my-2">
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
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2">
            {logos.map((logo, index) => (
              <CarouselItem
                key={`${logo}-${index}`}
                className="sm:basis-1/4 lg:basis-1/5 3xl:basis-1/6 pl-2"
              >
                <div className="p-1">
                  <div className="flex items-center justify-center h-24">
                    <Image
                      src={logo || "/placeholder.svg"}
                      alt={`Logo ${index + 1}`}
                      width={100}
                      height={100}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0">
            <CarouselPrevious className="left-0 -translate-x-1/2" />
            <CarouselNext className="right-0 translate-x-1/2" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default function LogoCarousels({
  title = "Our Partners",
  description = "Trusted by leading organizations",
  buttonText = "Contact Us",
  buttonLink = "/services",
}: LogoCarouselProps) {
  const [logos, setLogos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    fetchTeamLogos();
  }, []);

  return (
    <div className="pt-5 pb-24 container">
      <div className="w-full max-w-screen-lg mx-auto flex flex-col items-center space-y-8">
        <div className="flex items-center flex-col gap-1">
          <h2 className="text-2xl md:text-3xl uppercase max-w-xs md:max-w-none text-center font-bold">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-center font-thin">
            {description}
          </p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="w-full h-24 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : logos.length > 0 ? (
          <LogoCarousel logos={logos} />
        ) : null}
      </div>
      <Link href={buttonLink} className="flex justify-center pt-10">
        <Button
          className="rounded-full justify-between gap-4 px-3 py-4 mt-4 bg-black text-white hover:bg-gray-800"
          size="lg"
        >
          <span className="pl-3">{buttonText}</span>
          <ArrowRight
            size={30}
            className="rounded-full p-2 bg-white"
            color="black"
          />
        </Button>
      </Link>
    </div>
  );
}

