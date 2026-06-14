import { sanityFetch } from '@/sanity/lib/sanityFetch'
import PressReleasesClient from '@/components/PressReleasesClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.press.title'][lang] || uiTranslations['meta.press.title']['en']
  const description = uiTranslations['meta.press.desc'][lang] || uiTranslations['meta.press.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bramakrishna.mp.in/press-releases',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/press-releases',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

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
        "image": mainImage,
        images,
        speechUrl
      }`
    })
  } catch (error) {
    console.error('Failed to fetch press releases from Sanity:', error)
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': lang === 'te' ? 'హోమ్' : 'Home',
        'item': 'https://bramakrishna.mp.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': lang === 'te' ? 'పత్రికా ప్రకటనలు' : 'Press Releases',
        'item': 'https://bramakrishna.mp.in/press-releases'
      }
    ]
  }

  const articleSchemas = (releases || []).slice(0, 10).map((rel) => ({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': rel.title || 'Press Release',
    'datePublished': rel.publishedAt,
    'description': rel.excerpt || '',
    'author': {
      '@type': 'Person',
      'name': 'Shri Bhashyam Ramakrishna'
    }
  }))

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, ...articleSchemas]} />
      <PressReleasesClient releases={releases || []} />
    </>
  )
}
