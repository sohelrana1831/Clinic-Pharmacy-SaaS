'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InventoryItem } from '@/lib/inventory-data'
import { 
  Package,
  Save,
  X,
  Plus,
  AlertTriangle
} from 'lucide-react'

interface MedicineModalProps {
  isOpen: boolean
  onClose: () => void
  medicine?: InventoryItem | null
  onSave: (medicine: Partial<InventoryItem>) => void
}

export function MedicineModal({ isOpen, onClose, medicine, onSave }: MedicineModalProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    unitPrice: '',
    stockQty: '',
    reorderLevel: '',
    description: '',
    dosageForm: '',
    strength: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        genericName: medicine.genericName || '',
        manufacturer: medicine.manufacturer || '',
        category: medicine.category || '',
        unitPrice: medicine.unitPrice?.toString() || '',
        stockQty: medicine.stockQty?.toString() || '',
        reorderLevel: medicine.reorderLevel?.toString() || '',
        description: medicine.description || '',
        dosageForm: medicine.dosageForm || '',
        strength: medicine.strength || ''
      })
    } else {
      // Reset form for new medicine
      setFormData({
        name: '',
        genericName: '',
        manufacturer: '',
        category: '',
        unitPrice: '',
        stockQty: '',
        reorderLevel: '',
        description: '',
        dosageForm: '',
        strength: ''
      })
    }
    setErrors({})
  }, [medicine, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'ওষুধের নাম আবশ্যক'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'ক্যাটেগরি নির্বাচন করুন'
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'প্রস্তুতকারক আবশ্যক'
    }

    if (!formData.unitPrice || isNaN(parseFloat(formData.unitPrice))) {
      newErrors.unitPrice = 'সঠিক দাম লিখুন'
    }

    if (!formData.stockQty || isNaN(parseInt(formData.stockQty))) {
      newErrors.stockQty = 'সঠিক স্টক পরিমাণ লিখুন'
    }

    if (!formData.reorderLevel || isNaN(parseInt(formData.reorderLevel))) {
      newErrors.reorderLevel = 'সঠিক রিঅর্ডার লেভেল লিখুন'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const medicineData: Partial<InventoryItem> = {
      name: formData.name.trim(),
      genericName: formData.genericName.trim(),
      manufacturer: formData.manufacturer.trim(),
      category: formData.category.trim(),
      unitPrice: parseFloat(formData.unitPrice),
      stockQty: parseInt(formData.stockQty),
      reorderLevel: parseInt(formData.reorderLevel),
      description: formData.description.trim(),
      dosageForm: formData.dosageForm.trim(),
      strength: formData.strength.trim(),
      ...(medicine ? { id: medicine.id, sku: medicine.sku } : {
        sku: `MED${Date.now()}`,
        batches: []
      })
    }

    onSave(medicineData)
    onClose()
  }

  const categories = [
    'ট্যাবলেট',
    'ক্যাপসুল',
    'সিরাপ',
    'ইনজেকশন',
    'ড্রপ',
    'ক্রিম',
    'মলম',
    'স্প্রে',
    'অন্যান্য'
  ]

  const dosageForms = [
    'ট্যাবলেট',
    'ক্যাপসুল',
    'সিরাপ',
    'সাসপেনশন',
    'ইনজেকশন',
    'টপিক্যাল',
    'ড্রপ'
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={medicine ? 'ওষুধ সম্পাদনা' : 'নতুন ওষুধ যোগ করুন'}
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Basic Information */}
        <Card className="card-theme border">
          <CardHeader>
            <CardTitle className="text-lg text-theme-foreground flex items-center">
              <Package className="h-5 w-5 mr-2" />
              মৌলিক তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  ওষুধের নাম *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="ওষুধের নাম লিখুন"
                  className={`input-theme ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  জেনেরিক নাম
                </label>
                <Input
                  value={formData.genericName}
                  onChange={(e) => handleInputChange('genericName', e.target.value)}
                  placeholder="জেনেরিক নাম লিখুন"
                  className="input-theme"
                />
              </div>

              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  প্রস্তুতকারক *
                </label>
                <Input
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="কোম্পানির নাম লিখুন"
                  className={`input-theme ${errors.manufacturer ? 'border-red-500' : ''}`}
                />
                {errors.manufacturer && (
                  <p className="text-red-500 text-xs mt-1">{errors.manufacturer}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  ক্যাটেগরি *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme ${errors.category ? 'border-red-500' : ''}`}
                >
                  <option value="">ক্যাটেগরি নির্বাচন করুন</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  ডোজেজ ফর্ম
                </label>
                <select
                  value={formData.dosageForm}
                  onChange={(e) => handleInputChange('dosageForm', e.target.value)}
                  className="w-full px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme"
                >
                  <option value="">নির্বাচন করুন</option>
                  {dosageForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  শক্তি/ডোজ
                </label>
                <Input
                  value={formData.strength}
                  onChange={(e) => handleInputChange('strength', e.target.value)}
                  placeholder="যেমন: 500mg"
                  className="input-theme"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium form-label-theme mb-1">
                বিবরণ
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="ওষুধের বিস্তারিত বিবরণ লিখুন..."
                rows={3}
                className="w-full px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card className="card-theme border">
          <CardHeader>
            <CardTitle className="text-lg text-theme-foreground flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              দাম ও স্টক তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  একক দাম (৳) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                  placeholder="0.00"
                  className={`input-theme ${errors.unitPrice ? 'border-red-500' : ''}`}
                />
                {errors.unitPrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.unitPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  স্ট��� পরিমাণ *
                </label>
                <Input
                  type="number"
                  value={formData.stockQty}
                  onChange={(e) => handleInputChange('stockQty', e.target.value)}
                  placeholder="0"
                  className={`input-theme ${errors.stockQty ? 'border-red-500' : ''}`}
                />
                {errors.stockQty && (
                  <p className="text-red-500 text-xs mt-1">{errors.stockQty}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium form-label-theme mb-1">
                  রিঅর্ডার লেভেল *
                </label>
                <Input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                  placeholder="10"
                  className={`input-theme ${errors.reorderLevel ? 'border-red-500' : ''}`}
                />
                {errors.reorderLevel && (
                  <p className="text-red-500 text-xs mt-1">{errors.reorderLevel}</p>
                )}
              </div>
            </div>
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
            {medicine ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
