import { sanityFetch } from '@/sanity/lib/sanityFetch'
import DailyUpdatesClient from '@/components/DailyUpdatesClient'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { uiTranslations } from '@/lib/translations'
import { urlFor } from '@/sanity/lib/image'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Always fetch fresh from Sanity

interface PageProps {
  params: Promise<{ id?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const resolvedParams = await params
  const id = resolvedParams.id?.[0]

  if (id) {
    try {
      const update = await sanityFetch<any>({
        query: `*[_type == "dailyUpdate" && (slug.current == $id || _id == $id || _id match $id + "*")][0] {
          _id,
          slug,
          title,
          summary,
          mainImage
        }`,
        params: { id }
      })

      if (update) {
        const slugOrId = update.slug?.current || update._id
        const rTitle = update.title?.[lang] || update.title?.en || update.title || uiTranslations['meta.daily.title'][lang]
        const rDesc = update.summary?.[lang] || update.summary?.en || update.summary || uiTranslations['meta.daily.desc'][lang]
        const imageUrl = update.mainImage ? urlFor(update.mainImage).width(1200).height(630).url() : undefined

        return {
          title: `${rTitle} | Shri Bhashyam Rama Krishna`,
          description: rDesc,
          alternates: {
            canonical: `https://bhashyamramakrishna.in/daily-updates/${slugOrId}`,
          },
          openGraph: {
            title: rTitle,
            description: rDesc,
            url: `https://bhashyamramakrishna.in/daily-updates/${slugOrId}`,
            locale: lang === 'te' ? 'te_IN' : 'en_IN',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
          },
          twitter: {
            card: 'summary_large_image',
            title: rTitle,
            description: rDesc,
            images: imageUrl ? [imageUrl] : ['https://bhashyamramakrishna.in/profile.jpg'],
            creator: '@bhashyambrk',
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate dynamic metadata for daily update:', error)
    }
  }

  const title = uiTranslations['meta.daily.title'][lang] || uiTranslations['meta.daily.title']['en']
  const description = uiTranslations['meta.daily.desc'][lang] || uiTranslations['meta.daily.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/daily-updates',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/daily-updates',
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

export default async function DailyUpdatesPage({ params }: PageProps) {
  let dailyUpdates: any[] = []

  try {
    dailyUpdates = await sanityFetch<any[]>({
      query: `*[_type == "dailyUpdate"] | order(date desc) {
        _id,
        slug,
        title,
        date,
        summary,
        body,
        "image": mainImage,
        images,
        speechUrl
      }`
    })
  } catch (error) {
    console.error('Failed to fetch daily updates from Sanity:', error)
  }

  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const resolvedParams = await params
  const activeId = resolvedParams.id?.[0] || null

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
        'name': lang === 'te' ? 'రోజువారీ అప్‌డేట్స్' : 'Daily Updates',
        'item': 'https://bhashyamramakrishna.in/daily-updates'
      }
    ]
  }

  const articleSchemas = (dailyUpdates || []).slice(0, 10).map((upd) => ({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': upd.title || 'Daily Update',
    'datePublished': upd.date,
    'description': upd.summary || '',
    'author': {
      '@type': 'Person',
      'name': 'Shri Bhashyam Rama Krishna'
    }
  }))

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, ...articleSchemas]} />
      <DailyUpdatesClient dailyUpdates={dailyUpdates || []} activeId={activeId} />
    </>
  )
}
