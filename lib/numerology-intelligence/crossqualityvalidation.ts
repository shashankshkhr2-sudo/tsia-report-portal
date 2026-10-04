import type {
  FunctionalQualityId,
  IntelligenceEvidence,
} from './types'

import {
  CROSS_QUALITY_GOVERNING_RULES,
  PROVISIONAL_CROSS_QUALITY_RULES,
  RESEARCH_CROSS_QUALITY_PAIRS,
} from './crossqualityrules'

import {
  resolveCrossQualityPair,
} from './crossqualityresolver'

export type CrossQualityValidationResult = {
  id: string
  status: 'PASS' | 'FAIL'
  detail: string
}

export type CrossQualityValidationSuite = {
  total: number
  passed: number
  failed: number
  results: readonly CrossQualityValidationResult[]
}

function evidence(
  id: string,
  quality: FunctionalQualityId,
  direction: IntelligenceEvidence['direction']
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
    direction,
    statement: `Validation evidence ${id}`,
  }
}

function check(
  id: string,
  condition: boolean,
  detail: string
): CrossQualityValidationResult {
  return {
    id,
    status: condition ? 'PASS' : 'FAIL',
    detail,
  }
}

export function runCrossQualityValidation():
  CrossQualityValidationSuite {
  const results: CrossQualityValidationResult[] = []

  results.push(
    check(
      'INVENTORY',
      PROVISIONAL_CROSS_QUALITY_RULES.length === 9 &&
        RESEARCH_CROSS_QUALITY_PAIRS.length === 8,
      'Expected 9 approved pairs and 8 research pairs.'
    )
  )

  results.push(
    check(
      'NO_AUTO_TENSION',
      PROVISIONAL_CROSS_QUALITY_RULES.every(
        rule => rule.tensionAllowed === false
      ),
      'No provisional pair may automatically create tension.'
    )
  )

  results.push(
    check(
      'RULE_FIREWALLS',
      PROVISIONAL_CROSS_QUALITY_RULES.every(
        rule =>
          rule.automaticNeededNumberAllowed === false &&
          rule.automaticRemedyAllowed === false &&
          rule.automaticY3Allowed === false
      ),
      'Cross-quality rules must not determine Needed Number, remedy or Y3.'
    )
  )

  results.push(
    check(
      'GOVERNING_FIREWALLS',
      CROSS_QUALITY_GOVERNING_RULES
        .crossQualityCanDetermineNeededNumber === false &&
        CROSS_QUALITY_GOVERNING_RULES
          .crossQualityCanDetermineRemedy === false &&
        CROSS_QUALITY_GOVERNING_RULES
          .crossQualityCanDetermineY3 === false,
      'Global Needed Number, remedy and Y3 firewalls must remain active.'
    )
  )

  results.push(
    check(
      'COMPLEMENT_BEFORE_TENSION',
      CROSS_QUALITY_GOVERNING_RULES
        .differentQualitiesAutomaticallyCreateTension === false &&
        CROSS_QUALITY_GOVERNING_RULES
          .asymmetricSupportAutomaticallyCreatesTension === false &&
        CROSS_QUALITY_GOVERNING_RULES
          .pairIdentityAloneCanCreateTension === false,
      'Different or asymmetric qualities must not automatically become tension.'
    )
  )

  results.push(
    check(
      'STRUCTURAL_SUPREMACY',
      CROSS_QUALITY_GOVERNING_RULES
        .structuralEvidenceMustNotBeDoubleCounted === true,
      'Structural evidence must not be double-counted.'
    )
  )

  results.push(
    check(
      'CLIENT_VALIDATION_FIREWALL',
      CROSS_QUALITY_GOVERNING_RULES
        .clientValidationCanIncreaseMethodologyStrength === false,
      'Client validation must not increase methodology evidence strength.'
    )
  )

  results.push(
    check(
      'PAYMENT_FIREWALL',
      CROSS_QUALITY_GOVERNING_RULES
        .paymentCanIncreaseDiagnosisStrength === false,
      'Payment must not increase diagnosis strength.'
    )
  )

  const sample = resolveCrossQualityPair(
    'INDIVIDUAL_AGENCY',
    'RELATIONAL_RECEPTIVITY',
    [
      evidence(
        'SAMPLE_A',
        'INDIVIDUAL_AGENCY',
        'SUPPORTS'
      ),
      evidence(
        'SAMPLE_B',
        'RELATIONAL_RECEPTIVITY',
        'UNDER_SUPPORTS'
      ),
    ]
  )

  results.push(
    check(
      'ASYMMETRY_NO_TENSION',
      sample.relationship !== 'TENSION' &&
        sample.tensionApproved === false,
      'Supported plus under-supported must not automatically become tension.'
    )
  )

  results.push(
    check(
      'RESOLUTION_FIREWALL',
      sample.neededNumberDetermined === false &&
        sample.remedyDetermined === false &&
        sample.y3Determined === false,
      'Resolver must not directly determine Needed Number, remedy or Y3.'
    )
  )

  const passed = results.filter(
    result => result.status === 'PASS'
  ).length

  const failed = results.filter(
    result => result.status === 'FAIL'
  ).length

  return {
    total: results.length,
    passed,
    failed,
    results,
  }
}