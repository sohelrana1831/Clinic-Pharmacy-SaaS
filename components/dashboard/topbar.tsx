'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { 
  Search, 
  Bell, 
  ChevronDown, 
  MapPin,
  LogOut,
  User,
  Settings
} from 'lucide-react'

export function Topbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState('sr-pharma')

  const clinics = [
    { value: 'sr-pharma', label: 'SR Pharma - ধানমন্ডি' },
    { value: 'sr-pharma-2', label: 'SR Pharma - উত্তরা' },
    { value: 'sr-pharma-3', label: 'SR Pharma - গুলশান' }
  ]

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Clinic Selector */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <Select 
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="border-0 bg-transparent font-medium text-gray-900"
          >
            {clinics.map((clinic) => (
              <option key={clinic.value} value={clinic.value}>
                {clinic.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="রোগী, ওষুধ বা ডাক্তার খুঁজুন..."
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Current Date */}
        <div className="text-sm text-gray-600">
          <span>আজ: </span>
          <span className="font-medium">১৫ জানুয়ারি, ২০২৪</span>
        </div>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">ড</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">ডা. রহিম উদ্দিন</p>
              <p className="text-xs text-gray-500">প্রধান চিকিৎসক</p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100">
                <p className="font-medium">ডা. রহিম উদ্দিন</p>
                <p className="text-sm text-gray-500">rahim@srpharma.com</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <User className="h-4 w-4 mr-2" />
                  প্রোফাইল
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                  <Settings className="h-4 w-4 mr-2" />
                  সেটিংস
                </button>
                <hr className="my-2" />
                <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  <LogOut className="h-4 w-4 mr-2" />
                  লগআউট
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
