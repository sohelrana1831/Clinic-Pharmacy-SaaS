import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError, getPaginationParams } from '@/lib/db'

// GET /api/appointments - Get all appointments with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || undefined
    const status = searchParams.get('status') || undefined
    const doctorId = searchParams.get('doctorId') || undefined
    const patientId = searchParams.get('patientId') || undefined
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    
    const { page, limit, skip } = getPaginationParams(
      searchParams.get('page'),
      searchParams.get('limit')
    )

    // Build filters
    let whereClause: any = {}
    
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      whereClause.date = {
        gte: startDate,
        lt: endDate,
      }
    }
    
    if (status) whereClause.status = status
    if (doctorId) whereClause.doctorId = doctorId
    if (patientId) whereClause.patientId = patientId

    // Get appointments with pagination
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: whereClause,
        include: {
          patient: {
            select: { id: true, name: true, phone: true }
          },
          doctor: {
            select: { id: true, name: true }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.appointment.count({
        where: whereClause,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    const errorResponse = handleDatabaseError(error)
    return NextResponse.json(
      {
        success: false,
        message: errorResponse.message,
        errors: error,
      },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.patientId || !body.doctorId || !body.date || !body.time) {
      return NextResponse.json(
        {
          success: false,
          message: 'Patient, doctor, date, and time are required',
        },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        doctorId: body.doctorId,
        date: new Date(body.date),
        time: body.time,
        type: body.type || 'consultation',
        status: body.status || 'scheduled',
        notes: body.notes,
      },
      include: {
        patient: {
          select: { id: true, name: true, phone: true }
        },
        doctor: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment created successfully',
    })
  } catch (error) {
    const errorResponse = handleDatabaseError(error)
    return NextResponse.json(
      {
        success: false,
        message: errorResponse.message,
        errors: error,
      },
      { status: 500 }
    )
  }
}
