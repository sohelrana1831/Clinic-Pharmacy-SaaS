// Email and SMS Templates in Bengali for Clinic Pharmacy Management System

export interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'sms'
  subject?: string // Only for emails
  body: string
  placeholders: string[]
  category: 'appointment' | 'payment' | 'prescription'
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

export const emailTemplates: NotificationTemplate[] = [
  // 1. Appointment Confirmation Email
  {
    id: 'appointment_confirmation_email',
    name: 'অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ ইমেইল',
    type: 'email',
    category: 'appointment',
    subject: '{{clinic_name}} - অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে',
    body: `প্রিয় {{patient_name}},

আপনার অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত হয়েছে।

অ্যাপয়েন্টমেন্টের তথ্য:
• তারিখ ও সময়: {{appointment_date}} - {{appointment_time}}
• ডাক্তার: {{doctor_name}}
• বিভাগ: {{department}}
• ক্লিনিক: {{clinic_name}}
• ঠিকানা: {{clinic_address}}

দয়া করে নির্ধারিত সময়ের ১৫ মিনিট আগে উপস্থিত হন। প্রয়োজনীয় কাগজপত্র এবং পূর্ববর্তী রিপোর্ট সাথে আনতে ভুলবেন না।

কোনো সমস্যা হলে যোগাযোগ করুন: {{clinic_phone}}

ধন্যবাদ,
{{clinic_name}}`,
    placeholders: ['patient_name', 'appointment_date', 'appointment_time', 'doctor_name', 'department', 'clinic_name', 'clinic_address', 'clinic_phone']
  },

  // 2. Appointment Reminder Email
  {
    id: 'appointment_reminder_email',
    name: 'অ্যাপয়েন্টমেন্ট স্মরণ করিয়ে দেওয়া ইমেইল',
    type: 'email',
    category: 'appointment',
    subject: '{{clinic_name}} - আগামীকাল আপনার অ্যাপয়েন্টমেন্ট',
    body: `প্রিয় {{patient_name}},

এটি একটি স্মরণ করিয়ে দেওয়ার বার্তা যে আগামীকাল আপনার অ্যাপয়েন্টমেন্ট রয়েছে।

অ্যা���য়েন্টমেন্টের তথ্য:
• তারিখ ও সময়: {{appointment_date}} - {{appointment_time}}
• ডাক্তার: {{doctor_name}}
• বিভাগ: {{department}}
• ক্লিনিক: {{clinic_name}}

অনুগ্রহ করে:
- নির্ধারিত সময়ের ১৫ মিনিট আগে আসুন
- সকল প্রয়োজনীয় কাগজপত্র সাথে আনুন
- অসুস্থতার কারণে আসতে না পারলে আগাম জানান

পরিবর্তন বা বাতিলের জন্য: {{clinic_phone}}

শুভেচ্ছা,
{{clinic_name}}`,
    placeholders: ['patient_name', 'appointment_date', 'appointment_time', 'doctor_name', 'department', 'clinic_name', 'clinic_phone']
  },

  // 3. Payment Receipt Email
  {
    id: 'payment_receipt_email',
    name: 'পেমেন্ট রিসিট ইমেইল',
    type: 'email',
    category: 'payment',
    subject: '{{clinic_name}} - পেমেন্ট রিসিট #{{receipt_number}}',
    body: `প্রিয় {{patient_name}},

আপনার পেমেন্ট সফলভাবে গ্রহণ করা হয়েছে। নিচে পেম���ন্টের বিস্তারিত তথ্য দেওয়া হলো:

পেমেন্টের তথ্য:
• রিসিট নম্বর: {{receipt_number}}
• তারিখ: {{payment_date}}
• পরিমাণ: {{amount}} টাকা
• পেমেন্ট পদ্ধতি: {{payment_method}}
• উদ্দেশ্য: {{payment_purpose}}

সেবার বিবরণ:
{{service_details}}

এই রিসিটটি সংরক্ষণ করুন। প্রয়োজনে দেখানোর জন্য এটি প্রিন্ট করে রাখতে পারেন।

যেকোনো প্রশ্নের জন্য যোগাযোগ করুন: {{clinic_phone}}

ধন্যবাদ,
{{clinic_name}}
{{clinic_address}}`,
    placeholders: ['patient_name', 'receipt_number', 'payment_date', 'amount', 'payment_method', 'payment_purpose', 'service_details', 'clinic_name', 'clinic_phone', 'clinic_address']
  },

  // 4. Prescription Ready Email
  {
    id: 'prescription_ready_email',
    name: 'প্রেসক্রিপশন প্রস্তুত ইমেইল',
    type: 'email',
    category: 'prescription',
    subject: '{{clinic_name}} - আপনার ওষুধ প্রস্তুত',
    body: `প্রিয় {{patient_name}},

আপনার প্রেসক্রিপশনের ওষুধ প্রস্তুত হয়েছে এবং সংগ্রহের জন্য অপেক্ষমান।

প্রেসক্রিপশনের তথ্য:
• প্রেসক্রিপশন নম্বর: {{prescription_number}}
• ডাক্তার: {{doctor_name}}
• তৈরির তারিখ: {{prepared_date}}
• মোট ওষুধ: {{total_medicines}} টি
• মোট মূল্য: {{total_amount}} টাকা

সংগ্রহের নির্দেশনা:
• সংগ্রহের সময়: {{pharmacy_hours}}
• ঠিকানা: {{clinic_address}}
• যোগাযোগ: {{clinic_phone}}

সংগ্রহের সময় এই ইমেইল বা আইডি কার্ড সাথে আনুন। ওষুধ সংরক্ষণের নির্দেশনা মেনে চলুন।

ধন্যবাদ,
{{clinic_name}} ফার্মেসি`,
    placeholders: ['patient_name', 'prescription_number', 'doctor_name', 'prepared_date', 'total_medicines', 'total_amount', 'pharmacy_hours', 'clinic_address', 'clinic_phone', 'clinic_name']
  }
]

