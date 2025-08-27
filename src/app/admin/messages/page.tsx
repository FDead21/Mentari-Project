import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import BackButton from '@/components/admin/BackButton';

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });

  const { data: messages } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto p-8">
      <BackButton href="/admin" title="Dashboard" />
      <h1 className="text-3xl font-bold mb-8">Contact Form Messages</h1>
      <div className="space-y-6">
        {messages?.map(message => (
          <div key={message.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">{message.name}</p>
                <a href={`mailto:${message.email}`} className="text-sm text-blue-600 hover:underline">{message.email}</a>
                {message.phone_number && <p className="text-sm text-gray-600">{message.phone_number}</p>}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(message.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
            <p className="mt-4 text-gray-800 whitespace-pre-wrap">{message.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}