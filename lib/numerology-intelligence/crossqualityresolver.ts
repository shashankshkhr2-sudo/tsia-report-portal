import type {
  FunctionalQualityId,
  IntelligenceDomain,
  IntelligenceEvidence,
} from './types'

import {
  CROSS_QUALITY_RULESET_VERSION,
  findCrossQualityRule,
  isResearchCrossQualityPair,
  type CrossQualityRelationship,
  type CrossQualityRule,
} from './crossqualityrules'

/**
 * TSIA Numerology Intelligence V3
 * Cross-Quality Resolver
 *
 * Version: Draft 1.0
 *
 * This resolver sits ABOVE the existing
 * single-quality Conclusion Engine.
 *
 * It does NOT:
 * - modify V2 calculations
 * - replace single-quality conclusions
 * - infer life outcomes
 * - diagnose astrological Grahas
 * - determine Needed Number
 * - prescribe remedies
 * - determine Y3
 */

export const CROSS_QUALITY_RESOLVER_VERSION =
  'TSIA_NUM_V3_CROSS_QUALITY_RESOLVER_DRAFT_1.0' as const

export type QualitySupportState =
  | 'SUPPORTED'
  | 'UNDER_SUPPORTED'
  | 'MIXED'
  | 'NO_EVIDENCE'

export type CrossQualityResolutionStatus =
  | 'RESOLVED'
  | 'COEXIST_ONLY'
  | 'RESEARCH_ONLY'
  | 'INSUFFICIENT_EVIDENCE'
  | 'STRUCTURAL_SUPREMACY'

export type CrossQualityResolution = {
  id: string

  ruleSetVersion:
    typeof CROSS_QUALITY_RULESET_VERSION

  resolverVersion:
    typeof CROSS_QUALITY_RESOLVER_VERSION

  qualityA: FunctionalQualityId
  qualityB: FunctionalQualityId

  ruleId?: string

  ruleStatus?:
    CrossQualityRule['status']

  relationship:
    CrossQualityRelationship

  status:
    CrossQualityResolutionStatus

  qualityAState:
    QualitySupportState

  qualityBState:
    QualitySupportState

  statement: string

  rationale: string

  qualityAEvidenceIds:
    readonly string[]

  qualityBEvidenceIds:
    readonly string[]

  relevantStructureIds:
    readonly string[]

  allowedDomains:
    readonly IntelligenceDomain[]

  tensionApproved: boolean

  neededNumberDetermined: false

  remedyDetermined: false

  y3Determined: false

  warnings: readonly string[]
}

export type CrossQualityResolverResult = {
  ruleSetVersion:
    typeof CROSS_QUALITY_RULESET_VERSION

  resolverVersion:
    typeof CROSS_QUALITY_RESOLVER_VERSION

  resolutions:
    readonly CrossQualityResolution[]

  warnings: readonly string[]
}

/**
 * Cross-quality production evaluation is
 * based only on evidence that has already
 * entered the V3 intelligence layer.
 */
function evidenceForQuality(
  evidence: readonly IntelligenceEvidence[],
  qualityId: FunctionalQualityId
): IntelligenceEvidence[] {
  return evidence.filter(
    item =>
      item.functionalQualityId === qualityId
  )
}

function hasDirection(
  evidence: readonly IntelligenceEvidence[],
  direction: IntelligenceEvidence['direction']
): boolean {
  return evidence.some(
    item => item.direction === direction
  )
}

/**
 * Determine whether a quality is currently
 * supported, under-supported, mixed or has
 * no usable evidence.
 *
 * CONTEXTUALIZES alone does not establish
 * functional support.
 *
 * MODERATES alone does not establish
 * functional support.
 *
 * TENSION alone does not establish
 * functional support.
 */
export function getQualitySupportState(
  evidence: readonly IntelligenceEvidence[]
): QualitySupportState {
  if (evidence.length === 0) {
    return 'NO_EVIDENCE'
  }

  const supported =
    hasDirection(
      evidence,
      'SUPPORTS'
    )

  const underSupported =
    hasDirection(
      evidence,
      'UNDER_SUPPORTS'
    )

  if (
    supported &&
    underSupported
  ) {
    return 'MIXED'
  }

  if (supported) {
    return 'SUPPORTED'
  }

  if (underSupported) {
    return 'UNDER_SUPPORTED'
  }

  return 'NO_EVIDENCE'
}

/**
 * Collect structure IDs without counting
 * the same structure twice.
 */
function collectStructureIds(
  evidenceA: readonly IntelligenceEvidence[],
  evidenceB: readonly IntelligenceEvidence[]
): string[] {
  const ids = new Set<string>()

  for (
    const item of [
      ...evidenceA,
      ...evidenceB,
    ]
  ) {
    if (item.structureId) {
      ids.add(item.structureId)
    }
  }

  return Array.from(ids)
}

