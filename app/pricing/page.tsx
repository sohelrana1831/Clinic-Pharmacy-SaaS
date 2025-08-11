'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/modals/modal'
import { CheckoutModal } from '@/components/billing/checkout-modal'
import { subscriptionPlans, formatCurrency } from '@/lib/subscription-data'
import { 
  Check, 
  Crown, 
  Star, 
  ArrowRight,
  Shield,
  Globe,
  CreditCard,
  Smartphone
} from 'lucide-react'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowCheckout(true)
  }

  const handleCloseCheckout = () => {
    setShowCheckout(false)
    setSelectedPlan(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              সাশ্রয়ী মূল্যে প্ল্যান সমূহ
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              আপনার ক্লিনিক ও ফার্মেসির প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন
            </p>
            <p className="text-lg text-gray-600">
              সকল প্ল্যানে ১৪ দিনের ফ্রি ট্রায়াল এবং ২৪/৭ সাপোর্ট
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-2 border-emerald-500 scale-105 bg-white' 
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      জনপ্রিয়
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`mx-auto w-16 h-16 bg-${plan.color}-100 rounded-full flex items-center justify-center mb-4`}>
                    <Crown className={`h-8 w-8 text-${plan.color}-600`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold text-${plan.color}-600`}>
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                    <span className="text-gray-600 ml-2">/মাস</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    {plan.maxPatients === 'unlimited' ? 'আনলিমিটেড রোগী' : `${plan.maxPatients} রোগী পর্যন্ত`}
                  </p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    size="lg"
                  >
                    {plan.popular ? 'শুরু করুন' : 'প্ল্যান নির্বাচন করুন'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              সুরক্ষিত পেমেন্ট পদ্ধতি
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* SSLCommerz */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">SSLCommerz</h4>
                <p className="text-gray-600 mb-4">বাংলাদেশের জন্য সুরক্ষিত পেমেন্ট</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                    <span>ক্রেডিট/ডেবিট কার্ড</span>
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 text-gray-500 mr-2" />
                    <span>মোবাইল ব্যাংকিং</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-500 mr-2" />
                    <span>ইন্টারনেট ব্যাংকিং</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                    <span>ডিজিটাল ওয়ালেট</span>
                  </div>
                </div>
              </Card>

              {/* Stripe */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Stripe</h4>
                <p className="text-gray-600 mb-4">International Payment Gateway</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Credit Cards</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Bank Transfers</span>
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Digital Wallets</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Secure Processing</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              বিস্তারিত ফিচার তুলনা
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">ফিচার</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">বেসিক</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">প্রো</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">এন্টারপ্রাইজ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">রোগীর সংখ্যা</td>
                    <td className="px-6 py-4 text-center text-sm">১০০</td>
                    <td className="px-6 py-4 text-center text-sm">৫০০</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">আনলিমিটেড</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">শাখার সংখ্যা</td>
                    <td className="px-6 py-4 text-center text-sm">১</td>
                    <td className="px-6 py-4 text-center text-sm">১</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">১০</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">ব্যবহারকারী</td>
                    <td className="px-6 py-4 text-center text-sm">১</td>
                    <td className="px-6 py-4 text-center text-sm">৩</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">আনলিমিটেড</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">SMS নোটিফিকেশন</td>
                    <td className="px-6 py-4 text-center text-sm">❌</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600">✅</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">API অ্যাক্সেস</td>
                    <td className="px-6 py-4 text-center text-sm">❌</td>
                    <td className="px-6 py-4 text-center text-sm">❌</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-700">সাপোর্ট</td>
                    <td className="px-6 py-4 text-center text-sm">ইমেইল</td>
                    <td className="px-6 py-4 text-center text-sm">প্রাইওরিটি</td>
                    <td className="px-6 py-4 text-center text-sm text-green-600">২৪x৭</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              প্রায়শই জিজ্ঞাসিত প্রশ্ন
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-6">
                <h4 className="font-semibold text-lg text-gray-900 mb-3">
                  ফ্রি ট্রায়াল কত দি���ের?
                </h4>
                <p className="text-gray-600">
                  সকল প্ল্যানে ১৪ দিনের সম্পূর্ণ ফিচার সহ ফ্রি ট্রায়াল পাবেন। কোনো ক্রেডিট কার্ড প্রয়োজন নেই।
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-lg text-gray-900 mb-3">
                  প্ল্যান পরিবর্তন করা যাবে?
                </h4>
                <p className="text-gray-600">
                  হ্যাঁ, যেকোনো সময় আপগ্রেড বা ডাউনগ্রেড করতে পারেন। পরিবর্তন পরবর্তী বিলিং সাইকেলে কার্যকর হবে।
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-lg text-gray-900 mb-3">
                  ডেটা কতটা নিরাপদ?
                </h4>
                <p className="text-gray-600">
                  আমরা ব্যাংক-গ্রেড এনক্রিপ���ন ব্যবহার করি এবং ISO 27001 সার্টিফাইড। আপনার ডেটা সম্পূর্ণ নিরাপদ।
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-lg text-gray-900 mb-3">
                  রিফান্ড পলিসি কি?
                </h4>
                <p className="text-gray-600">
                  প্রথম ৩০ দিনের মধ্যে সন্তুষ্ট না হলে ১০০% টাকা ফেরত। কোনো প্রশ্ন করা হবে না।
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <CheckoutModal
          plan={subscriptionPlans.find(p => p.id === selectedPlan)!}
          onClose={handleCloseCheckout}
        />
      )}
    </div>
  )
}
