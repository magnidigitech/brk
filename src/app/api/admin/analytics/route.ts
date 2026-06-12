import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const totalVisitors = await prisma.analyticsEvent.count({
      where: { type: 'VISIT' }
    })

    const totalPwaInstalls = await prisma.analyticsEvent.count({
      where: { type: 'PWA_INSTALL' }
    })

    const popularPages = await prisma.analyticsEvent.groupBy({
      by: ['pathname'],
      where: { type: 'VISIT' },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    })

    const recentEvents = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({
      success: true,
      totalVisitors,
      totalPwaInstalls,
      popularPages: popularPages.map(page => ({
        pathname: page.pathname || '/',
        count: page._count.id
      })),
      recentEvents
    })
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
