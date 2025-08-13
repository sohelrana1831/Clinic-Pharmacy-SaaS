import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError } from '@/lib/db'

// GET /api/medicines/[id] - Get medicine by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: { id: params.id },
      include: {
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        }
      }
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

    return NextResponse.json({
      success: true,
      data: medicine,
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

// PUT /api/medicines/[id] - Update medicine
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const medicine = await prisma.medicine.update({
      where: { id: params.id },
      data: {
        sku: body.sku,
        name: body.name,
        genericName: body.genericName,
        category: body.category,
        manufacturer: body.manufacturer,
        strength: body.strength,
        unit: body.unit,
        purchasePrice: body.purchasePrice,
        sellingPrice: body.sellingPrice,
        stockQty: body.stockQty,
        reorderLevel: body.reorderLevel,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        batchNumber: body.batchNumber,
      },
    })

    return NextResponse.json({
      success: true,
      data: medicine,
      message: 'Medicine updated successfully',
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

// DELETE /api/medicines/[id] - Delete medicine
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.medicine.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Medicine deleted successfully',
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
