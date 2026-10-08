/**
 * TSIA QUESTION INTELLIGENCE
 *
 * Version 1.2
 *
 * Development Rule 001:
 * SIMPLE • FAST • SAFE • RELIABLE
 *
 * This module:
 *
 * 1. Handles first-consultation orientation.
 * 2. Understands the client's concern.
 * 3. Supports practitioner-controlled clarification.
 * 4. Preserves the selected consultation topics.
 * 5. Keeps client answers separate from V3 evidence.
 *
 * This module does not modify:
 *
 * - V2 calculations
 * - V3 conclusions
 * - Numerological evidence
 * - Approved numerology methodology
 */

export const QUESTION_INTELLIGENCE_VERSION =
  'TSIA_QUESTION_INTELLIGENCE_1.2' as const

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
   * Optional for backward compatibility.
   *
   * true:
   * Practitioner requests one clarification.
   *
   * false or undefined:
   * Proceed without additional clarification.
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
 * MAIN QUESTION DECISION ENGINE
 */

export function decideNextQuestion(
  input: QuestionIntelligenceInput
): QuestionIntelligenceDecision {
  const primaryTopic =
    input.topics[0] || null

  const secondaryTopics =
    input.topics.slice(1)

  /**
   * STEP 1:
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
        stage: 'NUMEROLOGY_FAMILIARITY',

        source: 'FIRST_TIME_ORIENTATION',

        questionKey: 'NUMEROLOGY_FAMILIARITY',

        questionText:
          'Have you come across numerology before, or is this your first experience with it?',

        primaryTopic,

        secondaryTopics,

        reason:
          'Establish the client’s familiarity with numerology before beginning personalized discussion.',

        shouldAskQuestion: true,
      }
    }

    /**
     * Ask about previous consultation
     * only when familiarity does not
     * establish previous experience.
     */

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
          stage: 'NUMEROLOGY_FAMILIARITY',

          source: 'FIRST_TIME_ORIENTATION',

          questionKey: 'PREVIOUS_NUMEROLOGIST',

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
   * STEP 2:
   * INITIAL CONCERN EXPLORATION
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
    /**
     * Today's note can guide the
     * opening question without
     * changing the primary topic.
     */

    if (todayNote) {
      return {
        stage: 'CONCERN_EXPLORATION',

        source: primaryTopic
          ? 'CONCERN_AND_NOTE'
          : 'TODAY_NOTE',

        questionKey: 'TODAY_NOTE_EXPLORATION',

        questionText:
          'Tell me a little more about what you would most like clarity on today.',

        primaryTopic,

        secondaryTopics,

        reason:
          'Understand the client’s current situation before preparing discussion-specific numerology guidance.',

        shouldAskQuestion: true,
      }
    }

    /**
     * No note:
     * use the selected primary topic.
     */

    if (primaryTopic) {
      return {
        stage: 'CONCERN_EXPLORATION',

        source: 'SELECTED_CONCERN',

        questionKey:
          'PRIMARY_CONCERN_EXPLORATION',

        questionText:
          concernOpeningQuestion(primaryTopic),

        primaryTopic,

        secondaryTopics,

        reason:
          'Understand the client’s selected concern before preparing the numerology outcome.',

        shouldAskQuestion: true,
      }
    }

    /**
     * No topic or note:
     * ask a general opening question.
     */

    return {
      stage: 'CONCERN_EXPLORATION',

      source: 'CLIENT_RESPONSE',

      questionKey:
        'PRIMARY_CONCERN_EXPLORATION',

      questionText:
        'What would you most like clarity about today?',

      primaryTopic,

      secondaryTopics,

      reason:
        'Establish the client’s main concern before continuing.',

      shouldAskQuestion: true,
    }
  }

  /**
   * STEP 3:
   * OPTIONAL CLARIFICATION
   *
   * This is practitioner-controlled.
   *
   * No keyword-based assumptions
   * are made about client responses.
   */

  if (input.clarificationNeeded === true) {
    const clarificationAnswer =
      findAnswer(
        input.currentAnswers,
        'CONCERN_CLARIFICATION'
      )

    if (!clarificationAnswer) {
      return {
        stage: 'CONCERN_CLARIFICATION',

        source: 'CLIENT_RESPONSE',

        questionKey:
          'CONCERN_CLARIFICATION',

        questionText:
          clarificationQuestion(primaryTopic),

        primaryTopic,

        secondaryTopics,

        reason:
          'The practitioner requested additional context before refining the discussion-specific numerology outcome.',

        shouldAskQuestion: true,
      }
    }
  }

  /**
   * STEP 4:
   * READY FOR VERIFIED V3
   *
   * Client statements remain
   * consultation context only.
   *
   * They never become
   * numerological evidence.
   */

  return {
    stage: 'READY_FOR_V3',

    source:
      latestMeaningfulSource(input),

    questionKey: null,

    questionText: null,

    primaryTopic,

    secondaryTopics,

    reason:
      'Opening context is available. Continue with discussion-specific guidance using verified V3 findings.',

    shouldAskQuestion: false,
  }
}

/**
 * FIND ANSWER
 */

function findAnswer(
  answers:
    readonly ConsultationAnswerForIntelligence[],
  questionKey: string
): ConsultationAnswerForIntelligence | null {
  return (
    answers.find(
      (answer) =>
        answer.questionKey === questionKey &&
        answer.clientAnswer.trim().length > 0
    ) || null
  )
}

/**
 * CHECK EXISTING ANSWERS
 */

function hasAnsweredAny(
  answers:
    readonly ConsultationAnswerForIntelligence[],
  questionKeys: readonly string[]
): boolean {
  return answers.some(
    (answer) =>
      questionKeys.includes(
        answer.questionKey
      ) &&
      answer.clientAnswer.trim().length > 0
  )
}

/**
 * PREVIOUS NUMEROLOGIST QUESTION
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
    normalized.startsWith('first time')
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

  if (
    normalized.startsWith('know a little') ||
    normalized.startsWith('know it quite well')
  ) {
    return true
  }

  return false
}

/**
 * INITIAL TOPIC QUESTIONS
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
 * Questions are neutral.
 *
 * They do not assume that
 * numerology has established
 * the cause of a problem.
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
 * CONSULTATION CONTEXT SOURCE
 */

function latestMeaningfulSource(
  input: QuestionIntelligenceInput
): QuestionSource {
  const clarification =
    findAnswer(
      input.currentAnswers,
      'CONCERN_CLARIFICATION'
    )

  if (clarification) {
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