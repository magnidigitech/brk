import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, pathname } = body

    if (!type || !['VISIT', 'PWA_INSTALL'].includes(type)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        type,
        pathname: pathname || null,
      },
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Error logging analytics event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
