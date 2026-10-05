import type {
  EmployeeInsight,
} from './employeeoutput'

export const
  EMPLOYEE_INTERPRETATION_VERSION =
    'TSIA_NUM_V3_EMPLOYEE_INTERPRETATION_1.0'

export type
  EmployeeInterpretation = {
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

export type
  EmployeeInterpretationResult = {
    version: string
    interpretations:
      readonly EmployeeInterpretation[]
    warnings: readonly string[]
  }

export function
buildEmployeeInterpretations(
  insights:
    readonly EmployeeInsight[],
  limit = 5
): EmployeeInterpretationResult {
  const interpretations =
    insights
      .slice(0, limit)
      .map(
        (
          insight,
          index
        ): EmployeeInterpretation =>
          buildInterpretation(
            insight,
            index
          )
      )

  return {
    version:
      EMPLOYEE_INTERPRETATION_VERSION,

    interpretations,

    warnings:
      interpretations.length === 0
        ? [
            'No approved employee insights were available for interpretation.',
          ]
        : [],
  }
}

function buildInterpretation(
  insight: EmployeeInsight,
  index: number
): EmployeeInterpretation {
  return {
    id:
      `EMP_INT_${index + 1}_${insight.id}`,

    title:
      insight.title,

    keyPattern:
      insight.statement,

    practitionerMeaning:
      buildPractitionerMeaning(
        insight
      ),

    evidenceSummary:
      buildEvidenceSummary(
        insight
      ),

    explorationFocus:
      buildExplorationFocus(
        insight
      ),

    validationQuestion:
      buildValidationQuestion(
        insight
      ),

    sourceInsightId:
      insight.id,

    priority:
      insight.priority,
  }
}

function buildPractitionerMeaning(
  insight: EmployeeInsight
): string {
  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return (
      'These qualities may work together ' +
      'as complementary parts of the ' +
      'client’s pattern. Explore how they ' +
      'operate together in real situations.'
    )
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return (
      'This pattern should be understood ' +
      'in context rather than treated as ' +
      'a fixed trait. Explore when and ' +
      'where it becomes most visible.'
    )
  }

  if (
    insight.relationship ===
    'TENSION'
  ) {
    return (
      'The verified evidence indicates a ' +
      'possible tension between qualities. ' +
      'Explore how the client experiences ' +
      'or manages this contrast.'
    )
  }

  if (
    insight.strength ===
    'STRONGLY_SUPPORTED'
  ) {
    return (
      'This is a strongly supported ' +
      'numerological pattern. Treat it as ' +
      'an important hypothesis to explore ' +
      'with the client, not as a claimed ' +
      'life event or guaranteed behaviour.'
    )
  }

  if (
    insight.strength ===
    'SUPPORTED'
  ) {
    return (
      'This pattern is supported by the ' +
      'verified numerological evidence. ' +
      'Explore how it appears in the ' +
      'client’s actual experience.'
    )
  }

  if (
    insight.strength ===
    'CONTEXT_DEPENDENT'
  ) {
    return (
      'The pattern is context-dependent. ' +
      'Do not present it as universally ' +
      'true; identify the situations in ' +
      'which the client recognizes it.'
    )
  }

  return (
    'Use this as a numerology-led ' +
    'hypothesis and validate its practical ' +
    'expression through conversation.'
  )
}

function buildEvidenceSummary(
  insight: EmployeeInsight
): string {
  const parts: string[] = []

  if (insight.strength) {
    parts.push(
      `Evidence: ${humanize(
        insight.strength
      )}`
    )
  }

  if (insight.relationship) {
    parts.push(
      `Resolution: ${humanize(
        insight.relationship
      )}`
    )
  }

  if (
    insight.developmentSignificance
  ) {
    parts.push(
      `Development significance: ${humanize(
        insight
          .developmentSignificance
      )}`
    )
  }

  return parts.length > 0
    ? parts.join(' · ')
    : 'Verified V3 employee insight'
}

function buildExplorationFocus(
  insight: EmployeeInsight
): string {
  if (
    insight.relationship ===
    'TENSION'
  ) {
    return (
      'Ask for a recent example where the ' +
      'two tendencies pulled the client in ' +
      'different directions. Focus on how ' +
      'the client responded.'
    )
  }

  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return (
      'Explore situations where these ' +
      'qualities support each other and ' +
      'help the client respond effectively.'
    )
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return (
      'Identify the situations, people, or ' +
      'types of decisions in which this ' +
      'pattern becomes stronger or weaker.'
    )
  }

  return (
    'Ask for a concrete recent example ' +
    'rather than asking the client simply ' +
    'to agree or disagree with the label.'
  )
}

function buildValidationQuestion(
  insight: EmployeeInsight
): string {
  const pattern =
    insight.statement
      .trim()
      .toLowerCase()

  if (
    insight.relationship ===
    'TENSION'
  ) {
    return (
      'Can you think of a recent situation ' +
      'where you felt two different ways ' +
      'of responding pulling you in ' +
      'different directions?'
    )
  }

  if (
    insight.relationship ===
    'COMPLEMENT'
  ) {
    return (
      'Can you think of a recent situation ' +
      'where these two sides of your ' +
      'approach worked well together?'
    )
  }

  if (
    insight.relationship ===
    'CONTEXTUALIZE'
  ) {
    return (
      'In what kinds of situations do you ' +
      'notice this pattern most clearly, ' +
      'and when does it feel less relevant?'
    )
  }

  return (
    `When you think about ${pattern}, ` +
    'can you share a recent real example ' +
    'where you noticed this in yourself?'
  )
}

function humanize(
  value: string
): string {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}