import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

// This Server Action handles the form submission for UPDATING a package
async function updatePackage(formData: FormData) {
  'use server';

  const packageId = formData.get('packageId') as string;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 1. Update the main package data
  const packageData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    min_participants: Number(formData.get('min_participants')),
    location_id: formData.get('location_id') as string,
    is_featured: formData.get('is_featured') === 'on',
  };
  await supabase.from('packages').update(packageData).eq('id', packageId);

  // 2. Get the new lists of selected activities and facilities
  const activityIds = formData.getAll('activity_ids') as string[];
  const facilityIds = formData.getAll('facility_ids') as string[];

  // 3. Update relationships (delete old, insert new)
  await supabase.from('package_activities').delete().eq('package_id', packageId);
  if (activityIds.length > 0) {
    const packageActivities = activityIds.map(activity_id => ({ package_id: packageId, activity_id }));
    await supabase.from('package_activities').insert(packageActivities);
  }

  await supabase.from('package_facilities').delete().eq('package_id', packageId);
  if (facilityIds.length > 0) {
    const packageFacilities = facilityIds.map(facility_id => ({ package_id: packageId, facility_id }));
    await supabase.from('package_facilities').insert(packageFacilities);
  }

  revalidatePath('/admin/packages');
  redirect('/admin/packages');
}

// The page component fetches all the data needed for the edit form
export default async function EditPackagePage({ params }: { params: { packageId: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
      },
    }
  );
  
  // Fetch the specific package to edit, including its related activities and facilities
  const { data: pkg } = await supabase
    .from('packages')
    .select('*, package_activities(activity_id), package_facilities(facility_id)')
    .eq('id', params.packageId)
    .single();

  if (!pkg) {
    notFound();
  }

  // Fetch all possible options for the form
  const { data: locations } = await supabase.from('locations').select('id, name');
  const { data: activities } = await supabase.from('activities').select('id, name');
  const { data: facilities } = await supabase.from('facilities').select('id, name');

  // Get the IDs of currently selected activities/facilities to pre-check the boxes
  const selectedActivityIds = new Set(pkg.package_activities.map((pa: { activity_id: any; }) => pa.activity_id));
  const selectedFacilityIds = new Set(pkg.package_facilities.map((pf: { facility_id: any; }) => pf.facility_id));

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Package: {pkg.name}</h1>
      <form action={updatePackage} className="max-w-2xl space-y-6">
        <input type="hidden" name="packageId" value={pkg.id} />
        
        {/* Basic Info */}
        <div>
          <label htmlFor="name">Package Name</label>
          <input type="text" name="name" required defaultValue={pkg.name} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea name="description" rows={4} defaultValue={pkg.description || ''} className="w-full mt-1 p-2 border rounded"></textarea>
        </div>
        <div>
          <label htmlFor="price">Price (Rp)</label>
          <input type="number" name="price" required defaultValue={pkg.price || 0} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="min_participants">Min. Participants</label>
          <input type="number" name="min_participants" required defaultValue={pkg.min_participants || 0} className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="location_id">Location</label>
          <select name="location_id" required defaultValue={pkg.location_id || ''} className="w-full mt-1 p-2 border rounded">
            {locations?.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
          </select>
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_featured" defaultChecked={pkg.is_featured} className="h-4 w-4" />
          <label htmlFor="is_featured" className="ml-2">Feature this package on the homepage?</label>
        </div>

        {/* Activities Checkboxes */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold">Included Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {activities?.map(act => (
              <div key={act.id} className="flex items-center">
                <input type="checkbox" name="activity_ids" value={act.id} defaultChecked={selectedActivityIds.has(act.id)} className="h-4 w-4" />
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
                <input type="checkbox" name="facility_ids" value={fac.id} defaultChecked={selectedFacilityIds.has(fac.id)} className="h-4 w-4" />
                <label className="ml-2">{fac.name}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="px-6 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600">
          Update Package
        </button>
      </form>
    </div>
  );
}