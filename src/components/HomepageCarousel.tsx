'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

export default function HomepageCarousel({ images }: { images: GalleryImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = images.map(image => ({
    src: image.image_url,
    alt: image.caption || 'Gallery image',
  }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <>
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div 
                className="relative flex-[0_0_100%] aspect-square md:aspect-video cursor-pointer" 
                key={image.id}
                onClick={() => openLightbox(index)} // Make the slide clickable
              >
                <Image
                  src={image.image_url}
                  alt={image.caption || 'Gallery image'}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-1 md:p-2 rounded-full z-10 transition-colors"
          onClick={scrollPrev}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-1 md:p-2 rounded-full z-10 transition-colors"
          onClick={scrollNext}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* The Lightbox component for fullscreen view */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentIndex}
        slides={slides}
      />
    </>
  );
}