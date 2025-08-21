import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } }
  );

  const { data: aboutContent } = await supabase
    .from('site_content')
    .select('content_value')
    .eq('content_key', 'about_us_content')
    .single();

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">About Mentari Project</h1>
      <div className="space-y-4 text-gray-700">
        {/* Render content from the database */}
        <p>{aboutContent?.content_value}</p>
      </div>
    </div>
  );
}