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
  const numbers = [
    { title: "Mulank · Everyday swabhav", match: everyday },
    { title: "Bhagyank · Direction in life", match: priorities },
    { title: "Communication Number · How you express yourself", match: expression },
  ].map(({ title, match }) => ({
    title,
    firstNumber: match.ref.firstNumber,
    secondNumber: match.ref.secondNumber,
    firstPerspective: match.row.firstPerspective,
    secondPerspective: match.row.secondPerspective,
    betweenYou: match.row.betweenYou,
  }))

  // Both people get the same question when a quality calls for their own answer.
  // Keep individual preferences attached to the person, regardless of input order.
  function askBoth(title: string, question: string, betweenYou: string) {
    return { title, firstPerspective: question, secondPerspective: question, betweenYou }
  }

  function comparePair(
    title: string,
    row: { firstPerspective: string; secondPerspective: string },
    betweenYou: string,
  ) {
    return {
      title,
      firstPerspective: row.firstPerspective,
      secondPerspective: row.secondPerspective,
      betweenYou,
    }
  }

  const characteristics = [
    askBoth("Temper and patience",
      "Think of the last time you lost patience. What did you do, and what helped you settle?",
      "If one of you arrives late for a family function, how would you raise the issue without embarrassing each other in front of everyone?"),
    askBoth("Handling pressure and uncertainty",
      "When a plan suddenly falls through, what is the first thing you need from your partner?",
      "Imagine your train is cancelled on the way to a family event. Who would call home, and who would look at other ways to travel?"),
    askBoth("Affection and closeness",
      "On a busy day, what small gesture makes you feel remembered?",
      "Compare your answers. A message at lunchtime may mean more to one of you than a long call at night."),
    comparePair("Communication and disagreements", expression.row,
      "When a conversation gets difficult, how will you say whether you need an answer now or some time to think?"),
    comparePair("Ambition and life priorities", priorities.row,
      "If one of you receives a job offer in another city, each name one opportunity you would gain and one thing you would miss."),
    askBoth("Decisions and independence",
      "Which decisions do you like to make yourself, and which ones should your partner discuss with you first?",
      "If a parent asks where you will live after marriage, agree on what either of you can say before you have decided together."),
    askBoth("Responsibility and follow-through",
      "Which everyday responsibility could your partner comfortably leave with you from beginning to end?",
      "Pick one real task, such as paying a bill or arranging a parent’s appointment. Agree who will remember it, arrange it and follow it up."),
    comparePair("Routine and openness to change", everyday.row,
      "If Sunday plans change at the last minute, what would help each of you feel that your time was considered?"),
    askBoth("Romance and physical intimacy",
      "What helps you feel comfortable talking about affection, closeness and your own pace?",
      "Choose a private moment. Give each other room to say what feels welcome, what feels too soon and what you would like to talk about later."),
    askBoth("Family involvement and boundaries",
      "Which family commitments would you like your partner to understand before marriage?",
      "Suppose both families invite you for the same festival. How would you decide where to go, and who would explain the plan?"),
    askBoth("Money and security",
      "What would help you feel financially secure while keeping up your own commitments?",
      "Before choosing a home, discuss a monthly amount each of you feels comfortable with, including what you already contribute to family."),
    askBoth("Apology and rebuilding trust",
      "After someone hurts you, what helps you believe they have understood what went wrong?",
      "If one of you agreed to a visit without asking, what would put it right today? What would you want to happen differently next time?"),
  ]

  const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6] as const
  const marriageGrid = {
    cells: gridOrder.map(digit => ({
      digit,
      first: facts.individuals[0].loShu.counts[digit],
      second: facts.individuals[1].loShu.counts[digit],
      joint: facts.jointCounts[digit],
    })),
    lines: facts.patterns.map(pattern => {
      const digits = pattern.required
      const key = digits.slice().sort((a, b) => a - b).join("")
      const titles: Record<string, string> = {
        "249": "Mental row", "357": "Emotional and will row",
        "168": "Practical row", "348": "4–3–8 column",
        "159": "9–5–1 column", "267": "2–7–6 column",
        "456": "Golden Rajyog", "258": "Silver Rajyog",
      }
      const rajyog = key === "456" || key === "258"
      let status: string
      if (pattern.formation === "newly_together") {
        status = "You complete this together"
      } else if (pattern.formation === "both_individuals") {
        status = "Complete in both personal grids"
      } else if (pattern.formation === "first_individual") {
        status = "Already complete in " + first.portrait.name + "’s grid"
      } else if (pattern.formation === "second_individual") {
        status = "Already complete in " + second.portrait.name + "’s grid"
      } else if (rajyog) {
        status = pattern.jointPresent.length === 2 ? "Partial" : "Absent"
      } else {
        status = "Incomplete"
      }
      return { title: titles[key] || digits.join("–"), digits, missing: pattern.missing, status }
    }),
  }

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
    marriageComparison: { numbers, characteristics },
    marriageGrid,
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
