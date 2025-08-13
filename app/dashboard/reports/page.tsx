'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ChartPlaceholder, MetricCard, ExportButtons } from '@/components/reports/chart-components'
import {
  dailySalesData,
  monthlyRevenueData,
  topMedicinesData,
  patientGrowthData,
  csvHeaders,
  exportToCSV,
  exportToPDF,
  doctors,
  branches
} from '@/lib/reports-data'
import {
  BarChart3,
  TrendingUp,
  Pill,
  Users,
  Download,
  FileText,
  Calendar,
  Filter,
  DollarSign,
  Activity
} from 'lucide-react'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: '2024-01-01', to: '2024-06-30' })
  const [selectedDoctor, setSelectedDoctor] = useState('সকল ডাক্তার')
  const [selectedBranch, setSelectedBranch] = useState('সকল শাখা')

  // Calculate summary metrics
  const totalSales = dailySalesData.reduce((sum, day) => sum + day.sales, 0)
  const totalTransactions = dailySalesData.reduce((sum, day) => sum + day.transactions, 0)
  const avgSalesGrowth = monthlyRevenueData.reduce((sum, month) => sum + month.growth, 0) / monthlyRevenueData.length
  const currentMonthPatients = patientGrowthData[patientGrowthData.length - 1]?.totalPatients || 0

  return (
    <div className="min-h-screen bg-theme-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-6 bg-theme-background">
          <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-theme-foreground">রিপোর্ট ও বিশ্লেষণ</h1>
          <p className="text-theme-muted mt-1">বিক্রয়, রোগী এবং ব্যবসায়িক পারফরম্যান্স রিপোর্ট</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-theme-muted" />
          <span className="text-sm text-theme-muted">ফিল্টার সক্রিয়</span>
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
              <label className="block text-sm font-medium text-theme-foreground mb-2">তারিখ থেকে</label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-foreground mb-2">তারিখ পর্যন্ত</label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-foreground mb-2">ডাক্তার নির্বাচন</label>
              <Select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {doctors.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-foreground mb-2">শাখা নির্বাচন</label>
              <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="মোট বিক্রয়"
          value={totalSales}
          change={12.5}
          icon={<DollarSign className="h-5 w-5" />}
          color="green"
          suffix=" টাকা"
        />
        <MetricCard
          title="মোট লেনদেন"
          value={totalTransactions}
          change={8.3}
          icon={<Activity className="h-5 w-5" />}
          color="blue"
          suffix=" টি"
        />
        <MetricCard
          title="���ড় বৃদ্ধির হার"
          value={avgSalesGrowth.toFixed(1)}
          change={avgSalesGrowth}
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
          suffix="%"
        />
        <MetricCard
          title="মোট রোগী"
          value={currentMonthPatients}
          change={15.2}
          icon={<Users className="h-5 w-5" />}
          color="orange"
          suffix=" জন"
        />
      </div>

      {/* Daily Sales Report */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              দৈনিক বিক্রয় রিপোর্ট
            </CardTitle>
            <p className="text-sm text-theme-muted mt-1">গত ৭ দিনের বিক্রয় পরিসংখ্যান</p>
          </div>
          <ExportButtons
            onExportCSV={() => exportToCSV(dailySalesData, 'daily-sales', csvHeaders.dailySales)}
            onExportPDF={() => exportToPDF('দৈনিক বিক্রয় রিপোর্ট', dailySalesData)}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder
              title="দৈনিক বিক্রয় চার্ট"
              type="bar"
              description="গত ৭ দিনের বিক্রয় পরিমা���"
              data={dailySalesData}
            />
            <div className="space-y-3">
              <h4 className="font-semibold text-theme-foreground">সাম্প্রতিক বিক্রয়</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dailySalesData.map((day, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{day.date}</p>
                      <p className="text-sm text-theme-muted">{day.transactions} লেনদেন</p>
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
            <p className="text-sm text-theme-muted mt-1">গত ৬ মাসের আয় এবং ব��দ্ধির হার</p>
          </div>
          <ExportButtons
            onExportCSV={() => exportToCSV(monthlyRevenueData, 'monthly-revenue', csvHeaders.monthlyRevenue)}
            onExportPDF={() => exportToPDF('মাসিক আয়ের রিপোর্ট', monthlyRevenueData)}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartPlaceholder
                title="মাসিক আয়ের ট্রেন্ড"
                type="area"
                description="গত ৬ মাসের আয় এবং বৃদ্ধির প্রবণতা"
                data={monthlyRevenueData}
                height={280}
              />
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-theme-foreground">মাসিক পারফরম্যান্স</h4>
              <div className="space-y-2">
                {monthlyRevenueData.slice(-3).map((month, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
              সর্বা���িক বিক্রিত ওষুধ
            </CardTitle>
            <p className="text-sm text-theme-muted mt-1">বেস্ট সেলিং মেডিসিন এবং আয়</p>
          </div>
          <ExportButtons
            onExportCSV={() => exportToCSV(topMedicinesData, 'top-medicines', csvHeaders.topMedicines)}
            onExportPDF={() => exportToPDF('জনপ্রিয় ওষুধের রিপোর্ট', topMedicinesData)}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder
              title="টপ মেডিসিন চার্ট"
              type="bar"
              description="সর্বাধিক বিক্রিত ওষুধের তালিকা"
              data={topMedicinesData}
            />
            <div className="space-y-3">
              <h4 className="font-semibold text-theme-foreground">বিস্তারিত তালিকা</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {topMedicinesData.map((medicine, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{medicine.name}</p>
                        <p className="text-xs text-theme-muted">{medicine.category}</p>
                      </div>
                      <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-theme-muted">{medicine.sold} বিক্রি</span>
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
            <p className="text-sm text-theme-muted mt-1">নতুন রোগী নিবন্ধন এবং ধরে রাখার হার</p>
          </div>
          <ExportButtons
            onExportCSV={() => exportToCSV(patientGrowthData, 'patient-growth', csvHeaders.patientGrowth)}
            onExportPDF={() => exportToPDF('রোগী বৃদ্ধির রিপোর্ট', patientGrowthData)}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartPlaceholder
                title="রোগী বৃদ্ধির ট্রেন্ড"
                type="line"
                description="নতুন রোগী নিবন্ধন এবং ধরে রাখার হার"
                data={patientGrowthData}
                height={280}
              />
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
      <Card className="bg-gray-50 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-theme-muted" />
            CSV রপ্তানি কলাম হেডার
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-theme-foreground mb-2">দৈনিক বিক্রয়</h5>
              <ul className="space-y-1 text-theme-muted">
                <li>• date (তারিখ)</li>
                <li>• sales (বিক্রয় টাকা)</li>
                <li>• transactions (লেনদেন সংখ্যা)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-theme-foreground mb-2">মাসিক আয়</h5>
              <ul className="space-y-1 text-theme-muted">
                <li>• month (মাস)</li>
                <li>• revenue (আয়)</li>
                <li>• growth (বৃদ্ধির হার %)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-theme-foreground mb-2">��নপ্রিয় ওষুধ</h5>
              <ul className="space-y-1 text-theme-muted">
                <li>• name (ওষুধের নাম)</li>
                <li>• sold (বিক্রিত সংখ্যা)</li>
                <li>• revenue (আয়)</li>
                <li>• category (ক্যাটেগরি)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-theme-foreground mb-2">রোগী বৃদ্ধি</h5>
              <ul className="space-y-1 text-theme-muted">
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
        </main>
      </div>
    </div>
  )
}
