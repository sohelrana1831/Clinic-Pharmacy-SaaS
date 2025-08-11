'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'ইমেইল প্রয়োজন'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'বৈধ ইমেইল দিন'

    if (!formData.password) newErrors.password = 'পাসওয়ার্ড প্রয়োজন'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // Redirect to dashboard
        window.location.href = '/dashboard'
      }, 1000)
    }
  }

  return (
    <AuthLayout 
      title="আপনার অ্যাকাউন্টে লগইন করুন"
      subtitle="ক��লিনিক ম্যানেজমেন্ট ড্যাশবোর্ডে প্রবেশ করুন"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="ইমেইল ঠিকানা"
          type="email"
          placeholder="your@email.com"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          error={errors.email}
        />

        <FormField
          label="পাসওয়ার্ড"
          type="password"
          placeholder="আপনার পাসওয়ার্ড"
          required
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
              আমাকে মনে রাখুন
            </label>
          </div>
          
          <Link 
            href="/auth/forgot-password" 
            className="text-sm text-blue-600 hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
        </Button>

        <div className="text-center text-sm">
          <span className="text-gray-600">নতুন ব্যবহারকারী? </span>
          <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
            অ্যাকাউন্ট তৈরি করুন
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">অথবা</span>
          </div>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.href = '/demo'}
        >
          ডেমো দেখুন
        </Button>
      </form>
    </AuthLayout>
  )
}
