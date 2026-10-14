import type { NumerologyDigit } from '@/lib/numerology/types'
/** Research-only extension. Never feed these draft labels into production evidence. */
export const REPETITION_REVIEW_VERSION = 'JS_V3_REPETITION_REVIEW_0.2' as const
export const REPETITION_REVIEW_STATUS = 'DRAFT_NOT_APPROVED' as const
export const REPETITION_REFERENCE = 'https://www.jcchaudhry.com/article/lo-shu-grid-repeat-number-meanings'
export const REPETITION_DRAFT: Record<NumerologyDigit, readonly [string,string,string,string]> = {
 1:['Reserved expression','Effective communication','Talkativeness','Written expression'],
 2:['Sensitivity, intuition','Judgement','Imagination; moodiness','Reactive anger'],
 3:['Memory, communication','Creativity','Imagination; withdrawal','Fearfulness, impracticality'],
 4:['Order, practicality','Discipline, completion','Hard work; inflexibility','Heavy labour'],
 5:['Affection, inspiration','Confidence; emotionality','Courage; impulsiveness','Overexcitement'],
 6:['Advice, family attachment','Beauty, creativity','Stress, irritability','Creativity; vulnerability'],
 7:['Experiential learning','Learning through setbacks','Disappointment','Predicted losses'],
 8:['Difficulty, discomfort','Stubbornness; learning','Material focus; later growth','Rapid progress'],
 9:['Intelligence, ambition','Judgement; superiority','Helpfulness; irritability','Intelligence, frankness'],
}
export function repetitionReview(number:NumerologyDigit,count:number) {
 if(!Number.isInteger(count) || count<1)throw new Error('Positive integer count required')
 return {version:REPETITION_REVIEW_VERSION,status:REPETITION_REVIEW_STATUS,number,count,source:REPETITION_REFERENCE,
 sourceSummary:count<=4?REPETITION_DRAFT[number][count-1]:null,
 strengths:[] as string[],possibleExcess:[] as string[],
 reviewRequired:true as const,productionEligible:false as const,
 conflicts: REPETITION_CONFLICTS.filter(item=>item.number===number && (item.counts as readonly number[]).includes(count)),
 flags:[...(count>4?['HIGHER_COUNT_UNDEFINED']:[]),...(number===7 && count>=3?['SOURCE_CONFLICT_REPEATED_SEVEN']:[]),'PRACTITIONER_REVIEW_REQUIRED','NO_HEALTH_OR_LIFE_EVENT_INFERENCE']}
}

/** Source disagreement records are research metadata, never production conclusions. */
export const REPETITION_CONFLICTS = [
 {number:1,counts:[4],issue:'Written expression versus emotional concealment. Do not merge these into one asserted trait.'},
 {number:3,counts:[3,4],issue:'Imagination is a shared theme; withdrawal, sensitivity and fear are different assertions. Neither follows automatically from the count.'},
 {number:4,counts:[3],issue:'Hard work is shared; inflexibility versus family protectiveness differs. Family-specific claims require separate review.'},
 {number:6,counts:[2,3],issue:'Beauty/creativity and stress versus caregiving/over-involvement. Do not convert caregiving into a diagnosis of stress.'},
 {number:7,counts:[2,3,4],issue:'Setback/loss narratives conflict with intuition and favourable excess-seven descriptions. No automatic loss prediction.'},
 {number:8,counts:[2,3,4],issue:'Stubbornness, age-based growth and rapid progress differ from endurance/overwork. Exclude age and financial-outcome predictions.'},
] as const
export const REPETITION_COMPARISON_SOURCES = [
 REPETITION_REFERENCE,
 'https://www.jcchaudhry.com/article/8-planes-lo-shu-grid-and-their-meaning',
 'https://www.occultscience.in/repetition-of-numbers-in-numerology/',
 'https://namietamodi.com/missing-numbers-lo-shu-grid-remedies/',
] as const
