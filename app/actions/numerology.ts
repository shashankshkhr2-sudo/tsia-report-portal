'use server'

import {
  createClient,
} from '@/lib/supabase/server'

import {
  calculateNumerologyV2,
} from '@/lib/numerology/calculations'

import {
  buildNumerologyEvidence,
} from '@/lib/numerology/evidence'

import {
  buildNumerologyV2Content,
} from '@/lib/numerology/content'

import {
  buildNumerologyV2Narrative,
} from '@/lib/numerology/narrative'

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
        .eq('id', clientId)
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
          'Client not found.',
        result: null,
      }
    }

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
     * Business context, consultation
     * answers, employee observations,
     * payment status and customer
     * behaviour must never alter this
     * deterministic calculation.
     */
    const calculation =
      calculateNumerologyV2({
        fullName,
        dateOfBirth,
      })

    /*
     * EXISTING V2 EVIDENCE
     */
    const evidence =
      buildNumerologyEvidence(
        calculation
      )

    /*
     * EXISTING V2 CONTENT
     */
    const content =
      buildNumerologyV2Content(
        calculation,
        evidence
      )

    /*
     * EXISTING V2 NARRATIVE
     */
    const narrative =
      buildNumerologyV2Narrative(
        calculation,
        evidence,
        content
      )

    /*
     * V3 NUMEROLOGY INTELLIGENCE
     *
     * This interprets the frozen
     * calculation. It does not modify
     * V2 mathematics.
     */
    const intelligence =
      runNumerologyV3FromCalculation(
        calculation
      )

    /*
     * EMPLOYEE OUTPUT
     *
     * Ranks approved V3 conclusions
     * for practitioner use.
     */
    const employeeOutput =
      buildEmployeeOutput(
        intelligence.conclusions,
        intelligence.crossQuality,
        5
      )

    /*
     * EMPLOYEE INTERPRETATION
     *
     * Converts the already-resolved
     * employee insights into
     * practitioner guidance.
     *
     * It does NOT create new
     * numerological findings.
     */
    const employeeInterpretation =
      buildEmployeeInterpretations(
        employeeOutput.insights,
        5
      )

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
      },
    }
  } catch (error) {
    console.error(
      '[numerology] generation failed',
      error
    )

    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to generate numerology.',
      result: null,
    }
  }
}