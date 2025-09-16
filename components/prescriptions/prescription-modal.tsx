'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useApi, useApiMutation } from '@/hooks/useApi'
import { prescriptionsApi, patientsApi, usersApi, medicinesApi, Prescription } from '@/lib/api'
import { Save, X, Plus, Trash2, User, FileText, Pill } from 'lucide-react'

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  prescription?: Prescription | null
}

interface PrescriptionFormData {
  patientId: string
  doctorId: string
  date: string
  diagnosis: string
  notes: string
  status: string
  medicines: Array<{
    medicineId: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
    quantity: number
  }>
}

const doseOptions = [
  '১ টি', '২ টি', '৩ টি', '৪ টি', '৫ টি',
  '১/২ টি', '১ চামচ', '২ চামচ', '১ টেবিল চামচ',
  '৫ মিলি', '১০ মিলি', '১৫ মিলি', '২০ মিলি'
]

const frequencyOptions = [
  'দিনে ১ বার', 'দিনে ২ বার', 'দিনে ৩ বার', 'দিনে ৪ বার',
  'সকালে ১ বার', 'রাতে ১ বার', 'সকাল-রাত', 'সকাল-দুপুর-রাত',
  'খাবারের আগে', 'খাবারের পরে', 'প্রয়োজন অনুযায়ী'
]

const durationOptions = [
  '৩ দিন', '৫ দিন', '৭ দিন', '১০ দিন', '১৪ দিন', '২১ দিন', '৩০ দিন',
  '১ সপ্তাহ', '২ সপ্তাহ', '৩ সপ্তাহ', '৪ সপ্তাহ',
  '১ মাস', '২ মাস', '৩ মাস', '৬ মাস',
  'প্রয়োজন অনুযায়ী', 'সম্পূর্ণ না হওয়া পর্যন্ত'
]

