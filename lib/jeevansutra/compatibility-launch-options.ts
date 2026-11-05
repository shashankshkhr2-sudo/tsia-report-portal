const options: Record<string, Record<string, [string, string]>> = {
  "Personal Relationship Compatibility": {
    "Dating / getting to know each other": [
      "What pace and expectations feel comfortable for each of you?",
      "Ask each other what staying in touch between dates would feel good to you."
    ],
    "In a relationship": [
      "When do you each feel heard and supported?",
      "Each name one thing that helps you feel supported during a disagreement."
    ],
    "Live-in relationship": [
      "How do you want to share chores, expenses and personal space?",
      "Pick one household routine and agree how to share it this week."
    ],
    "Friends": [
      "How do you each build trust, ask for support and respect personal space?",
      "Tell each other what kind of check-in feels supportive when life gets busy."
    ],
    "Considering marriage": [
      "Which expectations about everyday life would you like to discuss together?",
      "Pick one topic, such as money or family boundaries, and take turns explaining what matters to you."
    ],
    "Married": [
      "Which shared responsibility could feel fairer to both of you?",
      "Agree on one small change to try this week, then check in about how it felt."
    ]
  },
  "Business Partnership Compatibility": {
    "Business partners": [
      "Which decisions should you make together and which can each person own?",
      "Write down who owns one recurring decision and when to consult the other person."
    ],
    "Co-founders": [
      "Where do your goals, time commitments and decision styles differ?",
      "Agree on who owns one upcoming decision and how you’ll handle a deadlock."
    ]
  },
  "Professional Compatibility": {
    "Colleagues": [
      "How do you each prefer to coordinate work and raise concerns?",
      "Agree on a simple handoff for one task you share."
    ],
    "Manager / team member": [
      "How can you make expectations and feedback clear in both directions?",
      "Agree on one priority and when to check in about progress."
    ],
    "Professional contacts": [
      "What would make this connection useful and respectful for both of you?",
      "Suggest one specific follow-up and give the other person room to decline."
    ]
  },
  "Interaction Guidance": {
    "Crush / exploring a connection": [
      "How can you express interest while respecting the other person’s pace and boundaries?",
      "If it feels appropriate, suggest a low-pressure conversation and let them choose how to respond."
    ]
  },
  "Family Compatibility": {
    "Parent / child": [
      "How can you offer support while respecting each other’s independence?",
      "Ask whether the other person wants advice, practical help or someone to listen."
    ],
    "Siblings": [
      "Which family expectations or responsibilities would be easier to discuss openly?",
      "Talk through one shared responsibility and agree what each person can take on."
    ],
    "Mother-in-law / daughter-in-law": [
      "How can you discuss family expectations while respecting each other’s space?",
      "Pick one recurring situation and agree how to ask before making plans for each other."
    ],
    "Father-in-law / son-in-law": [
      "What helps each of you feel respected when family decisions come up?",
      "Before the next shared decision, ask how each person would like to be involved."
    ],
    "Other family members": [
      "What kind of support and contact feels comfortable for both of you?",
      "Agree on one way to stay in touch that works for both schedules."
    ]
  }
}

export function launchRelationships(kind: string): string[] {
  return Object.prototype.hasOwnProperty.call(options, kind) ? Object.keys(options[kind]) : []
}

export function launchRelationshipGuidance(kind: string, relationship: string) {
  if (!launchRelationships(kind).includes(relationship)) return undefined
  return options[kind][relationship]
}
