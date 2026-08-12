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
    ? 'పార్లమెంటరీ ప్రసంగాలు | శ్రీ భాష్యం రామకృష్ణ'
    : 'Parliamentary Speeches | Shri Bhashyam Rama Krishna'
  const description = lang === 'te'
    ? 'రాజ్యసభలో శ్రీ భాష్యం రామకృష్ణ గారి అధికారిక ప్రసంగ వీడియోలు చూడండి. యూట్యూబ్‌లో అందుబాటులో ఉన్న ప్రసంగాలు.'
    : 'Watch official speech videos of Shri Bhashyam Rama Krishna in the Rajya Sabha, Parliament of India. All speeches available on YouTube.'

  return {
    title,
    description,
    alternates: { canonical: 'https://bhashyamramakrishna.in/parliamentary-speeches' },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/parliamentary-speeches',
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

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export default async function ParliamentarySpeechesPage({ params }: PageProps) {
  let speeches: any[] = []

  try {
    speeches = await sanityFetch<any[]>({
      query: `*[_type == "parliamentarySpeech"] | order(date desc) {
        _id, slug, title, date, sessionInfo, speechUrl,
        duration, summary, topic,
        "documentUrl": document.asset->url
      }`
    }) || []
  } catch (error) {
    console.error('Failed to fetch parliamentary speeches:', error)
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': lang === 'te' ? 'హోమ్' : 'Home', 'item': 'https://bhashyamramakrishna.in' },
      { '@type': 'ListItem', 'position': 2, 'name': lang === 'te' ? 'పార్లమెంటరీ' : 'Parliamentary', 'item': 'https://bhashyamramakrishna.in/parliamentary-updates' },
      { '@type': 'ListItem', 'position': 3, 'name': lang === 'te' ? 'ప్రసంగాలు' : 'Speeches', 'item': 'https://bhashyamramakrishna.in/parliamentary-speeches' },
    ]
  }

  const videoSchemas = speeches
    .filter((s) => s.speechUrl)
    .map((s) => {
      const ytId = getYouTubeId(s.speechUrl)
      if (!ytId) return null
      return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        'name': s.title || 'Parliament Speech',
        'description': s.summary || '',
        'thumbnailUrl': [
          `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        ],
        'uploadDate': s.date ? `${s.date}T09:00:00Z` : new Date().toISOString(),
        'contentUrl': s.speechUrl,
        'embedUrl': `https://www.youtube.com/embed/${ytId}`,
        'publisher': { '@type': 'Person', 'name': 'Shri Bhashyam Rama Krishna' }
      }
    })
    .filter(Boolean)

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, ...videoSchemas]} />
      <ParliamentaryUpdatesClient
        speeches={speeches}
        initialTab="speeches"
      />
    </>
  )
}
