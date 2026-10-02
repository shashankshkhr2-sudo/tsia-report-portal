// lib/numerology/patternrules.ts

import type {
  NumerologyDigit,
  PatternStatus,
} from './types'

export type PatternCategory =
  | 'row'
  | 'column'
  | 'rajyog'

export type PatternRule = {
  key: string
  title: string
  numbers: NumerologyDigit[]
  category: PatternCategory
  theme: string
  completeMeaning: string[]
  partialMeaning: string[]
  absentMeaning: string[]
  interpretationPrinciples: string[]
}

export const PATTERN_RULES: Record<
  string,
  PatternRule
> = {
  mentalRow: {
    key: 'mentalRow',
    title: 'Mental Row',
    numbers: [4, 9, 2],
    category: 'row',
    theme:
      'Mental processing, ideas, perception and organised thought.',
    completeMeaning: [
      'The Mental Row is fully represented.',
      'Structure, purposeful action and emotional awareness are all available.',
    ],
    partialMeaning: [
      'The Mental Row is partially represented.',
      'Present numbers provide strengths while the missing number becomes a development area.',
    ],
    absentMeaning: [
      'The Mental Row has limited representation.',
      'Treat this as a development pattern rather than a fixed weakness.',
    ],
    interpretationPrinciples: [
      'Consider the exact present and missing numbers.',
      'Consider repetitions within the row.',
      'Check Mulank, Bhagyank and Name Number for reinforcement.',
      'Use positive-first interpretation.',
    ],
  },

  emotionalWillRow: {
    key: 'emotionalWillRow',
    title: 'Emotional / Will Row',
    numbers: [3, 5, 7],
    category: 'row',
    theme:
      'Expression, adaptability, reflection and internal processing.',
    completeMeaning: [
      'The Emotional / Will Row is fully represented.',
      'Expression, adaptability and reflection are all available.',
    ],
    partialMeaning: [
      'The Emotional / Will Row is partially represented.',
      'Existing numbers provide strengths while the missing number becomes a development area.',
    ],
    absentMeaning: [
      'The Emotional / Will Row has limited representation.',
      'This should not be described as emotional weakness.',
    ],
    interpretationPrinciples: [
      'Do not infer emotional or mental-health diagnoses.',
      'Consider the exact present and missing numbers.',
      'Check communication and relationship indicators elsewhere.',
      'Use development language rather than negative labels.',
    ],
  },

  practicalMaterialRow: {
    key: 'practicalMaterialRow',
    title: 'Practical / Material Row',
    numbers: [8, 1, 6],
    category: 'row',
    theme:
      'Practical responsibility, initiative, management and execution.',
    completeMeaning: [
      'The Practical / Material Row is fully represented.',
      'Management, initiative and responsibility are all available.',
    ],
    partialMeaning: [
      'The Practical / Material Row is partially represented.',
      'Present numbers provide practical strengths while the missing number becomes a development area.',
    ],
    absentMeaning: [
      'The Practical / Material Row has limited representation.',
      'This does not mean inability to manage practical or financial matters.',
    ],
    interpretationPrinciples: [
      'Do not equate this row directly with wealth.',
      'Consider repetitions and core-number reinforcement.',
      'Separate practical behaviour from financial predictions.',
      'Use positive-first interpretation.',
    ],
  },

  firstColumn: {
    key: 'firstColumn',
    title: 'First Lo Shu Column',
    numbers: [4, 3, 8],
    category: 'column',
    theme:
      'Organisation, expression, learning and disciplined responsibility.',
    completeMeaning: [
      'The first Lo Shu column is complete.',
      'All three component energies are represented.',
    ],
    partialMeaning: [
      'The first Lo Shu column is partially represented.',
      'Present numbers provide strengths while the missing number becomes a development area.',
    ],
    absentMeaning: [
      'The first Lo Shu column has limited representation.',
      'Interpret the available numbers individually before drawing a combined conclusion.',
    ],
    interpretationPrinciples: [
      'Check individual number meanings first.',
      'Consider repeated numbers as reinforcement.',
      'Do not make deterministic career or money predictions from this column.',
    ],
  },

  middleColumn: {
    key: 'middleColumn',
    title: 'Middle Lo Shu Column',
    numbers: [9, 5, 1],
    category: 'column',
    theme:
      'Purposeful action, adaptability, communication and initiative.',
    completeMeaning: [
      'The middle Lo Shu column is complete.',
      'All three component energies are represented.',
    ],
    partialMeaning: [
      'The middle Lo Shu column is partially represented.',
      'Present numbers provide strengths while the missing number becomes a development area.',
    ],
    absentMeaning: [
      'The middle Lo Shu column has limited representation.',
      'Core-number reinforcement should be checked before drawing conclusions.',
    ],
    interpretationPrinciples: [
      'Evaluate 9, 5 and 1 individually before combining them.',
      'Check repetitions and core-number reinforcement.',
      'Do not make deterministic success predictions from this column.',
    ],
  },

  thirdColumn: {
    key: 'thirdColumn',
    title: 'Third Lo Shu Column',
    numbers: [2, 7, 6],
    category: 'column',
    theme:
      'Relationships, reflection, cooperation, care and responsibility.',
    completeMeaning: [
      'The third Lo Shu column is complete.',
      'All three component energies are represented.',
    ],
    partialMeaning: [
      'The third Lo Shu column is partially represented.',
      'Present numbers provide strengths while the missing number becomes a development area.',
    ],
    absentMeaning: [
      'The third Lo Shu column has limited representation.',
      'This must not be interpreted as inability to maintain relationships.',
    ],
    interpretationPrinciples: [
      'Do not infer marital status.',
      'Do not predict relationship success or failure from this column alone.',
      'Relationship conclusions require multiple supporting indicators.',
    ],
  },

  goldenRajyog: {
    key: 'goldenRajyog',
    title: 'Golden Rajyog',
    numbers: [4, 5, 6],
    category: 'rajyog',
    theme:
      'TSIA Golden 4-5-6 combination.',
    completeMeaning: [
      'Golden Rajyog is complete at 3/3.',
      'All three component energies are represented.',
    ],
    partialMeaning: [
      'Golden Rajyog is partial at 2/3.',
      'Two components are represented and the missing number becomes the development focus.',
    ],
    absentMeaning: [
      'Golden Rajyog is not formed.',
      'This is not a negative prediction.',
    ],
    interpretationPrinciples: [
      'Complete means 3/3 present.',
      'Partial means 2/3 present.',
      'Absent means 0/3 or 1/3 present.',
      'Do not promise wealth or guaranteed success from this pattern.',
    ],
  },

  silverRajyog: {
    key: 'silverRajyog',
    title: 'Silver Rajyog',
    numbers: [2, 5, 8],
    category: 'rajyog',
    theme:
      'TSIA Silver 2-5-8 combination.',
    completeMeaning: [
      'Silver Rajyog is complete at 3/3.',
      'All three component energies are represented.',
    ],
    partialMeaning: [
      'Silver Rajyog is partial at 2/3.',
      'Two components are represented and the missing number becomes the development focus.',
    ],
    absentMeaning: [
      'Silver Rajyog is not formed.',
      'This is not a negative prediction.',
    ],
    interpretationPrinciples: [
      'Complete means 3/3 present.',
      'Partial means 2/3 present.',
      'Absent means 0/3 or 1/3 present.',
      'Do not make deterministic money or life predictions from this pattern.',
    ],
  },
}

export type PatternRuleKey =
  | 'mentalRow'
  | 'emotionalWillRow'
  | 'practicalMaterialRow'
  | 'firstColumn'
  | 'middleColumn'
  | 'thirdColumn'
  | 'goldenRajyog'
  | 'silverRajyog'

export function getPatternRule(
  key: PatternRuleKey
): PatternRule {
  return PATTERN_RULES[key]
}

export function getPatternMeaning(
  key: PatternRuleKey,
  status: PatternStatus
): string[] {
  const rule = getPatternRule(key)

  if (status === 'complete') {
    return rule.completeMeaning
  }

  if (status === 'partial') {
    return rule.partialMeaning
  }

  return rule.absentMeaning
}