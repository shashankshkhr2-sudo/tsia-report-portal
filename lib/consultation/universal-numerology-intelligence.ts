/*
 * TSIA UNIVERSAL NUMEROLOGY INTELLIGENCE V1.0
 *
 * OPTION A — RULE-BASED CONSULTATION INTELLIGENCE
 *
 * Responsibilities:
 * 1. Read verified V2 numerology calculations.
 * 2. Read approved V3 conclusions.
 * 3. Evaluate the selected consultation concern.
 * 4. Explore traditional personality associations.
 * 5. Identify possible behavioural development areas.
 * 6. Provide practical improvement recommendations.
 * 7. Respect the boundary between Numerology
 *    Consultation and Life Path Guidance.
 *
 * IMPORTANT:
 * Numerological associations are traditional
 * interpretations, not scientifically validated
 * personality or career assessments.
 *
 * Never modify verified calculations.
 * Never manufacture V3 evidence.
 * Never predict event timing.
 */

import type {
  NumerologyCalculationResult,
  NumerologyDigit,
} from '@/lib/numerology/types'

import type {
  ConclusionEngineResult,
  FunctionalQualityId,
  IntelligenceDomain,
  ResolvedConclusion,
} from '@/lib/numerology-intelligence/types'

import {
  determineConsultationScope,
} from '@/lib/consultation/consultation-scope-engine'

import type {
  ConsultationScopeResult,
} from '@/lib/consultation/consultation-scope-engine'

export const UNIVERSAL_NUMEROLOGY_VERSION =
  'TSIA_UNIVERSAL_NUMEROLOGY_1.0' as const

export type UniversalConsultationTopic =
  | 'career'
  | 'business'
  | 'money'
  | 'family'
  | 'relationship'
  | 'marriage'
  | 'personal_direction'
  | 'other'

export type NumerologyEvidenceReference = {
  source:
    | 'MULANK'
    | 'BHAGYANK'
    | 'NAME_NUMBER'
    | 'LO_SHU'
    | 'RAJYOG'
    | 'V3_CONCLUSION'

  number?: number
  conclusionId?: string
  description: string
}

export type NumerologyQualityAssessment = {
  qualityId: FunctionalQualityId
  title: string

  interpretation: string

  relevance:
    | 'PRIMARY'
    | 'SUPPORTING'

  evidence:
    readonly NumerologyEvidenceReference[]

  approvedV3ConclusionIds:
    readonly string[]

  verificationStatus:
    | 'V3_SUPPORTED'
    | 'TRADITIONAL_ASSOCIATION'

  confirmationQuestion: string
}

export type BehaviouralDevelopmentItem = {
  id: string
  title: string

  possiblePattern: string

  practicalImprovement: string

  evidence:
    readonly NumerologyEvidenceReference[]

  requiresClientConfirmation: true
}

export type UniversalNumerologyResult = {
  version: typeof UNIVERSAL_NUMEROLOGY_VERSION

  topic: UniversalConsultationTopic

  clientConcern: string

  scope: ConsultationScopeResult

  coreNumbers: {
    mulank: number
    bhagyank: number
    nameNumber: number
  }

  relevantQualities:
    readonly NumerologyQualityAssessment[]

  behaviouralDevelopment:
    readonly BehaviouralDevelopmentItem[]

  practitionerSummary: string

  suggestedQuestions:
    readonly string[]

  warnings:
    readonly string[]
}

export type UniversalNumerologyInput = {
  topic: UniversalConsultationTopic

  clientConcern: string
  clarification?: string

  calculation: NumerologyCalculationResult

  conclusions: ConclusionEngineResult
}

/*
 * APPROVED TRADITIONAL ASSOCIATION LIBRARY
 *
 * These associations provide interpretive
 * possibilities only.
 *
 * They do not independently establish
 * actual personality traits.
 */

