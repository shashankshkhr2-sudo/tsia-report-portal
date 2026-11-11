import "server-only"
import type { NumerologyDigit } from "@/lib/numerology/types"

// Draft adopted interpretations. Match the specified role only.
// Left and right refer to number positions, never gender or customer order.
// Unsupported pairs must not be assigned one of these interpretations.
export type PersonalPairRule = {
  ruleId: string
  role: "mulank" | "bhagyank" | "name"
  left: NumerologyDigit
  right: NumerologyDigit
  id: string
  area: string
  leftPerspective: string
  rightPerspective: string
  betweenYou: string
  leftAdjustment: string
  rightAdjustment: string
}

export const PERSONAL_PAIR_RULES = [
  {
    "ruleId": "mulank-2-5",
    "role": "mulank",
    "left": 2,
    "right": 5,
    "id": "closeness-and-flexibility",
    "area": "Closeness and flexibility",
    "leftPerspective": "You may appreciate clear signs that shared time and arrangements matter.",
    "rightPerspective": "You may appreciate room to adjust plans without the change being taken personally.",
    "betweenYou": "A change of plan could carry different meanings: one person notices the effect on their connection, while the other sees a need for flexibility. The opportunity is to make consideration clear while leaving room for change.",
    "leftAdjustment": "Explain which part of the arrangement matters to you and what alternative would still feel considerate.",
    "rightAdjustment": "Acknowledge the effect of a change and suggest a clear alternative when someone is depending on you."
  },
  {
    "ruleId": "name-7-3",
    "role": "name",
    "left": 7,
    "right": 3,
    "id": "reflection-and-discussion",
    "area": "Talking things through",
    "leftPerspective": "You may prefer understanding your thoughts before explaining them.",
    "rightPerspective": "You may find that exchanging ideas helps you work out what you think.",
    "betweenYou": "You may reach clarity at different stages of a conversation. A quiet pause can be mistaken for disengagement; continued questions can feel like pressure. Giving both approaches a place can make it easier to understand each other.",
    "leftAdjustment": "Say when you need a pause and suggest when you can return with your thoughts.",
    "rightAdjustment": "Allow the agreed pause, then invite the other perspective before adding more suggestions."
  },
  {
    "ruleId": "bhagyank-9-1",
    "role": "bhagyank",
    "left": 9,
    "right": 1,
    "id": "conviction-and-choice",
    "area": "Decisions that affect both of you",
    "leftPerspective": "You may want the reason behind an important decision to be understood.",
    "rightPerspective": "You may want a meaningful say in choosing the direction.",
    "betweenYou": "Purpose and initiative can work together when you agree on the goal. When you disagree, a strongly held reason may meet an equally strong need for choice. Neither person needs to surrender their voice for the other view to be heard.",
    "leftAdjustment": "Explain the outcome you care about while remaining open to another way of reaching it.",
    "rightAdjustment": "Explain your preferred approach and how it addresses the concern the other person has raised."
  }
] as const satisfies readonly PersonalPairRule[]
