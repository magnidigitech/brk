import HomeDashboard from '@/components/HomeDashboard'
import { sanityFetch } from '@/sanity/lib/sanityFetch'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'
import { getRoleTitle } from '@/lib/roleHelper'

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
      canonical: 'https://bramakrishna.mp.in',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
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
          showIntroVideo
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

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Shri Bhashyam Ramakrishna',
    'url': 'https://bramakrishna.mp.in',
    'image': 'https://bramakrishna.mp.in/images/brk.png',
    'jobTitle': getRoleTitle(lang),
    'memberOf': {
      '@type': 'GovernmentOrganization',
      'name': 'Parliament of India',
      'sameAs': 'https://en.wikipedia.org/wiki/Parliament_of_India'
    },
    'affiliation': {
      '@type': 'PoliticalParty',
      'name': 'Telugu Desam Party',
      'alternateName': 'TDP',
      'sameAs': 'https://en.wikipedia.org/wiki/Telugu_Desam_Party'
    },
    'sameAs': [
      'https://www.instagram.com/ramakrishnabhashyam/',
      'https://www.youtube.com/@bhashyamramakrishnaofficial',
      'https://x.com/bhashyambrk'
    ]
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Bhashyam Ramakrishna | Official Rajya Sabha Portal',
    'url': 'https://bramakrishna.mp.in'
  }

  return (
    <>
      <JsonLd schema={[personSchema, websiteSchema]} />
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
