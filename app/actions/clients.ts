'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AddClientInput = {
  fullName: string
  dateOfBirth: string
  mobile?: string
  email?: string
  notes?: string
}

export type AddClientResult = {
  error: string | null
}

export async function addClient(
  input: AddClientInput
): Promise<AddClientResult> {
  const fullName = input.fullName.trim()
  const dateOfBirth = input.dateOfBirth
  const mobile = input.mobile?.trim() || null
  const email = input.email?.trim().toLowerCase() || null
  const notes = input.notes?.trim() || null

  if (!fullName || !dateOfBirth) {
    return { error: 'Full name and date of birth are required.' }
  }

  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Your session has expired. Please sign in again.' }
    }

    const { error } = await supabase.from('clients').insert({
      full_name: fullName,
      date_of_birth: dateOfBirth,
      mobile,
      email,
      notes,
      created_by: user.id,
    })

    if (error) {
      console.error('[clients] insert failed', {
        code: error.code,
        message: error.message,
      })

      return { error: 'Unable to save the client. Please try again.' }
    }

    revalidatePath('/')

    return { error: null }
  } catch (caught) {
    console.error(
      '[clients] unexpected error',
      caught instanceof Error ? caught.name : 'unknown'
    )

    return { error: 'Unable to save the client. Please try again.' }
  }
}