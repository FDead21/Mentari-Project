import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Mentari Project Outbound Bandung',
  description: 'Your partner for amazing outbound experiences.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value; } } });
  
  const { data: settingsData } = await supabase
    .from('site_content')
    .select('content_key, content_value')
    .in('content_key', ['logo_url', 'whatsapp_number']);

  const { data } = await supabase.from('site_content').select('content_value').eq('content_key', 'logo_url').single();
  const logoUrl = data?.content_value;
  const settingsMap = new Map(settingsData?.map(s => [s.content_key, s.content_value]));
  const whatsappNumber = settingsMap.get('whatsapp_number');

return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
            success: {
              style: {
                background: '#28a745',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#28a745',
              },
            },
            error: {
              style: {
                background: '#dc3545',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#dc3545',
              },
            },
          }}
        />
        <Navbar logoUrl={logoUrl} />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton phoneNumber={whatsappNumber} />
      </body>
    </html>
  )
}