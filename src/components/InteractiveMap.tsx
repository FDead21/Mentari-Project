'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type Location = {
  id: string;
  name: string;
  coordinate_x: number | null;
  coordinate_y: number | null;
  location_images: { image_url: string }[]; // Update type
};

export default function InteractiveMap({ locations }: { locations: Location[] }) {
  const imageWidth = 706;
  const imageHeight = 546;

  return (
    <div className="relative rounded-lg overflow-hidden">
      <TransformWrapper>
        <TransformComponent wrapperClass="!w-full" contentClass="!w-full aspect-[4/3]">
          <div className="relative w-full h-full">
            <Image src="/west_java.png" alt="Map of West Java" layout="fill" objectFit="contain" priority />
            {locations.map((location) => (
              location.coordinate_x && location.coordinate_y && (
                <Link
                  href={`/locations/${location.id}`}
                  key={location.id}
                  className="absolute group"
                  style={{
                    left: `${(location.coordinate_x / imageWidth) * 100}%`,
                    top: `${(location.coordinate_y / imageHeight) * 100}%`,
                  }}
                >
                  <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white cursor-pointer transition-transform group-hover:scale-125 -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-white rounded-lg shadow-lg overflow-hidden w-128 -translate-x-1/2">
                    {location.location_images.length > 0 && (
                      <div className="relative w-full h-64">
                        <Image src={location.location_images[0].image_url} alt={location.name} fill className="object-cover" />
                      </div>
                    )}
                    <p className="text-black text-sm font-bold p-2 text-center">{location.name}</p>
                  </div>
                </Link>
              )
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}