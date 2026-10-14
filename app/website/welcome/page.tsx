import Link from 'next/link'
import { CustomerGuidance } from '@/components/website/customer-guidance'
export default function WelcomePage() {
 return <main className="min-h-screen bg-[#FAF7F0] text-[#392e30]">
  <header className="border-b border-[#C5A15A]/30 bg-white"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4"><Link href="/website" className="font-serif text-xl tracking-wide text-[#64263B]">JEEVAN SUTRA</Link><nav aria-label="Customer navigation" className="flex flex-wrap gap-4 text-xs font-semibold text-[#64263B]"><Link href="/website/services">Services</Link><Link href="/website/compatibility">Compatibility</Link><Link href="/website/start">My Profile / Sign in</Link></nav></div></header>
  <section className="bg-[#64263B] px-5 py-8 text-center text-white"><p className="text-[10px] tracking-[0.2em] text-[#EAD8AD]">YOUR PERSONAL DISCOVERY</p><h1 className="mt-3 font-serif text-3xl sm:text-4xl">Get to know yourself.</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/85">Your numbers, your patterns and a starting point for understanding more.</p></section>
  <CustomerGuidance />
  <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6"><div className="rounded-2xl border border-[#C5A15A]/40 bg-[#F4EBD9] p-5 sm:p-7"><h2 className="font-serif text-2xl text-[#64263B]">A conversation can bring more context.</h2><p className="mt-3 max-w-2xl text-sm leading-6">Explore reports and practitioner sessions for your questions about career, relationships and personal growth.</p><Link href="/website/services" className="mt-4 inline-block font-semibold text-[#64263B] underline underline-offset-4">Explore services & prices →</Link><p className="mt-3 text-xs text-[#766b67]">Paid checkout and consultation booking are coming soon.</p></div></section>
  <footer className="border-t border-[#eadfd4] px-5 py-6 text-center text-xs leading-6 text-[#766b67]">Traditional numerology-based reflection. Your experiences and choices matter.<br />© Jeevan Sutra · The Complete Guidance Experience</footer>
 </main>
}
