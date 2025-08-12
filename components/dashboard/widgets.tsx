'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Plus,
  FileText,
  ShoppingCart,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface StatsWidgetProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease'
  icon: React.ReactNode
  color: string
  onClick?: () => void
}

function StatsWidget({ title, value, change, changeType, icon, color, onClick }: StatsWidgetProps) {
  return (
    <Card
      className="hover:shadow-md theme-transition cursor-pointer focus-ring"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      aria-label={`${title}: ${value}${change ? `, ${change}` : ''}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-theme-muted">{title}</p>
            <p className="text-2xl font-bold text-theme-foreground">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                {changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error-500 mr-1" />
                )}
                <span className={`text-sm ${changeType === 'increase' ? 'text-success-600' : 'text-error-600'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TodayStats({ onAppointmentsClick, onPatientsClick, onSalesClick }: {
  onAppointmentsClick: () => void
  onPatientsClick: () => void
  onSalesClick: () => void
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsWidget
        title="আজকের অ্যাপয়েন্টমেন্ট"
        value={24}
        change="+৮%"
        changeType="increase"
        icon={<Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />}
        color="bg-primary-100 dark:bg-primary-900"
        onClick={onAppointmentsClick}
      />
      <StatsWidget
        title="নতুন রোগী"
        value={7}
        change="+২৩%"
        changeType="increase"
        icon={<Users className="h-6 w-6 text-success-600 dark:text-success-400" />}
        color="bg-success-100 dark:bg-success-900"
        onClick={onPatientsClick}
      />
      <StatsWidget
        title="আজকের বিক্রয়"
        value="৳১২,৫০০"
        change="-৫%"
        changeType="decrease"
        icon={<DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
        color="bg-purple-100 dark:bg-purple-900"
        onClick={onSalesClick}
      />
    </div>
  )
}

export function UpcomingAppointments({ onViewAll }: { onViewAll: () => void }) {
  const appointments = [
    { time: '০৯:৩০', patient: 'আবদুর রহমান', type: 'চেকআপ', status: 'নিশ্চিত' },
    { time: '১০:১৫', patient: 'ফাতেমা খাতুন', type: 'ফলোআপ', status: 'অপেক্ষায়' },
    { time: '১১:০০', patient: 'মোহাম্মদ আলী', type: 'পরামর্শ', status: 'নিশ্চিত' },
    { time: '১১:৪৫', patient: 'রোকেয়া বেগম', type: '��েকআপ', status: 'নিশ্চ��ত' },
    { time: '১২:৩০', patient: 'করিম উদ্দিন', type: 'জরুরি', status: 'অপেক্ষায়' }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
          আসন্ন অ্যাপয়েন্টমেন্ট
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onViewAll}>
          সব দেখুন
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg theme-transition">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center theme-transition">
                  <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">{appointment.time}</span>
                </div>
                <div>
                  <p className="font-medium text-theme-foreground">{appointment.patient}</p>
                  <p className="text-sm text-theme-muted">{appointment.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                appointment.status === 'নিশ্চিত'
                  ? 'bg-success-100 dark:bg-success-900 text-success-600 dark:text-success-400'
                  : 'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400'
              }`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function LowStockMedicines({ onViewAll }: { onViewAll: () => void }) {
  const medicines = [
    { name: 'প্যারাসিটামল ৫০০mg', stock: 5, minStock: 20, unit: 'বক্স' },
    { name: 'ওমিপ্রাজল ২০mg', stock: 8, minStock: 15, unit: 'বক্স' },
    { name: 'এজিথ্রোমাইসিন', stock: 3, minStock: 10, unit: 'বক্স' },
    { name: 'সিপ্রোফ্লক্সাসিন', stock: 12, minStock: 25, unit: 'বক্স' }
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400 mr-2" />
          কম স্টক ওষুধ
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onViewAll}>
          সব দেখুন
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {medicines.map((medicine, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-warning-200 dark:border-warning-800 rounded-lg bg-warning-50 dark:bg-warning-900/20 theme-transition">
              <div>
                <p className="font-medium text-theme-foreground">{medicine.name}</p>
                <p className="text-sm text-theme-muted">সর্বনিম্ন: {medicine.minStock} {medicine.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-warning-600 dark:text-warning-400">{medicine.stock}</p>
                <p className="text-sm text-gray-500">{medicine.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function QuickActions({ 
  onNewPatient, 
  onNewAppointment, 
  onNewSale, 
  onWritePrescription 
}: {
  onNewPatient: () => void
  onNewAppointment: () => void
  onNewSale: () => void
  onWritePrescription: () => void
}) {
  const actions = [
    { label: 'নতুন রোগী', icon: <Plus className="h-5 w-5" />, color: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600', onClick: onNewPatient },
    { label: 'অ্যাপয়েন্��মেন্ট', icon: <Calendar className="h-5 w-5" />, color: 'bg-emerald-600 hover:bg-emerald-700', onClick: onNewAppointment },
    { label: 'নতুন বিক্রয়', icon: <ShoppingCart className="h-5 w-5" />, color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600', onClick: onNewSale },
    { label: 'প্রেসক্রিপশন', icon: <FileText className="h-5 w-5" />, color: 'bg-warning-600 hover:bg-warning-700 dark:bg-warning-500 dark:hover:bg-warning-600', onClick: onWritePrescription }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          দ্রুত কার্যক্রম
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white h-16 flex flex-col items-center justify-center space-y-1`}
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentActivity() {
  const activities = [
    { time: '১০ মিনিট আগে', action: 'নতুন রোগী যোগ', details: 'আবদুর রহমান রেজিস্ট্রেশন সম্পন্ন', type: 'patient' },
    { time: '২৫ মিনিট আগে', action: 'প্রেসক্রিপশন তৈরি', details: 'ফাতেমা খাতুনের জন্য', type: 'prescription' },
    { time: '৪৫ মিনিট আগে', action: 'ওষুধ বিক্রয়', details: '৳৮৫০ - প্যারাসিটামল, ওমিপ্রাজল', type: 'sale' },
    { time: '১ ঘন্টা আগে', action: 'অ্যাপয়েন্টমেন্ট নিশ্চিত', details: 'মোহাম্মদ আলী - ১১:০০', type: 'appointment' },
    { time: '২ ঘন্টা আগে', action: 'স্টক আপডেট', details: 'এজিথ্রোমাইসিন - ১০ বক্স যোগ', type: 'inventory' }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'patient': return <Users className="h-4 w-4 text-blue-600" />
      case 'prescription': return <FileText className="h-4 w-4 text-green-600" />
      case 'sale': return <ShoppingCart className="h-4 w-4 text-purple-600" />
      case 'appointment': return <Calendar className="h-4 w-4 text-orange-600" />
      case 'inventory': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          সাম্প্রতিক কার্যক্রম
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.details}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
