import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching admin contact messages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
