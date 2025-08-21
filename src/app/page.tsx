// app/page.tsx
import './globals.css';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// Define types for our data
type Package = {
  id: string;
  name: string;
  price: number | null;
  locations: { name: string }[] | null;
};

type Testimonial = {
  id: string;
  quote: string;
  client_name: string;
  company_name: string | null;
};

export default async function HomePage() {
  // We'll run two separate queries to get our data
  const { data: featuredPackages } = await supabase
    .from('packages')
    .select('id, name, price, locations(name)')
    .eq('is_featured', true) // Only get packages marked as featured
    .limit(3); // Get a maximum of 3

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('id, quote, client_name, company_name')
    .eq('is_published', true) // Only get published testimonials
    .limit(3);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold">Your Adventure Awaits</h1>
        <p className="text-xl text-gray-600 mt-4">Unforgettable Outbound Experiences in Bandung</p>
        <Link href="/packages" className="mt-8 inline-block bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600">
          Explore Our Packages
        </Link>
      </section>

      {/* Featured Packages Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages?.map((pkg: Package) => (
            <Link href={`/packages/${pkg.id}`} key={pkg.id}>
              <div className="border rounded-lg shadow-sm p-6 h-full hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-semibold">{pkg.name}</h3>
                <p className="text-gray-500 mt-1">{pkg.locations?.[0]?.name}</p>
                <p className="text-lg font-bold text-blue-600 mt-4">
                  {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Contact for price'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">What Our Clients Say</h2>
          <div className="mt-8 space-y-8">
            {testimonials?.map((testimonial: Testimonial) => (
              <blockquote key={testimonial.id} className="max-w-2xl mx-auto">
                <p className="text-lg italic">"{testimonial.quote}"</p>
                <cite className="block font-semibold mt-4">
                  {testimonial.client_name}
                  {testimonial.company_name && `, ${testimonial.company_name}`}
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}