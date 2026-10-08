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

import {
  buildEmployeeInterpretations,
} from '@/lib/numerology-intelligence/employeeinterpretation'

export async function generateNumerologyV2(
  clientId: string
) {
  try {
    const supabase =
      await createClient()

    /*
     * AUTHENTICATION
     *
     * Only authenticated users
     * may request client numerology.
     */
    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser()

    if (!user) {
      return {
        error:
          'You must be logged in.',
        result: null,
      }
    }

    /*
     * INPUT VALIDATION
     */
    if (
      typeof clientId !== 'string' ||
      !clientId.trim()
    ) {
      return {
        error:
          'A valid client ID is required.',
        result: null,
      }
    }

    /*
     * CLIENT LOOKUP
     *
     * Supabase RLS must restrict
     * access to authorized clients.
     *
     * Authentication alone does
     * not establish authorization.
     */
    const {
      data: client,
      error: clientError,
    } =
      await supabase
        .from('clients')
        .select(
          `
          id,
          client_number,
          full_name,
          current_name,
          date_of_birth,
          gender
          `
        )
        .eq('id', clientId.trim())
        .maybeSingle()

    if (clientError) {
      console.error(
        '[numerology] client lookup failed',
        {
          code:
            clientError.code,
          message:
            clientError.message,
        }
      )

      return {
        error:
          'Unable to load client.',
        result: null,
      }
    }

    if (!client) {
      return {
        error:
          'Client not found or access denied.',
        result: null,
      }
    }

    /*
     * CLIENT INPUT
     */
    const fullName =
      (
        client.current_name ||
        client.full_name ||
        ''
      ).trim()

    const dateOfBirth =
      (
        client.date_of_birth ||
        ''
      ).trim()

    if (!fullName) {
      return {
        error:
          'Client name is required for numerology.',
        result: null,
      }
    }

    if (!dateOfBirth) {
      return {
        error:
          'Client date of birth is required for numerology.',
        result: null,
      }
    }

    /*
     * FROZEN V2 CALCULATION
     *
     * Deterministic calculation.
     *
     * Consultation answers,
     * observations, payments,
     * customer behaviour and
     * V3 interpretations must
     * never change this result.
     */
    const calculation =
      calculateNumerologyV2({
        fullName,
        dateOfBirth,
      })

    /*
     * VERIFIED V2 EVIDENCE
     */
    const evidence =
      buildNumerologyEvidence(
        calculation
      )

    /*
     * VERIFIED V2 REPORT CONTENT
     */
    const content =
      buildNumerologyV2ReportContent(
        calculation,
        evidence
      )

    /*
     * VERIFIED V2 NARRATIVE
     */
    const narrative =
      buildNumerologyV2Narrative(
        content
      )

    /*
     * VERIFIED V3 INTELLIGENCE
     *
     * Reuses the existing V2
     * calculation.
     *
     * No second V2 calculation.
     */
    const intelligence =
      runNumerologyV3FromCalculation(
        calculation
      )

    /*
     * EXISTING EMPLOYEE OUTPUT
     *
     * Preserve the approved
     * five-insight output.
     *
     * Existing report and
     * employee workflows remain
     * compatible.
     */
    const employeeOutput =
      buildEmployeeOutput(
        intelligence.conclusions,
        intelligence.crossQuality,
        5
      )

    /*
     * EXISTING EMPLOYEE
     * INTERPRETATIONS
     *
     * Preserve the current
     * five-insight interpretation
     * behaviour.
     */
    const employeeInterpretation =
      buildEmployeeInterpretations(
        employeeOutput.insights,
        5
      )

    /*
     * COMPLETE APPROVED
     * CONSULTATION INSIGHT POOL
     *
     * The existing employee
     * output function already
     * supports configurable
     * result limits.
     *
     * Using MAX_SAFE_INTEGER
     * returns the complete
     * available approved pool.
     *
     * No new intelligence
     * methodology is introduced.
     *
     * Topic selection will use
     * this pool without changing
     * V2 or V3 calculations.
     */
    const consultationInsightPool =
      buildEmployeeOutput(
        intelligence.conclusions,
        intelligence.crossQuality,
        Number.MAX_SAFE_INTEGER
      )

    /*
     * RETURN VERIFIED RESULTS
     */
    return {
      error: null,

      result: {
        client: {
          id:
            client.id,

          clientNumber:
            client.client_number,

          fullName:
            client.full_name,

          currentName:
            client.current_name,

          dateOfBirth:
            client.date_of_birth,

          gender:
            client.gender,
        },

        calculation,

        evidence,

        content,

        narrative,

        intelligence,

        employeeOutput,

        employeeInterpretation,

        consultationInsightPool,
      },
    }
  } catch (error) {
    /*
     * Log unexpected failures
     * on the server.
     *
     * Do not expose internal
     * error details to clients.
     */
    console.error(
      '[numerology] generation failed',
      error
    )

    return {
      error:
        'Unable to generate numerology. Please try again.',
      result: null,
    }
  }
}