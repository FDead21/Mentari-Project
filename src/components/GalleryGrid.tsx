'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Define the type for the image data we'll receive
type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

// The component accepts the array of images as a prop
export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(-1);

  // Create an array of slides for the lightbox
  const slides = images.map(image => ({
    src: image.image_url,
    title: image.caption || '',
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, i) => (
          <div
            key={image.id}
            className="relative aspect-square cursor-pointer group"
            onClick={() => setIndex(i)} // Set the index of the clicked image
          >
            <Image
              src={image.image_url}
              alt={image.caption || 'Gallery image'}
              fill
              className="object-cover rounded-lg group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <p className="text-white font-bold">View</p>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </>
  );
}