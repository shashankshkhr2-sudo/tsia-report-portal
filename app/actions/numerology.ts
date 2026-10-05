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
     * This remains deterministic.
     * Consultation answers,
     * observations, payment,
     * customer behaviour and
     * V3 interpretation must never
     * alter this calculation.
     */
    const calculation =
      calculateNumerologyV2({
        fullName,
        dateOfBirth,
      })

    /*
     * VERIFIED V2 EVIDENCE ENGINE
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
     * VERIFIED V2 NARRATIVE ENGINE
     *
     * Narrative is generated from
     * report content only.
     */
    const narrative =
      buildNumerologyV2Narrative(
        content
      )

    /*
     * V3 NUMEROLOGY INTELLIGENCE
     *
     * V3 interprets the frozen
     * calculation independently.
     * It does not rewrite V2.
     */
    const intelligence =
      runNumerologyV3FromCalculation(
        calculation
      )

    /*
     * EMPLOYEE OUTPUT
     *
     * Selects and ranks approved
     * V3 conclusions for the
     * practitioner.
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
     * Converts already-resolved
     * employee insights into
     * practitioner-facing guidance.
     *
     * This layer does not create
     * new numerological findings.
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