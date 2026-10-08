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
  'TSIA_UNIVERSAL_NUMEROLOGY_1.3' as const

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

export type ConsultationFollowUp = {
  question: string
  reason: string
  answered: boolean
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
  nextFollowUp: ConsultationFollowUp
  confirmedClientContext: readonly string[]
}

export type UniversalNumerologyInput = {
  topic: UniversalConsultationTopic
  clientConcern: string
  clarification?: string
  calculation: NumerologyCalculationResult
  conclusions: ConclusionEngineResult
  followUpAnswers?: readonly {
    question: string
    clientAnswer: string
    practitionerObservation?: string
  }[]
}

type QualityDefinition = {
  id: FunctionalQualityId
  number: NumerologyDigit
  title: string
  strength: string
  challenge: string
  improvement: string
  question: string
}

const QUALITIES: readonly QualityDefinition[] = [
  {
    id: 'INDIVIDUAL_AGENCY',
    number: 1,
    title: 'Initiative & Independent Direction',
    strength:
      'initiative, independence, leadership and personal direction',
    challenge:
      'independent decision-making may become excessive self-reliance',
    improvement:
      'Balance independent action with feedback, cooperation and clear priorities.',
    question:
      'Do you prefer making important decisions independently?',
  },
  {
    id: 'RELATIONAL_RECEPTIVITY',
    number: 2,
    title: 'Sensitivity & Cooperation',
    strength:
      'emotional awareness, cooperation, listening and sensitivity',
    challenge:
      'criticism or uncertainty may feel difficult',
    improvement:
      'Practise constructive feedback, emotional boundaries and direct communication.',
    question:
      'How do you normally respond to criticism or disagreement?',
  },
  {
    id: 'KNOWLEDGE_EXPRESSION',
    number: 3,
    title: 'Knowledge & Creative Expression',
    strength:
      'learning, creative expression, teaching and communicating ideas',
    challenge:
      'many ideas may compete for attention',
    improvement:
      'Select clear priorities and turn creative ideas into completed work.',
    question:
      'Do you find it easier to generate ideas or complete them?',
  },
  {
    id: 'ADAPTIVE_RESTRUCTURING',
    number: 4,
    title: 'Unconventional Thinking',
    strength:
      'original approaches, restructuring and unconventional problem-solving',
    challenge:
      'new approaches may create friction with established systems',
    improvement:
      'Test new ideas practically and communicate changes before implementation.',
    question:
      'Do you often prefer a different approach from people around you?',
  },
  {
    id: 'ADAPTIVE_INTELLIGENCE',
    number: 5,
    title: 'Communication & Adaptability',
    strength:
      'communication, versatility, networking and adaptability',
    challenge:
      'frequent changes of interest may weaken consistency',
    improvement:
      'Use communication and adaptability while maintaining long-term focus.',
    question:
      'How easily do you adapt when plans change?',
  },
  {
    id: 'HARMONIOUS_CONNECTION',
    number: 6,
    title: 'Harmony & Relationship Responsibility',
    strength:
      'harmony, aesthetics, relationship care and responsibility',
    challenge:
      'the desire for harmony may lead to over-accommodation',
    improvement:
      'Maintain healthy boundaries while supporting relationships.',
    question:
      'Do you compromise your priorities to maintain harmony?',
  },
  {
    id: 'REFLECTIVE_DISCERNMENT',
    number: 7,
    title: 'Analysis & Reflective Understanding',
    strength:
      'observation, reflection, research, intuition and analytical depth',
    challenge:
      'reflection may become overanalysis or hesitation',
    improvement:
      'Use reflection for preparation, then set decision deadlines and act.',
    question:
      'Do you sometimes spend too long analysing before acting?',
  },
  {
    id: 'STRUCTURED_RESPONSIBILITY',
    number: 8,
    title: 'Structure & Responsibility',
    strength:
      'discipline, persistence, management and responsibility',
    challenge:
      'responsibility may create rigidity or excessive pressure',
    improvement:
      'Use realistic milestones, delegation and regular progress reviews.',
    question:
      'Do you carry more responsibility than you can comfortably manage?',
  },
  {
    id: 'DIRECTED_FORCE',
    number: 9,
    title: 'Determination & Action',
    strength:
      'courage, determination, energetic action and commitment',
    challenge:
      'determination may become impatience',
    improvement:
      'Channel energy into planned action and measured responses.',
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
    'STRUCTURED_RESPONSIBILITY',
    'INDIVIDUAL_AGENCY',
  ],
  business: [
    'INDIVIDUAL_AGENCY',
    'ADAPTIVE_INTELLIGENCE',
    'STRUCTURED_RESPONSIBILITY',
    'ADAPTIVE_RESTRUCTURING',
    'DIRECTED_FORCE',
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
    'HARMONIOUS_CONNECTION',
    'RELATIONAL_RECEPTIVITY',
    'STRUCTURED_RESPONSIBILITY',
    'ADAPTIVE_INTELLIGENCE',
  ],
  personal_direction: [
    'INDIVIDUAL_AGENCY',
    'REFLECTIVE_DISCERNMENT',
    'ADAPTIVE_INTELLIGENCE',
    'STRUCTURED_RESPONSIBILITY',
  ],
  other: [
    'REFLECTIVE_DISCERNMENT',
    'ADAPTIVE_INTELLIGENCE',
    'INDIVIDUAL_AGENCY',
  ],
}

