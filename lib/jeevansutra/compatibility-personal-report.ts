import "server-only"
import { PERSONAL_COMPATIBILITY_REPORT_VERSION, type PersonalCompatibilityReport } from "./compatibility-personal-report-contract"
import { buildPersonalCompatibilityEvidence, type PersonalCompatibilityInput } from "./compatibility-personal-evidence"
import { buildPersonalPortrait } from "./compatibility-personal-portrait"
import { buildPersonalInteractions } from "./compatibility-personal-interactions"
import { buildPersonalSharedPotential } from "./compatibility-personal-potential"

// Review implementation only. Do not connect to customer saves until coverage is complete.
export function buildPersonalMarriageReview(input: PersonalCompatibilityInput) {
  if (input.kind !== "Love & Marriage" || input.relationship !== "Considering marriage") {
    throw new Error("This review builder currently supports Considering marriage only.")
  }
  const facts = buildPersonalCompatibilityEvidence(input)
  const first = buildPersonalPortrait(facts.individuals[0])
  const second = buildPersonalPortrait(facts.individuals[1])
  const paired = buildPersonalInteractions(facts.individuals[0], facts.individuals[1])
  const potential = buildPersonalSharedPotential(facts)
  function matchFor(role: "mulank" | "bhagyank" | "name") {
    const refs = paired.evidence.references.filter(ref => ref.role === role)
    const row = refs.length === 1
      ? paired.interactions.find(item => item.id === refs[0].interactionId)
      : undefined
    if (!row) throw new Error("This pairing requires additional interpretation rules before a review report can be generated.")
    return { row, ref: refs[0] }
  }
  const everyday = matchFor("mulank")
  const priorities = matchFor("bhagyank")
  const expression = matchFor("name")
  const marriageExamples: Record<string, string> = {
    "closeness-and-flexibility": "When considering marriage, explore this through how you would balance time together, personal interests and changes to shared plans.",
    "reflection-and-discussion": "For a sensitive marriage discussion, such as family involvement, distinguish a request for thinking time from a refusal to discuss the issue.",
    "conviction-and-choice": "A decision about where to live or how to support both careers gives you a concrete way to explore this difference before making a commitment.",
  }
  const interactions = paired.interactions.map(row => marriageExamples[row.id] ? { ...row, betweenYou: row.betweenYou + " " + marriageExamples[row.id] } : row)
  const priorityThemes = [
    "", "having a say in big decisions", "finding a choice both people feel comfortable with",
    "making time to learn or pursue an interest", "knowing how a plan will work",
    "keeping some choices open", "being there for family and other people who depend on you",
    "having time to think a decision through", "choosing commitments you can keep",
    "knowing why a goal matters",
  ] as const
  const firstPriority = priorityThemes[priorities.ref.firstNumber]
  const secondPriority = priorityThemes[priorities.ref.secondNumber]
  if (!firstPriority || !secondPriority) throw new Error("Missing marriage priority wording.")
  const connection = firstPriority === secondPriority
    ? `You may both value ${firstPriority}. Before marriage, each of you could give a real example of what that would look like in your home. Your answers may reveal where you already agree.`
    : `${first.portrait.name} may value ${firstPriority}. For ${second.portrait.name}, ${secondPriority} may matter. Pick one decision ahead of you and see whether you can find an option that respects both wishes.`
  const questions = [
    "", "When a decision affects both of us, what should we check with each other before saying yes?",
    "If one of us is disappointed by a change of plan, how would we like to hear about it?",
    "When one of us brings up a new idea, how can we tell whether we are just talking or actually agreeing?",
    "Before we book something or spend money together, which details do we both want settled?",
    "If a new opportunity changes our plans, which promises do we want to keep?",
    "If a family member needs regular help, what can each of us realistically offer?",
    "If one of us needs time to think about a difficult subject, when will we come back to it?",
    "During a busy week, how will we share the work and notice when one of us needs help?",
    "When we disagree about something important, how can each of us explain why it matters?",
  ] as const
  // Pick the topic independently of who was entered first.
  const topics = [everyday.ref.firstNumber, everyday.ref.secondNumber].sort((a, b) => a - b)
  const discussion = topics[0] === topics[1]
    ? questions[topics[0]]
    : `Think of a recent example of “${everyday.row.area}”. What mattered most to each of you that day, and what would you ask each other to do next time?`
  if (!discussion) throw new Error("Missing marriage discussion question.")
  const report: PersonalCompatibilityReport = {
    version: PERSONAL_COMPATIBILITY_REPORT_VERSION,
    kind: input.kind,
    relationship: input.relationship,
    people: [first.portrait, second.portrait],
    connection: {
      title: "Jeevan Sutra — Understand each other a little better, build a stronger bond.",
      description: "Before marriage, it helps to talk about the life you want to share. Use this reading to compare what matters to each of you, then try the discussion question together.",
    },
    interactions,
    sharedPotential: potential.items,
    conclusion: {
      strongestConnection: connection,
      mainDifference: discussion,
      firstNextStep: expression.row.firstAdjustment,
      secondNextStep: expression.row.secondAdjustment,
    },
    limitation: "A traditional numerology interpretation for reflection, not a verified personality assessment or a prediction of marriage, property or financial outcomes. Your experience of each other remains essential.",
  }
  return {
    report,
    privateEvidence: {
      facts,
      portraitRules: [first.evidence, second.evidence],
      interactionRules: paired.evidence,
      potentialRules: potential.evidence,
      editorialRules: {
        contextVersion: "JS_MARRIAGE_CONTEXT_2_DRAFT",
        strongestConnection: priorities.ref.ruleId,
        mainDifference: everyday.ref.ruleId,
      },
    },
    reviewOnly: true as const,
  }
}
