import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import BackButton from '@/components/admin/BackButton';

// --- SERVER ACTIONS ---
async function addAttribute(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const table = formData.get('table') as string;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });
  await supabase.from(table).insert({ name });
  revalidatePath('/admin/attributes');
}

async function deleteAttribute(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const table = formData.get('table') as string;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });
  await supabase.from(table).delete().eq('id', id);
  revalidatePath('/admin/attributes');
}

// --- MANAGEMENT SECTION COMPONENT ---
type Attribute = { id: string; name: string; };
type ManagementSectionProps = { title: string; tableName: 'locations' | 'activities' | 'facilities'; attributes: Attribute[]; };

function ManagementSection({ title, tableName, attributes }: ManagementSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <form action={addAttribute} className="flex gap-2 mb-4">
        <input type="hidden" name="table" value={tableName} />
        <input type="text" name="name" placeholder={`New ${title} Name`} required className="flex-grow p-2 border rounded" />
        <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">Add</button>
      </form>
      <ul className="space-y-2">
        {attributes.map(attr => (
          <li key={attr.id} className="flex justify-between items-center p-2 border-b">
            <span>{attr.name}</span>
            <div className="flex items-center gap-4">
              {/* Add Edit link for locations and activities */}
              {(tableName === 'locations' || tableName === 'activities') && (
                <Link href={`/admin/attributes/edit/${tableName}/${attr.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm">Edit</Link>
              )}
              <form action={deleteAttribute}>
                <input type="hidden" name="id" value={attr.id} />
                <input type="hidden" name="table" value={tableName} />
                <button type="submit" className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default async function ManageAttributesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });
  const { data: locations } = await supabase.from('locations').select('id, name');
  const { data: activities } = await supabase.from('activities').select('id, name');
  const { data: facilities } = await supabase.from('facilities').select('id, name');
  return (
    <div className="container mx-auto p-8">
    <BackButton href="/admin" title="Dashboard" /> 
      <h1 className="text-3xl font-bold mb-8">Manage Package Attributes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ManagementSection title="Locations" tableName="locations" attributes={locations || []} />
        <ManagementSection title="Activities" tableName="activities" attributes={activities || []} />
        <ManagementSection title="Facilities" tableName="facilities" attributes={facilities || []} />
      </div>
    </div>
  );
}