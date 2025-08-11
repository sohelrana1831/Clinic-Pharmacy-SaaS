// Sample data for reports with proper typing
export interface DailySalesData {
  date: string
  sales: number
  transactions: number
  avgTransactionValue: number
}

export interface MonthlyRevenueData {
  month: string
  revenue: number
  growth: number
  expenses: number
  profit: number
}

export interface TopMedicineData {
  name: string
  sold: number
  revenue: number
  category: string
  margin: number
  lastRestocked: string
}

export interface PatientGrowthData {
  month: string
  newPatients: number
  totalPatients: number
  retention: number
  averageVisits: number
}

// Daily Sales Data
export const dailySalesData: DailySalesData[] = [
  { date: '2024-01-15', sales: 15500, transactions: 45, avgTransactionValue: 344 },
  { date: '2024-01-16', sales: 18200, transactions: 52, avgTransactionValue: 350 },
  { date: '2024-01-17', sales: 21800, transactions: 68, avgTransactionValue: 321 },
  { date: '2024-01-18', sales: 19400, transactions: 58, avgTransactionValue: 334 },
  { date: '2024-01-19', sales: 23600, transactions: 72, avgTransactionValue: 328 },
  { date: '2024-01-20', sales: 17900, transactions: 49, avgTransactionValue: 365 },
  { date: '2024-01-21', sales: 26300, transactions: 81, avgTransactionValue: 325 }
]

// Monthly Revenue Data
export const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: 'জানুয়ারি', revenue: 450000, growth: 12.5, expenses: 320000, profit: 130000 },
  { month: 'ফেব্রুয়ারি', revenue: 520000, growth: 15.6, expenses: 360000, profit: 160000 },
  { month: 'মার্চ', revenue: 480000, growth: -7.7, expenses: 340000, profit: 140000 },
  { month: 'এপ্রিল', revenue: 610000, growth: 27.1, expenses: 420000, profit: 190000 },
  { month: 'মে', revenue: 580000, growth: -4.9, expenses: 400000, profit: 180000 },
  { month: 'জুন', revenue: 675000, growth: 16.4, expenses: 450000, profit: 225000 }
]

// Top Medicines Data
export const topMedicinesData: TopMedicineData[] = [
  { 
    name: 'প্যারাসিটামল ৫০০মিগ্রা', 
    sold: 450, 
    revenue: 13500, 
    category: 'ব্যথানাশক',
    margin: 35,
    lastRestocked: '2024-01-10'
  },
  { 
    name: 'অ্যামোক্সিসিলিন ক্যাপসুল', 
    sold: 320, 
    revenue: 19200, 
    category: 'অ্যান্টিবায়োটিক',
    margin: 42,
    lastRestocked: '2024-01-08'
  },
  { 
    name: 'ওমিপ্রাজল ২০মিগ্রা', 
    sold: 280, 
    revenue: 16800, 
    category: 'গ্যাস্ট্রিক',
    margin: 38,
    lastRestocked: '2024-01-12'
  },
  { 
    name: 'মেটফরমিন ৫০০মিগ্রা', 
    sold: 250, 
    revenue: 12500, 
    category: 'ডায়াবেটিস',
    margin: 45,
    lastRestocked: '2024-01-05'
  },
  { 
    name: 'সালবুটামল ইনহেলার', 
    sold: 180, 
    revenue: 21600, 
    category: 'শ্বাসকষ্ট',
    margin: 55,
    lastRestocked: '2024-01-15'
  },
  { 
    name: 'আইবুপ্রোফেন ৪০০মিগ্রা', 
    sold: 220, 
    revenue: 11000, 
    category: 'ব্যথানাশক',
    margin: 32,
    lastRestocked: '2024-01-14'
  },
  { 
    name: 'সিপ্রোফ্লক্সাসিন ৫০০মিগ্রা', 
    sold: 160, 
    revenue: 14400, 
    category: 'অ্যান্টিবায়োটিক',
    margin: 48,
    lastRestocked: '2024-01-11'
  }
]

// Patient Growth Data
export const patientGrowthData: PatientGrowthData[] = [
  { month: 'জানুয়ারি', newPatients: 125, totalPatients: 1250, retention: 92, averageVisits: 2.4 },
  { month: 'ফেব্রুয়ারি', newPatients: 145, totalPatients: 1395, retention: 94, averageVisits: 2.6 },
  { month: 'মার্চ', newPatients: 160, totalPatients: 1555, retention: 91, averageVisits: 2.3 },
  { month: 'এপ্রিল', newPatients: 180, totalPatients: 1735, retention: 95, averageVisits: 2.8 },
  { month: 'মে', newPatients: 155, totalPatients: 1890, retention: 93, averageVisits: 2.5 },
  { month: 'জুন', newPatients: 175, totalPatients: 2065, retention: 96, averageVisits: 2.7 }
]

