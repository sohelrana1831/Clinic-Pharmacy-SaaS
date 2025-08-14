const API_BASE = 'http://localhost:3000/api'

// Sample data generators
const samplePatients = [
  {
    name: 'আবুল কাসেম মিয়া',
    email: 'abul.kasem@email.com',
    phone: '01712345681',
    address: 'ধানমন্ডি ৩২, ঢাকা-১২০৫',
    dateOfBirth: '1985-03-15',
    gender: 'পুরুষ',
    bloodGroup: 'A+'
  },
  {
    name: 'রহিমা খাতুন',
    email: 'rahima.khatun@email.com', 
    phone: '01812345682',
    address: 'উত্তরা সেক্টর ৭, ঢাকা-১২৩০',
    dateOfBirth: '1992-07-22',
    gender: 'মহিলা',
    bloodGroup: 'B+'
  },
  {
    name: 'করিম উদ্দিন',
    email: 'karim.uddin@email.com',
    phone: '01912345683', 
    address: 'মিরপুর ১০, ঢাকা-১২১৬',
    dateOfBirth: '1978-11-08',
    gender: 'পুরুষ',
    bloodGroup: 'O-'
  },
  {
    name: 'সালমা বেগম',
    email: 'salma.begum@email.com',
    phone: '01612345684',
    address: 'গুলশান ২, ঢাকা-১২১২',
    dateOfBirth: '1990-12-25',
    gender: 'মহিলা', 
    bloodGroup: 'AB+'
  },
  {
    name: 'জাহিদ হাসান',
    email: 'jahid.hasan@email.com',
    phone: '01712345685',
    address: 'বনানী, ঢাকা-১২১৩',
    dateOfBirth: '1987-05-18',
    gender: 'পুরুষ',
    bloodGroup: 'A-'
  }
]

const sampleMedicines = [
  {
    sku: 'MED001',
    name: 'প্যারাসিটামল ৫০০',
    genericName: 'Paracetamol',
    category: 'Tablet',
    manufacturer: 'Square Pharmaceuticals',
    strength: '500mg',
    unit: 'piece',
    purchasePrice: 2.50,
    sellingPrice: 4.00,
    stockQty: 500,
    reorderLevel: 50,
    expiryDate: '2025-12-31',
    batchNumber: 'PAR2024001'
  },
  {
    sku: 'MED002', 
    name: 'নাপা এক্সটেন্ড',
    genericName: 'Paracetamol Extended Release',
    category: 'Tablet',
    manufacturer: 'Beximco Pharmaceuticals',
    strength: '665mg',
    unit: 'piece',
    purchasePrice: 5.00,
    sellingPrice: 7.50,
    stockQty: 300,
    reorderLevel: 30,
    expiryDate: '2025-10-31',
    batchNumber: 'NAP2024001'
  },
  {
    sku: 'MED003',
    name: 'ইবুপ্রোফেন',
    genericName: 'Ibuprofen',
    category: 'Tablet', 
    manufacturer: 'Incepta Pharmaceuticals',
    strength: '400mg',
    unit: 'piece',
    purchasePrice: 6.00,
    sellingPrice: 9.00,
    stockQty: 250,
    reorderLevel: 25,
    expiryDate: '2025-09-30',
    batchNumber: 'IBU2024001'
  },
  {
    sku: 'MED004',
    name: 'এমোক্সিসিলিন',
    genericName: 'Amoxicillin',
    category: 'Capsule',
    manufacturer: 'Renata Limited',
    strength: '250mg', 
    unit: 'piece',
    purchasePrice: 8.00,
    sellingPrice: 12.00,
    stockQty: 180,
    reorderLevel: 20,
    expiryDate: '2025-11-30',
    batchNumber: 'AMX2024001'
  },
  {
    sku: 'MED005',
    name: 'ওমিপ্রাজল',
    genericName: 'Omeprazole',
    category: 'Capsule',
    manufacturer: 'ACI Limited',
    strength: '20mg',
    unit: 'piece',
    purchasePrice: 15.00,
    sellingPrice: 22.00,
    stockQty: 120,
    reorderLevel: 15,
    expiryDate: '2025-08-31',
    batchNumber: 'OME2024001'
  }
]

const sampleUsers = [
  {
    name: 'ডা. রহিম উদ্দিন',
    email: 'dr.rahim@srpharma.com',
    role: 'doctor',
    phone: '01712345671',
    password: 'password123'
  },
  {
    name: 'ডা. ফাতেমা খাতুন', 
    email: 'dr.fatema@srpharma.com',
    role: 'doctor',
    phone: '01812345672',
    password: 'password123'
  },
  {
    name: 'ফার্মাসিস্ট নাসির',
    email: 'nasir.pharmacist@srpharma.com',
    role: 'pharmacist',
    phone: '01912345673',
    password: 'password123'
  },
  {
    name: 'রিসেপশনিস্ট সালমা',
    email: 'salma.reception@srpharma.com', 
    role: 'receptionist',
    phone: '01612345674',
    password: 'password123'
  },
  {
    name: 'অ্যাডমিন আহমেদ',
    email: 'admin.ahmed@srpharma.com',
    role: 'admin',
    phone: '01512345675',
    password: 'password123'
  }
]

// API Helper function
async function apiCall(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  if (data) {
    options.body = JSON.stringify(data)
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options)
    const result = await response.json()
    return result
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    return { success: false, error: error.message }
  }
}