type QualityDefinition = {
  id: FunctionalQualityId
  title: string
  numbers: readonly NumerologyDigit[]
  interpretation: string
  confirmationQuestion: string
  improvement: string
}

const QUALITY_LIBRARY:
  readonly QualityDefinition[] = [
  {
    id: 'INDIVIDUAL_AGENCY',
    title: 'Independence and Initiative',
    numbers: [1],
    interpretation:
      'Traditional numerology associates this quality with independence, initiative and personal direction.',
    confirmationQuestion:
      'Do you prefer making decisions independently, or do you usually seek advice before acting?',
    improvement:
      'Balance independent decisions with constructive feedback and collaborative planning.',
  },
  {
    id: 'RELATIONAL_RECEPTIVITY',
    title: 'Emotional Understanding',
    numbers: [2],
    interpretation:
      'Traditional numerology associates this quality with sensitivity, receptivity and emotional awareness.',
    confirmationQuestion:
      'How easily do you understand and communicate the emotions of people around you?',
    improvement:
      'Practise clear emotional communication, active listening and healthy personal boundaries.',
  },
  {
    id: 'KNOWLEDGE_EXPRESSION',
    title: 'Knowledge and Expression',
    numbers: [3],
    interpretation:
      'Traditional numerology associates this quality with learning, creative expression and communication.',
    confirmationQuestion:
      'Do you find it easier to express ideas creatively or through structured explanations?',
    improvement:
      'Develop your ideas through consistent learning, clear communication and practical execution.',
  },
  {
    id: 'ADAPTIVE_RESTRUCTURING',
    title: 'Change and Restructuring',
    numbers: [4],
    interpretation:
      'Traditional numerology associates this quality with unconventional thinking, change and restructuring.',
    confirmationQuestion:
      'How do you usually respond when an established plan needs to change?',
    improvement:
      'Evaluate unconventional ideas carefully and use structured planning before making major changes.',
  },
  {
    id: 'ADAPTIVE_INTELLIGENCE',
    title: 'Adaptability and Communication',
    numbers: [5],
    interpretation:
      'Traditional numerology associates this quality with adaptability, communication and flexibility.',
    confirmationQuestion:
      'Do you adapt easily when circumstances or other people’s expectations change?',
    improvement:
      'Combine flexibility with consistency, clear priorities and follow-through.',
  },
  {
    id: 'HARMONIOUS_CONNECTION',
    title: 'Harmony and Aesthetic Expression',
    numbers: [6],
    interpretation:
      'Traditional numerology associates this quality with harmony, artistic appreciation and relationship responsibilities.',
    confirmationQuestion:
      'How important are harmony, aesthetics and cooperation in your everyday decisions?',
    improvement:
      'Maintain healthy boundaries while balancing personal preferences with shared responsibilities.',
  },
  {
    id: 'REFLECTIVE_DISCERNMENT',
    title: 'Reflection and Analysis',
    numbers: [7],
    interpretation:
      'Traditional numerology associates this quality with reflection, observation and analytical thinking.',
    confirmationQuestion:
      'Do you prefer to study situations carefully before sharing your opinion or making decisions?',
    improvement:
      'Balance careful reflection with timely action and open communication.',
  },
  {
    id: 'STRUCTURED_RESPONSIBILITY',
    title: 'Discipline and Responsibility',
    numbers: [8],
    interpretation:
      'Traditional numerology associates this quality with responsibility, structure and persistence.',
    confirmationQuestion:
      'How consistently do you follow plans and complete long-term responsibilities?',
    improvement:
      'Use realistic timelines, manageable commitments and regular progress reviews.',
  },
  {
    id: 'DIRECTED_FORCE',
    title: 'Drive and Determination',
    numbers: [9],
    interpretation:
      'Traditional numerology associates this quality with initiative, determination and energetic action.',
    confirmationQuestion:
      'When facing obstacles, do you tend to act immediately or pause to reassess your approach?',
    improvement:
      'Channel determination through patience, measured decisions and constructive conflict management.',
  },
]

