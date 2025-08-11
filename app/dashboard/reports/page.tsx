'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Pill, 
  Users,
  Download,
  FileText,
  Calendar,
  Filter,
  DollarSign
} from 'lucide-react'

// Sample data for reports
const dailySalesData = [
  { date: '2024-01-15', sales: 15500, transactions: 45 },
  { date: '2024-01-16', sales: 18200, transactions: 52 },
  { date: '2024-01-17', sales: 21800, transactions: 68 },
  { date: '2024-01-18', sales: 19400, transactions: 58 },
  { date: '2024-01-19', sales: 23600, transactions: 72 },
  { date: '2024-01-20', sales: 17900, transactions: 49 },
  { date: '2024-01-21', sales: 26300, transactions: 81 }
]

const monthlyRevenueData = [
  { month: 'জানুয়ারি', revenue: 450000, growth: 12.5 },
  { month: 'ফেব্রুয়ারি', revenue: 520000, growth: 15.6 },
  { month: 'মার্চ', revenue: 480000, growth: -7.7 },
  { month: 'এপ্রিল', revenue: 610000, growth: 27.1 },
  { month: 'মে', revenue: 580000, growth: -4.9 },
  { month: 'জুন', revenue: 675000, growth: 16.4 }
]

const topMedicinesData = [
  { name: 'প্যারাসিটামল ৫০০মিগ্রা', sold: 450, revenue: 13500, category: 'ব্যথানাশক' },
  { name: 'অ্যামোক্সিসিলিন ক্যাপসুল', sold: 320, revenue: 19200, category: 'অ্যান্টিবায়োটিক' },
  { name: 'ওমিপ্রাজল ২০মিগ্রা', sold: 280, revenue: 16800, category: 'গ্যাস্ট্রিক' },
  { name: 'মেটফরমিন ৫০০মিগ্রা', sold: 250, revenue: 12500, category: 'ডায়াবেটিস' },
  { name: 'সালবুটামল ইনহেলার', sold: 180, revenue: 21600, category: 'শ্বাসকষ্ট' }
]

