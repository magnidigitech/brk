import { sanityFetch } from '@/sanity/lib/sanityFetch'
import DevelopmentWorksClient from '@/components/DevelopmentWorksClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.development.title'][lang] || uiTranslations['meta.development.title']['en']
  const description = uiTranslations['meta.development.desc'][lang] || uiTranslations['meta.development.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bramakrishna.mp.in/development-works',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/development-works',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function DevelopmentWorksPage() {
  let projects: any[] = []

  try {
    const fetchedProjects = await sanityFetch<any[]>({
      query: `*[_type == "developmentProject"] | order(order asc) {
        _id,
        category,
        title,
        location,
        desc,
        progress
      }`
    })
    projects = fetchedProjects || []
  } catch (error) {
    console.error('Failed to fetch development projects from Sanity:', error)
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
        'name': lang === 'te' ? 'అభివృద్ధి పనులు' : 'Development Works',
        'item': 'https://bramakrishna.mp.in/development-works'
      }
    ]
  }

  return (
    <>
      <JsonLd schema={[breadcrumbSchema]} />
      <DevelopmentWorksClient projects={projects} />
    </>
  )
}
