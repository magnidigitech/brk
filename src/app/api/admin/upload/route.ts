import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as 'image' | 'file' | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (!type || (type !== 'image' && type !== 'file')) {
      return NextResponse.json({ error: 'Invalid asset type. Must be "image" or "file".' }, { status: 400 })
    }

    // Convert the File Web API object into a Buffer for Sanity client uploading
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log(`Uploading ${type} asset "${file.name}" to Sanity...`)
    
    const asset = await writeClient.assets.upload(type, buffer, {
      filename: file.name,
      contentType: file.type,
    })

    console.log(`Successfully uploaded asset: ${asset._id}`)

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
    })
  } catch (error: any) {
    console.error('Error uploading file to Sanity:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during file upload.' },
      { status: 500 }
    )
  }
}