const patientGrowthData = [
  { month: 'জানুয়ারি', newPatients: 125, totalPatients: 1250, retention: 92 },
  { month: 'ফেব্রুয়ারি', newPatients: 145, totalPatients: 1395, retention: 94 },
  { month: 'মার্চ', newPatients: 160, totalPatients: 1555, retention: 91 },
  { month: 'এপ্রিল', newPatients: 180, totalPatients: 1735, retention: 95 },
  { month: 'মে', newPatients: 155, totalPatients: 1890, retention: 93 },
  { month: 'জুন', newPatients: 175, totalPatients: 2065, retention: 96 }
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-06-30' })
  const [selectedDoctor, setSelectedDoctor] = useState('সকল ডাক্তার')
  const [selectedBranch, setSelectedBranch] = useState('সকল শাখা')

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header] || '').join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
  }

  const exportToPDF = (reportName: string) => {
    // In a real app, this would generate a PDF report
    alert(`PDF রিপোর্ট তৈরি করা হচ্ছে: ${reportName}`)
  }

  const ChartPlaceholder = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-blue-300">
      <BarChart3 className="h-12 w-12 text-blue-400 mb-2" />
      <p className="text-blue-600 font-medium">{title}</p>
      <p className="text-sm text-blue-500 mt-1">Chart will render here</p>
      {children}
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">রিপোর্ট ও বিশ্লেষণ</h1>
          <p className="text-gray-600 mt-1">বিক্রয়, রোগী এবং ব্যবসায়িক পারফরম্যান্স রিপোর্ট</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">ফিল্টার সক্রিয়</span>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            ফিল্টার নিয়ন্ত্রণ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ থেকে</label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">তারিখ পর্যন্ত</label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">���াক্তার নির্বাচন</label>
              <Select
                value={selectedDoctor}
                onValueChange={setSelectedDoctor}
              >
                <option value="সকল ডাক্তার">সকল ডাক্তার</option>
                <option value="ডা. রহিম উদ্দিন">ডা. রহিম উদ্দিন</option>
                <option value="ডা. ফাতেমা খাতুন">ডা. ফাতেমা খাতুন</option>
                <option value="ডা. করিম হোসেন">ডা. করিম হোসেন</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">শাখা নির্বাচন</label>
              <Select
                value={selectedBranch}
                onValueChange={setSelectedBranch}
              >
                <option value="সকল শাখা">সকল শাখা</option>
                <option value="ঢাকা মূল শাখা">ঢাকা মূল শাখা</option>
                <option value="চট্টগ্রাম শাখা">চট্টগ্রাম শাখা</option>
                <option value="সিলেট শাখা">সিলেট শাখা</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Sales Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              দৈনিক বিক্রয় রিপোর্ট
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">গত ৭ দিনের বিক্রয় পরিসংখ্যান</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(dailySalesData, 'daily-sales', ['date', 'sales', 'transactions'])}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF('দৈনিক বিক্রয় রিপোর্ট')}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="দৈনিক বিক্রয় চার্ট">
              <div className="mt-4 text-xs text-blue-500">
                Bar chart showing daily sales (BDT)
              </div>
            </ChartPlaceholder>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">সাম্প্রতিক বিক্রয়</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dailySalesData.map((day, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{day.date}</p>
                      <p className="text-sm text-gray-600">{day.transactions} লেনদেন</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">৳{day.sales.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue Graph */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              মাসিক আয়ের গ্রাফ
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">গত ৬ মাসের আয় এবং বৃদ্ধির হার</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(monthlyRevenueData, 'monthly-revenue', ['month', 'revenue', 'growth'])}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF('মাসিক আয়ের রিপোর্ট')}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartPlaceholder title="মাসিক আয়ের ট্রেন্ড">
                <div className="mt-4 text-xs text-blue-500">
                  Line/Area chart showing monthly revenue trends
                </div>
              </ChartPlaceholder>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">মাসিক পারফরম্যান্স</h4>
              <div className="space-y-2">
                {monthlyRevenueData.slice(-3).map((month, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{month.month}</p>
                      <span className={`text-sm font-medium ${month.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {month.growth > 0 ? '+' : ''}{month.growth}%
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">৳{month.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Selling Medicines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              সর্বাধিক বিক্রিত ওষুধ
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">বেস্ট সেলিং মেডিসিন এবং আয়</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(topMedicinesData, 'top-medicines', ['name', 'sold', 'revenue', 'category'])}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF('জনপ্রিয় ওষুধের রিপোর্ট')}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="টপ মেডিসিন চার্ট">
              <div className="mt-4 text-xs text-blue-500">
                Horizontal bar chart showing top selling medicines
              </div>
            </ChartPlaceholder>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">বিস্তারিত তালিকা</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {topMedicinesData.map((medicine, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{medicine.name}</p>
                        <p className="text-xs text-gray-600">{medicine.category}</p>
                      </div>
                      <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">{medicine.sold} বিক্রি</span>
                      <span className="font-medium text-green-600">৳{medicine.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Growth */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              রোগী বৃদ্ধির পরিসংখ্যান
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">নতুন রোগী নিবন্ধন এবং ধরে রাখার হার</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(patientGrowthData, 'patient-growth', ['month', 'newPatients', 'totalPatients', 'retention'])}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF('রোগী বৃদ্ধির রিপোর্ট')}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartPlaceholder title="রোগী বৃদ্ধির ট্রেন্ড">
                <div className="mt-4 text-xs text-blue-500">
                  Combined chart showing new patients vs retention rate
                </div>
              </ChartPlaceholder>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">বর্তমান পরিসংখ্যান</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-emerald-600">মোট রোগী</p>
                    <p className="text-xl font-bold text-emerald-800">2,065</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">এ মাসে নতুন</p>
                    <p className="text-xl font-bold text-emerald-800">175</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600">ধরে রাখার হার</p>
                    <p className="text-xl font-bold text-emerald-800">96%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSV Export Headers Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            CSV রপ্তানি কলাম হেডার
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-800 mb-2">দৈনিক বিক্রয়</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• date (তারিখ)</li>
                <li>• sales (বিক্রয় টাকা)</li>
                <li>• transactions (লেনদেন সংখ্যা)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-2">মাসিক আয়</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• month (মাস)</li>
                <li>• revenue (আয়)</li>
                <li>• growth (বৃদ্ধির হার %)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-2">জনপ্রিয় ওষুধ</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• name (ওষুধের নাম)</li>
                <li>• sold (বিক্রিত সংখ্যা)</li>
                <li>• revenue (আয়)</li>
                <li>• category (ক্যাটেগরি)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-2">রোগী বৃদ্ধি</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• month (মাস)</li>
                <li>• newPatients (নতুন রোগী)</li>
                <li>• totalPatients (মোট রোগী)</li>
                <li>• retention (ধরে রাখার হার %)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
