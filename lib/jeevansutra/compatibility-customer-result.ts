import 'server-only'
import type { CustomerReading } from './compatibility-contract'
import { launchRelationshipGuidance } from './compatibility-launch-options'

const connectionCopy: Readonly<Record<string, readonly [string, string]>> = {
  "Dating / getting to know each other": [
    "Curiosity can make it easier to discover what you enjoy together.",
    "You may have different expectations about how often to meet or stay in touch."
  ],
  "In a relationship": [
    "Small, consistent gestures can help both of you feel cared for.",
    "One of you may want to talk through a concern right away while the other needs time."
  ],
  "Live-in relationship": [
    "Shared routines can make everyday life feel more like a team effort.",
    "Chores, expenses or quiet time can become points of friction when expectations are left unspoken."
  ],
  "Friends": [
    "Trust can grow when you make room for both honest conversation and simple time together.",
    "One friend may offer solutions when the other mainly wants someone to listen."
  ],
  "Considering marriage": [
    "Talking openly about ordinary life can help you understand what you each want to build.",
    "You may take different things for granted about money, family involvement or where to live."
  ],
  "Married": [
    "Knowing each other’s routines can make it easier to notice when one of you needs help.",
    "Responsibilities that once felt fair may need a fresh conversation as life changes."
  ],
  "Business partners": [
    "Your partnership can benefit when each person knows which part of the work they own.",
    "Different expectations about spending or approvals can slow decisions."
  ],
  "Co-founders": [
    "Different approaches can be useful when one founder moves ideas forward and the other tests assumptions.",
    "Disagreements can stall progress when neither founder knows who has the final say."
  ],
  "Colleagues": [
    "Your work together can go more smoothly when you share updates early.",
    "Different assumptions about handoffs can leave a task waiting or cause duplicate work."
  ],
  "Manager / team member": [
    "Clear expectations and timely feedback can build trust in both directions.",
    "A manager and team member may have different ideas of what a useful check-in looks like."
  ],
  "Professional contacts": [
    "A specific shared interest can give you a natural reason to stay in touch.",
    "You may have different expectations about follow-up or how much time to offer."
  ],
  "Crush / exploring a connection": [
    "A relaxed conversation can help you discover whether you enjoy getting to know each other.",
    "A friendly response can mean different things. Give the other person room to show interest in their own way."
  ],
  "Parent / child": [
    "Listening before offering advice can help keep support welcome.",
    "Care can feel like pressure when one person wants more independence."
  ],
  "Siblings": [
    "Shared history can make it easier to understand where the other person is coming from.",
    "Old family roles can shape who is expected to step in, even when circumstances have changed."
  ],
  "Mother-in-law / daughter-in-law": [
    "Small gestures of inclusion can help you find common ground without giving up your own routines.",
    "Different expectations about visits, advice or family traditions can make goodwill easy to misread."
  ],
  "Father-in-law / son-in-law": [
    "Taking an interest in each other’s point of view can make family decisions easier to discuss.",
    "Offering advice and asking to be consulted can mean different things to each of you."
  ],
  "Other family members": [
    "A way of staying in touch that suits both of you can help keep the bond warm.",
    "Different expectations about visits or support can lead to misunderstandings."
  ],
  "Personal Relationship Compatibility": [
    "You can build connection by noticing when each person feels listened to.",
    "You may differ in how often you want to talk or spend time together."
  ],
  "Business Partnership Compatibility": [
    "Clear ownership can help each partner contribute confidently.",
    "Different expectations about who approves decisions can create delays."
  ],
  "Professional Compatibility": [
    "Regular updates can make working together easier.",
    "You may prefer different ways of giving feedback or coordinating tasks."
  ],
  "Interaction Guidance": [
    "A straightforward conversation can help you understand what each person wants from this interaction.",
    "You may read the same words or gestures differently."
  ],
  "Family Compatibility": [
    "Small, reliable ways of showing up can strengthen family ties.",
    "You may have different expectations about support and personal space."
  ]
}

// Explicit output projection for both historic and draft records.
export function customerResult(value: unknown): CustomerReading {
 const r = value as Record<string, any>
 const people = Array.isArray(r.people) ? r.people.map((p: { name: string }) => ({ name: p.name })) : []
 if (r.version === 'JS_COMPATIBILITY_V2_DRAFT_1') return {
  version: r.version, status: 'draft', kind: r.kind, relationship: r.relationship, ...(r.relationshipContextVersion === "JS_RELATIONSHIP_CONTEXT_1" ? { relationshipContextVersion: "JS_RELATIONSHIP_CONTEXT_1" as const } : {}), ...(r.roles && typeof r.roles.self === 'string' && typeof r.roles.other === 'string' ? { roles: { self: r.roles.self, other: r.roles.other } } : {}), people,
  sections: r.sections.map((s: { title: string; text: string }) => ({ title: s.title, text: s.text })), limitation: r.limitation,
 }
 const kind = typeof r.kind === 'string' ? r.kind : 'Interaction Guidance'
 const savedRelationship = typeof r.relationship === 'string' ? r.relationship : ''
 const relationship = savedRelationship || (typeof r.question === 'string' ? r.question.split(': ', 1)[0] : '')
 const guidance = launchRelationshipGuidance(kind, relationship)
 const label = guidance ? relationship : kind
 const [connection, difference] = Object.prototype.hasOwnProperty.call(connectionCopy, label)
  ? connectionCopy[label] : connectionCopy['Interaction Guidance']
 const full = r.fullConclusion
 if (Array.isArray(full) && full.length === 3 && full.every(text => typeof text === 'string')) {
  return {
   version: 'JS_COMPATIBILITY_LAUNCH_1', kind: label, people,
   observations: full,
      ...(Array.isArray(r.detailedSections) && r.detailedSections.length > 0 && r.detailedSections.every((s: any) => s && typeof s.title === "string" && typeof s.text === "string") ? { detailedSections: r.detailedSections.map((s: { title: string; text: string }) => ({ title: s.title, text: s.text })) } : {}),
   limitation: 'A traditional numerology reflection to help you start a conversation.',
  }
 }
 const sharedApproach = Array.isArray(r.people) && r.people.length === 2
  && typeof r.people[0]?.nameNumber === 'number'
  && r.people[0].nameNumber === r.people[1]?.nameNumber
 return {
  version: 'JS_COMPATIBILITY_LAUNCH_1', kind: label, people,
  observations: [
   sharedApproach ? 'You may find some common ground in how you express yourselves. ' + connection : connection,
   difference,
   guidance?.[1] ?? 'Pick one expectation to talk through and agree on one small step together.',
  ],
  limitation: 'Use these insights as a starting point for reflection and conversation.',
 }
}
