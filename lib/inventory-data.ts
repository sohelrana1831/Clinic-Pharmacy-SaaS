export interface InventoryItem {
  id: string
  sku: string
  name: string
  genericName?: string
  category: string
  stockQty: number
  unitPrice: number
  purchasePrice: number
  reorderLevel: number
  manufacturer: string
  description?: string
  batches: Batch[]
  createdAt: string
  updatedAt: string
}

export interface Batch {
  id: string
  batchNumber: string
  expiryDate: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
  remaining: number
}

export interface SaleItem {
  id: string
  medicineId: string
  medicineName: string
  sku: string
  quantity: number
  unitPrice: number
  discount: number
  lineTotal: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  totalDiscount: number
  grandTotal: number
  paymentMethod: 'cash' | 'card' | 'mobile'
  customerPhone?: string
  customerName?: string
  cashierId: string
  createdAt: string
  status: 'completed' | 'pending' | 'cancelled'
}

// Medicine categories
export const medicineCategories = [
  'অ্যান্টিবায়োটিক',
  'ব্যথানাশক',
  'জ্বরের ওষুধ',
  'ডায়াবেটিসের ওষুধ',
  'হার্টের ওষুধ',
  'চোখের ওষুধ',
  'চর্মরোগের ওষুধ',
  'গ্যাস্ট্রিকের ওষুধ',
  'ভিটামিন ও মিনারেল',
  'শিশুদের ওষুধ',
  'অন্যান্য'
]

// Sample inventory data
export const sampleInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'MED-001',
    name: 'প্যারাসিটামল ৫০০mg',
    genericName: 'Paracetamol',
    category: 'ব্যথানাশক',
    stockQty: 450,
    unitPrice: 2,
    purchasePrice: 1.5,
    reorderLevel: 100,
    manufacturer: 'স্কয়ার ফার্মা',
    description: 'জ্বর ও ব্যথার জন্য',
    batches: [
      {
        id: 'batch-1',
        batchNumber: 'PAR2024001',
        expiryDate: '2025-12-31',
        quantity: 500,
        purchasePrice: 1.5,
        purchaseDate: '2024-01-15',
        remaining: 450
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 'inv-2',
    sku: 'MED-002',
    name: 'ওমিপ্রাজল ২০mg',
    genericName: 'Omeprazole',
    category: 'গ্যাস্ট্রিকের ওষুধ',
    stockQty: 25,
    unitPrice: 5,
    purchasePrice: 3.5,
    reorderLevel: 50,
    manufacturer: 'ইনসেপ্টা ফার্মা',
    batches: [
      {
        id: 'batch-2',
        batchNumber: 'OMP2024001',
        expiryDate: '2025-06-30',
        quantity: 100,
        purchasePrice: 3.5,
        purchaseDate: '2024-01-10',
        remaining: 25
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: 'inv-3',
    sku: 'MED-003',
    name: 'মেটফরমিন ৫০০mg',
    genericName: 'Metformin',
    category: 'ডায়াবেটিসের ওষুধ',
    stockQty: 320,
    unitPrice: 3,
    purchasePrice: 2,
    reorderLevel: 80,
    manufacturer: 'স্কয়ার ফার্মা',
    batches: [
      {
        id: 'batch-3',
        batchNumber: 'MET2024001',
        expiryDate: '2026-03-31',
        quantity: 500,
        purchasePrice: 2,
        purchaseDate: '2024-01-05',
        remaining: 320
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-05'
  },
  {
    id: 'inv-4',
    sku: 'MED-004',
    name: 'এজিথ্রোমাইসিন ২৫০mg',
    genericName: 'Azithromycin',
    category: 'অ্যান্টিবায়োটিক',
    stockQty: 15,
    unitPrice: 15,
    purchasePrice: 12,
    reorderLevel: 30,
    manufacturer: 'বেক্সিমকো ফার্মা',
    batches: [
      {
        id: 'batch-4',
        batchNumber: 'AZI2024001',
        expiryDate: '2025-09-30',
        quantity: 50,
        purchasePrice: 12,
        purchaseDate: '2024-01-08',
        remaining: 15
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08'
  },
  {
    id: 'inv-5',
    sku: 'MED-005',
    name: 'এমলোডিপিন ৫mg',
    genericName: 'Amlodipine',
    category: 'হার্টের ওষুধ',
    stockQty: 180,
    unitPrice: 4,
    purchasePrice: 2.8,
    reorderLevel: 60,
    manufacturer: 'এসিআই ফার্মা',
    batches: [
      {
        id: 'batch-5',
        batchNumber: 'AML2024001',
        expiryDate: '2025-11-30',
        quantity: 200,
        purchasePrice: 2.8,
        purchaseDate: '2024-01-12',
        remaining: 180
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12'
  }
]

// Helper functions
export const getLowStockItems = (inventory: InventoryItem[]): InventoryItem[] => {
  return inventory.filter(item => item.stockQty <= item.reorderLevel)
}

export const searchInventory = (inventory: InventoryItem[], query: string): InventoryItem[] => {
  if (!query) return inventory
  
  return inventory.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.sku.toLowerCase().includes(query.toLowerCase()) ||
    item.genericName?.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  )
}

export const calculateSaleTotal = (items: SaleItem[]): { subtotal: number; totalDiscount: number; grandTotal: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0)
  const grandTotal = subtotal - totalDiscount
  
  return { subtotal, totalDiscount, grandTotal }
}

export const formatCurrency = (amount: number): string => {
  return `৳${amount.toFixed(2)}`
}

export const isNearExpiry = (expiryDate: string, daysThreshold: number = 90): boolean => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= daysThreshold && diffDays > 0
}

export const isExpired = (expiryDate: string): boolean => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  return expiry < today
}
