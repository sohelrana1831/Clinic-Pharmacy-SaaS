'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Patient } from '@/lib/patients-data'

interface PatientFormModalProps {
  isOpen: boolean
  onClose: () => void
  patient?: Patient | null
  onSave: (patient: Omit<Patient, 'id' | 'createdAt'>) => void
}

export function PatientFormModal({ isOpen, onClose, patient, onSave }: PatientFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    allergies: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        phone: patient.phone,
        email: patient.email || '',
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        emergencyContact: patient.emergencyContact || '',
        bloodGroup: patient.bloodGroup || '',
        allergies: patient.allergies?.join(', ') || '',
        notes: patient.notes || ''
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContact: '',
        bloodGroup: '',
        allergies: '',
        notes: ''
      })
    }
    setErrors({})
  }, [patient, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'ফোন নম্বর প্রয়োজন'
    } else if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'বৈধ বাংলাদেশি মোবাইল নম্বর দিন (০১ দিয়ে শুরু, ১১ ডিজিট)'
    }

    // Email validation (optional)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'বৈধ ইমেইল ঠিকানা দিন'
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'জন্ম তারিখ প্রয়োজন'
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (birthDate > today) {
        newErrors.dateOfBirth = 'জন্ম তারিখ ভবিষ্যতের হতে পারে না'
      } else if (age > 150) {
        newErrors.dateOfBirth = 'বৈধ জন্ম তারিখ দিন'
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'লিঙ্গ নির্বাচন করুন'
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'ঠিকানা প্রয়োজন'
    }

    // Emergency contact validation (optional but if provided, should be valid)
    if (formData.emergencyContact && !/^01[3-9]\d{8}$/.test(formData.emergencyContact)) {
      newErrors.emergencyContact = 'বৈধ জরুরি যোগাযোগ নম্বর দিন'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const patientData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as 'male' | 'female' | 'other',
        address: formData.address.trim(),
        emergencyContact: formData.emergencyContact.trim() || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        allergies: formData.allergies.trim() ? formData.allergies.split(',').map(a => a.trim()) : [],
        notes: formData.notes.trim() || undefined,
        lastVisit: patient?.lastVisit
      }
      
      onSave(patientData)
      onClose()
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={patient ? 'রোগীর তথ্য সম্পাদনা' : 'নতুন রোগী যোগ করুন'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Name */}
        <div>
          <Label htmlFor="name">রোগীর পূর্ণ নাম *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="উদাহরণ: আবদুর রহমান"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">মোবাইল নম্বর *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="০১৭xxxxxxxx"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">ইমেইল ঠিকানা</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="example@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Date of Birth and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateOfBirth">জন্ম তারিখ *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className={errors.dateOfBirth ? 'border-red-500' : ''}
            />
            {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <Label htmlFor="gender">লিঙ্গ *</Label>
            <Select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={errors.gender ? 'border-red-500' : ''}
            >
              <option value="">নির্বাচন করুন</option>
              <option value="male">পুরুষ</option>
              <option value="female">মহিলা</option>
              <option value="other">অন্যান্য</option>
            </Select>
            {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="উদাহরণ: বাড়ি-১২৩, সড়ক-৪, ধানমন্ডি, ঢাকা-১২০৫"
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Emergency Contact and Blood Group */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContact">জরুরি যোগাযোগ</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleChange('emergencyContact', e.target.value)}
              placeholder="০১৭xxxxxxxx"
              className={errors.emergencyContact ? 'border-red-500' : ''}
            />
            {errors.emergencyContact && <p className="text-sm text-red-500 mt-1">{errors.emergencyContact}</p>}
          </div>

          <div>
            <Label htmlFor="bloodGroup">রক্তের গ্রুপ</Label>
            <Select
              id="bloodGroup"
              value={formData.bloodGroup}
              onChange={(e) => handleChange('bloodGroup', e.target.value)}
            >
              <option value="">নির্বাচন করুন</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
          </div>
        </div>

        {/* Allergies */}
        <div>
          <Label htmlFor="allergies">অ্যালার্জি</Label>
          <Input
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleChange('allergies', e.target.value)}
            placeholder="কমা দিয়ে আলাদা করুন (যেমন: পেনিসিলিন, সালফার)"
          />
          <p className="text-xs text-gray-500 mt-1">একাধিক অ্যালার্জি থাকলে কমা দিয়ে আলাদা করুন</p>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">মেডিকেল নোট</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="রোগীর বিশেষ তথ্য, রোগের ইতিহাস ইত্যাদি..."
            className="w-full p-2 border border-gray-300 rounded-md resize-none h-20 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            {patient ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            বাতিল
          </Button>
        </div>
      </form>
    </Modal>
  )
}
