// Public UI contracts only. Never import the private engine into a client component.
export const compatibilityKinds = ['Love & Marriage', 'Family', 'Friendship', 'Business & Work', "Business", "Work", "Meeting Someone"] as const
export type CompatibilityKind = typeof compatibilityKinds[number]
export const relationships: Record<CompatibilityKind, readonly string[]> = {
  "Business": ["My business partner","Someone I may start a business with","My co-founder","An investor"],
  "Work": ["My colleague","My manager","My team member","My client","My mentor"],
  "Meeting Someone": ["Someone I am meeting for the first time","A possible customer","A service provider","Another contact"],
 'Love & Marriage': ["Someone I’m thinking of dating","Someone I’m dating","My boyfriend","My girlfriend","My partner","Someone I’m engaged to","A friend","Friends with benefits"],
 Family: ["My husband","My wife","My mother","My father","My son","My daughter","My brother","My sister","My grandmother","My grandfather","My grandchild","My mother-in-law","My father-in-law","My son-in-law","My daughter-in-law","My brother-in-law","My sister-in-law","Another family member"],
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
  && typeof relationship === 'string' && (((relationships[kind as CompatibilityKind].includes(relationship) || (kind === "Love & Marriage" && ["Crush / exploring a connection", "Dating / getting to know each other", "In a relationship", "Considering marriage", "Married"].includes(relationship))) || (kind === "Family" && ['Mother-in-law / daughter-in-law', 'Father-in-law / son-in-law', 'Parent / child', 'Siblings', 'Other family members'].includes(relationship))) || (kind === "Love & Marriage" && ["Partners", "Spouses"].includes(relationship)))
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

// Simple relationship wording
Object.assign(loveRelationshipCopy, {
  "Someone I’m thinking of dating": {
    "invitation": "Get to know each other at your own pace.",
    "context": "getting to know each other, talking openly and respecting boundaries without assuming mutual attraction"
  },
  "Someone I’m dating": {
    "invitation": "Understand each other as you spend time together.",
    "context": "talking and listening, time together, personal space and what each person wants"
  },
  "My boyfriend": {
    "invitation": "Explore how you can understand and support each other.",
    "context": "communication, affection, personal space and shared expectations"
  },
  "My girlfriend": {
    "invitation": "Explore how you can understand and support each other.",
    "context": "communication, affection, personal space and shared expectations"
  },
  "My partner": {
    "invitation": "Explore how you can understand and support each other.",
    "context": "communication, affection, personal space and shared expectations"
  },
  "Someone I’m engaged to": {
    "invitation": "Talk about the life you want to build together.",
    "context": "plans for marriage, money, family, personal space and sharing responsibilities"
  },
  "A friend": {
    "invitation": "Explore what helps your friendship grow.",
    "context": "listening, mutual support, time together and personal space"
  },
  "Friends with benefits": {
    "invitation": "Talk openly about what you both want and feel comfortable with.",
    "context": "mutual consent, emotional and physical boundaries, exclusivity and what to do if feelings change; these need direct conversations and cannot be known from numerology"
  }
})

export const familyRelationshipContext: Record<string, string> = {
  "My husband": "talking and listening, affection, money, personal space and sharing responsibilities",
  "My wife": "talking and listening, affection, money, personal space and sharing responsibilities",
  "My mother": "listening to each other, offering support, respecting choices and agreeing on family expectations",
  "My father": "listening to each other, offering support, respecting choices and agreeing on family expectations",
  "My son": "giving support, listening, allowing age-appropriate independence and sharing responsibilities fairly",
  "My daughter": "giving support, listening, allowing age-appropriate independence and sharing responsibilities fairly",
  "My brother": "supporting each other, sharing family responsibilities and respecting personal space",
  "My sister": "supporting each other, sharing family responsibilities and respecting personal space",
  "My grandmother": "spending time together, listening across generations and discussing the support each person wants",
  "My grandfather": "spending time together, listening across generations and discussing the support each person wants",
  "My grandchild": "spending time together, listening across generations and discussing the support each person wants",
  "My mother-in-law": "respect, privacy, family expectations and offering help without taking over",
  "My father-in-law": "respect, privacy, family expectations and offering help without taking over",
  "My son-in-law": "respect, privacy, family expectations and offering help without taking over",
  "My daughter-in-law": "respect, privacy, family expectations and offering help without taking over",
  "My brother-in-law": "respect, privacy, family expectations and offering help without taking over",
  "My sister-in-law": "respect, privacy, family expectations and offering help without taking over",
  "Another family member": "listening, support, personal boundaries and family responsibilities"
}
