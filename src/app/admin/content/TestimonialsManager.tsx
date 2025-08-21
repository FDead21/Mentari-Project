'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { addTestimonialAction, deleteTestimonialAction, type TestimonialData } from './actions';

type Testimonial = {
  id: string;
  client_name: string;
  company_name: string | null;
  quote: string;
  is_published: boolean;
  client_image_url: string | null;
};

export default function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quote, setQuote] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await deleteTestimonialAction(id, imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    let imageUrl: string | null = null;

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('testimonial-images')
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('testimonial-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const testimonialData: TestimonialData = {
        client_name: clientName,
        company_name: companyName,
        quote,
        is_published: isPublished,
        client_image_url: imageUrl,
      };

      await addTestimonialAction(testimonialData);

      // Reset form
      setClientName('');
      setCompanyName('');
      setQuote('');
      setIsPublished(true);
      setFile(null);
      (e.target as HTMLFormElement).reset();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Testimonials</h2>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md mb-8">
        <h3 className="font-semibold">Add New Testimonial</h3>
        <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" required className="w-full p-2 border rounded" />
        <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name (optional)" className="w-full p-2 border rounded" />
        <textarea value={quote} onChange={e => setQuote(e.target.value)} placeholder="Quote" required rows={3} className="w-full p-2 border rounded" />
        <div>
          <label className="text-sm font-medium text-gray-700">Client Image</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="h-4 w-4" />
          <label className="ml-2">Publish this testimonial?</label>
        </div>
        <button type="submit" disabled={uploading} className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400">
          {uploading ? 'Saving...' : 'Add Testimonial'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      <ul className="space-y-4">
        {testimonials.map(t => (
          <li key={t.id} className="flex justify-between items-center p-2 border-b">
            <div className="flex items-center gap-4">
              {t.client_image_url && <img src={t.client_image_url} alt={t.client_name} className="w-12 h-12 rounded-full object-cover" />}
              <div>
                <p className="font-semibold">{t.client_name}</p>
                <p className="text-sm text-gray-600 italic">"{t.quote}"</p>
              </div>
            </div>
            <button onClick={() => handleDelete(t.id, t.client_image_url)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}