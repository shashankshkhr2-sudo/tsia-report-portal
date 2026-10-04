import type {
  NumerologyDigit,
} from '@/lib/numerology/types'

/**
 * TSIA Numerology Intelligence V3
 * Compound Birth Context Rules
 *
 * IMPORTANT:
 * - Root/Mulank remains Primary Core Evidence.
 * - Compound Birth Number is Contextual Evidence.
 * - Compound does NOT replace the root number.
 * - Compound does NOT count as independent confirmation
 *   of its own reduced root.
 * - Compound alone cannot determine outcomes,
 *   Needed Number, remedy, Graha diagnosis or Y3.
 */

export type CompoundBirthNumber =
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31

export type CompoundTone =
  | 'SUPPORTIVE'
  | 'CAUTIONARY'
  | 'MIXED'
  | 'REFLECTIVE'

export type CompoundRule = {
  compound: CompoundBirthNumber

  root: NumerologyDigit

  tone: CompoundTone

  title: string

  contextualMeaning: string

  constructiveDirection: string

  restrictions: readonly string[]

  sourceSystem: 'CHEIRO_VERIFIED_CONTEXT'

  evidenceRole: 'COMPOUND_CONTEXT'
}

/**
 * Global restrictions applied to EVERY
 * compound-number interpretation.
 */

export const COMPOUND_GLOBAL_RESTRICTIONS =
  [
    'NO_SPECIFIC_LIFE_EVENT',
    'NO_GUARANTEED_SUCCESS',
    'NO_GUARANTEED_FAILURE',
    'NO_MARRIAGE_OUTCOME',
    'NO_RELATIONSHIP_OUTCOME',
    'NO_FINANCIAL_OUTCOME',
    'NO_CAREER_OUTCOME',
    'NO_HEALTH_EVENT',
    'NO_ACCIDENT_OR_DEATH_PREDICTION',
    'NO_LEGAL_EVENT_PREDICTION',
    'NO_AUTOMATIC_NEEDED_NUMBER',
    'NO_AUTOMATIC_GRAHA_REMEDY',
    'NO_AUTOMATIC_Y3',
  ] as const

