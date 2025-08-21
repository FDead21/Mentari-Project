import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import InteractiveMap from '@/components/InteractiveMap';
import Link from 'next/link';

type Location = {
  id: string;
  name: string;
  description: string | null;
  coordinate_x: number | null;
  coordinate_y: number | null;
  location_images: { image_url: string }[]; // Update type
};

export default async function LocationsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // Update query to get the first image for each location
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id, name, description, coordinate_x, coordinate_y, location_images(image_url)')
    .limit(1, { foreignTable: 'location_images' });

  if (error || !locations) {
    return <p>Error fetching locations.</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Outbound Locations</h1>
      <div className="mb-8">
        <p className="mb-2 text-gray-600">Hover to preview, or click a location to see details.</p>
        <InteractiveMap locations={locations} />
      </div>
      <div className="space-y-4">
        {locations.map((location) => (
          <Link href={`/locations/${location.id}`} key={location.id}>
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold">{location.name}</h2>
              <p className="text-gray-600 mt-1 truncate">{location.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}