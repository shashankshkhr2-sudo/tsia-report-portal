import type { PatternResult, NumerologyDigit } from "@/lib/numerology/types"

type PatternSubject = { title: string; plane: string; meaning: string; example: string; habit: string }

const subjects: Record<string, PatternSubject> = {
  "4-9-2": {
    "title": "Thinking and ideas",
    "plane": "Mental plane",
    "meaning": "This pattern is associated with thinking through a situation, considering ideas and forming a view.",
    "example": "When comparing two work options, consider what you know about each and what still needs checking.",
    "habit": "Write down your preferred option and one fact that could change your view."
  },
  "3-5-7": {
    "title": "Feelings and expression",
    "plane": "Emotional plane",
    "meaning": "This pattern is associated with recognising feelings and finding ways to express what matters.",
    "example": "After a disagreement, a pause can give you time to understand what upset you before discussing it.",
    "habit": "Finish this sentence before a difficult conversation: What I want you to understand is..."
  },
  "8-1-6": {
    "title": "Everyday responsibilities",
    "plane": "Practical plane",
    "meaning": "This pattern is associated with managing everyday tasks, resources and responsibilities.",
    "example": "When sharing household duties, clear agreements can help everyone understand what they are taking on.",
    "habit": "Choose one recurring responsibility and agree who will handle it and when."
  },
  "4-3-8": {
    "title": "Planning and organisation",
    "plane": "Thought plane",
    "meaning": "This pattern is associated with giving an idea structure through priorities and workable steps.",
    "example": "When preparing a small event, arranging the tasks in order can reveal what needs doing first.",
    "habit": "Write three steps for one plan and check whether their order makes sense."
  },
  "9-5-1": {
    "title": "Determination and commitment",
    "plane": "Will plane",
    "meaning": "This pattern is associated with choosing a direction and maintaining commitment while reviewing the approach.",
    "example": "When a project meets an obstacle, consider whether to change the method and whether the goal still matters.",
    "habit": "Choose one goal, write why it matters and define a realistic commitment for this week."
  },
  "2-7-6": {
    "title": "Putting plans into action",
    "plane": "Action plane",
    "meaning": "This pattern is associated with moving from intention to execution through concrete actions.",
    "example": "Arranging an appointment moves forward when you check availability or make the call.",
    "habit": "Choose one pending plan and complete its next available step."
  }
}

type Contribution = readonly [quality: string, action: string, habit: string]
const contributions: Record<string, Partial<Record<NumerologyDigit, Contribution>>> = {
  "4-9-2": {
    "2": [
      "considering the people affected",
      "ask how the options would affect someone involved",
      "Ask one affected person for their perspective."
    ],
    "4": [
      "giving an idea a clear shape",
      "outline how each option would work",
      "Sketch the options in a few words."
    ],
    "9": [
      "recognising what matters to you",
      "identify why the decision matters",
      "Write what you want this decision to achieve."
    ]
  },
  "3-5-7": {
    "3": [
      "putting an experience into words",
      "describe what happened and what it meant to you",
      "Describe one feeling without judging it."
    ],
    "5": [
      "exploring a feeling through conversation",
      "ask a question and allow the answer to change the conversation",
      "Ask an open question and listen to the answer."
    ],
    "7": [
      "reflecting before responding",
      "take a quiet pause to understand your reaction",
      "Take a short pause and write what you want to express."
    ]
  },
  "8-1-6": {
    "1": [
      "taking ownership of a practical task",
      "offer to start one clearly defined job",
      "Choose one responsibility you can take ownership of today."
    ],
    "6": [
      "making practical support useful to others",
      "check which household task would actually help someone",
      "Ask what practical help would be useful before offering it."
    ],
    "8": [
      "maintaining a regular commitment",
      "set a manageable routine for a recurring task",
      "Give one recurring task a realistic time in your week."
    ]
  },
  "4-3-8": {
    "3": [
      "learning enough to explain an approach",
      "learn how the booking process for a small event works and explain its steps",
      "Explain one process in three clear steps."
    ],
    "4": [
      "arranging information into a workable structure",
      "put the tasks for a small event in a useful order",
      "Put the steps for one task in order."
    ],
    "8": [
      "keeping a method usable over time",
      "return to a checklist and update it as arrangements change",
      "Set a time to review one plan you are using."
    ]
  },
  "9-5-1": {
    "1": [
      "making a deliberate start",
      "volunteer for the first defined step of a project",
      "Define one first step you can realistically own."
    ],
    "5": [
      "considering another approach to a chosen goal",
      "discuss an alternative method when a project meets an obstacle",
      "Identify another way to approach one current goal."
    ],
    "9": [
      "choosing a goal for a reason that matters",
      "identify why a project is worth your effort",
      "Write why one current goal matters to you."
    ]
  },
  "2-7-6": {
    "2": [
      "checking what people involved need",
      "check a suitable time with the people involved before booking",
      "Ask one person involved what needs to be considered."
    ],
    "6": [
      "turning care into useful help",
      "offer practical help with an arrangement after checking it is wanted",
      "Agree one useful action with the person you want to support."
    ],
    "7": [
      "considering the practical details before proceeding",
      "check the appointment details before confirming",
      "Check one important detail before your next action."
    ]
  }
}


