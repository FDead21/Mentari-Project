import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SignOutButton from './SignOutButton'; 

export default async function AdminDashboard() {
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
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {session?.user?.email || 'Admin'}!
          </p>
        </div>
        <SignOutButton />
      </div>
      
      {/* Updated links for admin sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/packages" className="p-8 bg-gray-100 rounded-lg hover:bg-gray-200">
          <h2 className="text-xl font-bold">Manage Packages</h2>
          <p>Add, edit, or delete service packages.</p>
        </Link>
        <Link href="/admin/attributes" className="p-8 bg-gray-100 rounded-lg hover:bg-gray-200">
          <h2 className="text-xl font-bold">Manage Attributes</h2>
          <p>Manage locations, activities, and facilities.</p>
        </Link>
        <Link href="/admin/content" className="p-8 bg-gray-100 rounded-lg hover:bg-gray-200">
          <h2 className="text-xl font-bold">Manage Content</h2>
          <p>Edit About Us, Gallery, and Testimonials.</p>
        </Link>
      </div>
    </div>
  );
}