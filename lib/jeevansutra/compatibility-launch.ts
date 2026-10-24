import 'server-only'
import { calculateChaldeanName } from '@/lib/numerology/chaldean'
import { calculateNumerologyV2 } from '@/lib/numerology/calculations'

export const launchKinds = ['Personal Relationship Compatibility', 'Business Partnership Compatibility', 'Professional Compatibility', 'Interaction Guidance', "Family Compatibility"] as const
export function comparisonPerson(name: string, dob: string) {
  name = name.trim().replace(/\s+/g, ' ')
  if (name.length > 120 || !/^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/.test(name)) throw new Error('Enter a name in English letters, spaces, apostrophes or hyphens.')
  dob = dob.trim()
  if (dob) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob)
    if (!match) throw new Error('Enter the date as DD/MM/YYYY.')
    const [, d, m, y] = match
    const date = new Date(`${y}-${m}-${d}T00:00:00Z`)
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== `${y}-${m}-${d}` || +y < 1900 || date > new Date()) throw new Error('Enter a valid date of birth between 1900 and today.')
  }
  return { name, dob }
}
const themes: Record<number, string> = { 1: 'Initiative and independence', 2: 'Cooperation and sensitivity', 3: 'Learning and creative expression', 4: 'Structure and unconventional approaches', 5: 'Communication and adaptability', 6: 'Care and responsibility', 7: 'Reflection and analysis', 8: 'Persistence and resource management', 9: 'Conviction and purposeful action' }
function summary(person: { name: string; dob: string }) {
  const energy = calculateChaldeanName(person.name)
  if (!person.dob) return { name: person.name, nameNumber: energy.finalNumber, theme: themes[energy.finalNumber] }
  const calculation = calculateNumerologyV2({ fullName: person.name, dateOfBirth: person.dob })
  return { name: person.name, nameNumber: energy.finalNumber, theme: themes[energy.finalNumber], mulank: calculation.mulank.final, bhagyank: calculation.bhagyank.final }
}
export function launchPreview(kind: string, self: { name: string; dob: string }, other: { name: string; dob: string }) {
  const people = [summary(self), summary(other)]
  const shared = people[0].nameNumber === people[1].nameNumber
  return {
    version: 'JS_COMPATIBILITY_LAUNCH_1', kind, people,
    observations: [shared ? 'Your names share a reduced Chaldean number. Use this common symbolic theme as a starting point for discussing how you each express yourselves.' : 'Your names have different reduced Chaldean numbers. Explore your different approaches without assuming that differences mean conflict.', other.dob ? 'Both dates of birth are included. Discuss how your individual priorities and ways of responding compare in everyday situations.' : 'This comparison includes name-based guidance for the other person. Their DOB-based patterns are unavailable.'],
    question: kind === launchKinds[4] ? "How can you support each other as family while respecting individual needs, boundaries and responsibilities?" : kind === launchKinds[1] ? 'How will you agree roles, decisions and responsibilities?' : kind === launchKinds[2] ? 'How do you each prefer to receive feedback and resolve disagreements?' : kind === launchKinds[3] ? 'What does each person need to clarify before agreeing the next step?' : 'What helps each of you feel heard and respected?',
    action: 'Choose one expectation to discuss together and agree one practical next step.',
    limitation: 'A brief traditional numerology-based reflection, not a full reading or proof of compatibility, private feelings or future outcomes.',
  }
}
export type LaunchPreview = ReturnType<typeof launchPreview>
