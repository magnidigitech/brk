import HomeDashboard from '@/components/HomeDashboard'
import { sanityFetch } from '@/sanity/lib/client'

// Instruct Next.js to cache this page statically and revalidate at most once every hour
export const revalidate = 3600

export default async function Page() {
  // Fetch from Sanity.io CMS concurrently
  let updates: any[] = []
  let news: any[] = []
  let gallery: any[] = []

  try {
    const [fetchedUpdates, fetchedNews, fetchedGallery] = await Promise.all([
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryUpdate"] | order(date desc)[0...3] {
          _id,
          title,
          date,
          summary,
          speechUrl
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "pressRelease"] | order(publishedAt desc)[0...3] {
          _id,
          title,
          publishedAt,
          excerpt,
          "image": mainImage
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "gallery"] | order(date desc)[0...3] {
          _id,
          title,
          caption,
          date,
          image
        }`
      })
    ])

    updates = fetchedUpdates || []
    news = fetchedNews || []
    gallery = fetchedGallery || []
  } catch (error) {
    console.error('Failed to fetch from Sanity, using fallback content:', error)
  }

  // Fallbacks if Sanity dataset is empty
  const displayUpdates = (updates && updates.length > 0) ? updates : [
    {
      _id: 'default-update-1',
      title: 'Debate on Digital Infrastructure Expansion in Rural Areas',
      date: '2026-05-18',
      summary: 'Spoke in Rajya Sabha advocating for enhanced public fund allocations to build secondary optic-fiber loops across remote villages.'
    },
    {
      _id: 'default-update-2',
      title: 'Question raised regarding solar irrigation subsidies for farmers',
      date: '2026-05-12',
      summary: 'Asked the Ministry of Power for state-level data on subsidy execution speed and support metrics for minor irrigation.'
    }
  ]

  const displayNews = (news && news.length > 0) ? news : [
    {
      _id: 'default-news-1',
      title: 'Bhashyam Ramakrishna MP Initiates Multi-Village Drinking Water Action Plan',
      publishedAt: '2026-06-05T00:00:00Z',
      excerpt: 'Following a review with rural engineers, a new pipeline blueprint was approved to bring potable tap water connection access to several drought-prone villages.',
      image: '/images/WhatsApp Image 2026-06-06 at 23.32.04.jpeg'
    },
    {
      _id: 'default-news-2',
      title: 'Parliamentary Committee reviews digital literacy achievements',
      publishedAt: '2026-05-29T00:00:00Z',
      excerpt: 'Rajya Sabha MP Bhashyam Ramakrishna joined the delegation to verify rural center resources and digital training progress.'
    }
  ]

  const displayGallery = (gallery && gallery.length > 0) ? gallery : [
    {
      _id: 'default-gal-1',
      title: 'Road Widening Inspections',
      caption: 'MP Bhashyam Ramakrishna reviewing regional highway connectivity projects and local transport updates.',
      date: '2026-06-02',
      image: '/images/WhatsApp Image 2026-06-06 at 23.32.03.jpeg'
    },
    {
      _id: 'default-gal-2',
      title: 'Constituent Grievance Hearing',
      caption: 'Listening to public feedback on public health infrastructure during local interactive town halls.',
      date: '2026-05-28',
      image: '/images/WhatsApp Image 2026-06-06 at 23.32.03 (1).jpeg'
    },
    {
      _id: 'default-gal-3',
      title: 'Water Pipeline Project Site',
      caption: 'Inspecting storage wells and clean drinking water pipeline construction progress.',
      date: '2026-05-15',
      image: '/images/WhatsApp Image 2026-06-06 at 23.32.04 (1).jpeg'
    },
    {
      _id: 'default-gal-4',
      title: 'Bhashyam Kireeti',
      caption: 'MP Bhashyam Ramakrishna whishes from Bhashyam Kireeti .',
      date: '2026-06-07',
      image: '/images/WhatsApp Image 2026-06-06 at 14.20.21.jpeg'
    }


  ]

  return (
    <HomeDashboard
      updates={displayUpdates}
      news={displayNews}
      gallery={displayGallery}
    />
  )
}
