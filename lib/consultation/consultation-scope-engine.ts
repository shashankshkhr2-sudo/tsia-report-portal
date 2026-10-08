/*
 * TSIA CONSULTATION SCOPE ENGINE V1.0
 *
 * Purpose:
 * Determine whether a client's question belongs to:
 *
 * 1. Numerology-based personality and behavioural guidance
 * 2. A combination of numerology and Life Path Guidance
 * 3. Life Path Guidance for current periods and future timing
 *
 * This engine does not calculate numerology,
 * astrology, planetary periods or predictions.
 *
 * Client statements are discussion context,
 * not numerological evidence.
 */

export const CONSULTATION_SCOPE_VERSION =
  'TSIA_CONSULTATION_SCOPE_1.0' as const

export type ConsultationScopeCategory =
  | 'NUMEROLOGY_GUIDANCE'
  | 'NUMEROLOGY_AND_LIFE_PATH'
  | 'LIFE_PATH_REQUIRED'

export type ConsultationScopeReason =
  | 'PERSONALITY'
  | 'BEHAVIOUR'
  | 'SUITABILITY'
  | 'RELATIONSHIP_DYNAMICS'
  | 'CURRENT_PERIOD'
  | 'FUTURE_TIMING'
  | 'PLANETARY_INFLUENCE'
  | 'UNDETERMINED'

export type ConsultationScopeInput = {
  primaryTopic?: string | null
  topics?: readonly string[]
  clientConcern: string
  clarification?: string
}

export type ConsultationScopeResult = {
  version: typeof CONSULTATION_SCOPE_VERSION
  category: ConsultationScopeCategory

  primaryTopic: string | null

  reasons: readonly ConsultationScopeReason[]

  canProvideNumerologyGuidance: boolean
  requiresLifePathGuidance: boolean

  employeeExplanation: string

  suggestedResponse: string

  recommendedProduct:
    | 'TSIA_NUMEROLOGY_CONSULTATION'
    | 'TSIA_LIFE_PATH_GUIDANCE_REPORT'

  nextQuestion: string

  warnings: readonly string[]
}

type ScopeSignal = {
  reason: ConsultationScopeReason
  phrases: readonly string[]
}

const NUMEROLOGY_SIGNALS: readonly ScopeSignal[] = [
  {
    reason: 'PERSONALITY',
    phrases: [
      'personality',
      'my nature',
      'my character',
      'my strengths',
      'my weaknesses',
      'my qualities',
      'what kind of person',
      'self confidence',
      'confidence',
    ],
  },
  {
    reason: 'BEHAVIOUR',
    phrases: [
      'behaviour',
      'behavior',
      'habits',
      'attitude',
      'discipline',
      'communication',
      'decision making',
      'decision-making',
      'how can i improve',
      'what should i improve',
      'what should i change',
      'why do i react',
      'anger',
      'patience',
    ],
  },
  {
    reason: 'SUITABILITY',
    phrases: [
      'suitable',
      'suitability',
      'right profession',
      'right career',
      'career choice',
      'job or business',
      'business or job',
      'which profession',
      'which career',
      'good for me',
      'best for me',
      'should i choose',
      'should i become',
    ],
  },
  {
    reason: 'RELATIONSHIP_DYNAMICS',
    phrases: [
      'relationship',
      'understanding',
      'compatibility',
      'communication with',
      'family problems',
      'family relationship',
      'marital relationship',
      'partner',
      'spouse',
      'husband',
      'wife',
    ],
  },
]

const LIFE_PATH_SIGNALS: readonly ScopeSignal[] = [
  {
    reason: 'CURRENT_PERIOD',
    phrases: [
      'current phase',
      'current period',
      'present phase',
      'present period',
      'this phase of life',
      'this period of life',
      'my life right now',
      'what phase am i in',
      'how is my time',
      'how is my current time',
      'going through a phase',
      'dasha',
      'mahadasha',
      'antardasha',
    ],
  },
  {
    reason: 'FUTURE_TIMING',
    phrases: [
      'when will',
      'when can',
      'when am i going to',
      'when is',
      'what year',
      'which year',
      'which month',
      'next six months',
      'next 6 months',
      'next year',
      'future prediction',
      'predict my future',
      'when will i get',
      'when will i become',
      'when will i marry',
      'when will i succeed',
      'when will i be successful',
      'when will things improve',
      'good time to start',
      'right time to start',
      'auspicious time',
    ],
  },
  {
    reason: 'PLANETARY_INFLUENCE',
    phrases: [
      'planetary period',
      'planetary influence',
      'planetary position',
      'transit',
      'gochar',
      'kundli',
      'birth chart',
      'horoscope',
      'saturn transit',
      'rahu period',
      'ketu period',
      'shani period',
    ],
  },
]

