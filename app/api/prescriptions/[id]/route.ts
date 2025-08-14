import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError } from '@/lib/db'

// GET /api/prescriptions/[id] - Get prescription by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          select: { id: true, name: true, phone: true, email: true, dateOfBirth: true }
        },
        doctor: {
          select: { id: true, name: true, role: true }
        },
        medicines: {
          include: {
            medicine: {
              select: { id: true, name: true, strength: true, unit: true, manufacturer: true }
            }
          }
        }
      }
    })

    if (!prescription) {
      return NextResponse.json(
        {
          success: false,
          message: 'Prescription not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: prescription,
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

// PUT /api/prescriptions/[id] - Update prescription
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check if prescription exists
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: { medicines: true }
    })

    if (!existingPrescription) {
      return NextResponse.json(
        {
          success: false,
          message: 'Prescription not found',
        },
        { status: 404 }
      )
    }

    // Delete existing medicines and update prescription
    const prescription = await prisma.$transaction(async (tx) => {
      // Delete existing prescription medicines
      await tx.prescriptionMedicine.deleteMany({
        where: { prescriptionId: params.id }
      })

      // Update prescription
      return await tx.prescription.update({
        where: { id: params.id },
        data: {
          diagnosis: body.diagnosis,
          notes: body.notes,
          status: body.status,
          medicines: {
            create: body.medicines?.map((med: any) => ({
              medicineId: med.medicineId,
              dosage: med.dosage,
              frequency: med.frequency,
              duration: med.duration,
              instructions: med.instructions,
              quantity: med.quantity || 1,
            })) || []
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
    })

    return NextResponse.json({
      success: true,
      data: prescription,
      message: 'Prescription updated successfully',
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

// DELETE /api/prescriptions/[id] - Delete prescription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if prescription exists
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: params.id }
    })

    if (!existingPrescription) {
      return NextResponse.json(
        {
          success: false,
          message: 'Prescription not found',
        },
        { status: 404 }
      )
    }

    // Delete prescription (medicines will be deleted automatically due to cascade)
    await prisma.prescription.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Prescription deleted successfully',
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
