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
  'TSIA_UNIVERSAL_NUMEROLOGY_1.2' as const

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
      'independent decision-making may sometimes become excessive self-reliance',
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
      'sensitivity may sometimes make criticism or uncertainty difficult to manage',
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
      'learning, creative expression, teaching and communication of ideas',
    challenge:
      'many ideas may compete for attention without consistent execution',
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
      'unconventional approaches may create friction with established systems',
    improvement:
      'Test new ideas practically and communicate changes before implementation.',
    question:
      'Do you often prefer a different approach from the people around you?',
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
      'How easily do you adapt when professional or personal plans change?',
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
      'Maintain healthy boundaries while supporting relationships and responsibilities.',
    question:
      'Do you sometimes compromise your own priorities to maintain harmony?',
  },
  {
    id: 'REFLECTIVE_DISCERNMENT',
    number: 7,
    title: 'Analysis & Reflective Understanding',
    strength:
      'observation, reflection, research, intuition and analytical depth',
    challenge:
      'reflection may become overanalysis, hesitation or excessive withdrawal',
    improvement:
      'Use reflection for preparation, then set decision deadlines and act.',
    question:
      'Do you sometimes spend too long analysing a decision before acting?',
  },
  {
    id: 'STRUCTURED_RESPONSIBILITY',
    number: 8,
    title: 'Structure & Responsibility',
    strength:
      'discipline, persistence, management and responsibility',
    challenge:
      'a strong sense of responsibility may create rigidity or excessive pressure',
    improvement:
      'Use realistic milestones, delegation and regular progress reviews.',
    question:
      'Do you often carry more responsibility than you comfortably manage?',
  },
  {
    id: 'DIRECTED_FORCE',
    number: 9,
    title: 'Determination & Action',
    strength:
      'courage, determination, energetic action and commitment',
    challenge:
      'strong determination may sometimes become impatience or confrontation',
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

const CONCERN_SIGNALS: {
  words: readonly string[]
  qualities: readonly FunctionalQualityId[]
}[] = [
  {
    words: [
      'actor', 'acting', 'film', 'movie',
      'cinema', 'creative', 'artist',
      'director', 'producer',
    ],
    qualities: [
      'KNOWLEDGE_EXPRESSION',
      'REFLECTIVE_DISCERNMENT',
      'ADAPTIVE_INTELLIGENCE',
    ],
  },
  {
    words: [
      'hit', 'success', 'recognition',
      'famous', 'popularity', 'audience',
    ],
    qualities: [
      'ADAPTIVE_INTELLIGENCE',
      'STRUCTURED_RESPONSIBILITY',
      'DIRECTED_FORCE',
    ],
  },
  {
    words: [
      'conflict', 'argument', 'fight',
      'misunderstanding', 'communication',
    ],
    qualities: [
      'RELATIONAL_RECEPTIVITY',
      'HARMONIOUS_CONNECTION',
      'ADAPTIVE_INTELLIGENCE',
    ],
  },
  {
    words: [
      'income', 'money', 'saving',
      'investment', 'loss', 'profit',
      'debt',
    ],
    qualities: [
      'STRUCTURED_RESPONSIBILITY',
      'REFLECTIVE_DISCERNMENT',
      'ADAPTIVE_INTELLIGENCE',
    ],
  },
  {
    words: [
      'decision', 'confused', 'direction',
      'change', 'uncertain', 'choice',
    ],
    qualities: [
      'REFLECTIVE_DISCERNMENT',
      'INDIVIDUAL_AGENCY',
      'ADAPTIVE_INTELLIGENCE',
    ],
  },
]

function containsAny(
  text: string,
  words: readonly string[]
): boolean {
  const normalized = text.toLowerCase()

  return words.some((word) =>
    new RegExp(
      `(^|[^a-z])${word.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )}([^a-z]|$)`
    ).test(normalized)
  )
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)]
}

function numberDefinition(
  number: number
): QualityDefinition | undefined {
  return QUALITIES.find(
    (quality) => quality.number === number
  )
}

function numberDescription(
  number: number
): string {
  const quality = numberDefinition(number)

  if (!quality) return `Number ${number}`

  return (
    `${number} (${GRAHAS[number]}) — ` +
    quality.strength
  )
}