// =============================================================================
// SMS TEMPLATES
// =============================================================================

export const smsTemplates: NotificationTemplate[] = [
  // 1. Appointment Confirmation SMS
  {
    id: 'appointment_confirmation_sms',
    name: 'অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ এসএমএস',
    type: 'sms',
    category: 'appointment',
    body: `{{clinic_name}}: আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে।

তারিখ: {{appointment_date}}
সময়: {{appointment_time}}
ডাক্তার: {{doctor_name}}

১৫ মিনিট আগে আসুন। প্রয়োজনীয় কাগজপত্র সাথে আনুন।

যোগাযোগ: {{clinic_phone}}`,
    placeholders: ['clinic_name', 'appointment_date', 'appointment_time', 'doctor_name', 'clinic_phone']
  },

  // 2. Appointment Reminder SMS
  {
    id: 'appointment_reminder_sms',
    name: 'অ্যাপয়েন্টমেন্ট স্মরণ করিয়ে দেওয়া এসএমএস',
    type: 'sms',
    category: 'appointment',
    body: `{{clinic_name}}: স্মরণ করিয়ে দেওয়�� হচ্ছে।

আগামীকাল আপনার অ্যাপয়েন্টমেন্ট:
সময়: {{appointment_time}}
ডাক্তার: {{doctor_name}}

১৫ মিনিট আগে আসুন। প্রয়োজনীয় কাগজপত্র আনতে ভুলবেন না।

পরিবর্তনের জন্য: {{clinic_phone}}`,
    placeholders: ['clinic_name', 'appointment_time', 'doctor_name', 'clinic_phone']
  },

  // 3. Payment Receipt SMS
  {
    id: 'payment_receipt_sms',
    name: 'পেমেন্ট রিসিট এসএমএস',
    type: 'sms',
    category: 'payment',
    body: `{{clinic_name}}: পেমেন্ট সফল হয়েছে।

রিসিট: {{receipt_number}}
পরিমাণ: {{amount}} টাকা
তারিখ: {{payment_date}}
উদ্দেশ্য: {{payment_purpose}}

এই বার্তাটি সংরক্ষণ করুন।

ধন্যবাদ।`,
    placeholders: ['clinic_name', 'receipt_number', 'amount', 'payment_date', 'payment_purpose']
  },

  // 4. Prescription Ready SMS
  {
    id: 'prescription_ready_sms',
    name: 'প্রেসক্রিপশন প্রস্তুত এসএমএস',
    type: 'sms',
    category: 'prescription',
    body: `{{clinic_name}}: আপনার ওষুধ প্রস্তুত।

প্রেসক্রিপশন: {{prescription_number}}
মোট: {{total_amount}} টাকা
সংগ্রহের সময়: {{pharmacy_hours}}

এই বার্তা দেখিয়ে ওষুধ সংগ্রহ করুন।

যোগাযোগ: {{clinic_phone}}`,
    placeholders: ['clinic_name', 'prescription_number', 'total_amount', 'pharmacy_hours', 'clinic_phone']
  }
]

