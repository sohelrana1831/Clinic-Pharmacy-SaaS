'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { 
  TodayStats, 
  UpcomingAppointments, 
  LowStockMedicines, 
  QuickActions, 
  RecentActivity 
} from '@/components/dashboard/widgets'
import { 
  NewPatientModal, 
  NewAppointmentModal, 
  NewSaleModal 
} from '@/components/modals/modal'

export default function DashboardPage() {
  const [modals, setModals] = useState({
    newPatient: false,
    newAppointment: false,
    newSale: false,
    writePrescription: false,
    viewAppointments: false,
    viewLowStock: false,
    viewAllAppointments: false
  })

  const openModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: true }))
  }

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }))
  }

  const handleWritePrescription = () => {
    // Navigate to prescription writing page
    window.location.href = '/prescriptions/editor'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ড্যাশবোর্ড</h1>
            <p className="text-gray-600">আপনার ক্লিনিকের সামগ্রিক তথ্য এক নজরে দেখুন</p>
          </div>

          {/* Today's Stats */}
          <TodayStats
            onAppointmentsClick={() => openModal('viewAppointments')}
            onPatientsClick={() => openModal('newPatient')}
            onSalesClick={() => openModal('newSale')}
          />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2 widgets */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <UpcomingAppointments 
                onViewAll={() => openModal('viewAllAppointments')}
              />
              
              {/* Recent Activity */}
              <RecentActivity />
            </div>

            {/* Right Column - 2 widgets */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <QuickActions
                onNewPatient={() => openModal('newPatient')}
                onNewAppointment={() => openModal('newAppointment')}
                onNewSale={() => openModal('newSale')}
                onWritePrescription={handleWritePrescription}
              />
              
              {/* Low Stock Medicines */}
              <LowStockMedicines 
                onViewAll={() => openModal('viewLowStock')}
              />
            </div>
          </div>

          {/* Additional Stats Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">মোট রোগী</p>
                  <p className="text-2xl font-bold text-gray-900">১,২৮৫</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">মাসিক আয়</p>
                  <p className="text-2xl font-bold text-gray-900">৳৩,৪৫,০০০</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">💰</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">মোট ওষুধ</p>
                  <p className="text-2xl font-bold text-gray-900">৪৫৬</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">💊</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ডাক্তার</p>
                  <p className="text-2xl font-bold text-gray-900">৫</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold">👨‍⚕️</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <NewPatientModal
        isOpen={modals.newPatient}
        onClose={() => closeModal('newPatient')}
      />
      
      <NewAppointmentModal
        isOpen={modals.newAppointment}
        onClose={() => closeModal('newAppointment')}
      />
      
      <NewSaleModal
        isOpen={modals.newSale}
        onClose={() => closeModal('newSale')}
      />
    </div>
  )
}
