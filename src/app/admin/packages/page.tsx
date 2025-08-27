import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import ActionButtons from './ActionButtons'; 
import BackButton from '@/components/admin/BackButton';

async function deletePackage(formData: FormData) {
  'use server';
  const packageId = formData.get('packageId') as string;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });
  await supabase.from('packages').delete().eq('id', packageId);
  revalidatePath('/admin/packages');
  redirect('/admin/packages');
}

export default async function ManagePackagesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: packages, error } = await supabase.from('packages').select('id, name, price');

  if (error) {
    return <p>Error loading packages.</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <BackButton href="/admin" title="Dashboard" />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Packages</h1>
        <Link 
          href="/admin/packages/add" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          <span>Add New Package</span>
        </Link>
      </div>
      
      {/* Improved Table Container */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
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
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{pkg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">Rp {pkg.price?.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionButtons packageId={pkg.id} deletePackageAction={deletePackage} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}