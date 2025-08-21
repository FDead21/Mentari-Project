'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Define the type here so both files can use it
export type TestimonialData = {
  client_name: string;
  company_name: string | null;
  quote: string;
  is_published: boolean;
  client_image_url: string | null;
};

// Action for deleting a testimonial
export async function deleteTestimonialAction(id: string, imageUrl: string | null) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  if (imageUrl) {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      await supabase.storage.from('testimonial-images').remove([fileName]);
    }
  }
  await supabase.from('testimonials').delete().eq('id', id);
  revalidatePath('/admin/content');
}

// Action for adding a new testimonial
export async function addTestimonialAction(data: TestimonialData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );
  await supabase.from('testimonials').insert(data);
  revalidatePath('/admin/content');
}