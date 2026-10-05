'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Mic,
} from 'lucide-react'

import {
  generateNumerologyV2,
} from '@/app/actions/numerology'

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  EmployeeInsight,
} from '@/lib/numerology-intelligence/employeeoutput'

import type {
  ConsultationClient,
  ConsultationMode,
  ConsultationPurpose,
} from '@/components/consultation-workspace'

type Props = {
  client: ConsultationClient
  mode: ConsultationMode
  purpose: ConsultationPurpose
  note: string
  onBack: () => void
}

type Result = {
  calculation:
    NumerologyCalculationResult

  employeeOutput: {
    version: string
    insights:
      readonly EmployeeInsight[]
    warnings:
      readonly string[]
  }
}

const labels:
  Record<string, string> = {
  numerology_report:
    'Numerology Report',

  future_numerology:
    'Future Numerology',

  career:
    'Career',

  business:
    'Business',

  money:
    'Money & Wealth',

  family:
    'Family',

  relationship:
    'Relationship',

  marriage:
    'Marriage',

  personal_direction:
    'Personal Direction',

  follow_up:
    'Follow-up',

  other:
    'Other',
}

const grid:
  NumerologyDigit[] = [
  4, 9, 2,
  3, 5, 7,
  8, 1, 6,
]

export function ConsultationAssistant({
  client,
  mode,
  purpose,
  note,
  onBack,
}: Props) {
  const [choice, setChoice] =
    useState('')

  const [answer, setAnswer] =
    useState('')

  const [data, setData] =
    useState<Result | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')

      const response =
        await generateNumerologyV2(
          client.id
        )

      if (!active) {
        return
      }

      if (
        response.error ||
        !response.result
      ) {
        setError(
          response.error ||
            'Unable to load numerology.'
        )

        setLoading(false)
        return
      }

      setData({
        calculation:
          response.result
            .calculation,

        employeeOutput:
          response.result
            .employeeOutput,
      })

      setLoading(false)