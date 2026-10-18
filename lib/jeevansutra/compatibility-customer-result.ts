import 'server-only'
import type { CustomerReading } from './compatibility-contract'
// Explicit output projection for both historic and draft records.
export function customerResult(value: unknown): CustomerReading {
 const r = value as Record<string, any>
 const people = Array.isArray(r.people) ? r.people.map((p: { name: string }) => ({ name: p.name })) : []
 if (r.version === 'JS_COMPATIBILITY_V2_DRAFT_1') return {
  version: r.version, status: 'draft', kind: r.kind, relationship: r.relationship, ...(r.relationshipContextVersion === "JS_RELATIONSHIP_CONTEXT_1" ? { relationshipContextVersion: "JS_RELATIONSHIP_CONTEXT_1" as const } : {}), ...(r.roles && typeof r.roles.self === 'string' && typeof r.roles.other === 'string' ? { roles: { self: r.roles.self, other: r.roles.other } } : {}), people,
  sections: r.sections.map((s: { title: string; text: string }) => ({ title: s.title, text: s.text })), limitation: r.limitation,
 }
 return { version: 'JS_COMPATIBILITY_LAUNCH_1', kind: r.kind, people, observations: r.observations || [], limitation: r.limitation }
}
