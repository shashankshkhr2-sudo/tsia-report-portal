import type { FunctionalQualityId } from "@/lib/numerology-intelligence/types"

export const PROFESSION_CATALOGUE_VERSION = "JS_PROFESSION_CATALOGUE_DRAFT_1" as const

export type ProfessionArea = {
  id: string
  quality: FunctionalQualityId
  qualityTitle: string
  qualityDescription: string
  title: string
  examples: readonly string[]
  connection: string
  practicalRequirement: string
}

// Editorial exploration categories, not validated aptitude or career-success scores.
// This catalogue does not change the V2/V3 engines or their domain restrictions.
// Later work answers must remain separate from the initial name-and-DOB reading.
export const PROFESSION_AREAS: readonly ProfessionArea[] = [
  {
    "id": "initiative",
    "quality": "INDIVIDUAL_AGENCY",
    "qualityTitle": "Taking initiative",
    "qualityDescription": "This reading highlights self-direction, starting things and taking ownership.",
    "title": "Business development & coordination",
    "examples": [
      "Business development",
      "Project coordination",
      "Independent services"
    ],
    "connection": "These work areas involve taking initiative, following opportunities and accepting responsibility.",
    "practicalRequirement": "They also require relevant experience, planning and the ability to work with others."
  },
  {
    "id": "relationships",
    "quality": "RELATIONAL_RECEPTIVITY",
    "qualityTitle": "Understanding and working with people",
    "qualityDescription": "This reading highlights cooperation, listening and considering different perspectives.",
    "title": "Client relations & people support",
    "examples": [
      "Customer success",
      "Client servicing",
      "HR coordination"
    ],
    "connection": "These work areas involve understanding needs, coordinating people and handling conversations thoughtfully.",
    "practicalRequirement": "Clear communication, boundaries and knowledge of the organisation are important."
  },
  {
    "id": "knowledge",
    "quality": "KNOWLEDGE_EXPRESSION",
    "qualityTitle": "Learning and explaining",
    "qualityDescription": "This reading highlights learning, developing ideas and explaining them clearly.",
    "title": "Teaching, training & educational content",
    "examples": [
      "Teaching or tutoring",
      "Workplace training",
      "Educational content"
    ],
    "connection": "These work areas involve making information understandable and helping others learn.",
    "practicalRequirement": "Subject knowledge, practical teaching skills and any required qualifications are essential."
  },
  {
    "id": "improvement",
    "quality": "ADAPTIVE_RESTRUCTURING",
    "qualityTitle": "Finding a different approach",
    "qualityDescription": "This reading highlights questioning ineffective methods and considering new approaches.",
    "title": "Process improvement & product work",
    "examples": [
      "Process improvement",
      "Product operations",
      "Technical troubleshooting"
    ],
    "connection": "These work areas involve investigating problems and improving how a service or system works.",
    "practicalRequirement": "Technical or domain knowledge and careful testing of changes are important."
  },
  {
    "id": "communication",
    "quality": "ADAPTIVE_INTELLIGENCE",
    "qualityTitle": "Communicating and adapting",
    "qualityDescription": "This reading highlights exchanging information, responding to change and flexible thinking.",
    "title": "Sales, marketing & communications",
    "examples": [
      "Sales",
      "Marketing coordination",
      "Business communications"
    ],
    "connection": "These work areas involve explaining value, understanding an audience and responding to changing needs.",
    "practicalRequirement": "Listening, product knowledge, ethical communication and consistent follow-through matter."
  },
  {
    "id": "experience",
    "quality": "HARMONIOUS_CONNECTION",
    "qualityTitle": "Creating care and a pleasant experience",
    "qualityDescription": "This reading highlights care, aesthetic awareness and attention to how people experience things.",
    "title": "Design, hospitality & customer experience",
    "examples": [
      "Interior or fashion design",
      "Hospitality",
      "Event coordination"
    ],
    "connection": "These work areas involve presentation, service and creating an enjoyable experience.",
    "practicalRequirement": "Training, a portfolio where relevant, budgeting and reliable delivery are important."
  },
  {
    "id": "analysis",
    "quality": "REFLECTIVE_DISCERNMENT",
    "qualityTitle": "Looking beneath the surface",
    "qualityDescription": "This reading highlights observation, inquiry and examining information carefully.",
    "title": "Research, analysis & quality",
    "examples": [
      "Research support",
      "Data analysis",
      "Quality assurance"
    ],
    "connection": "These work areas involve checking evidence, investigating questions and noticing details.",
    "practicalRequirement": "Relevant analytical skills, tools and the ability to explain findings are important."
  },
  {
    "id": "organisation",
    "quality": "STRUCTURED_RESPONSIBILITY",
    "qualityTitle": "Building through steady effort",
    "qualityDescription": "This reading highlights accountability, persistence and sustained organisation.",
    "title": "Operations, administration & logistics",
    "examples": [
      "Operations coordination",
      "Administration",
      "Logistics planning"
    ],
    "connection": "These work areas involve managing responsibilities, tracking details and keeping work moving reliably.",
    "practicalRequirement": "Process knowledge, prioritisation and communication across teams are important."
  },
  {
    "id": "execution",
    "quality": "DIRECTED_FORCE",
    "qualityTitle": "Moving from decision to action",
    "qualityDescription": "This reading highlights decisive action and persistence when facing a challenge.",
    "title": "Field work, practical delivery & sports",
    "examples": [
      "Field operations",
      "Technical service delivery",
      "Sports coaching"
    ],
    "connection": "These work areas involve practical action, preparation and responding to situations as they develop.",
    "practicalRequirement": "Relevant training, sound judgement and any required safety or professional qualifications are essential."
  }
]
