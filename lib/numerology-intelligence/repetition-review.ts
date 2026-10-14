import type { NumerologyDigit } from '@/lib/numerology/types'
/** Research-only extension. Never feed these draft labels into production evidence. */
export const REPETITION_REVIEW_VERSION = 'JS_V3_REPETITION_REVIEW_0.1' as const
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
 flags:[...(count>4?['HIGHER_COUNT_UNDEFINED']:[]),...(number===7 && count>=3?['SOURCE_CONFLICT_REPEATED_SEVEN']:[]),'PRACTITIONER_REVIEW_REQUIRED','NO_HEALTH_OR_LIFE_EVENT_INFERENCE']}
}
