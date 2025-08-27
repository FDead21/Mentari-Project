'use client';

import React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

type HeroSlide = {
  image_url: string;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  // Initialize the carousel with a 5-second delay for autoplay
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {slides.map((slide, index) => (
          <div className="relative flex-[0_0_100%] h-full" key={index}>
            <Image
              src={slide.image_url}
              alt={`Hero background ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0} // Prioritize loading the first image
            />
          </div>
        ))}
      </div>
    </div>
  );
}