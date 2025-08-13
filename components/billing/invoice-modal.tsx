'use client'

import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Invoice, formatCurrency, getStatusBadgeColor, getStatusText } from '@/lib/subscription-data'
import { Download, Printer, Mail, FileText } from 'lucide-react'

interface InvoiceModalProps {
  invoice: Invoice
  onClose: () => void
}

export function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  const handleDownload = () => {
    // In real app, this would generate and download PDF
    alert(`Invoice ${invoice.invoiceNumber} PDF ডাউনলোড করা হচ্ছে...`)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    // In real app, this would send invoice via email
    alert(`Invoice ${invoice.invoiceNumber} ইমেইলে পাঠানো ��চ্ছে...`)
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`ইনভয়েস ${invoice.invoiceNumber}`}
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 print:border-0 print:shadow-none">
          {/* Company Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">ক্লিনিক ম্যানেজমেন্ট সিস্টেম</h2>
              <p className="text-gray-600 mt-1">Complete Healthcare Management Solution</p>
              <div className="mt-3 text-sm text-gray-600">
                <p>📧 support@clinicms.com</p>
                <p>📞 +৮৮০ ১৭০০ ০০০০০০</p>
                <p>🌐 www.clinicms.com</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold text-gray-900">ইনভয়েস</h3>
              <p className="text-gray-600">Invoice</p>
              <div className="mt-3">
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(invoice.status)}`}>
                  {getStatusText(invoice.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">বিল প্র��পক:</h4>
              <div className="text-gray-700">
                <p className="font-medium">SR Pharma</p>
                <p>admin@srpharma.com</p>
                <p>+৮৮০ ১৯১২ ৩৪৫৬৭৮</p>
                <p>ধানমন্ডি, ঢাকা ১২০৫</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">ইনভয়েস তথ্য:</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>ইনভয়েস নম্বর:</span>
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>তারিখ:</span>
                  <span>{new Date(invoice.date).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span>দেয় তারিখ:</span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span>পেমেন্ট পদ্ধতি:</span>
                  <span>{invoice.paymentMethod === 'sslcommerz' ? 'SSLCommerz' : 'Stripe'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">সেবা বিবরণী:</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">বিবরণ</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">সময়কাল</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">পরিমাণ</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">মূল্য</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-gray-600">{item.period}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(item.amount, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>সাবটোটাল:</span>
                  <span>{formatCurrency(invoice.amount, invoice.currency)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>VAT (0%):</span>
                  <span>{formatCurrency(0, invoice.currency)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                  <span>মোট:</span>
                  <span className="text-blue-600">{formatCurrency(invoice.amount, invoice.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {invoice.status === 'paid' && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">পেমেন্ট সম্পন্ন</span>
              </div>
              <p className="text-green-700 mt-1">
                এই ইনভয়েসের পেমেন্ট সফলভাবে গ্রহণ করা হয়েছে। ধন্যবাদ!
              </p>
            </div>
          )}

          {invoice.status === 'pending' && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">পেমেন্ট অপেক্ষমান</span>
              </div>
              <p className="text-yellow-700 mt-1">
                এই ইনভয়েসের পেমেন্ট এখনো প্রা��্ত হয়নি। অনুগ্রহ করে যত শীঘ্র সম্ভব পেমেন্ট করুন।
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>ধন্যবাদ যে আপনি আমাদের সেবা ব্যবহার করছেন!</p>
            <p className="mt-1">
              কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন: support@clinicms.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 print:hidden">
          <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            PDF ডাউন���োড
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            প্রিন্ট করুন
          </Button>
          <Button onClick={handleEmail} variant="outline" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            ইমেইল পাঠান
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            বন্ধ করুন
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </Modal>
  )
}
