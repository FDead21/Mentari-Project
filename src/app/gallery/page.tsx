// app/gallery/page.tsx

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image'; // We'll use the Next.js Image component for optimization

// Define types for our data
type Testimonial = {
  id: string;
  quote: string;
  client_name: string;
  company_name: string | null;
};

type Location = {
  id: string;
  name: string;
  cover_image_url: string | null;
};

export default async function GalleryPage() {
  // To be more efficient, we can fetch both sets of data in parallel
  const [testimonialsRes, locationsRes] = await Promise.all([
    supabase.from('testimonials').select('*').eq('is_published', true),
    supabase.from('locations').select('id, name, cover_image_url')
  ]);
  
  const testimonials = testimonialsRes.data as Testimonial[] | null;
  const locations = locationsRes.data as Location[] | null;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Testimonials Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h1>
        <div className="space-y-8 max-w-3xl mx-auto">
          {testimonials?.map((testimonial) => (
            <blockquote key={testimonial.id} className="p-6 border-l-4 border-orange-500 bg-gray-50">
              <p className="text-lg italic text-gray-700">&quot;{testimonial.quote}&quot;</p>
              <cite className="block font-semibold mt-4 text-gray-800">
                - {testimonial.client_name}
                {testimonial.company_name && `, ${testimonial.company_name}`}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations?.map((location) => (
            location.cover_image_url && (
              <div key={location.id} className="relative aspect-square">
                {/* For a real project, you would upload images to Supabase Storage */}
                {/* For now, you can add placeholder URLs to your database */}
                <Image
                  src={location.cover_image_url}
                  alt={location.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )
          ))}
        </div>
      </section>
    </div>
  );
}