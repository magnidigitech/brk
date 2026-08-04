import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { translateText } from '@/lib/translate'
import { uiTranslations } from '@/lib/translations'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const cleanQ = q.trim()

    if (!cleanQ) {
      return NextResponse.json({ success: true, items: [], faqs: [] })
    }

    // 1. Get translations of the query for bilingual matching
    let enQuery = cleanQ
    let teQuery = cleanQ

    try {
      enQuery = await translateText(cleanQ, 'en')
      teQuery = await translateText(cleanQ, 'te')
    } catch (err) {
      console.warn('Translation failed during search:', err)
    }

    // 2. Query Sanity for matches in press releases and parliamentary updates using GROQ match
    // We search using both the English and Telugu query variations.
    const sanityQuery = `
      *[_type in ["dailyUpdate", "pressRelease", "parliamentaryUpdate"] && (
        title match $enQuery || 
        excerpt match $enQuery || 
        summary match $enQuery || 
        title match $teQuery || 
        excerpt match $teQuery || 
        summary match $teQuery
      )] | order(date desc, publishedAt desc)[0...30] {
        _id,
        _type,
        title,
        publishedAt,
        date,
        excerpt,
        summary,
        speechUrl,
        slug
      }
    `

    const items = await client.fetch(sanityQuery, {
      enQuery: `*${enQuery}*`,
      teQuery: `*${teQuery}*`
    })

    // 3. Search constituency FAQs from local translations dictionary
    const matchedFaqs: any[] = []
    const faqKeys = ['faq.q1', 'faq.q2', 'faq.q3', 'faq.q4', 'faq.q5', 'faq.q6', 'faq.q7', 'faq.q8']
    
    const lowerEn = enQuery.toLowerCase()
    const lowerTe = teQuery.toLowerCase()

    faqKeys.forEach((key, index) => {
      const qNum = index + 1
      const qKey = `faq.q${qNum}`
      const aKey = `faq.a${qNum}`

      const qObj = uiTranslations[qKey]
      const aObj = uiTranslations[aKey]

      if (qObj && aObj) {
        const qEn = (qObj.en || '').toLowerCase()
        const qTe = (qObj.te || '').toLowerCase()
        const aEn = (aObj.en || '').toLowerCase()
        const aTe = (aObj.te || '').toLowerCase()

        if (
          qEn.includes(lowerEn) || 
          qTe.includes(lowerTe) || 
          aEn.includes(lowerEn) || 
          aTe.includes(lowerTe) ||
          qEn.includes(lowerTe) ||
          qTe.includes(lowerEn)
        ) {
          matchedFaqs.push({
            id: key,
            question: {
              en: qObj.en,
              te: qObj.te
            },
            answer: {
              en: aObj.en,
              te: aObj.te
            }
          })
        }
      }
    })

    return NextResponse.json({
      success: true,
      items,
      faqs: matchedFaqs
    })
  } catch (error) {
    console.error('Error in GET /api/search:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
