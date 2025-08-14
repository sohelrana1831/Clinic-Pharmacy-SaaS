'use client'

import { useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useApi } from '@/hooks/useApi'
import { appointmentsApi, Appointment } from '@/lib/api'
import { AppointmentModal } from './appointment-modal'
import { format } from 'date-fns'

interface CalendarViewProps {
  onRefresh: () => void
}

export function CalendarView({ onRefresh }: CalendarViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  // Get appointments for calendar
  const { data: appointments, refetch } = useApi(() => 
    appointmentsApi.getAppointments({ limit: 1000 }), []
  )

  // Transform appointments for FullCalendar
  const appointmentList = Array.isArray(appointments) ? appointments : appointments?.data || []
  const calendarEvents = appointmentList.map((appointment: Appointment) => ({
    id: appointment.id,
    title: `${appointment.patient?.name} - ${appointment.type}`,
    start: `${appointment.date.split('T')[0]}T${appointment.time}`,
    end: `${appointment.date.split('T')[0]}T${addMinutes(appointment.time, 30)}`,
    backgroundColor: getEventColor(appointment.status),
    borderColor: getEventColor(appointment.status),
    extendedProps: {
      appointment: appointment,
      patient: appointment.patient?.name,
      doctor: appointment.doctor?.name,
      phone: appointment.patient?.phone,
      status: appointment.status,
      notes: appointment.notes
    }
  })) || []

  function addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + mins + minutes
    const newHours = Math.floor(totalMinutes / 60)
    const newMins = totalMinutes % 60
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
  }

  function getEventColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return '#3B82F6' // Blue
      case 'confirmed':
        return '#10B981' // Green
      case 'completed':
        return '#6B7280' // Gray
      case 'cancelled':
        return '#EF4444' // Red
      case 'no-show':
        return '#F59E0B' // Orange
      default:
        return '#3B82F6'
    }
  }

  const handleDateSelect = useCallback((selectInfo: any) => {
    const selectedDateTime = new Date(selectInfo.start)
    setSelectedDate(format(selectedDateTime, 'yyyy-MM-dd'))
    setSelectedTime(format(selectedDateTime, 'HH:mm'))
    setSelectedAppointment(null)
    setIsModalOpen(true)
  }, [])

  const handleEventClick = useCallback((clickInfo: any) => {
    setSelectedAppointment(clickInfo.event.extendedProps.appointment)
    setIsModalOpen(true)
  }, [])

  const handleEventDrop = useCallback(async (dropInfo: any) => {
    const appointment = dropInfo.event.extendedProps.appointment
    const newDate = format(dropInfo.event.start, 'yyyy-MM-dd')
    const newTime = format(dropInfo.event.start, 'HH:mm')

    try {
      await appointmentsApi.updateAppointment(appointment.id, {
        date: new Date(`${newDate}T${newTime}`).toISOString(),
        time: newTime
      })
      refetch()
      onRefresh()
    } catch (error) {
      console.error('Error updating appointment:', error)
      dropInfo.revert()
    }
  }, [refetch, onRefresh])

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedAppointment(null)
    refetch()
    onRefresh()
  }

  return (
    <div className="h-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="timeGridWeek"
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          height="auto"
          selectable={true}
          selectMirror={true}
          editable={true}
          droppable={true}
          events={calendarEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          businessHours={{
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Sunday to Saturday
            startTime: '08:00',
            endTime: '20:00'
          }}
          eventDisplay="block"
          dayMaxEvents={3}
          moreLinkClick="popover"
          eventContent={(eventInfo) => (
            <div className="p-1 text-xs">
              <div className="font-semibold truncate">
                {eventInfo.event.extendedProps.patient}
              </div>
              <div className="truncate">
                {eventInfo.event.extendedProps.doctor}
              </div>
              <div className="truncate opacity-75">
                {eventInfo.event.extendedProps.phone}
              </div>
            </div>
          )}
          eventMouseEnter={(info) => {
            // Create tooltip
            const tooltip = document.createElement('div')
            tooltip.className = 'absolute z-50 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg max-w-xs'
            tooltip.innerHTML = `
              <div class="font-semibold">${info.event.extendedProps.patient}</div>
              <div>ডাক্তার: ${info.event.extendedProps.doctor}</div>
              <div>ফোন: ${info.event.extendedProps.phone}</div>
              <div>স্ট্যাটাস: ${info.event.extendedProps.status}</div>
              ${info.event.extendedProps.notes ? `<div>নোট: ${info.event.extendedProps.notes}</div>` : ''}
            `
            
            document.body.appendChild(tooltip)
            
            const updateTooltipPosition = (e: MouseEvent) => {
              tooltip.style.left = e.pageX + 10 + 'px'
              tooltip.style.top = e.pageY - 10 + 'px'
            }
            
            document.addEventListener('mousemove', updateTooltipPosition)
            
            info.el.addEventListener('mouseleave', () => {
              document.removeEventListener('mousemove', updateTooltipPosition)
              if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip)
              }
            }, { once: true })
          }}
        />
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        appointment={selectedAppointment}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  )
}
