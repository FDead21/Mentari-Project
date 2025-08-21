// app/locations/page.tsx

import { supabase } from "@/lib/supabaseClient";
import InteractiveMap from "@/components/InteractiveMap"; // 1. Import the new component

// Define a more complete type for our location data
type Location = {
  id: string;
  name: string;
  description: string | null;
  coordinate_x: number | null;
  coordinate_y: number | null;
};

export default async function LocationsPage() {
  // We now need to select the coordinates as well
  const { data: locations, error } = await supabase
    .from('locations')
    .select('id, name, description, coordinate_x, coordinate_y');

  if (error || !locations) {
    return <p>Error fetching locations.</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Outbound Locations</h1>
      
      {/* 2. Replace the old placeholder with the InteractiveMap component */}
      <div className="mb-8">
        <p className="mb-2 text-gray-600">Click, drag, and scroll to explore our locations on the map.</p>
        <InteractiveMap locations={locations} />
      </div>

      {/* The list of locations remains the same */}
      <div className="space-y-4">
        {locations.map((location) => (
          <div key={location.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{location.name}</h2>
            <p className="text-gray-600 mt-1">{location.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}