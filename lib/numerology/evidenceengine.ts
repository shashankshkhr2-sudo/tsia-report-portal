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

export type EvidenceItem = {
  source:
    | 'mulank'
    | 'bhagyank'
    | 'nameNumber'
    | 'loshu'
    | 'repetition'
    | 'row'
    | 'column'
    | 'goldenRajyog'
    | 'silverRajyog'

  number: NumerologyDigit

  weight: number

  description: string
}

export type NumberEvidence = {
  number: NumerologyDigit

  graha: string

  score: number

  presentInLoShu: boolean

  loShuCount: number

  isMulank: boolean

  isBhagyank: boolean

  isNameNumber: boolean

  evidence: EvidenceItem[]

  strengths: string[]

  possibleExcess: string[]

  developmentAreas: string[]
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
  source: EvidenceItem['source'],
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

function addCompletePatternEvidence(
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
  // CORE NUMBER EVIDENCE
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
  // LO SHU PRESENCE + REPETITION
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

    if (count > 1) {
      // Base repetition reinforcement.
      addEvidence(
        evidenceByNumber.get(number)!,
        'repetition',
        number,
        `Number ${number} repeats ${count} times in the Personal Lo Shu grid.`
      )

      // Additional reinforcement for each
      // occurrence beyond the second.
      for (
        let extra = 3;
        extra <= count;
        extra++
      ) {
        addEvidence(
          evidenceByNumber.get(number)!,
          'repetition',
          number,
          `Number ${number} has additional repetition reinforcement at count ${extra}.`
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
    addCompletePatternEvidence(
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
    addCompletePatternEvidence(
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
    addCompletePatternEvidence(
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
    addCompletePatternEvidence(
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
    addCompletePatternEvidence(
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
    addCompletePatternEvidence(
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
    addCompletePatternEvidence(
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
    addCompletePatternEvidence(
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

      const rule =
        getNumberRule(number)

      const score = evidence.reduce(
        (total, item) =>
          total + item.weight,
        0
      )

      const loShuCount =
        result.loShu.counts[number]

      return {
        number,

        graha: rule.graha,

        score,

        presentInLoShu:
          loShuCount > 0,

        loShuCount,

        isMulank:
          result.mulank.final === number,

        isBhagyank:
          result.bhagyank.final ===
          number,

        isNameNumber:
          result.nameNumber
            .finalNumber === number,

        evidence,

        strengths:
          rule.strengths,

        possibleExcess:
          rule.possibleExcess,

        developmentAreas:
          rule.developmentAreas,
      }
    })

  // --------------------------------
  // RANKING
  // --------------------------------

  const rankedNumbers = [
    ...numbers,
  ].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }

    return a.number - b.number
  })

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
            (item) => item.number
          )
      : []

  // --------------------------------
  // DEVELOPMENT NUMBERS
  // --------------------------------

  // Important:
  // Missing from Lo Shu does not
  // automatically mean weak.
  //
  // If the number is a core number,
  // it is reinforced elsewhere and
  // should not be treated as a simple
  // missing-number weakness.

  const developmentNumbers =
    numbers
      .filter(
        (item) =>
          !item.presentInLoShu &&
          !item.isMulank &&
          !item.isBhagyank &&
          !item.isNameNumber
      )
      .map(
        (item) => item.number
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