// CSV Column Headers
export const csvHeaders = {
  dailySales: ['তারিখ', 'বিক্রয় (টাকা)', 'লেনদেন সংখ্যা', 'গড় লেনদেনের মূল্য'],
  monthlyRevenue: ['মাস', 'আয় (টাকা)', 'বৃদ্ধির হার (%)', 'খরচ (টাকা)', 'লাভ (টাকা)'],
  topMedicines: ['ওষুধের নাম', 'বিক্রিত সংখ্যা', 'আয় (টাকা)', 'ক্যাটেগরি', 'মার্জিন (%)', 'শেষ স্টক'],
  patientGrowth: ['মাস', 'নতুন রোগী', 'মোট রোগী', 'ধরে রাখার হার (%)', 'গড় ভিজিট']
}

// Export utility functions
export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  // Create CSV content with Bengali headers
  const csvContent = [
    headers.join(','),
    ...data.map(row => {
      return headers.map(header => {
        // Map Bengali headers to English data keys
        const keyMap: { [key: string]: string } = {
          'তারিখ': 'date',
          'বিক্রয় (টাকা)': 'sales',
          'লেনদেন সংখ্যা': 'transactions',
          'গড় লেনদেনের মূল্য': 'avgTransactionValue',
          'মাস': 'month',
          'আয় (টাকা)': 'revenue',
          'বৃদ্ধির হার (%)': 'growth',
          'খরচ (টাকা)': 'expenses',
          'লাভ (টাকা)': 'profit',
          'ওষুধের নাম': 'name',
          'বিক্রিত সংখ্যা': 'sold',
          'ক্যাটেগরি': 'category',
          'মা���্জিন (%)': 'margin',
          'শেষ স্টক': 'lastRestocked',
          'নতুন রোগী': 'newPatients',
          'মোট রোগী': 'totalPatients',
          'ধরে রাখার হার (%)': 'retention',
          'গড় ভিজিট': 'averageVisits'
        }
        
        const key = keyMap[header] || header
        const value = row[key]
        
        // Handle undefined values and format numbers
        if (value === undefined || value === null) return ''
        if (typeof value === 'number') return value.toString()
        return `"${value}"`
      }).join(',')
    })
  ].join('\n')

  // Add BOM for proper Bengali character encoding
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// PDF export placeholder (would integrate with jsPDF or similar)
export const exportToPDF = (reportName: string, data: any[]) => {
  // This would normally use jsPDF to generate actual PDFs
  // For now, we'll show a notification
  const message = `PDF রিপোর্ট তৈরি করা হচ্ছে: ${reportName}\nডেটা পয়েন্ট: ${data.length} টি`
  alert(message)
  
  // In real implementation:
  // const doc = new jsPDF()
  // doc.text(reportName, 20, 20)
  // doc.autoTable({ head: headers, body: data })
  // doc.save(`${reportName}_${new Date().toISOString().split('T')[0]}.pdf`)
}

// Filter utility functions
export const filterDataByDateRange = (data: any[], startDate: string, endDate: string, dateField: string = 'date') => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return data.filter(item => {
    const itemDate = new Date(item[dateField])
    return itemDate >= start && itemDate <= end
  })
}

export const filterDataByDoctor = (data: any[], doctorName: string) => {
  if (doctorName === 'সকল ডাক্তার') return data
  return data.filter(item => item.doctor === doctorName)
}

export const filterDataByBranch = (data: any[], branchName: string) => {
  if (branchName === 'সকল শাখা') return data
  return data.filter(item => item.branch === branchName)
}

// Sample doctors and branches for filters
export const doctors = [
  'সকল ডাক্তার',
  'ডা. রহিম উদ্দিন',
  'ডা. ফাতেমা খাতুন',
  'ডা. করিম হোসেন',
  'ডা. নাসরিন আক্তার',
  'ডা. আবুল কাশেম'
]

export const branches = [
  'সকল শাখা',
  'ঢাকা মূল শাখা',
  'চট্টগ্রাম শাখা',
  'সিলেট শাখা',
  'খুলনা শাখা',
  'রাজশাহী শাখা'
]
