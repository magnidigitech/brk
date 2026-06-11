import { sanityFetch } from '@/sanity/lib/sanityFetch'
import PressReleasesClient from '@/components/PressReleasesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export default async function PressReleasesPage() {
  let releases: any[] = []

  try {
    releases = await sanityFetch<any[]>({
      query: `*[_type == "pressRelease"] | order(publishedAt desc) {
        _id,
        title,
        publishedAt,
        excerpt,
        body,
        "image": mainImage
      }`
    })
  } catch (error) {
    console.error('Failed to fetch press releases from Sanity:', error)
  }

  return (
    <PressReleasesClient releases={releases || []} />
  )
}
