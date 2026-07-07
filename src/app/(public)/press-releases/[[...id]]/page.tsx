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
  params: Promise<{ id?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('user-language')?.value === 'te' ? 'te' : 'en'
  const resolvedParams = await params
  const id = resolvedParams.id?.[0]

  if (id) {
    try {
      const release = await sanityFetch<any>({
        query: `*[_type == "pressRelease" && (slug.current == $id || _id == $id || _id match $id + "*")][0] {
          _id,
          slug,
          title,
          excerpt,
          mainImage
        }`,
        params: { id }
      })

      if (release) {
        const slugOrId = release.slug?.current || release._id
        const rTitle = release.title?.[lang] || release.title?.en || release.title || uiTranslations['meta.press.title'][lang]
        const rDesc = release.excerpt?.[lang] || release.excerpt?.en || release.excerpt || uiTranslations['meta.press.desc'][lang]
        const imageUrl = release.mainImage ? urlFor(release.mainImage).width(1200).height(630).url() : undefined

        return {
          title: `${rTitle} | Shri Bhashyam Rama Krishna`,
          description: rDesc,
          alternates: {
            canonical: `https://bhashyamramakrishna.in/press-releases/${slugOrId}`,
          },
          openGraph: {
            title: rTitle,
            description: rDesc,
            url: `https://bhashyamramakrishna.in/press-releases/${slugOrId}`,
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
      console.error('Failed to generate dynamic metadata for press release:', error)
    }
  }

  const title = uiTranslations['meta.press.title'][lang] || uiTranslations['meta.press.title']['en']
  const description = uiTranslations['meta.press.desc'][lang] || uiTranslations['meta.press.desc']['en']
  
  return {
    title,
    description,
    alternates: {
      canonical: 'https://bhashyamramakrishna.in/press-releases',
    },
    openGraph: {
      title,
      description,
      url: 'https://bhashyamramakrishna.in/press-releases',
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

export default async function PressReleasesPage({ params }: PageProps) {
  let releases: any[] = []

  try {
    releases = await sanityFetch<any[]>({
      query: `*[_type == "pressRelease"] | order(publishedAt desc) {
        _id,
        slug,
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
        'name': lang === 'te' ? 'పత్రికా ప్రకటనలు' : 'Press Releases',
        'item': 'https://bhashyamramakrishna.in/press-releases'
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
      <PressReleasesClient releases={releases || []} activeId={activeId} />
    </>
  )
}
