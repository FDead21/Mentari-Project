import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import HomepageCarousel from '@/components/HomepageCarousel'; // Reuse the carousel

export default async function LocationDetailPage({ params }: { params: { locationId: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: location } = await supabase
    .from('locations')
    .select('*, location_images(*)')
    .eq('id', params.locationId)
    .single();

  if (!location) {
    notFound();
  }

  const galleryImages = location.location_images.map((img: { id: any; image_url: any; }) => ({
    id: img.id,
    image_url: img.image_url,
    caption: location.name,
  }));

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/locations" className="text-blue-500 hover:underline mb-6 block">&larr; Back to all locations</Link>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {galleryImages.length > 0 && (
          <HomepageCarousel images={galleryImages} />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold">{location.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{location.address}</p>
          <p className="text-md text-gray-800 mt-4 whitespace-pre-wrap">{location.description}</p>
        </div>
      </div>
    </div>
  );
}