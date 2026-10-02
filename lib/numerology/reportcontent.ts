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
    dateOfBirth: string
  }

  atAGlance: {
    mulank: ReportFact
    bhagyank: ReportFact
    nameNumber: ReportFact
    strongestNumbers: NumerologyDigit[]
    developmentNumbers: NumerologyDigit[]
  }

  coreNumbers: ReportNumberProfile[]

  loShu: {
    counts: Record<number, number>
    presentNumbers: NumerologyDigit[]
    missingNumbers: NumerologyDigit[]
    repeatedNumbers:
      Partial<Record<NumerologyDigit, number>>
  }

  patterns: {
    rows: ReportPatternItem[]
    columns: ReportPatternItem[]
    rajyogs: ReportPatternItem[]
  }

  grahaAnalysis: ReportNumberProfile[]

  development: ReportDevelopmentItem[]

  writingInstructions: string[]
}

function buildRoles(
  item: NumberEvidence
): string[] {
  const roles: string[] = []

  if (item.isMulank) {
    roles.push('Mulank')
  }

  if (item.isBhagyank) {
    roles.push('Bhagyank')
  }

  if (item.isNameNumber) {
    roles.push('Name Number')
  }

  if (item.presentInLoShu) {
    roles.push(
      `Lo Shu x${item.loShuCount}`
    )
  }

  return roles
}

function buildNumberProfile(
  item: NumberEvidence
): ReportNumberProfile {
  const rule =
    getNumberRule(item.number)

  return {
    number: item.number,
    graha: rule.graha,
    score: item.score,
    roles: buildRoles(item),
    strengths: [
      ...rule.strengths,
    ],
    developmentAreas: [
      ...rule.developmentAreas,
    ],
    possibleExcess: [
      ...rule.possibleExcess,
    ],
  }
}

function buildPattern(
  name: string,
  numbers: NumerologyDigit[],
  pattern: {
    presentCount: number
    totalCount: number
    status: string
    missing: NumerologyDigit[]
  }
): ReportPatternItem {
  return {
    name,
    numbers: numbers.join('-'),
    status: pattern.status,
    presentCount:
      pattern.presentCount,
    totalCount:
      pattern.totalCount,
    missingNumbers: [
      ...pattern.missing,
    ],
  }
}

function buildDevelopmentItem(
  number: NumerologyDigit
): ReportDevelopmentItem {
  const numberRule =
    getNumberRule(number)

  const missingRule =
    getMissingNumberRule(number)

  return {
    number,
    graha: numberRule.graha,
    theme:
      missingRule.developmentTheme,
    areas: [
      ...missingRule.developmentAreas,
    ],
    practicalGuidance: [
      ...missingRule.practicalGuidance,
    ],
  }
}

export function buildNumerologyV2ReportContent(
  calculation: NumerologyCalculationResult,
  evidence: EvidenceEngineResult
): NumerologyV2ReportContent {
  const coreNumberSet =
    new Set<NumerologyDigit>([
      calculation.mulank.final,
      calculation.bhagyank.final,
      calculation.nameNumber.finalNumber,
    ])

  const coreNumbers =
    evidence.rankedNumbers
      .filter((item) =>
        coreNumberSet.has(item.number)
      )
      .map(buildNumberProfile)

  const grahaAnalysis =
    evidence.rankedNumbers
      .filter(
        (item) =>
          item.score > 0
      )
      .map(buildNumberProfile)

  const development =
    evidence.developmentNumbers.map(
      buildDevelopmentItem
    )

  const rows: ReportPatternItem[] = [
    buildPattern(
      'Mental Row',
      [4, 9, 2],
      calculation.rows.mental
    ),

    buildPattern(
      'Emotional / Will Row',
      [3, 5, 7],
      calculation.rows.emotionalWill
    ),

    buildPattern(
      'Practical / Material Row',
      [8, 1, 6],
      calculation.rows.practicalMaterial
    ),
  ]

  const columns: ReportPatternItem[] = [
    buildPattern(
      'First Column',
      [4, 3, 8],
      calculation.columns.first
    ),

    buildPattern(
      'Middle Column',
      [9, 5, 1],
      calculation.columns.middle
    ),

    buildPattern(
      'Third Column',
      [2, 7, 6],
      calculation.columns.third
    ),
  ]

  const rajyogs: ReportPatternItem[] = [
    buildPattern(
      'Golden Rajyog',
      [4, 5, 6],
      calculation.rajyog.golden
    ),

    buildPattern(
      'Silver Rajyog',
      [2, 5, 8],
      calculation.rajyog.silver
    ),
  ]

  return {
    reportVersion:
      'TSIA_NUMEROLOGY_V2',

    client: {
      fullName:
        calculation.input.fullName,

      dateOfBirth:
        calculation.input.dateOfBirth,
    },

    atAGlance: {
      mulank: {
        label: 'Mulank',
        value:
          `${calculation.mulank.compound}/${calculation.mulank.final}`,
      },

      bhagyank: {
        label: 'Bhagyank',
        value:
          `${calculation.bhagyank.compound}/${calculation.bhagyank.final}`,
      },

      nameNumber: {
        label: 'Name Number',
        value:
          `${calculation.nameNumber.compoundTotal}/${calculation.nameNumber.finalNumber}`,
      },

      strongestNumbers: [
        ...evidence.strongestNumbers,
      ],

      developmentNumbers: [
        ...evidence.developmentNumbers,
      ],
    },

    coreNumbers,

    loShu: {
      counts: {
        ...calculation.loShu.counts,
      },

      presentNumbers: [
        ...calculation.loShu.presentNumbers,
      ],

      missingNumbers: [
        ...calculation.loShu.missingNumbers,
      ],

      repeatedNumbers: {
        ...calculation.loShu.repeatedNumbers,
      },
    },

    patterns: {
      rows,
      columns,
      rajyogs,
    },

    grahaAnalysis,

    development,

    writingInstructions: [
      'Use only verified calculation and evidence data.',
      'Never recalculate numerology inside the writing layer.',
      'Use a positive-first interpretation structure.',
      'Explain strengths before development areas.',
      'Do not describe a missing number as a fixed weakness.',
      'Do not infer marriage, children, divorce, wealth, illness or other life facts that were not provided.',
      'Do not repeat the same theme in multiple sections when several signals reinforce it.',
      'When signals appear different, explain how both tendencies may coexist rather than treating them as contradictions.',
      'Use cautious language for possible excess tendencies.',
      'Keep Mulank, Bhagyank and Name Number roles distinct.',
      'Use Lo Shu repetition and complete patterns as reinforcement evidence.',
      'Treat development guidance as practical guidance rather than deterministic prediction.',
      'Do not invent meanings for rows, columns or Rajyogs beyond approved TSIA rules.',
    ],
  }
}