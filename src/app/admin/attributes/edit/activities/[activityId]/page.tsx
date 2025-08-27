import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import EditActivityForm from './EditActivityForm'; 
import BackButton from '@/components/admin/BackButton';

export default async function EditActivityPage({ params }: { params: { activityId: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: activity } = await supabase
    .from('activities')
    .select('*, activity_images(*)')
    .eq('id', params.activityId)
    .single();
  
  if (!activity) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8">
      <BackButton href="/admin/attributes" title="Manage Package Attributes" />
      <h1 className="text-3xl font-bold mb-8">Edit Activity: {activity.name}</h1>
      <EditActivityForm activity={activity} />
    </div>
  );
}