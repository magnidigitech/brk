import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'

// Helper: Slugify string
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')     // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
}

// Helper: Convert formatted text into rich PortableText blocks for Sanity
function convertTextToBlocks(text: string) {
  if (!text) return []
  
  const blocks: any[] = []
  const rawParagraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .filter(p => p.trim())

  for (const rawPara of rawParagraphs) {
    const lines = rawPara.split('\n').filter(l => l.trim())
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Check for Markdown Headings (e.g. ### Heading or ## Heading)
      const mdHeadingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/)
      if (mdHeadingMatch) {
        const level = mdHeadingMatch[1].length
        blocks.push({
          _type: 'block',
          _key: Math.random().toString(36).substring(2, 9),
          style: level <= 2 ? 'h2' : 'h3',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).substring(2, 9),
              text: mdHeadingMatch[2].trim(),
              marks: []
            }
          ]
        })
        continue
      }

      // Check for Colon Headings (e.g. "Key Highlights & Details:")
      const colonMatch = trimmed.match(/^([A-Z0-9\s&/\-–—"']{3,60}:)$/)
      if (colonMatch) {
        blocks.push({
          _type: 'block',
          _key: Math.random().toString(36).substring(2, 9),
          style: 'h3',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).substring(2, 9),
              text: colonMatch[1].trim(),
              marks: ['strong']
            }
          ]
        })
        continue
      }

      // Check for Bullet Lists (e.g. - Item or • Item or * Item)
      const bulletMatch = trimmed.match(/^([\-•*]|\d+\.)\s+(.*)$/)
      if (bulletMatch) {
        blocks.push({
          _type: 'block',
          _key: Math.random().toString(36).substring(2, 9),
          style: 'normal',
          listItem: 'bullet',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).substring(2, 9),
              text: bulletMatch[2].trim(),
              marks: []
            }
          ]
        })
        continue
      }

      // Normal Paragraph Block
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).substring(2, 9),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: Math.random().toString(36).substring(2, 9),
            text: trimmed,
            marks: []
          }
        ]
      })
    }
  }

  return blocks
}

