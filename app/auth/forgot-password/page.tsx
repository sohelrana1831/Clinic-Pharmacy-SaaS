'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/auth-layout'
import { FormField } from '@/components/auth/form-field'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = 'ইমেইল প্রয়োজন'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'বৈধ ইমেইল দিন'

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
        setIsSubmitted(true)
      }, 1000)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md mx-auto">
          <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ইমেইল পাঠানো হয়েছে
          </h2>
          <p className="text-gray-600 mb-2">
            আমরা <strong>{email}</strong> এ একটি পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি।
          </p>
          <p className="text-gray-600 mb-6">
            ইমেইল চেক করুন এবং লিংকে ক্লিক করে নতুন পাসওয়ার্ড সেট করুন।
          </p>
          
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              লগইন পেজে ফিরে যান
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
            >
              অন্য ইমেইল দিয়ে চেষ্টা করুন
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>ইমেইল পাননি?</strong><br />
              স্প্যাম ফোল্ডার চেক করুন অথবা ৫ মিনিট পর আবার চেষ্টা করুন।
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <AuthLayout 
      title="পাসওয়ার্ড রিসেট করুন"
      subtitle="আপনার ইমেইল ঠিকানা দিন"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">
            চিন্তা করবেন না! আপনার ইমেইল ঠিকানা দিন এবং আমরা পাসওয়ার্ড রিসেট করার লিংক পাঠিয়ে দেব।
          </p>
        </div>

        <FormField
          label="ইমেইল ঠিকানা"
          type="email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          helper="আপনার অ্যাকাউন্টের সাথে যুক্ত ইমেইল দিন"
        />

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'পাঠানো হচ্ছে...' : 'রিসে�� লিংক পাঠান'}
        </Button>

        <div className="text-center">
          <Link 
            href="/auth/login" 
            className="text-sm text-gray-600 hover:text-blue-600 inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            লগইন পেজে ফিরে যান
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
