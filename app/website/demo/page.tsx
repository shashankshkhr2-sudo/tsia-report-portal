import Link from 'next/link'
import { CustomerGuidance } from '@/components/website/customer-guidance'
import { calculateNumerologyV2 } from '@/lib/numerology/calculations'
import { runNumerologyV3FromCalculation } from '@/lib/numerology-intelligence/engine'
import { buildUniversalNumerologyIntelligence } from '@/lib/consultation/universal-numerology-intelligence'
import { guidanceTopics } from '@/lib/jeevansutra/intake'
export default function DemoPage() {
 const calculation = calculateNumerologyV2({ fullName: 'Test Customer', dateOfBirth: '1995-06-15' })
 const intelligence = runNumerologyV3FromCalculation(calculation)
 const previews = Object.fromEntries(guidanceTopics.map(topic => {
  const guidance = buildUniversalNumerologyIntelligence({ topic, clientConcern: '', calculation, conclusions: intelligence.conclusions })
  return [topic, { scope: guidance.scope.employeeExplanation, insights: guidance.relevantQualities.slice(0,2).map(item => ({ title: item.title, explanation: item.interpretation, basis: item.verificationStatus })), question: guidance.suggestedQuestions[0] || 'What would you most like to understand?', action: guidance.behaviouralDevelopment[0]?.practicalImprovement || '', limitation: 'Fictional demonstration using traditional numerology rules. Answers demonstrate the intake flow and do not alter this precomputed sample. Nothing is saved to the database; demo history clears when you reload.' }]
 })) as Record<typeof guidanceTopics[number], { scope: string; insights: { title: string; explanation: string; basis: string }[]; question: string; action: string; limitation: string }>
 return <main className="min-h-screen bg-[#f9f5ef] text-[#392e30]"><header className="bg-[#762b40] px-5 py-8 text-white"><div className="mx-auto max-w-4xl"><Link href="/website/services" className="underline">← All services</Link><h1 className="mt-4 font-serif text-4xl">Customer experience demo</h1><p className="mt-4 leading-7">Fictional test customer · 15/06/1995. No OTP, payment or database access. This demonstrates the profile, questions and preview screens.</p></div></header><CustomerGuidance demo={{ profile: { profile: { name: 'Test Customer', dob: '15/06/1995' }, calculation, history: [] }, previews }} /></main>
}
