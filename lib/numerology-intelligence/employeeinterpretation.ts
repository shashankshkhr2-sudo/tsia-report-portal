import type {
  EmployeeInsight,
} from './employeeoutput'

export const EMPLOYEE_INTERPRETATION_VERSION =
  'TSIA_NUM_V3_EMPLOYEE_INTERPRETATION_1.0'

export type EmployeeInterpretation = {
  id: string
  title: string
  keyPattern: string
  practitionerMeaning: string
  evidenceSummary: string
  explorationFocus: string
  validationQuestion: string
  sourceInsightId: string
  priority: number
}

export type EmployeeInterpretationResult = {
  version: string
  interpretations: EmployeeInterpretation[]
  warnings: string[]
}

export function buildEmployeeInterpretations(
  insights: readonly EmployeeInsight[],
  limit = 5
): EmployeeInterpretationResult {
  const interpretations =
    insights
      .slice(0, limit)
      .map((insight, index) => ({
        id: `EMP_INT_${index + 1}_${insight.id}`,
        title: insight.title,
        keyPattern: insight.statement,

        practitionerMeaning:
          getMeaning(insight),

        evidenceSummary:
          getEvidence(insight),

        explorationFocus:
          getFocus(insight),

        validationQuestion:
          getQuestion(insight),

        sourceInsightId: insight.id,
        priority: insight.priority,
      }))

  return {
    version:
      EMPLOYEE_INTERPRETATION_VERSION,

    interpretations,

    warnings:
      interpretations.length === 0
        ? [
            'No approved employee insights were available.',
          ]
        : [],
  }
}

function getMeaning(
  insight: EmployeeInsight
): string {
  if (insight.relationship === 'COMPLEMENT') {
    return 'These qualities may work together. Explore how they operate together in real situations.'
  }

  if (insight.relationship === 'CONTEXTUALIZE') {
    return 'This pattern should be understood in context. Explore when and where it becomes visible.'
  }

  if (insight.relationship === 'TENSION') {
    return 'The evidence indicates a possible tension. Explore how the client experiences or manages it.'
  }

  if (insight.strength === 'STRONGLY_SUPPORTED') {
    return 'This is a strongly supported numerological pattern. Validate how it appears in the client’s real experience.'
  }

  if (insight.strength === 'SUPPORTED') {
    return 'This pattern is supported by verified numerological evidence. Explore how it appears in real experience.'
  }

  if (insight.strength === 'CONTEXT_DEPENDENT') {
    return 'This pattern is context-dependent. Explore the situations in which the client recognizes it.'
  }

  return 'Use this as a numerology-led hypothesis and validate its practical expression through conversation.'
}

function getEvidence(
  insight: EmployeeInsight
): string {
  const parts: string[] = []

  if (insight.strength) {
    parts.push(
      `Evidence: ${clean(insight.strength)}`
    )
  }

  if (insight.relationship) {
    parts.push(
      `Resolution: ${clean(insight.relationship)}`
    )
  }

  if (insight.developmentSignificance) {
    parts.push(
      `Development: ${clean(
        insight.developmentSignificance
      )}`
    )
  }

  return parts.length
    ? parts.join(' · ')
    : 'Verified V3 insight'
}

function getFocus(
  insight: EmployeeInsight
): string {
  if (insight.relationship === 'TENSION') {
    return 'Ask for a recent example where different tendencies pulled the client in different directions.'
  }

  if (insight.relationship === 'COMPLEMENT') {
    return 'Explore situations where these qualities support each other.'
  }

  if (insight.relationship === 'CONTEXTUALIZE') {
    return 'Identify situations where this pattern becomes stronger or weaker.'
  }

  return 'Ask for a concrete recent example rather than simply asking the client to agree with the description.'
}

function getQuestion(
  insight: EmployeeInsight
): string {
  if (insight.relationship === 'TENSION') {
    return 'Can you think of a recent situation where you felt two different ways of responding pulling you in different directions?'
  }

  if (insight.relationship === 'COMPLEMENT') {
    return 'Can you think of a recent situation where these two sides of your approach worked well together?'
  }

  if (insight.relationship === 'CONTEXTUALIZE') {
    return 'In what kinds of situations do you notice this pattern most clearly?'
  }

  return `When you think about ${insight.statement.toLowerCase()}, can you share a recent real example where you noticed this in yourself?`
}

function clean(
  value: string
): string {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase()
    )
}