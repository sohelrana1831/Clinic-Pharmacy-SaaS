export interface Doctor {
  id: string
  name: string
  specialization: string
  availability: {
    [key: string]: string[] // day: time slots
  }
}

export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  doctors: string[] // doctor IDs
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface AppointmentBooking {
  patientName: string
  phone: string
  clinicId: string
  doctorId: string
  date: string
  time: string
  reason: string
  consent: boolean
  notes?: string
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
}

// Sample data
export const sampleClinics: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'SR Pharma - ধানমন্ডি',
    address: 'বাড়ি-১২৩, সড়ক-৪, ধানমন্ডি, ঢাকা-১২০৫',
    phone: '০২-৯৬১২৩৪৫',
    doctors: ['doc-1', 'doc-2']
  },
  {
    id: 'clinic-2',
    name: 'SR Pharma - উত্তরা',
    address: 'সেক্টর-৭, উত্তরা, ঢাকা-১২৩০',
    phone: '০২-৮৯৫৪৩২১',
    doctors: ['doc-1', 'doc-3']
  },
  {
    id: 'clinic-3',
    name: 'SR Pharma - গুলশান',
    address: 'গুলশান-২, ঢাকা-১২১২',
    phone: '০২-৮৮৭৬৫৪৩',
    doctors: ['doc-2', 'doc-3']
  }
]

export const sampleDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'ডা. রহিম উদ্দিন',
    specialization: 'জেনারেল ফিজিশিয়ান',
    availability: {
      'sunday': ['09:00', '09:30', '10:00', '10:30', '11:00'],
      'monday': ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30'],
      'tuesday': ['09:00', '09:30', '10:00', '10:30', '11:00'],
      'wednesday': ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30'],
      'thursday': ['09:00', '09:30', '10:00', '10:30', '11:00'],
      'saturday': ['09:00', '09:30', '10:00', '10:30', '11:00']
    }
  },
  {
    id: 'doc-2',
    name: 'ডা. ফাতেমা খাতুন',
    specialization: 'গাইনি বিশেষজ্ঞ',
    availability: {
      'sunday': ['10:00', '10:30', '11:00', '15:00', '15:30'],
      'monday': ['10:00', '10:30', '11:00'],
      'tuesday': ['10:00', '10:30', '11:00', '15:00', '15:30'],
      'wednesday': ['10:00', '10:30', '11:00'],
      'thursday': ['10:00', '10:30', '11:00', '15:00', '15:30'],
      'saturday': ['10:00', '10:30', '11:00']
    }
  },
  {
    id: 'doc-3',
    name: 'ডা. মাহবুব আলম',
    specialization: 'কার্ডিওলজিস্ট',
    availability: {
      'sunday': ['11:00', '11:30', '12:00', '16:00', '16:30'],
      'tuesday': ['11:00', '11:30', '12:00', '16:00', '16:30'],
      'thursday': ['11:00', '11:30', '12:00', '16:00', '16:30'],
      'saturday': ['11:00', '11:30', '12:00']
    }
  }
]

// Helper functions
export const getDoctorsByClinic = (clinicId: string): Doctor[] => {
  const clinic = sampleClinics.find(c => c.id === clinicId)
  if (!clinic) return []
  
  return sampleDoctors.filter(doc => clinic.doctors.includes(doc.id))
}

export const getAvailableSlots = (doctorId: string, date: string): TimeSlot[] => {
  const doctor = sampleDoctors.find(d => d.id === doctorId)
  if (!doctor) return []
  
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' })
  const slots = doctor.availability[dayOfWeek] || []
  
  return slots.map(time => ({
    time,
    available: true // In real app, check against existing appointments
  }))
}

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const minute = minutes || '00'
  
  // Convert to Bengali numerals
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  const bengaliTime = `${hour}:${minute}`.replace(/\d/g, (d) => bengaliNumerals[parseInt(d)])
  
  return bengaliTime
}
