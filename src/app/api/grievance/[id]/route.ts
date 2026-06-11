import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id?.trim()) {
      return NextResponse.json(
        { error: 'Ticket ID is required.' },
        { status: 400 }
      )
    }

    const ticket = await prisma.grievanceTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Grievance ticket not found.' },
        { status: 404 }
      )
    }

    // Mask private contact details for public tracking lookup to protect privacy
    const maskedEmail = ticket.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    const maskedPhone = ticket.phone.replace(/(.{3})(.*)(.{3})/, '$1******$3')

    return NextResponse.json({
      id: ticket.id,
      name: ticket.name,
      email: maskedEmail,
      phone: maskedPhone,
      state: ticket.state,
      district: ticket.district,
      cityTown: ticket.cityTown,
      mandal: ticket.mandal,
      villageWard: ticket.villageWard,
      address: ticket.address,
      pincode: ticket.pincode,
      category: ticket.category,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      adminNotes: ticket.adminNotes,
    })
  } catch (error: any) {
    console.error('Error fetching grievance ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error occurred while retrieving ticket.' },
      { status: 500 }
    )
  }
}
