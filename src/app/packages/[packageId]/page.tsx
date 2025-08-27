import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomepageCarousel from '@/components/HomepageCarousel';

// Define types for our data - Updated to match Supabase response
type LocationImage = {
  id: string;
  image_url: string;
};

type Location = {
  name: string;
  location_images?: LocationImage[]; // Made optional since it might not always be present
};

type Activity = {
  id: string;
  name: string;
};

type Facility = {
  id: string;
  name: string;
};

type Package = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  locations: Location | null;
  activities: Activity[];
  facilities: Facility[];
};

// This function receives 'params' which contains the dynamic part of the URL
export default async function PackageDetailPage({ params }: { params: Promise<{ packageId: string }> }) {
  // Await params as required by Next.js 15
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

  // Update the query to fetch location images
  const { data: pkg, error } = await supabase
    .from('packages')
    .select(`
      id, name, description, price,
      locations(name, location_images(id, image_url)),
      activities(id, name),
      facilities(id, name)
    `)
    .eq('id', packageId)
    .single();

  if (error || !pkg) {
    notFound();
  }

  // Cast the data to our Package type to ensure type safety
  const packageData = pkg as unknown as Package;

  // Debug: Log the data to see what we're getting
  console.log('Package data:', JSON.stringify(packageData, null, 2));
  console.log('Locations:', packageData.locations);

  // Prepare images for the carousel with safe optional chaining
  const locationImages = packageData.locations?.location_images?.map((img: LocationImage) => ({
    id: img.id,
    image_url: img.image_url,
    caption: packageData.locations?.name || 'Location image',
  })) || [];
  
  console.log('Location images:', locationImages);

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/packages" className="text-blue-500 hover:underline mb-6 block">&larr; Back to all packages</Link>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Add the location image carousel here */}
        {locationImages.length > 0 && (
          <div className="mb-8">
            <HomepageCarousel images={locationImages} />
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-4xl font-bold">{packageData.name}</h1>
          <p className="text-lg text-gray-600 mt-2">
            Location: {packageData.locations?.name || 'Not specified'}
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-4">
            {packageData.price ? `Rp ${packageData.price.toLocaleString('id-ID')}` : 'Price upon request'}
          </p>
          <p className="text-md text-gray-500 mt-2">{packageData.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-2xl font-semibold">Included Activities:</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                {packageData.activities.map(activity => (
                  <li key={activity.id}>{activity.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Included Facilities:</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                {packageData.facilities.map(facility => (
                  <li key={facility.id}>{facility.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}