'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useApiMutation } from '@/hooks/useApi'
import { usersApi, User } from '@/lib/api'
import { Save, X, Eye, EyeOff } from 'lucide-react'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
}

interface UserFormData {
  name: string
  email: string
  phone: string
  role: string
  password: string
}

export function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate, loading, error, success } = useApiMutation()

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        password: ''
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'staff',
        password: ''
      })
    }
    setErrors({})
  }, [user, isOpen])

  useEffect(() => {
    if (success) {
      onClose()
    }
  }, [success, onClose])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'নাম প্রয়োজন'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'ইমেইল প্রয়োজন'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন'
    }

    if (!formData.role) {
      newErrors.role = 'ভূমিকা নির্বাচন করুন'
    }

    if (!user && !formData.password) {
      newErrors.password = 'পাসওয়ার্ড প্রয়োজ��'
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (user) {
        // Update user
        const updateData = { ...formData }
        if (!updateData.password) {
          delete updateData.password
        }
        await mutate(() => usersApi.updateUser(user.id, updateData))
      } else {
        // Create user
        await mutate(() => usersApi.createUser(formData))
      }
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'ব্যবহারকারী সম্পাদনা' : 'নতুন ব্যবহারকারী'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">নাম *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ব্যবহারকারীর নাম"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">ইমেইল *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="user@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">ফোন নম্বর</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="01XXXXXXXXX"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Role */}
        <div>
          <Label htmlFor="role">ভূমিকা *</Label>
          <Select
            id="role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className={errors.role ? 'border-red-500' : ''}
          >
            <option value="staff">কর্মী</option>
            <option value="doctor">ডাক্তার</option>
            <option value="admin">অ্যাডমিন</option>
          </Select>
          {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">
            পাসওয়ার্ড {user ? '(পরিবর্তন করতে চাইলে)' : '*'}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={user ? 'নতুন পাসওয়ার্ড' : 'পাসওয়ার্ড'}
              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
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
            {user ? 'আপডেট করুন' : 'তৈরি করুন'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
