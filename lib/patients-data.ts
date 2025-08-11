export interface Patient {
  id: string
  name: string
  phone: string
  email?: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  address: string
  emergencyContact?: string
  lastVisit?: string
  notes?: string
  bloodGroup?: string
  allergies?: string[]
  createdAt: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorName: string
  date: string
  time: string
  type: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  notes?: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorName: string
  date: string
  medicines: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions?: string
  }[]
  diagnosis: string
  notes?: string
}

// Sample patient data
export const samplePatients: Patient[] = [
  {
    id: 'P001',
    name: 'আবদুর রহমান',
    phone: '01712345678',
    email: 'rahman@email.com',
    dateOfBirth: '1980-05-15',
    gender: 'male',
    address: 'ধানমন্ডি, ঢাকা-১২০৫',
    emergencyContact: '01987654321',
    lastVisit: '2024-01-10',
    notes: 'ডায়াবেটিস রোগী, নিয়মিত চেকআপ প্রয়োজন',
    bloodGroup: 'B+',
    allergies: ['পেনিসিলিন'],
    createdAt: '2023-08-15'
  },
  {
    id: 'P002',
    name: 'ফাতেমা খাতুন',
    phone: '01823456789',
    email: 'fatema@email.com',
    dateOfBirth: '1992-11-22',
    gender: 'female',
    address: 'উত্তরা, ঢাকা-১২৩০',
    emergencyContact: '01876543210',
    lastVisit: '2024-01-12',
    notes: 'হাইপারটেনশনের সমস্যা',
    bloodGroup: 'A+',
    allergies: [],
    createdAt: '2023-09-20'
  },
  {
    id: 'P003',
    name: 'মোহাম্মদ আলী',
    phone: '01934567890',
    email: 'ali@email.com',
    dateOfBirth: '1975-03-08',
    gender: 'male',
    address: 'গুলশান-২, ঢাকা-১২১২',
    emergencyContact: '01765432109',
    lastVisit: '2024-01-08',
    notes: 'হার্টের সমস্যা, নিয়মিত ওষুধ সেবন',
    bloodGroup: 'O+',
    allergies: ['সালফার'],
    createdAt: '2023-07-10'
  }
]

// Sample appointments
export const sampleAppointments: Appointment[] = [
  {
    id: 'A001',
    patientId: 'P001',
    doctorName: 'ডা. রহিম উদ্দিন',
    date: '2024-01-15',
    time: '10:30',
    type: 'ফলোআপ',
    status: 'scheduled',
    notes: 'ডায়াবেটিস চেকআপ'
  },
  {
    id: 'A002',
    patientId: 'P001',
    doctorName: 'ডা. রহিম উদ্দিন',
    date: '2024-01-10',
    time: '09:15',
    type: 'নিয়মিত চেকআপ',
    status: 'completed',
    notes: 'রক্তে চিনির মাত্রা স্বাভাবিক'
  }
]

// Sample prescriptions
export const samplePrescriptions: Prescription[] = [
  {
    id: 'PR001',
    patientId: 'P001',
    doctorName: 'ডা. রহিম উদ্দিন',
    date: '2024-01-10',
    medicines: [
      {
        name: 'মেটফরমিন ৫০০mg',
        dosage: '১ টি',
        frequency: 'দিনে ২ বার',
        duration: '৩০ দিন',
        instructions: 'খাবারের সাথে'
      },
      {
        name: 'গ্লিমেপিরাইড ২mg',
        dosage: '১ টি',
        frequency: 'দিনে ১ বার',
        duration: '৩০ দিন',
        instructions: 'সকালে খাবারের আগে'
      }
    ],
    diagnosis: 'টাইপ ২ ডায়াবেটিস',
    notes: 'রক্তে চিনির মাত্রা নিয়মিত পরীক্ষা করুন'
  }
]
