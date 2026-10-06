export type OpeningObjective =
  | 'ORIENT'
  | 'FOLLOW_UP'
  | 'CONTINUE_UNDERSTANDING'
  | 'EXPLORE_DIFFERENCE'
  | 'TODAYS_CONCERN'
  | 'RECONNECT'

export type OpeningSource =
  | 'FIRST_CONSULTATION'
  | 'PREVIOUS_FOLLOW_UP'
  | 'IMPORTANT_HISTORY'
  | 'TODAYS_CONCERN'
  | 'PREVIOUS_CONSULTATION'
  | 'GENERAL_INTELLIGENCE'

export type OpeningHistoryAnswer = {
  questionText: string
  clientAnswer: string
  employeeObservation: string | null
  importantForNextConsultation: boolean
}

export type OpeningPreviousConsultation = {
  consultationNumber: number
  specificConcern: string | null
  mainConcernSummary: string | null
  guidanceSummary: string | null
  outcome: string | null
  followUpRequired: boolean
  answers: readonly OpeningHistoryAnswer[]
}

export type OpeningIntelligenceInput = {
  consultationNumber: number
  purpose: string
  topics: readonly string[]
  todayNote: string

  previousConsultation:
    | OpeningPreviousConsultation
    | null

  importantEarlierAnswers:
    readonly OpeningHistoryAnswer[]
}

export type OpeningIntelligenceDecision = {
  objective: OpeningObjective
  source: OpeningSource
  reason: string
  shouldAskFamiliarityQuestion: boolean
  relevantPreviousAnswer:
    | OpeningHistoryAnswer
    | null
}

/*
 * This layer decides HOW the consultation
 * should begin.
 *
 * It does not create numerology findings.
 * It does not change V3 evidence.
 * It does not infer client facts.
 */
export function decideOpeningIntelligence(
  input: OpeningIntelligenceInput
): OpeningIntelligenceDecision {
  /*
   * CONSULTATION #1
   *
   * No previous client understanding exists
   * yet, so begin with orientation.
   */
  if (input.consultationNumber <= 1) {
    return {
      objective: 'ORIENT',
      source: 'FIRST_CONSULTATION',

      reason:
        'This is the first consultation. Establish the client’s familiarity with numerology before beginning personalized interpretation.',

      shouldAskFamiliarityQuestion: true,

      relevantPreviousAnswer: null,
    }
  }

  const previous =
    input.previousConsultation

  /*
   * Priority 1:
   * Explicit unfinished follow-up from the
   * immediately previous consultation.
   */
  if (
    previous?.followUpRequired
  ) {
    return {
      objective: 'FOLLOW_UP',
      source: 'PREVIOUS_FOLLOW_UP',

      reason:
        'The previous consultation was marked for follow-up. Reconnect with that matter before moving to new material.',

      shouldAskFamiliarityQuestion: false,

      relevantPreviousAnswer:
        findImportantAnswer(
          previous.answers
        ),
    }
  }

  /*
   * Priority 2:
   * Important information from the previous
   * consultation.
   */
  const importantPrevious =
    previous
      ? findImportantAnswer(
          previous.answers
        )
      : null

  if (importantPrevious) {
    return {
      objective:
        'CONTINUE_UNDERSTANDING',

      source:
        'IMPORTANT_HISTORY',

      reason:
        'An important client response from the previous consultation should be considered before starting a new line of discussion.',

      shouldAskFamiliarityQuestion: false,

      relevantPreviousAnswer:
        importantPrevious,
    }
  }

  /*
   * Priority 3:
   * Important information from an older
   * consultation that was deliberately
   * retained for future use.
   */
  const importantEarlier =
    input.importantEarlierAnswers[0] ||
    null

  if (importantEarlier) {
    return {
      objective:
        'CONTINUE_UNDERSTANDING',

      source:
        'IMPORTANT_HISTORY',

      reason:
        'An earlier client response was specifically retained for future consultation and remains relevant consultation context.',

      shouldAskFamiliarityQuestion: false,

      relevantPreviousAnswer:
        importantEarlier,
    }
  }

  /*
   * Priority 4:
   * The client has arrived with a specific
   * concern today.
   */
  if (input.todayNote.trim()) {
    return {
      objective:
        'TODAYS_CONCERN',

      source:
        'TODAYS_CONCERN',

      reason:
        'The client has stated a specific concern for today. Begin by understanding that concern before selecting relevant numerological intelligence.',

      shouldAskFamiliarityQuestion: false,

      relevantPreviousAnswer: null,
    }
  }

  /*
   * Priority 5:
   * A previous consultation exists, but
   * nothing has been explicitly marked as
   * unfinished or important.
   */
  if (previous) {
    return {
      objective: 'RECONNECT',

      source:
        'PREVIOUS_CONSULTATION',

      reason:
        'A previous consultation exists. Reconnect with the client’s earlier discussion before moving into new numerological intelligence.',

      shouldAskFamiliarityQuestion: false,

      relevantPreviousAnswer:
        mostRecentAnswer(
          previous.answers
        ),
    }
  }

  /*
   * Safety fallback.
   *
   * This should be uncommon because a
   * consultation number above 1 normally
   * implies prior history.
   */
  return {
    objective: 'RECONNECT',

    source:
      'GENERAL_INTELLIGENCE',

    reason:
      'No usable previous consultation context was found. Begin neutrally and then move into relevant verified numerological intelligence.',

    shouldAskFamiliarityQuestion: false,

    relevantPreviousAnswer: null,
  }
}

function findImportantAnswer(
  answers: readonly OpeningHistoryAnswer[]
) {
  return (
    answers.find(
      (answer) =>
        answer
          .importantForNextConsultation
    ) || null
  )
}

function mostRecentAnswer(
  answers: readonly OpeningHistoryAnswer[]
) {
  if (answers.length === 0) {
    return null
  }

  return answers[
    answers.length - 1
  ]
}