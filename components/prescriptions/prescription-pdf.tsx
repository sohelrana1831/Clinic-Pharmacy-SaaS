'use client'

import React, { forwardRef } from 'react'
import { format } from 'date-fns'

interface PrescriptionPDFProps {
  prescription: {
    id: string
    patient: {
      name: string
      age?: number
      phone: string
      address?: string
      gender?: string
    }
    doctor: {
      name: string
      registrationNo?: string
      specialization?: string
    }
    date: string
    diagnosis: string
    medicines: Array<{
      medicine: {
        name: string
        strength?: string
        manufacturer?: string
      }
      dosage: string
      frequency: string
      duration: string
      instructions?: string
      quantity: number
    }>
    notes?: string
  }
  clinic?: {
    name: string
    address: string
    phone: string
    email?: string
    license?: string
  }
}

export const PrescriptionPDF = forwardRef<HTMLDivElement, PrescriptionPDFProps>(
  ({ prescription, clinic }, ref) => {
    const defaultClinic = {
      name: 'ক্লিনিক ফার্মেসি',
      address: 'ঢাকা, বাংলাদেশ',
      phone: '০১৭১২৩৪৫৬৭৮',
      email: 'info@clinic.com',
      license: 'DDA-12345'
    }

    const clinicInfo = clinic || defaultClinic

    return (
      <div
        ref={ref}
        className="max-w-4xl mx-auto bg-white p-8 shadow-lg"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#000'
        }}
      >
        {/* Header */}
        <div className="border-b-2 border-blue-600 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-blue-600 mb-2">
                {clinicInfo.name}
              </h1>
              <p className="text-gray-600">{clinicInfo.address}</p>
              <p className="text-gray-600">ফোন: {clinicInfo.phone}</p>
              {clinicInfo.email && (
                <p className="text-gray-600">ইমেইল: {clinicInfo.email}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">প্রেসক্রিপশন</div>
              <div className="text-sm text-gray-600">
                আইডি: {prescription.id}
              </div>
              <div className="text-sm text-gray-600">
                তারিখ: {format(new Date(prescription.date), 'dd/MM/yyyy')}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">ডাক্তারের তথ্য</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>নাম:</strong> {prescription.doctor.name}</p>
            {prescription.doctor.registrationNo && (
              <p><strong>রেজিস্ট্রেশন নং:</strong> {prescription.doctor.registrationNo}</p>
            )}
            {prescription.doctor.specialization && (
              <p><strong>বিশেষত্ব:</strong> {prescription.doctor.specialization}</p>
            )}
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">রোগীর তথ্য</h2>
          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>নাম:</strong> {prescription.patient.name}</p>
                <p><strong>ফোন:</strong> {prescription.patient.phone}</p>
              </div>
              <div>
                {prescription.patient.age && (
                  <p><strong>বয়স:</strong> {prescription.patient.age} বছর</p>
                )}
                {prescription.patient.gender && (
                  <p><strong>লিঙ্গ:</strong> {prescription.patient.gender}</p>
                )}
              </div>
            </div>
            {prescription.patient.address && (
              <p className="mt-2"><strong>ঠিকানা:</strong> {prescription.patient.address}</p>
            )}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">রোগ নির্ণয়</h2>
          <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
            <p className="font-medium">{prescription.diagnosis}</p>
          </div>
        </div>

        {/* Medicines */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">ওষুধের তালিকা</h2>
          <div className="space-y-4">
            {prescription.medicines.map((med, index) => (
              <div key={index} className="border border-gray-300 rounded p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{med.medicine.name}</h3>
                    {med.medicine.strength && (
                      <p className="text-gray-600 text-sm">{med.medicine.strength}</p>
                    )}
                    {med.medicine.manufacturer && (
                      <p className="text-gray-500 text-sm">{med.medicine.manufacturer}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      #{index + 1}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">ডোজ</p>
                    <p className="text-sm">{med.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">সেবনের নিয়ম</p>
                    <p className="text-sm">{med.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">সময়কাল</p>
                    <p className="text-sm">{med.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">পরিমাণ</p>
                    <p className="text-sm font-semibold">{med.quantity} টি</p>
                  </div>
                </div>
                
                {med.instructions && (
                  <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-yellow-800">বিশেষ নির্দেশনা:</p>
                    <p className="text-sm text-yellow-700">{med.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        {prescription.notes && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-600">অতিরিক্ত পরামর্শ</h2>
            <div className="bg-green-50 p-4 rounded border-l-4 border-green-600">
              <p>{prescription.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-600">
                মুদ্রণ তারিখ: {format(new Date(), 'dd/MM/yyyy HH:mm')}
              </p>
              {clinicInfo.license && (
                <p className="text-sm text-gray-600">
                  লাইসেন্স নং: {clinicInfo.license}
                </p>
              )}
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-48 mb-2"></div>
              <p className="text-sm font-medium">ডাক্তারের স্বাক্ষর</p>
              <p className="text-xs text-gray-600">{prescription.doctor.name}</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-800">
            <strong>গুরুত্বপূর্ণ নির্দেশনা:</strong> ওষুধ সেবনের আগে ডাক্তারের পরামর্শ নিন। 
            নির্দেশিত মাত্রার চেয়ে বেশি সেবন করবেন না। পার্শ্বপ্রতিক্রিয়া দেখা দিলে 
            অবিলম্বে চিকিৎসকের পরামর্শ নিন।
          </p>
        </div>
      </div>
    )
  }
)

PrescriptionPDF.displayName = 'PrescriptionPDF'