const NUMEROLOGY_REASONS =
  new Set<ConsultationScopeReason>([
    'PERSONALITY',
    'BEHAVIOUR',
    'SUITABILITY',
    'RELATIONSHIP_DYNAMICS',
  ])

const LIFE_PATH_REASONS =
  new Set<ConsultationScopeReason>([
    'CURRENT_PERIOD',
    'FUTURE_TIMING',
    'PLANETARY_INFLUENCE',
  ])

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function containsPhrase(
  text: string,
  phrase: string
): boolean {
  const normalizedPhrase = normalizeText(phrase)

  if (!normalizedPhrase) {
    return false
  }

  return ` ${text} `.includes(
    ` ${normalizedPhrase} `
  )
}

function detectReasons(
  text: string,
  signals: readonly ScopeSignal[]
): ConsultationScopeReason[] {
  const reasons: ConsultationScopeReason[] = []

  for (const signal of signals) {
    if (
      signal.phrases.some((phrase) =>
        containsPhrase(text, phrase)
      )
    ) {
      reasons.push(signal.reason)
    }
  }

  return reasons
}

function uniqueReasons(
  reasons: readonly ConsultationScopeReason[]
): ConsultationScopeReason[] {
  return Array.from(new Set(reasons))
}

function isNumerologyTopic(
  topic: string | null
): boolean {
  return [
    'career',
    'business',
    'money',
    'family',
    'relationship',
    'marriage',
    'personal_direction',
  ].includes(topic || '')
}

function buildEmployeeExplanation(
  category: ConsultationScopeCategory
): string {
  if (category === 'NUMEROLOGY_GUIDANCE') {
    return (
      'This concern can be explored through the ' +
      "client's verified numerological profile. " +
      'Examine personality, relevant qualities, ' +
      'possible behavioural tendencies and ' +
      'practical improvement opportunities. ' +
      'Confirm interpretations with the client.'
    )
  }

  if (category === 'NUMEROLOGY_AND_LIFE_PATH') {
    return (
      'This concern contains both personality or ' +
      'behavioural questions and questions about ' +
      'current periods or future timing. Provide ' +
      'supported numerology guidance first. ' +
      'Explain that traditional astrological ' +
      'period and timing analysis requires the ' +
      'TSIA Life Path Guidance Report.'
    )
  }

  return (
    'The client is asking about a current life ' +
    'period, planetary influence or future timing. ' +
    'The numerology consultation should not ' +
    'invent periods, event dates or predictions. ' +
    'Explain the scope of numerology and offer ' +
    'the TSIA Life Path Guidance Report for ' +
    'traditional astrological analysis.'
  )
}

function buildSuggestedResponse(
  category: ConsultationScopeCategory
): string {
  if (category === 'NUMEROLOGY_GUIDANCE') {
    return (
      'We can examine your numerological profile ' +
      'to explore your personality, strengths, ' +
      'behavioural tendencies and suitability ' +
      'for different activities. We can also ' +
      'discuss practical behaviours you may ' +
      'wish to develop or improve.'
    )
  }

  if (category === 'NUMEROLOGY_AND_LIFE_PATH') {
    return (
      'We can use your numerology calculations ' +
      'to explore your personality, suitability, ' +
      'behavioural patterns and possible areas ' +
      'for improvement. However, understanding ' +
      'your current planetary period or exploring ' +
      'future timing requires additional ' +
      'astrological analysis through the TSIA ' +
      'Life Path Guidance Report. Such analysis ' +
      'does not guarantee a particular outcome.'
    )
  }

  return (
    'Numerology helps us explore personality, ' +
    'strengths, behavioural tendencies and ' +
    'suitability. It does not establish your ' +
    'current planetary period or the timing ' +
    'of future events. For traditional ' +
    'astrological analysis of your current ' +
    'life period and possible future trends, ' +
    'we recommend the TSIA Life Path Guidance ' +
    'Report. Predictions are not guarantees.'
  )
}

