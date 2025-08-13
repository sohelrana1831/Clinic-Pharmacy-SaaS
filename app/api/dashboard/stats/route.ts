import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError } from '@/lib/db'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))
    
    // Get today's appointments count
    const todayAppointments = await prisma.appointment.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    // Get total patients count
    const totalPatients = await prisma.patient.count()

    // Get today's sales total
    const todaySalesResult = await prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'completed',
      },
      _sum: {
        finalAmount: true,
      },
    })
    const todaySales = todaySalesResult._sum.finalAmount || 0

    // Get low stock medicines count
    const lowStockMedicines = await prisma.medicine.count({
      where: {
        stockQty: {
          lte: prisma.medicine.fields.reorderLevel,
        },
      },
    })

    // Get recent appointments
    const recentAppointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: { id: true, name: true, phone: true },
        },
        doctor: {
          select: { id: true, name: true },
        },
      },
    })

    // Get recent sales
    const recentSales = await prisma.sale.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            medicine: {
              select: { name: true },
            },
          },
        },
      },
    })

    // Get sales chart data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date
    }).reverse()

    const salesChartData = await Promise.all(
      last7Days.map(async (date) => {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0))
        const endOfDay = new Date(date.setHours(23, 59, 59, 999))
        
        const salesResult = await prisma.sale.aggregate({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: 'completed',
          },
          _sum: {
            finalAmount: true,
          },
        })

        return {
          date: date.toISOString().split('T')[0],
          amount: salesResult._sum.finalAmount || 0,
        }
      })
    )

    const dashboardStats = {
      todayAppointments,
      totalPatients,
      todaySales,
      lowStockMedicines,
      recentAppointments,
      recentSales,
      salesChart: salesChartData,
    }

    return NextResponse.json({
      success: true,
      data: dashboardStats,
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
