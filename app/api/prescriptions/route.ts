import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError, getPaginationParams } from '@/lib/db'

// GET /api/prescriptions - Get all prescriptions with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId') || undefined
    const doctorId = searchParams.get('doctorId') || undefined
    const status = searchParams.get('status') || undefined
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    const { page, limit, skip } = getPaginationParams(
      searchParams.get('page'),
      searchParams.get('limit')
    )

    // Build filters
    let whereClause: any = {}
    
    if (patientId) whereClause.patientId = patientId
    if (doctorId) whereClause.doctorId = doctorId
    if (status) whereClause.status = status

    // Get prescriptions with pagination
    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where: whereClause,
        include: {
          patient: {
            select: { id: true, name: true, phone: true }
          },
          doctor: {
            select: { id: true, name: true }
          },
          medicines: {
            include: {
              medicine: {
                select: { id: true, name: true, strength: true, unit: true }
              }
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.prescription.count({
        where: whereClause,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: prescriptions,
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

// POST /api/prescriptions - Create new prescription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.patientId || !body.doctorId || !body.diagnosis || !body.medicines || body.medicines.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Patient, doctor, diagnosis, and at least one medicine are required',
        },
        { status: 400 }
      )
    }

    // Create prescription with medicines
    const prescription = await prisma.prescription.create({
      data: {
        patientId: body.patientId,
        doctorId: body.doctorId,
        date: body.date ? new Date(body.date) : new Date(),
        diagnosis: body.diagnosis,
        notes: body.notes,
        status: body.status || 'draft',
        medicines: {
          create: body.medicines.map((med: any) => ({
            medicineId: med.medicineId,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: med.duration,
            instructions: med.instructions,
            quantity: med.quantity || 1,
          }))
        }
      },
      include: {
        patient: {
          select: { id: true, name: true, phone: true }
        },
        doctor: {
          select: { id: true, name: true }
        },
        medicines: {
          include: {
            medicine: {
              select: { id: true, name: true, strength: true, unit: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: prescription,
      message: 'Prescription created successfully',
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
