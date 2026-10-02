'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  FileText,
  History,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
  Video,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

type ConsultationMode =
  | 'in_person'
  | 'phone'
  | ''

type ConsultationPurpose =
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

type ClientSummary = {
  id: string
  clientNumber?: string
  name: string
  dob?: string
}

type ConsultationWorkspaceProps = {
  client: ClientSummary
  onBack: () => void
}

const purposes: {
  value: ConsultationPurpose
  label: string
}[] = [
  {
    value: 'numerology_report',
    label: 'Numerology Report',
  },
  {
    value: 'future_numerology',
    label: 'Future Numerology',
  },
  {
    value: 'career',
    label: 'Career',
  },
  {
    value: 'business',
    label: 'Business',
  },
  {
    value: 'money',
    label: 'Money',
  },
  {
    value: 'family',
    label: 'Family',
  },
  {
    value: 'relationship',
    label: 'Relationship',
  },
  {
    value: 'marriage',
    label: 'Marriage',
  },
  {
    value: 'personal_direction',
    label: 'Personal Direction',
  },
  {
    value: 'follow_up',
    label: 'Follow-up',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

export function ConsultationWorkspace({
  client,
  onBack,
}: ConsultationWorkspaceProps) {
  const [mode, setMode] =
    useState<ConsultationMode>('')

  const [purpose, setPurpose] =
    useState<ConsultationPurpose>('')

  const [note, setNote] =
    useState('')

  const [prepared, setPrepared] =
    useState(false)

  const canStart =
    Boolean(mode) &&
    Boolean(purpose)

  const selectedPurpose =
    purposes.find(
      (item) =>
        item.value === purpose
    )?.label

  if (prepared) {
    return (
      <div className="min-h-full bg-[#f7f3ed] p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() =>
              setPrepared(false)
            }
            className="mb-6 flex items-center gap-2 text-xs font