/*
 * UNIVERSAL TOPIC REQUIREMENTS
 *
 * The same quality library is reused
 * across different client concerns.
 *
 * Topic relevance does not establish
 * a client-specific finding.
 */

const TOPIC_QUALITIES:
  Record<
    UniversalConsultationTopic,
    readonly FunctionalQualityId[]
  > = {
  career: [
    'KNOWLEDGE_EXPRESSION',
    'ADAPTIVE_INTELLIGENCE',
    'INDIVIDUAL_AGENCY',
    'STRUCTURED_RESPONSIBILITY',
    'HARMONIOUS_CONNECTION',
  ],

  business: [
    'INDIVIDUAL_AGENCY',
    'ADAPTIVE_INTELLIGENCE',
    'STRUCTURED_RESPONSIBILITY',
    'DIRECTED_FORCE',
    'ADAPTIVE_RESTRUCTURING',
  ],

  money: [
    'STRUCTURED_RESPONSIBILITY',
    'REFLECTIVE_DISCERNMENT',
    'ADAPTIVE_INTELLIGENCE',
    'INDIVIDUAL_AGENCY',
  ],

  family: [
    'RELATIONAL_RECEPTIVITY',
    'HARMONIOUS_CONNECTION',
    'STRUCTURED_RESPONSIBILITY',
    'ADAPTIVE_INTELLIGENCE',
  ],

  relationship: [
    'RELATIONAL_RECEPTIVITY',
    'HARMONIOUS_CONNECTION',
    'ADAPTIVE_INTELLIGENCE',
    'REFLECTIVE_DISCERNMENT',
  ],

  marriage: [
    'RELATIONAL_RECEPTIVITY',
    'HARMONIOUS_CONNECTION',
    'STRUCTURED_RESPONSIBILITY',
    'ADAPTIVE_INTELLIGENCE',
  ],

  personal_direction: [
    'INDIVIDUAL_AGENCY',
    'REFLECTIVE_DISCERNMENT',
    'KNOWLEDGE_EXPRESSION',
    'ADAPTIVE_INTELLIGENCE',
    'DIRECTED_FORCE',
  ],

  other: [
    'INDIVIDUAL_AGENCY',
    'RELATIONAL_RECEPTIVITY',
    'KNOWLEDGE_EXPRESSION',
    'ADAPTIVE_INTELLIGENCE',
    'STRUCTURED_RESPONSIBILITY',
  ],
}

function getDefinition(
  id: FunctionalQualityId
): QualityDefinition | null {
  return (
    QUALITY_LIBRARY.find(
      (quality) => quality.id === id
    ) || null
  )
}

function getCoreEvidence(
  calculation: NumerologyCalculationResult,
  number: NumerologyDigit
): NumerologyEvidenceReference[] {
  const evidence: NumerologyEvidenceReference[] = []

  if (calculation.mulank.final === number) {
    evidence.push({
      source: 'MULANK',
      number,
      description:
        `Mulank ${number}`,
    })
  }

  if (calculation.bhagyank.final === number) {
    evidence.push({
      source: 'BHAGYANK',
      number,
      description:
        `Bhagyank ${number}`,
    })
  }

  if (
    calculation.nameNumber.finalNumber === number
  ) {
    evidence.push({
      source: 'NAME_NUMBER',
      number,
      description:
        `Name Number ${number}`,
    })
  }

  const count =
    calculation.loShu.counts[number] || 0

  if (count > 0) {
    evidence.push({
      source: 'LO_SHU',
      number,
      description:
        `Number ${number} appears ${count} time${count === 1 ? '' : 's'} in the verified Personal Lo Shu Grid.`,
    })
  }

  return evidence
}