function buildNextQuestion(
  category: ConsultationScopeCategory,
  primaryTopic: string | null
): string {
  if (category === 'LIFE_PATH_REQUIRED') {
    return (
      'Would you also like to explore your ' +
      'personality and behavioural strengths ' +
      'through numerology, or is your main ' +
      'question specifically about your ' +
      'current life period and future timing?'
    )
  }

  if (category === 'NUMEROLOGY_AND_LIFE_PATH') {
    return (
      'Shall we first explore the personality ' +
      'and behavioural aspects of your concern, ' +
      'then discuss the separate Life Path ' +
      'Guidance analysis for timing questions?'
    )
  }

  if (primaryTopic === 'career') {
    return (
      'Would you like to understand your ' +
      'professional suitability, work-related ' +
      'behavioural strengths or areas you ' +
      'could improve?'
    )
  }

  if (primaryTopic === 'business') {
    return (
      'Would you like to explore your ' +
      'entrepreneurial suitability, decision-making ' +
      'style or business-related habits?'
    )
  }

  if (primaryTopic === 'money') {
    return (
      'Would you like to explore your financial ' +
      'decision-making habits, planning style ' +
      'or attitudes toward risk?'
    )
  }

  if (
    primaryTopic === 'relationship' ||
    primaryTopic === 'marriage' ||
    primaryTopic === 'family'
  ) {
    return (
      'Would you like to explore communication, ' +
      'emotional expression or relationship ' +
      'behavioural patterns?'
    )
  }

  return (
    'Which personality trait, behaviour or ' +
    'personal-development area would you ' +
    'most like to understand?'
  )
}

export function determineConsultationScope(
  input: ConsultationScopeInput
): ConsultationScopeResult {
  const primaryTopic =
    input.primaryTopic ||
    input.topics?.[0] ||
    null

  const concern =
    input.clientConcern.trim()

  const clarification =
    input.clarification?.trim() || ''

  const combinedText = normalizeText(
    [concern, clarification]
      .filter(Boolean)
      .join(' ')
  )

  const detectedNumerologyReasons =
    detectReasons(
      combinedText,
      NUMEROLOGY_SIGNALS
    )

  const detectedLifePathReasons =
    detectReasons(
      combinedText,
      LIFE_PATH_SIGNALS
    )

  const reasons = uniqueReasons([
    ...detectedNumerologyReasons,
    ...detectedLifePathReasons,
  ])

  const hasNumerologySignal =
    reasons.some((reason) =>
      NUMEROLOGY_REASONS.has(reason)
    )

  const hasLifePathSignal =
    reasons.some((reason) =>
      LIFE_PATH_REASONS.has(reason)
    )

  const topicSupportsNumerology =
    isNumerologyTopic(primaryTopic)

  let category: ConsultationScopeCategory =
    'NUMEROLOGY_GUIDANCE'

  /*
   * Explicit timing requests take priority.
   *
   * A selected topic alone does not prove
   * that the client is requesting both
   * numerology and astrological guidance.
   */
  if (hasLifePathSignal) {
    category = hasNumerologySignal
      ? 'NUMEROLOGY_AND_LIFE_PATH'
      : 'LIFE_PATH_REQUIRED'
  }

  /*
   * An unknown or ambiguous concern should
   * not be classified as a timing request
   * without supporting language.
   */
  if (
    !hasLifePathSignal &&
    !hasNumerologySignal &&
    !topicSupportsNumerology
  ) {
    reasons.push('UNDETERMINED')
  }

  const canProvideNumerologyGuidance =
    category !== 'LIFE_PATH_REQUIRED'

  const requiresLifePathGuidance =
    category !== 'NUMEROLOGY_GUIDANCE'

  const warnings: string[] = []

  if (!combinedText) {
    warnings.push(
      'No client concern has been recorded. ' +
      'Confirm the question before interpreting it.'
    )
  }

  if (reasons.includes('UNDETERMINED')) {
    warnings.push(
      'The question is not specific enough ' +
      'to determine its interpretation scope. ' +
      'Ask a clarification question.'
    )
  }

  if (requiresLifePathGuidance) {
    warnings.push(
      'Do not calculate or infer astrological ' +
      'periods, planetary transits or event ' +
      'timing from numerology-only evidence.'
    )
  }

  return {
    version: CONSULTATION_SCOPE_VERSION,

    category,

    primaryTopic,

    reasons,

    canProvideNumerologyGuidance,
    requiresLifePathGuidance,

    employeeExplanation:
      buildEmployeeExplanation(category),

    suggestedResponse:
      buildSuggestedResponse(category),

    recommendedProduct:
      requiresLifePathGuidance
        ? 'TSIA_LIFE_PATH_GUIDANCE_REPORT'
        : 'TSIA_NUMEROLOGY_CONSULTATION',

    nextQuestion:
      buildNextQuestion(
        category,
        primaryTopic
      ),

    warnings,
  }
}