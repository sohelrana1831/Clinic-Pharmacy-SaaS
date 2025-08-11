'use client'

import { useState } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InventoryItem, Batch, formatCurrency } from '@/lib/inventory-data'
import { Package, Calendar, DollarSign, Hash } from 'lucide-react'

interface AddStockModalProps {
  isOpen: boolean
  onClose: () => void
  item: InventoryItem | null
  onSave: (itemId: string, batch: Omit<Batch, 'id'>) => void
}

export function AddStockModal({ isOpen, onClose, item, onSave }: AddStockModalProps) {
  const [formData, setFormData] = useState({
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    purchasePrice: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'ব্যাচ নম্বর প্রয়োজন'
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'মেয়াদের তারিখ প্রয়োজন'
    } else {
      const expiryDate = new Date(formData.expiryDate)
      const today = new Date()
      
      if (expiryDate <= today) {
        newErrors.expiryDate = 'মেয়াদের তারিখ ভবিষ্যতের হতে হবে'
      }
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'বৈধ পরিমাণ দিন'
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'বৈধ ক্রয়মূল্য দিন'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!item || !validateForm()) return

    const batch: Omit<Batch, 'id'> = {
      batchNumber: formData.batchNumber.trim(),
      expiryDate: formData.expiryDate,
      quantity: parseInt(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      purchaseDate: new Date().toISOString().split('T')[0],
      remaining: parseInt(formData.quantity)
    }

    onSave(item.id, batch)
    
    // Reset form
    setFormData({
      batchNumber: '',
      expiryDate: '',
      quantity: '',
      purchasePrice: ''
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getMinExpiryDate = () => {
    const today = new Date()
    today.setDate(today.getDate() + 30) // Minimum 30 days from today
    return today.toISOString().split('T')[0]
  }

  const calculateProfitMargin = () => {
    if (!formData.purchasePrice || !item) return 0
    const purchasePrice = parseFloat(formData.purchasePrice)
    const profit = item.unitPrice - purchasePrice
    return purchasePrice > 0 ? ((profit / purchasePrice) * 100) : 0
  }

  if (!item) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`স্টক যোগ করুন - ${item.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-600">SKU: {item.sku} • বর্তমান স্টক: {item.stockQty}</p>
              <p className="text-sm text-gray-600">বিক্রয় মূল্য: {formatCurrency(item.unitPrice)}</p>
            </div>
          </div>
        </div>

        {/* Batch Number */}
        <div>
          <Label htmlFor="batchNumber" className="flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            ব্যাচ নম্বর *
          </Label>
          <Input
            id="batchNumber"
            value={formData.batchNumber}
            onChange={(e) => handleChange('batchNumber', e.target.value)}
            placeholder="উদাহরণ: PAR2024001"
            className={errors.batchNumber ? 'border-red-500' : ''}
          />
          {errors.batchNumber && <p className="text-sm text-red-500 mt-1">{errors.batchNumber}</p>}
        </div>

        {/* Expiry Date */}
        <div>
          <Label htmlFor="expiryDate" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            মেয়াদের তারিখ *
          </Label>
          <Input
            id="expiryDate"
            type="date"
            min={getMinExpiryDate()}
            value={formData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            className={errors.expiryDate ? 'border-red-500' : ''}
          />
          {errors.expiryDate && <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>}
        </div>

        {/* Quantity and Purchase Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              পরিমাণ *
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="১০০"
              className={errors.quantity ? 'border-red-500' : ''}
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <Label htmlFor="purchasePrice" className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              ক্রয়মূল্য (প্রতি ইউনিট) *
            </Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.purchasePrice}
              onChange={(e) => handleChange('purchasePrice', e.target.value)}
              placeholder="০.০০"
              className={errors.purchasePrice ? 'border-red-500' : ''}
            />
            {errors.purchasePrice && <p className="text-sm text-red-500 mt-1">{errors.purchasePrice}</p>}
          </div>
        </div>

        {/* Calculation Summary */}
        {formData.quantity && formData.purchasePrice && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">ক্রয় সারাংশ</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">মোট পরিমাণ:</p>
                <p className="font-medium">{formData.quantity} ইউনিট</p>
              </div>
              <div>
                <p className="text-gray-600">মোট ক্রয়মূ���্য:</p>
                <p className="font-medium">
                  {formatCurrency(parseInt(formData.quantity || '0') * parseFloat(formData.purchasePrice || '0'))}
                </p>
              </div>
              <div>
                <p className="text-gray-600">প্রফিট মার্জিন:</p>
                <p className={`font-medium ${calculateProfitMargin() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateProfitMargin().toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-600">স্টক পরে:</p>
                <p className="font-medium">{item.stockQty + parseInt(formData.quantity || '0')} ইউনিট</p>
              </div>
            </div>
          </div>
        )}

        {/* Existing Batches */}
        {item.batches.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">বিদ্যমান ব্যাচসমূহ</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {item.batches.map((batch, index) => (
                <div key={batch.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <span className="font-medium">{batch.batchNumber}</span>
                    <span className="text-gray-500 ml-2">মেয়াদ: {new Date(batch.expiryDate).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{batch.remaining} ইউনিট</div>
                    <div className="text-gray-500">{formatCurrency(batch.purchasePrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
            স্টক যোগ করুন
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            বাতিল
          </Button>
        </div>
      </form>
    </Modal>
  )
}