/**
 * A structural interaction exists when
 * structural evidence is already present
 * for both qualities through the same
 * structure.
 *
 * This is intentionally conservative.
 *
 * The cross-quality layer must not create
 * a second interpretation of an existing
 * row, column or Rajyog merely because
 * both numbers participate in it.
 */
function findSharedStructureIds(
  evidenceA: readonly IntelligenceEvidence[],
  evidenceB: readonly IntelligenceEvidence[]
): string[] {
  const a = new Set(
    evidenceA
      .filter(
        item => item.structureId
      )
      .map(
        item =>
          item.structureId as string
      )
  )

  const b = new Set(
    evidenceB
      .filter(
        item => item.structureId
      )
      .map(
        item =>
          item.structureId as string
      )
  )

  return Array.from(a).filter(
    id => b.has(id)
  )
}

/**
 * No pair may create TENSION merely because:
 * - the qualities are different
 * - one is supported and the other is not
 * - one is over-emphasized
 * - their natural functions are different
 *
 * Draft 1.0 contains no production pair
 * with tensionAllowed = true.
 */
function hasApprovedTension(
  rule: CrossQualityRule,
  evidenceA: readonly IntelligenceEvidence[],
  evidenceB: readonly IntelligenceEvidence[]
): boolean {
  if (!rule.tensionAllowed) {
    return false
  }

  const explicitTension =
    hasDirection(
      evidenceA,
      'TENSION'
    ) ||
    hasDirection(
      evidenceB,
      'TENSION'
    )

  return explicitTension
}

function buildResolutionId(
  qualityA: FunctionalQualityId,
  qualityB: FunctionalQualityId
): string {
  return `XQ_${qualityA}__${qualityB}`
}

/**
 * Reverse-oriented rules need their
 * asymmetric statements reversed when
 * the resolver receives the qualities in
 * the opposite order.
 */
function getAsymmetricStatement(
  rule: CrossQualityRule,
  requestedQualityA:
    FunctionalQualityId,
  stateA: QualitySupportState,
  stateB: QualitySupportState
): string {
  const sameOrientation =
    rule.qualityA ===
    requestedQualityA

  if (
    stateA === 'SUPPORTED' &&
    stateB === 'UNDER_SUPPORTED'
  ) {
    return sameOrientation
      ? rule
          .qualityASupportedQualityBUnderSupportedStatement
      : rule
          .qualityAUnderSupportedQualityBSupportedStatement
  }

  if (
    stateA === 'UNDER_SUPPORTED' &&
    stateB === 'SUPPORTED'
  ) {
    return sameOrientation
      ? rule
          .qualityAUnderSupportedQualityBSupportedStatement
      : rule
          .qualityASupportedQualityBUnderSupportedStatement
  }

  return rule.supportedSupportedStatement
}

/**
 * Resolve one quality pair.
 *
 * Methodology order:
 *
 * 1. Same quality is not a cross-quality pair.
 * 2. No evidence -> INSUFFICIENT.
 * 3. Research candidate -> RESEARCH_ONLY.
 * 4. No approved rule -> COEXIST.
 * 5. Structural supremacy gate.
 * 6. Explicit approved tension only.
 * 7. Supported + Supported -> COMPLEMENT.
 * 8. Supported + Under-supported ->
 *    CONTEXTUALIZE development asymmetry.
 * 9. Under-supported + Supported ->
 *    CONTEXTUALIZE development asymmetry.
 * 10. Mixed states -> CONTEXTUALIZE.
 * 11. Otherwise -> INSUFFICIENT.
 */