// =============================================================================
// TEMPLATE UTILITY FUNCTIONS
// =============================================================================

export const getTemplateById = (templateId: string): NotificationTemplate | undefined => {
  return [...emailTemplates, ...smsTemplates].find(template => template.id === templateId)
}

export const getTemplatesByCategory = (category: string): NotificationTemplate[] => {
  return [...emailTemplates, ...smsTemplates].filter(template => template.category === category)
}

export const getEmailTemplates = (): NotificationTemplate[] => {
  return emailTemplates
}

export const getSmsTemplates = (): NotificationTemplate[] => {
  return smsTemplates
}

// Template rendering function
export const renderTemplate = (template: NotificationTemplate, data: Record<string, string>): { subject?: string; body: string } => {
  let renderedBody = template.body
  let renderedSubject = template.subject

  // Replace placeholders in body
  for (const placeholder of template.placeholders) {
    const value = data[placeholder] || `{{${placeholder}}}`
    renderedBody = renderedBody.replace(new RegExp(`{{${placeholder}}}`, 'g'), value)
  }

  // Replace placeholders in subject (for emails)
  if (renderedSubject) {
    for (const placeholder of template.placeholders) {
      const value = data[placeholder] || `{{${placeholder}}}`
      renderedSubject = renderedSubject.replace(new RegExp(`{{${placeholder}}}`, 'g'), value)
    }
  }

  return {
    subject: renderedSubject,
    body: renderedBody
  }
}

// Sample data for testing templates
export const sampleTemplateData = {
  // Patient Information
  patient_name: 'জনাব আবুল কাশেম',
  
  // Appointment Information
  appointment_date: '১৫ জানুয়ারি, ২০২৪',
  appointment_time: 'সকাল ১০:৩০',
  doctor_name: 'ডা. ফাতেমা খাতুন',
  department: 'সাধারণ চিকিৎসা',
  
  // Clinic Information
  clinic_name: 'SR Pharma & Clinic',
  clinic_address: 'বাড়ি-১২৩, রোড-৪, ধানমন্ডি, ঢাকা-১২০৫',
  clinic_phone: '০১৭০০-০০০০০০',
  pharmacy_hours: 'সকাল ৮টা - রাত ১০টা',
  
  // Payment Information
  receipt_number: 'RC-2024-001',
  payment_date: '১৫ জানুয়ারি, ২০২ৄ',
  amount: '৫০০',
  payment_method: 'নগদ',
  payment_purpose: 'চিকিৎসা পরামর্শ',
  service_details: 'চিকিৎসা পরামর্শ - ৩০০ টাকা\nওষুধ - ২০০ টাকা',
  
  // Prescription Information
  prescription_number: 'PX-2024-001',
  prepared_date: '১৫ জানুয়ারি, ২০২৪',
  total_medicines: '৫',
  total_amount: '৮৫০'
}

// Template categories for UI
export const templateCategories = [
  { id: 'appointment', name: 'অ্যাপয়েন্টমেন্ট', icon: 'Calendar' },
  { id: 'payment', name: 'পেমেন্ট', icon: 'CreditCard' },
  { id: 'prescription', name: 'প্রেসক্রিপশন', icon: 'FileText' }
]

// Character limits for SMS (Bengali text takes more space)
export const SMS_CHARACTER_LIMITS = {
  bengali: 160, // For Bengali Unicode SMS
  english: 160, // For English SMS
  unicode: 70   // For mixed content
}

// Validate template before sending
export const validateTemplate = (template: NotificationTemplate, data: Record<string, string>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Check if all required placeholders have data
  for (const placeholder of template.placeholders) {
    if (!data[placeholder]) {
      errors.push(`অনুপস্থিত তথ্য: ${placeholder}`)
    }
  }
  
  // Check SMS character limit
  if (template.type === 'sms') {
    const rendered = renderTemplate(template, data)
    if (rendered.body.length > SMS_CHARACTER_LIMITS.bengali) {
      errors.push(`এসএমএস খুব দীর্ঘ: ${rendered.body.length} অক্ষর (সর্বোচ্চ ${SMS_CHARACTER_LIMITS.bengali})`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
