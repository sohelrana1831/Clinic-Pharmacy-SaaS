'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
    <div className="min-h-screen bg-theme-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-6 bg-theme-background">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-theme-foreground mb-2">{t('dashboard.title')}</h1>
            <p className="text-theme-muted">{t('dashboard.subtitle')}</p>
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
            <div className="card-theme p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">মোট রোগী</p>
                  <p className="text-2xl font-bold text-theme-foreground">১,২৮৫</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center theme-transition">
                  <span className="text-primary-600 dark:text-primary-400 font-bold">👥</span>
                </div>
              </div>
            </div>

            <div className="card-theme p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">মাসিক আয়</p>
                  <p className="text-2xl font-bold text-theme-foreground">৳৩,৪��,০০০</p>
                </div>
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center theme-transition">
                  <span className="text-success-600 dark:text-success-400 font-bold">💰</span>
                </div>
              </div>
            </div>

            <div className="card-theme p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">মোট ওষুধ</p>
                  <p className="text-2xl font-bold text-theme-foreground">৪৫৬</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center theme-transition">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">💊</span>
                </div>
              </div>
            </div>

            <div className="card-theme p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">ডাক্তার</p>
                  <p className="text-2xl font-bold text-theme-foreground">৫</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center theme-transition">
                  <span className="text-warning-600 dark:text-warning-400 font-bold">👨‍⚕️</span>
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
