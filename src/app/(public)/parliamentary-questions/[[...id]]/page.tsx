import { sanityFetch } from '@/sanity/lib/sanityFetch'
import ParliamentaryUpdatesClient from '@/components/ParliamentaryUpdatesClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ id?: string[] }>
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'

  const title = lang === 'te'
    ? 'పార్లమెంటరీ ప్రశ్నలు | శ్రీ భాష్యం రామకృష్ణ'
    : 'Parliamentary Questions | Shri Bhashyam Rama Krishna'
  const description = lang === 'te'
    ? 'రాజ్యసభలో శ్రీ భాష్యం రామకృష్ణ గారు అడిగిన నక్షత్ర మరియు అనక్షత్ర ప్రశ్నలు, అధికారిక సమాధానాలతో సహా.'
    : 'Starred and unstarred questions raised by Shri Bhashyam Rama Krishna in the Rajya Sabha with official government responses.'

  return {
    title,
    description,
    keywords: [
      'Rajya Sabha MP Andhra Pradesh',
      'Andhra Pradesh Rajya Sabha members',
      'TDP Rajya Sabha MP',
      'Andhra Pradesh Parliament news',
      'Rajya Sabha news Andhra Pradesh',
      'Andhra Pradesh development programmes',
      'Guntur development news',
      'Bhashyam Rama Krishna questions'
    ],
    alternates: { canonical: 'https://bhashyamramakrishna.in/parliamentary-questions' },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/parliamentary-questions',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
      images: [{ url: 'https://bhashyamramakrishna.in/profile.jpg', width: 1200, height: 630 }],
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

export default async function ParliamentaryQuestionsPage({ params }: PageProps) {
  let questions: any[] = []

  try {
    questions = await sanityFetch<any[]>({
      query: `*[_type == "parliamentaryQuestion"] | order(date desc) {
        _id, slug, title, date, questionNumber, sessionInfo,
        category, ministry, summary, officialAnswer,
        "documentUrl": document.asset->url,
        "image": mainImage
      }`
    }) || []
  } catch (error) {
    console.error('Failed to fetch parliamentary questions:', error)
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': lang === 'te' ? 'హోమ్' : 'Home', 'item': 'https://bhashyamramakrishna.in' },
      { '@type': 'ListItem', 'position': 2, 'name': lang === 'te' ? 'పార్లమెంటరీ' : 'Parliamentary', 'item': 'https://bhashyamramakrishna.in/parliamentary-updates' },
      { '@type': 'ListItem', 'position': 3, 'name': lang === 'te' ? 'ప్రశ్నలు' : 'Questions', 'item': 'https://bhashyamramakrishna.in/parliamentary-questions' },
    ]
  }

  // FAQPage schema — powers Google featured snippets
  const faqSchema = questions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.slice(0, 20).map((q) => ({
      '@type': 'Question',
      'name': q.title?.[lang] || q.title?.en || q.title || '',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': q.officialAnswer?.[lang] || q.officialAnswer?.en || q.officialAnswer
          || q.summary?.[lang] || q.summary?.en || q.summary || ''
      }
    }))
  } : null

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])]} />
      <ParliamentaryUpdatesClient
        questions={questions}
        initialTab="questions"
      />
    </>
  )
}
