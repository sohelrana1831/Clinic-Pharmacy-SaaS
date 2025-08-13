'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useTheme } from '@/lib/theme-context'
import { LanguageSelector } from '@/components/ui/language-selector'
import { 
  Settings,
  Bell,
  Shield,
  Database,
  Globe,
  Palette,
  Users,
  Key,
  Save,
  RefreshCw,
  AlertTriangle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

export default function DashboardSettingsPage() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [settingsData, setSettingsData] = useState({
    clinicName: 'SR Pharma',
    clinicAddress: 'ধানমন্ডি, ঢাকা',
    clinicPhone: '01712345678',
    clinicEmail: 'info@srpharma.com',
    language: 'bn',
    timezone: 'Asia/Dhaka',
    currency: 'BDT',
    notifications: {
      email: true,
      sms: true,
      lowStock: true,
      appointments: true,
      reports: false
    },
    system: {
      autoBackup: true,
      maintenanceMode: false,
      debugMode: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  })

  const handleSave = () => {
    // Save settings logic
    console.log('Settings saved:', settingsData)
    // Show success message
    alert('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!')
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const themeOptions = [
    { value: 'light', label: 'লাইট থিম', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'ডার্ক থিম', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'সিস্টেম', icon: <Monitor className="h-4 w-4" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">সেটিংস</h1>
          <p className="text-gray-600 dark:text-gray-400">সিস্টেম সেটিংস ও কনফিগারেশন পরিচালনা করুন</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          সেটিংস সংরক্ষণ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              সাধারণ সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clinicName">
                ক্লিনিকের নাম <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clinicName"
                value={settingsData.clinicName}
                onChange={(e) => setSettingsData(prev => ({
                  ...prev,
                  clinicName: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="clinicAddress">
                ঠিকানা <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clinicAddress"
                value={settingsData.clinicAddress}
                onChange={(e) => setSettingsData(prev => ({
                  ...prev,
                  clinicAddress: e.target.value
                }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clinicPhone">
                  ফোন <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clinicPhone"
                  value={settingsData.clinicPhone}
                  onChange={(e) => setSettingsData(prev => ({
                    ...prev,
                    clinicPhone: e.target.value
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="clinicEmail">
                  ইমেইল <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clinicEmail"
                  type="email"
                  value={settingsData.clinicEmail}
                  onChange={(e) => setSettingsData(prev => ({
                    ...prev,
                    clinicEmail: e.target.value
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              চেহারা ও থিম
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>থিম নির্বাচন করুন</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {themeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      theme === option.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => option.value !== 'system' && toggleTheme()}
                  >
                    {option.icon}
                    <span className="ml-3 text-sm font-medium">{option.label}</span>
                    {theme === option.value && (
                      <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>ভাষা নির্বাচন করুন</Label>
              <div className="mt-2">
                <LanguageSelector />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              ভাষা ও স্থানীয়��রণ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">সময় অঞ্চল</Label>
              <Select
                id="timezone"
                value={settingsData.timezone}
                onChange={(e) => setSettingsData(prev => ({
                  ...prev,
                  timezone: e.target.value
                }))}
              >
                <option value="Asia/Dhaka">এশিয়া/ঢাকা (GMT+6)</option>
                <option value="Asia/Kolkata">এশিয়া/কলকাতা (GMT+5:30)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">মুদ্রা</Label>
              <Select
                id="currency"
                value={settingsData.currency}
                onChange={(e) => setSettingsData(prev => ({
                  ...prev,
                  currency: e.target.value
                }))}
              >
                <option value="BDT">বাংলাদেশী টাকা (৳)</option>
                <option value="USD">মার্কিন ডলার ($)</option>
                <option value="EUR">ইউরো (€)</option>
                <option value="GBP">ব্রিটিশ পাউন্ড (£)</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              নোটিফিকেশন সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">ইমেইল নোটিফিকেশন</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান</p>
                </div>
                <Checkbox
                  checked={settingsData.notifications.email}
                  onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">SMS নোটিফিকেশন</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">জরুরি বিষয়ের জন্য SMS পান</p>
                </div>
                <Checkbox
                  checked={settingsData.notifications.sms}
                  onChange={(e) => handleInputChange('notifications', 'sms', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">স্টক শেষ হওয়ার সতর্কতা</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ওষুধের স্টক কম হলে সতর্কতা</p>
                </div>
                <Checkbox
                  checked={settingsData.notifications.lowStock}
                  onChange={(e) => handleInputChange('notifications', 'lowStock', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">অ্যাপয়েন্টমেন্ট রিমাইন্ডার</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">আসন্ন অ্যাপয়েন্টমেন্টের জন্য রিমাইন্ডার</p>
                </div>
                <Checkbox
                  checked={settingsData.notifications.appointments}
                  onChange={(e) => handleInputChange('notifications', 'appointments', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">দৈনিক রিপোর্ট</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">দৈনিক কার্যক্রমের সারসংক্ষেপ</p>
                </div>
                <Checkbox
                  checked={settingsData.notifications.reports}
                  onChange={(e) => handleInputChange('notifications', 'reports', e.target.checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              নিরাপত্তা সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">দুই-ধাপের প্রমাণীকরণ</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">অতিরিক্ত নিরাপত্তার জন্য 2FA সক্রিয় করুন</p>
              </div>
              <Checkbox
                checked={settingsData.security.twoFactorAuth}
                onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">সেশন টাইমআউট (মিনিট)</Label>
              <Select
                id="sessionTimeout"
                value={settingsData.security.sessionTimeout.toString()}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              >
                <option value="15">১৫ মিনিট</option>
                <option value="30">৩০ মিনিট</option>
                <option value="60">১ ঘণ্টা</option>
                <option value="120">২ ঘণ্টা</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="passwordExpiry">পাসওয়ার্ড মেয়াদ (দিন)</Label>
              <Select
                id="passwordExpiry"
                value={settingsData.security.passwordExpiry.toString()}
                onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value))}
              >
                <option value="30">৩০ দিন</option>
                <option value="60">৬০ দিন</option>
                <option value="90">৯০ দিন</option>
                <option value="180">১৮০ দিন</option>
                <option value="365">১ বছর</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              সিস্টেম সেটিংস
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">স্বয়ংক্রিয় ব্যাকআপ</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">প্রতিদিন স্বয়ংক্রিয় ব্যাকআপ নিন</p>
              </div>
              <Checkbox
                checked={settingsData.system.autoBackup}
                onChange={(e) => handleInputChange('system', 'autoBackup', e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">রক্ষণাবেক্ষণ মোড</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">সিস্টেম আপডেটের সময় সক্রিয় করুন</p>
              </div>
              <Checkbox
                checked={settingsData.system.maintenanceMode}
                onChange={(e) => handleInputChange('system', 'maintenanceMode', e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">ডিবাগ মোড</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ডেভেলপারদের জন্য ডিবাগ তথ্য দেখান</p>
              </div>
              <Checkbox
                checked={settingsData.system.debugMode}
                onChange={(e) => handleInputChange('system', 'debugMode', e.target.checked)}
              />
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                ডেটাবেস অপ্টিমাইজ করুন
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            সিস্টেম স্ট্যাটাস
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">ডেটাবেস সংযোগ</p>
                <p className="text-xs text-green-600 dark:text-green-400">সক্রিয়</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">ব্যাকআপ সিস্টেম</p>
                <p className="text-xs text-green-600 dark:text-green-400">শেষ ব্যাকআপ: ২ ঘণ্টা আগে</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">সিস্টেম আপডেট</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">১টি আপডেট উপলব্ধ</p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
