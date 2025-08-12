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
        <div className="text-sm text-theme-muted">
          <span>আজ: </span>
          <span className="font-medium text-theme-foreground">১৫ জান���য়ারি, ২০২৪</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className={`theme-transition ${isTransitioning ? 'animate-theme-fade-in' : ''}`}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 text-theme-foreground theme-transition" />
          ) : (
            <Sun className="h-4 w-4 text-theme-foreground theme-transition" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="outline"
          size="icon"
          className="relative theme-transition"
          aria-label="Notifications (3 unread)"
          title="Notifications"
        >
          <Bell className="h-4 w-4 text-theme-foreground" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            3
          </span>
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 theme-transition"
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center theme-transition">
              <span className="text-theme-accent font-medium text-sm">ড</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-theme-foreground">ডা. রহিম উদ্দিন</p>
              <p className="text-xs text-theme-muted">প্রধান চিকিৎসক</p>
            </div>
            <ChevronDown className="h-4 w-4 text-theme-foreground" />
          </Button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 modal-theme rounded-lg z-50 animate-slide-up">
              <div className="p-4 border-b border-theme-default">
                <p className="font-medium text-theme-foreground">ডা. রহিম উদ্দিন</p>
                <p className="text-sm text-theme-muted">rahim@srpharma.com</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-theme-foreground hover-theme-bg rounded-md theme-transition focus-ring">
                  <User className="h-4 w-4 mr-2" />
                  প্রোফাইল
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-theme-foreground hover-theme-bg rounded-md theme-transition focus-ring">
                  <Settings className="h-4 w-4 mr-2" />
                  সেটিংস
                </button>
                <hr className="my-2 border-theme-default" />
                <button className="w-full flex items-center px-3 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-md theme-transition focus-ring">
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
