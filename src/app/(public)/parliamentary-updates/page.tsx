import { sanityFetch } from '@/sanity/lib/sanityFetch'
import ParliamentaryUpdatesClient from '@/components/ParliamentaryUpdatesClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'
import { urlFor } from '@/sanity/lib/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const resolvedSearchParams = await searchParams
  const id = resolvedSearchParams.id

  if (id) {
    try {
      const update = await sanityFetch<any>({
        query: `*[_type == "parliamentaryUpdate" && (_id == $id || _id match $id + "*")][0] {
          title,
          summary,
          mainImage
        }`,
        params: { id }
      })

      if (update) {
        // extract title, summary and main image for social share previews
        const uTitle = update.title?.[lang] || update.title?.en || update.title || uiTranslations['meta.parliament.title'][lang]
        const uDesc = update.summary?.[lang] || update.summary?.en || update.summary || uiTranslations['meta.parliament.desc'][lang]
        const imageUrl = update.mainImage ? urlFor(update.mainImage).width(1200).height(630).url() : undefined

        return {
          title: `${uTitle} | Shri Bhashyam Rama Krishna`,
          description: uDesc,
          alternates: {
            canonical: `https://bramakrishna.mp.in/parliamentary-updates?id=${id}`,
          },
          openGraph: {
            title: uTitle,
            description: uDesc,
            url: `https://bramakrishna.mp.in/parliamentary-updates?id=${id}`,
            locale: lang === 'te' ? 'te_IN' : 'en_IN',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate dynamic metadata for parliamentary update:', error)
    }
  }

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

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
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
        "documentUrl": document.asset->url,
        "image": mainImage,
        images
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
      'name': 'Shri Bhashyam Rama Krishna'
    },
    'publisher': {
      '@type': 'GovernmentOrganization',
      'name': 'Parliament of India'
    }
  }))

  const videoSchemas = (updates || [])
    .filter((up) => up.speechUrl)
    .map((up) => {
      const ytId = getYouTubeId(up.speechUrl)
      if (!ytId) return null
      return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        'name': up.title || 'Parliament Speech Video',
        'description': up.summary || '',
        'thumbnailUrl': [
          `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        ],
        'uploadDate': up.date ? `${up.date}T09:00:00Z` : new Date().toISOString(),
        'contentUrl': up.speechUrl,
        'embedUrl': `https://www.youtube.com/embed/${ytId}`,
        'publisher': {
          '@type': 'Person',
          'name': 'Shri Bhashyam Rama Krishna'
        }
      }
    })
    .filter(Boolean)

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, ...articleSchemas, ...videoSchemas]} />
      <ParliamentaryUpdatesClient updates={updates || []} />
    </>
  )
}
