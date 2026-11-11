import "server-only"
import type { NumerologyDigit } from "@/lib/numerology/types"

// Jeevan Sutra adopted draft conventions, not independent evidence of behaviour.
// Direction applies to Bhagyank; expression applies to the reduced Chaldean name.
// Keep compound totals in private evidence. No compound-specific reading is defined here.
// Repeated digits across roles must not be described as independent confirmation.
export type PersonalSupportRule = {
  direction: string
  expression: string
}

export const PERSONAL_SUPPORT_RULES = {
  "1": {
    "direction": "Having a say in the direction of your life may be important to you.",
    "expression": "You may prefer stating your own position and making your contribution clear."
  },
  "2": {
    "direction": "Maintaining cooperation and feeling considered may influence the choices that matter to you.",
    "expression": "You may pay attention to how your words are received and prefer a considerate exchange."
  },
  "3": {
    "direction": "Learning, developing ideas and having opportunities to express yourself may matter in your longer-term choices.",
    "expression": "You may express interest by sharing ideas, explaining possibilities or encouraging conversation."
  },
  "4": {
    "direction": "Finding an approach you can understand and organise may matter when you commit to a direction.",
    "expression": "You may explain yourself by asking questions, examining details or offering a different way to organise things."
  },
  "5": {
    "direction": "Keeping room for change and new experiences may influence the direction you choose.",
    "expression": "You may express yourself through lively conversation and an openness to exploring alternatives."
  },
  "6": {
    "direction": "Care, belonging and responsibilities to people who matter to you may influence your priorities.",
    "expression": "You may express interest by offering support or noticing what would make someone more comfortable."
  },
  "7": {
    "direction": "Understanding your choices deeply and having room for reflection may matter to you.",
    "expression": "You may keep some thoughts private until you have had time to understand and put them into words."
  },
  "8": {
    "direction": "Building something sustainable through effort may matter more to you than quick progress alone.",
    "expression": "You may communicate commitment through practical arrangements and attention to follow-through."
  },
  "9": {
    "direction": "Having a meaningful reason for what you pursue may strengthen your commitment to a direction.",
    "expression": "You may speak with conviction when an issue connects with something you care about."
  }
} as const satisfies Record<NumerologyDigit, PersonalSupportRule>
