import type {
  FunctionalQualityId,
  IntelligenceEvidence,
} from './types'

import {
  CROSS_QUALITY_GOVERNING_RULES,
  PROVISIONAL_CROSS_QUALITY_RULES,
  RESEARCH_CROSS_QUALITY_PAIRS,
  findCrossQualityRule,
  isResearchCrossQualityPair,
} from './crossqualityrules'

import {
  getQualitySupportState,
  resolveCrossQualityPair,
  type CrossQualityResolution,
} from './crossqualityresolver'

export type CrossQualityValidationStatus = 'PASS' | 'FAIL'

export type CrossQualityValidationResult = {
  id: string
  title: string
  status: CrossQualityValidationStatus
  expected: string
  actual: string
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
  direction: IntelligenceEvidence['direction'],
  options?: {
    provenanceGroup?: string
    structureId?: string
    layer?: IntelligenceEvidence['layer']
  }
): IntelligenceEvidence {
  return {
    id,
    layer: options?.layer ?? 'RAW_LO_SHU',
    provenance: options?.structureId
      ? 'DERIVED_STRUCTURE'
      : 'DOB_RAW_DIGIT',
    provenanceGroup: options?.provenanceGroup ?? id,
    role: options?.structureId
      ? 'STRUCTURAL'
      : 'SUPPORTING_CONTEXT',
    roleDistinctness: 'DISTINCT_ROLE',
    independence: 'INDEPENDENT',
    functionalQualityId: quality,
    direction,
    statement: `Synthetic validation evidence: ${id}`,
    structureId: options?.structureId,
  }
}

function passOrFail(
  id: string,
  title: string,
  expected: string,
  actual: string,
  condition: boolean,
  detail: string
): CrossQualityValidationResult {
  return {
    id,
    title,
    status: condition ? 'PASS' : 'FAIL',
    expected,
    actual,
    detail,
  }
}

function supported(
  id: string,
  quality: FunctionalQualityId
): IntelligenceEvidence {
  return evidence(id, quality, 'SUPPORTS')
}

function underSupported(
  id: string,
  quality: FunctionalQualityId
): IntelligenceEvidence {
  return evidence(id, quality, 'UNDER_SUPPORTS')
}

function validateApprovedPairs(): CrossQualityValidationResult[] {
  return PROVISIONAL_CROSS_QUALITY_RULES.map(rule => {
    const result = resolveCrossQualityPair(
      rule.qualityA,
      rule.qualityB,
      [
        supported(`${rule.ruleId}_A`, rule.qualityA),
        supported(`${rule.ruleId}_B`, rule.qualityB),
      ]
    )

    return passOrFail(
      `APPROVED_${rule.ruleId}`,
      `${rule.relationshipName}: supported + supported`,
      rule.defaultRelationship,
      result.relationship,
      result.relationship === rule.defaultRelationship &&
        result.status === 'RESOLVED',
      'Approved pair must resolve according to its approved default relationship.'
    )
  })
}

function validateAsymmetry(): CrossQualityValidationResult[] {
  const results: CrossQualityValidationResult[] = []

  for (const rule of PROVISIONAL_CROSS_QUALITY_RULES) {
    const first = resolveCrossQualityPair(
      rule.qualityA,
      rule.qualityB,
      [
        supported(`${rule.ruleId}_SUP_A`, rule.qualityA),
        underSupported(`${rule.ruleId}_UNDER_B`, rule.qualityB),
      ]
    )

    results.push(
      passOrFail(
        `ASYM_A_${rule.ruleId}`,
        `${rule.relationshipName}: A supported / B under-supported`,
        'CONTEXTUALIZE and not TENSION',
        `${first.relationship} / ${first.status}`,
        first.relationship === 'CONTEXTUALIZE' &&
          first.status === 'RESOLVED' &&
          first.tensionApproved === false,
        'Unequal support must not automatically become tension.'
      )
    )

    const second = resolveCrossQualityPair(
      rule.qualityA,
      rule.qualityB,
      [
        underSupported(`${rule.ruleId}_UNDER_A`, rule.qualityA),
        supported(`${rule.ruleId}_SUP_B`, rule.qualityB),
      ]
    )

    results.push(
      passOrFail(
        `ASYM_B_${rule.ruleId}`,
        `${rule.relationshipName}: A under-supported / B supported`,
        'CONTEXTUALIZE and not TENSION',
        `${second.relationship} / ${second.status}`,
        second.relationship === 'CONTEXTUALIZE' &&
          second.status === 'RESOLVED' &&
          second.tensionApproved === false,
        'Reverse asymmetry must follow the same rule.'
      )
    )
  }

  return results
}

