import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import ImageUploader from './ImageUploader';
import TestimonialsManager from './TestimonialsManager';
import BackButton from '@/components/admin/BackButton';

// --- SERVER ACTIONS ---

async function updateAboutUs(formData: FormData) {
  'use server';
  const content = formData.get('about_content') as string;
  const imageFile = formData.get('about_image') as File;
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  await supabase.from('site_content').update({ content_value: content }).eq('content_key', 'about_us_content');

  if (imageFile && imageFile.size > 0) {
    const fileName = `about-us-${Date.now()}.${imageFile.name.split('.').pop()}`;
    await supabase.storage.from('site-assets').upload(fileName, imageFile, { upsert: true });
    const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(fileName);
    await supabase.from('site_content').update({ content_value: publicUrl }).eq('content_key', 'about_us_image_url');
  }

  revalidatePath('/admin/content');
  revalidatePath('/about');
}

async function addGalleryImage(imageUrl: string) {
  'use server';
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );
  await supabase.from('gallery_images').insert({ image_url: imageUrl });
  revalidatePath('/admin/content');
  revalidatePath('/gallery');
}

async function deleteGalleryImage(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const imageUrl = formData.get('image_url') as string;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    await supabase.storage.from('gallery-images').remove([fileName]);
  }
  await supabase.from('gallery_images').delete().eq('id', id);
  revalidatePath('/admin/content');
  revalidatePath('/gallery');
}

// --- MAIN PAGE COMPONENT ---

export default async function ManageContentPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: aboutContent } = await supabase.from('site_content').select('*').in('content_key', ['about_us_content', 'about_us_image_url']);
  const aboutContentMap = new Map(aboutContent?.map(s => [s.content_key, s.content_value]));

  const { data: galleryImages } = await supabase.from('gallery_images').select('*');
  const { data: testimonials } = await supabase.from('testimonials').select('*');

  return (
    <div className="container mx-auto p-8 space-y-12">
      <BackButton href="/admin" title="Dashboard" />
      <h1 className="text-3xl font-bold">Manage Website Content</h1>

      {/* About Us Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit &quot;About Us&quot; Page</h2>
        <form action={updateAboutUs}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label>Content</label>
              <textarea name="about_content" rows={10} className="w-full p-2 border rounded mt-1" defaultValue={aboutContentMap.get('about_us_content') || ''} />
            </div>
            <div>
              <label>Image</label>
              {aboutContentMap.get('about_us_image_url') && <img src={aboutContentMap.get('about_us_image_url')} className="w-48 h-48 object-cover rounded my-2" />}
              <input type="file" name="about_image" accept="image/*" className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600">
            Save About Us
          </button>
        </form>
      </div>

      {/* Gallery Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Manage Gallery</h2>
        <ImageUploader addGalleryImageAction={addGalleryImage} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {galleryImages?.map(img => (
            <div key={img.id} className="relative group">
              <img src={img.image_url} alt={img.caption || 'Gallery image'} className="w-full h-40 object-cover rounded" />
              <form action={deleteGalleryImage}>
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="image_url" value={img.image_url} />
                <button type="submit" className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsManager testimonials={testimonials || []} />
    </div>
  );
}