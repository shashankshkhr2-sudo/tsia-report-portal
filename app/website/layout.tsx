import { WebsiteHeader } from '@/components/website/website-header'
import type { Metadata } from 'next'
export const metadata: Metadata = {
 title: 'Jeevan Sutra — The Complete Guidance Experience',
 description: 'Explore traditional numerology, personal and professional connections, and practitioner guidance with Jeevan Sutra.',
}
export default function WebsiteLayout({ children }: { children: React.ReactNode }) { return <><WebsiteHeader />{children}</> }
