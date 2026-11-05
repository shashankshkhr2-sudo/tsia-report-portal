import { WebsiteHeader } from '@/components/website/website-header'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  icons: { icon: [{ url: "/images/jeevansutra-favicon-192.png", sizes: "192x192", type: "image/png" }], apple: "/images/jeevansutra-favicon-192.png" },
 title: 'Jeevan Sutra — The Complete Guidance Experience',
 description: 'Explore traditional numerology, personal and professional connections, and practitioner guidance with Jeevan Sutra.',
}
export default function WebsiteLayout({ children }: { children: React.ReactNode }) { return <><WebsiteHeader />{children}<footer className="border-t border-[#D2B577]/40 bg-[#FAF7F0] px-5 py-8 text-[#64263B]"><nav aria-label="Website policies" className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-4 text-sm"><a href="/website/privacy" className="underline underline-offset-4">Privacy Policy</a><a href="/website/terms" className="underline underline-offset-4">Terms of Use</a></nav></footer></> }
