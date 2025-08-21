import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// This Server Action will handle the form submission
async function addPackage(formData: FormData) {
  'use server';

  const cookieStore = await cookies();
  // This is the correct way to create an authenticated client in a Server Action
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const packageData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    min_participants: Number(formData.get('min_participants')),
    location_id: formData.get('location_id') as string,
    is_featured: formData.get('is_featured') === 'on',
  };

  const { data: newPackage, error } = await supabase
    .from('packages')
    .insert(packageData)
    .select('id')
    .single();

  if (error) {
    // For now, we'll log the error. A real app might redirect with an error message.
    console.error('Error creating package:', error);
    return;
  }

  const activityIds = formData.getAll('activity_ids') as string[];
  const facilityIds = formData.getAll('facility_ids') as string[];

  if (activityIds.length > 0) {
    const packageActivities = activityIds.map(activity_id => ({ package_id: newPackage.id, activity_id }));
    await supabase.from('package_activities').insert(packageActivities);
  }

  if (facilityIds.length > 0) {
    const packageFacilities = facilityIds.map(facility_id => ({ package_id: newPackage.id, facility_id }));
    await supabase.from('package_facilities').insert(packageFacilities);
  }

  revalidatePath('/admin/packages');
  redirect('/admin/packages');
}

// The page component itself fetches the data needed for the form
export default async function AddPackagePage() {
  const cookieStore = await cookies();
  // We need an authenticated client here too, to fetch data
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

  const { data: locations } = await supabase.from('locations').select('id, name');
  const { data: activities } = await supabase.from('activities').select('id, name');
  const { data: facilities } = await supabase.from('facilities').select('id, name');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Package</h1>
      <form action={addPackage} className="max-w-2xl space-y-6">
        {/* Basic Info */}
        <div>
          <label htmlFor="name">Package Name</label>
          <input type="text" name="name" required className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea name="description" rows={4} className="w-full mt-1 p-2 border rounded"></textarea>
        </div>
        <div>
          <label htmlFor="price">Price (Rp)</label>
          <input type="number" name="price" required className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="min_participants">Min. Participants</label>
          <input type="number" name="min_participants" required className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="location_id">Location</label>
          <select name="location_id" required className="w-full mt-1 p-2 border rounded">
            {locations?.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_featured" className="h-4 w-4" />
          <label htmlFor="is_featured" className="ml-2">Feature this package on the homepage?</label>
        </div>

        {/* Activities Checkboxes */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold">Included Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {activities?.map(act => (
              <div key={act.id} className="flex items-center">
                <input type="checkbox" name="activity_ids" value={act.id} className="h-4 w-4" />
                <label className="ml-2">{act.name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities Checkboxes */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold">Included Facilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {facilities?.map(fac => (
              <div key={fac.id} className="flex items-center">
                <input type="checkbox" name="facility_ids" value={fac.id} className="h-4 w-4" />
                <label className="ml-2">{fac.name}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="px-6 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600">
          Save Package
        </button>
      </form>
    </div>
  );
}