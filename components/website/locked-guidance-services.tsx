import Link from 'next/link'
const topics = [
  ['Improve My Career', 'Explore where your strengths fit and what to develop next.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Understand My Love Life', 'Explore your relationship patterns and emotional needs.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Understand Us Together', 'Explore the patterns worth discussing with one person.', 'Personal compatibility · ₹249', 'personal_comparison'],
  ['Find My Direction', 'Connect your personal patterns with the choices ahead.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Develop My Personality', 'Explore ways to build on your strengths.', 'Personal guidance report · ₹199', 'focused_report'],
  ['Improve My Working Relationships', 'Explore different approaches to work and communication.', 'Professional compatibility · ₹249', 'professional_comparison'],
  ['Personalized Remedies', 'Explore supporting days, colours and remedies for your profile.', 'Remedy report · Coming soon', 'personalized_remedies'],
]
export function LockedGuidanceServices() {
  return <section className="mt-6 rounded-3xl border border-[#eadfd4] bg-white p-6"><h2 className="font-serif text-3xl">Go deeper with personal guidance</h2><p className="mt-3">Your basic profile is free. Personalized answers are part of our paid services.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{topics.map(([title, teaser, service, id]) => <article key={title} className="rounded-xl border border-[#eadfd4] p-5"><p className="text-xs font-semibold text-[#a57a40]">LOCKED · PAID GUIDANCE</p><h3 className="mt-2 font-serif text-2xl">{title}</h3><p className="mt-3">{teaser}</p><p className="mt-3 text-sm font-semibold">{service}</p><Link href={`/website/services#${id}`} className="mt-4 inline-block text-[#762b40] underline">View service</Link></article>)}</div><p className="mt-5 text-sm">Checkout is coming soon. No payment is collected and personalized paid content is not unlocked yet.</p></section>
}
