import type { Metadata } from 'next'
import { NameGuidanceAccess } from '@/components/website/name-guidance-access'

export const metadata: Metadata = {
 title: 'Name Guidance | Jeevan Sutra',
 description: 'Explore personal, baby, business, brand, project and product names with traditional numerology and practitioner guidance.',
}
export default function NameDiscoveryPage() { return <NameGuidanceAccess /> }
