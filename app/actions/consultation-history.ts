'use server'

import { createClient } from '@/lib/supabase/server'

export type ConsultationHistoryAnswer = {
  id: string
  consultationId: string
  questionText: string
  clientAnswer: string
  employeeObservation: string | null
  importantForNextConsultation: boolean
  answeredAt: string | null
}

export type PreviousConsultation = {
  id: string
  consultationNumber: number
  specificConcern: string | null
  mainConcernSummary: string | null
  guidanceSummary: string | null
  outcome: string | null
  followUpRequired: boolean
  startedAt: string | null
  answers: ConsultationHistoryAnswer[]
}

export type ConsultationHistory = {
  currentConsultationNumber: number
  previousConsultation: PreviousConsultation | null
  importantEarlierAnswers: ConsultationHistoryAnswer[]
}

export async function getClientConsultationHistory(
  clientId: string,
  currentConsultationId: string
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        error: 'You must be signed in.',
        result: null,
      }
    }

    const { data: profile } =
      await supabase
        .from('profiles')
        .select(
          'id,organization_id,is_active'
        )
        .eq('id', user.id)
        .single()

    if (!profile || !profile.is_active) {
      return {
        error:
          'Active employee profile not found.',
        result: null,
      }
    }

    /*
     * Verify the current consultation and
     * establish its real consultation number.
     */
    const {
      data: currentConsultation,
      error: currentError,
    } = await supabase
      .from('consultations')
      .select(
        'id,consultation_number'
      )
      .eq(
        'id',
        currentConsultationId
      )
      .eq(
        'client_id',
        clientId
      )
      .eq(
        'organization_id',
        profile.organization_id
      )
      .single()

    if (
      currentError ||
      !currentConsultation
    ) {
      return {
        error:
          'Current consultation could not be verified.',
        result: null,
      }
    }

    const currentNumber =
      Number(
        currentConsultation
          .consultation_number
      )

    /*
     * Find the immediately preceding
     * consultation for this client.
     */
    const {
      data: previousRows,
      error: previousError,
    } = await supabase
      .from('consultations')
      .select(
        `
        id,
        consultation_number,
        specific_concern,
        main_concern_summary,
        guidance_summary,
        outcome,
        follow_up_required,
        started_at
        `
      )
      .eq(
        'organization_id',
        profile.organization_id
      )
      .eq(
        'client_id',
        clientId
      )
      .lt(
        'consultation_number',
        currentNumber
      )
      .order(
        'consultation_number',
        { ascending: false }
      )
      .limit(1)

    if (previousError) {
      return {
        error:
          previousError.message,
        result: null,
      }
    }

    const previous =
      previousRows?.[0] || null

    /*
     * Load answers from the immediately
     * previous consultation.
     */
    let previousAnswers:
      ConsultationHistoryAnswer[] = []

    if (previous) {
      const {
        data: answerRows,
        error: answerError,
      } = await supabase
        .from('consultation_answers')
        .select(
          `
          id,
          consultation_id,
          question_text_snapshot,
          client_answer,
          employee_observation,
          important_for_next_consultation,
          answered_at
          `
        )
        .eq(
          'organization_id',
          profile.organization_id
        )
        .eq(
          'client_id',
          clientId
        )
        .eq(
          'consultation_id',
          previous.id
        )
        .order(
          'asked_at',
          { ascending: true }
        )

      if (answerError) {
        return {
          error:
            answerError.message,
          result: null,
        }
      }

      previousAnswers =
        (answerRows || []).map(
          (answer) => ({
            id: answer.id,
            consultationId:
              answer.consultation_id,
            questionText:
              answer.question_text_snapshot,
            clientAnswer:
              answer.client_answer,
            employeeObservation:
              answer.employee_observation,
            importantForNextConsultation:
              Boolean(
                answer
                  .important_for_next_consultation
              ),
            answeredAt:
              answer.answered_at,
          })
        )
    }

    /*
     * Retrieve important answers from
     * consultations older than the
     * immediately previous consultation.
     *
     * These are long-term consultation
     * memories, not numerological evidence.
     */
    let importantEarlierAnswers:
      ConsultationHistoryAnswer[] = []

    if (previous) {
      const {
        data: earlierConsultations,
        error: earlierError,
      } = await supabase
        .from('consultations')
        .select('id')
        .eq(
          'organization_id',
          profile.organization_id
        )
        .eq(
          'client_id',
          clientId
        )
        .lt(
          'consultation_number',
          Number(
            previous
              .consultation_number
          )
        )

      if (earlierError) {
        return {
          error:
            earlierError.message,
          result: null,
        }
      }

      const earlierIds =
        (earlierConsultations || [])
          .map(
            (consultation) =>
              consultation.id
          )

      if (earlierIds.length > 0) {
        const {
          data: importantRows,
          error: importantError,
        } = await supabase
          .from(
            'consultation_answers'
          )
          .select(
            `
            id,
            consultation_id,
            question_text_snapshot,
            client_answer,
            employee_observation,
            important_for_next_consultation,
            answered_at
            `
          )
          .eq(
            'organization_id',
            profile.organization_id
          )
          .eq(
            'client_id',
            clientId
          )
          .eq(
            'important_for_next_consultation',
            true
          )
          .in(
            'consultation_id',
            earlierIds
          )
          .order(
            'answered_at',
            { ascending: false }
          )

        if (importantError) {
          return {
            error:
              importantError.message,
            result: null,
          }
        }

        importantEarlierAnswers =
          (importantRows || []).map(
            (answer) => ({
              id: answer.id,
              consultationId:
                answer.consultation_id,
              questionText:
                answer.question_text_snapshot,
              clientAnswer:
                answer.client_answer,
              employeeObservation:
                answer.employee_observation,
              importantForNextConsultation:
                true,
              answeredAt:
                answer.answered_at,
            })
          )
      }
    }

    const previousConsultation:
      PreviousConsultation | null =
      previous
        ? {
            id: previous.id,

            consultationNumber:
              Number(
                previous
                  .consultation_number
              ),

            specificConcern:
              previous
                .specific_concern,

            mainConcernSummary:
              previous
                .main_concern_summary,

            guidanceSummary:
              previous
                .guidance_summary,

            outcome:
              previous.outcome,

            followUpRequired:
              Boolean(
                previous
                  .follow_up_required
              ),

            startedAt:
              previous.started_at,

            answers:
              previousAnswers,
          }
        : null

    const result: ConsultationHistory = {
      currentConsultationNumber:
        currentNumber,

      previousConsultation,

      importantEarlierAnswers,
    }

    return {
      error: null,
      result,
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to load consultation history.',
      result: null,
    }
  }
}