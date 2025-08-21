'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type ImageUploaderProps = {
  addGalleryImageAction: (imageUrl: string) => Promise<void>;
};

export default function ImageUploader({ addGalleryImageAction }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      const file = event.target.files?.[0];
      if (!file) {
        throw new Error('You must select an image to upload.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to the 'gallery-images' bucket
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      // Call the server action to save the URL to the database
      await addGalleryImageAction(publicUrl);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
        Upload a new image
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="mt-1 block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}