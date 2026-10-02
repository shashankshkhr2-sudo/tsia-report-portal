// lib/numerology/evidenceengine.ts

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from './types'

import {
  getEvidenceWeight,
} from './combinationrules'

import {
  getNumberRule,
} from './numberrules'

import {
  getMissingNumberRule,
} from './missingrules'

export type EvidenceSource =
  | 'mulank'
  | 'bhagyank'
  | 'nameNumber'
  | 'loshu'
  | 'repetition'
  | 'row'
  | 'column'
  | 'goldenRajyog'
  | 'silverRajyog'

export type EvidenceItem = {
  source: EvidenceSource
  number: NumerologyDigit
  weight: number
  description: string
}

export type NumberEvidence = {
  number: NumerologyDigit
  graha: string
  score: number

  presentInLoShu: boolean
  missingFromLoShu: boolean
  loShuCount: number

  isMulank: boolean
  isBhagyank: boolean
  isNameNumber: boolean
  isCoreNumber: boolean

  evidence: EvidenceItem[]

  strengths: string[]
  themes: string[]
  repetitionStrengths: string[]
  possibleExcess: string[]
  developmentAreas: string[]
  practicalGuidance: string[]
}

export type EvidenceEngineResult = {
  numbers: NumberEvidence[]
  rankedNumbers: NumberEvidence[]

  strongestNumbers: NumerologyDigit[]
  developmentNumbers: NumerologyDigit[]

  coreNumbers: {
    mulank: NumerologyDigit
    bhagyank: NumerologyDigit
    nameNumber: NumerologyDigit
  }
}

const DIGITS: NumerologyDigit[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
]

function addEvidence(
  evidence: EvidenceItem[],
  source: EvidenceSource,
  number: NumerologyDigit,
  description: string
) {
  evidence.push({
    source,
    number,
    weight: getEvidenceWeight(source),
    description,
  })
}

function addPatternEvidence(
  evidenceByNumber: Map<
    NumerologyDigit,
    EvidenceItem[]
  >,
  source:
    | 'row'
    | 'column'
    | 'goldenRajyog'
    | 'silverRajyog',
  numbers: NumerologyDigit[],
  description: string
) {
  for (const number of numbers) {
    const evidence =
      evidenceByNumber.get(number)

    if (!evidence) {
      continue
    }

    addEvidence(
      evidence,
      source,
      number,
      description
    )
  }
}

export function buildNumerologyEvidence(
  result: NumerologyCalculationResult
): EvidenceEngineResult {
  const evidenceByNumber = new Map<
    NumerologyDigit,
    EvidenceItem[]
  >()

  for (const number of DIGITS) {
    evidenceByNumber.set(number, [])
  }

  // --------------------------------
  // CORE NUMBERS
  // --------------------------------

  addEvidence(
    evidenceByNumber.get(
      result.mulank.final
    )!,
    'mulank',
    result.mulank.final,
    `Number ${result.mulank.final} is the Mulank.`
  )

  addEvidence(
    evidenceByNumber.get(
      result.bhagyank.final
    )!,
    'bhagyank',
    result.bhagyank.final,
    `Number ${result.bhagyank.final} is the Bhagyank.`
  )

  addEvidence(
    evidenceByNumber.get(
      result.nameNumber.finalNumber
    )!,
    'nameNumber',
    result.nameNumber.finalNumber,
    `Number ${result.nameNumber.finalNumber} is the Name Number.`
  )

  // --------------------------------
  // PERSONAL