const GRAHAS: Record<number, string> = {
  1: 'Surya',
  2: 'Chandra',
  3: 'Guru',
  4: 'Rahu',
  5: 'Budh',
  6: 'Shukra',
  7: 'Ketu',
  8: 'Shani',
  9: 'Mangal',
}

const SIGNALS: readonly {
  words: readonly string[]
  qualities: readonly FunctionalQualityId[]
}[] = [
  {
    words: [
      'actor',
      'acting',
      'film',
      'movie',
      'cinema',
      'artist',
      'director',
      'producer',
    ],
    qualities: [
      'KNOWLEDGE_EXPRESSION',
      'REFLECTIVE_DISCERNMENT',
      'ADAPTIVE_INTELLIGENCE',
    ],
  },
  {
    words: [
      'hit',
      'success',
      'recognition',
      'famous',
      'popularity',
      'audience',
    ],
    qualities: [
      'ADAPTIVE_INTELLIGENCE',
      'STRUCTURED_RESPONSIBILITY',
      'DIRECTED_FORCE',
    ],
  },
  {
    words: [
      'conflict',
      'argument',
      'fight',
      'misunderstanding',
    ],
    qualities: [
      'RELATIONAL_RECEPTIVITY',
      'HARMONIOUS_CONNECTION',
    ],
  },
  {
    words: [
      'income',
      'money',
      'saving',
      'investment',
      'loss',
      'profit',
      'debt',
    ],
    qualities: [
      'STRUCTURED_RESPONSIBILITY',
      'REFLECTIVE_DISCERNMENT',
    ],
  },
  {
    words: [
      'decision',
      'confused',
      'direction',
      'change',
      'uncertain',
      'choice',
    ],
    qualities: [
      'REFLECTIVE_DISCERNMENT',
      'INDIVIDUAL_AGENCY',
    ],
  },
]

function containsAny(
  text: string,
  words: readonly string[]
): boolean {
  const tokens: string[] =
    text.toLowerCase().match(/[a-z]+/g) ?? []

  return words.some((word) =>
    tokens.includes(word.toLowerCase())
  )
}
function unique<T>(
  values: readonly T[]
): T[] {
  return [...new Set(values)]
}

function numberDescription(
  number: number
): string {
  const quality = QUALITIES.find(
    (item) => item.number === number
  )

  return quality
    ? `${number} (${GRAHAS[number]}) — ${quality.strength}`
    : `Number ${number}`
}

function getEvidence(
  calculation: NumerologyCalculationResult,
  number: NumerologyDigit
): NumerologyEvidenceReference[] {
  const result: NumerologyEvidenceReference[] = []

  if (calculation.mulank.final === number) {
    result.push({
      source: 'MULANK',
      number,
      description:
        `Mulank ${number} (${GRAHAS[number]}) is a birth-number indicator.`,
    })
  }

  if (calculation.bhagyank.final === number) {
    result.push({
      source: 'BHAGYANK',
      number,
      description:
        `Bhagyank ${number} (${GRAHAS[number]}) is a life-path-number indicator.`,
    })
  }

  if (
    calculation.nameNumber.finalNumber === number
  ) {
    result.push({
      source: 'NAME_NUMBER',
      number,
      description:
        `Name Number ${number} (${GRAHAS[number]}) is the calculated Chaldean name indicator.`,
    })
  }

  const count =
    calculation.loShu.counts[number] || 0

  if (count > 0) {
    result.push({
      source: 'LO_SHU',
      number,
      description:
        `Number ${number} appears ${count} time${count === 1 ? '' : 's'} in the personal Lo Shu grid.`,
    })
  }

  return result
}

