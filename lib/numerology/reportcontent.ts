// lib/numerology/reportcontent.ts

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from './types'

import type {
  EvidenceEngineResult,
  NumberEvidence,
} from './evidenceengine'

import {
  getNumberRule,
} from './numberrules'

import {
  getMissingNumberRule,
} from './missingrules'

export type ReportFact = {
  label: string
  value: string
}

export type ReportNumberProfile = {
  number: NumerologyDigit
  graha: string
  score: number
  roles: string[]
  strengths: string[]
  developmentAreas: string[]
  possibleExcess: string[]
}

export type ReportDevelopmentItem = {
  number: NumerologyDigit
  graha: string
  theme: string
  areas: string[]
  practicalGuidance: string[]
}

export type ReportPatternItem = {
  name: string
  numbers: string
  status: string
  presentCount: number
  totalCount: number
  missingNumbers: NumerologyDigit[]
}

export type NumerologyV2ReportContent = {
  reportVersion: 'TSIA_NUMEROLOGY_V2'

  client: {
    fullName: string
   