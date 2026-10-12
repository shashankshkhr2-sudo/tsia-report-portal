export const guidanceTopics = ['career', 'business', 'money', 'family', 'personal_direction'] as const
export type GuidanceTopic = typeof guidanceTopics[number]
export const professionalSituations = ['student', 'job_seeker', 'employee', 'freelancer', 'business_owner', 'career_break', 'retired_active'] as const
export type Intake = Record<string, string>
export type Question = { id: string; label: string; options?: readonly string[]; optional?: boolean; help?: string }
export function questionsFor(topic: GuidanceTopic, answers: Intake): Question[] {
  const professional = ['career', 'business', 'money'].includes(topic)
  const questions: Question[] = professional ? [
    { id: 'situation', label: 'What is your current professional situation?', options: professionalSituations },
    { id: 'work', label: 'What work do you do, or want to do?' },
  ] : [{ id: 'situation', label: 'What would you like support with?', options: ['family_communication', 'responsibilities', 'retirement_transition', 'purpose_and_interests', 'personal_decision', 'other'] }]
  if (answers.situation === 'business_owner') questions.push(
    { id: 'businessStage', label: 'Which stage is your business at?', options: ['planning', 'new', 'established', 'expanding', 'difficult_period'] },
    { id: 'teamSize', label: 'How many people work in your business, including you?', options: ['only_me', '2_to_5', '6_to_20', '21_to_50', 'over_50'] },
  )
  questions.push({ id: 'goal', label: professional ? 'What would you like to achieve in the next 2–3 years?' : 'What would you most like to improve?' })
  if (['employee', 'freelancer', 'business_owner'].includes(answers.situation)) questions.push({
    id: 'incomeGoal', optional: true,
    label: answers.situation === 'employee' ? 'What annual salary would you like to work towards in 2–3 years? (Optional)' : 'What personal annual income would you like to work towards in 2–3 years? (Optional)',
    help: answers.situation === 'employee' ? 'Specify CTC or take-home. This is your aspiration, not a prediction.' : 'Personal income is different from business turnover. You can skip this question.',
  })
  questions.push({ id: 'obstacle', label: 'What is the biggest obstacle or concern today?' })
  return questions
}
export function validateIntake(topic: GuidanceTopic, raw: unknown): Intake {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Please complete the guidance questions.')
  const source = raw as Record<string, unknown>
  const answers: Intake = {}
  for (const id of ['situation', 'work', 'businessStage', 'teamSize', 'goal', 'incomeGoal', 'obstacle']) {
    if (source[id] !== undefined && typeof source[id] !== 'string') throw new Error('Invalid answer.')
    const value = String(source[id] || '').trim()
    if (value.length > 800) throw new Error('Please keep each answer within 800 characters.')
    answers[id] = value
  }
  const selected = questionsFor(topic, answers)
  for (const question of selected) {
    const value = answers[question.id]
    if (!question.optional && !value) throw new Error('Please complete the required questions.')
    if (question.options && !question.options.includes(value)) throw new Error('Please choose a valid option.')
  }
  return Object.fromEntries(selected.map(question => [question.id, answers[question.id]]))
}
export function describeIntake(answers: Intake): string {
  return Object.entries(answers).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join('\n')
}
