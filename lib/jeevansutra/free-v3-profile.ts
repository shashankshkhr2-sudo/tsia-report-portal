import type { NumerologyCalculationResult } from '@/lib/numerology/types'
import { runNumerologyV3FromCalculation } from '@/lib/numerology-intelligence/engine'
import { FUNCTIONAL_QUALITIES } from '@/lib/numerology-intelligence/functionalqualities'

/** Free CORE-only projection. Draft repetition rules are never imported. */
export function freeV3Profile(c: NumerologyCalculationResult) {
 const result = runNumerologyV3FromCalculation(c)
 const findings = result.conclusions.conclusions
 .filter(n => n.allowedDomains.includes('CORE') && n.supportingEvidenceIds.length > 0 && n.strength !== 'INSUFFICIENT_EVIDENCE')
 .map(conclusion => {
  const quality = Object.values(FUNCTIONAL_QUALITIES).find(q => q.id === conclusion.functionalQualityId)!
  const evidence = result.evidence.filter(e => conclusion.supportingEvidenceIds.includes(e.id))
  const number = quality.number
  return {number, conclusion, evidence, isMulank:number===c.mulank.final,isBhagyank:number===c.bhagyank.final,isNameNumber:number===c.nameNumber.finalNumber,loShuCount:c.loShu.counts[number]}
 })
 // Presentation ordering only; V3 determines evidence strength and resolution.
 .sort((a,b) => Number(b.isMulank)-Number(a.isMulank) || Number(b.isBhagyank)-Number(a.isBhagyank) || Number(b.isNameNumber)-Number(a.isNameNumber) || a.number-b.number)
 .slice(0,3)
 const selected = findings.map(n=>n.conclusion.functionalQualityId)
 const combinations = result.crossQuality.resolutions.filter(r=>r.status==='RESOLVED' && r.ruleStatus==='PROVISIONAL_APPROVED' && (r.relationship==='COMPLEMENT' || r.relationship==='MODERATE') && r.allowedDomains.includes('CORE') && selected.includes(r.qualityA) && selected.includes(r.qualityB))
 return {engineVersion:result.engineVersion,findings,combinations}
}