export function PrescriptionModal({ isOpen, onClose, prescription }: PrescriptionModalProps) {
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientId: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    notes: '',
    status: 'draft',
    medicines: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [medicineSearches, setMedicineSearches] = useState<{ [key: number]: string }>({})

  // API hooks
  const { data: patients } = useApi(() => patientsApi.getPatients({ limit: 100 }), [])
  const { data: doctors } = useApi(() => usersApi.getUsers({ role: 'doctor', limit: 100 }), [])
  const { data: medicines } = useApi(() => medicinesApi.getMedicines({ limit: 1000 }), [])
  const { mutate, loading, error, success } = useApiMutation()

  useEffect(() => {
    if (prescription) {
      setFormData({
        patientId: prescription.patientId,
        doctorId: prescription.doctorId,
        date: new Date(prescription.date).toISOString().split('T')[0],
        diagnosis: prescription.diagnosis,
        notes: prescription.notes || '',
        status: prescription.status,
        medicines: prescription.medicines?.map(med => ({
          medicineId: med.medicineId,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions || '',
          quantity: med.quantity
        })) || []
      })
    } else {
      setFormData({
        patientId: '',
        doctorId: '',
        date: new Date().toISOString().split('T')[0],
        diagnosis: '',
        notes: '',
        status: 'draft',
        medicines: []
      })
    }
    setErrors({})
    setMedicineSearches({})
  }, [prescription, isOpen])

  useEffect(() => {
    if (success) {
      onClose()
    }
  }, [success, onClose])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) {
      newErrors.patientId = 'রোগী নির্বাচন করুন'
    }
    if (!formData.doctorId) {
      newErrors.doctorId = 'ডাক্তার নির্বাচন করুন'
    }
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'রোগ নির্ণয় লিখুন'
    }
    if (formData.medicines.length === 0) {
      newErrors.medicines = 'কমপক্ষে একটি ওষুধ যোগ করুন'
    }

    // Validate medicines
    formData.medicines.forEach((med, index) => {
      if (!med.medicineId) {
        newErrors[`medicine_${index}_id`] = 'ওষুধ নির্বাচন করুন'
      }
      if (!med.dosage) {
        newErrors[`medicine_${index}_dosage`] = 'ডোজ নির্ধারণ করুন'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const prescriptionData = {
        ...formData,
        date: new Date(formData.date).toISOString()
      }

      if (prescription) {
        await mutate(() => prescriptionsApi.updatePrescription(prescription.id, prescriptionData))
      } else {
        await mutate(() => prescriptionsApi.createPrescription(prescriptionData))
      }
    } catch (error) {
      console.error('Error saving prescription:', error)
    }
  }

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, {
        medicineId: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: 1
      }]
    }))
  }

  const removeMedicine = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }))
    
    // Remove search terms for this medicine
    setMedicineSearches(prev => {
      const newSearches = { ...prev }
      delete newSearches[index]
      return newSearches
    })
  }

  const updateMedicine = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => {
        if (i === index) {
          const updatedMed = { ...med, [field]: value }
          
          // Auto-calculate quantity based on dosage, frequency, and duration
          if (field === 'dosage' || field === 'frequency' || field === 'duration') {
            const dosageNum = parseInt(updatedMed.dosage.match(/\d+/)?.[0] || '1')
            const frequencyNum = parseInt(updatedMed.frequency.match(/\d+/)?.[0] || '1')
            const durationNum = parseInt(updatedMed.duration.match(/\d+/)?.[0] || '1')
            updatedMed.quantity = dosageNum * frequencyNum * durationNum
          }
          
          return updatedMed
        }
        return med
      })
    }))
  }

  const handleMedicineSelect = (index: number, medicine: any) => {
    updateMedicine(index, 'medicineId', medicine.id)
    setMedicineSearches(prev => ({ ...prev, [index]: medicine.name }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prescription ? 'প্রেসক্রিপশন সম্পাদনা' : 'নতুন প্রেসক্রিপশন'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Selection */}
          <div>
            <Label htmlFor="patientId" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              রোগী *
            </Label>
            <Select
              id="patientId"
              value={formData.patientId}
              onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
              className={errors.patientId ? 'border-red-500' : ''}
            >
              <option value="">রোগী নির্বাচন করুন</option>
              {patients?.data?.map((patient: any) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.phone}
                </option>
              ))}
            </Select>
            {errors.patientId && <p className="text-sm text-red-500 mt-1">{errors.patientId}</p>}
          </div>

          {/* Doctor Selection */}
          <div>
            <Label htmlFor="doctorId" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              ডাক্তার *
            </Label>
            <Select
              id="doctorId"
              value={formData.doctorId}
              onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
              className={errors.doctorId ? 'border-red-500' : ''}
            >
              <option value="">ডাক্তার নির্বাচন করুন</option>
              {doctors?.data?.map((doctor: any) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </Select>
            {errors.doctorId && <p className="text-sm text-red-500 mt-1">{errors.doctorId}</p>}
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">তারিখ</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">স্ট্যাটাস</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="draft">খসড়া</option>
              <option value="issued">জারি করা</option>
              <option value="dispensed">প্রদান করা</option>
            </Select>
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <Label htmlFor="diagnosis" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            রোগ নির্ণয় *
          </Label>
          <textarea
            id="diagnosis"
            value={formData.diagnosis}
            onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
            placeholder="রোগের নাম ও বিবরণ লিখুন..."
            rows={3}
            className={`w-full p-3 border rounded-md resize-none ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.diagnosis && <p className="text-sm text-red-500 mt-1">{errors.diagnosis}</p>}
        </div>

        {/* Medicines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              ওষুধের তালিকা *
            </Label>
            <Button type="button" onClick={addMedicine} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              ওষুধ যোগ করুন
            </Button>
          </div>

          {formData.medicines.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">কোনো ওষুধ যোগ করা হয়নি</p>
              <Button type="button" onClick={addMedicine} className="mt-4 bg-blue-600 hover:bg-blue-700">
                প্রথম ওষুধ যোগ করুন
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {formData.medicines.map((medicine, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium">ওষুধ #{index + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medicine Selection */}
                    <div className="md:col-span-2">
                      <Label>ওষুধের নাম *</Label>
                      <div className="relative">
                        <Input
                          value={medicineSearches[index] || ''}
                          onChange={(e) => setMedicineSearches(prev => ({ ...prev, [index]: e.target.value }))}
                          placeholder="ওষুধের নাম খুঁজুন..."
                          className={errors[`medicine_${index}_id`] ? 'border-red-500' : ''}
                        />
                        
                        {medicineSearches[index] && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {medicines?.data?.filter((med: any) => 
                              med.name.toLowerCase().includes(medicineSearches[index].toLowerCase())
                            ).slice(0, 5).map((med: any) => (
                              <button
                                key={med.id}
                                type="button"
                                onClick={() => handleMedicineSelect(index, med)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-0"
                              >
                                <div>
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {med.strength} • {med.manufacturer} • স্টক: {med.stockQty}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors[`medicine_${index}_id`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`medicine_${index}_id`]}</p>
                      )}
                    </div>

                    {/* Dosage */}
                    <div>
                      <Label>ডোজ *</Label>
                      <Select
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        className={errors[`medicine_${index}_dosage`] ? 'border-red-500' : ''}
                      >
                        <option value="">ডোজ নির্বাচন করুন</option>
                        {doseOptions.map((dose) => (
                          <option key={dose} value={dose}>{dose}</option>
                        ))}
                      </Select>
                      {errors[`medicine_${index}_dosage`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`medicine_${index}_dosage`]}</p>
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

                    {/* Quantity */}
                    <div>
                      <Label>মোট পরিমাণ</Label>
                      <Input
                        type="number"
                        value={medicine.quantity}
                        onChange={(e) => updateMedicine(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
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
          {errors.medicines && <p className="text-sm text-red-500 mt-1">{errors.medicines}</p>}
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">অতিরিক্ত নির্দেশনা</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="রোগীর জন্য অতিরিক্ত পরামর্শ বা নির্দেশনা..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            বাতিল
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {prescription ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
