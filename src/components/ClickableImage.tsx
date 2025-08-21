'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type ClickableImageProps = {
  src: string;
  alt: string;
};

export default function ClickableImage({ src, alt }: ClickableImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="relative w-full h-64 md:h-96 cursor-pointer group"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <p className="text-white font-bold text-lg">View Fullscreen</p>
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: src }]}
      />
    </>
  );
}