function validateResearchPairs(): CrossQualityValidationResult[] {
  return RESEARCH_CROSS_QUALITY_PAIRS.map((pair, index) => {
    const qualityA = pair[0] as FunctionalQualityId
    const qualityB = pair[1] as FunctionalQualityId

    const result = resolveCrossQualityPair(
      qualityA,
      qualityB,
      [
        supported(`RESEARCH_${index}_A`, qualityA),
        supported(`RESEARCH_${index}_B`, qualityB),
      ]
    )

    return passOrFail(
      `RESEARCH_${index + 1}`,
      `${qualityA} ↔ ${qualityB} remains research-only`,
      'RESEARCH_ONLY / COEXIST',
      `${result.status} / ${result.relationship}`,
      result.status === 'RESEARCH_ONLY' &&
        result.relationship === 'COEXIST',
      'Research candidates must not become production conclusions.'
    )
  })
}

function validateCoexistDefault(): CrossQualityValidationResult {
  const all: FunctionalQualityId[] = [
    'INDIVIDUAL_AGENCY',
    'RELATIONAL_RECEPTIVITY',
    'KNOWLEDGE_EXPRESSION',
    'ADAPTIVE_RESTRUCTURING',
    'ADAPTIVE_INTELLIGENCE',
    'HARMONIOUS_CONNECTION',
    'REFLECTIVE_DISCERNMENT',
    'STRUCTURED_RESPONSIBILITY',
    'DIRECTED_FORCE',
  ]

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i]
      const b = all[j]

      if (
        !findCrossQualityRule(a, b) &&
        !isResearchCrossQualityPair(a, b)
      ) {
        const result = resolveCrossQualityPair(
          a,
          b,
          [
            supported('COEXIST_A', a),
            supported('COEXIST_B', b),
          ]
        )

        return passOrFail(
          'DEFAULT_COEXIST',
          'Unapproved pair defaults to COEXIST',
          'COEXIST_ONLY / COEXIST',
          `${result.status} / ${result.relationship}`,
          result.status === 'COEXIST_ONLY' &&
            result.relationship === 'COEXIST',
          'No approved interaction rule means coexistence.'
        )
      }
    }
  }

  return passOrFail(
    'DEFAULT_COEXIST',
    'Unapproved pair defaults to COEXIST',
    'At least one coexist-only pair',
    'No pair found',
    false,
    'No unapproved non-research pair was found.'
  )
}

function validateStructuralSupremacy(): CrossQualityValidationResult {
  const qualityA: FunctionalQualityId = 'INDIVIDUAL_AGENCY'
  const qualityB: FunctionalQualityId = 'STRUCTURED_RESPONSIBILITY'
  const shared = 'ROW_8_1_6'

  const result = resolveCrossQualityPair(
    qualityA,
    qualityB,
    [
      evidence(
        'STRUCT_A',
        qualityA,
        'SUPPORTS',
        {
          layer: 'ROW',
          structureId: shared,
        }
      ),
      evidence(
        'STRUCT_B',
        qualityB,
        'SUPPORTS',
        {
          layer: 'ROW',
          structureId: shared,
        }
      ),
    ]
  )

  return passOrFail(
    'STRUCTURAL_SUPREMACY',
    'Structural pattern suppresses duplicate pair interpretation',
    'STRUCTURAL_SUPREMACY / CONTEXTUALIZE',
    `${result.status} / ${result.relationship}`,
    result.status === 'STRUCTURAL_SUPREMACY' &&
      result.relationship === 'CONTEXTUALIZE' &&
      result.relevantStructureIds.includes(shared),
    'Structural evidence must remain primary and must not be double-counted.'
  )
}

function validateSameQualityGate(): CrossQualityValidationResult {
  const quality: FunctionalQualityId = 'INDIVIDUAL_AGENCY'

  const result = resolveCrossQualityPair(
    quality,
    quality,
    [supported('SAME_1', quality)]
  )

  return passOrFail(
    'SAME_QUALITY_GATE',
    'Same quality rejected by cross-quality resolver',
    'INSUFFICIENT_EVIDENCE / INSUFFICIENT',
    `${result.status} / ${result.relationship}`,
    result.status === 'INSUFFICIENT_EVIDENCE' &&
      result.relationship === 'INSUFFICIENT',
    'Same-quality evidence belongs in the single-quality engine.'
  )
}

function validateInsufficientEvidence(): CrossQualityValidationResult {
  const result = resolveCrossQualityPair(
    'INDIVIDUAL_AGENCY',
    'RELATIONAL_RECEPTIVITY',
    [
      supported(
        'ONLY_ONE_SIDE',
        'INDIVIDUAL_AGENCY'
      ),
    ]
  )

  return passOrFail(
    'INSUFFICIENT_PAIR_EVIDENCE',
    'One-sided evidence cannot create cross-quality conclusion',
    'INSUFFICIENT_EVIDENCE / INSUFFICIENT',
    `${result.status} / ${result.relationship}`,
    result.status === 'INSUFFICIENT_EVIDENCE' &&
      result.relationship === 'INSUFFICIENT',
    'Both Functional Qualities require usable evidence.'
  )
}

function validateContextOnly(): CrossQualityValidationResult {
  const contextual = evidence(
    'CONTEXT_ONLY',
    'INDIVIDUAL_AGENCY',
    'CONTEXTUALIZES'
  )

  const state = getQualitySupportState([contextual])

  return passOrFail(
    'CONTEXT_NOT_SUPPORT',
    'Contextual evidence alone does not