function getApprovedConclusions(
  conclusions: ConclusionEngineResult,
  qualityId: FunctionalQualityId,
  topic: UniversalConsultationTopic
): ResolvedConclusion[] {
  const relevantDomains:
    readonly IntelligenceDomain[] =
      topic === 'career'
        ? ['CAREER', 'DECISION_MAKING']
        : topic === 'business'
          ? ['BUSINESS', 'PROBLEM_SOLVING']
          : topic === 'money'
            ? ['MONEY', 'DECISION_MAKING']
            : topic === 'family'
              ? ['FAMILY']
              : topic === 'relationship'
                ? ['PARTNER', 'ROMANCE']
                : topic === 'marriage'
                  ? ['PARTNER', 'FAMILY']
                  : ['GUIDANCE', 'CORE']

  return conclusions.conclusions.filter(
    (conclusion) =>
      conclusion.functionalQualityId === qualityId &&
      conclusion.strength !== 'INSUFFICIENT_EVIDENCE' &&
      conclusion.allowedDomains.some(
        (domain) =>
          relevantDomains.includes(domain)
      )
  )
}

function buildQualityAssessment(
  definition: QualityDefinition,
  calculation: NumerologyCalculationResult,
  conclusions: ConclusionEngineResult,
  topic: UniversalConsultationTopic,
  relevance: 'PRIMARY' | 'SUPPORTING'
): NumerologyQualityAssessment | null {
  const evidence =
    definition.numbers.flatMap(
      (number) =>
        getCoreEvidence(
          calculation,
          number
        )
    )

  const approvedConclusions =
    getApprovedConclusions(
      conclusions,
      definition.id,
      topic
    )

  if (
    evidence.length === 0 &&
    approvedConclusions.length === 0
  ) {
    return null
  }

  const approvedEvidence:
    NumerologyEvidenceReference[] =
      approvedConclusions.map(
        (conclusion) => ({
          source: 'V3_CONCLUSION',
          conclusionId: conclusion.id,
          description:
            conclusion.statement,
        })
      )

  return {
    qualityId: definition.id,

    title: definition.title,

    interpretation:
      approvedConclusions.length > 0
        ? approvedConclusions
            .map(
              (conclusion) =>
                conclusion.statement
            )
            .join(' ')
        : definition.interpretation,

    relevance,

    evidence: [
      ...evidence,
      ...approvedEvidence,
    ],

    approvedV3ConclusionIds:
      approvedConclusions.map(
        (conclusion) =>
          conclusion.id
      ),

    verificationStatus:
      approvedConclusions.length > 0
        ? 'V3_SUPPORTED'
        : 'TRADITIONAL_ASSOCIATION',

    confirmationQuestion:
      definition.confirmationQuestion,
  }
}

function buildBehaviouralDevelopment(
  assessments:
    readonly NumerologyQualityAssessment[]
): BehaviouralDevelopmentItem[] {
  return assessments
    .slice(0, 5)
    .map((assessment) => {
      const definition =
        getDefinition(
          assessment.qualityId
        )

      return {
        id:
          `BEHAVIOUR_${assessment.qualityId}`,

        title:
          assessment.title,

        possiblePattern:
          assessment.interpretation,

        practicalImprovement:
          definition?.improvement ||
          'Explore a practical improvement relevant to the client’s confirmed behaviour.',

        evidence:
          assessment.evidence,

        requiresClientConfirmation:
          true as const,
      }
    })
}

