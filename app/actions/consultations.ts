'use server'

import { createClient } from '@/lib/supabase/server'

type StartInput = {
  clientId: string
  mode: 'in_person' | 'phone'
  purposeCode: string
  topicCode: string
  note: string
}

export async function startConsultation(
  input: StartInput
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
          'id,organization_id,location_id,is_active'
        )
        .eq('id', user.id)
        .single()

    if (!profile || !profile.is_active) {
      return {
        error: 'Active employee profile not found.',
        result: null,
      }
    }

    const { data: purpose } =
      await supabase
        .from('consultation_purposes')
        .select('id')
        .eq(
          'organization_id',
          profile.organization_id
        )
        .eq(
          'purpose_code',
          input.purposeCode
        )
        .eq('is_active', true)
        .single()

    if (!purpose) {
      return {
        error: 'Consultation purpose not found.',
        result: null,
      }
    }

    const { data: topic } =
      await supabase
        .from('consultation_topics')
        .select('id')
        .eq(
          'organization_id',
          profile.organization_id
        )
        .eq('topic_code', input.topicCode)
        .eq('is_active', true)
        .single()

    if (!topic) {
      return {
        error: 'Consultation topic not found.',
        result: null,
      }
    }

    const { data: previous } =
      await supabase
        .from('consultations')
        .select('consultation_number')
        .eq('client_id', input.clientId)
        .order(
          'consultation_number',
          { ascending: false }
        )
        .limit(1)

    const lastNumber =
      previous?.[0]?.consultation_number || 0

    const nextNumber =
      Number(lastNumber) + 1

    const {
      data: consultation,
      error: insertError,
    } = await supabase
      .from('consultations')
      .insert({
        organization_id:
          profile.organization_id,

        client_id:
          input.clientId,

        consultation_number:
          nextNumber,

        employee_id:
          profile.id,

        location_id:
          profile.location_id,

        consultation_mode:
          input.mode,

        purpose_id:
          purpose.id,

        primary_topic_id:
          topic.id,

        specific_concern:
          input.note.trim() || null,

        status:
          'in_progress',
      })
      .select(
        'id,consultation_number'
      )
      .single()

    if (insertError || !consultation) {
      return {
        error:
          insertError?.message ||
          'Unable to create consultation.',
        result: null,
      }
    }

    return {
      error: null,
      result: {
        id: consultation.id,
        consultationNumber:
          Number(
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