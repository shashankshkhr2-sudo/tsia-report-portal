// lib/numerology/combinationrules.ts

import type {
  NumerologyDigit,
} from './types'

export type CoreRole =
  | 'mulank'
  | 'bhagyank'
  | 'nameNumber'

export type EvidenceSource =
  | CoreRole
  | 'loshu'
  | 'repetition'
  | 'row'
  | 'column'
  | 'goldenRajyog'
  | 'silverRajyog'

export type EvidenceWeight = {
  source: EvidenceSource
  weight: number
  purpose: string
}

export type CombinationPrinciple = {
  key: string
  title: string
  description: string
}

export type CoreCombinationResult = {
  mulank: NumerologyDigit
  bhagyank: NumerologyDigit
  nameNumber: NumerologyDigit

  allSame: boolean
  mulankBhagyankSame: boolean
  mulankNameSame: boolean
  bhagyankNameSame: boolean

  uniqueCoreNumbers: NumerologyDigit[]
}

export const CORE_ROLE_RULES: Record<
  CoreRole,
  {
    title: string
    role: string
    interpretationFocus: string[]
  }
> = {
  mulank: {
    title: 'Mulank',

    role:
      'Primary behavioural and personal operating energy.',

    interpretationFocus: [
      'natural behavioural style',
      'personal response pattern',
      'day-to-day expression',
      'core personal tendencies',
    ],
  },

  bhagyank: {
    title: 'Bhagyank',

    role:
      'Broader life-path and directional energy.',

    interpretationFocus: [
      'long-term direction',
      'broader life approach',
      'development over time',
      'larger behavioural direction',
    ],
  },

  nameNumber: {
    title: 'Name Number',

    role:
      'Name-based expression and the way personal energy is projected or expressed.',

    interpretationFocus: [
      'external expression',
      'communication of personal energy',
      'social or professional presentation',
      'interaction between identity and expression',
    ],
  },
}

export const EVIDENCE_WEIGHTS: EvidenceWeight[] = [
  {
    source: 'mulank',
    weight: 5,
    purpose:
      'Primary core behavioural evidence.',
  },

  {
    source: 'bhagyank',
    weight: 5,
    purpose:
      'Primary broader directional evidence.',
  },

  {
    source: 'nameNumber',
    weight: 4,
    purpose:
      'Strong name-expression evidence.',
  },

  {
    source: 'loshu',
    weight: 1,
    purpose:
      'Base support when a number is present in the Personal Lo Shu grid.',
  },

  {
    source: 'repetition',
    weight: 2,
    purpose:
      'Additional reinforcement when a Lo Shu number repeats.',
  },

  {
    source: 'row',
    weight: 2,
    purpose:
      'Structural reinforcement from a complete Lo Shu row.',
  },

  {
    source: 'column',
    weight: 2,
    purpose:
      'Structural reinforcement from a complete Lo Shu column.',
  },

  {
    source: 'goldenRajyog',
    weight: 3,
    purpose:
      'Additional structural reinforcement when Golden Rajyog is complete.',
  },

  {
    source: 'silverRajyog',
    weight: 3,
    purpose:
      'Additional structural reinforcement when Silver Rajyog is complete.',
  },
]

export const COMBINATION_PRINCIPLES:
  CombinationPrinciple[] = [
    {
      key: 'positiveFirst',

      title: 'Positive First',

      description:
        'Interpret strengths and available energies before discussing development areas.',
    },

    {
      key: 'coreBeforeGrid',

      title: 'Core Numbers Before Grid',

      description:
        'Mulank, Bhagyank and Name