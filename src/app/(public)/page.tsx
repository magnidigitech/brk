import HomeDashboard from '@/components/HomeDashboard'
import { sanityFetch } from '@/sanity/lib/sanityFetch'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { uiTranslations } from '@/lib/translations'

// Always fetch live data from Sanity — no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.home.title'][lang] || uiTranslations['meta.home.title']['en']
  const description = uiTranslations['meta.home.desc'][lang] || uiTranslations['meta.home.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/',
      type: 'website',
      images: [
        {
          url: 'https://bhashyamramakrishna.in/profile.jpg',
          alt: 'Bhashyam Ramakrishna'
        }
      ],
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://bhashyamramakrishna.in/profile.jpg'],
      creator: '@bhashyambrk',
    }
  }
}

export default async function Page() {
  // Fetch from Sanity.io CMS concurrently
  let dailyUpdates: any[] = []
  let updates: any[] = []
  let news: any[] = []
  let gallery: any[] = []
  let settings: any = null

  try {
    const [fetchedDaily, fetchedUpdates, fetchedNews, fetchedGallery, fetchedSettings] = await Promise.all([
      sanityFetch<any[]>({
        query: `*[_type == "dailyUpdate"] | order(date desc)[0...10] {
          _id,
          title,
          date,
          summary,
          body,
          "image": mainImage,
          images,
          speechUrl
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryUpdate"] | order(date desc)[0...10] {
          _id,
          title,
          date,
          summary,
          speechUrl,
          "documentUrl": document.asset->url,
          "image": mainImage,
          images
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "pressRelease"] | order(publishedAt desc)[0...10] {
          _id,
          title,
          publishedAt,
          excerpt,
          body,
          "image": mainImage,
          images,
          speechUrl
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
          stateOffice,
          introVideoUrl,
          introVideoTitle,
          showIntroVideo,
          customEmbedCode,
          showCustomEmbed
        }`
      })
    ])

    dailyUpdates = fetchedDaily || []
    updates = fetchedUpdates || []
    news = fetchedNews || []
    gallery = fetchedGallery || []
    settings = fetchedSettings
  } catch (error) {
    console.error('Failed to fetch from Sanity, using fallback content:', error)
  }

  const displayDaily = dailyUpdates || []
  const displayUpdates = updates || []
  const displayNews = news || []
  const displayGallery = gallery || []
  const displaySettings = settings || {}

  return (
    <>
      <HomeDashboard
        dailyUpdates={displayDaily}
        updates={displayUpdates}
        news={displayNews}
        gallery={displayGallery}
        settings={displaySettings}
      />
    </>
  )
}
