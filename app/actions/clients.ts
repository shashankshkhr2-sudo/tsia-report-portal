'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AddClientInput = {
  full_name: string
  date_of_birth: string
  mobile?: string
  email?: string
  notes?: string
}

export type SavedClient = {
  id: string
  full_name: string
  date_of_birth: string
  mobile: string | null
  email: string | null
  notes: string | null
  created_at: string
}

export type AddClientResult = {
  error: string | null
  client: SavedClient | null
}

export async function addClient(
  input: AddClientInput
): Promise<AddClientResult> {
  const fullName = input.full_name.trim()
  const dateOfBirth = input.date_of_birth
  const mobile = input.mobile?.trim() || null
  const email = input.email?.trim().toLowerCase() || null
  const notes = input.notes?.trim() || null

  if (!fullName || !dateOfBirth) {
    return {
      error: 'Full name and date of birth are required.',
      client: null,
    }
  }

  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        error: 'Your session has expired. Please sign in again.',
        client: null,
      }
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        full_name: fullName,
        date_of_birth: dateOfBirth,
        mobile,
        email,
        notes,
        created_by: user.id,
      })
      .select(
        'id, full_name, date_of_birth, mobile, email, notes, created_at'
      )
      .single<SavedClient>()

    return {
    error: error
    ? `${error.code}: ${error.message}`
    : 'No data returned after insert.',
  client: null,
}

      
    }

    revalidatePath('/')

    return {
      error: null,
      client: data,
    }
  } catch (caught) {
    console.error(
      '[clients] unexpected error',
      caught instanceof Error ? caught.name : 'unknown'
    )

    return {
      error: 'Unable to save the client. Please try again.',
      client: null,
    }
  }
}