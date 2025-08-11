// Subscription Plans and Data Models

export interface SubscriptionPlan {
  id: string
  name: string
  nameEn: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  featuresEn: string[]
  popular?: boolean
  maxPatients: number | 'unlimited'
  maxBranches: number
  maxUsers: number
  supportLevel: 'basic' | 'priority' | '24x7'
  color: string
}

export interface Subscription {
  id: string
  clinicId: string
  planId: string
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  nextBillingDate: string
  amount: number
  currency: string
  paymentMethod: 'sslcommerz' | 'stripe'
  invoices: Invoice[]
}

export interface Invoice {
  id: string
  subscriptionId: string
  invoiceNumber: string
  date: string
  dueDate: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed' | 'cancelled'
  paymentMethod: 'sslcommerz' | 'stripe'
  downloadUrl?: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  description: string
  period: string
  amount: number
  quantity: number
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  redirectUrl?: string
}

// Sample Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'বেসিক',
    nameEn: 'Basic',
    price: 2500,
    currency: 'BDT',
    interval: 'monthly',
    features: [
      '১০০ রোগীর রেকর্ড',
      'অ্যাপয়েন্টমেন্ট বুকিং',
      'বেসিক রিপোর্ট',
      'ইমেইল সাপোর্ট',
      '১ ব্যবহারকারী'
    ],
    featuresEn: [
      '100 Patient Records',
      'Appointment Booking',
      'Basic Reports',
      'Email Support',
      '1 User'
    ],
    maxPatients: 100,
    maxBranches: 1,
    maxUsers: 1,
    supportLevel: 'basic',
    color: 'blue'
  },
  {
    id: 'pro',
    name: 'প্রো',
    nameEn: 'Pro',
    price: 4500,
    currency: 'BDT',
    interval: 'monthly',
    features: [
      '৫০০ রোগীর রেকর্ড',
      'ফার্মেসি ইনভেন্টরি',
      'SMS নোটিফিকেশন',
      'অ্যাডভান্স রিপোর্ট',
      'প্রাইওরিটি সাপোর্ট',
      '৩ ব্যবহারকারী'
    ],
    featuresEn: [
      '500 Patient Records',
      'Pharmacy Inventory',
      'SMS Notifications',
      'Advanced Reports',
      'Priority Support',
      '3 Users'
    ],
    popular: true,
    maxPatients: 500,
    maxBranches: 1,
    maxUsers: 3,
    supportLevel: 'priority',
    color: 'emerald'
  },
  {
    id: 'enterprise',
    name: 'এন্টারপ্রাইজ',
    nameEn: 'Enterprise',
    price: 8000,
    currency: 'BDT',
    interval: 'monthly',
    features: [
      'আনলিমিটেড রোগী',
      'মাল্টি-ব্রাঞ্চ সাপোর্ট',
      'অ্যাডভান্স অ্যানালিটিক্স',
      'API অ্যাক্সেস',
      '২৪x৭ সাপোর্ট',
      'আনলিমিটেড ব্যবহারকারী'
    ],
    featuresEn: [
      'Unlimited Patients',
      'Multi-Branch Support',
      'Advanced Analytics',
      'API Access',
      '24x7 Support',
      'Unlimited Users'
    ],
    maxPatients: 'unlimited',
    maxBranches: 10,
    maxUsers: 999,
    supportLevel: '24x7',
    color: 'purple'
  }
]

