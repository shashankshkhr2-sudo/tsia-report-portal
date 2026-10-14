import Link from 'next/link'
const topics = [
  ['Improve My Career', 'Where could your strengths fit in your work? Explore what to build on next.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Understand My Love Life', 'What helps you feel understood and close to someone? Explore your love life.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Understand Us Together', 'Explore the patterns worth discussing with one person.', 'Personal compatibility · ₹249', 'personal_comparison'],
  ['Find My Direction', 'What matters most to you? Explore the choices and possibilities ahead.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Develop My Personality', 'How could you feel more confident being yourself? Explore ways to grow.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Improve My Working Relationships', 'Explore different approaches to work and communication.', 'Professional compatibility · ₹249', 'professional_comparison'],
  ['Supporting Days & Colours', 'Discover the days and colours traditionally linked with your profile.', 'Automated report · ₹249', 'supporting_days_colours'],
  ['Personalised Remedies', 'Explore personalised suggestions with practitioner review.', 'Reviewed report · ₹699', 'personalized_remedies'],
  ['Name Correction Review', 'Could a different spelling suit your profile? Review options with a practitioner.', 'Name review · ₹999', 'name_correction'],
  ['Chat with Our Numerologist', 'Choose what you want to discuss. Start with what matters most to you.', '15 minutes · ₹449 / 30 minutes · ₹799', 'chat_15'],
]
export function LockedGuidanceServices() {
  return <section className="mt-6 rounded-2xl border border-[#eadfd4] bg-white p-6"><h2 className="font-serif text-3xl">Explore Your Next Step</h2><p className="mt-3">You have started getting to know yourself. Explore paid guidance for your career, relationships and personal growth.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{topics.map(([title, teaser, service, id]) => <article key={title} className="rounded-xl border border-[#eadfd4] p-5"><p className="text-xs font-semibold text-[#a57a40]">PAID SERVICE</p><h3 className="mt-2 font-serif text-2xl">{title}</h3><p className="mt-3">{teaser}</p><p className="mt-3 text-sm font-semibold">{service}</p><Link href={`/website/services#${id}`} className="mt-4 inline-block text-[#762b40] underline">View service</Link></article>)}</div><p className="mt-5 text-sm">Checkout is coming soon. No payment is collected and personalized paid content is not unlocked yet.</p></section>
}
