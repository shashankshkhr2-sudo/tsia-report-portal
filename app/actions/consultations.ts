'use server'

import { createClient } from '@/lib/supabase/server'

type StartInput = {
  clientId: string
  mode: 'in_person' | 'phone'
  purposeCode: string
  topicCode: string
  topicCodes: string[]
  note: string
}

type SaveAnswerInput = {
  consultationId: string
  clientId: string
  questionText: string
  clientAnswer: string
  employeeObservation?: string
  importantForNextConsultation?: boolean
}

type GetAnswersInput = {
  consultationId: string
  clientId: string
}

export async function startConsultation(
  input: StartInput
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        error: 'You must be signed in.',
        result: null,
      }
    }

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select(
          'id,organization_id,location_id,is_active'
        )
        .eq('id', user.id)
        .single()

    if (
      profileError ||
      !profile ||
      !profile.is_active ||
      !profile.organization_id
    ) {
      return {
        error: 'Active employee profile not found.',
        result: null,
      }
    }

    if (
      !input.clientId ||
      !['in_person', 'phone'].includes(input.mode)
    ) {
      return {
        error: 'Invalid consultation details.',
        result: null,
      }
    }

    const { data: purpose, error: purposeError } =
      await supabase
        .from('consultation_purposes')
        .select('id')
        .eq(
          'organization_id',
          profile.organization_id
        )
        .eq('purpose_code', input.purposeCode)
        .eq('is_active', true)
        .single()

    if (purposeError || !purpose) {
      return {
        error: 'Consultation purpose not found.',
        result: null,
      }
    }

    const topicCodes = Array.from(
      new Set(
        input.topicCodes
          .map((code) => code.trim())
          .filter(Boolean)
      )
    )

    if (topicCodes.length === 0) {
      return {
        error: 'Select at least one consultation topic.',
        result: null,
      }
    }

    const primaryTopicCode = topicCodes[0]

    const {
      data: selectedTopics,
      error: topicsError,
    } = await supabase
      .from('consultation_topics')
      .select('id,topic_code')
      .eq(
        'organization_id',
        profile.organization_id
      )
      .in('topic_code', topicCodes)
      .eq('is_active', true)

    if (
      topicsError ||
      !selectedTopics ||
      selectedTopics.length !== topicCodes.length
    ) {
      return {
        error:
          'One or more consultation topics were not found.',
        result: null,
      }
    }

    const primaryTopic = selectedTopics.find(
      (topic) =>
        topic.topic_code === primaryTopicCode
    )

    if (!primaryTopic) {
      return {
        error: 'Primary consultation topic not found.',
        result: null,
      }
    }

    const { data: previous, error: previousError } =
      await supabase
        .from('consultations')
        .select('consultation_number')
        .eq('client_id', input.clientId)
        .eq(
          'organization_id',
          profile.organization_id
        )
        .order('consultation_number', {
          ascending: false,
        })
        .limit(1)

    if (previousError) {
      return {
        error: 'Unable to verify consultation history.',
        result: null,
      }
    }

    const lastNumber = Number(
      previous?.[0]?.consultation_number || 0
    )

    const nextNumber = lastNumber + 1

    const {
      data: consultation,
      error: insertError,
    } = await supabase
      .from('consultations')
      .insert({
        organization_id: profile.organization_id,
        client_id: input.clientId,
        consultation_number: nextNumber,
        employee_id: profile.id,
        location_id: profile.location_id,
        consultation_mode: input.mode,
        purpose_id: purpose.id,
        primary_topic_id: primaryTopic.id,
        specific_concern: input.note.trim() || null,
        status: 'in_progress',
      })
      .select('id,consultation_number')
      .single()

    if (insertError || !consultation) {
      return {
        error:
          insertError?.message ||
          'Unable to create consultation.',
        result: null,
      }
    }

    const topicRows = selectedTopics.map(
      (topic) => ({
        organization_id: profile.organization_id,
        consultation_id: consultation.id,
        topic_id: topic.id,
        is_primary:
          topic.topic_code === primaryTopicCode,
      })
    )

    const { error: topicInsertError } =
      await supabase
        .from('consultation_selected_topics')
        .insert(topicRows)

    if (topicInsertError) {
      const { error: rollbackError } =
        await supabase
          .from('consultations')
          .delete()
          .eq('id', consultation.id)
          .eq(
            'organization_id',
            profile.organization_id
          )

      return {
        error: rollbackError
          ? 'Unable to save consultation topics. An incomplete consultation record may remain; please contact the administrator.'
          : topicInsertError.message ||
            'Unable to save consultation topics.',
        result: null,
      }
    }

    return {
      error: null,
      result: {
        id: consultation.id,
        consultationNumber: Number(
          consultation.consultation_number
        ),
      },
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to start consultation.',
      result: null,
    }
  }
}

