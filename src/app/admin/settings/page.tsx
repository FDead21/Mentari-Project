import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import SettingsForm from './SettingsForm'; // Import our new component
import HeroSlidesManager from './HeroSlidesManager';
import BackButton from '@/components/admin/BackButton';

async function updateSettings(formData: FormData) {
  'use server';
  const cookieStore = await cookies();
  const supabaseAdmin = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  // Add the new contact fields to the update list
  const updates = [
    supabaseAdmin.from('site_content').update({ content_value: formData.get('hero_title') as string }).eq('content_key', 'hero_title'),
    supabaseAdmin.from('site_content').update({ content_value: formData.get('hero_subtitle') as string }).eq('content_key', 'hero_subtitle'),
    supabaseAdmin.from('site_content').update({ content_value: formData.get('contact_address') as string }).eq('content_key', 'contact_address'),
    supabaseAdmin.from('site_content').update({ content_value: formData.get('contact_email') as string }).eq('content_key', 'contact_email'),
    supabaseAdmin.from('site_content').update({ content_value: formData.get('contact_phone') as string }).eq('content_key', 'contact_phone'),
    supabaseAdmin.from('site_content').update({ content_value: formData.get('whatsapp_number') as string }).eq('content_key', 'whatsapp_number'),
    supabaseAdmin.from('site_content').update({ content_value: formData.get('section_order') as string }).eq('content_key', 'section_order'),
  ];
  await Promise.all(updates);
  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout'); // Revalidate all pages
}

async function updateLogo(formData: FormData) {
  'use server';
  const cookieStore = await cookies();
  const supabaseAdmin = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });
  
  const logoFile = formData.get('logo') as File;
  if (logoFile && logoFile.size > 0) {
    const fileName = `logo-${Date.now()}.${logoFile.name.split('.').pop()}`;
    const { error } = await supabaseAdmin.storage.from('site-assets').upload(fileName, logoFile, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabaseAdmin.storage.from('site-assets').getPublicUrl(fileName);
      await supabaseAdmin.from('site_content').update({ content_value: publicUrl }).eq('content_key', 'logo_url');
    }
  }
  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout');
}

export default async function SiteSettingsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  const { data: settings } = await supabase.from('site_content').select('*');
  const { data: heroSlides } = await supabase.from('hero_slides').select('*').order('created_at');

  return (
    <div className="container mx-auto p-8">
    <BackButton href="/admin" title="Dashboard" /> 
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      <div className="space-y-12">
        <SettingsForm 
          settings={settings || []}
          updateSettingsAction={updateSettings}
          updateLogoAction={updateLogo}
        />
        {/* Add the new hero manager component */}
        <HeroSlidesManager slides={heroSlides || []} />
      </div>
    </div>
  );
}