// GET: Fetch all Press Releases, Parliamentary Updates, Daily Updates, Questions, and Speeches from Sanity
export async function GET(request: NextRequest) {
  try {
    const pressReleases = await client.fetch(`
      *[_type == "pressRelease"] | order(publishedAt desc) {
        _id,
        _type,
        title,
        slug,
        publishedAt,
        excerpt,
        speechUrl,
        "mainImageUrl": mainImage.asset->url,
        "mainImageAssetId": mainImage.asset._ref,
        "slideshowImageUrls": images[].asset->url,
        "slideshowAssetIds": images[].asset._ref,
        body,
        images
      }
    `)

    const parliamentaryUpdates = await client.fetch(`
      *[_type == "parliamentaryUpdate"] | order(date desc) {
        _id,
        _type,
        title,
        slug,
        date,
        summary,
        speechUrl,
        "mainImageUrl": mainImage.asset->url,
        "mainImageAssetId": mainImage.asset._ref,
        "slideshowImageUrls": images[].asset->url,
        "slideshowAssetIds": images[].asset._ref,
        images,
        "documentUrl": document.asset->url,
        "documentAssetId": document.asset._ref,
        "documentOriginalName": document.asset->originalFilename
      }
    `)

    const parliamentaryQuestions = await client.fetch(`
      *[_type == "parliamentaryQuestion"] | order(date desc) {
        _id,
        _type,
        title,
        slug,
        date,
        questionNumber,
        sessionInfo,
        category,
        ministry,
        summary,
        officialAnswer,
        "documentUrl": document.asset->url,
        "documentAssetId": document.asset._ref,
        "documentOriginalName": document.asset->originalFilename
      }
    `)

    const parliamentarySpeeches = await client.fetch(`
      *[_type == "parliamentarySpeech"] | order(date desc) {
        _id,
        _type,
        title,
        slug,
        date,
        sessionInfo,
        speechUrl,
        duration,
        summary,
        topic,
        "documentUrl": document.asset->url,
        "documentAssetId": document.asset._ref,
        "documentOriginalName": document.asset->originalFilename
      }
    `)

    const dailyUpdates = await client.fetch(`
      *[_type == "dailyUpdate"] | order(date desc) {
        _id,
        _type,
        title,
        slug,
        date,
        summary,
        speechUrl,
        "mainImageUrl": mainImage.asset->url,
        "mainImageAssetId": mainImage.asset._ref,
        "slideshowImageUrls": images[].asset->url,
        "slideshowAssetIds": images[].asset._ref,
        body,
        images
      }
    `)

    const siteSettings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        _id,
        _type,
        introVideoUrl,
        introVideoTitle,
        showIntroVideo,
        customEmbedCode,
        showCustomEmbed
      }
    `)

    return NextResponse.json({
      success: true,
      pressReleases,
      parliamentaryUpdates,
      parliamentaryQuestions,
      parliamentarySpeeches,
      dailyUpdates,
      siteSettings
    })
  } catch (error: any) {
    console.error('Error fetching content lists from Sanity:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content lists.' },
      { status: 500 }
    )
  }
}

// POST: Create a new Press Release or Parliamentary Update
export async function POST(request: NextRequest) {
  try {
    if (!process.env.SANITY_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_WRITE_TOKEN is missing in the production server environment variables.' },
        { status: 500 }
      )
    }

    const bodyData = await request.json()
    const { type, title, speechUrl, mainImageAssetId, slideshowAssetIds } = bodyData

    const validTypes = ['pressRelease', 'parliamentaryUpdate', 'dailyUpdate', 'parliamentaryQuestion', 'parliamentarySpeech']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid document type.' }, { status: 400 })
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }

    const currentSlug = slugify(title)

    let doc: any = {
      _type: type,
      title: title.trim(),
      slug: {
        _type: 'slug',
        current: currentSlug
      },
      speechUrl: speechUrl?.trim() || undefined
    }

    if (mainImageAssetId) {
      doc.mainImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: mainImageAssetId }
      }
    }

    if (slideshowAssetIds && Array.isArray(slideshowAssetIds) && slideshowAssetIds.length > 0) {
      doc.images = slideshowAssetIds.map((id: string) => ({
        _type: 'image',
        _key: Math.random().toString(36).substring(2, 9),
        asset: { _type: 'reference', _ref: id }
      }))
    }

    if (type === 'pressRelease') {
      const { publishedAt, excerpt, bodyContent } = bodyData
      if (!publishedAt) {
        return NextResponse.json({ error: 'Publication date is required.' }, { status: 400 })
      }
      doc.publishedAt = publishedAt
      doc.excerpt = excerpt?.trim() || ''
      doc.body = convertTextToBlocks(bodyContent || '')
    } else if (type === 'dailyUpdate') {
      const { date, summary, bodyContent } = bodyData
      if (!date) {
        return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
      }
      if (!summary || !summary.trim()) {
        return NextResponse.json({ error: 'Summary is required.' }, { status: 400 })
      }
      doc.date = date
      doc.summary = summary.trim()
      doc.body = convertTextToBlocks(bodyContent || '')
    } else if (type === 'parliamentaryQuestion') {
      const { date, summary, officialAnswer, questionNumber, sessionInfo, category, ministry, documentAssetId } = bodyData
      if (!date) return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
      if (!summary?.trim()) return NextResponse.json({ error: 'Question text (summary) is required.' }, { status: 400 })
      doc.date = date
      doc.summary = summary.trim()
      doc.officialAnswer = officialAnswer?.trim() || undefined
      doc.questionNumber = questionNumber?.trim() || undefined
      doc.sessionInfo = sessionInfo?.trim() || undefined
      doc.category = category || undefined
      doc.ministry = ministry?.trim() || undefined
      if (documentAssetId) {
        doc.document = { _type: 'file', asset: { _type: 'reference', _ref: documentAssetId } }
      }
    } else if (type === 'parliamentarySpeech') {
      const { date, summary, sessionInfo, duration, topic, documentAssetId } = bodyData
      if (!date) return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
      if (!speechUrl?.trim()) return NextResponse.json({ error: 'YouTube URL is required.' }, { status: 400 })
      if (!summary?.trim()) return NextResponse.json({ error: 'Description is required.' }, { status: 400 })
      doc.date = date
      doc.summary = summary.trim()
      doc.sessionInfo = sessionInfo?.trim() || undefined
      doc.duration = duration?.trim() || undefined
      doc.topic = topic?.trim() || undefined
      if (documentAssetId) {
        doc.document = { _type: 'file', asset: { _type: 'reference', _ref: documentAssetId } }
      }
    } else {
      const { date, summary, documentAssetId } = bodyData
      if (!date) {
        return NextResponse.json({ error: 'Session date is required.' }, { status: 400 })
      }
      if (!summary || !summary.trim()) {
        return NextResponse.json({ error: 'Summary is required.' }, { status: 400 })
      }
      doc.date = date
      doc.summary = summary.trim()
      
      if (documentAssetId) {
        doc.document = {
          _type: 'file',
          asset: { _type: 'reference', _ref: documentAssetId }
        }
      }
    }


    console.log(`Creating new ${type} document in Sanity...`)
    const result = await writeClient.create(doc)
    console.log(`Document created: ${result._id}`)

    return NextResponse.json({ success: true, document: result })
  } catch (error: any) {
    console.error('Error creating Sanity document:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to publish content to Sanity.' },
      { status: 500 }
    )
  }
}

// PATCH: Edit an existing Press Release or Parliamentary Update
export async function PATCH(request: NextRequest) {
  try {
    if (!process.env.SANITY_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_WRITE_TOKEN is missing in the production server environment variables.' },
        { status: 500 }
      )
    }

    const bodyData = await request.json()
    const { id, type, title, speechUrl, mainImageAssetId, removeMainImage, slideshowAssetIds, removeSlideshowImages } = bodyData

    if (type === 'siteSettings' || id === 'siteSettings') {
      const { introVideoUrl, introVideoTitle, showIntroVideo, customEmbedCode, showCustomEmbed } = bodyData
      console.log('Updating Site Settings in Sanity...')
      const result = await writeClient
        .patch('siteSettings')
        .set({
          introVideoUrl: introVideoUrl?.trim() || '',
          introVideoTitle: typeof introVideoTitle === 'string' ? introVideoTitle.trim() : introVideoTitle,
          showIntroVideo: !!showIntroVideo,
          customEmbedCode: customEmbedCode || '',
          showCustomEmbed: !!showCustomEmbed
        })
        .commit()
      console.log('Site Settings updated:', result._id)
      return NextResponse.json({ success: true, document: result })
    }

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 })
    }

    const validTypes = ['pressRelease', 'parliamentaryUpdate', 'dailyUpdate', 'parliamentaryQuestion', 'parliamentarySpeech']
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid document type.' }, { status: 400 })
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
    }

    const currentSlug = slugify(title)

    let patch = writeClient.patch(id).set({
      title: title.trim(),
      slug: {
        _type: 'slug',
        current: currentSlug
      },
      speechUrl: speechUrl?.trim() || ''
    })

    // Handle Main Image references
    if (mainImageAssetId) {
      patch = patch.set({
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: mainImageAssetId }
        }
      })
    } else if (removeMainImage) {
      patch = patch.unset(['mainImage'])
    }

    // Handle Slideshow Images references
    if (slideshowAssetIds && Array.isArray(slideshowAssetIds)) {
      patch = patch.set({
        images: slideshowAssetIds.map((assetId: string) => ({
          _type: 'image',
          _key: Math.random().toString(36).substring(2, 9),
          asset: { _type: 'reference', _ref: assetId }
        }))
      })
    } else if (removeSlideshowImages) {
      patch = patch.unset(['images'])
    }

    if (type === 'pressRelease') {
      const { publishedAt, excerpt, bodyContent } = bodyData
      if (!publishedAt) {
        return NextResponse.json({ error: 'Publication date is required.' }, { status: 400 })
      }
      patch = patch.set({
        publishedAt,
        excerpt: excerpt?.trim() || '',
        body: convertTextToBlocks(bodyContent || '')
      })
    } else if (type === 'dailyUpdate') {
      const { date, summary, bodyContent } = bodyData
      if (!date) {
        return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
      }
      if (!summary || !summary.trim()) {
        return NextResponse.json({ error: 'Summary is required.' }, { status: 400 })
      }
      patch = patch.set({
        date,
        summary: summary.trim(),
        body: convertTextToBlocks(bodyContent || '')
      })
    } else if (type === 'parliamentaryQuestion') {
      const { date, summary, officialAnswer, questionNumber, sessionInfo, category, ministry, documentAssetId, removeDocument } = bodyData
      if (!date) return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
      if (!summary?.trim()) return NextResponse.json({ error: 'Question text is required.' }, { status: 400 })
      patch = patch.set({
        date,
        summary: summary.trim(),
        officialAnswer: officialAnswer?.trim() || '',
        questionNumber: questionNumber?.trim() || '',
        sessionInfo: sessionInfo?.trim() || '',
        category: category || '',
        ministry: ministry?.trim() || ''
      })
      if (documentAssetId) {
        patch = patch.set({ document: { _type: 'file', asset: { _type: 'reference', _ref: documentAssetId } } })
      } else if (removeDocument) {
        patch = patch.unset(['document'])
      }
    } else if (type === 'parliamentarySpeech') {
      const { date, summary, sessionInfo, duration, topic, documentAssetId, removeDocument } = bodyData
      if (!date) return NextResponse.json({ error: 'Date is required.' }, { status: 400 })
      if (!summary?.trim()) return NextResponse.json({ error: 'Description is required.' }, { status: 400 })
      patch = patch.set({
        date,
        summary: summary.trim(),
        sessionInfo: sessionInfo?.trim() || '',
        duration: duration?.trim() || '',
        topic: topic?.trim() || ''
      })
      if (documentAssetId) {
        patch = patch.set({ document: { _type: 'file', asset: { _type: 'reference', _ref: documentAssetId } } })
      } else if (removeDocument) {
        patch = patch.unset(['document'])
      }
    } else {
      const { date, summary, documentAssetId, removeDocument } = bodyData
      if (!date) {
        return NextResponse.json({ error: 'Session date is required.' }, { status: 400 })
      }
      if (!summary || !summary.trim()) {
        return NextResponse.json({ error: 'Summary is required.' }, { status: 400 })
      }
      patch = patch.set({
        date,
        summary: summary.trim()
      })

      if (documentAssetId) {
        patch = patch.set({
          document: {
            _type: 'file',
            asset: { _type: 'reference', _ref: documentAssetId }
          }
        })
      } else if (removeDocument) {
        patch = patch.unset(['document'])
      }
    }

    console.log(`Updating document ${id} in Sanity...`)
    const result = await patch.commit()
    console.log(`Document updated: ${result._id}`)

    return NextResponse.json({ success: true, document: result })
  } catch (error: any) {
    console.error('Error updating Sanity document:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update content in Sanity.' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a document from Sanity
export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.SANITY_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_WRITE_TOKEN is missing in the production server environment variables.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 })
    }

    console.log(`Deleting document ${id} from Sanity...`)
    await writeClient.delete(id)
    console.log(`Document deleted: ${id}`)

    return NextResponse.json({ success: true, message: 'Document deleted successfully.' })
  } catch (error: any) {
    console.error('Error deleting Sanity document:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete content from Sanity.' },
      { status: 500 }
    )
  }
}