export async function saveConsultationAnswer(
  input: SaveAnswerInput
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        error: 'You must be signed in.',
        result: null,
      }
    }

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select(
          'id,organization_id,is_active'
        )
        .eq('id', user.id)
        .single()

    if (
      profileError ||
      !profile ||
      !profile.is_active ||
      !profile.organization_id
    ) {
      return {
        error: 'Active employee profile not found.',
        result: null,
      }
    }

    const questionText =
      input.questionText?.trim() || ''

    const clientAnswer =
      input.clientAnswer?.trim() || ''

    const employeeObservation =
      input.employeeObservation?.trim() || ''

    if (!input.consultationId || !input.clientId) {
      return {
        error: 'Consultation identification is required.',
        result: null,
      }
    }

    if (!questionText) {
      return {
        error: 'Question text is required.',
        result: null,
      }
    }

    if (!clientAnswer && !employeeObservation) {
      return {
        error:
          'Enter a client answer or practitioner observation.',
        result: null,
      }
    }

    const {
      data: consultation,
      error: consultationError,
    } = await supabase
      .from('consultations')
      .select('id,client_id,employee_id,status')
      .eq('id', input.consultationId)
      .eq(
        'organization_id',
        profile.organization_id
      )
      .eq('client_id', input.clientId)
      .single()

    if (consultationError || !consultation) {
      return {
        error: 'Consultation could not be verified.',
        result: null,
      }
    }

    // Stage B initially allows the practitioner who
    // created the consultation to save its answers.
    // Manager/admin permissions can be added later
    // after reviewing the role hierarchy.

    if (consultation.employee_id !== profile.id) {
      return {
        error:
          'Only the assigned consultation practitioner can save answers.',
        result: null,
      }
    }

    if (consultation.status !== 'in_progress') {
      return {
        error:
          'This consultation is not currently in progress.',
        result: null,
      }
    }

    const {
      data: savedAnswer,
      error: insertError,
    } = await supabase
      .from('consultation_answers')
      .insert({
        organization_id: profile.organization_id,
        consultation_id: consultation.id,
        client_id: consultation.client_id,
        question_text_snapshot: questionText,
        asked_by: profile.id,
        client_answer: clientAnswer,
        employee_observation:
          employeeObservation || null,
        important_for_next_consultation:
          input.importantForNextConsultation === true,
        answer_method: 'typed',
        answered_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertError || !savedAnswer) {
      return {
        error:
          insertError?.message ||
          'Unable to save consultation answer.',
        result: null,
      }
    }

    return {
      error: null,
      result: {
        id: savedAnswer.id,
      },
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to save consultation answer.',
      result: null,
    }
  }
}

export async function getConsultationAnswers(
  input: GetAnswersInput
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        error: 'You must be signed in.',
        result: null,
      }
    }

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('id,organization_id,is_active')
        .eq('id', user.id)
        .single()

    if (
      profileError ||
      !profile ||
      !profile.is_active ||
      !profile.organization_id
    ) {
      return {
        error: 'Active employee profile not found.',
        result: null,
      }
    }

    if (!input.consultationId || !input.clientId) {
      return {
        error: 'Consultation identification is required.',
        result: null,
      }
    }

    const {
      data: consultation,
      error: consultationError,
    } = await supabase
      .from('consultations')
      .select('id,employee_id')
      .eq('id', input.consultationId)
      .eq('client_id', input.clientId)
      .eq(
        'organization_id',
        profile.organization_id
      )
      .single()

    if (consultationError || !consultation) {
      return {
        error: 'Consultation could not be verified.',
        result: null,
      }
    }

    if (consultation.employee_id !== profile.id) {
      return {
        error:
          'Only the assigned consultation practitioner can view these answers.',
        result: null,
      }
    }

    const {
      data: answers,
      error: answersError,
    } = await supabase
      .from('consultation_answers')
      .select(
        'id,question_text_snapshot,client_answer,employee_observation,important_for_next_consultation,answered_at,created_at'
      )
      .eq(
        'organization_id',
        profile.organization_id
      )
      .eq('consultation_id', consultation.id)
      .eq('client_id', input.clientId)
      .order('created_at', {
        ascending: true,
      })

    if (answersError) {
      return {
        error: answersError.message,
        result: null,
      }
    }

    return {
      error: null,
      result: (answers || []).map(
        (answer) => ({
          id: answer.id,
          questionText:
            answer.question_text_snapshot || '',
          clientAnswer: answer.client_answer || '',
          employeeObservation:
            answer.employee_observation || '',
          importantForNextConsultation:
            answer.important_for_next_consultation === true,
          answeredAt: answer.answered_at,
          createdAt: answer.created_at,
        })
      ),
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to load consultation answers.',
      result: null,
    }
  }
}