'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { samplePatients } from '@/lib/patients-data'
import { 
  sampleClinics, 
  sampleDoctors, 
  getDoctorsByClinic, 
  getAvailableSlots, 
  formatTime, 
  AppointmentBooking 
} from '@/lib/appointments-data'
import { Search, User, Clock, Calendar, CheckCircle } from 'lucide-react'

interface InternalAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (appointment: AppointmentBooking) => void
  clinicId?: string
}

export function InternalAppointmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  clinicId 
}: InternalAppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientSearch: '',
    selectedPatientId: '',
    clinicId: clinicId || '',
    doctorId: '',
    date: '',
    time: '',
    type: '',
    notes: '',
    status: 'scheduled' as 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState(samplePatients)
  const [availableDoctors, setAvailableDoctors] = useState(sampleDoctors)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [showToast, setShowToast] = useState(false)

  // Filter patients based on search
  useEffect(() => {
    if (formData.patientSearch) {
      const filtered = samplePatients.filter(patient =>
        patient.name.toLowerCase().includes(formData.patientSearch.toLowerCase()) ||
        patient.phone.includes(formData.patientSearch) ||
        patient.id.toLowerCase().includes(formData.patientSearch.toLowerCase())
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(samplePatients)
    }
  }, [formData.patientSearch])

  // Update doctors when clinic changes
  useEffect(() => {
    if (formData.clinicId) {
      const doctors = getDoctorsByClinic(formData.clinicId)
      setAvailableDoctors(doctors)
      setFormData(prev => ({ ...prev, doctorId: '' }))
    }
  }, [formData.clinicId])

  // Update time slots when doctor or date changes
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const slots = getAvailableSlots(formData.doctorId, formData.date)
      setAvailableSlots(slots)
      setFormData(prev => ({ ...prev, time: '' }))
    }
  }, [formData.doctorId, formData.date])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.selectedPatientId) {
      newErrors.patient = 'রোগী নির্বাচন করুন'
    }

    if (!formData.clinicId) {
      newErrors.clinicId = 'ক্লিনিক নির্বাচন করুন'
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

    if (!formData.type) {
      newErrors.type = 'অ্যাপয়েন্টমেন্টের ধরন নির্বাচন করুন'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const selectedPatient = samplePatients.find(p => p.id === formData.selectedPatientId)
    if (!selectedPatient) return

    const appointment: AppointmentBooking = {
      patientName: selectedPatient.name,
      phone: selectedPatient.phone,
      clinicId: formData.clinicId,
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      reason: formData.type,
      consent: true,
      notes: formData.notes,
      status: formData.status
    }

    onSave(appointment)
    
    // Show success toast
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      onClose()
      // Reset form
      setFormData({
        patientSearch: '',
        selectedPatientId: '',
        clinicId: clinicId || '',
        doctorId: '',
        date: '',
        time: '',
        type: '',
        notes: '',
        status: 'scheduled'
      })
    }, 2000)
  }

  const handlePatientSelect = (patient: any) => {
    setFormData(prev => ({
      ...prev,
      patientSearch: patient.name,
      selectedPatientId: patient.id
    }))
    setShowPatientDropdown(false)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    // Set timezone to Asia/Dhaka
    const dhakaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Dhaka"}))
    return dhakaTime.toISOString().split('T')[0]
  }

  return (
    <>
      <Modal 
        isOpen={isOpen && !showToast} 
        onClose={onClose} 
        title="নতুন অ্যাপয়েন্টমেন্ট তৈরি করুন"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Patient Search */}
          <div className="relative">
            <Label htmlFor="patientSearch" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              রোগী খুঁজুন *
            </Label>
            <Input
              id="patientSearch"
              value={formData.patientSearch}
              onChange={(e) => {
                handleChange('patientSearch', e.target.value)
                setShowPatientDropdown(true)
                setFormData(prev => ({ ...prev, selectedPatientId: '' }))
              }}
              onFocus={() => setShowPatientDropdown(true)}
              placeholder="নাম, ফোন বা ID দিয়ে খুঁজুন..."
              className={errors.patient ? 'border-red-500' : ''}
            />
            
            {/* Patient Dropdown */}
            {showPatientDropdown && formData.patientSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredPatients.length > 0 ? (
                  filteredPatients.slice(0, 5).map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.id} • {patient.phone}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">কোনো রোগী পাওয়া যায়নি</div>
                )}
              </div>
            )}
            {errors.patient && <p className="text-sm text-red-500 mt-1">{errors.patient}</p>}
          </div>

          {/* Clinic Selection */}
          {!clinicId && (
            <div>
              <Label htmlFor="clinic">ক্লিনিক *</Label>
              <Select
                id="clinic"
                value={formData.clinicId}
                onChange={(e) => handleChange('clinicId', e.target.value)}
                className={errors.clinicId ? 'border-red-500' : ''}
              >
                <option value="">ক্লিনিক নির্বাচন করুন</option>
                {sampleClinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </Select>
              {errors.clinicId && <p className="text-sm text-red-500 mt-1">{errors.clinicId}</p>}
            </div>
          )}

          {/* Doctor Selection */}
          <div>
            <Label htmlFor="doctor">ডাক্তার *</Label>
            <Select
              id="doctor"
              value={formData.doctorId}
              onChange={(e) => handleChange('doctorId', e.target.value)}
              className={errors.doctorId ? 'border-red-500' : ''}
            >
              <option value="">ডাক্তার নির্বাচন করুন</option>
              {availableDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </Select>
            {errors.doctorId && <p className="text-sm text-red-500 mt-1">{errors.doctorId}</p>}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                তারিখ *
              </Label>
              <Input
                id="date"
                type="date"
                min={getMinDate()}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="time" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                সময় *
              </Label>
              <Select
                id="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className={errors.time ? 'border-red-500' : ''}
              >
                <option value="">সময় নির্বাচন করুন</option>
                {availableSlots.map((slot) => (
                  <option key={slot.time} value={slot.time} disabled={!slot.available}>
                    {formatTime(slot.time)} {!slot.available && '(অনুপলব্ধ)'}
                  </option>
                ))}
              </Select>
              {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">অ্যাপয়েন্টমেন্টের ধরন *</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className={errors.type ? 'border-red-500' : ''}
              >
                <option value="">ধরন নির্বাচন করুন</option>
                <option value="নিয়মিত চেকআপ">নিয়মিত চেকআপ</option>
                <option value="ফলোআপ">ফলোআপ</option>
                <option value="পরামর্শ">পরামর্শ</option>
                <option value="জরুরি">জরুরি</option>
                <option value="প্রাথমিক পরীক্ষা">প্রাথমিক পরীক্ষা</option>
              </Select>
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
            </div>

            <div>
              <Label htmlFor="status">স্ট্যাটাস</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="scheduled">নির্ধারিত</option>
                <option value="confirmed">নিশ্চিত</option>
                <option value="cancelled">বাতিল</option>
                <option value="completed">সম্পন্ন</option>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">অতিরিক্ত নোট</Label>
            <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="বিশেষ নির্দেশনা বা মন্তব্য..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md resize-none text-gray-900 placeholder:text-gray-500"
          />
          </div>

          {/* Timezone Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>সময় অঞ্চল:</strong> বাংলাদেশ সময় (UTC+6) • 
              বর্তমান সময়: ১৫ জানুয়ারি, ২০২৪, ১০:৩০ AM
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              অ্যাপয়েন্টমেন্ট সংরক্ষণ করুন
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              বাতিল
            </Button>
          </div>
        </form>
      </Modal>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>অ্যাপয়েন্টমেন্ট সফলভাবে তৈরি হয়েছে!</span>
          </div>
        </div>
      )}
    </>
  )
}
