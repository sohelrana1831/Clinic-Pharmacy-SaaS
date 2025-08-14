import { NextRequest, NextResponse } from 'next/server'
import { prisma, handleDatabaseError } from '@/lib/db'
import { startOfDay, endOfDay, subDays, format } from 'date-fns'

// GET /api/reports - Get comprehensive report data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') || 'dashboard'

    // Default date range (last 30 days)
    const defaultStartDate = startOfDay(subDays(new Date(), 30))
    const defaultEndDate = endOfDay(new Date())

    const dateFrom = startDate ? new Date(startDate) : defaultStartDate
    const dateTo = endDate ? new Date(endDate) : defaultEndDate

    if (type === 'dashboard') {
      // Dashboard overview data
      const [
        totalPatients,
        totalAppointments,
        totalPrescriptions,
        todayAppointments,
        recentAppointments,
        appointmentsByStatus,
        prescriptionsByStatus,
        dailyAppointments,
        monthlyStats
      ] = await Promise.all([
        // Total patients
        prisma.patient.count(),
        
        // Total appointments in date range
        prisma.appointment.count({
          where: {
            date: { gte: dateFrom, lte: dateTo }
          }
        }),
        
        // Total prescriptions in date range
        prisma.prescription.count({
          where: {
            date: { gte: dateFrom, lte: dateTo }
          }
        }),
        
        // Today's appointments
        prisma.appointment.count({
          where: {
            date: {
              gte: startOfDay(new Date()),
              lte: endOfDay(new Date())
            }
          }
        }),
        
        // Recent appointments with patient/doctor info
        prisma.appointment.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            patient: { select: { name: true, phone: true } },
            doctor: { select: { name: true } }
          }
        }),
        
        // Appointments by status
        prisma.appointment.groupBy({
          by: ['status'],
          where: {
            date: { gte: dateFrom, lte: dateTo }
          },
          _count: { status: true }
        }),
        
        // Prescriptions by status
        prisma.prescription.groupBy({
          by: ['status'],
          where: {
            date: { gte: dateFrom, lte: dateTo }
          },
          _count: { status: true }
        }),
        
        // Daily appointments for chart
        getDailyAppointments(dateFrom, dateTo),
        
        // Monthly statistics
        getMonthlyStats()
      ])

      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalPatients,
            totalAppointments,
            totalPrescriptions,
            todayAppointments
          },
          recentAppointments,
          appointmentsByStatus,
          prescriptionsByStatus,
          dailyAppointments,
          monthlyStats
        }
      })
    }

    if (type === 'appointments') {
      // Detailed appointments report
      const appointmentsReport = await getAppointmentsReport(dateFrom, dateTo)
      return NextResponse.json({
        success: true,
        data: appointmentsReport
      })
    }

    if (type === 'prescriptions') {
      // Detailed prescriptions report
      const prescriptionsReport = await getPrescriptionsReport(dateFrom, dateTo)
      return NextResponse.json({
        success: true,
        data: prescriptionsReport
      })
    }

    if (type === 'financial') {
      // Financial reports (if sales data exists)
      const financialReport = await getFinancialReport(dateFrom, dateTo)
      return NextResponse.json({
        success: true,
        data: financialReport
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid report type'
    }, { status: 400 })

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

// Helper function to get daily appointments data
async function getDailyAppointments(startDate: Date, endDate: Date) {
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: startDate, lte: endDate }
    },
    select: {
      date: true,
      status: true
    }
  })

  // Group by date
  const dailyData: Record<string, { date: string; appointments: number; confirmed: number; completed: number }> = {}
  
  appointments.forEach(appointment => {
    const dateKey = format(new Date(appointment.date), 'yyyy-MM-dd')
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        date: dateKey,
        appointments: 0,
        confirmed: 0,
        completed: 0
      }
    }
    
    dailyData[dateKey].appointments++
    if (appointment.status === 'confirmed') dailyData[dateKey].confirmed++
    if (appointment.status === 'completed') dailyData[dateKey].completed++
  })

  return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date))
}

