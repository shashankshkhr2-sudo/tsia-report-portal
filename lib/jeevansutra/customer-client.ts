'use client'
import { createClient } from '@supabase/supabase-js'
let instance: ReturnType<typeof createClient> | null = null
export function customerClient() {
  if (instance) return instance
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  instance = createClient(url, key, { auth: {
    storageKey: 'jeevansutra-customer-session',
    storage: typeof window === 'undefined' ? undefined : window.sessionStorage,
    persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
  } })
  return instance
}
