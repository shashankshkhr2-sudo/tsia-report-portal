export type QuestionStage =
  | 'NUMEROLOGY_FAMILIARITY'
  | 'CONCERN_EXPLORATION'
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

  /*
   * Keep topics in their original selected order.
   * topics[0] is the Primary Topic.
   */
  topics: readonly string[]

  /*
   * Free-text note entered while starting
   * today's consultation.
   */
  todayNote: string

  /*
   * Questions already answered during the
   * current consultation.
   */
  currentAnswers:
    readonly ConsultationAnswerForIntelligence[]
}

export type QuestionIntelligenceDecision = {
  stage: QuestionStage
  source: QuestionSource

  questionKey: string | null
  questionText: string | null

  primaryTopic: string | null
  secondaryTopics: readonly string[]

  reason: string

  /*
   * false means the orientation/concern
   * discovery layer has enough information
   * and the consultation may move to V3.
   */
  shouldAskQuestion: boolean
}

/*
 * Question Asking Intelligence
 *
 * Responsibilities:
 *
 * 1. First consultation:
 *    establish previous numerology exposure.
 *
 * 2. Use the client's selected concern as
 *    the normal consultation direction.
 *
 * 3. If today's note gives a more specific
 *    or different reason, allow that context
 *    to direct the conversation.
 *
 * 4. Do NOT modify the client's selected
 *    primary topic.
 *
 * 5. Do NOT create or modify V3 findings.
 *
 * 6. Do NOT treat client statements as
 *    numerological evidence.
 */
export function decideNextQuestion(
  input: QuestionIntelligenceInput
): QuestionIntelligenceDecision {
  const primaryTopic =
    input.topics[0] || null

  const secondaryTopics =
    input.topics.slice(1)

  /*
   * FIRST CONSULTATION
   *
   * We only establish the client's previous
   * exposure to numerology.
   *
   * These questions are NOT used to decide
   * the client's consultation concern.
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
          'This is the first TSIA consultation. Establish the client’s familiarity with numerology before beginning personalized discussion.',

        shouldAskQuestion: true,
      }
    }

    /*
     * If the first answer indicates previous
     * numerology exposure, establish whether
     * the client has actually consulted a
     * numerologist before.
     *
     * We intentionally do not ask this when
     * the client clearly says this is their
     * first experience.
     */
    if (
      indicatesPreviousExposure(
        familiarityAnswer.clientAnswer
      )
    ) {
      const previousConsultationAnswer =
        findAnswer(
          input.currentAnswers,
          'PREVIOUS_NUMEROLOGIST'
        )

      if (!previousConsultationAnswer) {
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
            'The client has previous exposure to numerology. Establish whether that exposure included an earlier numerology consultation.',

          shouldAskQuestion: true,
        }
      }
    }
  }

  /*
   * CONCERN EXPLORATION
   *
   * Today's note is valuable because the
   * employee/client may have entered a more
   * specific reason than the broad selected
   * topic.
   *
   * The note does NOT overwrite the stored
   * primary topic.
   */
  const todayNote =
    input.todayNote.trim()

  const concernQuestionAlreadyAsked =
    hasAnsweredAny(
      input.currentAnswers,
      [
        'TODAY_NOTE_EXPLORATION',
        'PRIMARY_CONCERN_EXPLORATION',
      ]
    )

  if (!concernQuestionAlreadyAsked) {
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

        /*
         * We deliberately do not insert the
         * note verbatim into the question.
         *
         * The note may contain sensitive,
         * awkward or employee-written text.
         * A later controlled question
         * generator can use its meaning.
         */
        questionText:
          'Tell me a little more about what you would most like clarity on today.',

        primaryTopic,
        secondaryTopics,

        reason:
          primaryTopic
            ? `The client selected ${primaryTopic} as the primary topic and also provided a specific note for today. Explore the stated situation before selecting relevant V3 intelligence.`
            : 'The client provided a specific note for today. Understand that situation before selecting relevant V3 intelligence.',

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
          `The client selected ${primaryTopic} as the primary consultation topic. Begin with that concern before selecting relevant V3 intelligence.`,

        shouldAskQuestion: true,
      }
    }
  }

  /*
   * At this point:
   *
   * - first-time numerology orientation has
   *   been completed where required; and
   *
   * - the client's current concern has been
   *   explored.
   *
   * The next layer may now select relevant
   * verified V3 intelligence.
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
      'Sufficient opening context has been collected. Continue with relevant verified V3 intelligence while preserving the client’s selected concern and stated context.',

    shouldAskQuestion: false,
  }
}

function findAnswer(
  answers:
    readonly ConsultationAnswerForIntelligence[],
  questionKey: string
) {
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
) {
  return answers.some((answer) =>
    questionKeys.includes(
      answer.questionKey
    )
  )
}

/*
 * This is intentionally conservative.
 *
 * The UI currently contains structured
 * familiarity options. We only need to
 * distinguish an explicit "first time"
 * response from previous exposure.
 *
 * Later we should pass the structured option
 * key directly rather than interpreting
 * display text.
 */
function indicatesPreviousExposure(
  answer: string
) {
  const normalized =
    answer.trim().toLowerCase()

  if (!normalized) {
    return false
  }

  return ![
    'first time',
    'first-time',
    'never',
    'no',
  ].includes(normalized)
}

/*
 * Approved concern-opening questions.
 *
 * These are intentionally neutral.
 * They do not tell the client what
 * numerology supposedly says about them.
 */
function concernOpeningQuestion(
  topic: string
) {
  switch (
    topic.trim().toLowerCase()
  ) {
    case 'business':
      return 'What is the main business situation you would like clarity about today?'

    case 'career':
      return 'What is the main career situation you would like clarity about today?'

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

    case 'personal direction':
      return 'What area of your personal direction feels most important for you to understand today?'

    default:
      return `What would you most like to understand about ${topic} today?`
  }
}

function latestMeaningfulSource(
  input: QuestionIntelligenceInput
): QuestionSource {
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