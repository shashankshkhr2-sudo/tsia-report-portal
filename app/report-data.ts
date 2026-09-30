import type { PortalData } from '@/lib/portal-types'

// Client and report records are not connected to a data source yet.
// Once they are, query them here using the authenticated user's server-side Supabase client.
export async function getPortalData(_userId: string): Promise<PortalData> {
  return { reports: [], clients: [] }
}
