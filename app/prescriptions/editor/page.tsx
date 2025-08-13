'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { samplePatients } from '@/lib/patients-data'
import { 
  sampleMedicines, 
  sampleDoctorsWithReg, 
  searchMedicines,
  calculateRefillDate,
  calculateTotalQuantity,
  doseOptions,
  frequencyOptions,
  durationOptions,
  PrescriptionData,
  PrescriptionMedicine
} from '@/lib/prescriptions-data'
import { 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  Send, 
  User, 
  Calendar,
  Pill,
  FileText,
  CheckCircle
} from 'lucide-react'

export default function PrescriptionEditorPage() {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    doctorRegistration: '',
    clinicId: 'clinic-1',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    medicines: [],
    notes: '',
    status: 'draft'
  })

  const [patientSearch, setPatientSearch] = useState('')
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState(samplePatients)
  const [medicineSearches, setMedicineSearches] = useState<{ [key: number]: string }>({})
  const [medicineDropdowns, setMedicineDropdowns] = useState<{ [key: number]: boolean }>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  })

  // Filter patients based on search
  useEffect(() => {
    if (patientSearch) {
      const filtered = samplePatients.filter(patient =>
        patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        patient.phone.includes(patientSearch) ||
        patient.id.toLowerCase().includes(patientSearch.toLowerCase())
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(samplePatients)
    }
  }, [patientSearch])

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const handlePatientSelect = (patient: any) => {
    setPrescriptionData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name
    }))
    setPatientSearch(patient.name)
    setShowPatientDropdown(false)
  }

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = sampleDoctorsWithReg.find(d => d.id === doctorId)
    if (doctor) {
      setPrescriptionData(prev => ({
        ...prev,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorRegistration: doctor.registrationNo
      }))
    }
  }

  const addMedicine = () => {
    const newMedicine: PrescriptionMedicine = {
      medicineId: '',
      medicineName: '',
      dose: '',
      frequency: '',
      duration: '',
      instructions: '',
      totalQuantity: 0
    }
    
    setPrescriptionData(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine]
    }))
  }

  const removeMedicine = (index: number) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }))
  }

  const updateMedicine = (index: number, field: keyof PrescriptionMedicine, value: any) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => {
        if (i === index) {
          const updatedMed = { ...med, [field]: value }
          
          // Auto-calculate total quantity and refill date
          if (field === 'dose' || field === 'frequency' || field === 'duration') {
            updatedMed.totalQuantity = calculateTotalQuantity(
              updatedMed.dose, 
              updatedMed.frequency, 
              updatedMed.duration
            )
          }
          
          return updatedMed
        }
        return med
      })
    }))

    // Update next refill date based on longest duration
    const durations = prescriptionData.medicines.map(m => m.duration).filter(Boolean)
    if (durations.length > 0) {
      const longestDuration = durations.reduce((longest, current) => {
        const currentDays = getDurationInDays(current)
        const longestDays = getDurationInDays(longest)
        return currentDays > longestDays ? current : longest
      })
      
      setPrescriptionData(prev => ({
        ...prev,
        nextRefillDate: calculateRefillDate(longestDuration)
      }))
    }
  }

  const getDurationInDays = (duration: string): number => {
    if (duration.includes('দিন')) {
      const match = duration.match(/(\d+)/)
      return match ? parseInt(match[1]) : 0
    } else if (duration.includes('সপ্তাহ')) {
      const match = duration.match(/(\d+)/)
      return match ? parseInt(match[1]) * 7 : 0
    } else if (duration.includes('মাস')) {
      const match = duration.match(/(\d+)/)
      return match ? parseInt(match[1]) * 30 : 0
    }
    return 0
  }

  const handleMedicineSelect = (index: number, medicine: any) => {
    updateMedicine(index, 'medicineId', medicine.id)
    updateMedicine(index, 'medicineName', medicine.name)
    setMedicineSearches(prev => ({ ...prev, [index]: medicine.name }))
    setMedicineDropdowns(prev => ({ ...prev, [index]: false }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!prescriptionData.patientId) {
      newErrors.patient = 'রোগী নির্বাচন করুন'
    }

    if (!prescriptionData.doctorId) {
      newErrors.doctor = 'ডাক্তার ��ির্বাচন করুন'
    }

    if (!prescriptionData.diagnosis.trim()) {
      newErrors.diagnosis = 'রোগ নির্ণয় লিখুন'
    }

    if (prescriptionData.medicines.length === 0) {
      newErrors.medicines = 'কমপক্ষে একটি ওষুধ যোগ করুন'
    }

    // Validate each medicine
    prescriptionData.medicines.forEach((med, index) => {
      if (!med.medicineId) {
        newErrors[`medicine_${index}_name`] = 'ওষুধ নির্বাচন করুন'
      }
      if (!med.dose) {
        newErrors[`medicine_${index}_dose`] = 'ডোজ নির্ধারণ করুন'
      }
      if (!med.frequency) {
        newErrors[`medicine_${index}_frequency`] = 'সেবনের নিয়ম নির্ধারণ করুন'
      }
      if (!med.duration) {
        newErrors[`medicine_${index}_duration`] = 'সেবনের সময়কাল নির্ধারণ করুন'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      showToastMessage('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'error')
      return
    }

    // Save prescription
    console.log('Saving prescription:', prescriptionData)
    showToastMessage('প্রেসক্রিপশন সফলভাবে সংরক্ষিত হয়েছে')
  }

  const handlePrint = () => {
    if (!validateForm()) {
      showToastMessage('প্রিন্ট করার আগে সকল তথ্য পূরণ ক���ুন', 'error')
      return
    }

    // Open print window
    window.open('/prescriptions/print', '_blank')
  }

  const handleSendSMS = () => {
    if (!prescriptionData.patientId) {
      showToastMessage('রোগী নির্বাচন করুন', 'error')
      return
    }

    // Send SMS logic
    showToastMessage('রোগীর কাছে SMS পাঠানো হয়েছে')
  }

  return (
    <div className="min-h-screen bg-theme-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />

        {/* Prescription Content */}
        <main className="flex-1 p-6 bg-theme-background">
          <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">প্রেসক্রিপশন লিখুন</h1>
            <p className="text-gray-600">নতুন প্রেসক্রিপশন তৈরি করুন</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              সংরক্ষণ করুন
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              প্রিন্ট/PDF
            </Button>
            <Button onClick={handleSendSMS} variant="outline">
              <Send className="h-4 w-4 mr-2" />
              SMS পাঠান
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient & Doctor Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  রোগী ও ডাক্তারের তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Patient Search */}
                <div className="relative">
                  <Label htmlFor="patientSearch">রোগী খুঁজুন *</Label>
                  <Input
                    id="patientSearch"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value)
                      setShowPatientDropdown(true)
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder="নাম, ফোন বা ID দিয়ে খুঁজুন..."
                    className={errors.patient ? 'border-red-500' : ''}
                  />
                  
                  {/* Patient Dropdown */}
                  {showPatientDropdown && patientSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.slice(0, 5).map((patient) => (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() => handlePatientSelect(patient)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{patient.name}</p>
                                <p className="text-sm text-gray-500">{patient.id} • {patient.phone}</p>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500">কোনো রোগী পাওয়া যায়নি</div>
                      )}
                    </div>
                  )}
                  {errors.patient && <p className="text-sm text-red-500 mt-1">{errors.patient}</p>}
                </div>

                {/* Doctor Selection */}
                <div>
                  <Label htmlFor="doctor">ডাক্তার নির্বাচন করুন *</Label>
                  <Select
                    id="doctor"
                    value={prescriptionData.doctorId}
                    onChange={(e) => handleDoctorSelect(e.target.value)}
                    className={errors.doctor ? 'border-red-500' : ''}
                  >
                    <option value="">ডাক্তার নির্বাচ��� করুন</option>
                    {sampleDoctorsWithReg.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </Select>
                  {errors.doctor && <p className="text-sm text-red-500 mt-1">{errors.doctor}</p>}
                </div>

                {/* Date */}
                <div>
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    তারিখ
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={prescriptionData.date}
                    onChange={(e) => setPrescriptionData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  রোগ নির্ণয়
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="রোগের নাম ও বিবর�� লিখুন..."
                  rows={3}
                  className={`w-full p-3 border rounded-md resize-none text-gray-900 placeholder:text-gray-500 ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.diagnosis && <p className="text-sm text-red-500 mt-1">{errors.diagnosis}</p>}
              </CardContent>
            </Card>

            {/* Medicines */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Pill className="h-5 w-5 mr-2" />
                  ওষুধের তালিকা
                </CardTitle>
                <Button onClick={addMedicine} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  ওষুধ যোগ করুন
                </Button>
              </CardHeader>
              <CardContent>
                {prescriptionData.medicines.length === 0 ? (
                  <div className="text-center py-8">
                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">এখনো কোনো ওষুধ যোগ করা হয়নি</p>
                    <Button onClick={addMedicine} className="mt-4 bg-blue-600 hover:bg-blue-700">
                      প্রথম ওষুধ যোগ করুন
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptionData.medicines.map((medicine, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium text-gray-900">ওষুধ #{index + 1}</h4>
                          <Button
                            onClick={() => removeMedicine(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Medicine Name */}
                          <div className="relative md:col-span-2">
                            <Label>ওষুধের নাম *</Label>
                            <Input
                              value={medicineSearches[index] || ''}
                              onChange={(e) => {
                                setMedicineSearches(prev => ({ ...prev, [index]: e.target.value }))
                                setMedicineDropdowns(prev => ({ ...prev, [index]: true }))
                              }}
                              onFocus={() => setMedicineDropdowns(prev => ({ ...prev, [index]: true }))}
                              placeholder="ওষুধের নাম খুঁজুন..."
                              className={errors[`medicine_${index}_name`] ? 'border-red-500' : ''}
                            />
                            
                            {/* Medicine Dropdown */}
                            {medicineDropdowns[index] && medicineSearches[index] && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {searchMedicines(medicineSearches[index]).slice(0, 5).map((med) => (
                                  <button
                                    key={med.id}
                                    type="button"
                                    onClick={() => handleMedicineSelect(index, med)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-900">{med.name}</p>
                                      <p className="text-sm text-gray-500">
                                        {med.strength} • {med.manufacturer} • স্টক: {med.stock}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                            {errors[`medicine_${index}_name`] && (
                              <p className="text-sm text-red-500 mt-1">{errors[`medicine_${index}_name`]}</p>
                            )}
                          </div>

                          {/* Dose */}
                          <div>
                            <Label>ডোজ *</Label>
                            <Select
                              value={medicine.dose}
                              onChange={(e) => updateMedicine(index, 'dose', e.target.value)}
                              className={errors[`medicine_${index}_dose`] ? 'border-red-500' : ''}
                            >
                              <option value="">ডোজ নির্বাচন করুন</option>
                              {doseOptions.map((dose) => (
                                <option key={dose} value={dose}>{dose}</option>
                              ))}
                            </Select>
                            {errors[`medicine_${index}_dose`] && (
                              <p className="text-sm text-red-500 mt-1">{errors[`medicine_${index}_dose`]}</p>
                            )}
                          </div>

                          {/* Frequency */}
                          <div>
                            <Label>সেবনের নিয়ম *</Label>
                            <Select
                              value={medicine.frequency}
                              onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                              className={errors[`medicine_${index}_frequency`] ? 'border-red-500' : ''}
                            >
                              <option value="">সেবনের নিয়ম নির্বাচন করুন</option>
                              {frequencyOptions.map((freq) => (
                                <option key={freq} value={freq}>{freq}</option>
                              ))}
                            </Select>
                            {errors[`medicine_${index}_frequency`] && (
                              <p className="text-sm text-red-500 mt-1">{errors[`medicine_${index}_frequency`]}</p>
                            )}
                          </div>

                          {/* Duration */}
                          <div>
                            <Label>সেবনের সময়কাল *</Label>
                            <Select
                              value={medicine.duration}
                              onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                              className={errors[`medicine_${index}_duration`] ? 'border-red-500' : ''}
                            >
                              <option value="">সময়কাল নির্বাচন করুন</option>
                              {durationOptions.map((duration) => (
                                <option key={duration} value={duration}>{duration}</option>
                              ))}
                            </Select>
                            {errors[`medicine_${index}_duration`] && (
                              <p className="text-sm text-red-500 mt-1">{errors[`medicine_${index}_duration`]}</p>
                            )}
                          </div>

                          {/* Total Quantity */}
                          <div>
                            <Label>মোট পরিমাণ</Label>
                            <Input
                              value={medicine.totalQuantity || ''}
                              readOnly
                              className="bg-gray-50"
                              placeholder="স্বয়ংক্রিয় গণনা"
                            />
                          </div>

                          {/* Instructions */}
                          <div className="md:col-span-2">
                            <Label>বিশেষ নির্দেশনা</Label>
                            <Input
                              value={medicine.instructions}
                              onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                              placeholder="যেমন: খাবারের সাথে, ঘুমানোর আগে..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.medicines && <p className="text-sm text-red-500 mt-4">{errors.medicines}</p>}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>অতিরিক্ত নির্দেশনা</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={prescriptionData.notes}
                  onChange={(e) => setPrescriptionData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="রোগীর জন্য অতিরিক্ত পরামর্শ বা নির্দেশনা..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md resize-none text-gray-900 placeholder:text-gray-500"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Doctor Signature */}
            {prescriptionData.doctorId && (
              <Card>
                <CardHeader>
                  <CardTitle>��াক্তারের স্বাক্ষর</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">{prescriptionData.doctorName}</p>
                      <p className="text-sm text-gray-600">{sampleDoctorsWithReg.find(d => d.id === prescriptionData.doctorId)?.specialization}</p>
                      <p className="text-sm text-gray-500">রেজিস্ট্রেশন নং: {prescriptionData.doctorRegistration}</p>
                      <div className="h-16 bg-gray-50 rounded border flex items-center justify-center mt-4">
                        <span className="text-gray-400 text-sm">ডিজিটাল স্বাক্ষর</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Refill */}
            {prescriptionData.nextRefillDate && (
              <Card>
                <CardHeader>
                  <CardTitle>পরবর্তী রিফিল</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">পরবর্তী রিফিলের তারিখ</p>
                    <p className="font-medium text-blue-600">
                      {new Date(prescriptionData.nextRefillDate).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>প্রেসক্রিপশন সারাংশ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">রোগী:</span>
                  <span className="font-medium">{prescriptionData.patientName || 'নির্বাচিত নয়'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ডাক্তার:</span>
                  <span className="font-medium">{prescriptionData.doctorName || 'নির্বাচিত নয়'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ওষুধের সংখ্যা:</span>
                  <span className="font-medium">{prescriptionData.medicines.length} টি</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">তারিখ:</span>
                  <span className="font-medium">
                    {new Date(prescriptionData.date).toLocaleDateString('bn-BD')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {showToast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            showToast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            <CheckCircle className="h-5 w-5" />
            <span>{showToast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
