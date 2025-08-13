'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  AlertTriangle
} from 'lucide-react'

export default function SettingsMenuPage() {
  const { t } = useTranslation()
  const [settingsData, setSettingsData] = useState({
    clinicName: 'SR Pharma',
    clinicAddress: 'ধানমন্ডি, ঢাকা',
    clinicPhone: '01712345678',
    clinicEmail: 'info@srpharma.com',
    notifications: {
      email: true,
      sms: true,
      lowStock: true,
      appointments: true
    },
    system: {
      autoBackup: true,
      maintenanceMode: false,
      debugMode: false
    }
  })

  const handleSave = () => {
    // Save settings logic
    console.log('Settings saved:', settingsData)
  }

  const settingsSections = [
    {
      id: 'general',
      title: 'সাধারণ সেটিংস',
      icon: <Settings className="h-5 w-5" />,
      description: 'ক্লিনিকের মৌলিক তথ্য ও সেটিংস'
    },
    {
      id: 'notifications',
      title: 'নোটিফিকেশন',
      icon: <Bell className="h-5 w-5" />,
      description: 'ইমেইল, SMS এবং অ্যাপ নোটিফিকেশন সেটিংস'
    },
    {
      id: 'security',
      title: 'নিরাপত্তা',
      icon: <Shield className="h-5 w-5" />,
      description: 'পাসওয়ার্ড ও অ্যাক্সেস নিয়ন্ত্রণ'
    },
    {
      id: 'backup',
      title: 'ব্যাকআপ ও রিস্টোর',
      icon: <Database className="h-5 w-5" />,
      description: 'ডেটা ব্যাকআপ ও পুনরুদ্ধার সেটিংস'
    },
    {
      id: 'language',
      title: 'ভাষা ও স্থানীয়করণ',
      icon: <Globe className="h-5 w-5" />,
      description: 'ভাষা, সময় অঞ্চল ও মুদ্রা সেটিংস'
    },
    {
      id: 'appearance',
      title: 'চেহারা ও থিম',
      icon: <Palette className="h-5 w-5" />,
      description: 'লাইট/ডার্ক থিম ও কাস্টমাইজেশন'
    },
    {
      id: 'users',
      title: 'ব্যবহারকারী ব্যবস্থাপনা',
      icon: <Users className="h-5 w-5" />,
      description: 'কর্মচারী ও অ্যাক্সেস পারমিশন'
    },
    {
      id: 'api',
      title: 'API ও ইন্টিগ্রেশন',
      icon: <Key className="h-5 w-5" />,
      description: 'থার্ড-পার্টি সার্ভিস ইন্টিগ্রেশন'
    }
  ]

  return (
    <div className="min-h-screen bg-theme-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />
        
        {/* Settings Content */}
        <main className="flex-1 p-6 bg-theme-background">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-theme-foreground">{t('navigation.settings')}</h1>
                <p className="text-theme-muted">সিস্টেম সেটিংস ও কনফিগারেশন পরিচালনা করুন</p>
              </div>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                সেটিংস সংরক্ষণ
              </Button>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsSections.map((section) => (
                <Card key={section.id} className="card-theme border hover:shadow-md theme-transition cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <div className="text-blue-600 dark:text-blue-400">
                          {section.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-theme-foreground">{section.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-theme-muted">{section.description}</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      সেটিংস দেখুন
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <Card className="card-theme border">
                <CardHeader>
                  <CardTitle className="text-theme-foreground flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    ক্লিনিকের তথ্য
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium form-label-theme mb-1">
                      ক্লিনিকের নাম
                    </label>
                    <Input
                      value={settingsData.clinicName}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        clinicName: e.target.value
                      }))}
                      className="input-theme"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium form-label-theme mb-1">
                      ঠিকানা
                    </label>
                    <Input
                      value={settingsData.clinicAddress}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        clinicAddress: e.target.value
                      }))}
                      className="input-theme"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium form-label-theme mb-1">
                        ফোন
                      </label>
                      <Input
                        value={settingsData.clinicPhone}
                        onChange={(e) => setSettingsData(prev => ({
                          ...prev,
                          clinicPhone: e.target.value
                        }))}
                        className="input-theme"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium form-label-theme mb-1">
                        ইমেইল
                      </label>
                      <Input
                        value={settingsData.clinicEmail}
                        onChange={(e) => setSettingsData(prev => ({
                          ...prev,
                          clinicEmail: e.target.value
                        }))}
                        className="input-theme"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="card-theme border">
                <CardHeader>
                  <CardTitle className="text-theme-foreground flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    সিস্টেম স্ট্যাটাস
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    সিস্টেম রিফ্রেশ
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="card-theme border">
              <CardHeader>
                <CardTitle className="text-theme-foreground">সাম্প্রতিক কার্যক্রম</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'ব্যাকআপ সম্পন্ন', time: '২ ঘণ্টা আগে', status: 'success' },
                    { action: 'নতুন ব্যবহারকারী যোগ', time: '৪ ঘণ্টা আগে', status: 'info' },
                    { action: 'সিস্টেম সেটিংস পরিবর্তন', time: '১ দিন আগে', status: 'warning' },
                    { action: 'ডেটাবেস অপ্টিমাইজেশন', time: '২ দিন আগে', status: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover-theme-bg">
                      <div>
                        <p className="text-sm font-medium text-theme-foreground">{activity.action}</p>
                        <p className="text-xs text-theme-muted">{activity.time}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
