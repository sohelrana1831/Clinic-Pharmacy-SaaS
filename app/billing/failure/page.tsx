'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckoutModal } from '@/components/billing/checkout-modal'
import { subscriptionPlans } from '@/lib/subscription-data'
import { 
  XCircle, 
  RefreshCw, 
  ArrowLeft,
  CreditCard,
  AlertTriangle,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Shield
} from 'lucide-react'

// This would normally come from URL params or session
const failureData = {
  attemptedAmount: 4500,
  currency: 'BDT',
  planName: 'প্রো প্ল্যান',
  planId: 'pro',
  paymentMethod: 'SSLCommerz',
  errorCode: 'CARD_DECLINED',
  errorMessage: 'আপনার কার্ড প্রত্যাখ্যান করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
  transactionId: 'TXN_FAILED_1704932847',
  timestamp: '১৫ জানুয়ারি, ২০২৪, ১০:৩০ AM'
}

const commonIssues = [
  {
    icon: CreditCard,
    title: 'কার্ডের সমস্যা',
    description: 'কার্ডের মেয়াদ শেষ, অপর্যাপ্ত ব্যালেন্স বা ভুল তথ্য',
    solutions: ['কার্ডের তথ্য যাচাই করুন', 'অন্য কার্ড ব্যবহার করুন', 'ব্যালেন্স চেক করুন']
  },
  {
    icon: Shield,
    title: 'নিরাপত্তা যাচাই��রণ',
    description: 'ব্যাংক বা কার্ড কোম্পানি অতিরিক্ত যাচাইকরণ চায়',
    solutions: ['ব্যাংকের সাথে যোগাযোগ করুন', '3D Secure কোড দিন', 'কার্ড আনলক করুন']
  },
  {
    icon: AlertTriangle,
    title: 'প্রযুক্তিগত সমস্যা',
    description: 'নেটওয়ার্ক বা সার্ভারের সাময়িক সমস্যা',
    solutions: ['কিছুক্ষণ পর আবার চেষ্টা করুন', 'ইন্টারনেট সংযোগ চেক ক���ুন', 'অন্য ব্রাউজার ব্যবহার করুন']
  }
]

export default function PaymentFailurePage() {
  const [showRetryModal, setShowRetryModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null)

  const plan = subscriptionPlans.find(p => p.id === failureData.planId)

  const getErrorIcon = () => {
    switch (failureData.errorCode) {
      case 'CARD_DECLINED':
        return <CreditCard className="h-12 w-12 text-red-500" />
      case 'INSUFFICIENT_FUNDS':
        return <AlertTriangle className="h-12 w-12 text-orange-500" />
      default:
        return <XCircle className="h-12 w-12 text-red-500" />
    }
  }

  const getErrorTitle = () => {
    switch (failureData.errorCode) {
      case 'CARD_DECLINED':
        return 'কার্ড প্রত্যাখ্যান'
      case 'INSUFFICIENT_FUNDS':
        return 'অপর্যাপ্ত ব্যালেন্স'
      case 'NETWORK_ERROR':
        return 'নেটওয়ার্ক সমস্যা'
      default:
        return 'পেমেন্ট ব্যর্থ'
    }
  }

  const handleRetryPayment = () => {
    setShowRetryModal(true)
  }

  const handleContactSupport = () => {
    const message = `পেমেন্ট সমস্যা - লেনদেন আইডি: ${failureData.transactionId}`
    const whatsappUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Error Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {getErrorIcon()}
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {getErrorTitle()}
          </h1>
          <p className="text-xl text-gray-600">
            আপনার পেমেন্ট সম্পন্ন হয়নি
          </p>
        </div>

        {/* Error Details */}
        <Card className="mb-6 shadow-xl border-red-200">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">সমস্যার বিবরণ</h2>
              <p className="text-gray-600">পেমেন্ট প্রক্রিয়ায় একটি সমস্যা হয়েছে</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">ত্রুটির বার্তা</span>
              </div>
              <p className="text-red-700">{failureData.errorMessage}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">পরিমাণ</p>
                  <p className="font-bold text-lg">৳{failureData.attemptedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">প্ল্যান</p>
                  <p className="font-medium">{failureData.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">পেমেন্ট পদ্ধতি</p>
                  <p className="font-medium">{failureData.paymentMethod}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">ত্রুটি কোড</p>
                  <p className="font-mono text-sm">{failureData.errorCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">সময়</p>
                  <p className="font-medium">{failureData.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">রেফারেন্স</p>
                  <p className="font-mono text-xs break-all">{failureData.transactionId}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                আবার চেষ্টা করুন
              </Button>
              <Button 
                onClick={handleContactSupport}
                variant="outline" 
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                সাপোর্টে যোগাযোগ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Common Issues & Solutions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              সাধারণ সমস্যা ও সমাধান
            </h3>
            <div className="space-y-4">
              {commonIssues.map((issue, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setSelectedIssue(selectedIssue === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <issue.icon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">{issue.title}</p>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                      </div>
                    </div>
                    <span className="text-gray-400">
                      {selectedIssue === index ? '−' : '+'}
                    </span>
                  </button>
                  {selectedIssue === index && (
                    <div className="px-4 pb-4">
                      <h5 className="font-medium text-gray-900 mb-2">সমাধানের উপায়:</h5>
                      <ul className="space-y-1">
                        {issue.solutions.map((solution, solIndex) => (
                          <li key={solIndex} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alternative Payment Methods */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-4">বিকল্প পেমেন্ট পদ্ধতি</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-2">মোবাইল ব্যাংকিং</h4>
                <p className="text-sm text-gray-600 mb-3">বিকাশ, নগদ, রকেট দিয়ে পেমেন্ট করুন</p>
                <Button size="sm" variant="outline" className="w-full">
                  মোবা���ল ব্যাংকিং
                </Button>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium mb-2">ব্যাংক ট্রান্সফার</h4>
                <p className="text-sm text-gray-600 mb-3">সরাসরি ব্যাংক অ্যাকাউন্টে পেমেন্ট</p>
                <Button size="sm" variant="outline" className="w-full">
                  ব্যাংক ট্রান্সফার
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">সাহায্যের জন্য যোগাযোগ করুন</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium">হোয়াটসঅ্যাপ</p>
                <p className="text-sm text-gray-600">তাৎক্ষণিক সাহায্য</p>
                <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                  চ্যাট করুন
                </Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <p className="font-medium">ফোন কল</p>
                <p className="text-sm text-gray-600">+৮৮০ ১৭০০ ০০০০০০</p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                  কল করুন
                </Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <p className="font-medium">ইমেইল</p>
                <p className="text-sm text-gray-600">support@clinicms.com</p>
                <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                  ইমেইল পাঠান
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center space-x-4">
          <Link href="/pricing">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              প্রাইসিং পেজে ফিরে যান
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              হোম পেজে যান
            </Button>
          </Link>
        </div>

        {/* Retry Modal */}
        {showRetryModal && plan && (
          <CheckoutModal
            plan={plan}
            onClose={() => setShowRetryModal(false)}
          />
        )}
      </div>
    </div>
  )
}
