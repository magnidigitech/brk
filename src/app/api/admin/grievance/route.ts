import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const tickets = await prisma.grievanceTicket.findMany({
      include: {
        logs: {
          orderBy: { createdAt: 'desc' }
        }
      },
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
    const { id, status, notes } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Ticket ID is required.' },
        { status: 400 }
      )
    }

    const currentTicket = await prisma.grievanceTicket.findUnique({
      where: { id }
    })

    if (!currentTicket) {
      return NextResponse.json(
        { error: 'Grievance ticket not found.' },
        { status: 404 }
      )
    }

    const noteText = notes?.trim()
    const statusChanged = currentTicket.status !== status
    const createLog = noteText || statusChanged

    const ticket = await prisma.grievanceTicket.update({
      where: { id },
      data: {
        status,
        adminNotes: noteText || currentTicket.adminNotes,
        logs: createLog ? {
          create: {
            status,
            notes: noteText || `Ticket status updated to ${status.replace('_', ' ')}`
          }
        } : undefined
      },
      include: {
        logs: {
          orderBy: { createdAt: 'desc' }
        }
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