function getEvidence(
  calculation: NumerologyCalculationResult,
  number: NumerologyDigit
): NumerologyEvidenceReference[] {
  const evidence: NumerologyEvidenceReference[] = []

  if (calculation.mulank.final === number) {
    evidence.push({
      source: 'MULANK',
      number,
      description:
        `Mulank ${number} (${GRAHAS[number]}) ` +
        'is a primary birth-number indicator.',
    })
  }

  if (calculation.bhagyank.final === number) {
    evidence.push({
      source: 'BHAGYANK',
      number,
      description:
        `Bhagyank ${number} (${GRAHAS[number]}) ` +
        'is a primary life-path-number indicator.',
    })
  }

  if (
    calculation.nameNumber.finalNumber === number
  ) {
    evidence.push({
      source: 'NAME_NUMBER',
      number,
      description:
        `Name Number ${number} (${GRAHAS[number]}) ` +
        'is the verified Chaldean name indicator.',
    })
  }

  const count =
    calculation.loShu.counts[number] || 0

  if (count > 0) {
    evidence.push({
      source: 'LO_SHU',
      number,
      description:
        `Number ${number} appears ${count} ` +
        `time${count === 1 ? '' : 's'} ` +
        'in the verified personal Lo Shu grid.',
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
    (conclusion) =>
      conclusion.functionalQualityId === qualityId &&
      conclusion.strength !==
        'INSUFFICIENT_EVIDENCE' &&
      conclusion.allowedDomains.some(
        (domain) => domains.includes(domain)
      )
  )
}

function concernBoosts(
  concern: string
): FunctionalQualityId[] {
  const found: FunctionalQualityId[] = []

  for (const signal of CONCERN_SIGNALS) {
    if (containsAny(concern, signal.words)) {
      found.push(...signal.qualities)
    }
  }

  return unique(found)
}

function qualityScore(
  quality: NumerologyQualityAssessment,
  topic: UniversalConsultationTopic,
  boosted: readonly FunctionalQualityId[]
): number {
  let score = 0

  const priorities = TOPIC_PRIORITIES[topic]
  const position = priorities.indexOf(
    quality.qualityId
  )

  if (position >= 0) {
    score += 12 - position * 2
  }

  if (boosted.includes(quality.qualityId)) {
    score += 8
  }

  if (
    quality.verificationStatus ===
    'V3_SUPPORTED'
  ) {
    score += 12
  }

  for (const evidence of quality.evidence) {
    switch (evidence.source) {
      case 'MULANK':
      case 'BHAGYANK':
        score += 7
        break
      case 'NAME_NUMBER':
        score += 5
        break
      case 'LO_SHU':
        score += 3
        break
      case 'V3_CONCLUSION':
        score += 4
        break
      default:
        break
    }
  }

  return score
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

  for (const conclusion of approved) {
    evidence.push({
      source: 'V3_CONCLUSION',
      conclusionId: conclusion.id,
      description:
        `Approved V3 conclusion: ${conclusion.title}`,
    })
  }

  return {
    qualityId: definition.id,
    title: definition.title,
    interpretation:
      `Traditional number ${definition.number} ` +
      `(${GRAHAS[definition.number]}) ` +
      `is associated with ${definition.strength}. ` +
      'Discuss whether these qualities are ' +
      'actually visible in the client’s experience.',
    relevance: 'SUPPORTING',
    evidence,
    approvedV3ConclusionIds:
      approved.map((item) => item.id),
    verificationStatus:
      approved.length > 0
        ? 'V3_SUPPORTED'
        : 'TRADITIONAL_ASSOCIATION',
    confirmationQuestion: definition.question,
  }
}

function buildDevelopment(
  qualities: readonly NumerologyQualityAssessment[]
): BehaviouralDevelopmentItem[] {
  return qualities.slice(0, 5).map(
    (quality) => {
      const definition = QUALITIES.find(
        (item) => item.id === quality.qualityId
      )!

      return {
        id: `DEVELOPMENT_${definition.number}`,
        title: definition.title,
        possiblePattern:
          `A possible pattern to explore: ` +
          definition.challenge + '.',
        practicalImprovement:
          definition.improvement,
        evidence: quality.evidence,
        requiresClientConfirmation: true,
      }
    }
  )
}

function coreNumberNarrative(
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
      `Mulank and Bhagyank are both ${mulank}. ` +
      'In traditional interpretation this ' +
      'repeats the same numerical theme. ' +
      'It does not establish that a trait ' +
      'is stronger in real life.'
    )
  }

  if (name !== mulank && name !== bhagyank) {
    parts.push(
      `Name Number ${name} introduces a ` +
      'different traditional theme to explore ' +
      'alongside the birth numbers.'
    )
  }

  return parts.join(' ')
}

