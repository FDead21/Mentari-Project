import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import HomepageCarousel from '@/components/HomepageCarousel'; // Reuse the carousel

export default async function ActivityDetailPage({ params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { 
    cookies: { 
      get(name: string) { 
        return cookieStore.get(name)?.value; 
      } 
    } 
  });

  const { data: activity } = await supabase
    .from('activities')
    .select('*, activity_images(*)')
    .eq('id', activityId)
    .single();

  if (!activity) {
    notFound();
  }

  const galleryImages = activity.activity_images.map((img: { id: any; image_url: any; }) => ({
    id: img.id,
    image_url: img.image_url,
    caption: activity.name,
  }));

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/activities" className="text-blue-500 hover:underline mb-6 block">&larr; Back to all activities</Link>
      <h1 className="text-4xl font-bold">{activity.name}</h1>
      <p className="text-lg text-gray-600 mt-4 whitespace-pre-wrap">{activity.description}</p>
      
      <div className="mt-12">
        {galleryImages.length > 0 ? (
          <HomepageCarousel images={galleryImages} />
        ) : (
          <p className="text-center text-gray-500">No images available for this activity yet.</p>
        )}
      </div>
    </div>
  );
}