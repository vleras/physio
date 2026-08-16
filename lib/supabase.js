import { createClient } from '@supabase/supabase-js'

// Placeholders keep `next build` from crashing when env vars are unset
// (e.g. missing in Vercel). Real values are required at runtime.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
