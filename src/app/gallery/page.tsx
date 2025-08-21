import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';
import GalleryGrid from '@/components/GalleryGrid'; // Import the interactive component

type Testimonial = {
  id: string;
  quote: string;
  client_name: string;
  company_name: string | null;
  client_image_url: string | null;
};

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
};

export default async function GalleryPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: testimonials } = await supabase.from('testimonials').select('*').eq('is_published', true);
  const { data: galleryImages } = await supabase.from('gallery_images').select('*');
  
  return (
    <div className="container mx-auto px-6 py-8">
      {/* Testimonials Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h1>
        <div className="space-y-8 max-w-3xl mx-auto">
          {testimonials?.map((testimonial: Testimonial) => (
            <blockquote key={testimonial.id} className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-4">
                {testimonial.client_image_url && (
                  <img src={testimonial.client_image_url} alt={testimonial.client_name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-200" />
                )}
                <div>
                  <p className="text-lg italic text-gray-700">&quot;{testimonial.quote}&quot;</p>
                  <cite className="block font-semibold mt-4 text-gray-800">
                    - {testimonial.client_name}
                    {testimonial.company_name && `, ${testimonial.company_name}`}
                  </cite>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Gallery</h2>
        <GalleryGrid images={galleryImages || []} />
      </section>
    </div>
  );
}