// Sample Current Subscription
export const currentSubscription: Subscription = {
  id: 'sub_001',
  clinicId: 'clinic_sr_pharma',
  planId: 'pro',
  status: 'active',
  currentPeriodStart: '2024-01-01',
  currentPeriodEnd: '2024-02-01',
  nextBillingDate: '2024-02-01',
  amount: 4500,
  currency: 'BDT',
  paymentMethod: 'sslcommerz',
  invoices: [
    {
      id: 'inv_001',
      subscriptionId: 'sub_001',
      invoiceNumber: 'INV-2024-001',
      date: '2024-01-01',
      dueDate: '2024-01-15',
      amount: 4500,
      currency: 'BDT',
      status: 'paid',
      paymentMethod: 'sslcommerz',
      downloadUrl: '/api/invoices/inv_001/download',
      items: [
        {
          description: 'প্রো প্ল্যান সাবস্ক্রিপশন',
          period: 'জানুয়ারি ২০২৪',
          amount: 4500,
          quantity: 1
        }
      ]
    },
    {
      id: 'inv_002',
      subscriptionId: 'sub_001',
      invoiceNumber: 'INV-2024-002',
      date: '2024-02-01',
      dueDate: '2024-02-15',
      amount: 4500,
      currency: 'BDT',
      status: 'pending',
      paymentMethod: 'sslcommerz',
      items: [
        {
          description: 'প্রো প্ল্যান সাবস্ক্রিপশন',
          period: 'ফেব্রুয়ারি ২০২৪',
          amount: 4500,
          quantity: 1
        }
      ]
    }
  ]
}

// Payment Integration Points
export const paymentProviders = {
  sslcommerz: {
    name: 'SSLCommerz',
    region: 'Bangladesh',
    currency: 'BDT',
    methods: ['card', 'mobile_banking', 'internet_banking', 'digital_wallet'],
    logo: '/images/sslcommerz-logo.png',
    description: 'বাংলাদেশের জন্য সুরক্ষিত পেমেন্ট গেটওয়ে'
  },
  stripe: {
    name: 'Stripe',
    region: 'Global',
    currency: 'USD',
    methods: ['card', 'bank_transfer', 'digital_wallet'],
    logo: '/images/stripe-logo.png',
    description: 'Global secure payment processing'
  }
}

// Utility Functions
export const formatCurrency = (amount: number, currency: string) => {
  if (currency === 'BDT') {
    return `৳${amount.toLocaleString()}`
  }
  return `$${amount.toLocaleString()}`
}

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'past_due':
      return 'bg-yellow-100 text-yellow-800'
    case 'unpaid':
      return 'bg-red-100 text-red-800'
    case 'trialing':
      return 'bg-blue-100 text-blue-800'
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'active': 'সক্রিয়',
    'cancelled': 'বাতিল',
    'past_due': 'বকেয়া',
    'unpaid': 'অপরিশোধিত',
    'trialing': 'ট্রায়াল',
    'paid': 'পরিশোধিত',
    'pending': 'অপেক্ষমান',
    'failed': 'ব্যর্থ'
  }
  return statusMap[status] || status
}

// Mock Payment Processing
export const processPayment = async (planId: string, paymentMethod: 'sslcommerz' | 'stripe'): Promise<PaymentResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simulate success/failure (90% success rate)
  const success = Math.random() > 0.1
  
  if (success) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      redirectUrl: '/billing/success'
    }
  } else {
    return {
      success: false,
      error: 'Payment failed. Please try again.'
    }
  }
}

// Sample Admin Data
export const adminClinicData = [
  {
    id: 'clinic_001',
    name: 'SR Pharma',
    email: 'admin@srpharma.com',
    planId: 'pro',
    status: 'active',
    billingDate: '2024-02-01',
    revenue: 4500,
    joinDate: '2023-06-15'
  },
  {
    id: 'clinic_002',
    name: 'City Health Clinic',
    email: 'info@cityhealth.com',
    planId: 'enterprise',
    status: 'active',
    billingDate: '2024-01-28',
    revenue: 8000,
    joinDate: '2023-08-22'
  },
  {
    id: 'clinic_003',
    name: 'Digital Care Center',
    email: 'admin@digitalcare.com',
    planId: 'basic',
    status: 'past_due',
    billingDate: '2024-01-20',
    revenue: 2500,
    joinDate: '2023-11-10'
  }
]
