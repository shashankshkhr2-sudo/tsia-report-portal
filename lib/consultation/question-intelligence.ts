export type QuestionStage =
  | 'NUMEROLOGY_FAMILIARITY'
  | 'CONCERN_EXPLORATION'
  | 'CONCERN_CLARIFICATION'
  | 'READY_FOR_V3'

export type QuestionSource =
  | 'FIRST_TIME_ORIENTATION'
  | 'SELECTED_CONCERN'
  | 'TODAY_NOTE'
  | 'CONCERN_AND_NOTE'
  | 'CLIENT_RESPONSE'

export type ConsultationAnswerForIntelligence = {
  questionKey: string
  questionText: string
  clientAnswer: string
}

export type QuestionIntelligenceInput = {
  consultationNumber: number
  purpose: string
  topics: readonly string[]
  todayNote: string

  currentAnswers:
    readonly ConsultationAnswerForIntelligence[]

  /**
   * Practitioner-controlled clarification.
   *
   * true:
   * Ask one additional question after
   * the opening concern is recorded.
   *
   * false:
   * Proceed to V3 discussion.
   *
   * This is optional for compatibility
   * with existing callers.
   */
  clarificationNeeded?: boolean
}

export type QuestionIntelligenceDecision = {
  stage: QuestionStage
  source: QuestionSource

  questionKey: string | null
  questionText: string | null

  primaryTopic: string | null
  secondaryTopics: readonly string[]

  reason: string
  shouldAskQuestion: boolean
}

/**
 * TSIA QUESTION INTELLIGENCE
 *
 * Version 1.1
 *
 * SIMPLE • FAST • SAFE • RELIABLE
 *
 * Responsibilities:
 *
 * 1. Establish numerology familiarity
 *    during the first consultation.
 *
 * 2. Understand the selected concern.
 *
 * 3. Ask one additional clarification
 *    when the practitioner requests it.
 *
 * 4. Preserve the primary topic.
 *
 * 5. Keep client responses separate
 *    from verified V3 evidence.
 *
 * This module does not:
 *
 * - Calculate numerology
 * - Modify V2 or V3
 * - Generate numerological conclusions
 * - Predict specific life events
 * - Diagnose financial or personal issues
 */

export const QUESTION_INTELLIGENCE_VERSION =
  'TSIA_QUESTION_INTELLIGENCE_1.1' as const

export function decideNextQuestion(
  input: QuestionIntelligenceInput
): QuestionIntelligenceDecision {
  const primaryTopic =
    input.topics[0] || null

  const secondaryTopics =
    input.topics.slice(1)

  /**
   * STEP 1
   *
   * FIRST CONSULTATION ORIENTATION
   */
  if (input.consultationNumber <= 1) {
    const familiarityAnswer =
      findAnswer(
        input.currentAnswers,
        'NUMEROLOGY_FAMILIARITY'
      )

    if (!familiarityAnswer) {
      return {
        stage:
          'NUMEROLOGY_FAMILIARITY',

        source:
          'FIRST_TIME_ORIENTATION',

        questionKey:
          'NUMEROLOGY_FAMILIARITY',

        questionText:
          'Have you come across numerology before, or is this your first experience with it?',

        primaryTopic,
        secondaryTopics,

        reason:
          'Establish the client’s familiarity with numerology before beginning the personalized discussion.',

        shouldAskQuestion: true,
      }
    }

    if (
      shouldAskPreviousNumerologist(
        familiarityAnswer.clientAnswer
      )
    ) {
      const previousAnswer =
        findAnswer(
          input.currentAnswers,
          'PREVIOUS_NUMEROLOGIST'
        )

      if (!previousAnswer) {
        return {
          stage:
            'NUMEROLOGY_FAMILIARITY',

          source:
            'FIRST_TIME_ORIENTATION',

          questionKey:
            'PREVIOUS_NUMEROLOGIST',

          questionText:
            'Have you consulted a numerologist before?',

          primaryTopic,
          secondaryTopics,

          reason:
            'Clarify whether the client has previously consulted a numerologist.',

          shouldAskQuestion: true,
        }
      }
    }
  }

  /**
   * STEP 2
   *
   * UNDERSTAND TODAY'S CONCERN
   */
  const todayNote =
    input.todayNote.trim()

  const concernAnswered =
    hasAnsweredAny(
      input.currentAnswers,
      [
        'TODAY_NOTE_EXPLORATION',
        'PRIMARY_CONCERN_EXPLORATION',
      ]
    )

  if (!concernAnswered) {
    if (todayNote) {
      return {
        stage:
          'CONCERN_EXPLORATION',

        source:
          primaryTopic
            ? 'CONCERN_AND_NOTE'
            : 'TODAY_NOTE',

        questionKey:
          'TODAY_NOTE_EXPLORATION',

        questionText:
          'Tell me a little more about what you would most like clarity on today.',

        primaryTopic,
        secondaryTopics,

        reason:
          'Understand the client’s current situation before preparing discussion-specific numerology guidance.',

        shouldAskQuestion: true,
      }
    }

    if (primaryTopic) {
      return {
        stage:
          'CONCERN_EXPLORATION',

        source:
          'SELECTED_CONCERN',

        questionKey:
          'PRIMARY_CONCERN_EXPLORATION',

        questionText:
          concernOpeningQuestion(
            primaryTopic
          ),

        primaryTopic,
        secondaryTopics,

        reason:
          'Understand the client’s selected primary concern before preparing the numerology outcome.',

        shouldAskQuestion: true,
      }
    }
  }

  /**
   * STEP 3
   *
   * OPTIONAL CONCERN CLARIFICATION
   *
   * The practitioner determines whether
   * the initial response needs clarification.
   *
   * This avoids unreliable automatic
   * interpretation of multilingual
   * client responses.
   */
  if (
    concernAnswered &&
    input.clarificationNeeded === true
  ) {
    const clarificationAnswer =
      findAnswer(
        input.currentAnswers,
        'CONCERN_CLARIFICATION'
      )

    if (!clarificationAnswer) {
      return {
        stage:
          'CONCERN_CLARIFICATION',

        source:
          'CLIENT_RESPONSE',

        questionKey:
          'CONCERN_CLARIFICATION',

        questionText:
          clarificationQuestion(
            primaryTopic
          ),

        primaryTopic,
        secondaryTopics,

        reason:
          'The practitioner requested additional context before refining the discussion-specific numerology outcome.',

        shouldAskQuestion: true,
      }
    }
  }

  /**
   * STEP 4
   *
   * READY FOR VERIFIED V3 DISCUSSION
   *
   * Client statements remain
   * conversational context only.
   *
   * They never become numerological
   * evidence or modify calculations.
   */
  return {
    stage:
      'READY_FOR_V3',

    source:
      latestMeaningfulSource(input),

    questionKey: null,
    questionText: null,

    primaryTopic,
    secondaryTopics,

    reason:
      'Opening context is available. Prepare a discussion-specific outcome using verified V3 findings and the client’s stated circumstances.',

    shouldAskQuestion: false,
  }
}

