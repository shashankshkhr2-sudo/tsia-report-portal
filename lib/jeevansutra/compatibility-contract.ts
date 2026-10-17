// Public UI contracts only. Never import the private engine into a client component.
export const compatibilityKinds = ['Love & Marriage', 'Family', 'Friendship', 'Business & Work'] as const
export type CompatibilityKind = typeof compatibilityKinds[number]
export const relationships: Record<CompatibilityKind, readonly string[]> = {
 'Love & Marriage': ['Partners', 'Spouses', 'Considering marriage'],
 Family: ['Mother-in-law / daughter-in-law', 'Father-in-law / son-in-law', 'Parent / child', 'Siblings', 'Other family members'],
 Friendship: ['Friends'],
 'Business & Work': ['Business partners', 'Colleagues', 'Manager / team member', 'Professional contacts'],
}
export const priorities = ['Respect & communication', 'Personal space', 'Family boundaries', 'Responsibilities', 'Money expectations', 'Career & ambitions', 'Handling disagreements', 'Future expectations'] as const
export type ReadingSection = { title: string; text: string }
export type StandardReading = {
 version: 'JS_COMPATIBILITY_V2_DRAFT_1'; status: 'draft'; kind: CompatibilityKind;
 relationship: string; roles?: { self: string; other: string }; people: { name: string }[]; sections: ReadingSection[];
 limitation: string;
}
export function validRelationship(kind: unknown, relationship: unknown): kind is CompatibilityKind {
 return typeof kind === 'string' && compatibilityKinds.includes(kind as CompatibilityKind)
  && typeof relationship === 'string' && relationships[kind as CompatibilityKind].includes(relationship)
}
export type LegacyReading = {
 version: 'JS_COMPATIBILITY_LAUNCH_1'; kind: string; people: { name: string }[];
 observations: string[]; limitation: string;
}
export type CustomerReading = StandardReading | LegacyReading
