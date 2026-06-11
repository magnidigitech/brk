import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const tickets = await prisma.grievanceTicket.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(tickets)
  } catch (error: any) {
    console.error('Error fetching admin tickets:', error)
    return NextResponse.json(
      { error: 'Internal server error occurred while fetching tickets.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, adminNotes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required.' },
        { status: 400 }
      )
    }

    const ticket = await prisma.grievanceTicket.update({
      where: { id },
      data: {
        status,
        adminNotes
      }
    })

    return NextResponse.json(ticket)
  } catch (error: any) {
    console.error('Error updating admin ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error occurred while updating ticket.' },
      { status: 500 }
    )
  }
}
