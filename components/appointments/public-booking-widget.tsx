'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  sampleClinics, 
  sampleDoctors, 
  getDoctorsByClinic, 
  getAvailableSlots, 
  formatTime, 
  AppointmentBooking 
} from '@/lib/appointments-data'
import { Calendar, Clock, MapPin, User, Phone, CheckCircle, MessageSquare } from 'lucide-react'

interface PublicBookingWidgetProps {
  embedded?: boolean
  onBookingComplete?: (booking: AppointmentBooking) => void
}

export function PublicBookingWidget({ embedded = false, onBookingComplete }: PublicBookingWidgetProps) {
  const [step, setStep] = useState(1) // 1: form, 2: confirmation
  const [formData, setFormData] = useState<Partial<AppointmentBooking>>({
    patientName: '',
    phone: '',
    clinicId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    consent: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableDoctors, setAvailableDoctors] = useState(sampleDoctors)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update doctors when clinic changes
  useEffect(() => {
    if (formData.clinicId) {
      const doctors = getDoctorsByClinic(formData.clinicId)
      setAvailableDoctors(doctors)
      setFormData(prev => ({ ...prev, doctorId: '' })) // Reset doctor selection
    }
  }, [formData.clinicId])

  // Update time slots when doctor or date changes
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const slots = getAvailableSlots(formData.doctorId, formData.date)
      setAvailableSlots(slots)
      setFormData(prev => ({ ...prev, time: '' })) // Reset time selection
    }
  }, [formData.doctorId, formData.date])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientName?.trim()) {
      newErrors.patientName = 'রো��ীর নাম প্রয়োজন'
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'ফোন নম্বর প্রয়োজন'
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'বৈধ বাংলাদেশি মোবাইল নম্বর দিন'
    }

    if (!formData.clinicId) {
      newErrors.clinicId = 'ক্লিনিক নির্বাচন করুন'
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'ডাক্তার নির্বাচন করুন'
    }

    if (!formData.date) {
      newErrors.date = 'তারিখ নির্বাচন করুন'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.date = 'ভবিষ্যতের তারিখ নির্বাচন করুন'
      }
    }

    if (!formData.time) {
      newErrors.time = 'সময় নির্বাচন করুন'
    }

    if (!formData.reason?.trim()) {
      newErrors.reason = 'অ্যাপয়েন্টমেন্টের কারণ লিখুন'
    }

    if (!formData.consent) {
      newErrors.consent = '��র্তাবলী সম্মত হতে হবে'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const booking: AppointmentBooking = {
        patientName: formData.patientName!,
        phone: formData.phone!,
        clinicId: formData.clinicId!,
        doctorId: formData.doctorId!,
        date: formData.date!,
        time: formData.time!,
        reason: formData.reason!,
        consent: formData.consent!,
        status: 'scheduled'
      }
      
      onBookingComplete?.(booking)
      setStep(2)
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setIsSubmitting(false)
    }
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

  const selectedClinic = sampleClinics.find(c => c.id === formData.clinicId)
  const selectedDoctor = sampleDoctors.find(d => d.id === formData.doctorId)

  if (step === 2) {
    return (
      <Card className={embedded ? 'border-0 shadow-none' : ''}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            অ্যাপয়েন্টমেন্ট সফল!
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-800 mb-4">বুকিং বিবরণ:</h3>
            <div className="space-y-2 text-left">
              <p><strong>রোগী:</strong> {formData.patientName}</p>
              <p><strong>ফোন:</strong> {formData.phone}</p>
              <p><strong>ক্লিনিক:</strong> {selectedClinic?.name}</p>
              <p><strong>ডাক্তার:</strong> {selectedDoctor?.name}</p>
              <p><strong>তারিখ:</strong> {new Date(formData.date!).toLocaleDateString('bn-BD')}</p>
              <p><strong>সময়:</strong> {formatTime(formData.time!)}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center text-blue-700">
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="text-sm">আপনার ফোনে একটি নিশ্চিতকরণ SMS পাঠানো হয়েছে</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <p>অ্যাপয়েন্টমেন্টের ৩০ মিনিট আগে ক্লিনিকে পৌঁছানোর চেষ্টা করুন।</p>
            <p>কোনো সমস্যা হলে ক্লিনিকে যোগাযোগ করুন: {selectedClinic?.phone}</p>
          </div>

          <Button 
            onClick={() => {
              setStep(1)
              setFormData({
                patientName: '',
                phone: '',
                clinicId: '',
                doctorId: '',
                date: '',
                time: '',
                reason: '',
                consent: false
              })
            }}
            variant="outline"
            className="w-full"
          >
            নতুন অ্যাপয়েন্টমেন্ট বুক করুন
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={embedded ? 'border-0 shadow-none' : ''}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Calendar className="h-6 w-6 mr-2 text-blue-600" />
          অ্যাপয়েন্টমেন্ট বুক করুন
        </CardTitle>
        <p className="text-gray-600">আপনার সুবিধামত সময়ে ডাক্তারের অ্যাপয়েন্টমেন্ট নিন</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                রোগীর নাম *
              </Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
                placeholder="আপনার পূর্ণ নাম"
                className={errors.patientName ? 'border-red-500' : ''}
              />
              {errors.patientName && <p className="text-sm text-red-500 mt-1">{errors.patientName}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                মোবাইল নম্বর *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="০১৭xxxxxxxx"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Clinic Selection */}
          <div>
            <Label htmlFor="clinic" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              ক্লিনিক নির্বাচন করুন *
            </Label>
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

          {/* Doctor Selection */}
          {formData.clinicId && (
            <div>
              <Label htmlFor="doctor">ডাক্তার নির্বাচন করুন *</Label>
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
          )}

          {/* Date Selection */}
          {formData.doctorId && (
            <div>
              <Label htmlFor="date" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                পছন্দের তারিখ *
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
          )}

          {/* Time Selection */}
          {formData.date && availableSlots.length > 0 && (
            <div>
              <Label className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                উপলব্ধ সময় *
              </Label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => handleChange('time', slot.time)}
                    disabled={!slot.available}
                    className={`
                      p-3 text-sm rounded-lg border transition-colors
                      ${formData.time === slot.time
                        ? 'bg-blue-600 text-white border-blue-600'
                        : slot.available
                          ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }
                    `}
                  >
                    {formatTime(slot.time)}
                  </button>
                ))}
              </div>
              {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
            </div>
          )}

          {/* Reason */}
          <div>
            <Label htmlFor="reason">অ্যাপয়েন্টমেন্টের কারণ *</Label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="সংক্ষেপে লিখুন (যেমন: নিয়মিত চেকআপ, জ্বর, পেটের স��স্যা)"
              rows={3}
              className={`w-full p-3 border rounded-md resize-none ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason}</p>}
          </div>

          {/* Consent */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onChange={(e) => handleChange('consent', e.target.checked)}
            />
            <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
              আমি নিশ্চিত করছি যে প্রদত্ত তথ্য সঠিক এবং{' '}
              <span className="text-blue-600 hover:underline">শর্তাবলী</span> সম্মত আছি।
              অ্যাপয়েন্টমেন্ট বাতিল বা পরিবর্তনের জন্য কমপক্ষে ২৪ ঘন্টা আগে জানাব।
            </label>
          </div>
          {errors.consent && <p className="text-sm text-red-500">{errors.consent}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isSubmitting ? 'বুক করা হচ্ছে...' : 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
