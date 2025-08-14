'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'
import { Button } from '@/components/ui/button'
import { PrescriptionPDF } from '@/components/prescriptions/prescription-pdf'
import { useApi } from '@/hooks/useApi'
import { prescriptionsApi } from '@/lib/api'
import { Printer, Download, ArrowLeft } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function PrescriptionPrintPage() {
  const searchParams = useSearchParams()
  const prescriptionId = searchParams.get('id')
  const componentRef = useRef<HTMLDivElement>(null)
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Get prescription data
  const { data: prescription, loading, error } = useApi(() => {
    if (prescriptionId) {
      return prescriptionsApi.getPrescription(prescriptionId)
    }
    return Promise.reject(new Error('No prescription ID provided'))
  }, [prescriptionId])

  // Print function
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Prescription-${prescription?.data?.id || 'Unknown'}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 1cm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `
  })

  // Generate PDF function
  const generatePDF = async () => {
    if (!componentRef.current) return

    setIsGeneratingPDF(true)
    try {
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`prescription-${prescription?.data?.id || 'unknown'}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('PDF জেনারেট করতে সমস্যা হয়েছে')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-2">প্রেসক্রিপশন লোড হচ্ছে...</p>
      </div>
    )
  }

  if (error || !prescription?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">প্রেসক্রিপশন লোড করতে সমস্যা হয়েছে</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            ফিরে যান
          </Button>
        </div>
      </div>
    )
  }

  // Transform prescription data for PDF component
  const prescriptionData = {
    id: prescription.data.id,
    patient: {
      name: prescription.data.patient?.name || 'Unknown',
      phone: prescription.data.patient?.phone || '',
      address: prescription.data.patient?.address,
      gender: prescription.data.patient?.gender,
      age: prescription.data.patient?.dateOfBirth 
        ? new Date().getFullYear() - new Date(prescription.data.patient.dateOfBirth).getFullYear()
        : undefined
    },
    doctor: {
      name: prescription.data.doctor?.name || 'Unknown',
      registrationNo: prescription.data.doctor?.registrationNo || 'N/A',
      specialization: prescription.data.doctor?.role || 'Doctor'
    },
    date: prescription.data.date,
    diagnosis: prescription.data.diagnosis,
    medicines: prescription.data.medicines?.map((med: any) => ({
      medicine: {
        name: med.medicine?.name || 'Unknown Medicine',
        strength: med.medicine?.strength,
        manufacturer: med.medicine?.manufacturer
      },
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
      instructions: med.instructions,
      quantity: med.quantity
    })) || [],
    notes: prescription.data.notes
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                ফিরে যান
              </Button>
              <h1 className="text-lg font-semibold">প্রেসক্রিপশন প্রিন্ট/PDF</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="bg-blue-50 hover:bg-blue-100"
              >
                <Printer className="h-4 w-4 mr-2" />
                প্রিন্ট করুন
              </Button>
              <Button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="bg-green-600 hover:bg-green-700"
              >
                {isGeneratingPDF ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                PDF ডাউনলোড
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Preview */}
      <div className="py-8">
        <PrescriptionPDF 
          ref={componentRef}
          prescription={prescriptionData}
        />
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
