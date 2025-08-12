'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 backdrop-theme flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-theme rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-theme-default">
          <h2 id="modal-title" className="text-xl font-semibold text-theme-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover-theme-bg rounded-lg theme-transition focus-ring"
            aria-label="Close modal"
            type="button"
          >
            <X className="h-5 w-5 text-theme-foreground" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export function NewPatientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    address: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('New patient:', formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="নতুন রোগী যোগ করুন">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">রোগীর নাম *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="পূর্ণ নাম লিখুন"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">মোবাইল নম্বর *</Label>
          <Input
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="০১৭xxxxxxxx"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">বয়স</Label>
            <Input
              id="age"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              placeholder="বছর"
            />
          </div>
          <div>
            <Label htmlFor="gender">লিঙ্গ</Label>
            <Select
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">নির্বাচন করুন</option>
              <option value="male">পুরুষ</option>
              <option value="female">মহিলা</option>
              <option value="other">অন্যান্য</option>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="address">ঠিকানা</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="সম্পূর্ণ ঠিকানা"
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            সংরক্ষণ করুন
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            বাতিল
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function NewAppointmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    date: '',
    time: '',
    type: '',
    doctor: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New appointment:', formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="নতুন অ্যাপয়েন্টমেন্ট">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="patientName">রোগীর নাম *</Label>
          <Input
            id="patientName"
            required
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
            placeholder="নাম লিখুন বা খুঁজু��"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">মোবাইল নম্বর</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="০১৭xxxxxxxx"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">তারিখ *</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="time">সময় *</Label>
            <Select
              id="time"
              required
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            >
              <option value="">সময় নির্বাচন</option>
              <option value="09:00">০৯:০০</option>
              <option value="09:30">০৯:৩০</option>
              <option value="10:00">১০:০০</option>
              <option value="10:30">১০:৩০</option>
              <option value="11:00">১১:০০</option>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="type">অ্যাপয়েন্টমেন্টের ধরন</Label>
          <Select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">নির্বাচন করুন</option>
            <option value="checkup">নিয়মিত চেকআপ</option>
            <option value="followup">ফলোআপ</option>
            <option value="consultation">পরামর্শ</option>
            <option value="emergency">জরুরি</option>
          </Select>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            নিশ্চিত কর��ন
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            বাতিল
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function NewSaleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    customerName: '',
    medicine: '',
    quantity: '',
    price: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('New sale:', formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="নতুন বিক্রয়">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="customerName">ক্রেতার নাম</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
            placeholder="নাম (ঐচ্ছিক)"
          />
        </div>
        
        <div>
          <Label htmlFor="medicine">ওষুধের নাম *</Label>
          <Input
            id="medicine"
            required
            value={formData.medicine}
            onChange={(e) => setFormData(prev => ({ ...prev, medicine: e.target.value }))}
            placeholder="ওষুধ খুঁজুন"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">পরিমাণ *</Label>
            <Input
              id="quantity"
              required
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="১"
            />
          </div>
          <div>
            <Label htmlFor="price">মূল্য (৳)</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="০"
              readOnly
            />
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
            বিক্রয় সম্পন্ন
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            বাতিল
          </Button>
        </div>
      </form>
    </Modal>
  )
}
