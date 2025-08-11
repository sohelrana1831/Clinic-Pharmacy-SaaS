'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Download, 
  Mail, 
  ArrowRight,
  CreditCard,
  Calendar,
  Building,
  FileText
} from 'lucide-react'

// This would normally come from URL params or API
const paymentData = {
  transactionId: 'TXN_1704932847_BD123',
  amount: 4500,
  currency: 'BDT',
  planName: 'প্রো প্ল্যান',
  paymentMethod: 'SSLCommerz',
  clinicName: 'SR Pharma',
  billingDate: '১৫ জানুয়ারি, ২০২৪',
  nextBillingDate: '১৫ ফেব্রুয়ারি, ২০২৪',
  invoiceNumber: 'INV-2024-001'
}

export default function PaymentSuccessPage() {
  const [countdown, setCountdown] = useState(10)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleDownloadReceipt = () => {
    // In real app, this would download the actual receipt
    alert(`Receipt ${paymentData.invoiceNumber} ডাউনলোড করা হচ্ছে...`)
  }

  const handleSendEmail = () => {
    // In real app, this would send confirmation email
    alert('নিশ্চিতকরণ ইমেইল পাঠানো হচ্ছে...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-bounce"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            পেমেন্ট সফল হয়েছে! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            আপনার {paymentData.planName} সফলভাবে সক্রিয় হয়েছে
          </p>
        </div>

        {/* Payment Details */}
        <Card className="mb-6 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">পেমেন্ট বিবরণ</h2>
              <p className="text-gray-600">আপনার সাবস্ক্রিপশন এখনই শুরু হয়েছে</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">পরিমাণ</p>
                    <p className="font-bold text-lg">৳{paymentData.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ক্লিনিক</p>
                    <p className="font-medium">{paymentData.clinicName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ইনভয়েস নম্বর</p>
                    <p className="font-medium">{paymentData.invoiceNumber}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">বিলিং তারিখ</p>
                    <p className="font-medium">{paymentData.billingDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">পরবর্তী বিলিং</p>
                    <p className="font-medium">{paymentData.nextBillingDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">পেমেন্ট পদ্ধতি</p>
                    <p className="font-medium">{paymentData.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">লেনদেন আইডি</p>
              <p className="font-mono text-sm font-medium break-all">{paymentData.transactionId}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleDownloadReceipt}
                variant="outline" 
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                রিসিট ডাউনলোড
              </Button>
              <Button 
                onClick={handleSendEmail}
                variant="outline" 
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                ইমেইলে পাঠান
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">পরবর্তী ধাপসমূহ:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <p className="text-gray-700">আপনার ড্যাশবোর্ডে যান এবং সেটআপ সম্পন্ন করুন</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <p className="text-gray-700">প্রথম রোগীর তথ্য এবং ডাক্তারের প্রোফাইল যোগ করুন</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <p className="text-gray-700">প্রয়োজনে আমাদের সাপোর্ট টিমের সাহায্য নিন</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto Redirect Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <p className="text-blue-800">
              {countdown > 0 ? (
                <>
                  আপনি স্বয়ংক্রিয়ভাবে ড্যাশবোর্ডে চলে যাবেন <span className="font-bold">{countdown}</span> সেকেন্ডে
                </>
              ) : (
                'Redirecting to dashboard...'
              )}
            </p>
          </CardContent>
        </Card>

        {/* Manual Navigation */}
        <div className="text-center mt-6 space-x-4">
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">
              ড্যাশবোর্ডে যান
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard/billing">
            <Button variant="outline">
              বিলিং দেখু���
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            সাহায্য প্রয়োজন? আমাদের সাথে যোগাযোগ করুন:{' '}
            <a href="mailto:support@clinicms.com" className="text-blue-600 hover:underline">
              support@clinicms.com
            </a>
            {' '}বা{' '}
            <a href="tel:+8801700000000" className="text-blue-600 hover:underline">
              +৮৮০ ১৭০০ ০০০০০০
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
