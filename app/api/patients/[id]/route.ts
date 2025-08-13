import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError } from '@/lib/db'

// GET /api/patients/[id] - Get patient by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 10,
          include: {
            doctor: {
              select: { id: true, name: true }
            }
          }
        },
        prescriptions: {
          orderBy: { date: 'desc' },
          take: 5,
          include: {
            doctor: {
              select: { id: true, name: true }
            },
            medicines: {
              include: {
                medicine: {
                  select: { id: true, name: true, strength: true }
                }
              }
            }
          }
        }
      }
    })

    if (!patient) {
      return NextResponse.json(
        {
          success: false,
          message: 'Patient not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: patient,
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

// PUT /api/patients/[id] - Update patient
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        bloodGroup: body.bloodGroup,
      },
    })

    return NextResponse.json({
      success: true,
      data: patient,
      message: 'Patient updated successfully',
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

// DELETE /api/patients/[id] - Delete patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.patient.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Patient deleted successfully',
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
