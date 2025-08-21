import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient"; // Import our Supabase client

// Define a type for our package data, including the nested location name
type Package = {
    id: string;
    name: string;
    price: number | null;
    min_participants: number | null;
    locations: { // This matches the table name Supabase returns
        name: string;
    }[] | null; // Changed to array since Supabase returns an array
};

// This is another async Server Component for fetching data
export default async function PackagesPage() {

    // Fetch data from the 'packages' table
    // With Supabase, you can fetch related data from foreign tables like this:
    // 'locations(name)' tells Supabase to get the 'name' from the linked 'locations' table.
    const { data: packages, error } = await supabase
        .from('packages')
        .select('id, name, price, min_participants, locations(name)');

    // Handle potential errors
    if (error) {
        return <p>Error fetching packages: {error.message}</p>;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Our Service Packages</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages?.map((pkg: Package) => (

                    <Link href={`/packages/${pkg.id}`} key={pkg.id}>

                        <div className="border rounded-lg shadow-sm p-6 flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer">
                            <h2 className="text-2xl font-semibold">{pkg.name}</h2>

                            <p className="text-gray-500 mt-1">
                                Location: {pkg.locations?.[0]?.name || 'Not specified'}
                            </p>

                            <div className="mt-4 flex-grow">
                                <p className="text-lg font-bold text-blue-600">
                                    {pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Price upon request'}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Minimum {pkg.min_participants || '?'} participants
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}