// Direct database population script
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function populateDatabase() {
  console.log('🌱 Populating database with 5+ sample entries for each API...')

  try {
    // Clear existing related data to avoid conflicts
    await prisma.prescriptionMedicine.deleteMany()
    await prisma.prescription.deleteMany()
    await prisma.appointment.deleteMany()

    // 1. Users (6 entries)
    console.log('👥 Creating users...')
    const users = []
    
    const userData = [
      { email: 'dr.rahim@srpharma.com', name: 'ডা. রহিম উদ্দিন', role: 'doctor', phone: '01712345671' },
      { email: 'dr.fatema@srpharma.com', name: 'ডা. ফাতেমা খাতুন', role: 'doctor', phone: '01812345672' },
      { email: 'dr.karim@srpharma.com', name: 'ডা. করিম হাসান', role: 'doctor', phone: '01912345673' },
      { email: 'pharmacist.nasir@srpharma.com', name: 'ফার্মাসিস্ট নাসির', role: 'pharmacist', phone: '01612345674' },
      { email: 'reception.salma@srpharma.com', name: 'রিসেপশনিস্ট সালমা', role: 'receptionist', phone: '01512345675' },
      { email: 'admin.ahmed@srpharma.com', name: 'অ্যাডমিন আহমেদ', role: 'admin', phone: '01712345676' }
    ]

    for (const user of userData) {
      try {
        const created = await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: user
        })
        users.push(created)
        console.log(`✅ Created user: ${user.name}`)
      } catch (error) {
        console.log(`⚠️ User ${user.name} might already exist`)
      }
    }

    // 2. Patients (6 entries)
    console.log('🏥 Creating patients...')
    const patients = []
    
    const patientData = [
      { name: 'আবুল কাসেম মিয়া', email: 'abul@email.com', phone: '01712345681', address: 'ধানমন্ডি, ঢাকা', gender: 'পুরুষ', bloodGroup: 'A+', dateOfBirth: new Date('1985-03-15') },
      { name: 'রহিমা খাতুন', email: 'rahima@email.com', phone: '01812345682', address: 'উত্তরা, ঢাকা', gender: 'মহিলা', bloodGroup: 'B+', dateOfBirth: new Date('1992-07-22') },
      { name: 'করিম উদ্দিন', email: 'karim@email.com', phone: '01912345683', address: 'মিরপুর, ঢাকা', gender: 'পুরুষ', bloodGroup: 'O+', dateOfBirth: new Date('1975-12-10') },
      { name: 'সালমা বেগম', email: 'salma@email.com', phone: '01612345684', address: 'গুলশান, ঢাকা', gender: 'মহিলা', bloodGroup: 'AB+', dateOfBirth: new Date('1990-12-25') },
      { name: 'জাহিদ হাসান', email: 'jahid@email.com', phone: '01712345685', address: 'বনানী, ঢাকা', gender: 'পুরুষ', bloodGroup: 'A-', dateOfBirth: new Date('1988-07-25') },
      { name: 'ফাতেমা সুলতানা', email: 'fatema@email.com', phone: '01512345686', address: 'বসুন্ধরা, ঢাকা', gender: 'মহিলা', bloodGroup: 'O-', dateOfBirth: new Date('1995-09-10') }
    ]

    for (const patient of patientData) {
      try {
        const created = await prisma.patient.upsert({
          where: { phone: patient.phone },
          update: {},
          create: patient
        })
        patients.push(created)
        console.log(`✅ Created patient: ${patient.name}`)
      } catch (error) {
        console.log(`⚠️ Patient ${patient.name} might already exist`)
      }
    }

    // 3. Medicines (6 entries)
    console.log('💊 Creating medicines...')
    const medicines = []
    
    const medicineData = [
      { sku: 'MED001', name: 'প্যারাসিটামল ৫০০', genericName: 'Paracetamol', category: 'Tablet', manufacturer: 'Square', strength: '500mg', unit: 'piece', purchasePrice: 2.5, sellingPrice: 4.0, stockQty: 500, reorderLevel: 50, batchNumber: 'PAR001' },
      { sku: 'MED002', name: 'নাপা এক্সটেন্ড', genericName: 'Paracetamol ER', category: 'Tablet', manufacturer: 'Beximco', strength: '665mg', unit: 'piece', purchasePrice: 5.0, sellingPrice: 7.5, stockQty: 300, reorderLevel: 30, batchNumber: 'NAP001' },
      { sku: 'MED003', name: 'ইবুপ্রোফেন', genericName: 'Ibuprofen', category: 'Tablet', manufacturer: 'Incepta', strength: '400mg', unit: 'piece', purchasePrice: 6.0, sellingPrice: 9.0, stockQty: 250, reorderLevel: 25, batchNumber: 'IBU001' },
      { sku: 'MED004', name: 'এমোক্সিসিলিন', genericName: 'Amoxicillin', category: 'Capsule', manufacturer: 'Renata', strength: '250mg', unit: 'piece', purchasePrice: 8.0, sellingPrice: 12.0, stockQty: 180, reorderLevel: 20, batchNumber: 'AMX001' },
      { sku: 'MED005', name: 'ওমিপ্রাজল', genericName: 'Omeprazole', category: 'Capsule', manufacturer: 'ACI', strength: '20mg', unit: 'piece', purchasePrice: 15.0, sellingPrice: 22.0, stockQty: 120, reorderLevel: 15, batchNumber: 'OME001' },
      { sku: 'MED006', name: 'সিপ্রোফ্লক্সাসিন', genericName: 'Ciprofloxacin', category: 'Tablet', manufacturer: 'Opsonin', strength: '500mg', unit: 'piece', purchasePrice: 12.0, sellingPrice: 18.0, stockQty: 200, reorderLevel: 30, batchNumber: 'CIP001' }
    ]

    for (const medicine of medicineData) {
      try {
        const created = await prisma.medicine.upsert({
          where: { sku: medicine.sku },
          update: {},
          create: medicine
        })
        medicines.push(created)
        console.log(`✅ Created medicine: ${medicine.name}`)
      } catch (error) {
        console.log(`⚠️ Medicine ${medicine.name} might already exist`)
      }
    }

    // 4. Appointments (6 entries)
    console.log('📅 Creating appointments...')
    const doctors = users.filter(u => u.role === 'doctor')
    
    if (doctors.length > 0 && patients.length > 0) {
      const appointmentData = [
        { patientId: patients[0]?.id, doctorId: doctors[0]?.id, date: new Date('2025-08-15'), time: '10:00', type: 'consultation', status: 'confirmed', notes: 'নিয়মিত চেকআপ' },
        { patientId: patients[1]?.id, doctorId: doctors[1]?.id || doctors[0]?.id, date: new Date('2025-08-15'), time: '11:30', type: 'followup', status: 'confirmed', notes: 'ফলোআপ ভিজিট' },
        { patientId: patients[2]?.id, doctorId: doctors[0]?.id, date: new Date('2025-08-16'), time: '09:00', type: 'consultation', status: 'scheduled', notes: 'জ্বর ও সর্দি' },
        { patientId: patients[3]?.id, doctorId: doctors[2]?.id || doctors[1]?.id, date: new Date('2025-08-16'), time: '14:00', type: 'consultation', status: 'confirmed', notes: 'পেটের সমস্যা' },
        { patientId: patients[4]?.id, doctorId: doctors[1]?.id, date: new Date('2025-08-17'), time: '15:30', type: 'emergency', status: 'completed', notes: 'জরুরি চিকিৎসা' },
        { patientId: patients[5]?.id, doctorId: doctors[0]?.id, date: new Date('2025-08-18'), time: '10:30', type: 'consultation', status: 'pending', notes: 'প্রাথমিক পরীক্ষা' }
      ]

      for (const appointment of appointmentData) {
        if (appointment.patientId && appointment.doctorId) {
          try {
            const created = await prisma.appointment.create({ data: appointment })
            console.log(`✅ Created appointment for ${appointment.notes}`)
          } catch (error) {
            console.log(`⚠️ Error creating appointment: ${error.message}`)
          }
        }
      }
    }

    // 5. Prescriptions (5 entries)
    console.log('📝 Creating prescriptions...')
    
    if (doctors.length > 0 && patients.length > 0 && medicines.length > 0) {
      const prescriptionData = [
        {
          patientId: patients[0]?.id,
          doctorId: doctors[0]?.id,
          date: new Date('2025-08-15'),
          diagnosis: 'জ্বর ও মাথাব্যথা',
          notes: 'প্রচুর পানি পান করুন',
          status: 'issued',
          medicines: [
            { medicineId: medicines[0]?.id, dosage: '১টি', frequency: 'দিনে ৩ বার', duration: '৫ দিন', instructions: 'খাবারের পর', quantity: 15 }
          ]
        },
        {
          patientId: patients[1]?.id,
          doctorId: doctors[1]?.id || doctors[0]?.id,
          date: new Date('2025-08-15'),
          diagnosis: 'গ্যাসের সমস্যা',
          notes: 'তেল-মসলা এড়িয়ে চলুন',
          status: 'issued',
          medicines: [
            { medicineId: medicines[4]?.id, dosage: '১টি', frequency: 'দিনে ১ বার', duration: '১০ দিন', instructions: 'খালি পেটে', quantity: 10 }
          ]
        },
        {
          patientId: patients[2]?.id,
          doctorId: doctors[0]?.id,
          date: new Date('2025-08-16'),
          diagnosis: 'ব্যাকটেরিয়াল ইনফেকশন',
          notes: 'সম্পূর্ণ কোর্স শেষ করুন',
          status: 'issued',
          medicines: [
            { medicineId: medicines[3]?.id, dosage: '১টি', frequency: 'দিনে ৩ বার', duration: '৭ দিন', instructions: 'খাবারের সাথে', quantity: 21 }
          ]
        },
        {
          patientId: patients[3]?.id,
          doctorId: doctors[1]?.id,
          date: new Date('2025-08-16'),
          diagnosis: 'পেটের আলসার',
          notes: 'ধূমপান পরিহা�� করুন',
          status: 'issued',
          medicines: [
            { medicineId: medicines[4]?.id, dosage: '১টি', frequency: 'দিনে ২ বার', duration: '১ৄ দিন', instructions: 'খাবারের আগে', quantity: 28 }
          ]
        },
        {
          patientId: patients[4]?.id,
          doctorId: doctors[1]?.id,
          date: new Date('2025-08-17'),
          diagnosis: 'ভাইরাল ইনফেকশন',
          notes: 'পূর্ণ বিশ্রাম নিন',
          status: 'issued',
          medicines: [
            { medicineId: medicines[0]?.id, dosage: '২টি', frequency: 'দিনে ৩ বার', duration: '৫ দিন', instructions: 'খাবারের পর', quantity: 30 }
          ]
        }
      ]

      for (const prescription of prescriptionData) {
        if (prescription.patientId && prescription.doctorId) {
          try {
            const created = await prisma.prescription.create({
              data: {
                patientId: prescription.patientId,
                doctorId: prescription.doctorId,
                date: prescription.date,
                diagnosis: prescription.diagnosis,
                notes: prescription.notes,
                status: prescription.status,
                medicines: {
                  create: prescription.medicines.filter(m => m.medicineId)
                }
              }
            })
            console.log(`✅ Created prescription: ${prescription.diagnosis}`)
          } catch (error) {
            console.log(`⚠️ Error creating prescription: ${error.message}`)
          }
        }
      }
    }

    // Summary
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.patient.count(),
      prisma.medicine.count(),
      prisma.appointment.count(),
      prisma.prescription.count()
    ])

    console.log('\n🎉 Sample data population completed!')
    console.log('📊 Final counts:')
    console.log(`   👥 Users: ${counts[0]}`)
    console.log(`   🏥 Patients: ${counts[1]}`)
    console.log(`   💊 Medicines: ${counts[2]}`)
    console.log(`   📅 Appointments: ${counts[3]}`)
    console.log(`   📝 Prescriptions: ${counts[4]}`)

    if (counts.every(count => count >= 5)) {
      console.log('\n✅ SUCCESS: All APIs now have 5+ sample data entries!')
    } else {
      console.log('\n⚠️ Some APIs still need more sample data')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the population
populateDatabase()
