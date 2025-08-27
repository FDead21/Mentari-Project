'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Define the type for a slide
export type HeroSlide = {
  id: string;
  image_url: string;
};

// Action for adding a new slide
export async function addHeroSlideAction(imageUrl: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );
  await supabase.from('hero_slides').insert({ image_url: imageUrl });
  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout');
}

// Action for deleting a slide
export async function deleteHeroSlideAction(slide: HeroSlide) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );
  
  const fileName = slide.image_url.split('/').pop();
  if (fileName) {
    await supabase.storage.from('site-assets').remove([fileName]);
  }
  await supabase.from('hero_slides').delete().eq('id', slide.id);
  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout');
}