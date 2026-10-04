import type {
  EvidenceDirection,
  EvidenceLayer,
  EvidenceProvenance,
  EvidenceRole,
  FunctionalQualityId,
  IndependenceStatus,
  IntelligenceEvidence,
  ResolutionOperation,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Automated Validation Cases
 *
 * TEST-ONLY FILE.
 *
 * This file contains validation data only.
 * It must not modify V2 calculations
 * or V3 production methodology.
 */

export type ResolutionTestCase = {
  id: string
  name: string
  expected: ResolutionOperation
  evidence: IntelligenceEvidence[]
}

type EvidenceInput = {
  id: string
  direction: EvidenceDirection
  quality?: FunctionalQualityId
  layer?: EvidenceLayer
  provenance?: EvidenceProvenance
  provenanceGroup?: string
  role?: EvidenceRole
  independence?: IndependenceStatus
}

/**
 * Helper for creating synthetic evidence
 * used only by the automated validation suite.
 */
function makeEvidence(
  input: EvidenceInput
): IntelligenceEvidence {
  return {
    id: input.id,

    layer:
      input.layer ?? 'RAW_LO_SHU',

    provenance:
      input.provenance ??
      'DOB_RAW_DIGIT',

    provenanceGroup:
      input.provenanceGroup ??
      input.id,

    role:
      input.role ??
      'SUPPORTING_CONTEXT',

    roleDistinctness:
      'DISTINCT_ROLE',

    independence:
      input.independence ??
      'INDEPENDENT',

    functionalQualityId:
      input.quality ??
      'INDIVIDUAL_AGENCY',

    direction:
      input.direction,

    statement:
      `Validation evidence: ${input.id}`,
  }
}

/**
 * Synthetic cases for the frozen
 * Conclusion Resolution Matrix.
 *
 * These are software-validation cases,
 * not client predictions.
 */
export const RESOLUTION_TEST_CASES:
  readonly ResolutionTestCase[] = [
  {
    id: 'RES_REINFORCE',

    name:
      'Independent support reinforces',

    expected:
      'REINFORCE',

    evidence: [
      makeEvidence({
        id: 'SUPPORT_A',

        direction:
          'SUPPORTS',

        provenance:
          'DOB_DAY',

        provenanceGroup:
          'DOB_DAY',

        role:
          'PRIMARY_CORE',

        independence:
          'PARTIALLY_DEPENDENT',
      }),

      makeEvidence({
        id: 'SUPPORT_B',

        direction:
          'SUPPORTS',

        provenance:
          'FULL_NAME',

        provenanceGroup:
          'FULL_NAME',

        role:
          'NAME_EXPRESSION',

        independence:
          'INDEPENDENT',
      }),
    ],
  },

  {
    id: 'RES_COMPLEMENT',

    name:
      'Different supported qualities complement',

    expected:
      'COMPLEMENT',

    evidence: [
      makeEvidence({
        id: 'AGENCY_SUPPORT',

        direction:
          'SUPPORTS',

        quality:
          'INDIVIDUAL_AGENCY',
      }),

      makeEvidence({
        id: 'RECEPTIVITY_SUPPORT',

        direction:
          'SUPPORTS',

        quality:
          'RELATIONAL_RECEPTIVITY',
      }),
    ],
  },

  {
    id: 'RES_MODERATE',

    name:
      'Support with moderation',

    expected:
      'MODERATE',

    evidence: [
      makeEvidence({
        id: 'SUPPORTED_QUALITY',

        direction:
          'SUPPORTS',
      }),

      makeEvidence({
        id: 'MODERATOR',

        direction:
          'MODERATES',
      }),
    ],
  },

  {
    id: 'RES_COMPENSATE',

    name:
      'Under-support with compensation',

    expected:
      'COMPENSATE',

    evidence: [
      makeEvidence({
        id: 'UNDER_SUPPORT',

        direction:
          'UNDER_SUPPORTS',

        layer:
          'MISSING_NUMBER',

        provenance:
          'DERIVED_STRUCTURE',

        role:
          'STRUCTURAL',
      }),

      makeEvidence({
        id: 'COMPENSATING_SUPPORT',

        direction:
          'COMPENSATES',

        provenance:
          'FULL_NAME',

        provenanceGroup:
          'FULL_NAME',

        role:
          'NAME_EXPRESSION',

        independence:
          'INDEPENDENT',
      }),
    ],
  },

  {
    id: 'RES_TENSION',

    name:
      'Explicit tension only',

    expected:
      'TENSION',

    evidence: [
      makeEvidence({
        id: 'SUPPORTED_BASE',

        direction:
          'SUPPORTS',
      }),

      makeEvidence({
        id: 'EXPLICIT_TENSION',

        direction:
          'TENSION',
      }),
    ],
  },

  {
    id: 'RES_CONTEXTUALIZE',

    name:
      'Compound context contextualizes support',

    expected:
      'CONTEXTUALIZE',

    evidence: [
      makeEvidence({
        id: 'SUPPORTED_ROOT',

        direction:
          'SUPPORTS',

        role:
          'SUPPORTING_CONTEXT',
      }),

      makeEvidence({
        id: 'COMPOUND_CONTEXT',

        direction:
          'CONTEXTUALIZES',

        layer:
          'COMPOUND_BIRTH_CONTEXT',

        provenance:
          'DOB_DAY',

        provenanceGroup:
          'DOB_DAY',

        role:
          'COMPOUND_CONTEXT',

        independence:
          'DEPENDENT',
      }),
    ],
  },

  {
    id: 'RES_INSUFFICIENT',

    name:
      'Under-support alone is not reinforcement',

    expected:
      'INSUFFICIENT',

    evidence: [
      makeEvidence({
        id: 'MISSING_ONLY',

        direction:
          'UNDER_SUPPORTS',

        layer:
          'MISSING_NUMBER',

        provenance:
          'DERIVED_STRUCTURE',

        role:
          'STRUCTURAL',

        independence:
          'PARTIALLY_DEPENDENT',
      }),
    ],
  },
]

/**
 * Known real regression baseline.
 *
 * These values are calculation expectations.
 * They are not claims about the client's
 * real-life manifestation.
 */
export const PRANITA_REGRESSION_CASE = {
  id:
    'PRANITA_BASELINE',

  fullName:
    'Pranita Ghode',

  dateOfBirth:
    '26/01/1991',

  expected: {
    mulank: 8,

    bhagyank: 2,

    presentNumbers: [
      1,
      2,
      6,
      8,
      9,
    ],

    missingNumbers: [
      3,
      4,
      5,
      7,
    ],

    goldenRajyog:
      'PARTIAL',

    silverRajyog:
      'PARTIAL',

    structuralPatternCount:
      8,

    structuralEvidenceCount:
      8,
  },
} as const

/**
 * Frozen methodology firewall expectations.
 *
 * These values describe what the system
 * must NOT infer automatically.
 */
export const FIREWALL_EXPECTATIONS = {
  missingDeterminesNeededNumber:
    false,

  missingDeterminesRemedy:
    false,

  missingDeterminesY3:
    false,

  compoundDeterminesNeededNumber:
    false,

  compoundDeterminesRemedy:
    false,

  compoundDeterminesY3:
    false,

  clientConfirmationUpgradesEvidence:
    false,

  clientDisagreementErasesFinding:
    false,

  paymentStrengthensDiagnosis:
    false,

  numerologyGrahaEqualsAstrologyDiagnosis:
    false,

  nameNumberFillsLoShu:
    false,
} as const