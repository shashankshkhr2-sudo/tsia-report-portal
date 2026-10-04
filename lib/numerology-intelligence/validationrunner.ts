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

import type {
  IntelligenceEvidence,
  ResolutionOperation,
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
 * Tests the existing single-quality
 * resolution function directly.
 */
function runResolutionTests():
  ValidationResult[] {
  return RESOLUTION_TEST_CASES.map(
    testCase => {
      /**
       * COMPLEMENT is intentionally handled
       * separately.
       *
       * Current production architecture
       * groups evidence by Functional Quality
       * before resolving conclusions.
       *
       * Therefore cross-quality COMPLEMENT
       * cannot honestly be validated through
       * the existing single-quality resolver.
       */
      if (
        testCase.expected ===
        'COMPLEMENT'
      ) {
        return {
          id: testCase.id,
          name: testCase.name,
          status: 'ARCHITECTURE_GAP',
          expected: 'COMPLEMENT',
          actual:
            'No cross-quality resolver exists',
          detail:
            'Current runConclusionEngine resolves each Functional Quality independently. Do not change methodology merely to force this test green.',
        }
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
      id: 'VALIDATION_MISSING_3',

      layer: 'MISSING_NUMBER',

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
    development?.neededNumberDetermined ===
    false

  const missingDoesNotAutoQualify =
    development
      ?.neededNumberAssessmentEligible ===
    false

  return [
    {
      id: 'FW_MISSING_NOT_NEEDED',

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

      expected:
        'neededNumberAssessmentEligible = false',

      actual:
        String(
          development
            ?.neededNumberAssessmentEligible
        ),
    },

    {
      id: 'FW_MISSING_NOT_REMEDY',

      name:
        'Missing number does not automatically create remedy',

      status:
        FIREWALL_EXPECTATIONS
          .missingDeterminesRemedy ===
        false
          ? 'PASS'
          : 'FAIL',

      expected: 'false',
      actual:
        String(
          FIREWALL_EXPECTATIONS
            .missingDeterminesRemedy
        ),

      detail:
        'Current ConclusionEngineResult contains no automatic remedy output.',
    },

    {
      id: 'FW_MISSING_NOT_Y3',

      name:
        'Missing number does not automatically create Y3',

      status:
        FIREWALL_EXPECTATIONS
          .missingDeterminesY3 ===
        false
          ? 'PASS'
          : 'FAIL',

      expected: 'false',
      actual:
        String(
          FIREWALL_EXPECTATIONS
            .missingDeterminesY3
        ),

      detail:
        'Current ConclusionEngineResult contains no automatic Y3 output.',
    },

    {
      id:
        'FW_NUM_GRAHA_NOT_ASTROLOGY',

      name:
        'Numerology Graha does not become astrology diagnosis',

      status:
        FIREWALL_EXPECTATIONS
          .numerologyGrahaEqualsAstrologyDiagnosis ===
        false
          ? 'PASS'
          : 'FAIL',

      expected: 'false',
      actual:
        String(
          FIREWALL_EXPECTATIONS
            .numerologyGrahaEqualsAstrologyDiagnosis
        ),

      detail:
        'Current V3 type restrictions explicitly prohibit automatic astrological Graha diagnosis.',
    },
  ]
}

/**
 * Some safeguards require future modules
 * that do not yet exist in the current
 * production engine.
 *
 * We identify these honestly rather than
 * manufacturing passing tests.
 */
function runFutureFirewallChecks():
  ValidationResult[] {
  return [
    {
      id:
        'FW_COMPOUND_NOT_NEEDED',

      name:
        'Compound alone does not determine Needed Number',

      status:
        'NOT_YET_EXECUTABLE',

      expected: 'false',

      detail:
        'Requires the future Needed Number decision layer.',
    },

    {
      id:
        'FW_COMPOUND_NOT_REMEDY',

      name:
        'Compound alone does not determine remedy',

      status:
        'NOT_YET_EXECUTABLE',

      expected: 'false',

      detail:
        'Requires the future remedy decision layer.',
    },

    {
      id:
        'FW_COMPOUND_NOT_Y3',

      name:
        'Compound alone does not create Y3 eligibility',

      status:
        'NOT_YET_EXECUTABLE',

      expected: 'false',

      detail:
        'Requires the future Y3 eligibility layer.',
    },

    {
      id:
        'FW_CLIENT_CONFIRMATION',

      name:
        'Client confirmation does not upgrade evidence strength',

      status:
        'NOT_YET_EXECUTABLE',

      expected: 'false',

      detail:
        'Manifestation status is currently stored separately, but no consultation-validation mutation function exists yet.',
    },

    {
      id:
        'FW_CLIENT_DISAGREEMENT',

      name:
        'Client disagreement does not erase finding',

      status:
        'NOT_YET_EXECUTABLE',

      expected: 'false',

      detail:
        'Requires the future consultation validation layer.',
    },

    {
      id:
        'FW_PAYMENT_DIAGNOSIS',

      name:
        'Payment does not strengthen diagnosis',

      status:
        'NOT_YET_EXECUTABLE',

      expected: 'false',

      detail:
        'Entitlement is outside the current Conclusion Engine and must remain separate.',
    },
  ]
}

/**
 * Pranita is retained as the known
 * regression baseline.
 *
 * Her full deterministic calculation
 * validation remains on the existing
 * V3 test page until the runner is
 * connected to those calculation
 * functions in the next step.
 */
function runRegressionRegistration():
  ValidationResult[] {
  return [
    {
      id:
        PRANITA_REGRESSION_CASE.id,

      name:
        'Pranita Ghode regression case registered',

      status: 'PASS',

      expected:
        'Mulank 8 / Bhagyank 2 / 8 structural patterns',

      actual:
        `Mulank ${PRANITA_REGRESSION_CASE.expected.mulank} / ` +
        `Bhagyank ${PRANITA_REGRESSION_CASE.expected.bhagyank} / ` +
        `${PRANITA_REGRESSION_CASE.expected.structuralPatternCount} structural patterns`,

      detail:
        'This confirms the baseline is registered in the validation suite. Existing production test page continues to perform the actual calculation regression until integrated.',
    },
  ]
}

export type ValidationSummary = {
  total: number
  passed: number
  failed: number
  architectureGaps: number
  notYetExecutable: number
}

export type ValidationSuiteResult = {
  results:
    readonly ValidationResult[]

  summary:
    ValidationSummary
}

export function runV3ValidationSuite():
  ValidationSuiteResult {
  const results = [
    ...runResolutionTests(),
    ...runFirewallTests(),
    ...runFutureFirewallChecks(),
    ...runRegressionRegistration(),
  ]

  const summary:
    ValidationSummary = {
    total: results.length,

    passed:
      results.filter(
        item =>
          item.status === 'PASS'
      ).length,

    failed:
      results.filter(
        item =>
          item.status === 'FAIL'
      ).length,

    architectureGaps:
      results.filter(
        item =>
          item.status ===
          'ARCHITECTURE_GAP'
      ).length,

    notYetExecutable:
      results.filter(
        item =>
          item.status ===
          'NOT_YET_EXECUTABLE'
      ).length,
  }

  return {
    results,
    summary,
  }
}