function approvedConclusions(
  conclusions: ConclusionEngineResult,
  qualityId: FunctionalQualityId,
  topic: UniversalConsultationTopic
): ResolvedConclusion[] {
  return conclusions.conclusions.filter(
    (item) =>
      item.functionalQualityId === qualityId &&
      item.strength !==
        'INSUFFICIENT_EVIDENCE' &&
      item.allowedDomains.some((domain) =>
        TOPIC_DOMAINS[topic].includes(domain)
      )
  )
}

function score(
  quality: NumerologyQualityAssessment,
  topic: UniversalConsultationTopic,
  boosted: readonly FunctionalQualityId[]
): number {
  let result = 0

  const index =
    TOPIC_PRIORITIES[topic].indexOf(
      quality.qualityId
    )

  if (index >= 0) {
    result += 12 - index * 2
  }

  if (boosted.includes(quality.qualityId)) {
    result += 8
  }

  if (
    quality.verificationStatus ===
    'V3_SUPPORTED'
  ) {
    result += 12
  }

  for (const evidence of quality.evidence) {
    result +=
      evidence.source === 'MULANK' ||
      evidence.source === 'BHAGYANK'
        ? 7
        : evidence.source === 'NAME_NUMBER'
          ? 5
          : evidence.source === 'LO_SHU'
            ? 3
            : 4
  }

  return result
}

function buildAssessment(
  definition: QualityDefinition,
  calculation: NumerologyCalculationResult,
  conclusions: ConclusionEngineResult,
  topic: UniversalConsultationTopic
): NumerologyQualityAssessment | null {
  const evidence = getEvidence(
    calculation,
    definition.number
  )

  const approved = approvedConclusions(
    conclusions,
    definition.id,
    topic
  )

  if (!evidence.length && !approved.length) {
    return null
  }

  for (const item of approved) {
    evidence.push({
      source: 'V3_CONCLUSION',
      conclusionId: item.id,
      description:
        `Approved V3 conclusion: ${item.title}`,
    })
  }

  return {
    qualityId: definition.id,
    title: definition.title,
    interpretation:
      `In traditional Ank Shastra, number ${definition.number} ` +
      `(${GRAHAS[definition.number]}) is associated with ` +
      `${definition.strength}. Ask whether this description ` +
      "fits the client's actual experience.",
    relevance: 'SUPPORTING',
    evidence,
    approvedV3ConclusionIds:
      approved.map((item) => item.id),
    verificationStatus:
      approved.length
        ? 'V3_SUPPORTED'
        : 'TRADITIONAL_ASSOCIATION',
    confirmationQuestion: definition.question,
  }
}

function coreNarrative(
  calculation: NumerologyCalculationResult
): string {
  const mulank = calculation.mulank.final
  const bhagyank = calculation.bhagyank.final
  const name =
    calculation.nameNumber.finalNumber

  const parts = [
    `Mulank: ${numberDescription(mulank)}.`,
    `Bhagyank: ${numberDescription(bhagyank)}.`,
    `Name Number: ${numberDescription(name)}.`,
  ]

  if (mulank === bhagyank) {
    parts.push(
      `Mulank and Bhagyank both equal ${mulank}; ` +
      'this repeats a traditional theme but does ' +
      'not prove stronger real-life traits.'
    )
  }

  if (
    name !== mulank &&
    name !== bhagyank
  ) {
    parts.push(
      `Name Number ${name} adds another ` +
      'traditional theme for discussion.'
    )
  }

  return parts.join(' ')
}

type Guidance = {
  suitability: string
  improvement: string
  question: string
  actions: readonly string[]
}

