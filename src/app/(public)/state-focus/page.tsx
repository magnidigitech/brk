import { sanityFetch } from '@/sanity/lib/sanityFetch'
import StateFocusClient from '@/components/StateFocusClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.state.title'][lang] || uiTranslations['meta.state.title']['en']
  const description = uiTranslations['meta.state.desc'][lang] || uiTranslations['meta.state.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bramakrishna.mp.in/state-focus',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/state-focus',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

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
        'name': lang === 'te' ? 'రాష్ట్ర ప్రాధాన్యతలు' : 'State Focus',
        'item': 'https://bramakrishna.mp.in/state-focus'
      }
    ]
  }

  return (
    <>
      <JsonLd schema={[breadcrumbSchema]} />
      <StateFocusClient sectors={sectors} />
    </>
  )
}
