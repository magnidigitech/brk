import HomeDashboard from '@/components/HomeDashboard'
import { sanityFetch } from '@/sanity/lib/sanityFetch'

// Always fetch live data from Sanity — no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  // Fetch from Sanity.io CMS concurrently
  let updates: any[] = []
  let news: any[] = []
  let gallery: any[] = []
  let settings: any = null

  try {
    const [fetchedUpdates, fetchedNews, fetchedGallery, fetchedSettings] = await Promise.all([
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryUpdate"] | order(date desc)[0...10] {
          _id,
          title,
          date,
          summary,
          speechUrl,
          "documentUrl": document.asset->url
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "pressRelease"] | order(publishedAt desc)[0...10] {
          _id,
          title,
          publishedAt,
          excerpt,
          body,
          "image": mainImage
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "gallery"] | order(date desc)[0...3] {
          _id,
          title,
          caption,
          date,
          image
        }`
      }),
      sanityFetch<any>({
        query: `*[_type == "siteSettings"][0] {
          candidateName,
          roleBadge,
          tagline,
          partyName,
          stateRepresented,
          socialLinks,
          delhiOffice,
          stateOffice
        }`
      })
    ])

    updates = fetchedUpdates || []
    news = fetchedNews || []
    gallery = fetchedGallery || []
    settings = fetchedSettings
  } catch (error) {
    console.error('Failed to fetch from Sanity, using fallback content:', error)
  }

  const displayUpdates = updates || []
  const displayNews = news || []
  const displayGallery = gallery || []
  const displaySettings = settings || {}

  return (
    <HomeDashboard
      updates={displayUpdates}
      news={displayNews}
      gallery={displayGallery}
      settings={displaySettings}
    />
  )
}

