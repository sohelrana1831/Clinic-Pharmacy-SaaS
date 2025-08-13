import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError, getPaginationParams, buildSearchFilter } from '@/lib/db'

// GET /api/patients - Get all patients with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    const { page, limit, skip } = getPaginationParams(
      searchParams.get('page'),
      searchParams.get('limit')
    )

    // Build search filter
    const searchFilter = buildSearchFilter(search, ['name', 'email', 'phone'])

    // Get patients with pagination
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where: searchFilter,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.patient.count({
        where: searchFilter,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: patients,
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

// POST /api/patients - Create new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and phone are required',
        },
        { status: 400 }
      )
    }

    const patient = await prisma.patient.create({
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
      message: 'Patient created successfully',
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
