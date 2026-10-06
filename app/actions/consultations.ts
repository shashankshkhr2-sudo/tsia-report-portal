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

    /*
     * Remove duplicate topic codes while
     * preserving the employee's selection
     * order.
     */
    const topicCodes = Array.from(
      new Set(
        input.topicCodes.filter(Boolean)
      )
    )

    if (topicCodes.length === 0) {
      return {
        error:
          'Select at least one consultation topic.',
        result: null,
      }
    }

    /*
     * The first selected topic is the
     * primary topic.
     */
    const primaryTopicCode =
      topicCodes[0]

    const { data: selectedTopics } =
      await supabase
        .from('consultation_topics')
        .select('id,topic_code')
        .eq(
          'organization_id',
          profile.organization_id
        )
        .in(
          'topic_code',
          topicCodes
        )
        .eq('is_active', true)

    if (
      !selectedTopics ||
      selectedTopics.length !==
        topicCodes.length
    ) {
      return {
        error:
          'One or more consultation topics were not found.',
        result: null,
      }
    }

    const primaryTopic =
      selectedTopics.find(
        (topic) =>
          topic.topic_code ===
          primaryTopicCode
      )

    if (!primaryTopic) {
      return {
        error:
          'Primary consultation topic not found.',
        result: null,
      }
    }

    const { data: previous } =
      await supabase
        .from('consultations')
        .select('consultation_number')
        .eq(
          'client_id',
          input.clientId
        )
        .order(
          'consultation_number',
          { ascending: false }
        )
        .limit(1)

    const lastNumber =
      previous?.[0]
        ?.consultation_number || 0

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

        /*
         * Existing field remains intact
         * for backwards compatibility.
         */
        primary_topic_id:
          primaryTopic.id,

        specific_concern:
          input.note.trim() || null,

        status:
          'in_progress',
      })
      .select(
        'id,consultation_number'
      )
      .single()

    if (
      insertError ||
      !consultation
    ) {
      return {
        error:
          insertError?.message ||
          'Unable to create consultation.',
        result: null,
      }
    }

    /*
     * Save the complete topic selection
     * in the new junction table.
     */
    const topicRows =
      selectedTopics.map(
        (topic) => ({
          organization_id:
            profile.organization_id,

          consultation_id:
            consultation.id,

          topic_id:
            topic.id,

          is_primary:
            topic.topic_code ===
            primaryTopicCode,
        })
      )

    const {
      error: topicInsertError,
    } = await supabase
      .from(
        'consultation_selected_topics'
      )
      .insert(topicRows)

    if (topicInsertError) {
      /*
       * Avoid leaving a partially-created
       * consultation if topic saving fails.
       */
      await supabase
        .from('consultations')
        .delete()
        .eq(
          'id',
          consultation.id
        )

      return {
        error:
          topicInsertError.message ||
          'Unable to save consultation topics.',
        result: null,
      }
    }

    return {
      error: null,
      result: {
        id: consultation.id,
        consultationNumber:
          Number(
            consultation
              .consultation_number
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