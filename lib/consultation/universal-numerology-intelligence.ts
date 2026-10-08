/*
 * TSIA UNIVERSAL NUMEROLOGY INTELLIGENCE V1.1
 *
 * OPTION A: RULE-BASED CONSULTATION
 *
 * Uses verified V2 calculations and approved V3
 * conclusions without changing either.
 *
 * Traditional numerology is interpretive, not a
 * scientifically validated personality assessment.
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
  'TSIA_UNIVERSAL_NUMEROLOGY_1.1' as const

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
  relevance: 'PRIMARY' | 'SUPPORTING'
  evidence: readonly NumerologyEvidenceReference[]
  approvedV3ConclusionIds: readonly string[]
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
  evidence: readonly NumerologyEvidenceReference[]
  requiresClientConfirmation: true
}

export type ConcernInterpretation = {
  title: string
  suitabilityDiscussion: string
  personalityConnection: string
  improvementDirection: string
  limitation: string
  supportingQualityIds: readonly FunctionalQualityId[]
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
  relevantQualities: readonly NumerologyQualityAssessment[]
  behaviouralDevelopment: readonly BehaviouralDevelopmentItem[]
  practitionerSummary: string
  suggestedQuestions: readonly string[]
  warnings: readonly string[]
  concernInterpretation: ConcernInterpretation
}

export type UniversalNumerologyInput = {
  topic: UniversalConsultationTopic
  clientConcern: string
  clarification?: string
  calculation: NumerologyCalculationResult
  conclusions: ConclusionEngineResult
}

type QualityDefinition = {
  id: FunctionalQualityId
  number: NumerologyDigit
  title: string
  interpretation: string
  challenge: string
  improvement: string
  question: string
}

const QUALITIES: readonly QualityDefinition[] = [
  {
    id: 'INDIVIDUAL_AGENCY',
    number: 1,
    title: 'Independence and Initiative',
    interpretation:
      'Traditionally associated with initiative, independence and leadership.',
    challenge:
      'Excessive independence or reluctance to seek feedback.',
    improvement:
      'Balance independent decisions with constructive feedback and teamwork.',
    question:
      'Do you usually make decisions independently or seek advice?',
  },
  {
    id: 'RELATIONAL_RECEPTIVITY',
    number: 2,
    title: 'Emotional Understanding',
    interpretation:
      'Traditionally associated with sensitivity, empathy and cooperation.',
    challenge:
      'Taking criticism personally or avoiding difficult conversations.',
    improvement:
      'Develop active listening, emotional boundaries and clear communication.',
    question:
      'How do you usually respond to criticism or disagreement?',
  },
  {
    id: 'KNOWLEDGE_EXPRESSION',
    number: 3,
    title: 'Knowledge and Expression',
    interpretation:
      'Traditionally associated with learning, creativity and expression.',
    challenge:
      'Generating ideas without consistently completing them.',
    improvement:
      'Convert creative ideas into regular practice and completed work.',
    question:
      'Is generating ideas easier than completing and presenting them?',
  },
  {
    id: 'ADAPTIVE_RESTRUCTURING',
    number: 4,
    title: 'Original Thinking',
    interpretation:
      'Traditionally associated with unconventional thinking and change.',
    challenge:
      'Changing direction without sufficiently testing alternatives.',
    improvement:
      'Evaluate new approaches through small, structured experiments.',
    question:
      'How do you decide when an established approach needs to change?',
  },
  {
    id: 'ADAPTIVE_INTELLIGENCE',
    number: 5,
    title: 'Communication and Adaptability',
    interpretation:
      'Traditionally associated with communication, flexibility and adaptability.',
    challenge:
      'Distraction, inconsistent priorities or incomplete follow-through.',
    improvement:
      'Strengthen consistency, professional communication and follow-through.',
    question:
      'Do changing opportunities sometimes make it difficult to stay focused?',
  },
  {
    id: 'HARMONIOUS_CONNECTION',
    number: 6,
    title: 'Harmony and Artistic Appreciation',
    interpretation:
      'Traditionally associated with harmony, aesthetics and care.',
    challenge:
      'Perfectionism or excessive concern about approval.',
    improvement:
      'Balance creative standards with deadlines and practical expectations.',
    question:
      'How do you balance your standards with other people’s expectations?',
  },
  {
    id: 'REFLECTIVE_DISCERNMENT',
    number: 7,
    title: 'Analysis and Reflection',
    interpretation:
      'Traditionally associated with observation, reflection and analysis.',
    challenge:
      'Overanalysis, delayed decisions or withdrawing from collaboration.',
    improvement:
      'Use analysis for preparation, then set decision deadlines and act.',
    question:
      'Does careful analysis help your decisions or sometimes delay them?',
  },
  {
    id: 'STRUCTURED_RESPONSIBILITY',
    number: 8,
    title: 'Discipline and Responsibility',
    interpretation:
      'Traditionally associated with responsibility, structure and persistence.',
    challenge:
      'Rigidity or excessive pressure about results.',
    improvement:
      'Use realistic milestones and review progress consistently.',
    question:
      'How consistently do you follow plans when results take time?',
  },
  {
    id: 'DIRECTED_FORCE',
    number: 9,
    title: 'Determination and Action',
    interpretation:
      'Traditionally associated with determination and energetic action.',
    challenge:
      'Impatience or reacting quickly when progress is slow.',
    improvement:
      'Channel determination through patience and measured decisions.',
    question:
      'How do you react when progress is slower than expected?',
  },
]

const TOPIC_DOMAINS: Record<
  UniversalConsultationTopic,
  readonly IntelligenceDomain[]
> = {
  career: ['CAREER', 'DECISION_MAKING'],
  business: ['BUSINESS', 'PROBLEM_SOLVING'],
  money: ['MONEY', 'DECISION_MAKING'],
  family: ['FAMILY'],
  relationship: ['PARTNER', 'ROMANCE'],
  marriage: ['PARTNER', 'FAMILY'],
  personal_direction: ['GUIDANCE', 'CORE'],
  other: ['GUIDANCE', 'CORE'],
}

const TOPIC_PRIORITIES: Record<
  UniversalConsultationTopic,
  readonly FunctionalQualityId[]
> = {
  career: [
    'KNOWLEDGE_EXPRESSION',
    'ADAPTIVE_INTELLIGENCE',
    'REFLECTIVE_DISCERNMENT',
    'INDIVIDUAL_AGENCY',
    'STRUCTURED_RESPONSIBILITY',
  ],
  business: [
    'INDIVIDUAL_AGENCY',
    'STRUCTURED_RESPONSIBILITY',
    'ADAPTIVE_INTELLIGENCE',
    'REFLECTIVE_DISCERNMENT',
  ],
  money: [
    'STRUCTURED_RESPONSIBILITY',
    'REFLECTIVE_DISCERNMENT',
    'ADAPTIVE_INTELLIGENCE',
  ],
  family: [
    'RELATIONAL_RECEPTIVITY',
    'HARMONIOUS_CONNECTION',
    'STRUCTURED_RESPONSIBILITY',
  ],
  relationship: [
    'RELATIONAL_RECEPTIVITY',
    'HARMONIOUS_CONNECTION',
    'ADAPTIVE_INTELLIGENCE',
  ],
  marriage: [
    'RELATIONAL_RECEPTIVITY',
    'HARMONIOUS_CONNECTION',
    'STRUCTURED_RESPONSIBILITY',
  ],
  personal_direction: [
    'REFLECTIVE_DISCERNMENT',
    'INDIVIDUAL_AGENCY',
    'ADAPTIVE_INTELLIGENCE',
  ],
  other: [
    'INDIVIDUAL_AGENCY',
    'RELATIONAL_RECEPTIVITY',
    'REFLECTIVE_DISCERNMENT',
  ],
}

const CONCERN_SIGNALS: readonly {
  words: readonly string[]
  qualities: readonly FunctionalQualityId[]
}[] = [
  {
    words: [
      'actor', 'acting', 'actress', 'film',
      'movie', 'director', 'cinema',
      'audition', 'performance', 'theatre',
    ],
    qualities: [
      'REFLECTIVE_DISCERNMENT',
      'RELATIONAL_RECEPTIVITY',
      'ADAPTIVE_INTELLIGENCE',
      'KNOWLEDGE_EXPRESSION',
    ],
  },
  {
    words: [
      'hit', 'hits', 'fame', 'famous',
      'recognition', 'breakthrough',
      'promotion', 'success',
    ],
    qualities: [
      'ADAPTIVE_INTELLIGENCE',
      'REFLECTIVE_DISCERNMENT',
      'STRUCTURED_RESPONSIBILITY',
    ],
  },
  {
    words: [
      'conflict', 'argument', 'trust',
      'emotional', 'misunderstanding',
    ],
    qualities: [
      'RELATIONAL_RECEPTIVITY',
      'HARMONIOUS_CONNECTION',
      'ADAPTIVE_INTELLIGENCE',
    ],
  },
  {
    words: [
      'income', 'saving', 'expense',
      'debt', 'investment', 'profit',
      'loss', 'financial',
    ],
    qualities: [
      'STRUCTURED_RESPONSIBILITY',
      'REFLECTIVE_DISCERNMENT',
      'ADAPTIVE_INTELLIGENCE',
    ],
  },
  {
    words: [
      'confused', 'decision', 'direction',
      'change', 'planning',
    ],
    qualities: [
      'REFLECTIVE_DISCERNMENT',
      'INDIVIDUAL_AGENCY',
      'ADAPTIVE_RESTRUCTURING',
    ],
  },
]

function getEvidence(
  calculation: NumerologyCalculationResult,
  number: NumerologyDigit
): NumerologyEvidenceReference[] {
  const evidence: NumerologyEvidenceReference[] = []

  if (calculation.mulank.final === number) {
    evidence.push({
      source: 'MULANK',
      number,
      description: `Mulank ${number}`,
    })
  }

  if (calculation.bhagyank.final === number) {
    evidence.push({
      source: 'BHAGYANK',
      number,
      description: `Bhagyank ${number}`,
    })
  }

  if (calculation.nameNumber.finalNumber === number) {
    evidence.push({
      source: 'NAME_NUMBER',
      number,
      description: `Name Number ${number}`,
    })
  }

  const count = calculation.loShu.counts[number] || 0

  if (count > 0) {
    evidence.push({
      source: 'LO_SHU',
      number,
      description:
        `Number ${number} appears ${count} time(s) in the verified Lo Shu Grid.`,
    })
  }

  return evidence
}

function approvedConclusions(
  conclusions: ConclusionEngineResult,
  qualityId: FunctionalQualityId,
  topic: UniversalConsultationTopic
): ResolvedConclusion[] {
  const domains = TOPIC_DOMAINS[topic]

  return conclusions.conclusions.filter(
    (item) =>
      item.functionalQualityId === qualityId &&
      item.strength !== 'INSUFFICIENT_EVIDENCE' &&
      item.allowedDomains.some(
        (domain) => domains.includes(domain)
      )
  )
}

function buildAssessment(
  definition: QualityDefinition,
  input: UniversalNumerologyInput
): NumerologyQualityAssessment | null {
  const evidence = getEvidence(
    input.calculation,
    definition.number
  )

  const approved = approvedConclusions(
    input.conclusions,
    definition.id,
    input.topic
  )

  if (evidence.length === 0 && approved.length === 0) {
    return null
  }

  return {
    qualityId: definition.id,
    title: definition.title,
    interpretation:
      approved.length > 0
        ? approved.map((item) => item.statement).join(' ')
        : definition.interpretation,
    relevance: 'SUPPORTING',
    evidence: [
      ...evidence,
      ...approved.map(
        (item): NumerologyEvidenceReference => ({
          source: 'V3_CONCLUSION',
          conclusionId: item.id,
          description: item.statement,
        })
      ),
    ],
    approvedV3ConclusionIds:
      approved.map((item) => item.id),
    verificationStatus:
      approved.length > 0
        ? 'V3_SUPPORTED'
        : 'TRADITIONAL_ASSOCIATION',
    confirmationQuestion: definition.question,
  }
}

function concernBoosts(
  text: string
): Map<FunctionalQualityId, number> {
  const words = new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
  )

  const result = new Map<FunctionalQualityId, number>()

  for (const signal of CONCERN_SIGNALS) {
    if (!signal.words.some((word) => words.has(word))) {
      continue
    }

    for (const quality of signal.qualities) {
      result.set(
        quality,
        (result.get(quality) || 0) + 6
      )
    }
  }

  return result
}

function scoreAssessment(
  assessment: NumerologyQualityAssessment,
  topic: UniversalConsultationTopic,
  boosts: Map<FunctionalQualityId, number>
): number {
  let score = boosts.get(assessment.qualityId) || 0

  const position =
    TOPIC_PRIORITIES[topic].indexOf(
      assessment.qualityId
    )

  if (position >= 0) {
    score += Math.max(1, 6 - position)
  }

  for (const evidence of assessment.evidence) {
    if (evidence.source === 'MULANK') score += 7
    if (evidence.source === 'BHAGYANK') score += 7
    if (evidence.source === 'NAME_NUMBER') score += 5

    if (evidence.source === 'LO_SHU') {
      score += 3
    }

    if (evidence.source === 'V3_CONCLUSION') {
      score += 12
    }
  }

  return score
}

function buildDevelopment(
  assessments: readonly NumerologyQualityAssessment[]
): BehaviouralDevelopmentItem[] {
  return assessments.slice(0, 5).map((assessment) => {
    const definition = QUALITIES.find(
      (item) => item.id === assessment.qualityId
    )

    return {
      id: `BEHAVIOUR_${assessment.qualityId}`,
      title: assessment.title,
      possiblePattern:
        definition?.challenge ||
        'Explore possible behavioural challenges.',
      practicalImprovement:
        definition?.improvement ||
        'Agree on one practical improvement.',
      evidence: assessment.evidence,
      requiresClientConfirmation: true as const,
    }
  })
}

function buildConcernInterpretation(
  input: UniversalNumerologyInput,
  assessments: readonly NumerologyQualityAssessment[],
  scope: ConsultationScopeResult
): ConcernInterpretation {
  const limitation =
    'These are traditional numerological interpretations, not proof of personality, professional suitability or future outcomes.'

  if (!scope.canProvideNumerologyGuidance) {
    return {
      title: 'Life Period Guidance Required',
      suitabilityDiscussion:
        'The question primarily concerns timing or future events. A personality consultation cannot establish when an event will occur.',
      personalityConnection:
        'Personality guidance can be explored separately if the client wishes.',
      improvementDirection:
        'Explain the separate TSIA Life Path Guidance Report for traditional period-oriented analysis.',
      limitation,
      supportingQualityIds: [],
    }
  }

  if (assessments.length === 0) {
    return {
      title: 'Further Client Exploration Required',
      suitabilityDiscussion:
        'No relevant quality could be selected from the available calculations and approved conclusions.',
      personalityConnection:
        'Review the verified calculations and clarify the concern.',
      improvementDirection:
        'Ask the client for specific examples before offering recommendations.',
      limitation,
      supportingQualityIds: [],
    }
  }

  const strongest = assessments.slice(0, 3)

  const qualityNames = strongest
    .map((item) => item.title.toLowerCase())
    .join(', ')

  const improvements = strongest
    .map((item) => {
      const definition = QUALITIES.find(
        (quality) => quality.id === item.qualityId
      )
      return definition?.improvement
    })
    .filter((item): item is string => Boolean(item))
    .join(' ')

  const concern = [
    input.clientConcern,
    input.clarification || '',
  ].join(' ').toLowerCase()

  const entertainmentContext =
    /\b(actor|acting|actress|film|movie|cinema|director|theatre|audition|performance)\b/.test(
      concern
    )

  const recognitionContext =
    /\b(hit|hits|fame|famous|recognition|breakthrough|success)\b/.test(
      concern
    )

  let suitabilityDiscussion =
    `For the selected ${input.topic.replace(/_/g, ' ')} concern, ` +
    `the verified numbers provide traditional indicators associated with ${qualityNames}. ` +
    'Discuss whether these qualities are visible in the client’s actual behaviour and whether they support the demands of the chosen role.'

  let improvementDirection =
    improvements ||
    'Explore realistic improvements based on the client’s experience.'

  if (input.topic === 'career' && entertainmentContext) {
    suitabilityDiscussion =
      'The numerological profile can be discussed in relation to creative preparation, character understanding, communication and adaptability. ' +
      'These qualities may be useful in entertainment-related work, but numerology cannot establish acting or directing ability. ' +
      'First confirm the client’s actual professional role and responsibilities.'

    improvementDirection =
      'Explore the quality of professional preparation, feedback on recent projects, industry relationships, creative choices and consistency. ' +
      improvements
  }

  if (input.topic === 'career' && recognitionContext) {
    improvementDirection +=
      ' Separate professional opportunities and controllable performance improvements from public recognition, commercial success and other external outcomes.'
  }

  if (input.topic === 'money') {
    improvementDirection +=
      ' Base financial decisions on verified income, expenses, obligations and qualified financial advice, not numerological predictions.'
  }

  if (
    input.topic === 'family' ||
    input.topic === 'relationship' ||
    input.topic === 'marriage'
  ) {
    improvementDirection +=
      ' Confirm the client’s actual experiences without assuming another person’s intentions or predicting relationship outcomes.'
  }

  return {
    title: 'Personalized Numerology Consultation',
    suitabilityDiscussion,
    personalityConnection:
      `The most relevant available indicators concern ${qualityNames}. ` +
      'Their possible expression should be discussed with the client rather than treated as established personality facts.',
    improvementDirection,
    limitation,
    supportingQualityIds:
      strongest.map((item) => item.qualityId),
  }
}

export function buildUniversalNumerologyIntelligence(
  input: UniversalNumerologyInput
): UniversalNumerologyResult {
  const scope = determineConsultationScope({
    primaryTopic: input.topic,
    clientConcern: input.clientConcern,
    clarification: input.clarification,
  })

  const boosts = concernBoosts(
    `${input.clientConcern} ${input.clarification || ''}`
  )

  const assessments: NumerologyQualityAssessment[] = []

  if (scope.canProvideNumerologyGuidance) {
    for (const definition of QUALITIES) {
      const assessment = buildAssessment(
        definition,
        input
      )

      if (assessment) {
        assessments.push(assessment)
      }
    }
  }

  assessments.sort(
    (a, b) =>
      scoreAssessment(b, input.topic, boosts) -
      scoreAssessment(a, input.topic, boosts)
  )

  const relevantQualities =
    assessments.slice(0, 6).map(
      (assessment, index) => ({
        ...assessment,
        relevance:
          (index < 3
            ? 'PRIMARY'
            : 'SUPPORTING') as
            'PRIMARY' | 'SUPPORTING',
      })
    )

  const behaviouralDevelopment =
    buildDevelopment(relevantQualities)

  const concernInterpretation =
    buildConcernInterpretation(
      input,
      relevantQualities,
      scope
    )

  const suggestedQuestions =
    relevantQualities
      .slice(0, 3)
      .map((item) => item.confirmationQuestion)

  if (scope.requiresLifePathGuidance) {
    suggestedQuestions.push(scope.nextQuestion)
  }

  const warnings = [...scope.warnings]

  if (
    relevantQualities.some(
      (item) =>
        item.verificationStatus ===
        'TRADITIONAL_ASSOCIATION'
    )
  ) {
    warnings.push(
      'Traditional associations are exploratory and must not be presented as approved V3 conclusions.'
    )
  }

  if (
    relevantQualities.length === 0 &&
    scope.canProvideNumerologyGuidance
  ) {
    warnings.push(
      'No eligible qualities were identified. Review the calculations and client concern.'
    )
  }

  return {
    version: UNIVERSAL_NUMEROLOGY_VERSION,
    topic: input.topic,
    clientConcern: input.clientConcern,
    scope,

    coreNumbers: {
      mulank: input.calculation.mulank.final,
      bhagyank: input.calculation.bhagyank.final,
      nameNumber:
        input.calculation.nameNumber.finalNumber,
    },

    relevantQualities,
    behaviouralDevelopment,

    practitionerSummary:
      concernInterpretation.suitabilityDiscussion +
      ' ' +
      concernInterpretation.improvementDirection,

    suggestedQuestions,
    warnings,
    concernInterpretation,
  }
}