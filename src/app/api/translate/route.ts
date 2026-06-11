import { NextRequest, NextResponse } from 'next/server'
import { detectLanguage, translateText } from '@/lib/translate'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text } = body

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 })
    }

    const detected = detectLanguage(text)
    
    // Translate to all 3 languages concurrently
    const [en, te, ten] = await Promise.all([
      translateText(text, 'en'),
      translateText(text, 'te'),
      translateText(text, 'ten')
    ])

    return NextResponse.json({
      detected,
      en,
      te,
      ten
    })
  } catch (error: any) {
    console.error('Translation api error:', error)
    return NextResponse.json({ error: error.message || 'Internal translation error' }, { status: 500 })
  }
}

// Simple GET support for testing
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get('text')
  
  if (!text) {
    return NextResponse.json({ error: 'Text query parameter is required' }, { status: 400 })
  }

  const detected = detectLanguage(text)
  const [en, te, ten] = await Promise.all([
    translateText(text, 'en'),
    translateText(text, 'te'),
    translateText(text, 'ten')
  ])

  return NextResponse.json({
    detected,
    en,
    te,
    ten
  })
}
