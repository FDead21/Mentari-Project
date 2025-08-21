import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import HomepageCarousel from '@/components/HomepageCarousel';
import TestimonialCarousel from '@/components/TestimonialCarousel'; // Import the new component

// Define more detailed types for our data
type Package = {
  id: string;
  name: string;
  price: number | null;
  locations: { cover_image_url: string | null } | null;
  activities: { name: string }[];
  facilities: { name: string }[];
};

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

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // Fetch all necessary data in parallel
  const [packagesRes, testimonialsRes, galleryRes] = await Promise.all([
    supabase
      .from('packages')
      .select('id, name, price, locations(cover_image_url), activities(name), facilities(name)')
      .eq('is_featured', true)
      .limit(4),
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .limit(5), // Fetch a few more for the carousel
    supabase.from('gallery_images').select('*').limit(10)
  ]);
  
  const featuredPackages = packagesRes.data as Package[] | null;
  const testimonials = testimonialsRes.data as Testimonial[] | null;
  const galleryImages = galleryRes.data as GalleryImage[] | null;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold">Your Adventure Awaits</h1>
        <p className="text-lg md:text-xl text-gray-600 mt-4">Unforgettable Outbound Experiences in Bandung</p>
        <Link href="/packages" className="mt-8 inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition-transform hover:scale-105">
          Explore Our Packages
        </Link>
      </section>

      {/* Featured Packages Section (no changes here) */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPackages?.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg shadow-lg flex flex-col overflow-hidden">
              {pkg.locations?.cover_image_url && (
                <div className="relative w-full h-48">
                  <Image src={pkg.locations.cover_image_url} alt={pkg.name} fill className="object-cover" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <p className="text-2xl font-bold text-red-500 my-2">
                  {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Contact Us'}
                  <span className="text-sm font-normal text-gray-500"> / Pax</span>
                </p>
                <ul className="space-y-2 text-gray-600 mt-4 flex-grow">
                  {[...pkg.activities, ...pkg.facilities].slice(0, 5).map(item => ( // Show max 5 items
                    <li key={item.name} className="flex items-center gap-2">
                      <span className="text-green-500">✔</span> {item.name}
                    </li>
                  ))}
                </ul>
                <Link href={`/packages/${pkg.id}`} className="mt-6 block bg-green-500 text-white text-center font-bold py-2 px-4 rounded-md hover:bg-green-600">
                  Click Here
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Carousel Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Our Moments</h2>
          <HomepageCarousel images={galleryImages} />
        </section>
      )}

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16 rounded-lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-10">What Our Clients Say</h2>
          {/* Replace the static grid with the new carousel */}
          <TestimonialCarousel testimonials={testimonials || []} />
        </div>
      </section>
    </div>
  );
}