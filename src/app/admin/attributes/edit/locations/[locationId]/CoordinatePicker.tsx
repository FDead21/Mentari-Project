'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

type CoordinatePickerProps = {
  initialCoords: { x: number | null; y: number | null };
  onCoordsChange: (coords: { x: number; y: number }) => void;
};

export default function CoordinatePicker({ initialCoords, onCoordsChange }: CoordinatePickerProps) {
  const [markerPosition, setMarkerPosition] = useState(initialCoords);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    // The true, original dimensions of your map image
    const originalImageWidth = 706;
    const originalImageHeight = 546;

    // Get the dimensions of the image as it is currently rendered on the screen
    const rect = mapRef.current.getBoundingClientRect();

    // Calculate the scale factor between the original size and the rendered size
    const scale = originalImageWidth / rect.width;

    // Get the click position relative to the rendered image
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Scale the click coordinates back to the original image's coordinate system
    const x = Math.round(clickX * scale);
    const y = Math.round(clickY * scale);

    setMarkerPosition({ x, y });
    onCoordsChange({ x, y });
  };

  return (
    <div className="relative rounded-lg overflow-hidden cursor-crosshair" ref={mapRef} onClick={handleMapClick}>
      <Image
        src="/west_java.png"
        alt="Map of West Java to pick coordinates"
        width={706}
        height={546}
        className="w-full h-auto"
        priority
      />
      {markerPosition.x !== null && markerPosition.y !== null && (
        <div
          className="absolute w-5 h-5 bg-red-500 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            // The marker position is now scaled down to fit the rendered image
            left: `${(markerPosition.x / 706) * 100}%`,
            top: `${(markerPosition.y / 546) * 100}%`,
          }}
        />
      )}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
        Click on the map to set the location pin.
      </div>
    </div>
  );
}