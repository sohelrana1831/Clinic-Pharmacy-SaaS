'use client'

import React, { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/inventory-data'

export default function ReceiptPage() {
  const [receiptData, setReceiptData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would come from URL params or localStorage
    // For demo, using sample data
    const sampleReceipt = {
      id: 'INV-001',
      date: '2024-01-15T10:30:00.000Z',
      time: '১০:৩০:০০ AM',
      cashier: 'রিসেপশনিস্ট',
      customerName: 'আবদুর রহমান',
      customerPhone: '০১৭১২৩৪৫৬৭৮',
      paymentMethod: 'নগদ',
      items: [
        {
          name: 'প্যারাসিটামল ৫০০mg',
          sku: 'MED-001',
          quantity: 10,
          unitPrice: 2,
          discount: 0,
          lineTotal: 20
        },
        {
          name: 'ওমিপ্রাজল ২০mg',
          sku: 'MED-002',
          quantity: 5,
          unitPrice: 5,
          discount: 2,
          lineTotal: 23
        },
        {
          name: 'মেটফরমিন ৫০০mg',
          sku: 'MED-003',
          quantity: 15,
          unitPrice: 3,
          discount: 0,
          lineTotal: 45
        }
      ],
      subtotal: 88,
      totalDiscount: 2,
      globalDiscount: 5,
      grandTotal: 81,
      clinic: {
        name: 'SR Pharma - ধানমন্ডি',
        address: 'বাড়ি-১২৩, সড়ক-৪, ধানমন্ডি, ঢাকা-১২০৫',
        phone: '০২-৯৬১২৩৪৫',
        license: 'ফার্মেসি লাইসেন্স: DA-12345'
      }
    }
    
    setReceiptData(sampleReceipt)

    // Auto-print when page loads
    setTimeout(() => {
      window.print()
    }, 1000)
  }, [])

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">রসিদ লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          
          body {
            font-family: 'SolaimanLipi', 'Kalpurush', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.3;
            color: black;
          }
          
          .no-print {
            display: none !important;
          }
          
          .receipt-container {
            width: 80mm;
            padding: 5mm;
            margin: 0;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
          }
          
          .items-table td {
            padding: 2px 0;
            border-bottom: 1px dotted #ccc;
          }
          
          .total-line {
            border-top: 1px solid #000;
            border-bottom: 1px double #000;
          }
          
          .center {
            text-align: center;
          }
          
          .right {
            text-align: right;
          }
          
          .bold {
            font-weight: bold;
          }
          
          .large {
            font-size: 14px;
          }
        }
        
        @media screen {
          .receipt-container {
            max-width: 80mm;
            margin: 20px auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
          }
        }
      `}</style>

      {/* Print Button - Hidden in print */}
      <div className="no-print fixed top-4 right-4 space-x-2">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          প্রিন্ট করুন
        </button>
        <button
          onClick={() => window.close()}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          বন্ধ করুন
        </button>
      </div>

      <div className="receipt-container">
        {/* Header */}
        <div className="center mb-4">
          <div className="large bold mb-1">{receiptData.clinic.name}</div>
          <div className="text-sm">{receiptData.clinic.address}</div>
          <div className="text-sm">ফোন: {receiptData.clinic.phone}</div>
          <div className="text-xs">{receiptData.clinic.license}</div>
          <div className="mt-2 mb-2">
            {'='.repeat(32)}
          </div>
          <div className="bold">বিক্রয়ের রসিদ</div>
        </div>

        {/* Receipt Info */}
        <div className="mb-3 text-sm">
          <div className="flex justify-between">
            <span>রসিদ নং:</span>
            <span className="bold">{receiptData.id}</span>
          </div>
          <div className="flex justify-between">
            <span>তারিখ:</span>
            <span>{new Date(receiptData.date).toLocaleDateString('bn-BD')}</span>
          </div>
          <div className="flex justify-between">
            <span>সময়:</span>
            <span>{receiptData.time}</span>
          </div>
          <div className="flex justify-between">
            <span>ক্যাশিয়ার:</span>
            <span>{receiptData.cashier}</span>
          </div>
        </div>

        {/* Customer Info */}
        {(receiptData.customerName || receiptData.customerPhone) && (
          <div className="mb-3 text-sm">
            <div className="center bold">ক্রেতার তথ্য</div>
            {receiptData.customerName && (
              <div className="flex justify-between">
                <span>নাম:</span>
                <span>{receiptData.customerName}</span>
              </div>
            )}
            {receiptData.customerPhone && (
              <div className="flex justify-between">
                <span>ফোন:</span>
                <span>{receiptData.customerPhone}</span>
              </div>
            )}
          </div>
        )}

        <div className="center">
          {'-'.repeat(32)}
        </div>

        {/* Items */}
        <div className="mb-3">
          <table className="items-table">
            <tbody>
              {receiptData.items.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan={3} className="bold">{item.name}</td>
                  </tr>
                  <tr>
                    <td>{item.quantity} × {formatCurrency(item.unitPrice)}</td>
                    <td className="right">
                      {item.discount > 0 && (
                        <span className="text-sm">(-{formatCurrency(item.discount)}) </span>
                      )}
                    </td>
                    <td className="right bold">{formatCurrency(item.lineTotal)}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="center">
          {'-'.repeat(32)}
        </div>

        {/* Totals */}
        <div className="mb-3 text-sm">
          <div className="flex justify-between">
            <span>সাবটোটাল:</span>
            <span>{formatCurrency(receiptData.subtotal)}</span>
          </div>
          {receiptData.totalDiscount > 0 && (
            <div className="flex justify-between">
              <span>আইটেম ছাড়:</span>
              <span>-{formatCurrency(receiptData.totalDiscount)}</span>
            </div>
          )}
          {receiptData.globalDiscount > 0 && (
            <div className="flex justify-between">
              <span>সামগ্রিক ছাড়:</span>
              <span>-{formatCurrency(receiptData.globalDiscount)}</span>
            </div>
          )}
          <div className="center">
            {'-'.repeat(32)}
          </div>
          <div className="flex justify-between bold large total-line">
            <span>সর্বমোট:</span>
            <span>{formatCurrency(receiptData.grandTotal)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-3 text-sm">
          <div className="flex justify-between">
            <span>পেমেন্ট মেথড:</span>
            <span className="bold">{receiptData.paymentMethod}</span>
          </div>
        </div>

        <div className="center">
          {'='.repeat(32)}
        </div>

        {/* Footer */}
        <div className="center text-xs mt-3">
          <div className="mb-2">আপনার কেনাকাটার জন্য ধন্যবাদ!</div>
          <div className="mb-1">বিনিময়ের জন্য রসিদ সংরক্ষণ করুন</div>
          <div className="mb-2">৭ দিনের মধ্যে বিনিময় সম্ভব</div>
          
          <div className="mt-3 text-xs">
            <div>যোগাযোগ: {receiptData.clinic.phone}</div>
            <div className="mt-1">সময়: সকাল ৮টা - রাত ১০টা</div>
          </div>
          
          <div className="mt-3">
            {'*'.repeat(32)}
          </div>
          <div className="mt-1 text-xs">
            স্বাস্থ্যসেবায় আমাদের বিশ্বাস করার জন্য ধন্যবাদ
          </div>
        </div>
      </div>
    </div>
  )
}