// Helper function to get monthly statistics
async function getMonthlyStats() {
  const now = new Date()
  const monthsBack = 6
  const stats = []

  for (let i = monthsBack; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const [appointments, prescriptions, patients] = await Promise.all([
      prisma.appointment.count({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth }
        }
      }),
      prisma.prescription.count({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth }
        }
      }),
      prisma.patient.count({
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth }
        }
      })
    ])

    stats.push({
      month: format(date, 'MMM yyyy'),
      appointments,
      prescriptions,
      newPatients: patients
    })
  }

  return stats
}

// Helper function for appointments report
async function getAppointmentsReport(startDate: Date, endDate: Date) {
  const [appointments, statusBreakdown, typeBreakdown, doctorBreakdown] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      },
      include: {
        patient: { select: { name: true, phone: true } },
        doctor: { select: { name: true } }
      },
      orderBy: { date: 'desc' }
    }),
    
    prisma.appointment.groupBy({
      by: ['status'],
      where: {
        date: { gte: startDate, lte: endDate }
      },
      _count: { status: true }
    }),
    
    prisma.appointment.groupBy({
      by: ['type'],
      where: {
        date: { gte: startDate, lte: endDate }
      },
      _count: { type: true }
    }),
    
    prisma.appointment.groupBy({
      by: ['doctorId'],
      where: {
        date: { gte: startDate, lte: endDate }
      },
      _count: { doctorId: true },
      _orderBy: { _count: { doctorId: 'desc' } }
    })
  ])

  return {
    appointments,
    statusBreakdown,
    typeBreakdown,
    doctorBreakdown,
    total: appointments.length
  }
}

// Helper function for prescriptions report
async function getPrescriptionsReport(startDate: Date, endDate: Date) {
  const [prescriptions, statusBreakdown, medicineUsage, doctorPrescriptions] = await Promise.all([
    prisma.prescription.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      },
      include: {
        patient: { select: { name: true, phone: true } },
        doctor: { select: { name: true } },
        medicines: {
          include: {
            medicine: { select: { name: true, category: true } }
          }
        }
      },
      orderBy: { date: 'desc' }
    }),
    
    prisma.prescription.groupBy({
      by: ['status'],
      where: {
        date: { gte: startDate, lte: endDate }
      },
      _count: { status: true }
    }),
    
    // Most prescribed medicines
    prisma.prescriptionMedicine.groupBy({
      by: ['medicineId'],
      where: {
        prescription: {
          date: { gte: startDate, lte: endDate }
        }
      },
      _count: { medicineId: true },
      _sum: { quantity: true }
    }),
    
    prisma.prescription.groupBy({
      by: ['doctorId'],
      where: {
        date: { gte: startDate, lte: endDate }
      },
      _count: { doctorId: true }
    })
  ])

  return {
    prescriptions,
    statusBreakdown,
    medicineUsage,
    doctorPrescriptions,
    total: prescriptions.length
  }
}

// Helper function for financial report
async function getFinancialReport(startDate: Date, endDate: Date) {
  try {
    const [sales, dailySales, topMedicines] = await Promise.all([
      prisma.sale.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          items: {
            include: {
              medicine: { select: { name: true, category: true } }
            }
          }
        }
      }),
      
      prisma.sale.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        _sum: {
          finalAmount: true
        }
      }),
      
      prisma.saleItem.groupBy({
        by: ['medicineId'],
        where: {
          sale: {
            createdAt: { gte: startDate, lte: endDate }
          }
        },
        _sum: {
          totalPrice: true,
          quantity: true
        }
      })
    ])

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0)
    const totalTransactions = sales.length

    return {
      sales,
      dailySales,
      topMedicines,
      summary: {
        totalRevenue,
        totalTransactions,
        averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0
      }
    }
  } catch (error) {
    // If sales table doesn't exist or has issues, return empty data
    return {
      sales: [],
      dailySales: [],
      topMedicines: [],
      summary: {
        totalRevenue: 0,
        totalTransactions: 0,
        averageTransaction: 0
      }
    }
  }
}
