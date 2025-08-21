import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';

export default async function ActivitiesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  const { data: activities } = await supabase
    .from('activities')
    .select('id, name, description, activity_images(image_url)')
    .limit(1, { foreignTable: 'activity_images' }); // Get only the first image for the preview

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Activities</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activities?.map(activity => (
          <Link href={`/activities/${activity.id}`} key={activity.id} className="block border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative w-full h-56">
              {activity.activity_images.length > 0 ? (
                <Image src={activity.activity_images[0].image_url} alt={activity.name} fill className="object-cover" />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold">{activity.name}</h2>
              <p className="text-gray-600 mt-2 truncate">{activity.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}