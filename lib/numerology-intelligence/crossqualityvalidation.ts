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

export type CrossQualityValidationStatus =
  | 'PASS'
  | 'FAIL'

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

/**
 * Synthetic evidence only.
 *
 * These tests validate software behaviour.
 * They do NOT create or change TSIA methodology.
 */

function evidence(
  id: string,
  quality:
    FunctionalQualityId,
  direction:
    IntelligenceEvidence['direction'],
  options?: {
    provenanceGroup?: string
    structureId?: string
    layer?:
      IntelligenceEvidence['layer']
  }
): IntelligenceEvidence {
  return {
    id,

    layer:
      options?.layer ??
      'RAW_LO_SHU',

    provenance:
      options?.structureId
        ? 'DERIVED_STRUCTURE'
        : 'DOB_RAW_DIGIT',

    provenanceGroup:
      options?.provenanceGroup ??
      id,

    role:
      options?.structureId
        ? 'STRUCTURAL'
        : 'SUPPORTING_CONTEXT',

    roleDistinctness:
      'DISTINCT_ROLE',

    independence:
      'INDEPENDENT',

    functionalQualityId:
      quality,

    direction,

    statement:
      `Synthetic validation evidence: ${id}`,

    structureId:
      options?.structureId,
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
    status:
      condition
        ? 'PASS'
        : 'FAIL',
    expected,
    actual,
    detail,
  }
}

function supported(
  id: string,
  quality:
    FunctionalQualityId
): IntelligenceEvidence {
  return evidence(
    id,
    quality,
    'SUPPORTS'
  )
}

function underSupported(
  id: string,
  quality:
    FunctionalQualityId
): IntelligenceEvidence {
  return evidence(
    id,
    quality,
    'UNDER_SUPPORTS'
  )
}

/**
 * Validate every provisional approved pair
 * with Supported + Supported evidence.
 */
function validateApprovedPairs():
  CrossQualityValidationResult[] {
  return PROVISIONAL_CROSS_QUALITY_RULES.map(
    rule => {
      const result =
        resolveCrossQualityPair(
          rule.qualityA,
          rule.qualityB,
          [
            supported(
              `${rule.ruleId}_A`,
              rule.qualityA
            ),
            supported(
              `${rule.ruleId}_B`,
              rule.qualityB
            ),
          ]
        )

      return passOrFail(
        `APPROVED_${rule.ruleId}`,
        `${rule.relationshipName}: supported + supported`,
        rule.defaultRelationship,
        result.relationship,
        result.relationship ===
          rule.defaultRelationship &&
          result.status ===
            'RESOLVED',
        'Every provisional approved pair must resolve according to its approved default relationship when both qualities have usable supporting evidence.'
      )
    }
  )
}

/**
 * Validate both asymmetric directions for
 * every provisional approved pair.
 *
 * Asymmetry must not automatically become
 * TENSION.
 */
function validateAsymmetry():
  CrossQualityValidationResult[] {
  const results:
    CrossQualityValidationResult[] = []

  for (
    const rule of
    PROVISIONAL_CROSS_QUALITY_RULES
  ) {
    const first =
      resolveCrossQualityPair(
        rule.qualityA,
        rule.qualityB,
        [
          supported(
            `${rule.ruleId}_SUP_A`,
            rule.qualityA
          ),
          underSupported(
            `${rule.ruleId}_UNDER_B`,
            rule.qualityB
          ),
        ]
      )

    results.push(
      passOrFail(
        `ASYM_A_${rule.ruleId}`,
        `${rule.relationshipName}: A supported / B under-supported`,
        'CONTEXTUALIZE and not TENSION',
        `${first.relationship} / ${first.status}`,
        first.relationship ===
          'CONTEXTUALIZE' &&
          first.status ===
            'RESOLVED' &&
          first.tensionApproved ===
            false,
        'Unequal support is a development direction, not automatic psychological conflict.'
      )
    )

    const second =
      resolveCrossQualityPair(
        rule.qualityA,
        rule.qualityB,
        [
          underSupported(
            `${rule.ruleId}_UNDER_A`,
            rule.qualityA
          ),
          supported(
            `${rule.ruleId}_SUP_B`,
            rule.qualityB
          ),
        ]
      )

    results.push(
      passOrFail(
        `ASYM_B_${rule.ruleId}`,
        `${rule.relationshipName}: A under-supported / B supported`,
        'CONTEXTUALIZE and not TENSION',
        `${second.relationship} / ${second.status}`,
        second.relationship ===
          'CONTEXTUALIZE' &&
          second.status ===
            'RESOLVED' &&
          second.tensionApproved ===
            false,
        'Reverse asymmetry must follow the same no-automatic-tension rule.'
      )
    )
  }

  return results
}

