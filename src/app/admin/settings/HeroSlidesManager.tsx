'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { addHeroSlideAction, deleteHeroSlideAction, type HeroSlide } from './actions';

export default function HeroSlidesManager({ slides }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      const file = event.target.files?.[0];
      if (!file) throw new Error('You must select an image to upload.');

      const fileName = `hero-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('site-assets').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(fileName);
      await addHeroSlideAction(publicUrl);
      router.refresh();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (confirm('Are you sure you want to delete this hero image?')) {
      await deleteHeroSlideAction(slide);
      router.refresh();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Homepage Hero Carousel</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Hero Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={uploading} 
          className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
        />
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {slides.map(slide => (
          <div key={slide.id} className="relative">
            <Image 
              src={slide.image_url} 
              alt={`Hero slide ${slide.id}`}
              width={200}
              height={96}
              className="w-full h-24 object-cover rounded" 
            />
            <button 
              onClick={() => handleDelete(slide)} 
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}