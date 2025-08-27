'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import CoordinatePicker from './CoordinatePicker';
import SubmitButton from '@/components/admin/SubmitButton'; 
import toast from 'react-hot-toast'; 

type LocationImage = { id: string; image_url: string; };
type Location = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  coordinate_x: number | null;
  coordinate_y: number | null;
  location_images: LocationImage[] | null;
};

export default function EditLocationForm({ location }: { location: Location }) {
  const router = useRouter();
  const [coords, setCoords] = useState({ x: location.coordinate_x, y: location.coordinate_y });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationImages = location.location_images || [];

  const handleCoordinatesChange = (newCoords: { x: number; y: number }) => {
    setCoords(newCoords);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const promise = new Promise(async (resolve, reject) => {
      const { error: updateError } = await supabase
        .from('locations')
        .update({
          name: formData.get('name') as string,
          address: formData.get('address') as string,
          description: formData.get('description') as string,
          coordinate_x: coords.x,
          coordinate_y: coords.y,
        })
        .eq('id', location.id);

      if (updateError) return reject(updateError); 

      const imageFiles = formData.getAll('images') as File[];
      const filesToUpload = imageFiles.filter(file => file.size > 0);

      if (filesToUpload.length > 0) {
        for (const file of filesToUpload) {
          const fileName = `${location.id}-${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from('location-images').upload(fileName, file);

          if (uploadError) {
            return reject(uploadError); 
          }

          const { data: { publicUrl } } = supabase.storage.from('location-images').getPublicUrl(fileName);
          await supabase.from('location_images').insert({ location_id: location.id, image_url: publicUrl });
        }
      }
      
      resolve('Success');
    });

    toast.promise(promise, {
      loading: 'Saving location...',
      success: () => {
        router.refresh();
        return 'Location saved successfully!'; 
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  const handleDeleteImage = async (image: LocationImage) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const fileName = image.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('location-images').remove([fileName]);
      }
      await supabase.from('location_images').delete().eq('id', image.id);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="name">Location Name</label>
            <input type="text" name="name" required defaultValue={location.name} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input type="text" name="address" defaultValue={location.address || ''} className="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea name="description" rows={4} defaultValue={location.description || ''} className="w-full mt-1 p-2 border rounded"></textarea>
          </div>
           <div>
            <label>Current Images</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {locationImages.length > 0 ? (
                locationImages.map(img => (
                  <div key={img.id} className="relative">
                    <img src={img.image_url} className="w-full h-24 object-cover rounded" />
                    <button type="button" onClick={() => handleDeleteImage(img)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3">No images uploaded yet</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="images">Upload New Images</label>
            <input type="file" name="images" multiple accept="image/*" className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>

        <div className="space-y-4">
          <CoordinatePicker initialCoords={coords} onCoordsChange={handleCoordinatesChange} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="coordinate_x">Coordinate X</label>
              <input type="number" name="coordinate_x" value={coords.x || 0} onChange={(e) => setCoords({...coords, x: parseInt(e.target.value)})} className="w-full mt-1 p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="coordinate_y">Coordinate Y</label>
              <input type="number" name="coordinate_y" value={coords.y || 0} onChange={(e) => setCoords({...coords, y: parseInt(e.target.value)})} className="w-full mt-1 p-2 border rounded" />
            </div>
          </div>
        </div>
      </div>

      <SubmitButton>Update Location</SubmitButton>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
}