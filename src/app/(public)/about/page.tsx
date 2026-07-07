import { sanityFetch } from '@/sanity/lib/sanityFetch'
import AboutClient from '@/components/AboutClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'
import { getRoleTitle } from '@/lib/roleHelper'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const title = uiTranslations['meta.about.title'][lang] || uiTranslations['meta.about.title']['en']
  const description = uiTranslations['meta.about.desc'][lang] || uiTranslations['meta.about.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/about',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/about',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function AboutPage() {
  let aboutData: any = {}
  let siteSettings: any = {}

  try {
    const [fetchedAbout, fetchedSettings] = await Promise.all([
      sanityFetch<any>({
        query: `*[_type == "aboutPage"][0] {
          title,
          subtitle,
          badgeText,
          profileShortName,
          bioParagraph1,
          bioParagraph2,
          eduTitle,
          eduContent,
          publicTitle,
          publicContent,
          focusAreas,
          values,
          quoteText,
          quoteAuthor,
          summaryContent
        }`
      }),
      sanityFetch<any>({
        query: `*[_type == "siteSettings"][0] {
          partyName,
          stateRepresented,
          roleBadge
        }`
      })
    ])

    aboutData = fetchedAbout || {}
    siteSettings = fetchedSettings || {}
  } catch (error) {
    console.error('Failed to fetch from Sanity, using default local data:', error)
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': uiTranslations['meta.about.title'][lang] || uiTranslations['meta.about.title']['en'],
    'description': uiTranslations['meta.about.desc'][lang] || uiTranslations['meta.about.desc']['en'],
    'url': 'https://bhashyamramakrishna.in/about',
    'mainEntity': {
      '@type': 'Person',
      'name': 'Shri Bhashyam Rama Krishna',
      'jobTitle': getRoleTitle(lang),
      'affiliation': {
        '@type': 'PoliticalParty',
        'name': 'Telugu Desam Party',
        'alternateName': 'TDP'
      }
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q1'][lang],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a1'][lang]
        }
      },
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q2'][lang],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a2'][lang]
        }
      },
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q3'][lang],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a3'][lang]
        }
      },
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q4'][lang],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a4'][lang]
        }
      },
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q5'][lang],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a5'][lang]
        }
      },
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q6'][lang],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a6'][lang]
        }
      },
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q7'][lang] || uiTranslations['faq.q7']['en'],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a7'][lang] || uiTranslations['faq.a7']['en']
        }
      },
      {
        '@type': 'Question',
        'name': uiTranslations['faq.q8'][lang] || uiTranslations['faq.q8']['en'],
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': uiTranslations['faq.a8'][lang] || uiTranslations['faq.a8']['en']
        }
      }
    ]
  }

  return (
    <>
      <JsonLd schema={[aboutSchema, faqSchema]} />
      <AboutClient data={aboutData} siteSettings={siteSettings} />
    </>
  )
}