/**
 * EXISTING ANSWER HELPERS
 */

function findAnswer(
  answers:
    readonly ConsultationAnswerForIntelligence[],
  questionKey: string
): ConsultationAnswerForIntelligence | null {
  return (
    answers.find(
      (answer) =>
        answer.questionKey ===
        questionKey
    ) || null
  )
}

function hasAnsweredAny(
  answers:
    readonly ConsultationAnswerForIntelligence[],
  questionKeys: readonly string[]
): boolean {
  return answers.some(
    (answer) =>
      questionKeys.includes(
        answer.questionKey
      )
  )
}

/**
 * FIRST CONSULTATION FAMILIARITY
 */

function shouldAskPreviousNumerologist(
  answer: string
): boolean {
  const normalized =
    answer.trim().toLowerCase()

  if (!normalized) {
    return false
  }

  if (
    normalized.startsWith(
      'first time'
    )
  ) {
    return false
  }

  if (
    normalized.startsWith(
      'consultation before'
    )
  ) {
    return false
  }

  return (
    normalized.startsWith(
      'know a little'
    ) ||
    normalized.startsWith(
      'know it quite well'
    )
  )
}

/**
 * TOPIC-SPECIFIC OPENING QUESTIONS
 *
 * Neutral questions only.
 *
 * No assumptions about the client.
 */

function concernOpeningQuestion(
  topic: string
): string {
  switch (
    topic.trim().toLowerCase()
  ) {
    case 'business':
      return 'What is the main business situation you would like clarity about today?'

    case 'career':
      return 'What is the main career situation you would like clarity about today?'

    case 'money':
    case 'money & wealth':
    case 'money and wealth':
      return 'What would you most like to understand about your current money or financial direction?'

    case 'family':
      return 'What part of your family situation would you most like clarity about today?'

    case 'relationship':
    case 'relationships':
      return 'What part of your relationship situation would you most like clarity about today?'

    case 'marriage':
      return 'What would you most like to understand about your marriage or marriage direction?'

    case 'personal_direction':
    case 'personal direction':
      return 'What area of your personal direction feels most important for you to understand today?'

    case 'other':
      return 'What would you most like clarity about today?'

    default:
      return `What would you most like to understand about ${topic} today?`
  }
}

/**
 * TOPIC-SPECIFIC CLARIFICATION
 *
 * Asked only when the practitioner
 * requests clarification.
 *
 * Questions explore practical context
 * without making numerological claims.
 */

function clarificationQuestion(
  topic: string | null
): string {
  switch (
    topic?.trim().toLowerCase()
  ) {
    case 'career':
      return 'Could you explain whether your concern relates mainly to your current job, income, career opportunities, or professional direction?'

    case 'business':
      return 'Is your main concern related to business income, customers, payments, growth, or a particular business decision?'

    case 'money':
    case 'money & wealth':
    case 'money and wealth':
      return 'Is your main financial concern related to income, expenses, delayed payments, savings, or financial commitments?'

    case 'family':
      return 'Is your concern mainly about communication, responsibilities, relationships, or a particular family situation?'

    case 'relationship':
    case 'relationships':
      return 'Is your concern mainly about communication, emotional understanding, trust, or the future direction of the relationship?'

    case 'marriage':
      return 'Is your concern about finding a suitable partner, an existing marriage, family expectations, or another marriage-related situation?'

    case 'personal_direction':
    case 'personal direction':
      return 'Is your main concern related to an important decision, confidence, responsibilities, or uncertainty about your next steps?'

    default:
      return 'Could you explain which part of this situation is most important for us to understand?'
  }
}

/**
 * PRESERVE CONSULTATION CONTEXT
 */

function latestMeaningfulSource(
  input: QuestionIntelligenceInput
): QuestionSource {
  if (
    input.currentAnswers.some(
      (answer) =>
        answer.questionKey ===
        'CONCERN_CLARIFICATION'
    )
  ) {
    return 'CLIENT_RESPONSE'
  }

  if (input.todayNote.trim()) {
    return input.topics.length > 0
      ? 'CONCERN_AND_NOTE'
      : 'TODAY_NOTE'
  }

  if (input.topics.length > 0) {
    return 'SELECTED_CONCERN'
  }

  return 'CLIENT_RESPONSE'
}