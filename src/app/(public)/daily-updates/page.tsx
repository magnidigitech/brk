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
        query: `*[_type == "dailyUpdate" && (_id == $id || _id match $id + "*")][0] {
          title,
          summary,
          mainImage
        }`,
        params: { id }
      })

      if (update) {
        const rTitle = update.title?.[lang] || update.title?.en || update.title || uiTranslations['meta.daily.title'][lang]
        const rDesc = update.summary?.[lang] || update.summary?.en || update.summary || uiTranslations['meta.daily.desc'][lang]
        const imageUrl = update.mainImage ? urlFor(update.mainImage).width(1200).height(630).url() : undefined

        return {
          title: `${rTitle} | Shri Bhashyam Rama Krishna`,
          description: rDesc,
          alternates: {
            canonical: `https://bramakrishna.mp.in/daily-updates?id=${id}`,
          },
          openGraph: {
            title: rTitle,
            description: rDesc,
            url: `https://bramakrishna.mp.in/daily-updates?id=${id}`,
            locale: lang === 'te' ? 'te_IN' : 'en_IN',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
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
      canonical: 'https://bramakrishna.mp.in/daily-updates',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/daily-updates',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function DailyUpdatesPage() {
  let dailyUpdates: any[] = []

  try {
    dailyUpdates = await sanityFetch<any[]>({
      query: `*[_type == "dailyUpdate"] | order(date desc) {
        _id,
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
        'name': lang === 'te' ? 'రోజువారీ అప్‌డేట్స్' : 'Daily Updates',
        'item': 'https://bramakrishna.mp.in/daily-updates'
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
      <DailyUpdatesClient dailyUpdates={dailyUpdates || []} />
    </>
  )
}
