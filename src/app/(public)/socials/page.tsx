import { sanityFetch } from '@/sanity/lib/sanityFetch'
import SocialsClient from '@/components/SocialsClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.socials.title'][lang] || uiTranslations['meta.socials.title']['en']
  const description = uiTranslations['meta.socials.desc'][lang] || uiTranslations['meta.socials.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/socials',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/socials',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function SocialsPage() {
  let settings = null

  try {
    settings = await sanityFetch<any>({
      query: `*[_type == "siteSettings"][0] {
        candidateName,
        roleBadge,
        tagline,
        socialLinks
      }`
    })
  } catch (error) {
    console.error('Failed to fetch site settings for socials page from Sanity:', error)
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
        'item': 'https://bhashyamramakrishna.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': lang === 'te' ? 'సోషల్ మీడియా' : 'Socials',
        'item': 'https://bhashyamramakrishna.in/socials'
      }
    ]
  }

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <SocialsClient settings={settings} />
    </>
  )
}