// Create sample data
async function createSampleData() {
  console.log('🌱 Creating sample data...')
  
  // Create patients
  console.log('📝 Creating patients...')
  const createdPatients = []
  for (const patient of samplePatients) {
    const result = await apiCall('/patients', 'POST', patient)
    if (result.success) {
      createdPatients.push(result.data)
      console.log(`✅ Created patient: ${patient.name}`)
    } else {
      console.log(`❌ Failed to create patient: ${patient.name}`, result)
    }
  }
  
  // Create medicines
  console.log('💊 Creating medicines...')
  const createdMedicines = []
  for (const medicine of sampleMedicines) {
    const result = await apiCall('/medicines', 'POST', medicine)
    if (result.success) {
      createdMedicines.push(result.data)
      console.log(`✅ Created medicine: ${medicine.name}`)
    } else {
      console.log(`❌ Failed to create medicine: ${medicine.name}`, result)
    }
  }
  
  // Create users
  console.log('👥 Creating users...')
  const createdUsers = []
  for (const user of sampleUsers) {
    const result = await apiCall('/users', 'POST', user)
    if (result.success) {
      createdUsers.push(result.data)
      console.log(`✅ Created user: ${user.name}`)
    } else {
      console.log(`❌ Failed to create user: ${user.name}`, result)
    }
  }
  
  // Create appointments (only if we have patients and doctors)
  if (createdPatients.length > 0 && createdUsers.filter(u => u.role === 'doctor').length > 0) {
    console.log('📅 Creating appointments...')
    const doctors = createdUsers.filter(u => u.role === 'doctor')
    
    const sampleAppointments = [
      {
        patientId: createdPatients[0]?.id,
        doctorId: doctors[0]?.id,
        date: '2025-08-15',
        time: '10:00',
        type: 'consultation',
        status: 'confirmed',
        notes: 'নিয়মিত চেকআপ'
      },
      {
        patientId: createdPatients[1]?.id,
        doctorId: doctors[1]?.id || doctors[0]?.id,
        date: '2025-08-15', 
        time: '11:30',
        type: 'followup',
        status: 'confirmed',
        notes: 'ফলোআপ ভিজিট'
      },
      {
        patientId: createdPatients[2]?.id,
        doctorId: doctors[0]?.id,
        date: '2025-08-16',
        time: '09:00',
        type: 'consultation',
        status: 'scheduled',
        notes: 'জ্বর ও সর্দির সমস্যা'
      },
      {
        patientId: createdPatients[3]?.id,
        doctorId: doctors[1]?.id || doctors[0]?.id,
        date: '2025-08-16',
        time: '14:00',
        type: 'consultation', 
        status: 'confirmed',
        notes: 'পেটের সমস্যা'
      },
      {
        patientId: createdPatients[4]?.id,
        doctorId: doctors[0]?.id,
        date: '2025-08-17',
        time: '15:30',
        type: 'emergency',
        status: 'completed',
        notes: 'জরুরি চিকিৎসা'
      }
    ]
    
    for (const appointment of sampleAppointments) {
      if (appointment.patientId && appointment.doctorId) {
        const result = await apiCall('/appointments', 'POST', appointment)
        if (result.success) {
          console.log(`✅ Created appointment for patient ${appointment.patientId}`)
        } else {
          console.log(`❌ Failed to create appointment:`, result)
        }
      }
    }
  }
  
  // Create prescriptions
  if (createdPatients.length > 0 && createdUsers.filter(u => u.role === 'doctor').length > 0 && createdMedicines.length > 0) {
    console.log('💊 Creating prescriptions...')
    const doctors = createdUsers.filter(u => u.role === 'doctor')
    
    const samplePrescriptions = [
      {
        patientId: createdPatients[0]?.id,
        doctorId: doctors[0]?.id,
        date: '2025-08-15',
        diagnosis: 'জ্বর ও মাথাব্যথা',
        notes: 'প্রচুর পানি পান করুন',
        status: 'issued',
        medicines: [
          {
            medicineId: createdMedicines[0]?.id,
            dosage: '1টি',
            frequency: 'দিনে ৩ বার',
            duration: '৫ দিন', 
            instructions: 'খাবারের পর',
            quantity: 15
          }
        ]
      },
      {
        patientId: createdPatients[1]?.id,
        doctorId: doctors[1]?.id || doctors[0]?.id,
        date: '2025-08-15',
        diagnosis: 'গ্যাসের সমস্যা',
        notes: 'তেল-মসলা এড়িয়ে চলুন',
        status: 'issued',
        medicines: [
          {
            medicineId: createdMedicines[4]?.id,
            dosage: '1টি',
            frequency: 'দিনে ১ বার',
            duration: '১০ দিন',
            instructions: 'খালি পেটে',
            quantity: 10
          }
        ]
      }
    ]
    
    for (const prescription of samplePrescriptions) {
      if (prescription.patientId && prescription.doctorId) {
        const result = await apiCall('/prescriptions', 'POST', prescription)
        if (result.success) {
          console.log(`✅ Created prescription for patient ${prescription.patientId}`)
        } else {
          console.log(`❌ Failed to create prescription:`, result)
        }
      }
    }
  }
  
  console.log('🎉 Sample data creation completed!')
}

// Run the script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createSampleData, apiCall }
} else {
  createSampleData().catch(console.error)
}