function buildPractitionerSummary(
  topic: UniversalConsultationTopic,
  assessments:
    readonly NumerologyQualityAssessment[],
  scope: ConsultationScopeResult
): string {
  if (
    scope.category ===
    'LIFE_PATH_REQUIRED'
  ) {
    return (
      'The client is asking primarily about a current life period or future timing. ' +
      'Explain that numerology consultation focuses on personality, suitability and behavioural development. ' +
      'Recommend the TSIA Life Path Guidance Report for traditional astrological period analysis.'
    )
  }

  if (assessments.length === 0) {
    return (
      'No relevant numerological quality could be established from the available verified calculations and approved V3 conclusions. ' +
      'Do not invent a personality assessment. Review the calculation and clarify the client’s concern.'
    )
  }

  const titles =
    assessments
      .slice(0, 3)
      .map(
        (assessment) =>
          assessment.title.toLowerCase()
      )
      .join(', ')

  return (
    `For the selected ${topic.replace(/_/g, ' ')} concern, ` +
    `the verified numerological profile provides traditional interpretive indicators relating to ${titles}. ` +
    'Explore these possible tendencies with the client before drawing practical conclusions. ' +
    'Use confirmed behavioural patterns to identify realistic improvements. ' +
    'Do not treat numerological associations as proof of actual behaviour or guaranteed outcomes.'
  )
}

export function buildUniversalNumerologyIntelligence(
  input: UniversalNumerologyInput
): UniversalNumerologyResult {
  const scope =
    determineConsultationScope({
      primaryTopic:
        input.topic,

      clientConcern:
        input.clientConcern,

      clarification:
        input.clarification,
    })

  const qualityIds =
    TOPIC_QUALITIES[input.topic]

  const relevantQualities:
    NumerologyQualityAssessment[] = []

  /*
   * If the question is exclusively
   * about timing, do not generate
   * unrelated personality assessments.
   */
  if (
    scope.canProvideNumerologyGuidance
  ) {
    for (
      let index = 0;
      index < qualityIds.length;
      index++
    ) {
      const definition =
        getDefinition(
          qualityIds[index]
        )

      if (!definition) {
        continue
      }

      const assessment =
        buildQualityAssessment(
          definition,
          input.calculation,
          input.conclusions,
          input.topic,
          index < 3
            ? 'PRIMARY'
            : 'SUPPORTING'
        )

      if (assessment) {
        relevantQualities.push(
          assessment
        )
      }
    }
  }

  /*
   * Prefer approved V3 findings
   * before traditional associations.
   */
  relevantQualities.sort(
    (first, second) => {
      if (
        first.verificationStatus ===
          second.verificationStatus
      ) {
        return 0
      }

      return first.verificationStatus ===
        'V3_SUPPORTED'
        ? -1
        : 1
    }
  )

  const behaviouralDevelopment =
    buildBehaviouralDevelopment(
      relevantQualities
    )

  const suggestedQuestions =
    relevantQualities
      .slice(0, 3)
      .map(
        (assessment) =>
          assessment.confirmationQuestion
      )

  if (
    scope.requiresLifePathGuidance
  ) {
    suggestedQuestions.push(
      scope.nextQuestion
    )
  }

  const warnings: string[] = [
    ...scope.warnings,
  ]

  if (
    relevantQualities.length === 0 &&
    scope.canProvideNumerologyGuidance
  ) {
    warnings.push(
      'No eligible numerological qualities were found for this consultation topic.'
    )
  }

  if (
    relevantQualities.some(
      (assessment) =>
        assessment.verificationStatus ===
        'TRADITIONAL_ASSOCIATION'
    )
  ) {
    warnings.push(
      'Some observations are traditional number associations rather than approved topic-specific V3 conclusions. Confirm these possible tendencies with the client.'
    )
  }

  return {
    version:
      UNIVERSAL_NUMEROLOGY_VERSION,

    topic:
      input.topic,

    clientConcern:
      input.clientConcern,

    scope,

    coreNumbers: {
      mulank:
        input.calculation.mulank.final,

      bhagyank:
        input.calculation.bhagyank.final,

      nameNumber:
        input.calculation.nameNumber.finalNumber,
    },

    relevantQualities,

    behaviouralDevelopment,

    practitionerSummary:
      buildPractitionerSummary(
        input.topic,
        relevantQualities,
        scope
      ),

    suggestedQuestions,

    warnings,
  }
}