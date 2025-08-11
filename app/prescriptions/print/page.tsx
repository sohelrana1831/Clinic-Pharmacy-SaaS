'use client'

import { useEffect, useState } from 'react'
import { sampleClinics } from '@/lib/appointments-data'

export default function PrescriptionPrintPage() {
  const [prescriptionData, setPrescriptionData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would come from URL params or state
    // For demo, using sample data
    const samplePrescription = {
      id: 'RX-001',
      patientName: 'আবদুর রহমান',
      patientId: 'P001',
      patientAge: 44,
      patientGender: 'পুরুষ',
      patientPhone: '০১৭১২৩৪৫৬৭৮',
      patientAddress: 'ধানমন্ডি, ঢাকা-১২০৫',
      doctorName: 'ডা. রহিম উদ্দিন',
      doctorSpecialization: 'জেনারেল ফিজিশিয়ান',
      doctorRegistration: 'BM&DC-12345',
      clinicName: 'SR Pharma - ধানমন্ডি',
      clinicAddress: 'বাড়ি-১২ৃ, সড়ক-৪, ধানমন্ডি, ঢাকা-১২০৫',
      clinicPhone: '০২-৯৬১২৩৪৫',
      date: '২০২৪-০১-১৫',
      diagnosis: 'টাইপ ২ ডায়াবেটিস মেলিটাস, হাইপারটেনশন',
      medicines: [
        {
          name: 'মেটফরমিন ৫০০mg',
          dose: '১ টি',
          frequency: 'দিনে ২ বার',
          duration: '৩০ দিন',
          instructions: 'খাবারের সাথে',
          totalQuantity: 60
        },
        {
          name: 'এমলোডিপিন ৫mg',
          dose: '১ টি',
          frequency: 'দিনে ১ বার',
          duration: '৩০ দিন',
          instructions: 'সকালে খাবারের পরে',
          totalQuantity: 30
        },
        {
          name: 'প্যারাসিটামল ৫০০mg',
          dose: '১ টি',
          frequency: 'প্রয়োজনে',
          duration: '৭ দিন',
          instructions: 'জ্বর বা ব্যথার জন্য',
          totalQuantity: 14
        }
      ],
      notes: 'নিয়মিত রক্তে চিন��র মাত্রা পরীক্ষা করুন। পরবর্তী ফলোআপ ১ মাস পর।',
      nextRefillDate: '২০২৪-০২-১৫'
    }
    
    setPrescriptionData(samplePrescription)

    // Auto-print when page loads
    setTimeout(() => {
      window.print()
    }, 1000)
  }, [])

  if (!prescriptionData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">প্রেসক্রিপশন লোড হচ্ছে...</p>
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
            size: A4 portrait;
            margin: 1cm;
          }
          
          body {
            font-family: 'SolaimanLipi', 'Kalpurush', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: black;
          }
          
          .no-print {
            display: none !important;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          .header-logo {
            max-height: 60px;
          }
          
          .medicine-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          
          .medicine-table th,
          .medicine-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          .medicine-table th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          
          .signature-section {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          
          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding: 10px;
            background: white;
          }
        }
        
        @media screen {
          .prescription-container {
            max-width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
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

      <div className="prescription-container">
        {/* Clinic Header */}
        <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-bold text-xl">SR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600 mb-1">{prescriptionData.clinicName}</h1>
              <p className="text-sm text-gray-600">{prescriptionData.clinicAddress}</p>
              <p className="text-sm text-gray-600">ফোন: {prescriptionData.clinicPhone}</p>
            </div>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded"></div>
        </div>

        {/* Prescription Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">প্রেসক্রিপশন</h2>
            <p className="text-sm text-gray-600">প্রেসক্রিপশন নং: {prescriptionData.id}</p>
            <p className="text-sm text-gray-600">তারিখ: {prescriptionData.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{prescriptionData.doctorName}</p>
            <p className="text-sm text-gray-600">{prescriptionData.doctorSpecialization}</p>
            <p className="text-sm text-gray-600">রেজিস্ট্রেশন: {prescriptionData.doctorRegistration}</p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">রোগীর তথ্য</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>নাম:</strong> {prescriptionData.patientName}</p>
              <p><strong>রোগী ID:</strong> {prescriptionData.patientId}</p>
              <p><strong>বয়স:</strong> {prescriptionData.patientAge} বছর</p>
            </div>
            <div>
              <p><strong>লিঙ্গ:</strong> {prescriptionData.patientGender}</p>
              <p><strong>ফোন:</strong> {prescriptionData.patientPhone}</p>
              <p><strong>ঠিকানা:</strong> {prescriptionData.patientAddress}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">রোগ নির্ণয়:</h3>
          <p className="text-gray-800 bg-blue-50 p-3 rounded border-l-4 border-blue-600">
            {prescriptionData.diagnosis}
          </p>
        </div>

        {/* Medicines Table */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">ওষুধের তালিকা:</h3>
          <table className="medicine-table w-full">
            <thead>
              <tr>
                <th className="w-8 text-center">ক্রম</th>
                <th>ওষুধের নাম</th>
                <th className="text-center">ডোজ</th>
                <th className="text-center">সেবনের নিয়ম</th>
                <th className="text-center">সময়কাল</th>
                <th className="text-center">মোট</th>
                <th>নির্দেশনা</th>
              </tr>
            </thead>
            <tbody>
              {prescriptionData.medicines.map((medicine: any, index: number) => (
                <tr key={index}>
                  <td className="text-center font-medium">{index + 1}</td>
                  <td className="font-medium">{medicine.name}</td>
                  <td className="text-center">{medicine.dose}</td>
                  <td className="text-center">{medicine.frequency}</td>
                  <td className="text-center">{medicine.duration}</td>
                  <td className="text-center font-medium">{medicine.totalQuantity}</td>
                  <td className="text-sm">{medicine.instructions || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Notes */}
        {prescriptionData.notes && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">অতিরিক্ত নির্দ��শনা:</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-gray-800">{prescriptionData.notes}</p>
            </div>
          </div>
        )}

        {/* Next Refill */}
        {prescriptionData.nextRefillDate && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800">
                <strong>পরবর্তী রিফিলের তারিখ:</strong> {prescriptionData.nextRefillDate}
              </p>
            </div>
          </div>
        )}

        {/* Doctor Signature */}
        <div className="signature-section">
          <div className="flex justify-between items-end">
            <div className="flex-1">
              <div className="border-b border-gray-400 w-64 mb-2"></div>
              <p className="text-sm text-gray-600">রোগীর স্বাক্ষর</p>
            </div>
            <div className="flex-1 text-right">
              <div className="border-b border-gray-400 w-64 ml-auto mb-2"></div>
              <p className="text-sm font-medium text-gray-900">{prescriptionData.doctorName}</p>
              <p className="text-sm text-gray-600">{prescriptionData.doctorSpecialization}</p>
              <p className="text-sm text-gray-600">রেজিস্ট্রেশন: {prescriptionData.doctorRegistration}</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 pt-4 border-t border-gray-300">
          <div className="bg-gray-50 p-3 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">গুরুত্বপূর্ণ নির্দেশনা:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• ওষুধ সেবনের আগে ডাক্তারের পরামর্শ নিন</li>
              <li>• নির্ধারিত ডোজ ও সময় মেনে চলুন</li>
              <li>• কোনো সমস্যা হলে অবিলম্বে ডাক্তারের সাথে যোগাযোগ করুন</li>
              <li>• এই প্রেসক্রিপশনটি সংরক্ষণ করুন</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer no-print">
        <p>এই প্রেসক্রিপশনটি আপনার চিকি���সা রেকর্ডের জন্য সংরক্ষণ করুন</p>
        <p className="mt-1">{prescriptionData.clinicName} • {prescriptionData.clinicPhone}</p>
      </div>
    </div>
  )
}