/**
 * Research candidates must never become
 * approved production interactions.
 */
function validateResearchPairs():
  CrossQualityValidationResult[] {
  return RESEARCH_CROSS_QUALITY_PAIRS.map(
    (pair, index) => {
      const qualityA =
        pair[0] as FunctionalQualityId

      const qualityB =
        pair[1] as FunctionalQualityId

      const result =
        resolveCrossQualityPair(
          qualityA,
          qualityB,
          [
            supported(
              `RESEARCH_${index}_A`,
              qualityA
            ),
            supported(
              `RESEARCH_${index}_B`,
              qualityB
            ),
          ]
        )

      return passOrFail(
        `RESEARCH_${index + 1}`,
        `${qualityA} ↔ ${qualityB} remains research-only`,
        'RESEARCH_ONLY / COEXIST',
        `${result.status} / ${result.relationship}`,
        result.status ===
          'RESEARCH_ONLY' &&
          result.relationship ===
            'COEXIST',
        'Research candidates must remain visible for methodology development without becoming production client conclusions.'
      )
    }
  )
}

/**
 * Find one pair that is neither approved
 * nor research.
 *
 * Such a pair must default to COEXIST.
 */
function validateCoexistDefault():
  CrossQualityValidationResult {
  const all:
    FunctionalQualityId[] = [
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

  for (
    let i = 0;
    i < all.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < all.length;
      j++
    ) {
      const a = all[i]
      const b = all[j]

      if (
        !findCrossQualityRule(
          a,
          b
        ) &&
        !isResearchCrossQualityPair(
          a,
          b
        )
      ) {
        const result =
          resolveCrossQualityPair(
            a,
            b,
            [
              supported(
                'COEXIST_A',
                a
              ),
              supported(
                'COEXIST_B',
                b
              ),
            ]
          )

        return passOrFail(
          'DEFAULT_COEXIST',
          'Unapproved pair defaults to COEXIST',
          'COEXIST_ONLY / COEXIST',
          `${result.status} / ${result.relationship}`,
          result.status ===
            'COEXIST_ONLY' &&
            result.relationship ===
              'COEXIST',
          'No approved interaction rule means coexistence rather than an invented relationship.'
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
    'Validation could not locate an unapproved non-research pair.'
  )
}

/**
 * Structural supremacy test.
 *
 * 1 ↔ 8 is an approved pair with the
 * structural supremacy gate enabled.
 *
 * Both synthetic evidence items share the
 * same structure ID.
 */
function validateStructuralSupremacy():
  CrossQualityValidationResult {
  const qualityA:
    FunctionalQualityId =
    'INDIVIDUAL_AGENCY'

  const qualityB:
    FunctionalQualityId =
    'STRUCTURED_RESPONSIBILITY'

  const shared =
    'ROW_8_1_6'

  const result =
    resolveCrossQualityPair(
      qualityA,
      qualityB,
      [
        evidence(
          'STRUCT_A',
          qualityA,
          'SUPPORTS',
          {
            layer: 'ROW',
            structureId:
              shared,
          }
        ),

        evidence(
          'STRUCT_B',
          qualityB,
          'SUPPORTS',
          {
            layer: 'ROW',
            structureId:
              shared,
          }
        ),
      ]
    )

  return passOrFail(
    'STRUCTURAL_SUPREMACY',
    'Structural pattern suppresses duplicate pair interpretation',
    'STRUCTURAL_SUPREMACY / CONTEXTUALIZE',
    `${result.status} / ${result.relationship}`,
    result.status ===
      'STRUCTURAL_SUPREMACY' &&
      result.relationship ===
        'CONTEXTUALIZE' &&
      result.relevantStructureIds.includes(
        shared
      ),
    'Approved row, column or Rajyog evidence must remain primary and must not be double-counted as a separate cross-quality confirmation.'
  )
}

/**
 * Same-quality evidence must remain in the
 * existing single-quality engine.
 */
function validateSameQualityGate():
  CrossQualityValidationResult {
  const quality:
    FunctionalQualityId =
    'INDIVIDUAL_AGENCY'

  const result =
    resolveCrossQualityPair(
      quality,
      quality,
      [
        supported(
          'SAME_1',
          quality
        ),
      ]
    )

  return passOrFail(
    'SAME_QUALITY_GATE',
    'Same quality is rejected by cross-quality resolver',
    'INSUFFICIENT_EVIDENCE / INSUFFICIENT',
    `${result.status} / ${result.relationship}`,
    result.status ===
      'INSUFFICIENT_EVIDENCE' &&
      result.relationship ===
        'INSUFFICIENT',
    'Evidence belonging to one Functional Quality must remain inside the existing single-quality Conclusion Engine.'
  )
}

/**
 * One-sided evidence is insufficient.
 */
function validateInsufficientEvidence():
  CrossQualityValidationResult {
  const result =
    resolveCrossQualityPair(
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
    result.status ===
      'INSUFFICIENT_EVIDENCE' &&
      result.relationship ===
        'INSUFFICIENT',
    'Two number identities are not enough. Both Functional Qualities require usable evidence.'
  )
}

/**
 * Context-only evidence must not be promoted
 * into functional support.
 */
function validateContextOnly():
  CrossQualityValidationResult {
  const contextual =
    evidence(
      'CONTEXT_ONLY',
      'INDIVIDUAL_AGENCY',
      'CONTEXTUALIZES'
    )

  const state =
    getQualitySupportState(
      [contextual]
    )

  return passOrFail(
    'CONTEXT_NOT_SUPPORT',
    'Contextual evidence alone does not establish support',
    'NO_EVIDENCE',
    state,
    state ===
      'NO_EVIDENCE',
    'Compound or contextual evidence must not silently become primary functional confirmation.'
  )
}

/**
 * Mixed evidence must remain contextual.
 */
function validateMixedEvidence():
  CrossQualityValidationResult {
  const result =
    resolveCrossQualityPair(
      'INDIVIDUAL_AGENCY',
      'RELATIONAL_RECEPTIVITY',
      [
        supported(
          'MIX_SUPPORT',
          'INDIVIDUAL_AGENCY'
        ),

        underSupported(
          'MIX_UNDER',
          'INDIVIDUAL_AGENCY'
        ),

        supported(
          'MIX_OTHER',
          'RELATIONAL_RECEPTIVITY'
        ),
      ]
    )

  return passOrFail(
    'MIXED_CONTEXT',
    'Mixed evidence does not force Complement or Tension',
    'CONTEXTUALIZE',
    result.relationship,
    result.relationship ===
      'CONTEXTUALIZE' &&
      result.tensionApproved ===
        false,
    'A quality containing both support and under-support must first be contextualized.'
  )
}

/**
 * Pair identity alone must never create
 * tension.
 */
function validateNoAutomaticTension():
  CrossQualityValidationResult {
  const result =
    resolveCrossQualityPair(
      'INDIVIDUAL_AGENCY',
      'RELATIONAL_RECEPTIVITY',
      [
        evidence(
          'TENSION_A',
          'INDIVIDUAL_AGENCY',
          'TENSION'
        ),

        supported(
          'TENSION_B',
          'RELATIONAL_RECEPTIVITY'
        ),
      ]
    )

  return passOrFail(
    'NO_AUTOMATIC_TENSION',
    'Pair identity or tension-like evidence cannot bypass approved interaction rule',
    'tensionApproved = false',
    String(
      result.tensionApproved
    ),
    result.tensionApproved ===
      false &&
      result.relationship !==
        'TENSION',
    'Draft 1.0 contains no provisional approved pair with tensionAllowed=true. Tension therefore cannot be generated merely from pair identity or an unsupported tension marker.'
  )
}

/**
 * Cross-quality resolver must never directly
 * determine Needed Number, remedy or Y3.
 */
function validateRemedyFirewall():
  CrossQualityValidationResult {
  const result =
    resolveCrossQualityPair(
      'INDIVIDUAL_AGENCY',
      'RELATIONAL_RECEPTIVITY',
      [
        supported(
          'FW_A',
          'INDIVIDUAL_AGENCY'
        ),

        underSupported(
          'FW_B',
          'RELATIONAL_RECEPTIVITY'
        ),
      ]
    )

  const protected =
    result
      .neededNumberDetermined ===
        false &&
    result
      .remedyDetermined ===
        false &&
    result
      .y3Determined ===
        false

  return passOrFail(
    'REMEDY_FIREWALL',
    'Cross-quality conclusion cannot determine Needed Number, remedy or Y3',
    'false / false / false',
    `${result.neededNumberDetermined} / ${result.remedyDetermined} / ${result.y3Determined}`,
    protected,
    'Cross-quality interpretation remains upstream of the separate Needed Number, remedy and Y3 decision gates.'
  )
}

/**
 * Verify the frozen governing constants.
 */
function validateGoverningRules():
  CrossQualityValidationResult {
  const valid =
    CROSS_QUALITY_GOVERNING_RULES
      .noApprovedRuleDefaultsTo ===
        'COEXIST' &&
    CROSS_QUALITY_GOVERNING_RULES
      .differentQualitiesAutomaticallyCreateTension ===
        false &&
    CROSS_QUALITY_GOVERNING_RULES
      .asymmetricSupportAutomaticallyCreatesTension ===
        false &&
    CROSS_QUALITY_GOVERNING_RULES
      .pairIdentityAloneCanCreateTension ===
        false &&
    CROSS_QUALITY_GOVERNING_RULES
      .structuralEvidenceMustNotBeDoubleCounted ===
        true &&
    CROSS_QUALITY_GOVERNING_RULES
      .crossQualityCanDetermineNeededNumber ===
        false &&
    CROSS_QUALITY_GOVERNING_RULES
      .crossQualityCanDetermineRemedy ===
        false &&
    CROSS_QUALITY_GOVERNING_RULES
      .crossQualityCanDetermineY3 ===
        false &&
    CROSS_QUALITY_GOVERNING_RULES
      .clientValidationCanIncreaseMethodologyStrength ===
        false &&
    CROSS_QUALITY_GOVERNING_RULES
      .paymentCanIncreaseDiagnosisStrength ===
        false

  return passOrFail(
    'GOVERNING_RULES',
    'Cross-quality governing safeguards remain frozen',
    'All safeguards true',
    valid
      ? 'All safeguards intact'
      : 'One or more safeguards changed',
    valid,
    'This protects the methodology from silent future changes in software behaviour.'
  )
}

/**
 * Verify exact methodology inventory.
 *
 * Draft 1.0:
 * - 9 provisional approved pairs
 * - 8 research candidates
 * - remaining unique pairs default to COEXIST
 */
function validateInventory():
  CrossQualityValidationResult {
  const approved =
    PROVISIONAL_CROSS_QUALITY_RULES.length

  const research =
    RESEARCH_CROSS_QUALITY_PAIRS.length

  const totalPairs =
    36

  const coexist =
    totalPairs -
    approved -
    research

  const valid =
    approved === 9 &&
    research === 8 &&
    coexist === 19

  return passOrFail(
    'METHODOLOGY_INVENTORY',
    'Draft 1.0 pair inventory is unchanged',
    '9 approved / 8 research / 19 coexist = 36',
    `${approved} approved / ${research} research / ${coexist} coexist = ${totalPairs}`,
    valid,
    'All 36 unique Number 1–9 pairs must remain accounted for without inventing extra production interactions.'
  )
}

/**
 * Ensure no provisional approved rule currently
 * permits automatic tension.
 */
function validateNoApprovedTensionRules():
  CrossQualityValidationResult {
  const tensionRules =
    PROVISIONAL_CROSS_QUALITY_RULES.filter(
      rule =>
        rule.tensionAllowed
    )

  return passOrFail(
    'NO_APPROVED_TENSION_RULES',
    'Draft 1.0 has no automatic cross-quality tension pair',
    '0 tension-enabled rules',
    `${tensionRules.length} tension-enabled rules`,
    tensionRules.length === 0,
    'Future tension rules require separate methodology approval and must not appear silently.'
  )
}

/**
 * Ensure every provisional rule retains
 * the three remedy firewalls.
 */
function validateRuleFirewalls():
  CrossQualityValidationResult {
  const unsafe =
    PROVISIONAL_CROSS_QUALITY_RULES.filter(
      rule =>
        rule
          .automaticNeededNumberAllowed !==
            false ||
        rule
          .automaticRemedyAllowed !==
            false ||
        rule
          .automaticY3Allowed !==
            false
    )

  return passOrFail(
    'RULE_FIREWALLS',
    'Every provisional rule blocks automatic Needed Number, remedy and Y3',
    '0 unsafe rules',
    `${unsafe.length} unsafe rules`,
    unsafe.length === 0,
    'No cross-quality rule may bypass the separate diagnostic and remedy decision architecture.'
  )
}

/**
 * Utility for optional UI inspection.
 */
export function summarizeResolution(
  resolution:
    CrossQualityResolution
): string {
  return [
    resolution.qualityA,
    '↔',
    resolution.qualityB,
    ':',
    resolution.relationship,
    '/',
    resolution.status,
  ].join(' ')
}

/**
 * Run the complete automated validation
 * suite for Cross-Quality Draft 1.0.
 */
export function runCrossQualityValidation():
  CrossQualityValidationSuite {
  const results:
    CrossQualityValidationResult[] = [
    ...validateApprovedPairs(),
    ...validateAsymmetry(),
    ...validateResearchPairs(),

    validateCoexistDefault(),

    validateStructuralSupremacy(),

    validateSameQualityGate(),

    validateInsufficientEvidence(),

    validateContextOnly(),

    validateMixedEvidence(),

    validateNoAutomaticTension(),

    validateRemedyFirewall(),

    validateGoverningRules(),

    validateInventory(),

    validateNoApprovedTensionRules(),

    validateRuleFirewalls(),
  ]

  const passed =
    results.filter(
      item =>
        item.status ===
          'PASS'
    ).length

  const failed =
    results.filter(
      item =>
        item.status ===
          'FAIL'
    ).length

  return {
    total:
      results.length,

    passed,

    failed,

    results,
  }
}