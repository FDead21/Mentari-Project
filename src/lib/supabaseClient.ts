import { createClient } from '@supabase/supabase-js'

// Get the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if the variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing from .env.local file.");
}

// Export the Supabase client, now guaranteed to have the correct values
export const supabase = createClient(supabaseUrl, supabaseAnonKey)