import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createSampleData() {
  console.log('🌱 Creating comprehensive sample data...')

  try {
    // 1. Create 5+ Users (Doctors, Staff, etc.)
    console.log('👥 Creating users...')
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'dr.rahim@srpharma.com' },
        update: {},
        create: {
          email: 'dr.rahim@srpharma.com',
          name: 'ডা. রহিম উদ্দিন',
          role: 'doctor',
          phone: '01712345671',
        },
      }),
      prisma.user.upsert({
        where: { email: 'dr.fatema@srpharma.com' },
        update: {},
        create: {
          email: 'dr.fatema@srpharma.com',
          name: 'ডা. ফাতেমা খাতুন',
          role: 'doctor',
          phone: '01812345672',
        },
      }),
      prisma.user.upsert({
        where: { email: 'dr.karim@srpharma.com' },
        update: {},
        create: {
          email: 'dr.karim@srpharma.com',
          name: 'ডা. করিম হাসান',
          role: 'doctor',
          phone: '01912345673',
        },
      }),
      prisma.user.upsert({
        where: { email: 'pharmacist.nasir@srpharma.com' },
        update: {},
        create: {
          email: 'pharmacist.nasir@srpharma.com',
          name: 'ফার্মাসিস্ট নাসির আহমেদ',
          role: 'pharmacist',
          phone: '01612345674',
        },
      }),
      prisma.user.upsert({
        where: { email: 'reception.salma@srpharma.com' },
        update: {},
        create: {
          email: 'reception.salma@srpharma.com',
          name: 'রিসেপশনিস্ট সালমা বেগম',
          role: 'receptionist',
          phone: '01512345675',
        },
      }),
      prisma.user.upsert({
        where: { email: 'admin.ahmed@srpharma.com' },
        update: {},
        create: {
          email: 'admin.ahmed@srpharma.com',
          name: 'অ্যাডমিন আহমেদ হাসান',
          role: 'admin',
          phone: '01712345676',
        },
      }),
    ])
    console.log(`✅ Created ${users.length} users`)

    // 2. Create 5+ Patients
    console.log('🏥 Creating patients...')
    const patients = await Promise.all([
      prisma.patient.upsert({
        where: { phone: '01712345681' },
        update: {},
        create: {
          name: 'আবুল কাসেম মিয়া',
          email: 'abul.kasem@email.com',
          phone: '01712345681',
          address: 'ধানমন্ডি ৩২, ঢাকা-১২০৫',
          dateOfBirth: new Date('1985-03-15'),
          gender: 'পুরুষ',
          bloodGroup: 'A+',
        },
      }),
      prisma.patient.upsert({
        where: { phone: '01812345682' },
        update: {},
        create: {
          name: 'রহিমা খাতুন',
          email: 'rahima.khatun@email.com',
          phone: '01812345682',
          address: 'উত্তরা সেক্টর ৭, ঢাকা-১২৩০',
          dateOfBirth: new Date('1992-07-22'),
          gender: 'মহিলা',
          bloodGroup: 'B+',
        },
      }),
      prisma.patient.upsert({
        where: { phone: '01912345683' },
        update: {},
        create: {
          name: 'করিম উদ্দিন চৌধুরী',
          email: 'karim.uddin@email.com',
          phone: '01912345683',
          address: 'মিরপুর ১০, ঢাকা-১২১৬',
          dateOfBirth: new Date('1975-12-10'),
          gender: 'পুরুষ',
          bloodGroup: 'O+',
        },
      }),
      prisma.patient.upsert({
        where: { phone: '01612345684' },
        update: {},
        create: {
          name: 'সালমা বেগম',
          email: 'salma.begum@email.com',
          phone: '01612345684',
          address: 'গুলশান ২, ঢাকা-১২১২',
          dateOfBirth: new Date('1990-12-25'),
          gender: 'মহিলা',
          bloodGroup: 'AB+',
        },
      }),
      prisma.patient.upsert({
        where: { phone: '01712345685' },
        update: {},
        create: {
          name: 'জাহিদ হাসান',
          email: 'jahid.hasan@email.com',
          phone: '01712345685',
          address: 'বনানী, ঢাকা-১২১৩',
          dateOfBirth: new Date('1988-07-25'),
          gender: 'পুরুষ',
          bloodGroup: 'A-',
        },
      }),
      prisma.patient.upsert({
        where: { phone: '01512345686' },
        update: {},
        create: {
          name: 'ফাতেমা সুলতানা',
          email: 'fatema.sultana@email.com',
          phone: '01512345686',
          address: 'বসুন্ধরা আর/এ, ঢাকা-১২২৯',
          dateOfBirth: new Date('1995-09-10'),
          gender: 'মহিলা',
          bloodGroup: 'O-',
        },
      }),
    ])
    console.log(`✅ Created ${patients.length} patients`)

    // 3. Create 5+ Medicines
    console.log('💊 Creating medicines...')
    const medicines = await Promise.all([
      prisma.medicine.upsert({
        where: { sku: 'MED001' },
        update: {},
        create: {
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
          expiryDate: new Date('2025-12-31'),
          batchNumber: 'PAR2024001',
        },
      }),
      prisma.medicine.upsert({
        where: { sku: 'MED002' },
        update: {},
        create: {
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
          expiryDate: new Date('2025-10-31'),
          batchNumber: 'NAP2024001',
        },
      }),
      prisma.medicine.upsert({
        where: { sku: 'MED003' },
        update: {},
        create: {
          sku: 'MED003',
          name: 'ইবুপ্রোফেন ৪০০',
          genericName: 'Ibuprofen',
          category: 'Tablet',
          manufacturer: 'Incepta Pharmaceuticals',
          strength: '400mg',
          unit: 'piece',
          purchasePrice: 6.00,
          sellingPrice: 9.00,
          stockQty: 250,
          reorderLevel: 25,
          expiryDate: new Date('2025-09-30'),
          batchNumber: 'IBU2024001',
        },
      }),
      prisma.medicine.upsert({
        where: { sku: 'MED004' },
        update: {},
        create: {
          sku: 'MED004',
          name: 'এমোক্সিসিলিন ২৫০',
          genericName: 'Amoxicillin',
          category: 'Capsule',
          manufacturer: 'Renata Limited',
          strength: '250mg',
          unit: 'piece',
          purchasePrice: 8.00,
          sellingPrice: 12.00,
          stockQty: 180,
          reorderLevel: 20,
          expiryDate: new Date('2025-11-30'),
          batchNumber: 'AMX2024001',
        },
      }),
      prisma.medicine.upsert({
        where: { sku: 'MED005' },
        update: {},
        create: {
          sku: 'MED005',
          name: 'ওমিপ্রাজল ২০',
          genericName: 'Omeprazole',
          category: 'Capsule',
          manufacturer: 'ACI Limited',
          strength: '20mg',
          unit: 'piece',
          purchasePrice: 15.00,
          sellingPrice: 22.00,
          stockQty: 120,
          reorderLevel: 15,
          expiryDate: new Date('2025-08-31'),
          batchNumber: 'OME2024001',
        },
      }),
      prisma.medicine.upsert({
        where: { sku: 'MED006' },
        update: {},
        create: {
          sku: 'MED006',
          name: 'সিপ্রোফ্লক্সাসিন',
          genericName: 'Ciprofloxacin',
          category: 'Tablet',
          manufacturer: 'Opsonin Pharma',
          strength: '500mg',
          unit: 'piece',
          purchasePrice: 12.00,
          sellingPrice: 18.00,
          stockQty: 200,
          reorderLevel: 30,
          expiryDate: new Date('2026-01-31'),
          batchNumber: 'CIP2024001',
        },
      }),
    ])
    console.log(`✅ Created ${medicines.length} medicines`)

    // Get doctors for appointments
    const doctors = users.filter(u => u.role === 'doctor')

    // 4. Create 5+ Appointments
    console.log('📅 Creating appointments...')
    const appointments = await Promise.all([
      prisma.appointment.create({
        data: {
          patientId: patients[0].id,
          doctorId: doctors[0].id,
          date: new Date('2025-08-15'),
          time: '10:00',
          type: 'consultation',
          status: 'confirmed',
          notes: 'নিয়মিত চেকআপ এবং ব্লাড প্রেশার পরীক্ষা',
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patients[1].id,
          doctorId: doctors[1].id,
          date: new Date('2025-08-15'),
          time: '11:30',
          type: 'followup',
          status: 'confirmed',
          notes: 'ফলোআপ ভিজিট - জ্বরের জন্য',
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patients[2].id,
          doctorId: doctors[0].id,
          date: new Date('2025-08-16'),
          time: '09:00',
          type: 'consultation',
          status: 'scheduled',
          notes: 'জ্বর ও সর্দির সমস্যা',
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patients[3].id,
          doctorId: doctors[2] || doctors[1],
          date: new Date('2025-08-16'),
          time: '14:00',
          type: 'consultation',
          status: 'confirmed',
          notes: 'পেটের সমস্যা এবং অ্যাসিডিটি',
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patients[4].id,
          doctorId: doctors[1].id,
          date: new Date('2025-08-17'),
          time: '15:30',
          type: 'emergency',
          status: 'completed',
          notes: 'জরুরি চিকিৎসা - উচ্চ জ্বর',
        },
      }),
      prisma.appointment.create({
        data: {
          patientId: patients[5].id,
          doctorId: doctors[0].id,
          date: new Date('2025-08-18'),
          time: '10:30',
          type: 'consultation',
          status: 'pending',
          notes: 'প্রাথমিক প���ীক্ষা',
        },
      }),
    ])
    console.log(`✅ Created ${appointments.length} appointments`)

    // 5. Create 5+ Prescriptions
    console.log('📝 Creating prescriptions...')
    const prescriptions = await Promise.all([
      prisma.prescription.create({
        data: {
          patientId: patients[0].id,
          doctorId: doctors[0].id,
          date: new Date('2025-08-15'),
          diagnosis: 'জ্বর ও মাথাব্যথা',
          notes: 'প্রচুর পানি পান করুন এবং বিশ্রাম নিন',
          status: 'issued',
          medicines: {
            create: [
              {
                medicineId: medicines[0].id,
                dosage: '১টি',
                frequency: 'দিনে ৩ বার',
                duration: '৫ দিন',
                instructions: 'খাবারের পর সেবন করুন',
                quantity: 15,
              },
              {
                medicineId: medicines[2].id,
                dosage: '১টি',
                frequency: 'দিনে ২ বার',
                duration: '৩ দিন',
                instructions: 'ব্যথার সময় সেবন করুন',
                quantity: 6,
              },
            ],
          },
        },
      }),
      prisma.prescription.create({
        data: {
          patientId: patients[1].id,
          doctorId: doctors[1].id,
          date: new Date('2025-08-15'),
          diagnosis: 'গ্যাসের সমস্যা ও অ্যাসিডিটি',
          notes: 'তেল-মসলা জাতীয় খাবার এড়িয়ে চলুন',
          status: 'issued',
          medicines: {
            create: [
              {
                medicineId: medicines[4].id,
                dosage: '১টি',
                frequency: 'দিনে ১ বার',
                duration: '১০ দিন',
                instructions: 'সকালে খালি পেটে সেবন করুন',
                quantity: 10,
              },
            ],
          },
        },
      }),
      prisma.prescription.create({
        data: {
          patientId: patients[2].id,
          doctorId: doctors[0].id,
          date: new Date('2025-08-16'),
          diagnosis: 'ব্যাকটেরিয়াল ইনফেকশন',
          notes: 'সম্পূর্ণ কোর্স শেষ করুন',
          status: 'issued',
          medicines: {
            create: [
              {
                medicineId: medicines[3].id,
                dosage: '১টি',
                frequency: 'দিনে ৩ বার',
                duration: '৭ দিন',
                instructions: 'খাবারের সাথে সেবন করুন',
                quantity: 21,
              },
            ],
          },
        },
      }),
      prisma.prescription.create({
        data: {
          patientId: patients[3].id,
          doctorId: doctors[2] || doctors[1],
          date: new Date('2025-08-16'),
          diagnosis: 'পেটের আলসার',
          notes: 'ধূমপান ও অ্যালকোহল পরিহার করুন',
          status: 'issued',
          medicines: {
            create: [
              {
                medicineId: medicines[4].id,
                dosage: '১টি',
                frequency: 'দিনে ২ বার',
                duration: '১৪ দিন',
                instructions: 'খাবারের আগে সেবন করুন',
                quantity: 28,
              },
              {
                medicineId: medicines[0].id,
                dosage: '১টি',
                frequency: 'প্রয়োজনে',
                duration: '৭ দিন',
                instructions: 'ব্যথার সময় সেবন করুন',
                quantity: 10,
              },
            ],
          },
        },
      }),
      prisma.prescription.create({
        data: {
          patientId: patients[4].id,
          doctorId: doctors[1].id,
          date: new Date('2025-08-17'),
          diagnosis: 'উচ্চ জ্বর ও ভাইরাল ইনফেকশন',
          notes: 'পূর্ণ বিশ্রাম নিন এবং প্রচুর তরল পান করুন',
          status: 'issued',
          medicines: {
            create: [
              {
                medicineId: medicines[0].id,
                dosage: '২টি',
                frequency: 'দিনে ৩ বার',
                duration: '৫ দিন',
                instructions: 'খাবারের পর সেবন করুন',
                quantity: 30,
              },
              {
                medicineId: medicines[5].id,
                dosage: '১টি',
                frequency: 'দিনে ২ বার',
                duration: '৫ দিন',
                instructions: 'সংক্রমণ প্রতিরোধে',
                quantity: 10,
              },
            ],
          },
        },
      }),
    ])
    console.log(`✅ Created ${prescriptions.length} prescriptions`)

    console.log('\n🎉 Sample data creation completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   👥 Users: ${users.length}`)
    console.log(`   🏥 Patients: ${patients.length}`)
    console.log(`   💊 Medicines: ${medicines.length}`)
    console.log(`   📅 Appointments: ${appointments.length}`)
    console.log(`   📝 Prescriptions: ${prescriptions.length}`)

  } catch (error) {
    console.error('❌ Error creating sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Export for use in other files
if (require.main === module) {
  createSampleData()
}

export { createSampleData }
