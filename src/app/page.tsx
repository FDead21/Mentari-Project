import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import HomepageCarousel from '@/components/HomepageCarousel';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import ScrollReveal from '@/components/ScrollReveal';
import HeroCarousel from '@/components/HeroCarousel';

// (Keep your type definitions)
type Package = { id: string; name: string; price: number | null; locations: { location_images: { image_url: string }[] } | null; activities: { name: string }[]; facilities: { name: string }[]; };
type Testimonial = { id: string; quote: string; client_name: string; company_name: string | null; client_image_url: string | null; };
type GalleryImage = { id: string; image_url: string; caption: string | null; };
type HeroSlide = { image_url: string; };

export default async function HomePage() {
  // Corrected line: removed 'await'
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  const { data: settings } = await supabase.from('site_content').select('*');
  const settingsMap = new Map(settings?.map(s => [s.content_key, s.content_value]));
  const sectionOrder = settingsMap.get('section_order')?.split(',') || [];

  const [packagesRes, testimonialsRes, galleryRes, heroSlidesRes] = await Promise.all([
    supabase.from('packages').select('id, name, price, locations(location_images(image_url)), activities(name), facilities(name)').eq('is_featured', true).limit(4),
    supabase.from('testimonials').select('*').eq('is_published', true).limit(5),
    supabase.from('gallery_images').select('*').limit(10),
    supabase.from('hero_slides').select('image_url').order('created_at')
  ]);
  
  const featuredPackages = packagesRes.data as Package[] | null;
  const testimonials = testimonialsRes.data as Testimonial[] | null;
  const galleryImages = galleryRes.data as GalleryImage[] | null;
  const heroSlides = heroSlidesRes.data as HeroSlide[] | null;

  const sections: { [key: string]: React.ReactNode } = {
    packages: featuredPackages && (
      <section className="w-full py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-10">Featured Packages</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredPackages.map((pkg, index) => (
              <ScrollReveal key={pkg.id} delay={index * 0.1} className="h-full"> 
                <div className="border rounded-lg shadow-lg flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 h-full">
                  {pkg.locations?.location_images?.[0]?.image_url && (
                    <div className="relative w-full h-48"><Image src={pkg.locations.location_images[0].image_url} alt={pkg.name} fill className="object-cover" /></div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-red-500 my-2">
                      {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Contact Us'}
                      <span className="text-sm font-normal text-gray-500"> / Pax</span>
                    </p>
                    <ul className="space-y-2 text-gray-600 mt-4 flex-grow">
                      {[...pkg.activities, ...pkg.facilities].slice(0, 5).map(item => (
                        <li key={item.name} className="flex items-center gap-2">
                          <span className="text-green-500">✔</span> {item.name}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/packages/${pkg.id}`} className="mt-6 block bg-green-500 text-white text-center font-bold py-2 px-4 rounded-md hover:bg-green-600">Click Here</Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    ),
    moments: galleryImages && galleryImages.length > 0 && (
      <section className="w-full py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-10">Our Moments</h2>
            <HomepageCarousel images={galleryImages} />
          </ScrollReveal>
        </div>
      </section>
    ),
    testimonials: testimonials && testimonials.length > 0 && (
      <section className="w-full bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-10">What Our Clients Say</h2>
            <TestimonialCarousel testimonials={testimonials} />
          </ScrollReveal>
        </div>
      </section>
    ),
  };

  return (
    <>
      <section className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {heroSlides && heroSlides.length > 0 && (
          <HeroCarousel slides={heroSlides} />
        )}
        <div className="absolute inset-0 bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold animate-fade-in-up">{settingsMap.get('hero_title')}</h1>
          <p className="text-lg md:text-xl mt-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>{settingsMap.get('hero_subtitle')}</p>
          <Link href="/packages" className="mt-8 inline-block bg-orange-500 font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition-transform hover:scale-105 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            Explore Our Packages
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </section>

      <div className="flex flex-col items-center w-full">
        {/* Corrected mapping with a unique key */}
        {sectionOrder.map((sectionKey) => (
          <div key={sectionKey} className="w-full">
            {sections[sectionKey]}
          </div>
        ))}
      </div>
    </>
  );
}