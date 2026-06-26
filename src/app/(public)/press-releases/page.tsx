import { sanityFetch } from '@/sanity/lib/sanityFetch'
import PressReleasesClient from '@/components/PressReleasesClient'
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
      const release = await sanityFetch<any>({
        query: `*[_type == "pressRelease" && (_id == $id || _id match $id + "*")][0] {
          title,
          excerpt,
          mainImage
        }`,
        params: { id }
      })

      if (release) {
        // extract title, excerpt and main image for social share previews
        const rTitle = release.title?.[lang] || release.title?.en || release.title || uiTranslations['meta.press.title'][lang]
        const rDesc = release.excerpt?.[lang] || release.excerpt?.en || release.excerpt || uiTranslations['meta.press.desc'][lang]
        const imageUrl = release.mainImage ? urlFor(release.mainImage).width(1200).height(630).url() : undefined

        return {
          title: `${rTitle} | Shri Bhashyam Rama Krishna`,
          description: rDesc,
          alternates: {
            canonical: `https://bramakrishna.mp.in/press-releases?id=${id}`,
          },
          openGraph: {
            title: rTitle,
            description: rDesc,
            url: `https://bramakrishna.mp.in/press-releases?id=${id}`,
            locale: lang === 'te' ? 'te_IN' : 'en_IN',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate dynamic metadata for press release:', error)
    }
  }

  const title = uiTranslations['meta.press.title'][lang] || uiTranslations['meta.press.title']['en']
  const description = uiTranslations['meta.press.desc'][lang] || uiTranslations['meta.press.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bramakrishna.mp.in/press-releases',
    },
    openGraph: {
      title,
      description,
      url: 'https://bramakrishna.mp.in/press-releases',
      locale: lang === 'te' ? 'te_IN' : 'en_IN',
    }
  }
}

export default async function PressReleasesPage() {
  let releases: any[] = []

  try {
    releases = await sanityFetch<any[]>({
      query: `*[_type == "pressRelease"] | order(publishedAt desc) {
        _id,
        title,
        publishedAt,
        excerpt,
        body,
        "image": mainImage,
        images,
        speechUrl
      }`
    })
  } catch (error) {
    console.error('Failed to fetch press releases from Sanity:', error)
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
        'name': lang === 'te' ? 'పత్రికా ప్రకటనలు' : 'Press Releases',
        'item': 'https://bramakrishna.mp.in/press-releases'
      }
    ]
  }

  const articleSchemas = (releases || []).slice(0, 10).map((rel) => ({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': rel.title || 'Press Release',
    'datePublished': rel.publishedAt,
    'description': rel.excerpt || '',
    'author': {
      '@type': 'Person',
      'name': 'Shri Bhashyam Rama Krishna'
    }
  }))

  return (
    <>
      <JsonLd schema={[breadcrumbSchema, ...articleSchemas]} />
      <PressReleasesClient releases={releases || []} />
    </>
  )
}
