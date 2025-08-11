'use client'

import { useState } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  SubscriptionPlan, 
  formatCurrency, 
  processPayment,
  paymentProviders 
} from '@/lib/subscription-data'
import { 
  CreditCard, 
  Shield, 
  Globe, 
  Smartphone,
  Lock,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface CheckoutModalProps {
  plan: SubscriptionPlan
  onClose: () => void
}

export function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'sslcommerz' | 'stripe'>('sslcommerz')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentState, setPaymentState] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [errorMessage, setErrorMessage] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
    address: ''
  })

  const handlePayment = async () => {
    if (!billingInfo.name || !billingInfo.email || !billingInfo.phone) {
      setErrorMessage('সকল আবশ্যক তথ্য পূরণ করুন')
      return
    }

    setIsProcessing(true)
    setPaymentState('processing')
    setErrorMessage('')

    try {
      const result = await processPayment(plan.id, paymentMethod)
      
      if (result.success) {
        setTransactionId(result.transactionId || '')
        setPaymentState('success')
      } else {
        setErrorMessage(result.error || 'পেমেন্ট ব্যর্থ হয়েছে')
        setPaymentState('error')
      }
    } catch (error) {
      setErrorMessage('একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
      setPaymentState('error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }))
  }

  const renderPaymentForm = () => (
    <div className="space-y-6">
      {/* Plan Summary */}
      <Card className="p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-900">{plan.name} প্ল্যান</h4>
            <p className="text-sm text-gray-600">মাসিক সাবস্ক্রিপশন</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(plan.price, plan.currency)}
            </p>
            <p className="text-sm text-gray-600">/মাস</p>
          </div>
        </div>
      </Card>

      {/* Payment Method Selection */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">পেমেন্ট পদ্ধতি নির্বাচন করুন</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`p-4 cursor-pointer transition-all ${
              paymentMethod === 'sslcommerz' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('sslcommerz')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h5 className="font-medium">SSLCommerz</h5>
                <p className="text-sm text-gray-600">বাংলাদেশি পেমেন্ট</p>
              </div>
              {paymentMethod === 'sslcommerz' && (
                <Check className="h-5 w-5 text-green-600 ml-auto" />
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">কার্ড</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">মোবাইল ব্যাংকিং</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">নেট ব্যাংকিং</span>
            </div>
          </Card>

          <Card 
            className={`p-4 cursor-pointer transition-all ${
              paymentMethod === 'stripe' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setPaymentMethod('stripe')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium">Stripe</h5>
                <p className="text-sm text-gray-600">International</p>
              </div>
              {paymentMethod === 'stripe' && (
                <Check className="h-5 w-5 text-blue-600 ml-auto" />
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Credit Card</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Bank Transfer</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Billing Information */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">বিলিং তথ্য</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              নাম <span className="text-red-500">*</span>
            </label>
            <Input
              value={billingInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="আপনার নাম"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={billingInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ফোন নম্বর <span className="text-red-500">*</span>
            </label>
            <Input
              value={billingInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="01XXXXXXXXX"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ক্লিনিকের না��
            </label>
            <Input
              value={billingInfo.clinicName}
              onChange={(e) => handleInputChange('clinicName', e.target.value)}
              placeholder="আপনার ক্লিনিকের নাম"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ঠিকানা
            </label>
            <Input
              value={billingInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="ক্লিনিকের সম্পূর্ণ ঠিকানা"
            />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">নিরাপদ পেমেন্ট</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          আপনার সকল তথ্য SSL এনক্রিপশন দিয়ে সুরক্ষিত। আমরা আপনার কা���্ডের তথ্য সংরক্ষণ করি না।
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">ত্রুটি</span>
          </div>
          <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isProcessing}
        >
          বাতিল
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              প্রক্রিয়াধীন...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              পেমেন্ট করুন ({formatCurrency(plan.price, plan.currency)})
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        পেমেন্ট প্রক্রিয়াধীন...
      </h3>
      <p className="text-gray-600 mb-4">
        আপনার পেমেন্ট প্রক্রিয়া করা হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।
      </p>
      <div className="text-sm text-gray-500">
        এই উইন্ডো বন্ধ করবেন না
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        পেমেন্ট সফল হয়েছে!
      </h3>
      <p className="text-gray-600 mb-4">
        আপনার {plan.name} প্ল্যান সক্রিয় হয়েছে। স্বাগতম!
      </p>
      {transactionId && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">লেনদেন আইডি:</p>
          <p className="font-mono text-sm font-medium">{transactionId}</p>
        </div>
      )}
      <div className="space-y-3">
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          ড্যাশবোর্ডে যান
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full">
          বন্ধ করুন
        </Button>
      </div>
    </div>
  )

  const renderError = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        পেমেন্ট ব্যর্থ হয়েছে
      </h3>
      <p className="text-gray-600 mb-4">
        {errorMessage || 'একট��� সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'}
      </p>
      <div className="space-y-3">
        <Button 
          onClick={() => {
            setPaymentState('form')
            setErrorMessage('')
          }}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          আবার চেষ্টা করুন
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full">
          বাতিল করুন
        </Button>
      </div>
    </div>
  )

  const getTitle = () => {
    switch (paymentState) {
      case 'processing':
        return 'পেমেন্ট প্রক্রিয়াধীন'
      case 'success':
        return 'পেমেন্ট সফল'
      case 'error':
        return 'পেমেন্ট ব্যর্থ'
      default:
        return `${plan.name} প্ল্যান - চেকআউট`
    }
  }

  const renderContent = () => {
    switch (paymentState) {
      case 'processing':
        return renderProcessing()
      case 'success':
        return renderSuccess()
      case 'error':
        return renderError()
      default:
        return renderPaymentForm()
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={paymentState === 'processing' ? () => {} : onClose}
      title={getTitle()}
      size="lg"
    >
      {renderContent()}
    </Modal>
  )
}
