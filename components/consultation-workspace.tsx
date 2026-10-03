'use client'

import { useState } from 'react'

import {
  ConsultationSetup,
} from '@/components/consultation-setup'

import {
  ConsultationContext,
} from '@/components/consultation-context'

import {
  ConsultationNumerology,
} from '@/components/consultation-numerology'

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
  | 'career'
  | 'business'
  | 'money'
  | 'family'
  | 'relationship'
  | 'marriage'
  | 'personal_direction'
  | 'follow_up'
  | 'other'
  | ''

export type ConsultationClient = {
  id: string
  clientNumber?: string
  name: string
  dob?: string
}

type ConsultationStage =
  | 'setup'
  | 'context'
  | 'numerology'
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
    useState<ConsultationStage>('setup')

  const [mode, setMode] =
    useState<ConsultationMode>('')

  const [purpose, setPurpose] =
    useState<ConsultationPurpose>('')

  const [note, setNote] =
    useState('')

  if (stage === 'assistant') {
    return (
      <ConsultationAssistant
        client={client}
        mode={mode}
        purpose={purpose}
        note={note}
        onBack={() =>
          setStage('numerology')
        }
      />
    )
  }

  if (stage === 'numerology') {
    return (
      <ConsultationNumerology
        client={client}
        mode={mode}
        purpose={purpose}
        onBack={() =>
          setStage('context')
        }
        onBegin={() =>
          setStage('assistant')
        }
      />
    )
  }

  if (stage === 'context') {
    return (
      <ConsultationContext
        client={client}
        mode={mode}
        purpose={purpose}
        note={note}
        onBack={() =>
          setStage('setup')
        }
        onOpenAssistant={() =>
          setStage('numerology')
        }
      />
    )
  }

  return (
    <ConsultationSetup
      client={client}
      mode={mode}
      purpose={purpose}
      note={note}
      onModeChange={setMode}
      onPurposeChange={setPurpose}
      onNoteChange={setNote}
      onBack={onBack}
      onContinue={() =>
        setStage('context')
      }
    />
  )
}