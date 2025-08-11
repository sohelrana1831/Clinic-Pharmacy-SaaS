export interface Medicine {
  id: string
  name: string
  genericName?: string
  strength: string
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops'
  manufacturer: string
  price: number
  stock: number
}

export interface PrescriptionMedicine {
  medicineId: string
  medicineName: string
  dose: string
  frequency: string
  duration: string
  instructions?: string
  totalQuantity?: number
}

export interface PrescriptionData {
  id?: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  doctorRegistration?: string
  clinicId: string
  date: string
  diagnosis: string
  medicines: PrescriptionMedicine[]
  notes?: string
  nextRefillDate?: string
  status: 'draft' | 'prescribed' | 'dispensed'
}

export interface Doctor {
  id: string
  name: string
  specialization: string
  registrationNo: string
  signature?: string
}

// Sample medicines inventory
export const sampleMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'প্যারাসিটামল ৫০০mg',
    genericName: 'Paracetamol',
    strength: '500mg',
    form: 'tablet',
    manufacturer: 'স্কয়ার ফার্মা',
    price: 2,
    stock: 500
  },
  {
    id: 'med-2',
    name: 'ওমিপ্রাজল ২০mg',
    genericName: 'Omeprazole',
    strength: '20mg',
    form: 'capsule',
    manufacturer: 'ইনসেপ্টা ফার্মা',
    price: 5,
    stock: 200
  },
  {
    id: 'med-3',
    name: 'মেটফরমিন ৫০০mg',
    genericName: 'Metformin',
    strength: '500mg',
    form: 'tablet',
    manufacturer: 'স্কয়ার ফার্মা',
    price: 3,
    stock: 300
  },
  {
    id: 'med-4',
    name: 'এজিথ্রোমাইসিন ২৫০mg',
    genericName: 'Azithromycin',
    strength: '250mg',
    form: 'tablet',
    manufacturer: 'বেক্সিমকো ফার্মা',
    price: 15,
    stock: 150
  },
  {
    id: 'med-5',
    name: 'সিপ্রোফ্লক্সাসিন ৫০০mg',
    genericName: 'Ciprofloxacin',
    strength: '500mg',
    form: 'tablet',
    manufacturer: 'রেনাটা ফার্মা',
    price: 8,
    stock: 180
  },
  {
    id: 'med-6',
    name: 'এমলোডিপিন ৫mg',
    genericName: 'Amlodipine',
    strength: '5mg',
    form: 'tablet',
    manufacturer: 'এসিআই ফার্মা',
    price: 4,
    stock: 250
  },
  {
    id: 'med-7',
    name: 'লসার্টান ৫০mg',
    genericName: 'Losartan',
    strength: '50mg',
    form: 'tablet',
    manufacturer: 'স্কয়ার ফার্মা',
    price: 6,
    stock: 220
  },
  {
    id: 'med-8',
    name: 'কেটোকোনাজল শ্যাম্পু',
    genericName: 'Ketoconazole',
    strength: '2%',
    form: 'cream',
    manufacturer: 'গ্ল্যাক্সো ফার্মা',
    price: 25,
    stock: 100
  }
]

// Sample doctors with registration numbers
export const sampleDoctorsWithReg: Doctor[] = [
  {
    id: 'doc-1',
    name: 'ডা. রহিম উদ্দিন',
    specialization: 'জেনারেল ফিজিশিয়ান',
    registrationNo: 'BM&DC-12345'
  },
  {
    id: 'doc-2',
    name: 'ডা. ফাতেমা খাতুন',
    specialization: 'গাইনি বিশেষজ্ঞ',
    registrationNo: 'BM&DC-23456'
  },
  {
    id: 'doc-3',
    name: 'ডা. মাহবুব আলম',
    specialization: 'ক���র্ডিওলজিস্ট',
    registrationNo: 'BM&DC-34567'
  }
]

// Helper functions
export const searchMedicines = (query: string): Medicine[] => {
  if (!query) return sampleMedicines
  
  return sampleMedicines.filter(med =>
    med.name.toLowerCase().includes(query.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(query.toLowerCase())
  )
}

export const calculateRefillDate = (duration: string): string => {
  const today = new Date()
  let days = 0
  
  // Parse duration string
  if (duration.includes('দিন')) {
    const match = duration.match(/(\d+)/)
    days = match ? parseInt(match[1]) : 0
  } else if (duration.includes('সপ্তাহ')) {
    const match = duration.match(/(\d+)/)
    days = match ? parseInt(match[1]) * 7 : 0
  } else if (duration.includes('মাস')) {
    const match = duration.match(/(\d+)/)
    days = match ? parseInt(match[1]) * 30 : 0
  }
  
  const refillDate = new Date(today)
  refillDate.setDate(today.getDate() + days)
  
  return refillDate.toISOString().split('T')[0]
}

export const calculateTotalQuantity = (dose: string, frequency: string, duration: string): number => {
  let dailyDose = 1
  let totalDays = 1
  
  // Parse frequency
  if (frequency.includes('২ বার')) dailyDose = 2
  else if (frequency.includes('৩ বার')) dailyDose = 3
  else if (frequency.includes('৪ বার')) dailyDose = 4
  
  // Parse duration
  if (duration.includes('দিন')) {
    const match = duration.match(/(\d+)/)
    totalDays = match ? parseInt(match[1]) : 1
  } else if (duration.includes('সপ্তাহ')) {
    const match = duration.match(/(\d+)/)
    totalDays = match ? parseInt(match[1]) * 7 : 7
  } else if (duration.includes('মাস')) {
    const match = duration.match(/(\d+)/)
    totalDays = match ? parseInt(match[1]) * 30 : 30
  }
  
  return dailyDose * totalDays
}

// Common dose options
export const doseOptions = [
  '১ টি', '২ টি', '৩ টি', '৪ টি',
  '১/২ টি', '১ চা চামচ', '২ চা চামচ', '১ টেবিল চামচ',
  '১ ফোঁটা', '২ ফোঁটা', '৩ ফোঁটা', '৪ ফোঁটা',
  '১ পাফ', '২ পাফ'
]

// Common frequency options
export const frequencyOptions = [
  'দিনে ১ বার',
  'দিনে ২ বার',
  'দিনে ৩ বার',
  'দিনে ৪ বার',
  '৮ ঘন্টা পর পর',
  '১২ ঘন্টা পর পর',
  'প্রয়োজনে',
  'ঘুমানোর আগে',
  'খাবারে��� আগে',
  'খাবারের পরে'
]

// Common duration options
export const durationOptions = [
  '৩ দিন',
  '৫ দিন',
  '৭ দিন',
  '১০ দিন',
  '১৪ দিন',
  '১৫ দিন',
  '২১ দিন',
  '৩০ দিন',
  '১ সপ্তাহ',
  '২ সপ্তাহ',
  '৩ সপ্তাহ',
  '১ মাস',
  '২ মাস',
  '৩ মাস',
  'চিকিৎসকের পরামর্শ অনুযায়ী'
]
