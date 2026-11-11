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
  const required = ["closeness-and-flexibility", "reflection-and-discussion", "conviction-and-choice"]
  if (paired.evidence.unsupportedRoles.length || required.some(id => !paired.interactions.some(row => row.id === id))) {
    throw new Error("This pairing requires additional interpretation rules before a review report can be generated.")
  }
  const marriageExamples: Record<string, string> = {
    "closeness-and-flexibility": "When considering marriage, explore this through how you would balance time together, personal interests and changes to shared plans.",
    "reflection-and-discussion": "For a sensitive marriage discussion, such as family involvement, distinguish a request for thinking time from a refusal to discuss the issue.",
    "conviction-and-choice": "A decision about where to live or how to support both careers gives you a concrete way to explore this difference before making a commitment.",
  }
  const interactions = paired.interactions.map(row => ({ ...row, betweenYou: row.betweenYou + " " + marriageExamples[row.id] }))
  const focus = interactions.find(row => row.id === "closeness-and-flexibility")!
  const report: PersonalCompatibilityReport = {
    version: PERSONAL_COMPATIBILITY_REPORT_VERSION,
    kind: input.kind,
    relationship: input.relationship,
    people: [first.portrait, second.portrait],
    connection: {
      title: "Closeness with room to be yourselves",
      description: "Your reading explores how reassurance, independence and different ways of expressing yourselves could meet in marriage. Start with understanding each person, then consider the expectations you would bring into everyday life together.",
    },
    interactions,
    sharedPotential: potential.items,
    conclusion: {
      strongestConnection: "A potential strength is bringing a meaningful purpose together with the willingness to take initiative. It becomes a shared strength when both people help choose the direction.",
      mainDifference: "The central difference to explore is how reassurance and flexibility coexist. Neither a request for closeness nor a request for space should automatically be read as a rejection of the other person.",
      firstNextStep: focus.firstAdjustment,
      secondNextStep: focus.secondAdjustment,
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
        contextVersion: "JS_MARRIAGE_CONTEXT_1_DRAFT",
        strongestConnection: "bhagyank-9-1",
        mainDifference: "mulank-2-5",
      },
    },
    reviewOnly: true as const,
  }
}
