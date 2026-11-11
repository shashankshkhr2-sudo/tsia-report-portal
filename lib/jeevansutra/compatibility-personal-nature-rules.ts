import "server-only"
import type { NumerologyDigit } from "@/lib/numerology/types"
import type { CompatibilityExpectation } from "./compatibility-personal-report-contract"

// Adopted draft interpretations, not observations or validated personality findings.
// Primary everyday approach only; integrate other roles before producing a portrait.
export type PersonalNatureRule = {
  id: string
  nature: string
  expectation: CompatibilityExpectation
  misunderstanding: string
  contribution: string
}

export const PERSONAL_NATURE_RULES = {
  "1": {
    "id": "nature-1",
    "nature": "You may prefer taking initiative and having a say in how things move forward.",
    "expectation": {
      "title": "A voice in decisions",
      "description": "Being consulted may matter more to you than having someone decide on your behalf."
    },
    "misunderstanding": "A quick decision intended to help could leave the other person feeling excluded.",
    "contribution": "Explain your preference and invite the other view before settling a shared decision."
  },
  "2": {
    "id": "nature-2",
    "nature": "You may notice the tone of a conversation and value small signs of warmth and consideration.",
    "expectation": {
      "title": "Clear reassurance",
      "description": "A warm response and being included may help you feel that the connection matters."
    },
    "misunderstanding": "You may hope the other person notices a concern before you have explained it.",
    "contribution": "Say what affected you and what response would help, rather than leaving the need unspoken."
  },
  "3": {
    "id": "nature-3",
    "nature": "You may enjoy exchanging ideas, explaining your point of view and bringing something fresh to a conversation.",
    "expectation": {
      "title": "Interest in your ideas",
      "description": "Having room to speak and feeling that your contribution is appreciated may matter to you."
    },
    "misunderstanding": "An idea offered to help could be heard as advice when the other person mainly wants understanding.",
    "contribution": "Ask whether the other person wants ideas or a chance to finish explaining their experience."
  },
  "4": {
    "id": "nature-4",
    "nature": "You may examine how an arrangement will work and prefer enough clarity to form your own considered view.",
    "expectation": {
      "title": "Clear arrangements",
      "description": "Knowing what has been agreed and being able to question the details may help you feel comfortable."
    },
    "misunderstanding": "Questions intended to make an idea workable could be heard as rejecting it.",
    "contribution": "Explain what you appreciate about the idea before identifying the details you need to clarify."
  },
  "5": {
    "id": "nature-5",
    "nature": "You may enjoy variety, conversation and room to adjust your approach as circumstances change.",
    "expectation": {
      "title": "Room for flexibility",
      "description": "Space for your interests and choices may matter alongside time and commitments shared with the other person."
    },
    "misunderstanding": "A change that feels ordinary to you could feel unsettling to someone relying on the original plan.",
    "contribution": "Communicate changes early and agree which commitments still need to be kept."
  },
  "6": {
    "id": "nature-6",
    "nature": "You may express care by making people comfortable and noticing where practical support would help.",
    "expectation": {
      "title": "Care that is mutual",
      "description": "Appreciation and a willingness to share responsibility may matter when you give time or effort."
    },
    "misunderstanding": "Helping without checking could feel like taking over, even when your intention is caring.",
    "contribution": "Ask what support is wanted and explain what you can realistically offer."
  },
  "7": {
    "id": "nature-7",
    "nature": "You may want time to understand an experience before explaining your thoughts or feelings.",
    "expectation": {
      "title": "Time to reflect",
      "description": "A thoughtful conversation and respect for quiet time may help you speak more comfortably."
    },
    "misunderstanding": "A pause intended for reflection could be interpreted as withdrawal or lack of interest.",
    "contribution": "Explain when you need time and agree when you will return to the conversation."
  },
  "8": {
    "id": "nature-8",
    "nature": "You may value sustained effort and prefer commitments that can be carried through in practice.",
    "expectation": {
      "title": "Dependable commitments",
      "description": "Realistic promises and a fair share of responsibility may matter more than repeated assurances."
    },
    "misunderstanding": "Attention to progress could leave the other person feeling that their effort or feelings have gone unnoticed.",
    "contribution": "Recognise the effort already made before discussing what still needs attention."
  },
  "9": {
    "id": "nature-9",
    "nature": "You may respond strongly when something matters to you and want your actions to serve a meaningful purpose.",
    "expectation": {
      "title": "Respect for your reasons",
      "description": "Having your concerns heard may matter even when the other person reaches a different conclusion."
    },
    "misunderstanding": "Strong conviction could be experienced as pressure to agree with your preferred outcome.",
    "contribution": "Explain why the issue matters while leaving room for the other person to choose or disagree."
  }
} as const satisfies Record<NumerologyDigit, PersonalNatureRule>
