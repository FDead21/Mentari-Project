import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  const { data: aboutContent } = await supabase.from('site_content').select('*').in('content_key', ['about_us_content', 'about_us_image_url']);
  const aboutContentMap = new Map(aboutContent?.map(s => [s.content_key, s.content_value]));

  const text = aboutContentMap.get('about_us_content');
  const imageUrl = aboutContentMap.get('about_us_image_url');

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 text-gray-700">
          <h1 className="text-4xl font-bold mb-6">About Mentari Project</h1>
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
        <div>
          {imageUrl && (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image src={imageUrl} alt="About Mentari Project" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}