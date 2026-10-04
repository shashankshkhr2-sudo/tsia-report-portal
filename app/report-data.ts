import type { Client, PortalData, Tone } from '@/lib/portal-types'
import { createClient } from '@/lib/supabase/server'

type ClientRow = {
  id: string
  full_name: string
  date_of_birth: string
  mobile: string | null
  email: string | null
  created_at: string
  client_number: string | null
  status: string | null
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function getTone(index: number): Tone {
  const tones: Tone[] = ['plum', 'terracotta', 'olive', 'navy']
  return tones[index % tones.length]
}

export async function getPortalData(
  _userId: string
): Promise<PortalData> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      full_name,
      date_of_birth,
      mobile,
      email,
      created_at,
      client_number,
      status
    `)
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

  const clients: Client[] = (data ?? []).map((row: ClientRow, index) => ({
    id: row.id,
    fullName: row.full_name,
    clientNumber: row.client_number ?? '—',
    dateOfBirth: row.date_of_birth,
    mobile: row.mobile ?? '—',
    email: row.email ?? '—',
    joined: row.created_at,
    status: row.status ?? 'Active',
    tone: getTone(index),
  }))

  return {
    reports: [],
    clients,
  }
}