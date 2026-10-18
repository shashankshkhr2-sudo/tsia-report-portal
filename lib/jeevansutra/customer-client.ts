'use client'
import { createClient } from '@supabase/supabase-js'
const storageKey = 'jeevansutra-customer-session'
const migrationKey = 'jeevansutra-customer-session-migrated-v1'
let instance: ReturnType<typeof createClient> | null = null
function customerStorage(): Storage | null {
 if (typeof window === 'undefined') return null
 try {
  const storage = window.localStorage
  // Migrate once across this browser, so an old tab cannot restore a session after sign-out.
  if (storage.getItem(migrationKey) !== 'true') {
   const existing = storage.getItem(storageKey)
   let previous: string | null = null
   try { previous = window.sessionStorage.getItem(storageKey) } catch { /* No legacy storage. */ }
   if (!existing && previous) storage.setItem(storageKey, previous)
   storage.setItem(migrationKey, 'true')
  }
  try { window.sessionStorage.removeItem(storageKey) } catch { /* Legacy storage may be blocked. */ }
  return storage
 } catch { return null }
}
export function customerClient() {
 if (instance) return instance
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
 if (!url || !key) return null
 const storage = customerStorage()
 if (!storage) return null
 instance = createClient(url, key, { auth: {
  storageKey,
  storage,
  persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
 } })
 return instance
}
