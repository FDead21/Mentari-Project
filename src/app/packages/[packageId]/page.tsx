// app/packages/[packageId]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define types for our data
type Package = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  locations: { name: string }[] | null;
  activities: { id: string, name: string }[];
};

// This function receives 'params' which contains the dynamic part of the URL
export default async function PackageDetailPage({ params }: { params: { packageId: string } }) {
  
  // Fetch a single package by its ID, and all its related activities
  const { data: pkg, error } = await supabase
    .from('packages')
    .select(`
      id,
      name,
      description,
      price,
      locations(name),
      activities(id, name)
    `)
    .eq('id', params.packageId) // Get the package where the ID matches the one in the URL
    .single(); // .single() ensures we get one object, not an array

  // If there's an error or the package doesn't exist, show a 404 page
  if (error || !pkg) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Link href="/packages" className="text-blue-500 hover:underline mb-6 block">&larr; Back to all packages</Link>
      
      <h1 className="text-4xl font-bold">{pkg.name}</h1>
      <p className="text-lg text-gray-600 mt-2">
        Location: {pkg.locations?.[0]?.name || 'Not specified'}
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Included Activities:</h2>
        <ul className="list-disc list-inside mt-4 space-y-2">
          {pkg.activities.map(activity => (
            <li key={activity.id}>{activity.name}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8">
        <p className="text-2xl font-bold text-blue-600">
          {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Price upon request'}
        </p>
      </div>
    </div>
  );
}