const connections: Record<string, string> = {
  "2-4": "A clear outline can make it easier to ask how an idea would affect someone, and their answer can help you reconsider the outline.",
  "4-9": "Knowing why a decision matters can help you give an idea a useful shape.",
  "2-9": "Understanding the people affected can help you examine what makes a decision worth taking.",
  "3-5": "Describing an experience can open a conversation in which questions help you explore what it meant.",
  "3-7": "Putting an experience into words can give you something specific to reflect on before responding.",
  "5-7": "A conversation can raise questions that benefit from a quiet pause before you reply.",
  "1-8": "Taking ownership of a task gives regular effort a clear focus; keeping the commitment manageable matters.",
  "6-8": "Regular practical support can express care, especially when you check that the arrangement still works for everyone.",
  "1-6": "Taking responsibility for a useful task can turn an offer of care into practical support.",
  "3-4": "Arranging unfamiliar information into steps can help you understand it well enough to explain the approach.",
  "3-8": "Returning to a process and practising it can help you understand how it works beyond the first explanation.",
  "4-8": "A workable structure gives you a method to return to, while regular review keeps that method useful.",
  "5-9": "A reason that matters can guide the goal while conversation and flexibility help you consider another route.",
  "1-9": "A meaningful reason can give initiative a direction: something worth changing and a first step you can own.",
  "1-5": "Discussing possible approaches can help you choose a first step you are ready to take.",
  "2-7": "Checking what people need and considering the details can help you decide how to proceed.",
  "2-6": "Asking what someone needs can turn a general offer of help into an action they actually want.",
  "6-7": "Thinking through the details of an offer can help you turn care into something practical and useful."
}

export function patternReading(p: PatternResult) {
  const key = p.numbers.join("-")
  const subject = subjects[key]
  if (!subject) return null
  const present = p.numbers.filter(n => p.present.includes(n))
  if (new Set(p.numbers).size !== 3 || new Set(p.present).size !== p.present.length || present.length !== p.present.length || present.length !== p.presentCount) throw new Error("Inconsistent pattern input")
  if ((p.status === "complete") !== (present.length === 3) || (p.status === "partial") !== (present.length === 2)) throw new Error("Inconsistent pattern status")
  const parts = present.map(n => {
    const part = contributions[key][n]
    if (!part) throw new Error("Missing pattern contribution")
    return part
  })
  if (!parts.length) return { ...subject, meaning: subject.meaning + " Here, the example and habit are offered for reflection rather than as a description of your tendencies." }
  const connectionKey = [...present].sort((a,b) => a-b).join("-")
  const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
  let meaning: string
  if (p.status === "complete") {
    const qualities = parts.map(part => part[0])
    meaning = subject.meaning + " Its combined themes are " + qualities.slice(0,-1).join(", ") + " and " + qualities[qualities.length-1] + ". Consider where these work together in your experience."
  } else if (parts.length === 2) {
    const connection = connections[connectionKey]
    if (!connection) throw new Error("Missing relationship rule")
    meaning = connection + " Consider whether this connection feels familiar in your own experience."
  } else {
    meaning = capitalise(parts[0][0]) + " is the focus of this part of your reading. Consider how it relates to " + subject.title.toLowerCase() + " in your own experience."
  }
  const actions = parts.map(part => part[1])
  const example = parts.length === 3 ? subject.example : "For example, you could " + actions[0] + "." + (actions.length === 2 ? " You could also " + actions[1] + "." : "")
  return { ...subject, meaning, example, habit: parts.length === 3 ? subject.habit : parts[0][2] }
}
