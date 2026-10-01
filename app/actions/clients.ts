'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AddClientInput = {
  full_name: string
  current_name?: string
  date_of_birth: string
  gender?: string

  birth_time?: string
  birth_place_name?: string
  birth_state_region?: string
  birth_country?: string

  mobile?: string
  whatsapp_number?: string
  email?: string

  source_id?: string
  referred_by?: string

  primary_employee_id?: string

  notes?: string
}

export type SavedClient = {
  id: string
  client_number: string | null

  full_name: string
  current_name: string | null
  date_of_birth: string
  gender: string | null

  birth_time: string | null
  birth_place_name: string | null
  birth_state_region: string | null
  birth_country: string | null

  mobile: string | null
  whatsapp_number: string | null
  email: string | null

  source_id: string | null
  referred_by: string | null

  primary_employee_id: string | null
  organization_id: string | null
  location_id: string | null

  notes: string | null
  status: string

  created_at: string
}

export type AddClientResult = {
  error: string | null
  client: SavedClient | null
}

function cleanOptional(value?: string) {
  const cleaned = value?.trim()
  return cleaned ? cleaned : null
}

export async function addClient(
  input: AddClientInput
): Promise<AddClientResult> {
  const fullName = input.full_name.trim()
  const dateOfBirth = input.date_of_birth

  if (!fullName || !dateOfBirth) {
    return {
      error: 'Full name and date of birth are required.',
      client: null,
    }
  }

  try {
    const supabase = await createClient()

    // -----------------------------------------------------
    // 1. Confirm logged-in user
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // 2. Load employee/admin profile
    // Organisation and location come from the server-side
    // profile instead of trusting browser-submitted values.
    // -----------------------------------------------------

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select(
        'id, organization_id, location_id, role, is_active'
      )
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return {
        error: 'Your user profile could not be found.',
        client: null,
      }
    }

    if (!profile.is_active) {
      return {
        error: 'Your user account is inactive.',
        client: null,
      }
    }

    if (!profile.organization_id) {
      return {
        error: 'Your organisation has not been configured.',
        client: null,
      }
    }

    if (!profile.location_id) {
      return {
        error: 'Your work location has not been configured.',
        client: null,
      }
    }

    // -----------------------------------------------------
    // 3. Determine primary employee
    //
    // Default = logged-in user.
    // If another employee is selected, verify that employee
    // belongs to the same organisation.
    // -----------------------------------------------------

    let primaryEmployeeId =
      cleanOptional(input.primary_employee_id) || user.id

    if (primaryEmployeeId !== user.id) {
      const {
        data: assignedEmployee,
        error: assignedEmployeeError,
      } = await supabase
        .from('profiles')
        .select('id, organization_id, is_active')
        .eq('id', primaryEmployeeId)
        .eq('organization_id', profile.organization_id)
        .single()

      if (
        assignedEmployeeError ||
        !assignedEmployee ||
        !assignedEmployee.is_active
      ) {
        return {
          error: 'The selected employee is not available.',
          client: null,
        }
      }
    }

    // -----------------------------------------------------
    // 4. Validate selected source
    // -----------------------------------------------------

    const sourceId = cleanOptional(input.source_id)

    if (sourceId) {
      const {
        data: source,
        error: sourceError,
      } = await supabase
        .from('client_sources')
        .select('id')
        .eq('id', sourceId)
        .eq('organization_id', profile.organization_id)
        .eq('is_active', true)
        .single()

      if (sourceError || !source) {
        return {
          error: 'The selected client source is not valid.',
          client: null,
        }
      }
    }

    // -----------------------------------------------------
    // 5. Prepare optional values
    // -----------------------------------------------------

    const currentName = cleanOptional(input.current_name)
    const gender = cleanOptional(input.gender)

    const birthTime = cleanOptional(input.birth_time)
    const birthPlaceName = cleanOptional(input.birth_place_name)
    const birthStateRegion = cleanOptional(input.birth_state_region)
    const birthCountry = cleanOptional(input.birth_country)

    const mobile = cleanOptional(input.mobile)
    const whatsappNumber = cleanOptional(input.whatsapp_number)

    const email =
      cleanOptional(input.email)?.toLowerCase() || null

    const referredBy = cleanOptional(input.referred_by)
    const notes = cleanOptional(input.notes)

    // -----------------------------------------------------
    // 6. Insert Client
    //
    // client_number is NOT supplied here.
    // PostgreSQL trigger generates TSIA-000001 etc.
    // -----------------------------------------------------

    const {
      data,
      error,
    } = await supabase
      .from('clients')
      .insert({
        organization_id: profile.organization_id,
        location_id: profile.location_id,

        full_name: fullName,
        current_name: currentName,
        date_of_birth: dateOfBirth,
        gender,

        birth_time: birthTime,
        birth_place_name: birthPlaceName,
        birth_state_region: birthStateRegion,
        birth_country: birthCountry,

        mobile,
        whatsapp_number: whatsappNumber,
        email,

        source_id: sourceId,
        referred_by: referredBy,

        primary_employee_id: primaryEmployeeId,

        notes,
        status: 'active',

        created_by: user.id,
      })
      .select(`
        id,
        client_number,
        full_name,
        current_name,
        date_of_birth,
        gender,
        birth_time,
        birth_place_name,
        birth_state_region,
        birth_country,
        mobile,
        whatsapp_number,
        email,
        source_id,
        referred_by,
        primary_employee_id,
        organization_id,
        location_id,
        notes,
        status,
        created_at
      `)
      .single<SavedClient>()

    if (error || !data) {
      console.error('[clients] insert error', error)

      return {
        error: 'Unable to save the client. Please try again.',
        client: null,
      }
    }

    // -----------------------------------------------------
    // 7. Refresh portal data
    // -----------------------------------------------------

    revalidatePath('/')

    return {
      error: null,
      client: data,
    }
  } catch (caught) {
    console.error(
      '[clients] unexpected error',
      caught instanceof Error ? caught.message : caught
    )

    return {
      error: 'Unable to save the client. Please try again.',
      client: null,
    }
  }
}