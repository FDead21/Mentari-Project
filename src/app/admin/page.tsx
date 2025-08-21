import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SignOutButton from './SignOutButton'; 

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });
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
      
      {/* Link to the new package management section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/packages" className="p-8 bg-gray-100 rounded-lg hover:bg-gray-200">
          <h2 className="text-xl font-bold">Manage Packages</h2>
          <p>Add, edit, or delete service packages.</p>
        </Link>
        {/* Add links to manage other content here later */}
      </div>
    </div>
  );
}