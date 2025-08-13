import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users (doctors and staff)
  const doctor1 = await prisma.user.create({
    data: {
      email: 'dr.rahman@srpharma.com',
      name: 'ডা. রহিম উদ্দিন',
      role: 'doctor',
      phone: '01712345678',
    },
  })

  const doctor2 = await prisma.user.create({
    data: {
      email: 'dr.fatema@srpharma.com',
      name: 'ডা. ফাতেমা খাতুন',
      role: 'doctor',
      phone: '01812345679',
    },
  })

  const staff1 = await prisma.user.create({
    data: {
      email: 'admin@srpharma.com',
      name: 'নাসির আহমেদ',
      role: 'admin',
      phone: '01912345680',
    },
  })

  console.log('✅ Users created')

  // Create patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: 'আবুল কাসেম',
        email: 'abul@email.com',
        phone: '01712345681',
        address: 'ধানমন্ডি, ঢাকা',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'পুরুষ',
        bloodGroup: 'A+',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'রহিমা খাতুন',
        email: 'rahima@email.com',
        phone: '01812345682',
        address: 'উত্তরা, ঢাকা',
        dateOfBirth: new Date('1985-08-22'),
        gender: 'মহিলা',
        bloodGroup: 'B+',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'করিম উদ্দিন',
        phone: '01912345683',
        address: 'মিরপুর, ঢাকা',
        dateOfBirth: new Date('1975-12-10'),
        gender: 'পুরুষ',
        bloodGroup: 'O+',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'সালমা বেগম',
        phone: '01612345684',
        address: 'গুলশান, ঢাকা',
        dateOfBirth: new Date('1992-03-18'),
        gender: 'মহি���া',
        bloodGroup: 'AB+',
      },
    }),
    prisma.patient.create({
      data: {
        name: 'জাহিদ হাসান',
        email: 'jahid@email.com',
        phone: '01712345685',
        address: 'বনানী, ঢাকা',
        dateOfBirth: new Date('1988-07-25'),
        gender: 'পুরুষ',
        bloodGroup: 'A-',
      },
    }),
  ])

  console.log('✅ Patients created')

  // Create medicines
  const medicines = await Promise.all([
    prisma.medicine.create({
      data: {
        sku: 'MED001',
        name: 'প্যারাসিটামল',
        genericName: 'Paracetamol',
        category: 'Tablet',
        manufacturer: 'Square Pharmaceuticals',
        strength: '500mg',
        unit: 'piece',
        purchasePrice: 2.00,
        sellingPrice: 3.00,
        stockQty: 500,
        reorderLevel: 50,
        expiryDate: new Date('2025-12-31'),
        batchNumber: 'PAR001',
      },
    }),
    prisma.medicine.create({
      data: {
        sku: 'MED002',
        name: 'নাপা এক্সটেন্ড',
        genericName: 'Paracetamol Extended Release',
        category: 'Tablet',
        manufacturer: 'Beximco Pharmaceuticals',
        strength: '665mg',
        unit: 'piece',
        purchasePrice: 4.50,
        sellingPrice: 6.00,
        stockQty: 250,
        reorderLevel: 30,
        expiryDate: new Date('2025-10-31'),
        batchNumber: 'NAP001',
      },
    }),
    prisma.medicine.create({
      data: {
        sku: 'MED003',
        name: 'সিরাপ',
        genericName: 'Paracetamol Syrup',
        category: 'Syrup',
        manufacturer: 'Incepta Pharmaceuticals',
        strength: '120mg/5ml',
        unit: 'bottle',
        purchasePrice: 45.00,
        sellingPrice: 65.00,
        stockQty: 12,
        reorderLevel: 5,
        expiryDate: new Date('2025-08-31'),
        batchNumber: 'SYR001',
      },
    }),
    prisma.medicine.create({
      data: {
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
        reorderLevel: 25,
        expiryDate: new Date('2025-11-30'),
        batchNumber: 'AMX001',
      },
    }),
    prisma.medicine.create({
      data: {
        sku: 'MED005',
        name: 'ওমিপ্রাজল',
        genericName: 'Omeprazole',
        category: 'Capsule',
        manufacturer: 'ACI Limited',
        strength: '20mg',
        unit: 'piece',
        purchasePrice: 15.00,
        sellingPrice: 22.00,
        stockQty: 8,
        reorderLevel: 15,
        expiryDate: new Date('2025-09-30'),
        batchNumber: 'OME001',
      },
    }),
    prisma.medicine.create({
      data: {
        sku: 'MED006',
        name: 'ইবুপ্রোফেন',
        genericName: 'Ibuprofen',
        category: 'Tablet',
        manufacturer: 'Opsonin Pharma',
        strength: '400mg',
        unit: 'piece',
        purchasePrice: 6.00,
        sellingPrice: 9.00,
        stockQty: 320,
        reorderLevel: 40,
        expiryDate: new Date('2026-01-31'),
        batchNumber: 'IBU001',
      },
    }),
  ])

  console.log('✅ Medicines created')

  // Create appointments
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctor1.id,
        date: new Date('2024-01-15'),
        time: '10:00',
        type: 'consultation',
        status: 'confirmed',
        notes: 'নিয়মিত চেকআপ',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctor2.id,
        date: new Date('2024-01-15'),
        time: '11:30',
        type: 'followup',
        status: 'confirmed',
        notes: 'ফলোআপ চেকআপ',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctor1.id,
        date: new Date('2024-01-16'),
        time: '09:00',
        type: 'consultation',
        status: 'scheduled',
        notes: 'জ্বর ও সর্দির সমস্যা',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[3].id,
        doctorId: doctor2.id,
        date: new Date('2024-01-16'),
        time: '14:00',
        type: 'consultation',
        status: 'confirmed',
        notes: 'পেটের সমস্যা',
      },
    }),
    prisma.appointment.create({
      data: {
        patientId: patients[4].id,
        doctorId: doctor1.id,
        date: new Date('2024-01-17'),
        time: '15:30',
        type: 'emergency',
        status: 'completed',
        notes: 'জরুরি চিকিৎসা',
      },
    }),
  ])

  console.log('✅ Appointments created')

  // Create prescriptions with medicines
  const prescription1 = await prisma.prescription.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctor1.id,
      date: new Date('2024-01-15'),
      diagnosis: 'জ্বর ও মাথাব্যথা',
      notes: 'প্রচুর পানি পান করুন এবং বিশ্রাম নিন',
      status: 'issued',
      medicines: {
        create: [
          {
            medicineId: medicines[0].id,
            dosage: '1টি',
            frequency: 'দিনে ৩ বার',
            duration: '৫ দিন',
            instructions: 'খাবারের পর সেবন করুন',
            quantity: 15,
          },
          {
            medicineId: medicines[5].id,
            dosage: '1টি',
            frequency: 'দিনে ২ বার',
            duration: '৩ দিন',
            instructions: 'খাবারের পর সেবন করুন',
            quantity: 6,
          },
        ],
      },
    },
  })

  const prescription2 = await prisma.prescription.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctor2.id,
      date: new Date('2024-01-15'),
      diagnosis: 'গ্যাসের সমস্যা ও অ্যাসিডিটি',
      notes: 'তেল-মসলা জাতীয় খাবার এড়িয়ে চলুন',
      status: 'issued',
      medicines: {
        create: [
          {
            medicineId: medicines[4].id,
            dosage: '1টি',
            frequency: 'দিনে ১ বার',
            duration: '১০ দিন',
            instructions: 'সকালে খালি পেটে সেবন করুন',
            quantity: 10,
          },
        ],
      },
    },
  })

  console.log('✅ Prescriptions created')

  // Create some sales records
  const sale1 = await prisma.sale.create({
    data: {
      invoiceNo: 'INV-2024-001',
      patientId: patients[0].id,
      totalAmount: 45.00,
      discount: 0,
      tax: 0,
      finalAmount: 45.00,
      paymentMethod: 'cash',
      status: 'completed',
      items: {
        create: [
          {
            medicineId: medicines[0].id,
            quantity: 15,
            unitPrice: 3.00,
            totalPrice: 45.00,
          },
        ],
      },
    },
  })

  const sale2 = await prisma.sale.create({
    data: {
      invoiceNo: 'INV-2024-002',
      patientId: patients[1].id,
      totalAmount: 220.00,
      discount: 10.00,
      tax: 0,
      finalAmount: 210.00,
      paymentMethod: 'card',
      status: 'completed',
      items: {
        create: [
          {
            medicineId: medicines[4].id,
            quantity: 10,
            unitPrice: 22.00,
            totalPrice: 220.00,
          },
        ],
      },
    },
  })

  console.log('✅ Sales created')

  // Create stock movements
  await Promise.all([
    prisma.stockMovement.create({
      data: {
        medicineId: medicines[0].id,
        type: 'sale',
        quantity: -15,
        reason: 'Sold to patient',
        reference: 'INV-2024-001',
      },
    }),
    prisma.stockMovement.create({
      data: {
        medicineId: medicines[4].id,
        type: 'sale',
        quantity: -10,
        reason: 'Sold to patient',
        reference: 'INV-2024-002',
      },
    }),
    prisma.stockMovement.create({
      data: {
        medicineId: medicines[2].id,
        type: 'purchase',
        quantity: 50,
        reason: 'New stock received',
        reference: 'PUR-2024-001',
      },
    }),
  ])

  console.log('✅ Stock movements created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
