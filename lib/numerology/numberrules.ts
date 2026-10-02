// lib/numerology/numberrules.ts

import type {
  GrahaName,
  NumerologyDigit,
} from './types'

export type NumberRule = {
  number: NumerologyDigit
  graha: GrahaName
  strengths: string[]
  themes: string[]
  repetitionStrengths: string[]
  possibleExcess: string[]
  developmentAreas: string[]
}

export const NUMBER_RULES: Record<
  NumerologyDigit,
  NumberRule
> = {
  1: {
    number: 1,
    graha: 'Surya',
    strengths: ['initiative', 'individuality', 'confidence', 'leadership', 'self-direction'],
    themes: ['independent action', 'personal identity', 'decision-making', 'taking initiative'],
    repetitionStrengths: ['stronger initiative', 'greater self-direction', 'stronger independent decision-making'],
    possibleExcess: ['excessive self-reliance', 'difficulty accepting support', 'overemphasis on personal direction'],
    developmentAreas: ['initiative', 'confident expression', 'independent decision-making'],
  },

  2: {
    number: 2,
    graha: 'Chandra',
    strengths: ['sensitivity', 'cooperation', 'emotional awareness', 'receptivity', 'relationship awareness'],
    themes: ['emotional connection', 'cooperation', 'receptive communication', 'partnership'],
    repetitionStrengths: ['stronger emotional awareness', 'greater sensitivity to others', 'stronger cooperative instinct'],
    possibleExcess: ['emotional over-absorption', 'over-sensitivity', 'difficulty separating personal feelings from others'],
    developmentAreas: ['receptive listening', 'emotional awareness', 'cooperation'],
  },

  3: {
    number: 3,
    graha: 'Guru',
    strengths: ['learning', 'expression', 'creativity', 'communication', 'guidance', 'knowledge'],
    themes: ['creative expression', 'communication', 'learning', 'sharing knowledge'],
    repetitionStrengths: ['strong creativity', 'strong communication potential', 'greater expressive ability'],
    possibleExcess: ['scattered focus', 'too many ideas at once', 'difficulty maintaining structured expression'],
    developmentAreas: ['structured expression', 'communication', 'learning', 'creative development'],
  },

  4: {
    number: 4,
    graha: 'Rahu',
    strengths: ['structure', 'organisation', 'systems', 'discipline', 'problem-solving'],
    themes: ['organisation', 'systematic thinking', 'discipline', 'unconventional problem-solving'],
    repetitionStrengths: ['strong organisation', 'greater discipline', 'strong system-building ability'],
    possibleExcess: ['rigidity', 'over-structuring', 'difficulty adapting when plans change'],
    developmentAreas: ['routines', 'organisation', 'systems', 'follow-through'],
  },

  5: {
    number: 5,
    graha: 'Budh',
    strengths: ['communication', 'adaptability', 'practical intelligence', 'flexibility', 'balance'],
    themes: ['adaptability', 'communication', 'balanced thinking', 'flexible decision-making'],
    repetitionStrengths: ['strong adaptability', 'strong communication ability', 'greater practical flexibility'],
    possibleExcess: ['restlessness', 'inconsistency', 'frequent changes of direction'],
    developmentAreas: ['adaptability', 'balanced communication', 'flexible decision-making'],
  },

  6: {
    number: 6,
    graha: 'Shukra',
    strengths: ['relationships', 'responsibility', 'harmony', 'family', 'care', 'aesthetics'],
    themes: ['relationship harmony', 'family responsibility', 'care', 'shared responsibility'],
    repetitionStrengths: ['strong sense of responsibility', 'greater family orientation', 'stronger caring instinct'],
    possibleExcess: ['over-responsibility', 'taking on too much for others', 'difficulty maintaining personal boundaries'],
    developmentAreas: ['shared responsibility', 'relationship harmony', 'care without overburdening oneself'],
  },

  7: {
    number: 7,
    graha: 'Ketu',
    strengths: ['analysis', 'reflection', 'research', 'intuition', 'introspection'],
    themes: ['deep thinking', 'research', 'reflection', 'inner understanding'],
    repetitionStrengths: ['strong analytical ability', 'greater depth of reflection', 'stronger intuitive observation'],
    possibleExcess: ['overthinking', 'withdrawal', 'excessive isolation'],
    developmentAreas: ['reflection', 'research', 'introspection', 'patient review'],
  },

  8: {
    number: 8,
    graha: 'Shani',
    strengths: ['discipline', 'management', 'endurance', 'material responsibility', 'patience'],
    themes: ['long-term discipline', 'management', 'material responsibility', 'endurance'],
    repetitionStrengths: ['strong management capacity', 'greater endurance', 'strong material responsibility'],
    possibleExcess: ['excessive pressure', 'over-seriousness', 'difficulty relaxing responsibilities'],
    developmentAreas: ['patience', 'long-term discipline', 'financial organisation', 'material organisation'],
  },

  9: {
    number: 9,
    graha: 'Mangal',
    strengths: ['action', 'courage', 'drive', 'ideals', 'purpose', 'intensity'],
    themes: ['purposeful action', 'courage', 'drive', 'broader vision'],
    repetitionStrengths: ['strong drive', 'greater courage', 'strong sense of purpose'],
    possibleExcess: ['impatience', 'excessive intensity', 'acting before sufficient reflection'],
    developmentAreas: ['constructive courage', 'purposeful action', 'broader perspective'],
  },
}

export function getNumberRule(
  number: NumerologyDigit
): NumberRule {
  return NUMBER_RULES[number]
}