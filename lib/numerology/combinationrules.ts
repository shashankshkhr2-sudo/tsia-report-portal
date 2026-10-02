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
      ''social or professional presentation',