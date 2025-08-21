import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define types for our data
type Package = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  locations: { name: string }; // Remove the | null since your data shows it exists
  activities: { id: string, name: string }[];
  facilities: { id: string, name: string }[];
};

// This function receives 'params' which contains the dynamic part of the URL
export default async function PackageDetailPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch a single package by its ID, and all its related activities/facilities
  const { data: pkg, error } = await supabase
    .from('packages')
    .select(`
      id,
      name,
      description,
      price,
      locations(name),
      activities(id, name),
      facilities(id, name)
    `)
    .eq('id', packageId) // Get the package where the ID matches the one in the URL
    .single(); // .single() ensures we get one object, not an array

  // If there's an error or the package doesn't exist, show a 404 page
  if (error || !pkg) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/packages" className="text-blue-500 hover:underline mb-6 block">&larr; Back to all packages</Link>
      
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold">{pkg.name}</h1>
        <p className="text-lg text-gray-600 mt-2">
          Location: {(pkg.locations as unknown as { name: string })?.name || 'Not specified'}
        </p>
        <p className="text-2xl font-bold text-blue-600 mt-4">
          {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Price upon request'}
        </p>
        <p className="text-md text-gray-500 mt-2">{pkg.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-2xl font-semibold">Included Activities:</h2>
            <ul className="list-disc list-inside mt-4 space-y-2">
              {pkg.activities.map(activity => (
                <li key={activity.id}>{activity.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Included Facilities:</h2>
            <ul className="list-disc list-inside mt-4 space-y-2">
              {pkg.facilities.map(facility => (
                <li key={facility.id}>{facility.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}