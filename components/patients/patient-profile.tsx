'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Patient, Appointment, Prescription } from '@/lib/patients-data'
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Plus,
  Download,
  Printer,
  RefreshCw,
  CalendarDays
} from 'lucide-react'

interface PatientProfileProps {
  patient: Patient
  appointments: Appointment[]
  prescriptions: Prescription[]
  onBack: () => void
  onNewAppointment: () => void
  onNewPrescription: () => void
}

export function PatientProfile({ 
  patient, 
  appointments, 
  prescriptions, 
  onBack, 
  onNewAppointment, 
  onNewPrescription 
}: PatientProfileProps) {
  const [activeTab, setActiveTab] = useState('summary')

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'scheduled': { bg: 'bg-blue-100', text: 'text-blue-600', label: 'নির্ধারিত' },
      'completed': { bg: 'bg-green-100', text: 'text-green-600', label: 'সম্পন্ন' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-600', label: 'বাতিল' },
      'rescheduled': { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'পুনর্নির্ধারিত' }
    }
    const style = statusMap[status as keyof typeof statusMap] || statusMap.scheduled
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    )
  }

  const tabs = [
    { id: 'summary', label: 'সারাংশ' },
    { id: 'appointments', label: 'অ্যাপয়েন্টমেন্ট' },
    { id: 'prescriptions', label: 'প্রেসক্রিপশন' },
    { id: 'billing', label: 'বিলিং' },
    { id: 'files', label: 'ফাইল' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">রোগী ID: {patient.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={onNewAppointment} className="bg-emerald-600 hover:bg-emerald-700">
            <Calendar className="h-4 w-4 mr-2" />
            নতুন অ্যাপয়েন্টমেন্ট
          </Button>
          <Button onClick={onNewPrescription} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            নতুন প্রেসক্রিপশন
          </Button>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">বয়স</p>
                <p className="font-medium">{calculateAge(patient.dateOfBirth)} বছর</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ফোন</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            </div>
            
            {patient.email && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ইমেইল</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ঠিকানা</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">জন্ম তারিখ</p>
                    <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">লিঙ্গ</p>
                    <p className="font-medium">
                      {patient.gender === 'male' ? 'পুরুষ' : patient.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}
                    </p>
                  </div>
                  {patient.bloodGroup && (
                    <div>
                      <p className="text-sm text-gray-500">রক্তের গ্রুপ</p>
                      <p className="font-medium">{patient.bloodGroup}</p>
                    </div>
                  )}
                  {patient.emergencyContact && (
                    <div>
                      <p className="text-sm text-gray-500">জরুরি যোগাযোগ</p>
                      <p className="font-medium">{patient.emergencyContact}</p>
                    </div>
                  )}
                </div>
                
                {patient.allergies && patient.allergies.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">অ্যালার্জি</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {patient.allergies.map((allergy, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>মেডিকেল নোট</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.notes ? (
                  <p className="text-gray-700">{patient.notes}</p>
                ) : (
                  <p className="text-gray-500 italic">কোনো নোট যোগ করা হয়নি</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'appointments' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>অ্যাপয়েন্টমেন্ট তালিকা</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  ক্যালেন্ডার
                </Button>
                <Button onClick={onNewAppointment} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  যোগ করুন
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{formatDate(appointment.date)} - {appointment.time}</p>
                          <p className="text-sm text-gray-600">{appointment.doctorName} • {appointment.type}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">কোনো অ্যাপয়েন্টমেন্ট নেই</p>
                  <Button onClick={onNewAppointment} className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                    প্রথম অ্যাপয়েন্টমেন্ট বুক করুন
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'prescriptions' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>প্রেসক্রিপশন তালিকা</CardTitle>
              <Button onClick={onNewPrescription} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                যোগ করুন
              </Button>
            </CardHeader>
            <CardContent>
              {prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border border-gray-200 rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{formatDate(prescription.date)}</p>
                            <p className="text-sm text-gray-600">{prescription.doctorName}</p>
                            <p className="text-sm text-blue-600 mt-1">রোগ নির্ণয়: {prescription.diagnosis}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Printer className="h-4 w-4 mr-2" />
                              প্রিন্ট
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              রিফিল
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium mb-3">ওষুধের তালিকা:</h4>
                        <div className="space-y-2">
                          {prescription.medicines.map((medicine, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{medicine.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                                  </p>
                                  {medicine.instructions && (
                                    <p className="text-sm text-blue-600 mt-1">{medicine.instructions}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {prescription.notes && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">{prescription.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">কোনো প্রেসক্রিপশন নেই</p>
                  <Button onClick={onNewPrescription} className="mt-4 bg-blue-600 hover:bg-blue-700">
                    প্রথম প্রেসক্রিপশন লিখুন
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'billing' && (
          <Card>
            <CardHeader>
              <CardTitle>বিলিং তথ্য</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">বিলিং তথ্য শীঘ্রই যোগ করা হবে</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'files' && (
          <Card>
            <CardHeader>
              <CardTitle>ফাইল ও ডকুমেন্ট</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">ফাইল আপলোড ফিচার শীঘ্রই যোগ করা হবে</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
