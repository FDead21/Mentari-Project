'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to login page after sign out
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}