function topicGuidance(
  topic: UniversalConsultationTopic,
  concern: string
): Guidance {
  if (
    topic === 'career' &&
    containsAny(concern, [
      'actor',
      'acting',
      'film',
      'movie',
      'cinema',
      'director',
      'producer',
    ])
  ) {
    return {
      suitability:
        'For screen and film work, explore demonstrated ' +
        'acting or production skills, role choices, ' +
        'preparation, professional relationships and ' +
        'audience-facing opportunities. Traditional ' +
        'number themes may guide reflective questions, ' +
        'but cannot establish talent or commercial success.',
      improvement:
        'Review recent projects and feedback. Identify ' +
        'the strongest role categories, improve audition ' +
        'or portfolio materials, and set measurable ' +
        'professional outreach and preparation goals. ' +
        'A hit depends on scripts, production, marketing, ' +
        'distribution and audience response as well ' +
        'as the individual.',
      question:
        'Which part of your film career is the biggest ' +
        'obstacle right now: finding suitable roles, ' +
        'choosing projects, industry visibility, or the ' +
        'commercial success of released work?',
      actions: [
        'Review your last three projects and record what worked, what did not, and feedback received.',
        'Identify two types of roles that best demonstrate your skills and prepare updated audition or portfolio material.',
        'Set a realistic monthly plan for auditions, professional outreach and skill development; review results without assuming a hit is guaranteed.',
      ],
    }
  }

  switch (topic) {
    case 'career':
      return {
        suitability:
          'Discuss actual skills, responsibilities, ' +
          'work conditions and professional feedback ' +
          'before applying traditional number themes.',
        improvement:
          'Identify one skill gap, request specific ' +
          'feedback and set measurable career goals.',
        question:
          'What is the biggest obstacle in your current work?',
        actions: [
          'Describe the specific career obstacle in observable terms.',
          'Seek feedback from a relevant colleague or mentor.',
          'Set one measurable professional goal for the next month.',
        ],
      }

    case 'business':
      return {
        suitability:
          'Explore actual customers, decision-making, ' +
          'execution, financial risks and operational responsibilities.',
        improvement:
          'Review cash flow, customer demand and execution using real records.',
        question:
          'Which business problem currently needs the most attention?',
        actions: [
          'Review recent customer and sales evidence.',
          'Identify one operational bottleneck and its owner.',
          'Track a realistic improvement metric each week.',
        ],
      }

    case 'money':
      return {
        suitability:
          'Discuss financial habits and decisions, not predictions of wealth.',
        improvement:
          'Review income, expenses, debts and risks; consult a qualified adviser for investment decisions.',
        question:
          'Is your main concern income, savings, debt, losses or planning?',
        actions: [
          'List actual monthly inflows and obligations.',
          'Identify a controllable spending or income improvement.',
          'Seek qualified advice before major financial decisions.',
        ],
      }

    case 'family':
      return {
        suitability:
          'Explore family communication and boundaries without claiming to know relatives’ feelings.',
        improvement:
          'Identify a specific difficulty, listen to perspectives and agree on practical changes.',
        question:
          'Which family relationship or situation needs attention?',
        actions: [
          'Identify one specific recurring difficulty.',
          'Arrange a calm conversation with clear boundaries.',
          'Agree on one practical change and review it later.',
        ],
      }

    case 'relationship':
    case 'marriage':
      return {
        suitability:
          'Explore communication, expectations, cooperation and responsibility; numerology cannot establish compatibility or another person’s feelings.',
        improvement:
          'Clarify expectations and address recurring difficulties through conversation.',
        question:
          'What relationship concern would you like to discuss first?',
        actions: [
          'Identify one unmet expectation clearly.',
          'Ask the other person about their perspective.',
          'Agree on one respectful communication improvement.',
        ],
      }

    case 'personal_direction':
      return {
        suitability:
          'Explore values, actual choices, interests and responsibilities.',
        improvement:
          'Compare realistic options and create a short action plan.',
        question:
          'Which decision or direction feels most unclear?',
        actions: [
          'Write down the decision and realistic options.',
          'Identify constraints and what matters most.',
          'Choose one reversible next step and a review date.',
        ],
      }

    default:
      return {
        suitability:
          'Explore the concern through calculated numbers and traditional associations, confirming every personal interpretation.',
        improvement:
          'Identify controllable factors and practical next steps.',
        question:
          'What change would you most like to achieve?',
        actions: [
          'Clarify the concern in specific terms.',
          'Identify one controllable factor.',
          'Agree on a realistic action and review date.',
        ],
      }
  }
}

function buildFollowUp(
  guidance: Guidance,
  input: UniversalNumerologyInput
): ConsultationFollowUp {
  const answered = (
    input.followUpAnswers || []
  ).filter(
    (item) => item.clientAnswer.trim()
  )

  if (!answered.length) {
    return {
      question: guidance.question,
      reason:
        'Clarify the real situation before making a personal recommendation.',
      answered: false,
    }
  }

  const next =
    input.topic === 'career'
      ? 'What concrete feedback have you received about your recent work, and what would you like to change in your next project?'
      : 'Which practical change have you already tried, and what happened?'

  return {
    question: next,
    reason:
      'Use the client’s recorded experience to choose the next practical step.',
    answered: false,
  }
}

