import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError, getPaginationParams, buildSearchFilter } from '@/lib/db'

// GET /api/medicines - Get all medicines with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const lowStock = searchParams.get('lowStock') === 'true'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    const { page, limit, skip } = getPaginationParams(
      searchParams.get('page'),
      searchParams.get('limit')
    )

    // Build filters
    let whereClause: any = {}
    
    // Search filter
    if (search) {
      whereClause = {
        ...whereClause,
        ...buildSearchFilter(search, ['name', 'genericName', 'manufacturer', 'sku'])
      }
    }
    
    // Category filter
    if (category) {
      whereClause.category = category
    }
    
    // Low stock filter
    if (lowStock) {
      whereClause.stockQty = {
        lte: prisma.medicine.fields.reorderLevel
      }
    }

    // Get medicines with pagination
    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.medicine.count({
        where: whereClause,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: medicines,
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

// POST /api/medicines - Create new medicine
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.sku || !body.category || !body.unit) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, SKU, category, and unit are required',
        },
        { status: 400 }
      )
    }

    const medicine = await prisma.medicine.create({
      data: {
        sku: body.sku,
        name: body.name,
        genericName: body.genericName,
        category: body.category,
        manufacturer: body.manufacturer,
        strength: body.strength,
        unit: body.unit,
        purchasePrice: body.purchasePrice || 0,
        sellingPrice: body.sellingPrice || 0,
        stockQty: body.stockQty || 0,
        reorderLevel: body.reorderLevel || 10,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
        batchNumber: body.batchNumber,
      },
    })

    return NextResponse.json({
      success: true,
      data: medicine,
      message: 'Medicine created successfully',
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
