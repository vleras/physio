import { createClient } from '@supabase/supabase-js'

// Node.js on this machine can't verify Supabase's TLS cert chain
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set — admin write operations will fail')
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || '', {
  auth: { persistSession: false, autoRefreshToken: false },
})
