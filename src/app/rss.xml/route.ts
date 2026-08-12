import { sanityFetch } from '@/sanity/lib/sanityFetch'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = 'https://bhashyamramakrishna.in'

  try {
    const [releases, updates, daily] = await Promise.all([
      sanityFetch<any[]>({
        query: `*[_type == "pressRelease"] | order(publishedAt desc)[0...20] {
          _id,
          slug,
          title,
          excerpt,
          publishedAt
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryUpdate"] | order(date desc)[0...20] {
          _id,
          slug,
          title,
          summary,
          date
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "dailyUpdate"] | order(date desc)[0...20] {
          _id,
          slug,
          title,
          summary,
          date
        }`
      })
    ])

    const rssItems = [
      ...(releases || []).map((r) => {
        const slug = r.slug?.current || r._id
        const title = typeof r.title === 'string' ? r.title : r.title?.en || r.title?.te || 'Press Release'
        const desc = typeof r.excerpt === 'string' ? r.excerpt : r.excerpt?.en || r.excerpt?.te || ''
        const pubDate = r.publishedAt ? new Date(r.publishedAt).toUTCString() : new Date().toUTCString()
        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${baseUrl}/press-releases/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/press-releases/${slug}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
      }),
      ...(updates || []).map((u) => {
        const slug = u.slug?.current || u._id
        const title = typeof u.title === 'string' ? u.title : u.title?.en || u.title?.te || 'Parliamentary Update'
        const desc = typeof u.summary === 'string' ? u.summary : u.summary?.en || u.summary?.te || ''
        const pubDate = u.date ? new Date(u.date).toUTCString() : new Date().toUTCString()
        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${baseUrl}/parliamentary-updates/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/parliamentary-updates/${slug}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
      }),
      ...(daily || []).map((d) => {
        const slug = d.slug?.current || d._id
        const title = typeof d.title === 'string' ? d.title : d.title?.en || d.title?.te || 'Daily Update'
        const desc = typeof d.summary === 'string' ? d.summary : d.summary?.en || d.summary?.te || ''
        const pubDate = d.date ? new Date(d.date).toUTCString() : new Date().toUTCString()
        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${baseUrl}/daily-updates/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/daily-updates/${slug}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
      })
    ].join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shri Bhashyam Rama Krishna, MP - Official Updates &amp; Press Releases</title>
    <link>${baseUrl}</link>
    <description>Official Parliamentary Updates, Daily Updates, and Press Releases for Shri Bhashyam Rama Krishna, Member of Parliament (Rajya Sabha).</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
