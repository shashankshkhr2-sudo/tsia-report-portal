'use client'

import { useState } from 'react'

import {
  startConsultation,
} from '@/app/actions/consultations'

import {
  ConsultationSetup,
} from '@/components/consultation-setup'

import {
  ConsultationContext,
} from '@/components/consultation-context'

import {
  ConsultationAssistant,
} from '@/components/consultation-assistant'

export type ConsultationMode =
  | 'in_person'
  | 'phone'
  | ''

export type ConsultationPurpose =
  | 'numerology_report'
  | 'future_numerology'
  | 'follow_up'
  | 'general_consultation'
  | ''

export type ConsultationTopic =
  | 'business'
  | 'career'
  | 'money'
  | 'family'
  | 'relationship'
  | 'marriage'
  | 'personal_direction'
  | 'other'
  | ''

export type ConsultationClient = {
  id: string
  clientNumber?: string
  name: string
  dob?: string
}

type Stage =
  | 'setup'
  | 'context'
  | 'assistant'

type Props = {
  client: ConsultationClient
  onBack: () => void
}

export function ConsultationWorkspace({
  client,
  onBack,
}: Props) {
  const [stage, setStage] =
    useState<Stage>('setup')

  const [mode, setMode] =
    useState<ConsultationMode>('')

  const [purpose, setPurpose] =
    useState<ConsultationPurpose>('')

  const [topic, setTopic] =
    useState<ConsultationTopic>('')

  const [note, setNote] =
    useState('')

  const [consultationId, setConsultationId] =
    useState('')

  const [
    consultationNumber,
    setConsultationNumber,
  ] = useState<number | null>(null)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  async function handleStart() {
    if (
      !mode ||
      !purpose ||
      !topic ||
      saving
    ) {
      return
    }

    setSaving(true)
    setError('')

    const response =
      await startConsultation({
        clientId: client.id,
        mode,
        purposeCode: purpose,
        topicCode: topic,
        note,
      })

    setSaving(false)

    if (
      response.error ||
      !response.result
    ) {
      setError(
        response.error ||
          'Unable to start consultation.'
      )
      return
    }

    setConsultationId(
      response.result.id
    )

    setConsultationNumber(
      response.result.consultationNumber
    )

    setStage('context')
  }

  if (
    stage === 'assistant' &&
    consultationNumber
  ) {
    return (
      <ConsultationAssistant
        client={client}
        mode={mode}
        purpose={purpose}
        note={note}
        consultationId={consultationId}
        consultationNumber={
          consultationNumber
        }
        topic={topic}
        onBack={() =>
          setStage('context')
        }
      />
    )
  }

  if (
    stage === 'context' &&
    consultationNumber
  ) {
    return (
      <ConsultationContext
        client={client}
        mode={mode}
        purpose={purpose}
        topic={topic}
        note={note}
        consultationId={consultationId}
        consultationNumber={
          consultationNumber
        }
        onBack={() =>
          setStage('setup')
        }
        onOpenAssistant={() =>
          setStage('assistant')
        }
      />
    )
  }

  return (
    <ConsultationSetup
      client={client}
      mode={mode}
      purpose={purpose}
      topic={topic}
      note={note}
      saving={saving}
      error={error}
      onModeChange={setMode}
      onPurposeChange={setPurpose}
      onTopicChange={setTopic}
      onNoteChange={setNote}
      onBack={onBack}
      onContinue={handleStart}
    />
  )
}