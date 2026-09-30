'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthActionState = { error: string | null }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function signIn(_previous: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Please enter your email address and password.' }
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedEmail.length > 254 || password.length === 0 || password.length > 256) {
    return { error: 'Invalid email or password.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })

    if (error) {
      console.error('[auth] sign-in failed', { code: error.code, status: error.status })
      if (error.code === 'email_not_confirmed') {
        return { error: 'Please confirm your email address before signing in.' }
      }
      if (error.status === 429 || error.code === 'over_request_rate_limit') {
        return { error: 'Too many sign-in attempts. Please wait a few minutes and try again.' }
      }
      if (error.code === 'invalid_credentials' || error.status === 400) {
        return { error: 'Invalid email or password.' }
      }
      return { error: 'We could not sign you in right now. Please try again later.' }
    }
  } catch (caught) {
    console.error('[auth] sign-in unexpected error', caught instanceof Error ? caught.name : 'unknown')
    return { error: 'We could not sign you in right now. Please try again later.' }
  }

  redirect('/')
}

export async function signOut(): Promise<AuthActionState> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[auth] sign-out failed', { code: error.code, status: error.status })
      return { error: 'Unable to sign out. Please try again.' }
    }
  } catch (caught) {
    console.error('[auth] sign-out unexpected error', caught instanceof Error ? caught.name : 'unknown')
    return { error: 'Unable to sign out. Please try again.' }
  }

  redirect('/login')
}
