import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import EditLocationForm from './EditLocationForm';

export default async function EditLocationPage({ params }: { params: Promise<{ locationId: string }> }) {
  const { locationId } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  // Update the query to fetch the related images
  const { data: location } = await supabase
  .from('locations')
  .select(`
    *,
    location_images (
      id,
      image_url
    )
  `)
  .eq('id', locationId)
  .single();

  if (!location) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Location: {location.name}</h1>
      <EditLocationForm location={location} />
    </div>
  );
}