import type {
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  FunctionalQuality,
  FunctionalQualityId,
} from './types'

export const FUNCTIONAL_QUALITIES:
  Record<NumerologyDigit, FunctionalQuality> = {

  1: {
    number: 1,
    graha: 'Surya',
    id: 'INDIVIDUAL_AGENCY',
    title:
      'Individual Agency / Self-Direction',

    balancedExpression: [
      'Self-direction',
      'Initiative',
      'Independent expression',
      'Appropriate confidence',
      'Originality',
      'Ownership',
    ],

    possibleOverExpression: [
      'Rigidity',
      'Excessive self-reliance',
      'Dominance',
      'Resistance to useful input',
    ],

    underSupportedExpression: [
      'Independent expression may require development',
      'Initiative may require conscious development',
      'Self-trust may require development',
    ],
  },

  2: {
    number: 2,
    graha: 'Chandra',
    id: 'RELATIONAL_RECEPTIVITY',
    title:
      'Relational Receptivity / Emotional Attunement',

    balancedExpression: [
      'Empathy',
      'Cooperation',
      'Tact',
      'Diplomacy',
      'Patience',
      'Perspective capacity',
      'Meaningful partnership',
    ],

    possibleOverExpression: [
      'Over-sensitivity',
      'Excessive accommodation',
      'Reassurance-seeking',
      'Blurred emotional boundaries',
      'Conflict avoidance',
      'Difficulty deciding independently',
    ],

    underSupportedExpression: [
      'Listening may require development',
      'Emotional awareness may require development',
      'Cooperation may require conscious development',
      'Considering other perspectives may require development',
    ],
  },

  3: {
    number: 3,
    graha: 'Guru',
    id: 'KNOWLEDGE_EXPRESSION',
    title:
      'Knowledge Expansion / Meaningful Expression',

    balancedExpression: [
      'Learning',
      'Conceptual understanding',
      'Creativity',
      'Explanation',
      'Teaching',
      'Advisory ability',
      'Constructive growth',
    ],

    possibleOverExpression: [
      'Scattered attention',
      'Excessive ideation',
      'Over-explaining',
      'Unsolicited advice',
      'Intellectual overconfidence',
      'Difficulty converting ideas into focused action',
    ],

    underSupportedExpression: [
      'Structured learning may require development',
      'Articulating ideas may require development',
      'Creative expression may require development',
      'Converting experience into clear understanding may require development',
    ],
  },

  4: {
    number: 4,
    graha: 'Rahu',
    id: 'ADAPTIVE_RESTRUCTURING',
    title:
      'Nonconventional Restructuring / Adaptive Disruption',

    balancedExpression: [
      'Originality',
      'Unconventional problem-solving',
      'Reform',
      'Challenging ineffective structures',
      'Resilience amid change',
    ],

    possibleOverExpression: [
      'Disruption for its own sake',
      'Contrarianism',
      'Instability',
      'Unnecessary resistance',
      'Distrust',
      'Erratic changes',
    ],

    underSupportedExpression: [
      'Restructuring ability may require development',
      'Challenging ineffective patterns may require development',
      'Adaptation through structural change may require development',
    ],
  },

  5: {
    number: 5,
    graha: 'Budh',
    id: 'ADAPTIVE_INTELLIGENCE',
    title:
      'Adaptive Intelligence / Information Exchange',

    balancedExpression: [
      'Quick comprehension',
      'Adaptability',
      'Information exchange',
      'Verbal agility',
      'Mental agility',
      'Responsiveness',
    ],

    possibleOverExpression: [
      'Restlessness',
      'Scattered attention',
      'Excessive change',
      'Impulsive switching',
      'Talking without sufficient depth',
    ],

    underSupportedExpression: [
      'Adaptability may require development',
      'Rapid information processing may require development',
      'Flexible communication may require development',
    ],
  },

  6: {
    number: 6,
    graha: 'Shukra',
    id: 'HARMONIOUS_CONNECTION',
    title:
      'Harmonious Connection / Value & Care',

    balancedExpression: [
      'Care',
      'Affection',
      'Harmony-building',
      'Aesthetic awareness',
      'Value awareness',
      'Responsibility toward close relationships',
    ],

    possibleOverExpression: [
      'Over-indulgence',
      'Excessive comfort-seeking',
      'Over-attachment',
      'Excessive pleasing or caretaking',
      'Material or aesthetic preoccupation',
    ],

    underSupportedExpression: [
      'Sustaining harmony may require development',
      'Expressing care may require conscious development',
      'Balancing personal pleasure with relational responsibility may require development',
    ],
  },

  7: {
    number: 7,
    graha: 'Ketu',
    id: 'REFLECTIVE_DISCERNMENT',
    title:
      'Reflective Discernment / Inner Inquiry',

    balancedExpression: [
      'Analysis',
      'Reflection',
      'Discernment',
      'Inquiry',
      'Observation',
      'Inner awareness',
    ],

    possibleOverExpression: [
      'Withdrawal',
      'Excessive analysis',
      'Detachment',
      'Excessive skepticism',
      'Isolation',
      'Difficulty translating insight into action',
    ],

    underSupportedExpression: [
      'Reflection may require development',
      'Deeper examination may require development',
      'Independent inner processing may require development',
    ],
  },

  8: {
    number: 8,
    graha: 'Shani',
    id: 'STRUCTURED_RESPONSIBILITY',
    title:
      'Endurance / Structured Responsibility',

    balancedExpression: [
      'Persistence',
      'Accountability',
      'Long-term effort',
      'Material responsibility',
      'Organizational endurance',
    ],

    possibleOverExpression: [
      'Rigidity',
      'Excessive burden-bearing',
      'Control',
      'Pessimism',
      'Work becoming overly heavy or inflexible',
    ],

    underSupportedExpression: [
      'Sustaining responsibility may require development',
      'Long-term execution may require development',
      'Material organization may require development',
    ],
  },

  9: {
    number: 9,
    graha: 'Mangal',
    id: 'DIRECTED_FORCE',
    title:
      'Directed Force / Courageous Action',

    balancedExpression: [
      'Courage',
      'Decisive action',
      'Persistence under challenge',
      'Protective energy',
      'Capacity to act strongly when required',
    ],

    possibleOverExpression: [
      'Confrontation',
      'Impatience',
      'Anger',
      'Excessive force',
      'Acting before sufficient reflection',
    ],

    underSupportedExpression: [
      'Assertive action may require development',
      'Confronting difficulty may require development',
      'Sustained courage may require development',
    ],
  },
}

/**
 * Retrieve a Core Functional Quality
 * from its numerology number.
 */
export function getFunctionalQuality(
  number: NumerologyDigit
): FunctionalQuality {
  return FUNCTIONAL_QUALITIES[number]
}

/**
 * Retrieve a number from its
 * Functional Quality ID.
 */
export function getNumberForFunctionalQuality(
  id: FunctionalQualityId
): NumerologyDigit {
  const numbers =
    Object.keys(FUNCTIONAL_QUALITIES)
      .map(Number) as NumerologyDigit[]

  const match = numbers.find(
    (number) =>
      FUNCTIONAL_QUALITIES[number].id === id
  )

  if (!match) {
    throw new Error(
      `Unknown functional quality: ${id}`
    )
  }

  return match
}