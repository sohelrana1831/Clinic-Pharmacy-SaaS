'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    clinicName: '',
    numberOfDoctors: '',
    plan: '',
    acceptTerms: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const planOptions = [
    { value: 'basic', label: 'বেস���ক প্ল্যান - ৳২,৫০০/মাস' },
    { value: 'pro', label: 'প্রো প্ল্যান - ৳৪,৫০০/মাস' },
    { value: 'enterprise', label: 'এন্টারপ্রাইজ প্ল্যান - ৳৮,০০০/মাস' }
  ]

  const doctorOptions = [
    { value: '1', label: '১ জন ডাক্তার' },
    { value: '2-5', label: '২-৫ জন ডাক্তার' },
    { value: '6-10', label: '৬-১০ জন ডাক্তার' },
    { value: '10+', label: '১০+ জন ডাক্তার' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'ইমেইল প্রয়োজন'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'বৈধ ইমেইল দিন'

    if (!formData.password) newErrors.password = 'পাসওয়ার্ড প্রয়োজন'
    else if (formData.password.length < 6) newErrors.password = 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন'

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'পাসওয়ার্ড মিলছে না'
    }

    if (!formData.clinicName) newErrors.clinicName = 'ক্লিনিকের নাম প্রয়োজন'
    if (!formData.numberOfDoctors) newErrors.numberOfDoctors = 'ডাক্তারের সংখ্যা নির্বাচন করুন'
    if (!formData.plan) newErrors.plan = 'প্ল্যান নির্বাচন করুন'
    if (!formData.acceptTerms) newErrors.acceptTerms = 'শর্তাবলী গ্রহণ করুন'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowSuccessModal(true)
    }
  }

  if (showSuccessModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            সফল! অ্যাকাউন্ট তৈরি হয়েছে
          </h2>
          <p className="text-gray-600 mb-6">
            আপনার ইমেইলে একটি নিশ্চিতকরণ লিংক পাঠানো হয়েছে। লিংকে ক্লিক করে অ্যাকাউন্ট সক্রিয় করুন।
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/onboarding">সেটআপ শুরু করুন</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">লগইন পেজে যান</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <AuthLayout 
      title="নতুন অ্যাকাউন্ট তৈরি করুন"
      subtitle="আপনার ক্লিনিক ম্যানেজমেন্ট শুরু করুন"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            ইমেইল ঠিকানা <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">
            পাসওয়ার্ড <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="কমপক্ষে ৬ অক্ষর"
            required
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700">
            পাসওয়ার্�� নিশ্চিত করুন <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="পাসওয়ার্ড পুনরায় লিখুন"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="clinicName" className="text-gray-700">
            ক্লিনিকের নাম <span className="text-red-500">*</span>
          </Label>
          <Input
            id="clinicName"
            type="text"
            placeholder="আপনার ক্লিনিকের নাম"
            required
            value={formData.clinicName}
            onChange={(e) => setFormData(prev => ({ ...prev, clinicName: e.target.value }))}
            className={errors.clinicName ? 'border-red-500' : ''}
          />
          {errors.clinicName && <p className="text-sm text-red-500">{errors.clinicName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfDoctors" className="text-gray-700">
            ডাক্তারের সং��্যা <span className="text-red-500">*</span>
          </Label>
          <Select
            id="numberOfDoctors"
            required
            value={formData.numberOfDoctors}
            onChange={(e) => setFormData(prev => ({ ...prev, numberOfDoctors: e.target.value }))}
            className={errors.numberOfDoctors ? 'border-red-500' : ''}
          >
            <option value="">নির্বাচন করুন</option>
            {doctorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {errors.numberOfDoctors && <p className="text-sm text-red-500">{errors.numberOfDoctors}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan" className="text-gray-700">
            প্ল্যান নির্বাচন করুন <span className="text-red-500">*</span>
          </Label>
          <Select
            id="plan"
            required
            value={formData.plan}
            onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
            className={errors.plan ? 'border-red-500' : ''}
          >
            <option value="">নির্বা��ন করুন</option>
            {planOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <p className="text-sm text-gray-500">প্রথম ৭ দিন ফ্রি ট্রায়াল</p>
          {errors.plan && <p className="text-sm text-red-500">{errors.plan}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
              আমি{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                শর্তাবলী
              </Link>
              {' '}ও{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                গোপনীয়তা নীতি
              </Link>
              {' '}সম্মত আছি
            </label>
          </div>
          {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms}</p>}
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          অ্যাকাউন্ট তৈরি করুন
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-600">ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
            লগইন করুন
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
