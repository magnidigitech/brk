import { sanityFetch } from '@/sanity/lib/sanityFetch'
import ParliamentaryUpdatesClient from '@/components/ParliamentaryUpdatesClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.parliament.title'][lang] || uiTranslations['meta.parliament.title']['en']
  const description = uiTranslations['meta.parliament.desc'][lang] || uiTranslations['meta.parliament.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bramakrishna.mp.in/parliamentary-updates',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/parliamentary-updates',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

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
        'name': lang === 'te' ? 'పార్లమెంటరీ అప్‌డేట్స్' : 'Parliamentary Updates',
        'item': 'https://bramakrishna.mp.in/parliamentary-updates'
      }
    ]
  }

  const articleSchemas = (updates || []).slice(0, 10).map((up) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': up.title || 'Parliamentary Update',
    'datePublished': up.date,
    'description': up.summary || '',
    'author': {
      '@type': 'Person',
      'name': 'Shri Bhashyam Ramakrishna'
    },
    'publisher': {
      '@type': 'GovernmentOrganization',
      'name': 'Parliament of India'
    }
  }))

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, ...articleSchemas]} />
      <ParliamentaryUpdatesClient updates={updates || []} />
    </>
  )
}