export function buildUniversalNumerologyIntelligence(
  input: UniversalNumerologyInput
): UniversalNumerologyResult {
  const concern =
    input.clientConcern.trim()

  const clarification =
    input.clarification || ''

  const scope = determineConsultationScope({
    primaryTopic: input.topic,
    clientConcern: concern,
    clarification,
  })

  const confirmedClientContext = (
    input.followUpAnswers || []
  )
    .map((item) =>
      item.clientAnswer.trim()
    )
    .filter(Boolean)

  const context = [
    concern,
    clarification,
    ...confirmedClientContext,
  ].join(' ')

  const boosted = unique(
    SIGNALS
      .filter((signal) =>
        containsAny(context, signal.words)
      )
      .flatMap(
        (signal) => signal.qualities
      )
  )

  const assessments = QUALITIES
    .map((definition) =>
      buildAssessment(
        definition,
        input.calculation,
        input.conclusions,
        input.topic
      )
    )
    .filter(
      (
        item
      ): item is NumerologyQualityAssessment =>
        item !== null
    )
    .sort(
      (a, b) =>
        score(b, input.topic, boosted) -
        score(a, input.topic, boosted)
    )

  const relevantQualities =
    assessments
      .slice(0, 6)
      .map((quality, index) => ({
        ...quality,
        relevance:
          index < 3
            ? ('PRIMARY' as const)
            : ('SUPPORTING' as const),
      }))

  const guidance = topicGuidance(
    input.topic,
    context
  )

  const followUp = buildFollowUp(
    guidance,
    input
  )

  const behaviouralDevelopment:
    BehaviouralDevelopmentItem[] =
    relevantQualities
      .slice(0, 5)
      .map((quality, index) => {
        const definition = QUALITIES.find(
          (item) =>
            item.id === quality.qualityId
        )!

        return {
          id: `DEVELOPMENT_${definition.number}`,
          title: definition.title,
          possiblePattern:
            `A possible pattern to explore: ${definition.challenge}.`,
          practicalImprovement:
            index < 3
              ? guidance.actions[index]
              : definition.improvement,
          evidence: quality.evidence,
          requiresClientConfirmation: true,
        }
      })

  const relevant =
    relevantQualities.slice(0, 3)

  const concernInterpretation:
    ConcernInterpretation =
    scope.canProvideNumerologyGuidance
      ? {
          title:
            'Personalized Numerology Consultation',
          suitabilityDiscussion:
            `${coreNarrative(input.calculation)} ${guidance.suitability}`,
          personalityConnection:
            `Relevant traditional themes: ` +
            `${
              relevant
                .map((item) => item.title)
                .join('; ') ||
              'none established'
            }. ` +
            'These are discussion prompts, not confirmed personality facts. ' +
            (
              confirmedClientContext.length
                ? `Client-reported follow-up information: ${confirmedClientContext.join(' | ')}.`
                : 'Ask the client to confirm which themes reflect actual experience.'
            ),
          improvementDirection:
            guidance.improvement,
          limitation:
            'Traditional numerology does not prove personality, career suitability, future events or commercial outcomes. Client statements and V3 calculations are different evidence categories.',
          supportingQualityIds:
            relevant.map(
              (item) => item.qualityId
            ),
        }
      : {
          title:
            'Personalized Consultation Scope',
          suitabilityDiscussion:
            'This question requires separate Life Path assessment for the requested timing or prediction. Numerology alone cannot calculate the event.',
          personalityConnection:
            'Calculated numerology numbers do not establish the requested future event or timing.',
          improvementDirection:
            'Clarify the immediate practical concern and explain the scope of Jeevan Sutra Premium Life Path Guidance.',
          limitation:
            'No event timing or astrological prediction has been calculated.',
          supportingQualityIds: [],
        }

  const suggestedQuestions = unique(
    [
      followUp.question,
      ...relevant.map(
        (item) =>
          item.confirmationQuestion
      ),
      scope.requiresLifePathGuidance
        ? scope.nextQuestion
        : '',
    ].filter(Boolean)
  )

  const warnings = unique([
    ...scope.warnings,
    'Traditional number associations are interpretive, not scientifically validated personality assessments.',
    'Client statements are discussion context, not calculated numerology evidence.',
    'Do not promise professional, financial, relationship or film-industry outcomes.',
  ])

  const practitionerSummary =
    scope.canProvideNumerologyGuidance
      ? (
          `Client concern: ${concern}. ` +
          coreNarrative(
            input.calculation
          ) +
          (
            confirmedClientContext.length
              ? ` Client-reported follow-up: ${confirmedClientContext.join(' | ')}. `
              : ' '
          ) +
          'Ask the next question, verify possible patterns and focus on practical circumstances.'
        )
      : (
          `Client concern: ${concern}. ` +
          'Requested timing or prediction requires separate Life Path Guidance; do not present numerology as astrological calculation.'
        )

  return {
    version:
      UNIVERSAL_NUMEROLOGY_VERSION,
    topic: input.topic,
    clientConcern: concern,
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
    practitionerSummary,
    suggestedQuestions,
    warnings,
    concernInterpretation,
    nextFollowUp: followUp,
    confirmedClientContext,
  }
}