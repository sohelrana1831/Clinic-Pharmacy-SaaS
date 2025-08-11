'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/modals/modal'
import { CheckoutModal } from '@/components/billing/checkout-modal'
import { InvoiceModal } from '@/components/billing/invoice-modal'
import { 
  currentSubscription, 
  subscriptionPlans, 
  formatCurrency, 
  getStatusBadgeColor, 
  getStatusText 
} from '@/lib/subscription-data'
import { 
  CreditCard, 
  Download, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Crown,
  FileText,
  DollarSign,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  Trash2
} from 'lucide-react'

export default function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const currentPlan = subscriptionPlans.find(p => p.id === currentSubscription.planId)
  const nextBillingDate = new Date(currentSubscription.nextBillingDate)
  const daysUntilBilling = Math.ceil((nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    setShowUpgradeModal(true)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    // In real app, this would trigger invoice download
    const invoice = currentSubscription.invoices.find(inv => inv.id === invoiceId)
    if (invoice?.downloadUrl) {
      window.open(invoice.downloadUrl, '_blank')
    } else {
      alert(`Invoice ${invoice?.invoiceNumber} ডাউনলোড করা হচ্ছে...`)
    }
  }

  const handleViewInvoice = (invoiceId: string) => {
    setSelectedInvoice(invoiceId)
    setShowInvoiceModal(true)
  }

  const handleCancelSubscription = () => {
    // In real app, this would call the cancellation API
    alert('সাবস্ক্রিপশন ��াতিল করার জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।')
    setShowCancelModal(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">বিলিং ও সাবস্ক্রিপশন</h1>
          <p className="text-gray-600 mt-1">আপনার প্ল্যান এবং পেমেন্ট তথ্য পরিচালনা করুন</p>
        </div>
      </div>

      {/* Status Alert */}
      {currentSubscription.status === 'past_due' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">পেমেন্ট বকেয়া</span>
          </div>
          <p className="text-red-700 mt-1">
            আপনার সাবস্ক্রিপশন বকেয়া রয়েছে। সেবা চালু রাখতে অনুগ্রহ করে পেমেন্ট করুন।
          </p>
          <Button className="mt-3 bg-red-600 hover:bg-red-700" size="sm">
            এখনই পেমেন্ট করুন
          </Button>
        </div>
      )}

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            বর্তমান প্ল্যান
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plan Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentPlan?.name} প্ল্যান</h3>
                  <p className="text-gray-600">মাসিক সাবস্ক্রিপশন</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(currentSubscription.amount, currentSubscription.currency)}
                  </p>
                  <p className="text-gray-600">/মাস</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">অবস্থা</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(currentSubscription.status)}`}>
                    {getStatusText(currentSubscription.status)}
                  </span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">পরবর্তী বিলিং</p>
                  <p className="font-medium">{daysUntilBilling} দিন</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">পেমেন্ট পদ্ধতি</p>
                  <p className="font-medium">
                    {currentSubscription.paymentMethod === 'sslcommerz' ? 'SSLCommerz' : 'Stripe'}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">সর্বশেষ পেমেন্ট</p>
                  <p className="font-medium">
                    {new Date(currentSubscription.currentPeriodStart).toLocaleDateString('bn-BD')}
                  </p>
                </div>
              </div>

              {/* Plan Features */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">প্ল্যানে অন্তর্ভুক্ত ফিচার</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentPlan?.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">দ্রুত অ্যাকশন</h4>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleUpgrade('pro')}
              >
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                আপগ্রেড করুন
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleDownloadInvoice(currentSubscription.invoices[0]?.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                সর্বশেষ ইনভয়েস
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCancelModal(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                প্ল্যান বাতিল
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              পরবর্তী বিলিং
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {nextBillingDate.toLocaleDateString('bn-BD')}
              </p>
              <p className="text-gray-600 mt-1">{daysUntilBilling} দিন বাকি</p>
              <p className="text-sm text-gray-500 mt-2">
                পরিমাণ: {formatCurrency(currentSubscription.amount, currentSubscription.currency)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              মোট খরচ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(
                  currentSubscription.invoices.reduce((sum, inv) => sum + inv.amount, 0),
                  currentSubscription.currency
                )}
              </p>
              <p className="text-gray-600 mt-1">এ বছরে মোট</p>
              <p className="text-sm text-gray-500 mt-2">
                {currentSubscription.invoices.length} টি ইনভয়েস
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              ব্যবহারের সময়
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-gray-600 mt-1">মাস</p>
              <p className="text-sm text-gray-500 mt-2">
                যোগদানের তারিখ: জুন ২০২৩
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            ইনভয়েসের ইতিহাস
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ইনভয়েস নম্বর</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">তারিখ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">পরিমাণ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">অবস্থা</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {currentSubscription.invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className="font-medium">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(invoice.date).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewInvoice(invoice.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          দেখুন
                        </Button>
                        {invoice.status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            ডাউনলোড
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans for Upgrade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-600" />
            অন্যান্য প্ল্যান
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans
              .filter(plan => plan.id !== currentSubscription.planId)
              .map((plan) => (
                <Card key={plan.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <h4 className="font-semibold text-lg">{plan.name}</h4>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {formatCurrency(plan.price, plan.currency)}
                        <span className="text-sm font-normal text-gray-600">/মাস</span>
                      </p>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-sm text-gray-500">
                          +{plan.features.length - 3} আরো ফিচার
                        </li>
                      )}
                    </ul>

                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.price > (currentPlan?.price || 0) ? 'আপগ্রেড' : 'ডাউনগ্রেড'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showUpgradeModal && selectedPlan && (
        <CheckoutModal
          plan={subscriptionPlans.find(p => p.id === selectedPlan)!}
          onClose={() => {
            setShowUpgradeModal(false)
            setSelectedPlan(null)
          }}
        />
      )}

      {showInvoiceModal && selectedInvoice && (
        <InvoiceModal
          invoice={currentSubscription.invoices.find(inv => inv.id === selectedInvoice)!}
          onClose={() => {
            setShowInvoiceModal(false)
            setSelectedInvoice(null)
          }}
        />
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCancelModal(false)}
          title="সাবস্ক্রিপশন বাতিল করুন"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">সতর্কতা</span>
              </div>
              <p className="text-red-700 mt-1">
                সাবস্ক্রিপশন বাতিল করলে আপনি সকল ফিচার হারাবেন। এই অ্যাকশন ফেরত নেওয়া যাবে না।
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">বাতিল করার কারণ (ঐচ্ছিক)</h4>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
                placeholder="আমাদের জানান কেন আপনি সাবস্ক্রিপশন বাতিল করতে চান..."
              ></textarea>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
              >
                ফিরে যান
              </Button>
              <Button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                বাতিল নিশ্চিত করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
