"use client";

import { createClient } from '@supabase/supabase-js'

// Client-only Supabase client for browser usage
export function createBrowserClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key'

  return createClient(supabaseUrl, supabaseAnonKey)
}
