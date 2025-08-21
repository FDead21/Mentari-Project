import { createBrowserClient } from '@supabase/ssr'

// This is the correct way to create a client-side Supabase client
// for the Next.js App Router.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)