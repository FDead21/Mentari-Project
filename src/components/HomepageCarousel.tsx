'use client';

import Lightbox from 'yet-another-react-lightbox';
import Inline from "yet-another-react-lightbox/plugins/inline";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

export default function HomepageCarousel({ images }: { images: GalleryImage[] }) {
  const slides = images.map(image => ({
    src: image.image_url,
    alt: image.caption || 'Gallery image',
  }));

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Lightbox
        plugins={[Inline, Slideshow, Thumbnails]}
        inline={{
          style: { 
            width: "100%", 
            maxWidth: "1000px", 
            aspectRatio: "16 / 9",
            margin: "0 auto"
          },
        }}
        slideshow={{ autoplay: true, delay: 3000 }}
        thumbnails={{ showToggle: true }}
        slides={slides}
      />
    </div>
  );
}