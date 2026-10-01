import type { PortalData, Tone } from '@/lib/portal-types'
import { createClient } from '@/lib/supabase/server'

export async function getPortalData(userId: string): Promise<PortalData> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .select(
      'id, full_name, date_of_birth, mobile, email, notes, created_at'
    )
    .eq('created_by', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[clients] lookup failed', {
      code: error.code,
      message: error.message,
    })

    return {
      reports: [],
      clients: [],
    }
  }

  const clients = (data ?? []).map((client) => ({
    id: client.id,
    name: client.full_name,
    initials: client.full_name
      .split(/\s+/)
      .filter(Boolean)
      .map((part: string) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),

    dob: client.date_of_birth ?? '',
    phone: client.mobile ?? '',
    email: client.email ?? '',
    notes: client.notes ?? '',

    joined: client.created_at
      ? new Date(client.created_at).toLocaleDateString()
      : '',

    tone: 'navy' as Tone,
  }))

  return {
    reports: [],
    clients,
  }
}