function topicGuidance(
  topic: UniversalConsultationTopic,
  concern: string
): {
  suitability: string
  improvement: string
  question: string
} {
  const entertainment = containsAny(
    concern,
    [
      'actor', 'acting', 'film', 'movie',
      'cinema', 'director', 'producer',
    ]
  )

  const recognition = containsAny(
    concern,
    [
      'hit', 'success', 'recognition',
      'famous', 'popularity',
    ]
  )

  if (topic === 'career' && entertainment) {
    return {
      suitability:
        'For film-related work, explore how ' +
        'reflection may support character ' +
        'understanding, how communication may ' +
        'support professional relationships, ' +
        'and how discipline may support preparation. ' +
        'Confirm whether the client works as an ' +
        'actor, director, producer or in another role. ' +
        'Numerology cannot determine actual talent.',
      improvement:
        'Review recent projects, role selection, ' +
        'preparation, feedback, industry relationships ' +
        'and consistency. Set practical development ' +
        'goals for the next projects. ' +
        (recognition
          ? 'A commercially successful film depends ' +
            'on many factors beyond one individual, ' +
            'including the project, distribution, ' +
            'marketing and audience response.'
          : 'Measure progress using actual work and feedback.'),
      question:
        'What is your exact role in the film industry, ' +
        'and what would a successful project mean to you?',
    }
  }

  switch (topic) {
    case 'career':
      return {
        suitability:
          'Discuss the client’s current profession, ' +
          'work responsibilities, preferred environment ' +
          'and demonstrated skills before exploring ' +
          'how traditional number themes might relate.',
        improvement:
          'Identify one skill to strengthen, obtain ' +
          'specific professional feedback and set ' +
          'measurable career-development goals.',
        question:
          'What is the biggest obstacle in your current work?',
      }

    case 'business':
      return {
        suitability:
          'Explore decision-making, client communication, ' +
          'risk management, planning and operational ' +
          'responsibility in the client’s actual business.',
        improvement:
          'Review cash flow, customer demand, execution, ' +
          'responsibilities and decision processes. ' +
          'Validate important business choices with data.',
        question:
          'Which part of the business currently needs ' +
          'the most attention?',
      }

    case 'money':
      return {
        suitability:
          'Explore financial habits, planning, discipline ' +
          'and decision-making as discussion themes, ' +
          'not predictions of wealth.',
        improvement:
          'Review income, expenses, savings, obligations ' +
          'and financial risks. Use qualified financial ' +
          'advice for investment decisions.',
        question:
          'Is your main concern income, savings, debt, ' +
          'business losses or financial planning?',
      }

    case 'family':
      return {
        suitability:
          'Explore communication, responsibility, ' +
          'emotional needs and boundaries within the ' +
          'family without assuming how relatives behave.',
        improvement:
          'Identify the specific relationship difficulty, ' +
          'listen to each person’s perspective and agree ' +
          'on realistic communication improvements.',
        question:
          'Which family relationship would you like ' +
          'to understand better?',
      }

    case 'relationship':
    case 'marriage':
      return {
        suitability:
          'Explore emotional connection, communication, ' +
          'expectations, cooperation and responsibility. ' +
          'A numerological profile cannot establish ' +
          'compatibility or another person’s feelings.',
        improvement:
          'Discuss expectations openly, clarify boundaries ' +
          'and address repeated communication difficulties ' +
          'through practical conversation.',
        question:
          'What is the main relationship concern you ' +
          'would like to discuss?',
      }

    case 'personal_direction':
      return {
        suitability:
          'Explore the client’s values, current choices, ' +
          'interests and practical responsibilities.',
        improvement:
          'Clarify priorities, compare realistic options ' +
          'and create a short action plan with review dates.',
        question:
          'Which important decision or direction feels unclear?',
      }

    default:
      return {
        suitability:
          'Explore the concern through verified core ' +
          'numbers and relevant traditional qualities, ' +
          'while confirming each interpretation.',
        improvement:
          'Identify the specific problem, distinguish ' +
          'controllable factors and agree on practical steps.',
        question:
          'What change would you most like to achieve?',
      }
  }
}

