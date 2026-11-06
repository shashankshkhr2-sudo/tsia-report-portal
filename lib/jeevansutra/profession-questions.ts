export const WORK_TYPES = [
  { id: "job", label: "Job / Salaried employment", workQuestion: "What field do you work in?", roleQuestion: "What is your current role or designation?" },
  { id: "business", label: "Business / Self-employed", workQuestion: "What business do you run or plan to start?", roleQuestion: "What is your role, and is the business planned, new or established?" },
  { id: "freelance", label: "Consultant / Freelancer", workQuestion: "What services do you offer?", roleQuestion: "What kind of clients or projects do you work with?" },
  { id: "student", label: "Student / Looking for my first job", workQuestion: "What are you studying, or what qualifications do you have?", roleQuestion: "Which work areas would you like to explore?" },
  { id: "returning", label: "Career break / Returning to work", workQuestion: "What work have you done previously?", roleQuestion: "What kind of role would you like now?" },
  { id: "other", label: "Other", workQuestion: "Tell us about your current work situation.", roleQuestion: "What responsibilities or activities are important to you?" }
] as const

export type WorkTypeId = typeof WORK_TYPES[number]["id"]

export const ONE_YEAR_GOALS = [
  { id: "grow_role", label: "Grow in my current role" },
  { id: "better_job", label: "Find a better job" },
  { id: "income", label: "Increase my income" },
  { id: "business", label: "Start or grow my business" },
  { id: "change", label: "Change my profession" },
  { id: "start_return", label: "Start or return to work" },
  { id: "balance", label: "Have more stability and work-life balance" },
  { id: "unsure", label: "I am not sure yet" }
] as const

export type OneYearGoalId = typeof ONE_YEAR_GOALS[number]["id"]

export const PROFESSION_QUESTION_COPY = {
  introduction: "Now let us connect this reading with your working life.",
  workType: "Which best describes your current work situation?",
  selectionHelp: "Choose more than one if needed.",
  goal: "Where would you like to be in your work or career one year from now?",
  goalDetail: "Tell us what progress would mean to you. (Optional)",
  obstacle: "What is making it difficult to move towards this goal?",
  unsureObstacle: "What feels unclear or difficult about your next work or career step?"
} as const

// These answers belong to the later guidance stage.
// They must not change the initial name-and-DOB reading.
export type ProfessionWorkAnswers = {
  workTypes: WorkTypeId[]
  details: Partial<Record<WorkTypeId, { work: string; role: string }>>
  goals: OneYearGoalId[]
  goalDetail: string
  obstacle: string
}
