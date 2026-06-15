import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bramakrishna.mp.in'
  
  const routes = [
    '',
    '/about',
    '/development-works',
    '/grievance',
    '/parliamentary-updates',
    '/daily-updates',
    '/press-releases',
    '/state-focus',
    '/contact',
    '/privacy',
    '/terms',
    '/accessibility',
  ]
  
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