function buildConcernInterpretation(
  input: UniversalNumerologyInput,
  scope: ConsultationScopeResult,
  qualities: readonly NumerologyQualityAssessment[]
): ConcernInterpretation {
  const guidance = topicGuidance(
    input.topic,
    [
      input.clientConcern,
      input.clarification || '',
    ].join(' ')
  )

  const foundation = coreNumberNarrative(
    input.calculation
  )

  const relevant = qualities.slice(0, 3)

  const qualitySummary = relevant.length
    ? relevant
        .map((quality) => {
          const definition = QUALITIES.find(
            (item) => item.id === quality.qualityId
          )

          return definition
            ? `${definition.title}: ${definition.strength}`
            : quality.title
        })
        .join('; ')
    : 'No additional topic-specific quality is established.'

  const improvement = relevant
    .map((quality) =>
      QUALITIES.find(
        (item) => item.id === quality.qualityId
      )?.improvement
    )
    .filter((item): item is string => Boolean(item))

  if (!scope.canProvideNumerologyGuidance) {
    return {
      title: 'Personalized Consultation Scope',
      suitabilityDiscussion:
        'The client’s concern requires a separate ' +
        'Life Path assessment for the requested ' +
        'timing or prediction. Do not infer such ' +
        'results from numerology alone.',
      personalityConnection:
        'Verified numerological numbers are available, ' +
        'but they do not establish the requested ' +
        'future event or timing.',
      improvementDirection:
        'Clarify the client’s immediate practical ' +
        'concern and explain the appropriate scope ' +
        'of the TSIA Life Path Guidance Report.',
      limitation:
        'No event timing, guaranteed result or ' +
        'astrological prediction has been calculated.',
      supportingQualityIds: [],
    }
  }

  return {
    title: 'Personalized Numerology Consultation',
    suitabilityDiscussion:
      `${foundation} ${guidance.suitability}`,
    personalityConnection:
      `The most relevant available traditional ` +
      `themes for this discussion are: ` +
      `${qualitySummary}. ` +
      'These are interpretations to discuss, ' +
      'not verified personality facts. ' +
      'Ask the client which observations fit ' +
      'their real experience.',
    improvementDirection:
      [
        guidance.improvement,
        ...unique(improvement),
      ].join(' '),
    limitation:
      'These are traditional numerological ' +
      'interpretations, not proof of personality, ' +
      'professional suitability or future outcomes. ' +
      'Approved V3 findings and traditional ' +
      'associations must remain distinct.',
    supportingQualityIds:
      relevant.map((item) => item.qualityId),
  }
}

export function buildUniversalNumerologyIntelligence(
  input: UniversalNumerologyInput
): UniversalNumerologyResult {
  const concern = input.clientConcern.trim()

  const scope = determineConsultationScope({
    primaryTopic: input.topic,
    clientConcern: concern,
    clarification: input.clarification || '',
  })

  const boosted = concernBoosts(
    `${concern} ${input.clarification || ''}`
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
        qualityScore(b, input.topic, boosted) -
        qualityScore(a, input.topic, boosted)
    )

  const relevantQualities =
    assessments.slice(0, 6).map(
      (quality, index) => ({
        ...quality,
        relevance:
          index < 3
            ? ('PRIMARY' as const)
            : ('SUPPORTING' as const),
      })
    )

  const behaviouralDevelopment =
    buildDevelopment(relevantQualities)

  const concernInterpretation =
    buildConcernInterpretation(
      input,
      scope,
      relevantQualities
    )

  const guidance = topicGuidance(
    input.topic,
    `${concern} ${input.clarification || ''}`
  )

  const suggestedQuestions = unique(
    [
      guidance.question,
      ...relevantQualities
        .slice(0, 3)
        .map(
          (quality) =>
            quality.confirmationQuestion
        ),
      scope.requiresLifePathGuidance
        ? scope.nextQuestion
        : '',
    ].filter((item): item is string => Boolean(item))
  )

  const warnings = unique([
    ...scope.warnings,
    'Traditional number associations are not ' +
      'scientifically validated personality assessments.',
    'Client statements provide discussion context ' +
      'and must not be treated as numerological evidence.',
    'Numerology does not establish guaranteed ' +
      'professional, financial or relationship outcomes.',
  ])

  const practitionerSummary =
    scope.canProvideNumerologyGuidance
      ? (
          `Client concern: ${concern}. ` +
          coreNumberNarrative(input.calculation) +
          ' Discuss the relevant qualities, ' +
          'confirm possible patterns with the client, ' +
          'and connect improvements to real circumstances.'
        )
      : (
          `Client concern: ${concern}. ` +
          'The requested prediction or timing requires ' +
          'separate Life Path Guidance. Do not present ' +
          'a numerological interpretation as an ' +
          'astrological calculation.'
        )

  return {
    version: UNIVERSAL_NUMEROLOGY_VERSION,
    topic: input.topic,
    clientConcern: concern,
    scope,
    coreNumbers: {
      mulank: input.calculation.mulank.final,
      bhagyank: input.calculation.bhagyank.final,
      nameNumber:
        input.calculation.nameNumber.finalNumber,
    },
    relevantQualities,
    behaviouralDevelopment,
    practitionerSummary,
    suggestedQuestions,
    warnings,
    concernInterpretation,
  }
}