export function resolveCrossQualityPair(
  qualityA: FunctionalQualityId,
  qualityB: FunctionalQualityId,
  evidence: readonly IntelligenceEvidence[]
): CrossQualityResolution {
  const evidenceA =
    evidenceForQuality(
      evidence,
      qualityA
    )

  const evidenceB =
    evidenceForQuality(
      evidence,
      qualityB
    )

  const stateA =
    getQualitySupportState(
      evidenceA
    )

  const stateB =
    getQualitySupportState(
      evidenceB
    )

  const allStructureIds =
    collectStructureIds(
      evidenceA,
      evidenceB
    )

  const base = {
    id:
      buildResolutionId(
        qualityA,
        qualityB
      ),

    ruleSetVersion:
      CROSS_QUALITY_RULESET_VERSION,

    resolverVersion:
      CROSS_QUALITY_RESOLVER_VERSION,

    qualityA,

    qualityB,

    qualityAState:
      stateA,

    qualityBState:
      stateB,

    qualityAEvidenceIds:
      evidenceA.map(
        item => item.id
      ),

    qualityBEvidenceIds:
      evidenceB.map(
        item => item.id
      ),

    relevantStructureIds:
      allStructureIds,

    neededNumberDetermined:
      false as const,

    remedyDetermined:
      false as const,

    y3Determined:
      false as const,
  }

  /**
   * Same-quality comparison is outside
   * cross-quality methodology.
   */
  if (qualityA === qualityB) {
    return {
      ...base,

      relationship:
        'INSUFFICIENT',

      status:
        'INSUFFICIENT_EVIDENCE',

      statement:
        'Cross-quality resolution requires two different Functional Qualities.',

      rationale:
        'The existing single-quality Conclusion Engine handles evidence within the same Functional Quality.',

      allowedDomains: [],

      tensionApproved: false,

      warnings: [
        'Same-quality evidence must remain in the single-quality Conclusion Engine.',
      ],
    }
  }

  /**
   * Both qualities need meaningful evidence
   * before an interaction is generated.
   */
  if (
    stateA === 'NO_EVIDENCE' ||
    stateB === 'NO_EVIDENCE'
  ) {
    return {
      ...base,

      relationship:
        'INSUFFICIENT',

      status:
        'INSUFFICIENT_EVIDENCE',

      statement:
        'There is insufficient evidence to create a cross-quality conclusion for this pair.',

      rationale:
        'Cross-quality interpretation is not generated merely because two number identities exist. Both Functional Qualities require usable evidence.',

      allowedDomains: [],

      tensionApproved: false,

      warnings: [],
    }
  }

  /**
   * Research candidates are visible to the
   * methodology system but must not create
   * production client conclusions.
   */
  if (
    isResearchCrossQualityPair(
      qualityA,
      qualityB
    )
  ) {
    return {
      ...base,

      relationship:
        'COEXIST',

      status:
        'RESEARCH_ONLY',

      statement:
        'Both Functional Qualities may coexist, but their cross-quality interaction remains a TSIA research candidate.',

      rationale:
        'The pair has not yet been approved for production cross-quality interpretation.',

      allowedDomains: [],

      tensionApproved: false,

      warnings: [
        'RESEARCH CANDIDATE: do not present a specific interaction as an approved client conclusion.',
      ],
    }
  }

  const rule =
    findCrossQualityRule(
      qualityA,
      qualityB
    )

  /**
   * Frozen default:
   *
   * No approved interaction rule = COEXIST.
   */
  if (!rule) {
    return {
      ...base,

      relationship:
        'COEXIST',

      status:
        'COEXIST_ONLY',

      statement:
        'The two Functional Qualities are both relevant but no additional cross-quality interaction is currently approved.',

      rationale:
        'Different supported qualities default to coexistence unless TSIA has approved a defensible functional interaction.',

      allowedDomains: [
        'CORE',
      ],

      tensionApproved: false,

      warnings: [],
    }
  }

  const sharedStructureIds =
    findSharedStructureIds(
      evidenceA,
      evidenceB
    )

  /**
   * Structural supremacy / non-duplication.
   *
   * When an approved pair requires this gate
   * and both qualities are already connected
   * by the same row, column or Rajyog evidence,
   * the structural conclusion remains primary.
   */
  if (
    rule.structuralSupremacyRequired &&
    sharedStructureIds.length > 0
  ) {
    return {
      ...base,

      ruleId:
        rule.ruleId,

      ruleStatus:
        rule.status,

      relationship:
        'CONTEXTUALIZE',

      status:
        'STRUCTURAL_SUPREMACY',

      statement:
        'An approved structural pattern already connects these Functional Qualities, so the cross-quality layer does not create a duplicate interpretation.',

      rationale:
        'Approved row, column or Rajyog methodology outranks an invented or duplicated pair interpretation within the same structural evidence.',

      relevantStructureIds:
        sharedStructureIds,

      allowedDomains:
        rule.allowedDomains,

      tensionApproved: false,

      warnings: [
        'Structural evidence must not be double-counted as independent cross-quality confirmation.',
      ],
    }
  }

  /**
   * TENSION requires an explicitly approved
   * mechanism plus explicit tension evidence.
   *
   * Pair identity alone can never create it.
   */
  if (
    hasApprovedTension(
      rule,
      evidenceA,
      evidenceB
    )
  ) {
    return {
      ...base,

      ruleId:
        rule.ruleId,

      ruleStatus:
        rule.status,

      relationship:
        'TENSION',

      status:
        'RESOLVED',

      statement:
        'The available evidence supports an approved functional tension between these qualities.',

      rationale:
        rule.functionalRationale,

      allowedDomains:
        rule.allowedDomains,

      tensionApproved: true,

      warnings: [
        'Tension must remain functional and must not be converted into a specific life-event prediction.',
      ],
    }
  }

  /**
   * Supported + Supported
   *
   * Complement before Tension.
   */
  if (
    stateA === 'SUPPORTED' &&
    stateB === 'SUPPORTED'
  ) {
    return {
      ...base,

      ruleId:
        rule.ruleId,

      ruleStatus:
        rule.status,

      relationship:
        rule.defaultRelationship,

      status:
        'RESOLVED',

      statement:
        rule.supportedSupportedStatement,

      rationale:
        rule.functionalRationale,

      allowedDomains:
        rule.allowedDomains,

      tensionApproved: false,

      warnings: [],
    }
  }

  /**
   * Supported + Under-supported
   *
   * This is asymmetry, not conflict.
   */
  if (
    stateA === 'SUPPORTED' &&
    stateB === 'UNDER_SUPPORTED'
  ) {
    return {
      ...base,

      ruleId:
        rule.ruleId,

      ruleStatus:
        rule.status,

      relationship:
        'CONTEXTUALIZE',

      status:
        'RESOLVED',

      statement:
        getAsymmetricStatement(
          rule,
          qualityA,
          stateA,
          stateB
        ),

      rationale:
        'The evidence shows unequal support across two distinct Functional Qualities. TSIA treats this as a development direction rather than automatic psychological tension.',

      allowedDomains:
        rule.allowedDomains,

      tensionApproved: false,

      warnings: [
        'Asymmetric support must not automatically become TENSION.',
        'Under-support must not automatically become Needed Number, remedy or Y3.',
      ],
    }
  }

  /**
   * Under-supported + Supported
   *
   * Same principle in reverse.
   */
  if (
    stateA === 'UNDER_SUPPORTED' &&
    stateB === 'SUPPORTED'
  ) {
    return {
      ...base,

      ruleId:
        rule.ruleId,

      ruleStatus:
        rule.status,

      relationship:
        'CONTEXTUALIZE',

      status:
        'RESOLVED',

      statement:
        getAsymmetricStatement(
          rule,
          qualityA,
          stateA,
          stateB
        ),

      rationale:
        'The evidence shows unequal support across two distinct Functional Qualities. TSIA treats this as a development direction rather than automatic psychological tension.',

      allowedDomains:
        rule.allowedDomains,

      tensionApproved: false,

      warnings: [
        'Asymmetric support must not automatically become TENSION.',
        'Under-support must not automatically become Needed Number, remedy or Y3.',
      ],
    }
  }

  /**
   * Mixed evidence must be contextualized.
   *
   * We do not force Complement or Tension
   * when a quality itself contains both
   * support and under-support evidence.
   */
  if (
    stateA === 'MIXED' ||
    stateB === 'MIXED'
  ) {
    return {
      ...base,

      ruleId:
        rule.ruleId,

      ruleStatus:
        rule.status,

      relationship:
        'CONTEXTUALIZE',

      status:
        'RESOLVED',

      statement:
        'The interaction requires contextual interpretation because at least one Functional Quality contains both supporting and under-supporting evidence.',

      rationale:
        'Mixed evidence must first be understood within its own Functional Quality before a stronger cross-quality conclusion is permitted.',

      allowedDomains:
        rule.allowedDomains,

      tensionApproved: false,

      warnings: [
        'Mixed evidence does not automatically establish TENSION.',
      ],
    }
  }

  return {
    ...base,

    ruleId:
      rule.ruleId,

    ruleStatus:
      rule.status,

    relationship:
      'INSUFFICIENT',

    status:
      'INSUFFICIENT_EVIDENCE',

    statement:
      'The available evidence does not support a stronger cross-quality conclusion.',

    rationale:
      'TSIA does not force an interaction merely because two Functional Qualities are present.',

    allowedDomains: [],

    tensionApproved: false,

    warnings: [],
  }
}

/**
 * Resolve all unique quality pairs represented
 * in the supplied evidence.
 *
 * No duplicate A-B / B-A pair is generated.
 */
export function runCrossQualityResolver(
  evidence: readonly IntelligenceEvidence[]
): CrossQualityResolverResult {
  const qualityIds =
    Array.from(
      new Set(
        evidence
          .map(
            item =>
              item.functionalQualityId
          )
          .filter(
            (
              id
            ): id is FunctionalQualityId =>
              id !== undefined
          )
      )
    )

  const resolutions:
    CrossQualityResolution[] = []

  for (
    let i = 0;
    i < qualityIds.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < qualityIds.length;
      j++
    ) {
      resolutions.push(
        resolveCrossQualityPair(
          qualityIds[i],
          qualityIds[j],
          evidence
        )
      )
    }
  }

  return {
    ruleSetVersion:
      CROSS_QUALITY_RULESET_VERSION,

    resolverVersion:
      CROSS_QUALITY_RESOLVER_VERSION,

    resolutions,

    warnings: [],
  }
}