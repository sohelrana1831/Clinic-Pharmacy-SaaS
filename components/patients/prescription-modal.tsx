'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Patient } from '@/lib/patients-data'
import { 
  FileText,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react'

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient | null
}

interface PrescriptionMedicine {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export function PrescriptionModal({ isOpen, onClose, patient }: PrescriptionModalProps) {
  const { t } = useTranslation()
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ])
  const [doctorNotes, setDoctorNotes] = useState('')
  const [nextVisit, setNextVisit] = useState('')

  const addMedicine = () => {
    setMedicines(prev => [...prev, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const removeMedicine = (index: number) => {
    setMedicines(prev => prev.filter((_, i) => i !== index))
  }

  const updateMedicine = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    setMedicines(prev => prev.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    ))
  }

  const handleSave = () => {
    // Save prescription logic
    const prescriptionData = {
      patientId: patient?.id,
      patientName: patient?.name,
      medicines,
      doctorNotes,
      nextVisit,
      date: new Date().toISOString(),
      doctorName: 'ডা. রহিম উদ্দিন'
    }
    
    console.log('Prescription saved:', prescriptionData)
    
    // Navigate to prescription editor or show success
    window.location.href = '/prescriptions/editor'
  }

  if (!patient) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${patient.name} এর জন্য প্রেসক্রিপশন`}
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Patient Info */}
        <Card className="card-theme border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-theme-foreground flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              রোগীর তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-theme-muted">নাম:</span>
                <span className="ml-2 text-theme-foreground font-medium">{patient.name}</span>
              </div>
              <div>
                <span className="text-theme-muted">বয়স:</span>
                <span className="ml-2 text-theme-foreground font-medium">
                  {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} বছর
                </span>
              </div>
              <div>
                <span className="text-theme-muted">ফোন:</span>
                <span className="ml-2 text-theme-foreground font-medium">{patient.phone}</span>
              </div>
              <div>
                <span className="text-theme-muted">লিঙ্গ:</span>
                <span className="ml-2 text-theme-foreground font-medium">
                  {patient.gender === 'male' ? 'পুরুষ' : patient.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medicines */}
        <Card className="card-theme border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg text-theme-foreground">ওষুধের তালিকা</CardTitle>
            <Button onClick={addMedicine} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              ওষুধ যোগ করুন
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicines.map((medicine, index) => (
                <div key={index} className="p-4 border border-theme-default rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-theme-foreground">ওষুধ #{index + 1}</span>
                    {medicines.length > 1 && (
                      <Button
                        onClick={() => removeMedicine(index)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium form-label-theme mb-1">
                        ওষুধের নাম
                      </label>
                      <Input
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                        placeholder="ওষুধের নাম লিখুন"
                        className="input-theme"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium form-label-theme mb-1">
                        ডোজ
                      </label>
                      <Input
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        placeholder="যেমন: ১ টি"
                        className="input-theme"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium form-label-theme mb-1">
                        ফ্রিকোয়েন্সি
                      </label>
                      <select
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="দিনে ১ বার">দিনে ১ বার</option>
                        <option value="দিনে ২ বার">দিনে ২ বার</option>
                        <option value="দিনে ৩ বার">দিনে ৩ বার</option>
                        <option value="প্রয়োজনে">প্রয়োজনে</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium form-label-theme mb-1">
                        মেয়াদ
                      </label>
                      <select
                        value={medicine.duration}
                        onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme"
                      >
                        <option value="">নির্বাচন করুন</option>
                        <option value="৩ দিন">৩ দিন</option>
                        <option value="৫ দিন">৫ দিন</option>
                        <option value="৭ দিন">৭ দিন</option>
                        <option value="১০ দিন">১০ দিন</option>
                        <option value="১৫ দিন">১৫ দিন</option>
                        <option value="১ মাস">১ মাস</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium form-label-theme mb-1">
                      নির্দেশনা
                    </label>
                    <Input
                      value={medicine.instructions}
                      onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                      placeholder="যেমন: খাবার পরে সেবন করুন"
                      className="input-theme"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Notes */}
        <Card className="card-theme border">
          <CardHeader>
            <CardTitle className="text-lg text-theme-foreground">ডাক্তারের পরামর্শ</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="অতিরিক্ত পরামর্শ বা নির্দেশনা লিখুন..."
              rows={4}
              className="w-full px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme resize-none"
            />
          </CardContent>
        </Card>

        {/* Next Visit */}
        <Card className="card-theme border">
          <CardHeader>
            <CardTitle className="text-lg text-theme-foreground">পরবর্তী ভিজিট</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={nextVisit}
              onChange={(e) => setNextVisit(e.target.value)}
              className="input-theme"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-theme-default">
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            বাতিল
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            প্রেসক্রিপশন সংরক্ষণ
          </Button>
        </div>
      </div>
    </Modal>
  )
}
