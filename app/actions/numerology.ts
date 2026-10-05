'use server'

import {
  createClient,
} from '@/lib/supabase/server'

import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  buildNumerologyEvidence,
} from '@/lib/numerology/evidenceengine'

import {
  buildNumerologyV2ReportContent,
} from '@/lib/numerology/reportcontent'

import {
  buildNumerologyV2Narrative,
} from '@/lib/numerology/narrativeengine'

import {
  runNumerologyV3FromCalculation,
} from '@/lib/numerology-intelligence/engine'

import {
  buildEmployeeOutput,
} from '@/lib/numerology-intelligence/employeeoutput'

export async function generateNumerologyV2(
  clientId: string
) {
  try {
    if (!clientId) {
      return {
        error: 'Client is required.',
        result: null,
      }
    }

    const supabase =
      await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        error:
          'You must be signed in.',
        result: null,
      }
    }

    const {
      data: client,
      error: clientError,
    } = await supabase
      .from('clients')
      .select(
        `
        id,
        client_number,
        full_name,
        date_of_birth,
        status
        `
      )
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      return {
        error:
          'Client could not be found.',
        result: null,
      }
    }

    if (client.status === 'inactive') {
      return {
        error:
          'This client is inactive.',
        result: null,
      }
    }

    if (
      !client.full_name ||
      !client.date_of_birth
    ) {
      return {
        error:
          'Full Name and Date of Birth are required for Numerology Version 2.',
        result: null,
      }
    }

    /*
     * FROZEN V2 CALCULATION
     */
    const calculation =
      calculateNumerologyV2({
        fullName:
          client.full_name,

        dateOfBirth:
          client.date_of_birth,
      })

    /*
     * EXISTING V2