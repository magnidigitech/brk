import { sanityFetch } from '@/sanity/lib/client'
import StateFocusClient from '@/components/StateFocusClient'

export const revalidate = 0 // Always fetch fresh from Sanity

export default async function StateFocusPage() {
  let sectors: any[] = []

  try {
    const fetchedSectors = await sanityFetch<any[]>({
      query: `*[_type == "stateSector"] | order(order asc) {
        _id,
        title,
        short,
        iconName,
        vision,
        concerns
      }`
    })
    sectors = fetchedSectors || []
  } catch (error) {
    console.error('Failed to fetch state sectors from Sanity:', error)
  }

  return (
    <StateFocusClient sectors={sectors} />
  )
}
