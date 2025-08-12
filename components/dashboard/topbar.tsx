'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useTheme } from '@/lib/theme-context'
import {
  Search,
  Bell,
  ChevronDown,
  MapPin,
  LogOut,
  User,
  Settings,
  Sun,
  Moon
} from 'lucide-react'

export function Topbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState('sr-pharma')
  const { theme, toggleTheme, colors, isTransitioning } = useTheme()

  const clinics = [
    { value: 'sr-pharma', label: 'SR Pharma - ধানমন্ডি' },
    { value: 'sr-pharma-2', label: 'SR Pharma - উত্তরা' },
    { value: 'sr-pharma-3', label: 'SR Pharma - গুলশান' }
  ]

  return (
    <header className="h-16 bg-theme-card border-b border-theme-default px-6 flex items-center justify-between theme-transition">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Clinic Selector */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-theme-accent" />
          <Select
            value={selectedClinic}
            onChange={(e) => setSelectedClinic(e.target.value)}
            className="border-0 bg-transparent font-medium text-theme-foreground theme-transition focus-ring"
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-muted" />
          <Input
            type="text"
            placeholder="রোগী, ওষুধ বা ডাক্তার খুঁজুন..."
            className="pl-10 w-80 input-theme"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Current Date */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span>আজ: </span>
          <span className="font-medium">১৫ জানুয়ারি, ২০২৪</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="relative border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
          <Bell className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 dark:bg-red-400 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">ড</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">ডা. রহিম উদ্দিন</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">প্রধান চিকিৎসক</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-gray-100">ডা. রহিম উদ্দিন</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">rahim@srpharma.com</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <User className="h-4 w-4 mr-2" />
                  প্রোফাইল
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <Settings className="h-4 w-4 mr-2" />
                  সেটিংস
                </button>
                <hr className="my-2 border-gray-200 dark:border-gray-600" />
                <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
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
