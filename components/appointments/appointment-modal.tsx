'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useApi, useApiMutation } from '@/hooks/useApi'
import { appointmentsApi, patientsApi, usersApi, Appointment } from '@/lib/api'
import { Save, X, Calendar, Clock, User, FileText } from 'lucide-react'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment?: Appointment | null
  selectedDate?: string
  selectedTime?: string
}

interface AppointmentFormData {
  patientId: string
  doctorId: string
  date: string
  time: string
  type: string
  status: string
  notes: string
}

const appointmentTypes = [
  'consultation',
  'followup', 
  'emergency',
  'checkup',
  'surgery',
  'therapy'
]

const appointmentStatuses = [
  'scheduled',
  'confirmed',
  'completed',
  'cancelled',
  'no-show'
]

export function AppointmentModal({ 
  isOpen, 
  onClose, 
  appointment, 
  selectedDate, 
  selectedTime 
}: AppointmentModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    doctorId: '',
    date: selectedDate || '',
    time: selectedTime || '',
    type: 'consultation',
    status: 'scheduled',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // API hooks
  const { data: patients } = useApi(() => patientsApi.getPatients({ limit: 100 }), [])
  const { data: doctors } = useApi(() => usersApi.getUsers({ role: 'doctor', limit: 100 }), [])
  const { mutate, loading, error, success } = useApiMutation()

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: new Date(appointment.date).toISOString().split('T')[0],
        time: appointment.time,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes || ''
      })
    } else {
      setFormData({
        patientId: '',
        doctorId: '',
        date: selectedDate || new Date().toISOString().split('T')[0],
        time: selectedTime || '09:00',
        type: 'consultation',
        status: 'scheduled',
        notes: ''
      })
    }
    setErrors({})
  }, [appointment, selectedDate, selectedTime, isOpen])

  useEffect(() => {
    if (success) {
      onClose()
    }
  }, [success, onClose])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) {
      newErrors.patientId = 'রোগী নির্বাচন করুন'
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'ডাক্তার নির্বাচন করুন'
    }

    if (!formData.date) {
      newErrors.date = 'তারিখ নির্বাচন করুন'
    }

    if (!formData.time) {
      newErrors.time = 'সময় নির্বাচন করুন'
    }

    // Check if appointment date is in the past
    const appointmentDateTime = new Date(`${formData.date}T${formData.time}`)
    const now = new Date()
    if (appointmentDateTime < now && !appointment) {
      newErrors.date = 'অতীতের তারিখ নির্বাচন করা যাবে না'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const appointmentData = {
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`).toISOString()
      }

      if (appointment) {
        await mutate(() => appointmentsApi.updateAppointment(appointment.id, appointmentData))
      } else {
        await mutate(() => appointmentsApi.createAppointment(appointmentData))
      }
    } catch (error) {
      console.error('Error saving appointment:', error)
    }
  }

  const handleChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Generate time slots
  const timeSlots = []
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeSlots.push(timeString)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'অ্যাপয়েন্টমেন্ট সম্পাদনা' : 'নত���ন অ্যাপয়েন্টমেন্ট'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Selection */}
          <div>
            <Label htmlFor="patientId" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              রোগী *
            </Label>
            <Select
              id="patientId"
              value={formData.patientId}
              onChange={(e) => handleChange('patientId', e.target.value)}
              className={errors.patientId ? 'border-red-500' : ''}
            >
              <option value="">রোগী নির্বাচন করুন</option>
              {patients?.data?.map((patient: any) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.phone}
                </option>
              ))}
            </Select>
            {errors.patientId && <p className="text-sm text-red-500 mt-1">{errors.patientId}</p>}
          </div>

          {/* Doctor Selection */}
          <div>
            <Label htmlFor="doctorId" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              ডাক্তার *
            </Label>
            <Select
              id="doctorId"
              value={formData.doctorId}
              onChange={(e) => handleChange('doctorId', e.target.value)}
              className={errors.doctorId ? 'border-red-500' : ''}
            >
              <option value="">ডাক্তার নির্বাচন করুন</option>
              {doctors?.data?.map((doctor: any) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </Select>
            {errors.doctorId && <p className="text-sm text-red-500 mt-1">{errors.doctorId}</p>}
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              তারিখ *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
          </div>

          {/* Time */}
          <div>
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              সময় *
            </Label>
            <Select
              id="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className={errors.time ? 'border-red-500' : ''}
            >
              <option value="">সময় নির্বাচন করুন</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Select>
            {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">অ্যাপয়েন্টমেন্টের ধরন</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'consultation' && 'পরামর্শ'}
                  {type === 'followup' && 'ফলোআপ'}
                  {type === 'emergency' && 'জরুরি'}
                  {type === 'checkup' && 'চেকআপ'}
                  {type === 'surgery' && 'অপারেশন'}
                  {type === 'therapy' && 'থেরাপি'}
                </option>
              ))}
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">স্ট্যাটাস</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {appointmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'scheduled' && 'নির্ধারিত'}
                  {status === 'confirmed' && 'নিশ্চিত'}
                  {status === 'completed' && 'সম্পন্ন'}
                  {status === 'cancelled' && 'বাতিল'}
                  {status === 'no-show' && 'অনুপস্থিত'}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            নোট
          </Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="অতিরিক্ত নোট বা নির্দেশনা..."
            rows={3}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            বাতিল
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {appointment ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
