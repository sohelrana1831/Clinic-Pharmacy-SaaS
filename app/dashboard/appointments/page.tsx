'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaginatedApi, useApiMutation } from '@/hooks/useApi'
import { appointmentsApi, Appointment } from '@/lib/api'
import { AppointmentModal } from '@/components/appointments/appointment-modal'
import { CalendarView } from '@/components/appointments/calendar-view'
import {
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  Plus,
  Filter,
  CalendarDays,
  List,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  FileText
} from 'lucide-react'

export default function AppointmentsPage() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize with current date immediately if on client-side
    if (typeof window !== 'undefined') {
      return new Date().toISOString().split('T')[0]
    }
    return ''
  })
  const [statusFilter, setStatusFilter] = useState('')

  // Set current date on client-side only if not already set
  useEffect(() => {
    if (!selectedDate && typeof window !== 'undefined') {
      setSelectedDate(new Date().toISOString().split('T')[0])
    }
  }, [selectedDate])

  // API hooks - only initialize when selectedDate is available
  const {
    data: appointments,
    loading,
    error,
    pagination,
    updateParams,
    refetch
  } = usePaginatedApi(
    appointmentsApi.getAppointments,
    {
      date: selectedDate || undefined,
      status: statusFilter || undefined
    },
    { enabled: !!selectedDate } // Only run when date is available
  )

  const { mutate: updateAppointment } = useApiMutation()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'নিশ্চিত'
      case 'pending': return 'অপেক্ষমান'
      case 'cancelled': return 'বাতিল'
      case 'completed': return 'সম্পন্ন'
      default: return status
    }
  }

  // Update API params when filters change
  useEffect(() => {
    if (selectedDate) {
      updateParams({
        date: selectedDate,
        status: statusFilter || undefined,
        page: 1
      })
    }
  }, [selectedDate, statusFilter, updateParams])

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointment(() =>
        appointmentsApi.updateAppointment(appointmentId, { status: newStatus })
      )
      refetch()
    } catch (error) {
      console.error('Error updating appointment:', error)
    }
  }

  return (
    <div className="min-h-screen bg-theme-background theme-transition">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-foreground">{t('navigation.appointments')}</h1>
            <p className="text-theme-muted">অ্যাপয়েন্টমেন্ট পরিচালনা ও ক্যালেন্ডার দেখুন</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-theme-card border border-theme-default rounded-lg p-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8"
              >
                <List className="h-4 w-4 mr-2" />
                তালিকা
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="h-8"
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                ক্যালেন্ডার
              </Button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              নতুন ��্যাপয়েন্টমেন্ট
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">আজকের অ্যাপয়েন্টমেন্ট</p>
                  <p className="text-2xl font-bold text-theme-foreground">{appointments?.length || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">নিশ্চিত</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {appointments?.filter(a => a.status === 'confirmed').length || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">অপেক্ষমান</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {appointments?.filter(a => a.status === 'pending').length || 0}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">সম্পন্ন</p>
                  <p className="text-2xl font-bold text-green-600">
                    {appointments?.filter(a => a.status === 'completed').length || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-theme border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-muted" />
                <Input
                  type="text"
                  placeholder="রোগীর নাম, ফোন বা ID দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-theme"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-theme-muted" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-theme"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme"
              >
                <option value="">সব স্ট্যাটাস</option>
                <option value="confirmed">নিশ্চিত</option>
                <option value="pending">অপেক্ষমান</option>
                <option value="completed">সম্পন্ন</option>
                <option value="cancelled">বাতিল</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Table View */}
        {viewMode === 'table' && (
          <Card className="card-theme border">
            <CardHeader>
              <CardTitle className="text-theme-foreground">অ্যাপয়েন্টমেন্ট তালিকা</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="table-theme rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-theme">
                    <thead className="border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          অ্যাপয়েন্টমেন্ট ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          রোগী
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          সময়
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          ধরন
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          ডাক্তার
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          স্ট্যাটাস
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          কার্যক্রম
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-theme-muted mt-2">লোড হচ্ছে...</p>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center">
                            <p className="text-red-600">{error}</p>
                            <Button onClick={refetch} className="mt-4">পুনরায় চেষ্টা করুন</Button>
                          </td>
                        </tr>
                      ) : appointments?.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 theme-transition">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600">{appointment.id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="text-sm font-medium text-theme-foreground">{appointment.patient?.name}</div>
                              <div className="text-sm text-theme-muted flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {appointment.patient?.phone}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-theme-foreground">{appointment.time}</div>
                            <div className="text-sm text-theme-muted">{new Date(appointment.date).toLocaleDateString('bn-BD')}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-theme-foreground">{appointment.type}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-theme-foreground">{appointment.doctor?.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                              {getStatusLabel(appointment.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {appointment.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                  className="h-8 bg-green-600 hover:bg-green-700"
                                >
                                  নিশ্চিত
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!loading && !error && (!appointments || appointments.length === 0) && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-theme-muted mx-auto mb-4" />
                    <div className="text-theme-muted">
                      {statusFilter ? 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি' : 'আজ কোনো অ্যাপয়েন্টমেন্ট নেই'}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <Card className="card-theme border">
            <CardHeader>
              <CardTitle className="text-theme-foreground">ক্যাল���ন্ডার ভিউ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-theme-muted mx-auto mb-4" />
                <div className="text-theme-muted">
                  ক্যালেন্ডার ভিউ শীঘ্রই আসছে
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
