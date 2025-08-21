// components/InteractiveMap.tsx

'use client'; 

import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

type Location = {
  id: string;
  name: string;
  coordinate_x: number | null;
  coordinate_y: number | null;
};

export default function InteractiveMap({ locations }: { locations: Location[] }) {
  return (
    <div className="relative border rounded-lg overflow-hidden">
      <TransformWrapper>
        {/* 1. Add an aspect-ratio class here. 'aspect-video' is 16:9. 
            You can use 'aspect-[4/3]' for a 4:3 ratio if it fits your image better. */}
        <TransformComponent wrapperClass="!w-full" contentClass="!w-full aspect-[4/3]">
          
          {/* 2. Remove the fixed width and height from this div. */}
          <div className="relative w-full h-full"> 
            <Image
              src="/west_java.png" 
              alt="Map of West Java"
              layout="fill" // Use layout="fill" for responsive images
              objectFit="contain" // Use "contain" to ensure the whole map is visible
            />
            
            {/* ... your code for the dots remains the same ... */}
            {locations.map((location) => (
              location.coordinate_x && location.coordinate_y && (
                <div
                  key={location.id}
                  className="absolute group"
                  style={{
                    // We need to use percentages for responsive positioning
                    left: `${(location.coordinate_x / 706) * 100}%`,
                    top: `${(location.coordinate_y / 546) * 100}%`,
                  }}
                >
                  <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white cursor-pointer transition-transform group-hover:scale-125 -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-white text-black text-sm font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap -translate-x-1/2">
                    {location.name}
                  </div>
                </div>
              )
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}