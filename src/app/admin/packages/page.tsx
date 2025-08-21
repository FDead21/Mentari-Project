import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import ActionButtons from './ActionButtons'; 

// Define the delete action
async function deletePackage(formData: FormData) {
  'use server';
  const packageId = formData.get('packageId') as string;
  
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

  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', packageId);

  if (error) {
    console.error('Error deleting package:', error);
    return;
  }

  revalidatePath('/admin/packages');
  redirect('/admin/packages');
}

export default async function ManagePackagesPage() {
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

  const { data: packages, error } = await supabase
    .from('packages')
    .select('id, name, price');

  if (error) {
    return <p>Error loading packages.</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Manage Packages</h1>
        <Link href="/admin/packages/add" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 w-full sm:w-auto text-center">
          + Add New Package
        </Link>
      </div>
      {/* Responsive Table Container */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages?.map((pkg) => (
              <tr key={pkg.id}>
                <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pkg.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ActionButtons packageId={pkg.id} deletePackageAction={deletePackage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}