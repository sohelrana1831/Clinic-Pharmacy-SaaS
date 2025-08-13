'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OnboardingLayout } from '@/components/auth/onboarding-layout'
import { FormField } from '@/components/auth/form-field'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, MapPin, Phone, User, Stethoscope, Calendar, FileText, Package, CheckCircle } from 'lucide-react'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Clinic Details
    address: '',
    phone: '',
    logo: null as File | null,
    
    // Step 2: First Doctor
    doctorName: '',
    specialization: '',
    doctorMobile: '',
    
    // Step 3: Tour Checklist
    appointmentsChecked: false,
    prescriptionsChecked: false,
    inventoryChecked: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const specializationOptions = [
    { value: 'general', label: 'জেনারেল ফিজিশিয়ান' },
    { value: 'cardiology', label: 'কার্ডিওলজি' },
    { value: 'pediatrics', label: 'শিশু বিশেষজ্ঞ' },
    { value: 'gynecology', label: 'গাইনি বিশেষজ্ঞ' },
    { value: 'orthopedics', label: 'অর্থোপেডিক্স' },
    { value: 'dermatology', label: 'চর্ম বিশেষজ্ঞ' },
    { value: 'medicine', label: 'মেডিসিন বিশেষজ্ঞ' }
  ]

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.address) newErrors.address = 'ক্লিনিকের ঠিকানা প্রয়োজন'
      if (!formData.phone) newErrors.phone = 'ফোন নম্বর প্রয়োজন'
    }

    if (step === 2) {
      if (!formData.doctorName) newErrors.doctorName = 'ডাক্তারের নাম প্রয়োজন'
      if (!formData.specialization) newErrors.specialization = 'স্পেশালাইজেশন নির্বাচন করুন'
      if (!formData.doctorMobile) newErrors.doctorMobile = 'মোবাইল নম্বর প্রয়োজন'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleFinish = () => {
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }))
    }
  }

  const renderStep1 = () => (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={3}
      title="ক্লিনিকের বিস্তারিত তথ্য"
      subtitle="আপনার ক্লিনিকের ঠিকানা ও যোগাযোগের তথ্য দিন"
    >
      <div className="space-y-6">
        <FormField
          label="ক্লিনিকের সম্পূর্ণ ঠিকানা"
          type="text"
          placeholder="উদাহরণ: ১২৩ মেইন স্ট্রিট, ঢাকা-১২০০"
          required
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          error={errors.address}
          helper="রোগীরা এই ঠিকানা দেখতে পাবেন"
        />

        <FormField
          label="ক্লিনিকের ফোন নম্বর"
          type="tel"
          placeholder="০১৭xxxxxxxx"
          required
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          error={errors.phone}
          helper="অ্যাপয়েন্টমেন্টের জন্য প্রাথমিক যোগাযোগ নম্বর"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ক্লিনিকের লোগো <span className="text-gray-500 dark:text-gray-400">(ঐচ্ছিক)</span>
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              {formData.logo ? (
                <img 
                  src={URL.createObjectURL(formData.logo)} 
                  alt="Logo preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('logo')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                লোগো আপলোড করুন
              </Button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG (সর্বোচ্চ ২MB)</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            পরবর্তী ধাপ
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )

  const renderStep2 = () => (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={3}
      title="প্রথম ডাক্তার যোগ করুন"
      subtitle="আপনার ক্লিনিকের প্রথম ডাক্তারের তথ্য দিন"
    >
      <div className="space-y-6">
        <FormField
          label="ডাক্তারের পূর্ণ নাম"
          type="text"
          placeholder="ডা. আবদুর রহমান"
          required
          value={formData.doctorName}
          onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
          error={errors.doctorName}
        />

        <FormField
          label="বিশেষত্ব/স্পেশালাইজেশন"
          type="select"
          required
          value={formData.specialization}
          onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
          options={specializationOptions}
          error={errors.specialization}
        />

        <FormField
          label="ডাক্তারের মোবাইল নম্বর"
          type="tel"
          placeholder="০১৭xxxxxxxx"
          required
          value={formData.doctorMobile}
          onChange={(e) => setFormData(prev => ({ ...prev, doctorMobile: e.target.value }))}
          error={errors.doctorMobile}
          helper="জরুরি যোগাযোগের জন্য"
        />

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>পরবর্তীতে আরো ডাক্তার যোগ করতে পারবেন</strong><br />
            সেটআপ সম্পন্ন হওয়ার পর ড্যাশ���োর্ড থেকে আরো ডাক্তার ও স্টাফ যোগ করুন।
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            পূর্ববর্তী ধাপ
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
            পরবর্তী ধাপ
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )

  const renderStep3 = () => (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={3}
      title="দ্রুত গাইড ট্যুর"
      subtitle="মূল ফি��ারগুলো সম্পর্কে জানুন"
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-center mb-8">
          আপনার ক্লিনিক ম্যানেজমেন্ট সিস্টেম প্রস্তুত! এখন মূল ফিচারগুলো চেক করে নিন:
        </p>

        <div className="space-y-4">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা</h3>
                <p className="text-gray-600 text-sm mb-3">
                  রোগীদের অ্যাপয়েন্টমেন্ট বুক করুন, সময়সূচী দেখুন এবং SMS রিমাইন্ডার পাঠান।
                </p>
                <Checkbox
                  id="appointments"
                  label="আমি অ্যাপয়েন্টমেন্ট সিস্টেম বুঝেছি"
                  checked={formData.appointmentsChecked}
                  onChange={(e) => setFormData(prev => ({ ...prev, appointmentsChecked: e.target.checked }))}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">ডিজিটাল প্রেসক্রিপশন</h3>
                <p className="text-gray-600 text-sm mb-3">
                  প্রেসক্রিপশন লিখুন, PDF তৈরি করুন এবং ওষুধের ডেটাবেস ব্যবহার করুন।
                </p>
                <Checkbox
                  id="prescriptions"
                  label="আমি প্রেসক্রিপশন সিস্টেম বুঝেছি"
                  checked={formData.prescriptionsChecked}
                  onChange={(e) => setFormData(prev => ({ ...prev, prescriptionsChecked: e.target.checked }))}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">ফার্মেসি ইনভেন্টরি</h3>
                <p className="text-gray-600 text-sm mb-3">
                  ওষুধের স্টক ট্র্যাক করুন, এক্সপায়ারি ডেট মনিটর করুন এবং সাপ্লায়ার ম্যানেজ করুন।
                </p>
                <Checkbox
                  id="inventory"
                  label="আমি ইনভেন্টরি সিস্টেম বুঝেছি"
                  checked={formData.inventoryChecked}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventoryChecked: e.target.checked }))}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-green-700 font-medium">
            অভিনন্দন! আপনার ক্লিনিক ম্যানেজমেন্ট সিস্টেম ব্যবহারের জন্য প্রস্তুত।
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious}>
            পূর্ববর্তী ধাপ
          </Button>
          <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
            ড্যাশবোর্ডে যান
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )

  if (currentStep === 1) return renderStep1()
  if (currentStep === 2) return renderStep2()
  if (currentStep === 3) return renderStep3()

  return null
}
