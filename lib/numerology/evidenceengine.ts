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
  // PERSONAL LO SHU
  // --------------------------------

  for (const number of DIGITS) {
    const count =
      result.loShu.counts[number]

    if (count > 0) {
      addEvidence(
        evidenceByNumber.get(number)!,
        'loshu',
        number,
        `Number ${number} is present in the Personal Lo Shu grid.`
      )
    }

    if (count >= 2) {
      addEvidence(
        evidenceByNumber.get(number)!,
        'repetition',
        number,
        `Number ${number} repeats ${count} times in the Personal Lo Shu grid.`
      )

      for (
        let extra = 3;
        extra <= count;
        extra++
      ) {
        addEvidence(
          evidenceByNumber.get(number)!,
          'repetition',
          number,
          `Number ${number} receives additional repetition reinforcement at count ${extra}.`
        )
      }
    }
  }

  // --------------------------------
  // COMPLETE ROWS
  // --------------------------------

  if (
    result.rows.mental.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'row',
      [4, 9, 2],
      'Reinforced by the complete Mental Row 4-9-2.'
    )
  }

  if (
    result.rows.emotionalWill.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'row',
      [3, 5, 7],
      'Reinforced by the complete Emotional / Will Row 3-5-7.'
    )
  }

  if (
    result.rows.practicalMaterial.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'row',
      [8, 1, 6],
      'Reinforced by the complete Practical / Material Row 8-1-6.'
    )
  }

  // --------------------------------
  // COMPLETE COLUMNS
  // --------------------------------

  if (
    result.columns.first.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'column',
      [4, 3, 8],
      'Reinforced by the complete Lo Shu column 4-3-8.'
    )
  }

  if (
    result.columns.middle.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'column',
      [9, 5, 1],
      'Reinforced by the complete Lo Shu column 9-5-1.'
    )
  }

  if (
    result.columns.third.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'column',
      [2, 7, 6],
      'Reinforced by the complete Lo Shu column 2-7-6.'
    )
  }

  // --------------------------------
  // COMPLETE RAJYOGS
  // --------------------------------

  if (
    result.rajyog.golden.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'goldenRajyog',
      [4, 5, 6],
      'Reinforced by complete Golden Rajyog 4-5-6.'
    )
  }

  if (
    result.rajyog.silver.status ===
    'complete'
  ) {
    addPatternEvidence(
      evidenceByNumber,
      'silverRajyog',
      [2, 5, 8],
      'Reinforced by complete Silver Rajyog 2-5-8.'
    )
  }

  // --------------------------------
  // BUILD NUMBER PROFILES
  // --------------------------------

  const numbers: NumberEvidence[] =
    DIGITS.map((number) => {
      const evidence =
        evidenceByNumber.get(number) ?? []

      const numberRule =
        getNumberRule(number)

      const missingRule =
        getMissingNumberRule(number)

      const loShuCount =
        result.loShu.counts[number]

      const isMulank =
        result.mulank.final === number

      const isBhagyank =
        result.bhagyank.final === number

      const isNameNumber =
        result.nameNumber.finalNumber ===
        number

      const isCoreNumber =
        isMulank ||
        isBhagyank ||
        isNameNumber

      const score =
        evidence.reduce(
          (total, item) =>
            total + item.weight,
          0
        )

      return {
        number,

        graha:
          numberRule.graha,

        score,

        presentInLoShu:
          loShuCount > 0,

        missingFromLoShu:
          loShuCount === 0,

        loShuCount,

        isMulank,
        isBhagyank,
        isNameNumber,
        isCoreNumber,

        evidence,

        strengths:
          numberRule.strengths,

        themes:
          numberRule.themes,

        repetitionStrengths:
          numberRule.repetitionStrengths,

        possibleExcess:
          numberRule.possibleExcess,

        developmentAreas:
          loShuCount === 0
            ? missingRule.developmentAreas
            : numberRule.developmentAreas,

        practicalGuidance:
          loShuCount === 0
            ? missingRule.practicalGuidance
            : [],
      }
    })

  // --------------------------------
  // RANK NUMBERS
  // --------------------------------

  const rankedNumbers =
    [...numbers].sort(
      (a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score
        }

        return a.number - b.number
      }
    )

  const highestScore =
    rankedNumbers[0]?.score ?? 0

  const strongestNumbers =
    highestScore > 0
      ? rankedNumbers
          .filter(
            (item) =>
              item.score ===
              highestScore
          )
          .map(
            (item) =>
              item.number
          )
      : []

  // --------------------------------
  // DEVELOPMENT NUMBERS
  // --------------------------------

  // These remain mathematically
  // missing from the Personal Lo Shu
  // even when the same number is also
  // Mulank, Bhagyank or Name Number.
  //
  // Core-number reinforcement is
  // retained separately so the report
  // engine can interpret both facts.

  const developmentNumbers =
    numbers
      .filter(
        (item) =>
          item.missingFromLoShu
      )
      .map(
        (item) =>
          item.number
      )

  return {
    numbers,
    rankedNumbers,
    strongestNumbers,
    developmentNumbers,

    coreNumbers: {
      mulank:
        result.mulank.final,

      bhagyank:
        result.bhagyank.final,

      nameNumber:
        result.nameNumber
          .finalNumber,
    },
  }
}