export const COMPOUND_RULES:
  Record<CompoundBirthNumber, CompoundRule> = {

  10: {
    compound: 10,
    root: 1,
    tone: 'SUPPORTIVE',

    title:
      'Cycles, Opportunity & Direction',

    contextualMeaning:
      'A contextual theme of changing cycles, opportunity, recognition and realization. Constructive expression depends on how personal direction and opportunity are handled.',

    constructiveDirection:
      'Use opportunities with clear direction and responsible personal judgment.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  11: {
    compound: 11,
    root: 2,
    tone: 'CAUTIONARY',

    title:
      'Discernment Around External Influence',

    contextualMeaning:
      'A contextual caution around hidden difficulty, opposition or unreliable external influence. It calls for discernment rather than fear.',

    constructiveDirection:
      'Use careful judgment when evaluating outside influence and important advice.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  12: {
    compound: 12,
    root: 3,
    tone: 'CAUTIONARY',

    title:
      'Discernment & Responsible Expression',

    contextualMeaning:
      'A contextual theme involving sacrifice, discernment and the possibility of becoming overly influenced by the agendas or expectations of others.',

    constructiveDirection:
      'Maintain clarity about personal priorities while contributing knowledge, ideas or support to others.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  13: {
    compound: 13,
    root: 4,
    tone: 'MIXED',

    title:
      'Transformation & Restructuring',

    contextualMeaning:
      'A contextual theme of change, reconstruction, transformation or restructuring. It does not predict disruption as an unavoidable event.',

    constructiveDirection:
      'Use change deliberately and rebuild ineffective structures with responsibility.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  14: {
    compound: 14,
    root: 5,
    tone: 'MIXED',

    title:
      'Movement, Change & Prudence',

    contextualMeaning:
      'A contextual theme of movement, change, combinations and opportunity accompanied by an increased need for prudent judgment.',

    constructiveDirection:
      'Remain adaptable while checking risk before making rapid changes or commitments.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  15: {
    compound: 15,
    root: 6,
    tone: 'SUPPORTIVE',

    title:
      'Influence, Attraction & Responsibility',

    contextualMeaning:
      'A contextual theme of magnetism, persuasion and the ability to attract attention, support or resources. Influence requires responsible use.',

    constructiveDirection:
      'Use personal influence ethically and avoid relying only on charm or persuasion.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  16: {
    compound: 16,
    root: 7,
    tone: 'CAUTIONARY',

    title:
      'Humility, Preparation & Foresight',

    contextualMeaning:
      'A contextual caution against overconfidence, insufficient preparation or ignoring important warning signs. It must never be converted into a catastrophe prediction.',

    constructiveDirection:
      'Use reflection, preparation and humility before consequential action.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  17: {
    compound: 17,
    root: 8,
    tone: 'SUPPORTIVE',

    title:
      'Endurance & Lasting Contribution',

    contextualMeaning:
      'A contextual potential for constructive endurance to contribute to meaningful or lasting achievement after difficulty. Recognition is not guaranteed.',

    constructiveDirection:
      'Apply persistence toward work that has long-term value rather than pursuing recognition itself.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  18: {
    compound: 18,
    root: 9,
    tone: 'CAUTIONARY',

    title:
      'Force, Conflict & Constructive Purpose',

    contextualMeaning:
      'A contextual caution that conflict, material struggle, opposition or force should not override sound judgment and constructive purpose.',

    constructiveDirection:
      'Direct strong action toward constructive objectives and avoid unnecessary escalation.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  19: {
    compound: 19,
    root: 1,
    tone: 'SUPPORTIVE',

    title:
      'Achievement & Constructive Recognition',

    contextualMeaning:
      'A favourable contextual theme connected with achievement, progress and recognition when personal agency is used constructively.',

    constructiveDirection:
      'Use independence and initiative responsibly without treating favourable potential as guaranteed success.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  20: {
    compound: 20,
    root: 2,
    tone: 'REFLECTIVE',

    title:
      'Awakening, Purpose & Reorientation',

    contextualMeaning:
      'A contextual theme of awakening, renewed purpose or reorientation. Material progress may not always be the only or immediate emphasis.',

    constructiveDirection:
      'Pay attention to meaningful changes in priorities and allow important direction to mature before forcing outcomes.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  21: {
    compound: 21,
    root: 3,
    tone: 'SUPPORTIVE',

    title:
      'Advancement Through Development',

    contextualMeaning:
      'A favourable contextual theme of advancement or recognition following effort, testing or development. It does not guarantee success.',

    constructiveDirection:
      'Develop knowledge and expression consistently rather than relying on favourable potential alone.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  22: {
    compound: 22,
    root: 4,
    tone: 'CAUTIONARY',

    title:
      'Reality Testing & Independent Judgment',

    contextualMeaning:
      'A contextual caution around illusion, poor judgment or excessive influence from others. Within this Cheiro-derived layer, it is not automatically interpreted as a Master Builder number.',

    constructiveDirection:
      'Verify assumptions independently and distinguish realistic opportunity from attractive but weakly supported ideas.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  23: {
    compound: 23,
    root: 5,
    tone: 'SUPPORTIVE',

    title:
      'Support, Opportunity & Advancement',

    contextualMeaning:
      'A favourable contextual theme involving assistance, protection or advancement through helpful support or influential associations. It does not guarantee success.',

    constructiveDirection:
      'Use supportive relationships and opportunities constructively while retaining personal judgment.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  24: {
    compound: 24,
    root: 6,
    tone: 'SUPPORTIVE',

    title:
      'Support Through Connection',

    contextualMeaning:
      'A favourable contextual theme involving affection, relationships or helpful associations. It does not guarantee relationship success.',

    constructiveDirection:
      'Value supportive relationships while maintaining balanced responsibility and personal boundaries.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  25: {
    compound: 25,
    root: 7,
    tone: 'REFLECTIVE',

    title:
      'Discernment Through Experience',

    contextualMeaning:
      'A contextual theme in which judgment and discernment may strengthen through observation, experience and careful examination.',

    constructiveDirection:
      'Convert experience into clearer judgment through reflection rather than relying only on immediate impressions.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  26: {
    compound: 26,
    root: 8,
    tone: 'CAUTIONARY',

    title:
      'Prudence in Material Judgment & Associations',

    contextualMeaning:
      'A contextual caution around partnerships, speculation, external advice or material judgment. It does not predict financial loss or failed partnerships.',

    constructiveDirection:
      'Independently verify important financial, material and partnership decisions before committing.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  27: {
    compound: 27,
    root: 9,
    tone: 'SUPPORTIVE',

    title:
      'Constructive Capability & Authority',

    contextualMeaning:
      'A favourable contextual theme connected with productive capability, independent execution or constructive authority. It does not guarantee status or recognition.',

    constructiveDirection:
      'Apply capability and decisive action toward useful, responsible and sustainable objectives.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  28: {
    compound: 28,
    root: 1,
    tone: 'CAUTIONARY',

    title:
      'Independent Judgment in Associations',

    contextualMeaning:
      'A contextual caution around trust, opposition, partnerships or reversals. It does not predict betrayal or unavoidable loss.',

    constructiveDirection:
      'Retain independent judgment in important associations and verify consequential commitments carefully.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  29: {
    compound: 29,
    root: 2,
    tone: 'CAUTIONARY',

    title:
      'Discernment in Trust & Relationships',

    contextualMeaning:
      'A contextual caution around uncertainty, trust, unreliable associations or disappointment. It does not predict relationship failure.',

    constructiveDirection:
      'Combine emotional receptivity with careful judgment and clear boundaries in important relationships and associations.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  30: {
    compound: 30,
    root: 3,
    tone: 'REFLECTIVE',

    title:
      'Thought, Reflection & Intellectual Orientation',

    contextualMeaning:
      'A contextual theme emphasizing thought, reflection and intellectual orientation. Material motivation may sometimes be secondary to ideas, understanding or meaning.',

    constructiveDirection:
      'Convert thought and understanding into purposeful expression and practical application when needed.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },

  31: {
    compound: 31,
    root: 4,
    tone: 'REFLECTIVE',

    title:
      'Independent & Self-Contained Orientation',

    contextualMeaning:
      'A contextual theme of independence, self-containment or reflective distance from conventional expectations. It should not automatically be interpreted as isolation.',

    constructiveDirection:
      'Use independent perspective constructively while remaining open to useful participation and collaboration.',

    restrictions:
      COMPOUND_GLOBAL_RESTRICTIONS,

    sourceSystem:
      'CHEIRO_VERIFIED_CONTEXT',

    evidenceRole:
      'COMPOUND_CONTEXT',
  },
}

/**
 * Checks whether a birth day has a
 * compound rule in the approved
 * TSIA compound layer.
 *
 * Birth days 1-9 use the root
 * functional quality only.
 */
export function isCompoundBirthNumber(
  value: number
): value is CompoundBirthNumber {
  return (
    Number.isInteger(value) &&
    value >= 10 &&
    value <= 31
  )
}

/**
 * Returns the approved compound
 * contextual rule for birth days
 * 10-31.
 *
 * Returns null for birth days 1-9.
 */
export function getCompoundRule(
  birthDay: number
): CompoundRule | null {
  if (!isCompoundBirthNumber(birthDay)) {
    return null
  }

  return COMPOUND_RULES[birthDay]
}