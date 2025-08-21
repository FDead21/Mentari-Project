'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

type ActivityImage = { id: string; image_url: string; };
type Activity = {
  id: string;
  name: string;
  description: string | null;
  activity_images: ActivityImage[];
};

export default function EditActivityForm({ activity }: { activity: Activity }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    
    // 1. Update text fields
    await supabase
      .from('activities')
      .update({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
      })
      .eq('id', activity.id);

    // 2. Handle multiple file uploads
    const imageFiles = formData.getAll('images') as File[];
    const filesToUpload = imageFiles.filter(file => file.size > 0);

    if (filesToUpload.length > 0) {
      for (const file of filesToUpload) {
        const fileName = `${activity.id}-${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('activity-images').upload(fileName, file);

        if (uploadError) {
          setError(`Error uploading ${file.name}: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage.from('activity-images').getPublicUrl(fileName);
        await supabase.from('activity_images').insert({ activity_id: activity.id, image_url: publicUrl });
      }
    }

    router.refresh();
    setIsSubmitting(false);
  };

  const handleDeleteImage = async (image: ActivityImage) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const fileName = image.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('activity-images').remove([fileName]);
      }
      await supabase.from('activity_images').delete().eq('id', image.id);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="name">Activity Name</label>
        <input type="text" name="name" required defaultValue={activity.name} className="w-full mt-1 p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea name="description" rows={6} defaultValue={activity.description || ''} className="w-full mt-1 p-2 border rounded"></textarea>
      </div>
      <div>
        <label>Current Images</label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {activity.activity_images.map(img => (
            <div key={img.id} className="relative">
              <img src={img.image_url} className="w-full h-24 object-cover rounded" />
              <button type="button" onClick={() => handleDeleteImage(img)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="images">Upload New Images</label>
        <input type="file" name="images" multiple accept="image/*" className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
      <button type="submit" disabled={isSubmitting} className="px-6 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400">
        {isSubmitting ? 'Saving...' : 'Update Activity'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
}