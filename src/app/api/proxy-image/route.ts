import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return new NextResponse('URL query parameter is required', { status: 400 })
    }

    // Security boundary: Only allow proxying assets from cdn.sanity.io
    const parsedUrl = new URL(imageUrl)
    if (parsedUrl.hostname !== 'cdn.sanity.io') {
      return new NextResponse('Forbidden: Only cdn.sanity.io URLs are proxied', { status: 403 })
    }

    const response = await fetch(imageUrl)
    if (!response.ok) {
      return new NextResponse(`Failed to fetch remote image: ${response.statusText}`, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const blob = await response.blob()

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error in proxy-image API route:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
