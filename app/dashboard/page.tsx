'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/modals/modal'
import { 
  Calendar,
  Users,
  DollarSign,
  Pill,
  TrendingUp,
  AlertTriangle,
  Clock,
  Plus,
  Activity,
  BarChart3,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { dashboardApi, DashboardStats } from '@/lib/api'
import { useApi } from '@/hooks/useApi'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [modals, setModals] = useState({
    newPatient: false,
    newAppointment: false,
    newSale: false,
  })

  // Fetch dashboard data
  const {
    data: stats,
    loading,
    error,
    refetch
  } = useApi<DashboardStats>(() => dashboardApi.getStats())

  const openModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: true }))
  }

  const closeModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: false }))
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6">
          <div className="flex items-center space-x-4 text-red-600">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h3 className="font-semibold">Failed to load dashboard</h3>
              <p className="text-sm text-gray-600">{error}</p>
              <Button onClick={refetch} size="sm" className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('dashboard.title') || 'ড্যাশবোর্ড'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('dashboard.subtitle') || 'আপনার ক্লিনিক ব্যবস্থাপনার সারসংক্ষেপ'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {loading && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">আজকের অ্যাপয়েন্টমেন্ট</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {loading ? '...' : stats?.todayAppointments || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {loading ? '' : '+12%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">মোট রোগী</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {loading ? '...' : stats?.totalPatients || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {loading ? '' : '+8%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">আজকের বিক্রয়</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ৳{loading ? '...' : (stats?.todaySales || 0).toLocaleString()}
                </p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                  {loading ? '' : '-5%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">স্টক কম</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {loading ? '...' : stats?.lowStockMedicines || 0}
                </p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {loading ? '' : 'Needs attention'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Pill className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              আসন্ন অ্যাপয়েন্টমেন্ট
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => openModal('newAppointment')}>
              <Plus className="h-4 w-4 mr-1" />
              নতুন
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats?.recentAppointments?.length ? (
              <div className="space-y-3">
                {stats.recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{appointment.patient?.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.time} - {appointment.doctor?.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'নিশ্চিত' :
                         appointment.status === 'scheduled' ? 'নির্ধারিত' :
                         appointment.status === 'completed' ? 'সম্পন্ন' : 'বাতিল'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">কোনো অ্যাপয়েন্টমেন্ট নেই</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>দ্রুত কার্যক্রম</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              onClick={() => openModal('newPatient')}
            >
              <Plus className="h-4 w-4 mr-2" />
              নতুন রোগী যোগ করুন
            </Button>
            <Button 
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              onClick={() => openModal('newAppointment')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              অ্যাপয়েন্টমেন্ট বুক করুন
            </Button>
            <Button 
              className="w-full justify-start bg-purple-600 hover:bg-purple-700"
              onClick={() => openModal('newSale')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              নতুন বিক্রয়
            </Button>
            <Button 
              className="w-full justify-start bg-orange-600 hover:bg-orange-700"
              onClick={() => window.location.href = '/dashboard/prescriptions'}
            >
              <Activity className="h-4 w-4 mr-2" />
              প্রেসক্রিপশন লিখুন
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
              সাপ্তাহিক বিক্রয়
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="h-48 flex items-end space-x-2">
                {stats?.salesChart?.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-600 rounded-t"
                      style={{ 
                        height: `${Math.max(8, (day.amount / 1000) * 100)}px`,
                        minHeight: '8px'
                      }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">
                      {new Date(day.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      ৳{day.amount.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              সাম্প্রতিক বিক্রয়
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between p-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : stats?.recentSales?.length ? (
              <div className="space-y-3">
                {stats.recentSales.map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                    <div>
                      <p className="font-medium text-sm">{sale.invoiceNo}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {sale.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">৳{sale.finalAmount}</p>
                      <p className="text-xs text-gray-500">{sale.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">কোনো বিক্রয় নেই</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals would be implemented here */}
      {/* For now, just placeholder modals */}
      <Modal
        isOpen={modals.newPatient}
        onClose={() => closeModal('newPatient')}
        title="নতুন রোগী যোগ করুন"
      >
        <p>এই মোডালটি শীঘ্রই implement করা হবে</p>
        <Button onClick={() => closeModal('newPatient')} className="mt-4">
          বন্ধ করুন
        </Button>
      </Modal>

      <Modal
        isOpen={modals.newAppointment}
        onClose={() => closeModal('newAppointment')}
        title="নতুন অ্যাপয়েন্টমেন্ট"
      >
        <p>এই মোডালটি শীঘ্রই implement করা হবে</p>
        <Button onClick={() => closeModal('newAppointment')} className="mt-4">
          বন্ধ করুন
        </Button>
      </Modal>

      <Modal
        isOpen={modals.newSale}
        onClose={() => closeModal('newSale')}
        title="নতুন বিক্রয়"
      >
        <p>এই মোডালটি শীঘ্রই implement করা হবে</p>
        <Button onClick={() => closeModal('newSale')} className="mt-4">
          বন্ধ করুন
        </Button>
      </Modal>
    </div>
  )
}
