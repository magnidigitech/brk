import { sanityFetch } from '@/sanity/lib/sanityFetch'
import ParliamentaryUpdatesClient from '@/components/ParliamentaryUpdatesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export default async function ParliamentaryUpdatesPage() {
  let updates: any[] = []

  try {
    updates = await sanityFetch<any[]>({
      query: `*[_type == "parliamentaryUpdate"] | order(date desc) {
        _id,
        title,
        date,
        summary,
        speechUrl,
        "documentUrl": document.asset->url
      }`
    })
  } catch (error) {
    console.error('Failed to fetch parliamentary updates from Sanity:', error)
  }

  return (
    <ParliamentaryUpdatesClient updates={updates || []} />
  )
}
