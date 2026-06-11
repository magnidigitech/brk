import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      state, 
      district, 
      cityTown, 
      mandal, 
      villageWard, 
      address, 
      pincode, 
      category, 
      subject, 
      description 
    } = body

    // Server-side validation
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !category?.trim() ||
      !subject?.trim() ||
      !description?.trim()
    ) {
      return NextResponse.json(
        { error: 'Required fields (Name, Email, Phone, Category, Subject, Description) are missing.' },
        { status: 400 }
      )
    }

    // Generate unique tracking ID: GRV-YYYYMMDD-[4 RANDOM DIGITS]
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString()
    const trackingId = `GRV-${dateStr}-${randomDigits}`

    // Insert into database
    const ticket = await prisma.grievanceTicket.create({
      data: {
        id: trackingId,
        name,
        email,
        phone,
        state: state || null,
        district: district || null,
        cityTown: cityTown || null,
        mandal: mandal || null,
        villageWard: villageWard || null,
        address: address || null,
        pincode: pincode || null,
        category,
        subject,
        description,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ id: ticket.id, status: ticket.status }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating grievance ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error occurred while lodging grievance.' },
      { status: 500 }
    )
  }
}
