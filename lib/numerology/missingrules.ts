// lib/numerology/missingrules.ts

import type {
  NumerologyDigit,
} from './types'

export type MissingNumberRule = {
  number: NumerologyDigit

  developmentTheme: string

  developmentAreas: string[]

  practicalGuidance: string[]

  interpretationPrinciples: string[]
}

export const MISSING_NUMBER_RULES: Record<
  NumerologyDigit,
  MissingNumberRule
> = {
  1: {
    number: 1,

    developmentTheme:
      'Developing confident initiative and independent expression.',

    developmentAreas: [
      'initiative',
      'confident expression',
      'independent decision-making',
    ],

    practicalGuidance: [
      'Practice expressing personal opinions clearly.',
      'Take ownership of small independent decisions.',
      'Build confidence through consistent self-directed action.',
    ],

    interpretationPrinciples: [
      'Do not describe missing 1 as lack of leadership.',
      'Check Mulank, Bhagyank and Name Number before drawing conclusions.',
      'Strong Surya reinforcement elsewhere can compensate for the missing grid number.',
    ],
  },

  2: {
    number: 2,

    developmentTheme:
      'Developing receptive communication, emotional awareness and cooperation.',

    developmentAreas: [
      'receptive listening',
      'emotional awareness',
      'cooperation',
    ],

    practicalGuidance: [
      'Practice listening before responding.',
      'Allow space for other viewpoints.',
      'Develop awareness of emotional reactions in relationships.',
    ],

    interpretationPrinciples: [
      'Do not describe missing 2 as inability to maintain relationships.',
      'Consider Chandra influence from core numbers and other chart structures.',
      'Relationship conclusions require multiple supporting signals.',
    ],
  },

  3: {
    number: 3,

    developmentTheme:
      'Developing structured expression, communication and creative learning.',

    developmentAreas: [
      'structured expression',
      'communication',
      'learning',
      'creative development',
    ],

    practicalGuidance: [
      'Organise ideas before communicating them.',
      'Maintain a regular learning or creative practice.',
      'Use writing or structured discussion to improve expression.',
    ],

    interpretationPrinciples: [
      'Do not interpret missing 3 as lack of intelligence or creativity.',
      'Check Guru reinforcement elsewhere in the chart.',
      'Separate communication development from intellectual ability.',
    ],
  },

  4: {
    number: 4,

    developmentTheme:
      'Developing organisation, routines, systems and consistent follow-through.',

    developmentAreas: [
      'routines',
      'organisation',
      'systems',
      'follow-through',
    ],

    practicalGuidance: [
      'Use simple routines for recurring responsibilities.',
      'Break larger tasks into organised steps.',
      'Strengthen consistency by completing planned actions.',
    ],

    interpretationPrinciples: [
      'Do not describe missing 4 as laziness or lack of discipline.',
      'Check other indicators of structure and responsibility.',
      'Treat this as an organisational development area rather than a fixed weakness.',
    ],
  },

  5: {
    number: 5,

    developmentTheme:
      'Developing adaptability, balanced communication and flexible decision-making.',

    developmentAreas: [
      'adaptability',
      'balanced communication',
      'flexible decision-making',
    ],

    practicalGuidance: [
      'Pause before making important decisions.',
      'Consider more than one practical option.',
      'Practice adapting plans when circumstances change.',
    ],

    interpretationPrinciples: [
      'Do not describe missing 5 as lack of intelligence.',
      'Consider Budh influence from core numbers and combinations.',
      'Because 5 occupies the centre of the Lo Shu grid, evaluate its absence together with surrounding patterns.',
    ],
  },

  6: {
    number: 6,

    developmentTheme:
      'Developing balanced responsibility, relationship harmony and sustainable care.',

    developmentAreas: [
      'shared responsibility',
      'relationship harmony',
      'balanced care',
    ],

    practicalGuidance: [
      'Share responsibilities rather than carrying everything alone.',
      'Balance care for others with personal boundaries.',
      'Use clear communication when responsibilities are shared.',
    ],

    interpretationPrinciples: [
      'Do not interpret missing 6 as lack of family values or affection.',
      'Check Shukra reinforcement and relationship-related combinations.',
      'Family and relationship conclusions require multiple supporting indicators.',
    ],
  },

  7: {
    number: 7,

    developmentTheme:
      'Developing reflection, research, introspection and patient review.',

    developmentAreas: [
      'reflection',
      'research',
      'introspection',
      'patient review',
    ],

    practicalGuidance: [
      'Create regular time for reflection.',
      'Research important decisions before acting.',
      'Review experiences to identify useful lessons.',
    ],

    interpretationPrinciples: [
      'Do not describe missing 7 as lack of intuition or spirituality.',
      'Check Ketu reinforcement elsewhere before interpreting the pattern.',
      'Keep spiritual conclusions separate from factual personality claims.',
    ],
  },

  8: {
    number: 8,

    developmentTheme:
      'Developing patience, long-term discipline and material organisation.',

    developmentAreas: [
      'patience',
      'long-term discipline',
      'financial organisation',
      'material organisation',
    ],

    practicalGuidance: [
      'Use long-term planning for financial and material responsibilities.',
      'Build consistency instead of expecting immediate results.',
      'Maintain organised records for important commitments.',
    ],

    interpretationPrinciples: [
      'Do not interpret missing 8 as poverty or inability to create wealth.',
      'Money conclusions require multiple financial and behavioural indicators.',
      'Check Shani reinforcement elsewhere in the chart.',
    ],
  },

  9: {
    number: 9,

    developmentTheme:
      'Developing constructive courage, purposeful action and broader perspective.',

    developmentAreas: [
      'constructive courage',
      'purposeful action',
      'broader perspective',
    ],

    practicalGuidance: [
      'Direct energy toward clearly defined objectives.',
      'Consider long-term consequences before forceful action.',
      'Develop courage through purposeful and measured decisions.',
    ],

    interpretationPrinciples: [
      'Do not describe missing 9 as weakness or lack of courage.',
      'Check Mangal reinforcement elsewhere in the chart.',
      'Separate constructive drive from impulsive intensity.',
    ],
  },
}

export function getMissingNumberRule(
  number: NumerologyDigit
): MissingNumberRule {
  return MISSING_NUMBER_RULES[number]
}