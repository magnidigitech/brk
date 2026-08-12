import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/sanityFetch'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bhashyamramakrishna.in'
  
  const staticRoutes = [
    '',
    '/about',
    '/development-works',
    '/grievance',
    '/parliamentary-updates',
    '/parliamentary-questions',
    '/parliamentary-speeches',
    '/daily-updates',
    '/press-releases',
    '/state-focus',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
  ]
  
  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.9,
  }))

  try {
    // Fetch dynamic press releases
    const pressReleases = await sanityFetch<any[]>({
      query: `*[_type == "pressRelease" && defined(slug.current)] { "slug": slug.current, _updatedAt }`
    })
    pressReleases?.forEach((item) => {
      if (item.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/press-releases/${item.slug}`,
          lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    })

    // Fetch dynamic daily updates
    const dailyUpdates = await sanityFetch<any[]>({
      query: `*[_type == "dailyUpdate" && defined(slug.current)] { "slug": slug.current, _updatedAt }`
    })
    dailyUpdates?.forEach((item) => {
      if (item.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/daily-updates/${item.slug}`,
          lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    })

    // Fetch dynamic parliamentary updates
    const parliamentaryUpdates = await sanityFetch<any[]>({
      query: `*[_type == "parliamentaryUpdate" && defined(slug.current)] { "slug": slug.current, _updatedAt }`
    })
    parliamentaryUpdates?.forEach((item) => {
      if (item.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/parliamentary-updates/${item.slug}`,
          lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    })

    // Fetch dynamic parliamentary questions
    const parliamentaryQuestions = await sanityFetch<any[]>({
      query: `*[_type == "parliamentaryQuestion" && defined(slug.current)] { "slug": slug.current, _updatedAt }`
    })
    parliamentaryQuestions?.forEach((item) => {
      if (item.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/parliamentary-questions/${item.slug}`,
          lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    })

    // Fetch dynamic parliamentary speeches
    const parliamentarySpeeches = await sanityFetch<any[]>({
      query: `*[_type == "parliamentarySpeech" && defined(slug.current)] { "slug": slug.current, _updatedAt }`
    })
    parliamentarySpeeches?.forEach((item) => {
      if (item.slug) {
        sitemapEntries.push({
          url: `${baseUrl}/parliamentary-speeches/${item.slug}`,
          lastModified: item._updatedAt ? new Date(item._updatedAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    })
  } catch (error) {
    console.error('Failed to generate dynamic sitemap entries:', error)
  }

  return sitemapEntries
}

