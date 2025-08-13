import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError } from '@/lib/db'

// POST /api/medicines/[id]/stock - Update medicine stock
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { quantity, type, reason } = body

    // Validate input
    if (!quantity || !type || !['add', 'subtract'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Valid quantity and type (add/subtract) are required',
        },
        { status: 400 }
      )
    }

    // Get current medicine
    const medicine = await prisma.medicine.findUnique({
      where: { id: params.id }
    })

    if (!medicine) {
      return NextResponse.json(
        {
          success: false,
          message: 'Medicine not found',
        },
        { status: 404 }
      )
    }

    // Calculate new stock quantity
    const adjustmentQuantity = type === 'add' ? quantity : -quantity
    const newStockQty = medicine.stockQty + adjustmentQuantity

    if (newStockQty < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Insufficient stock quantity',
        },
        { status: 400 }
      )
    }

    // Use transaction to update medicine and create stock movement
    const result = await prisma.$transaction([
      // Update medicine stock
      prisma.medicine.update({
        where: { id: params.id },
        data: { stockQty: newStockQty }
      }),
      // Create stock movement record
      prisma.stockMovement.create({
        data: {
          medicineId: params.id,
          type: type === 'add' ? 'purchase' : 'adjustment',
          quantity: adjustmentQuantity,
          reason: reason || `Stock ${type}`,
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: result[0], // Updated medicine
      message: `Stock ${type === 'add' ? 'added' : 'subtracted'} successfully`,
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
