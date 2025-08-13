'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Plus
} from 'lucide-react'

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CalendarEvent {
  id: string
  title: string
  time: string
  type: 'appointment' | 'follow-up' | 'checkup'
  patient?: string
}

const mockEvents: Record<string, CalendarEvent[]> = {
  '2024-01-15': [
    { id: '1', title: 'নিয়মিত চেকআপ', time: '10:00', type: 'checkup', patient: 'রহিম উদ্দিন' },
    { id: '2', title: 'ফ��োআপ ভিজিট', time: '14:30', type: 'follow-up', patient: 'ফাতেমা খাতুন' }
  ],
  '2024-01-16': [
    { id: '3', title: 'নতুন রোগী', time: '09:30', type: 'appointment', patient: 'আবুল কাশেম' }
  ]
}

export function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const { t } = useTranslation()
  // Use static date initially to prevent hydration mismatch
  const [currentDate, setCurrentDate] = useState(new Date('2024-01-15'))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Set current date on client-side only
  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  const getMonthName = (month: number) => {
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জু���',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ]
    return months[month]
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'follow-up':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'checkup':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isToday = (day: number) => {
    return currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth() &&
           day === today.getDate()
  }

  const hasEvents = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    return mockEvents[dateKey] && mockEvents[dateKey].length > 0
  }

  const handleDateClick = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(dateKey)
  }

  const selectedEvents = selectedDate ? mockEvents[selectedDate] || [] : []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="অ্যাপয়েন্টমেন্ট ক্যা���েন্ডার"
    >
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-theme-foreground">
            {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigateMonth('prev')}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigateMonth('next')}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Grid */}
          <Card className="card-theme border">
            <CardContent className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'ব��হ', 'শুক্র', 'শনি'].map((day) => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-theme-muted">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <button
                        onClick={() => handleDateClick(day)}
                        className={`w-full h-full flex flex-col items-center justify-center text-sm rounded-md theme-transition relative ${
                          isToday(day)
                            ? 'bg-blue-600 text-white font-medium'
                            : selectedDate === formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'hover-theme-bg text-theme-foreground'
                        }`}
                      >
                        <span>{day}</span>
                        {hasEvents(day) && (
                          <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full"></div>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events Panel */}
          <Card className="card-theme border">
            <CardHeader>
              <CardTitle className="text-theme-foreground flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {selectedDate ? 'নির্বাচিত দিনের ইভেন্ট' : 'আজকের ইভেন্ট'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedEvents.length > 0 ? (
                  selectedEvents.map((event) => (
                    <div key={event.id} className="p-3 border border-theme-default rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type === 'appointment' ? 'অ্যাপয়েন্টমেন্ট' :
                           event.type === 'follow-up' ? 'ফলোআপ' : 'চে���আপ'}
                        </span>
                        <div className="flex items-center text-sm text-theme-muted">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.time}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-theme-foreground">{event.title}</div>
                      {event.patient && (
                        <div className="flex items-center mt-1 text-sm text-theme-muted">
                          <User className="h-4 w-4 mr-1" />
                          {event.patient}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-theme-muted mx-auto mb-4" />
                    <p className="text-theme-muted">এই দিনে কোনো ইভেন্ট নেই</p>
                    <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      নতুন অ্যাপয়েন্টমেন্ট
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-theme-muted">আজ</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-theme-muted">ইভেন্ট আছে</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
