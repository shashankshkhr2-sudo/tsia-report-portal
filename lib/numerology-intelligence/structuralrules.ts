import type {
  StructuralPatternId,
  StructuralStatus,
} from './structuralpatterns'

export type StructuralRule = {
  id: StructuralPatternId
  title: string
  functionalMeaning: string
  completeMeaning: string
  partialMeaning: string
  absentMeaning: string
  prohibitedInferences: string[]
  isRajyog: boolean
}

export const STRUCTURAL_RULES: Record<
  StructuralPatternId,
  StructuralRule
> = {
  ROW_4_9_2: {
    id: 'ROW_4_9_2',
    title: 'Mental Row — 4-9-2',

    functionalMeaning:
      'Mental Processing & Response Formation',

    completeMeaning:
      'Supports coordination between restructuring an existing frame, directed response, and receptivity to people or context.',

    partialMeaning:
      'Some components of mental processing and response formation are represented, while one or more component qualities are less structurally supported.',

    absentMeaning:
      'This structure is not represented through the Personal Lo Shu. Other evidence must be reviewed before drawing any broader conclusion.',

    prohibitedInferences: [
      'high intelligence',
      'low intelligence',
      'strong mind',
      'weak mind',
      'excellent decision maker',
      'poor decision maker',
    ],

    isRajyog: false,
  },

  ROW_3_5_7: {
    id: 'ROW_3_5_7',
    title: 'Emotional / Will Row — 3-5-7',

    functionalMeaning:
      'Meaning Processing, Adaptation & Reflective Integration',

    completeMeaning:
      'Supports coordination between understanding and expressing meaning, adapting to information, and reflective examination.',

    partialMeaning:
      'Some components of meaning processing, adaptation and reflection are represented, while one or more component qualities are less structurally supported.',

    absentMeaning:
      'This structure is not represented through the Personal Lo Shu. It does not establish emotional weakness or lack of willpower.',

    prohibitedInferences: [
      'emotionally strong',
      'emotionally weak',
      'strong willpower',
      'weak willpower',
      'emotionally unstable',
    ],

    isRajyog: false,
  },

  ROW_8_1_6: {
    id: 'ROW_8_1_6',
    title: 'Practical / Material Row — 8-1-6',

    functionalMeaning:
      'Responsibility, Agency & Practical Stewardship',

    completeMeaning:
      'Supports coordination between sustained responsibility, personal agency, and responsible handling of what or whom the person values.',

    partialMeaning:
      'Some practical capabilities are represented while one or more components are less structurally supported.',

    absentMeaning:
      'This structure is not represented through the Personal Lo Shu and does not establish financial or practical incapacity.',

    prohibitedInferences: [
      'wealth',
      'poverty',
      'material success',
      'financial failure',
      'property ownership',
      'business success',
    ],

    isRajyog: false,
  },

  COLUMN_4_3_8: {
    id: 'COLUMN_4_3_8',
    title: 'Column — 4-3-8',

    functionalMeaning:
      'Constructive Development & Sustained Execution',

    completeMeaning:
      'Supports coordination between restructuring what needs to change, developing understanding, and sustaining responsibility over time.',

    partialMeaning:
      'Some components of constructive development and sustained execution are represented while another component may be less structurally supported.',

    absentMeaning:
      'This structural combination is not represented through the Personal Lo Shu. Other evidence must be considered before assessing execution or development style.',

    prohibitedInferences: [
      'successful businessman',
      'highly educated',
      'disciplined person',
      'career success',
      'business success',
    ],

    isRajyog: false,
  },

  COLUMN_9_5_1: {
    id: 'COLUMN_9_5_1',
    title: 'Column — 9-5-1',

    functionalMeaning:
      'Directed Decision & Adaptive Action',

    completeMeaning:
      'Supports coordination between directed action, adaptive information processing, and independent self-direction.',

    partialMeaning:
      'Some components of directed and adaptive action are represented while one or more components are less structurally supported.',

    absentMeaning:
      'This structure is not represented through the Personal Lo Shu. It does not establish indecision or inability to act.',

    prohibitedInferences: [
      'natural leader',
      'successful entrepreneur',
      'impulsive',
      'indecisive',
      'fast decision maker',
      'business success',
    ],

    isRajyog: false,
  },

  COLUMN_2_7_6: {
    id: 'COLUMN_2_7_6',
    title: 'Column — 2-7-6',

    functionalMeaning:
      'Relational Understanding & Reflective Connection',

    completeMeaning:
      'Supports coordination between receptivity to people, reflective discernment, and sustaining care or harmony in important connections.',

    partialMeaning:
      'Some relational and reflective capabilities are represented while one or more components are less structurally supported.',

    absentMeaning:
      'This structure is not represented through the Personal Lo Shu and does not establish inability to form or sustain relationships.',

    prohibitedInferences: [
      'happy marriage',
      'failed marriage',
      'relationship problems',
      'unable to love',
      'family problems',
      'poor relationship judgment',
    ],

    isRajyog: false,
  },

  GOLDEN_RAJYOG_4_5_6: {
    id: 'GOLDEN_RAJYOG_4_5_6',
    title: 'Golden Rajyog — 4-5-6',

    functionalMeaning:
      'Adaptive Opportunity & Constructive Consolidation',

    completeMeaning:
      'A favourable structural combination supporting adaptive opportunity, constructive development, and the capacity to consolidate value or recognition when wider evidence and circumstances support it.',

    partialMeaning:
      'The Golden Rajyog is not complete. Some component qualities are represented, but the incomplete structure must not be treated as an existing Rajyog.',

    absentMeaning:
      'Golden Rajyog is not present. Its absence does not predict lack of success, recognition, opportunity or material development.',

    prohibitedInferences: [
      'guaranteed success',
      'guaranteed wealth',
      'guaranteed fame',
      'guaranteed recognition',
      'automatic needed number',
      'automatic remedy',
      'automatic Y3',
    ],

    isRajyog: true,
  },

  SILVER_RAJYOG_2_5_8: {
    id: 'SILVER_RAJYOG_2_5_8',
    title: 'Silver Rajyog — 2-5-8',

    functionalMeaning:
      'Receptive Adaptation & Long-Term Consolidation',

    completeMeaning:
      'A favourable structural combination supporting receptivity, adaptive intelligence and sustained responsibility, with potential relevance to long-term consolidation and material stability when wider evidence supports it.',

    partialMeaning:
      'The Silver Rajyog is not complete. Some component qualities are represented, but the incomplete structure must not be treated as an existing Rajyog.',

    absentMeaning:
      'Silver Rajyog is not present. Its absence does not predict financial instability, lack of assets, or material difficulty.',

    prohibitedInferences: [
      'guaranteed wealth',
      'guaranteed property',
      'guaranteed assets',
      'financial success',
      'financial failure',
      'automatic needed number',
      'automatic remedy',
      'automatic Y3',
    ],

    isRajyog: true,
  },
}

export function getStructuralRule(
  id: StructuralPatternId
): StructuralRule {
  return STRUCTURAL_RULES[id]
}

export function getStructuralMeaning(
  id: StructuralPatternId,
  status: StructuralStatus
): string {
  const rule = STRUCTURAL_RULES[id]

  if (status === 'COMPLETE') {
    return rule.completeMeaning
  }

  if (status === 'PARTIAL') {
    return rule.partialMeaning
  }

  return rule.absentMeaning
}