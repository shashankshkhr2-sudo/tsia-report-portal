import { loveRelationshipCopy } from "./compatibility-contract"
import 'server-only'
import { compatibilityReadingCopy } from './compatibility-reading-copy'
import { calculateNumerologyV2 } from '@/lib/numerology/calculations'
import type { NumerologyDigit } from '@/lib/numerology/types'
import type { CompatibilityKind, ReadingSection, StandardReading } from './compatibility-contract'

export const methodVersion = 'JS_COMPATIBILITY_V2_DRAFT_1' as const
const digits: NumerologyDigit[] = [1,2,3,4,5,6,7,8,9]
// DRAFT interpretation conventions. Arithmetic is separate from interpretation.
const themes: Record<NumerologyDigit, { theme: string; excess: string; habit: string }> = {
 1: { theme: 'initiative and independence', excess: 'competing preferences about whose approach leads', habit: 'take turns proposing a decision and explain the reasons before choosing together' },
 2: { theme: 'sensitivity and cooperation', excess: 'different expectations of reassurance', habit: 'state a need directly and check what the other person understood' },
 3: { theme: 'expression and learning', excess: 'advice feeling like correction', habit: 'ask whether the other person wants listening, ideas or practical help' },
 4: { theme: 'structure and consistency', excess: 'routines becoming inflexible', habit: 'agree a routine and identify where either person can choose differently' },
 5: { theme: 'communication and adaptability', excess: 'different expectations about changes and follow-through', habit: 'communicate changes early and agree which commitments stay fixed' },
 6: { theme: 'care and responsibility', excess: 'support becoming unwanted involvement', habit: 'ask before taking over a responsibility and respect the answer' },
 7: { theme: 'reflection and personal space', excess: 'silence being misunderstood', habit: 'explain a need for time and agree when to reconnect' },
 8: { theme: 'discipline and persistence', excess: 'pressure around responsibilities', habit: 'agree realistic responsibilities and review the workload fairly' },
 9: { theme: 'drive and conviction', excess: 'strong preferences becoming competitive', habit: 'pause, summarise the other view and choose a shared priority' },
}
const lineDefinitions: { id: string; digits: NumerologyDigit[]; theme: string }[] = [
 { id: 'row_492', digits: [4,9,2], theme: 'planning and different perspectives' },
 { id: 'row_357', digits: [3,5,7], theme: 'expression and processing experiences' },
 { id: 'row_816', digits: [8,1,6], theme: 'everyday action and responsibilities' },
 { id: 'column_438', digits: [4,3,8], theme: 'organisation and sustained effort' },
 { id: 'column_951', digits: [9,5,1], theme: 'determination and follow-through' },
 { id: 'column_276', digits: [2,7,6], theme: 'reflection, care and action' },
 { id: 'golden_456', digits: [4,5,6], theme: 'ambition and balancing resources' },
 { id: 'silver_258', digits: [2,5,8], theme: 'cooperation and steadiness' },
]
const context: Record<CompatibilityKind, string> = {
 'Love & Marriage': 'closeness, independence and shared expectations',
 Family: 'respect, boundaries and family expectations',
 Friendship: 'mutual support, availability and personal space',
 'Business & Work': 'decisions, responsibilities and working styles',
}
export type ReadingInput = {
 self: { name: string; dob: string }; other: { name: string; dob: string };
 kind: CompatibilityKind; relationship: string; selfRole: string; otherRole: string; priorities: string[];
}
export function calculateCompatibility(input: ReadingInput) {
 const a = calculateNumerologyV2({ fullName: input.self.name, dateOfBirth: input.self.dob })
 const b = calculateNumerologyV2({ fullName: input.other.name, dateOfBirth: input.other.dob })
 const combined = Object.fromEntries(digits.map(n => [n, a.loShu.counts[n] + b.loShu.counts[n]])) as Record<NumerologyDigit, number>
 const shared = digits.filter(n => a.loShu.counts[n] > 0 && b.loShu.counts[n] > 0)
 const onlyA = digits.filter(n => a.loShu.counts[n] > 0 && b.loShu.counts[n] === 0)
 const onlyB = digits.filter(n => b.loShu.counts[n] > 0 && a.loShu.counts[n] === 0)
 const missing = digits.filter(n => combined[n] === 0)
 const lines = lineDefinitions.map(line => {
  const inA = line.digits.every(n => a.loShu.counts[n] > 0)
  const inB = line.digits.every(n => b.loShu.counts[n] > 0)
  const complete = line.digits.every(n => combined[n] > 0)
  return { ...line, inA, inB, complete, source: !complete ? 'incomplete' : inA && inB ? 'both' : inA ? 'person_a' : inB ? 'person_b' : 'together' }
 })
 return { methodVersion, a, b, combined, shared, onlyA, onlyB, missing, lines }
}
export function buildCompatibility(input: ReadingInput) {
 const facts = calculateCompatibility(input)
 const selectedContext = (input.kind === "Love & Marriage" ? loveRelationshipCopy[input.relationship]?.context : undefined) || context[input.kind]
 const theme = (n: NumerologyDigit) => themes[n].theme
 const aTheme = theme(facts.a.mulank.final), bTheme = theme(facts.b.mulank.final)
 const shared = facts.shared.map(theme)
 const complementaryA = facts.onlyA.map(theme), complementaryB = facts.onlyB.map(theme)
 const newLine = facts.lines.find(line => line.source === 'together')
 const strong = [...facts.shared].sort((x,y) => facts.combined[y] - facts.combined[x] || x-y)[0]
 const sections: ReadingSection[] = [
  { title: 'How you relate to each other', text: `${input.self.name} and ${input.other.name}: this draft traditional reading explores ${aTheme === bTheme ? 'a shared theme of ' + aTheme : aTheme + ' alongside ' + bTheme}. For the connection you selected (${input.relationship}), this reading considers ${selectedContext}. These are possible themes, not observed behaviour.` },
  { title: 'How you influence each other', text: `${input.self.name}'s contribution highlights ${complementaryA.slice(0,2).join(' and ') || aTheme}; ${input.other.name}'s highlights ${complementaryB.slice(0,2).join(' and ') || bTheme}. Each may experience the other's approach as encouraging in some situations and challenging in others. The reading cannot establish how either actually behaves.` },
  { title: 'How you complement each other', text: complementaryA.length || complementaryB.length ? `Different contributions suggest scope for ${[...complementaryA.slice(0,1), ...complementaryB.slice(0,1)].join(' alongside ')}. This is a possibility to recognise in your experience, rather than one person correcting a deficiency in the other.` : 'Your patterns share several themes. Similarity may feel familiar, while leaving room for different preferences remains relevant.' },
  { title: 'What you may build together', text: newLine ? `Your combined pattern introduces a draft theme of ${newLine.theme}. This may offer a useful lens on ${selectedContext}; it does not guarantee harmony, financial success or a particular future.` : `Shared themes include ${shared.slice(0,2).join(' and ') || 'different approaches to common goals'}. Their constructive expression depends on the people and circumstances, rather than the calculation alone.` },
  { title: 'Where difficulties may arise', text: strong ? `A shared emphasis may also bring ${themes[strong].excess}. This is a discussion possibility, not a finding of conflict or a judgment about either person. Missing themes are not evidence of a personal defect.` : `Differences in ${selectedContext} may be worth exploring. No conflict is inferred merely because your numerical patterns differ.` },
 ]
 const standard: StandardReading = { version: methodVersion, status: 'draft', kind: input.kind, relationshipContextVersion: "JS_RELATIONSHIP_CONTEXT_1", relationship: input.relationship, roles: { self: input.selfRole, other: input.otherRole }, people: [{ name: input.self.name }, { name: input.other.name }], sections: sections.map(section => ({ ...section, text: compatibilityReadingCopy(section.text) })), limitation: 'A traditional numerology reading for reflection. Your choices, communication and everyday actions shape your relationship. Interpretation rules are still under review.' }
 const practitioner = {
  status: 'draft' as const, methodVersion, roles: { self: input.selfRole, other: input.otherRole }, priorities: input.priorities,
  sections: [...sections, { title: 'Behaviours to develop — consultation discussion', text: `${input.self.name}: consider whether it would help to ${themes[facts.a.mulank.final].habit}. ${input.other.name}: consider whether it would help to ${themes[facts.b.mulank.final].habit}. Shared practice: a regular check-in with one appreciation, one concern and one agreed next step. Ask both people whether these suggestions fit before using them.` }],
  prompts: ['What happens in a recent real example?', 'What does each person need and what has already helped?', 'Which one small agreement would both willingly try?'],
  reviewNotes: ['Number themes and line meanings are draft conventions.', 'Specific Mulank/Bhagyank pairing and repetition tables are not approved or implemented.', 'No combined repetition threshold is treated as excessive.', 'Name numbers are calculated internally; their relationship pairing interpretation is pending review.', 'Priorities and roles are client-reported context, not numerical evidence.'],
 }
 return { standard, practitioner, facts }
}
