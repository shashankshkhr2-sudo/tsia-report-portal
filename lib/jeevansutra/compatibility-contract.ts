// Public UI contracts only. Never import the private engine into a client component.
export const compatibilityKinds = ['Love & Marriage', 'Family', 'Friendship', 'Business & Work'] as const
export type CompatibilityKind = typeof compatibilityKinds[number]
export const relationships: Record<CompatibilityKind, readonly string[]> = {
 'Love & Marriage': ["Crush / exploring a connection", "Dating / getting to know each other", "In a relationship", "Considering marriage", "Married"],
 Family: ['Mother-in-law / daughter-in-law', 'Father-in-law / son-in-law', 'Parent / child', 'Siblings', 'Other family members'],
 Friendship: ['Friends'],
 'Business & Work': ['Business partners', 'Colleagues', 'Manager / team member', 'Professional contacts'],
}
export const priorities = ['Respect & communication', 'Personal space', 'Family boundaries', 'Responsibilities', 'Money expectations', 'Career & ambitions', 'Handling disagreements', 'Future expectations'] as const
export type ReadingSection = { title: string; text: string }
export type StandardReading = {
 version: 'JS_COMPATIBILITY_V2_DRAFT_1'; status: 'draft'; kind: CompatibilityKind;
 relationshipContextVersion?: "JS_RELATIONSHIP_CONTEXT_1";
 relationship: string; roles?: { self: string; other: string }; people: { name: string }[]; sections: ReadingSection[];
 limitation: string;
}
export function validRelationship(kind: unknown, relationship: unknown): kind is CompatibilityKind {
 return typeof kind === 'string' && compatibilityKinds.includes(kind as CompatibilityKind)
  && typeof relationship === 'string' && (relationships[kind as CompatibilityKind].includes(relationship) || (kind === "Love & Marriage" && ["Partners", "Spouses"].includes(relationship)))
}
export type LegacyReading = {
 version: 'JS_COMPATIBILITY_LAUNCH_1'; kind: string; people: { name: string }[];
 observations: string[]; limitation: string;
}
export type CustomerReading = StandardReading | LegacyReading

export const loveRelationshipCopy: Record<string, { invitation: string; context: string }> = {
 "Crush / exploring a connection": { invitation: "Curious about your connection? Explore what you have in common and what makes each of you different.", context: "getting to know each other, respecting personal boundaries and allowing interest to be mutual without assuming a relationship" },
 "Dating / getting to know each other": { invitation: "Getting to know each other goes beyond favourite songs and late-night chats. Explore how you connect, communicate and understand each other.", context: "getting to know each other, communication, personal space and discussing expectations without assuming long-term commitment" },
 "In a relationship": { invitation: "Every connection has its own rhythm. Discover what brings you closer, where you see things differently and how you can understand each other better.", context: "emotional connection, trust, personal space and the expectations each person brings to the relationship" },
 "Considering marriage": { invitation: "Understand your emotional connection, expectations and hopes for a life together.", context: "expectations for marriage, family boundaries, shared responsibilities and hopes for a life together" },
 "Married": { invitation: "Keep discovering each other. Explore your shared strengths, changing needs and ways to grow together.", context: "everyday partnership, shared responsibilities, changing needs and maintaining understanding within marriage" },
}
