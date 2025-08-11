'use client'

import { useState } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { adminClinicData, subscriptionPlans, formatCurrency } from '@/lib/subscription-data'
import { Plus, Trash2, Calculator, FileText } from 'lucide-react'

interface ManualInvoiceModalProps {
  clinicId: string
  onClose: () => void
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export function ManualInvoiceModal({ clinicId, onClose }: ManualInvoiceModalProps) {
  const clinic = adminClinicData.find(c => c.id === clinicId)
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'BDT',
    notes: '',
    paymentTerms: '15 দিন'
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: 'মাসিক সাবস্ক্রিপশন ফি',
      quantity: 1,
      rate: 4500,
      amount: 4500
    }
  ])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    }))
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateTax = () => {
    // 0% VAT for now
    return 0
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!invoiceData.invoiceNumber) {
      newErrors.invoiceNumber = 'ইনভয়েস নম্বর প্রয়োজন'
    }

    if (!invoiceData.issueDate) {
      newErrors.issueDate = 'ইস্যু তারিখ প্রয়োজন'
    }

    if (!invoiceData.dueDate) {
      newErrors.dueDate = 'দেয় তারিখ প্রয়োজন'
    }

    if (items.length === 0) {
      newErrors.items = 'কমপক্ষে একটি আইটেম প্রয়োজন'
    }

    items.forEach((item, index) => {
      if (!item.description) {
        newErrors[`item_${index}_description`] = 'বিবরণ প্রয়োজন'
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'পরিমাণ ০ এর বেশি হতে হবে'
      }
      if (item.rate <= 0) {
        newErrors[`item_${index}_rate`] = 'মূ���্য ০ এর বেশি হতে হবে'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateInvoice = () => {
    if (!validateForm()) {
      return
    }

    // In real app, this would call API to create invoice
    const invoicePayload = {
      ...invoiceData,
      clinicId,
      items,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal()
    }

    console.log('Creating invoice:', invoicePayload)
    alert(`ইনভয়েস ${invoiceData.invoiceNumber} সফলভাবে তৈরি হয়েছে!`)
    onClose()
  }

  if (!clinic) {
    return (
      <Modal isOpen={true} onClose={onClose} title="ত্রুটি">
        <div className="text-center py-8">
          <p>ক্লিনিক পাওয়া যায়নি</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="ম্যানুয়াল ইনভয়েস তৈরি করুন"
      size="xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Client Info */}
        <Card className="p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-2">ক্লায়েন্ট তথ্য</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">{clinic.name}</p>
              <p className="text-gray-600">{clinic.email}</p>
            </div>
            <div>
              <p className="text-gray-600">বর্তমান প্ল্যান: {subscriptionPlans.find(p => p.id === clinic.planId)?.name}</p>
              <p className="text-gray-600">স্ট্যাটাস: {clinic.status}</p>
            </div>
          </div>
        </Card>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ইনভয়েস নম্বর *
            </label>
            <Input
              value={invoiceData.invoiceNumber}
              onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
              className={errors.invoiceNumber ? 'border-red-500' : ''}
            />
            {errors.invoiceNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ইস্যু তারিখ *
            </label>
            <Input
              type="date"
              value={invoiceData.issueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, issueDate: e.target.value })}
              className={errors.issueDate ? 'border-red-500' : ''}
            />
            {errors.issueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.issueDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              দেয় তারিখ *
            </label>
            <Input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
              className={errors.dueDate ? 'border-red-500' : ''}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              মুদ্রা
            </label>
            <Select
              value={invoiceData.currency}
              onChange={(e) => setInvoiceData({ ...invoiceData, currency: e.target.value })}
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
            </Select>
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">ইনভয়েস আইটেম</h4>
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              আইটেম যোগ করুন
            </Button>
          </div>

          {errors.items && (
            <p className="text-red-500 text-sm mb-4">{errors.items}</p>
          )}

          <div className="space-y-3">
            {items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      বিবরণ *
                    </label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="সেবার বিবরণ..."
                      className={errors[`item_${index}_description`] ? 'border-red-500' : ''}
                    />
                    {errors[`item_${index}_description`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_description`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      পরিমাণ *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className={errors[`item_${index}_quantity`] ? 'border-red-500' : ''}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      মূল্য *
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className={errors[`item_${index}_rate`] ? 'border-red-500' : ''}
                    />
                    {errors[`item_${index}_rate`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_rate`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      মোট
                    </label>
                    <div className="p-2 bg-gray-50 rounded text-center font-medium">
                      {formatCurrency(item.amount, invoiceData.currency)}
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Totals */}
        <Card className="p-4 bg-gray-50">
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span>সাবটোটাল:</span>
                <span className="font-medium">
                  {formatCurrency(calculateSubtotal(), invoiceData.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT (0%):</span>
                <span className="font-medium">
                  {formatCurrency(calculateTax(), invoiceData.currency)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>মোট:</span>
                <span className="text-blue-600">
                  {formatCurrency(calculateTotal(), invoiceData.currency)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পেমেন্ট শর্তাবলী
            </label>
            <Select
              value={invoiceData.paymentTerms}
              onChange={(e) => setInvoiceData({ ...invoiceData, paymentTerms: e.target.value })}
            >
              <option value="7 দিন">৭ দিন</option>
              <option value="15 দিন">১৫ দিন</option>
              <option value="30 দিন">৩০ দিন</option>
              <option value="45 দিন">৪৫ দিন</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              অতিরিক্ত নোট
            </label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg resize-none"
              rows={2}
              placeholder="অতিরিক্ত তথ্য বা নির্দেশনা..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            বাতিল
          </Button>
          <Button onClick={handleCreateInvoice} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <FileText className="h-4 w-4 mr-2" />
            ইনভয়েস তৈরি করুন
          </Button>
        </div>
      </div>
    </Modal>
  )
}
