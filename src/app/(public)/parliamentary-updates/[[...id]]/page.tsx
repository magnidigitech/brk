import { sanityFetch } from '@/sanity/lib/sanityFetch'
import ParliamentaryUpdatesClient from '@/components/ParliamentaryUpdatesClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'
import { urlFor } from '@/sanity/lib/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ id?: string[] }>
  searchParams: Promise<{ tab?: string }>
}

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const resolvedParams = await params
  const resolvedSearch = await searchParams
  const id = resolvedParams.id?.[0]
  const tab = resolvedSearch?.tab || 'updates'

  if (id) {
    try {
      // Try all three types
      const [update, question, speech] = await Promise.all([
        sanityFetch<any>({
          query: `*[_type == "parliamentaryUpdate" && (slug.current == $id || _id == $id || _id match $id + "*")][0] { _id, slug, title, summary, mainImage }`,
          params: { id }
        }),
        sanityFetch<any>({
          query: `*[_type == "parliamentaryQuestion" && (slug.current == $id || _id == $id || _id match $id + "*")][0] { _id, slug, title, summary, mainImage }`,
          params: { id }
        }),
        sanityFetch<any>({
          query: `*[_type == "parliamentarySpeech" && (slug.current == $id || _id == $id || _id match $id + "*")][0] { _id, slug, title, summary }`,
          params: { id }
        }),
      ])

      const item = update || question || speech
      if (item) {
        const slugOrId = item.slug?.current || item._id
        const uTitle = item.title?.[lang] || item.title?.en || item.title || uiTranslations['meta.parliament.title'][lang]
        const uDesc = item.summary?.[lang] || item.summary?.en || item.summary || uiTranslations['meta.parliament.desc'][lang]
        const imageUrl = item.mainImage ? urlFor(item.mainImage).width(1200).height(630).url() : undefined

        return {
          title: `${uTitle} | Shri Bhashyam Rama Krishna`,
          description: uDesc,
          alternates: { canonical: `https://bhashyamramakrishna.in/parliamentary-updates/${slugOrId}` },
          openGraph: {
            title: uTitle,
            description: uDesc,
            url: `https://bhashyamramakrishna.in/parliamentary-updates/${slugOrId}`,
            locale: lang === 'te' ? 'te_IN' : 'en_IN',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
          },
          twitter: {
            card: 'summary_large_image',
            title: uTitle,
            description: uDesc,
            images: imageUrl ? [imageUrl] : ['https://bhashyamramakrishna.in/profile.jpg'],
            creator: '@bhashyambrk',
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate dynamic metadata for parliamentary update:', error)
    }
  }

  const tabTitles: Record<string, string> = {
    speeches: lang === 'te' ? 'పార్లమెంటరీ ప్రసంగాలు | శ్రీ భాష్యం రామకృష్ణ' : 'Parliamentary Speeches | Shri Bhashyam Rama Krishna',
    questions: lang === 'te' ? 'పార్లమెంటరీ ప్రశ్నలు | శ్రీ భాష్యం రామకృష్ణ' : 'Parliamentary Questions | Shri Bhashyam Rama Krishna',
    updates: uiTranslations['meta.parliament.title'][lang] || uiTranslations['meta.parliament.title']['en'],
  }
  const tabDescs: Record<string, string> = {
    speeches: lang === 'te'
      ? 'రాజ్యసభలో భాష్యం రామకృష్ణ గారి అధికారిక ప్రసంగాల వీడియోలు చూడండి.'
      : 'Watch official speech videos of Bhashyam Rama Krishna in the Rajya Sabha, Parliament of India.',
    questions: lang === 'te'
      ? 'రాజ్యసభలో భాష్యం రామకృష్ణ గారు అడిగిన నక్షత్ర/అనక్షత్ర ప్రశ్నలు మరియు అధికారిక సమాధానాలు.'
      : 'Starred and unstarred questions raised by Bhashyam Rama Krishna in the Rajya Sabha with official responses.',
    updates: uiTranslations['meta.parliament.desc'][lang] || uiTranslations['meta.parliament.desc']['en'],
  }

  const title = tabTitles[tab] || tabTitles['updates']
  const description = tabDescs[tab] || tabDescs['updates']

  const canonicalUrl = tab !== 'updates'
    ? `https://bhashyamramakrishna.in/parliamentary-updates?tab=${tab}`
    : 'https://bhashyamramakrishna.in/parliamentary-updates'

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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

export default async function ParliamentaryUpdatesPage({ params, searchParams }: PageProps) {
  let updates: any[] = []
  let questions: any[] = []
  let speeches: any[] = []

  try {
    const [fetchedUpdates, fetchedQuestions, fetchedSpeeches] = await Promise.all([
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryUpdate"] | order(date desc) {
          _id, slug, title, date, summary, speechUrl,
          "documentUrl": document.asset->url,
          "image": mainImage, images
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryQuestion"] | order(date desc) {
          _id, slug, title, date, questionNumber, sessionInfo,
          category, ministry, summary, officialAnswer,
          "documentUrl": document.asset->url,
          "image": mainImage
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "parliamentarySpeech"] | order(date desc) {
          _id, slug, title, date, sessionInfo, speechUrl,
          duration, summary, topic,
          "documentUrl": document.asset->url
        }`
      }),
    ])
    updates = fetchedUpdates || []
    questions = fetchedQuestions || []
    speeches = fetchedSpeeches || []
  } catch (error) {
    console.error('Failed to fetch parliamentary data from Sanity:', error)
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const resolvedParams = await params
  const resolvedSearch = await searchParams
  const activeId = resolvedParams.id?.[0] || null
  const activeTab = (resolvedSearch?.tab as 'speeches' | 'questions' | 'updates') || 'updates'

  // ── Structured Data ──────────────────────────────────────────────

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': lang === 'te' ? 'హోమ్' : 'Home', 'item': 'https://bhashyamramakrishna.in' },
      { '@type': 'ListItem', 'position': 2, 'name': lang === 'te' ? 'పార్లమెంటరీ' : 'Parliamentary', 'item': 'https://bhashyamramakrishna.in/parliamentary-updates' },
    ]
  }

  // FAQPage schema for questions (boosts Google featured snippets)
  const faqSchema = questions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.slice(0, 20).map((q) => ({
      '@type': 'Question',
      'name': q.title?.[lang] || q.title?.en || q.title || '',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': q.officialAnswer || q.summary?.[lang] || q.summary?.en || q.summary || ''
      }
    }))
  } : null

  // VideoObject schemas for speeches
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
        'duration': s.duration ? `PT${s.duration.replace(':', 'M')}S` : undefined,
        'publisher': { '@type': 'Person', 'name': 'Shri Bhashyam Rama Krishna' }
      }
    })
    .filter(Boolean)

  // Also keep article schemas for updates (backwards compat)
  const articleSchemas = updates.slice(0, 10).map((up) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': up.title || 'Parliamentary Update',
    'datePublished': up.date,
    'description': up.summary || '',
    'author': { '@type': 'Person', 'name': 'Shri Bhashyam Rama Krishna' },
    'publisher': { '@type': 'GovernmentOrganization', 'name': 'Parliament of India' }
  }))

  const allSchemas = [breadcrumbSchema, ...articleSchemas, ...videoSchemas, ...(faqSchema ? [faqSchema] : [])]

  return (
    <>
      <JsonLd schema={allSchemas} />
      <ParliamentaryUpdatesClient
        updates={updates}
        questions={questions}
        speeches={speeches}
        activeId={activeId}
        initialTab={activeTab}
      />
    </>
  )
}
