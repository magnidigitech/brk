import { sanityFetch } from '@/sanity/lib/sanityFetch'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Helper to safely format text inside CDATA blocks
function escapeCdata(str: string): string {
  if (!str) return ''
  return str.replace(/\]\]>/g, ']]&gt;')
}

export async function GET() {
  const baseUrl = 'https://bhashyamramakrishna.in'

  try {
    const [releases, updates, daily, questions, speeches] = await Promise.all([
      sanityFetch<any[]>({
        query: `*[_type == "pressRelease"] | order(publishedAt desc)[0...30] {
          _id,
          slug,
          title,
          excerpt,
          publishedAt
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryUpdate"] | order(date desc)[0...30] {
          _id,
          slug,
          title,
          summary,
          date
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "dailyUpdate"] | order(date desc)[0...30] {
          _id,
          slug,
          title,
          summary,
          date
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "parliamentaryQuestion"] | order(date desc)[0...30] {
          _id,
          slug,
          title,
          summary,
          date
        }`
      }),
      sanityFetch<any[]>({
        query: `*[_type == "parliamentarySpeech"] | order(date desc)[0...30] {
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
      <title><![CDATA[${escapeCdata(title)}]]></title>
      <link>${baseUrl}/press-releases/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/press-releases/${slug}</guid>
      <description><![CDATA[${escapeCdata(desc)}]]></description>
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
      <title><![CDATA[${escapeCdata(title)}]]></title>
      <link>${baseUrl}/parliamentary-updates/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/parliamentary-updates/${slug}</guid>
      <description><![CDATA[${escapeCdata(desc)}]]></description>
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
      <title><![CDATA[${escapeCdata(title)}]]></title>
      <link>${baseUrl}/daily-updates/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/daily-updates/${slug}</guid>
      <description><![CDATA[${escapeCdata(desc)}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
      }),
      ...(questions || []).map((q) => {
        const slug = q.slug?.current || q._id
        const title = typeof q.title === 'string' ? q.title : q.title?.en || q.title?.te || 'Parliamentary Question'
        const desc = typeof q.summary === 'string' ? q.summary : q.summary?.en || q.summary?.te || ''
        const pubDate = q.date ? new Date(q.date).toUTCString() : new Date().toUTCString()
        return `
    <item>
      <title><![CDATA[${escapeCdata(title)}]]></title>
      <link>${baseUrl}/parliamentary-questions/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/parliamentary-questions/${slug}</guid>
      <description><![CDATA[${escapeCdata(desc)}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
      }),
      ...(speeches || []).map((s) => {
        const slug = s.slug?.current || s._id
        const title = typeof s.title === 'string' ? s.title : s.title?.en || s.title?.te || 'Parliamentary Speech'
        const desc = typeof s.summary === 'string' ? s.summary : s.summary?.en || s.summary?.te || ''
        const pubDate = s.date ? new Date(s.date).toUTCString() : new Date().toUTCString()
        return `
    <item>
      <title><![CDATA[${escapeCdata(title)}]]></title>
      <link>${baseUrl}/parliamentary-speeches/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/parliamentary-speeches/${slug}</guid>
      <description><![CDATA[${escapeCdata(desc)}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`
      })
    ].join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shri Bhashyam Rama Krishna, MP - Official Updates &amp; Press Releases</title>
    <link>${baseUrl}</link>
    <description>Official Parliamentary Updates, Daily Updates, Press Releases, Questions, and Speeches for Shri Bhashyam Rama Krishna, Member of Parliament (Rajya Sabha).</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
