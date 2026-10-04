import {
  PRANITA_REGRESSION_CASE,
  RESOLUTION_TEST_CASES,
  FIREWALL_EXPECTATIONS,
} from './validationcases'

import {
  resolveOperation,
} from './conclusionrules'

import {
  runConclusionEngine,
} from './conclusionengine'

import {
  resolveCrossQualityPair,
} from './crossqualityresolver'

import type {
  FunctionalQualityId,
  IntelligenceEvidence,
} from './types'

/**
 * TSIA Numerology Intelligence V3
 * Automated Validation Runner
 *
 * TEST-ONLY FILE.
 *
 * This runner must NOT modify production
 * methodology in order to make tests pass.
 */

export type ValidationStatus =
  | 'PASS'
  | 'FAIL'
  | 'ARCHITECTURE_GAP'
  | 'NOT_YET_EXECUTABLE'

export type ValidationResult = {
  id: string
  name: string
  status: ValidationStatus
  expected?: string
  actual?: string
  detail?: string
}

/**
 * Create synthetic evidence for validation.
 *
 * Test evidence only.
 * This does not create TSIA methodology.
 */
function crossQualityEvidence(
  id: string,
  quality: FunctionalQualityId
): IntelligenceEvidence {
  return {
    id,
    layer: 'RAW_LO_SHU',
    provenance: 'DOB_RAW_DIGIT',
    provenanceGroup: id,
    role: 'SUPPORTING_CONTEXT',
    roleDistinctness: 'DISTINCT_ROLE',
    independence: 'INDEPENDENT',
    functionalQualityId: quality,
    direction: 'SUPPORTS',
    statement:
      `Synthetic cross-quality validation evidence: ${id}`,
  }
}

/**
 * Validate COMPLEMENT using the real
 * Cross-Quality Resolver.
 *
 * Draft 1.0 approved reference pair:
 *
 * Individual Agency
 * ↔
 * Relational Receptivity
 *
 * Supported + Supported
 * must resolve to COMPLEMENT.
 */
function runComplementTest(
  id: string,
  name: string
): ValidationResult {
  const actual =
    resolveCrossQualityPair(
      'INDIVIDUAL_AGENCY',
      'RELATIONAL_RECEPTIVITY',
      [
        crossQualityEvidence(
          'VALIDATION_COMPLEMENT_1',
          'INDIVIDUAL_AGENCY'
        ),
        crossQualityEvidence(
          'VALIDATION_COMPLEMENT_2',
          'RELATIONAL_RECEPTIVITY'
        ),
      ]
    )

  const passed =
    actual.relationship ===
      'COMPLEMENT' &&
    actual.status ===
      'RESOLVED' &&
    actual.tensionApproved ===
      false &&
    actual.neededNumberDetermined ===
      false &&
    actual.remedyDetermined ===
      false &&
    actual.y3Determined ===
      false

  return {
    id,
    name,

    status:
      passed
        ? 'PASS'
        : 'FAIL',

    expected:
      'COMPLEMENT / RESOLVED / no automatic tension / no Needed Number / no remedy / no Y3',

    actual:
      `${actual.relationship} / ${actual.status} / ` +
      `tension=${actual.tensionApproved} / ` +
      `needed=${actual.neededNumberDetermined} / ` +
      `remedy=${actual.remedyDetermined} / ` +
      `y3=${actual.y3Determined}`,

    detail:
      passed
        ? 'Existing Cross-Quality Resolver correctly applies the approved 1↔2 Complement rule.'
        : 'Cross-Quality Resolver does not match the approved 1↔2 Supported + Supported methodology. Review the resolver/rule output before changing production methodology.',
  }
}

/**
 * Test the seven Conclusion Resolution
 * operations.
 *
 * COMPLEMENT belongs to the Cross-Quality
 * Resolver.
 *
 * The remaining operations continue through
 * the existing single-quality resolver.
 */
function runResolutionTests():
  ValidationResult[] {
  return RESOLUTION_TEST_CASES.map(
    testCase => {
      if (
        testCase.expected ===
        'COMPLEMENT'
      ) {
        return runComplementTest(
          testCase.id,
          testCase.name
        )
      }

      const actual =
        resolveOperation(
          testCase.evidence
        )

      return {
        id: testCase.id,
        name: testCase.name,

        status:
          actual === testCase.expected
            ? 'PASS'
            : 'FAIL',

        expected:
          testCase.expected,

        actual,

        detail:
          actual === testCase.expected
            ? 'Existing resolver matches expected operation.'
            : 'Existing resolver does not match the frozen validation expectation. Review the exact rule before changing production code.',
      }
    }
  )
}

/**
 * Tests important Conclusion Engine
 * firewalls that can already be inspected
 * through the current result structure.
 */
function runFirewallTests():
  ValidationResult[] {
  const missingEvidence:
    IntelligenceEvidence[] = [
    {
      id:
        'VALIDATION_MISSING_3',

      layer:
        'MISSING_NUMBER',

      provenance:
        'DERIVED_STRUCTURE',

      provenanceGroup:
        'VALIDATION_MISSING_3',

      role:
        'DEVELOPMENT_DIRECTION',

      roleDistinctness:
        'DISTINCT_ROLE',

      independence:
        'PARTIALLY_DEPENDENT',

      number: 3,

      functionalQualityId:
        'KNOWLEDGE_EXPRESSION',

      direction:
        'UNDER_SUPPORTS',

      statement:
        'Synthetic validation evidence for missing 3.',
    },
  ]

  const result =
    runConclusionEngine(
      missingEvidence
    )

  const development =
    result.developmentAssessments.find(
      item =>
        item.functionalQualityId ===
        'KNOWLEDGE_EXPRESSION'
    )

  const missingDoesNotDetermineNeeded =
    development
      ?.neededNumberDetermined ===
    false

  const missingDoesNotAutoQualify =
    development
      ?.neededNumberAssessmentEligible ===
    false

  return [
    {
      id:
        'FW_MISSING_NOT_NEEDED',

      name:
        'Missing number does not automatically become Needed Number',

      status:
        FIREWALL_EXPECTATIONS
          .missingDeterminesNeededNumber ===
          false &&
        missingDoesNotDetermineNeeded
          ? 'PASS'
          : 'FAIL',

      expected:
        'neededNumberDetermined = false',

      actual:
        String(
          development
            ?.neededNumberDetermined
        ),
    },

    {
      id:
        'FW_MISSING_NOT_AUTO_ELIGIBLE',

      name:
        'Single missing-number evidence does not automatically qualify for Needed Number assessment',

      status:
        missingDoesNotAutoQualify
          ? 'PASS'
          : 'FAIL',

      expected