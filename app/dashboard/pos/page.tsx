'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { POSInterface } from '@/components/pos/pos-interface'
import { sampleInventory, InventoryItem, Sale } from '@/lib/inventory-data'

export default function POSPage() {
  const [inventory, setInventory] = useState(sampleInventory)
  const [sales, setSales] = useState<Sale[]>([])

  const handleSaleComplete = (sale: Sale) => {
    setSales(prev => [sale, ...prev])
    console.log('Sale completed:', sale)
    
    // In a real app, this would save to database and print receipt
    alert(`বিক্রয় সম্পন্ন! রসিদ নং: ${sale.id}`)
  }

  const handleUpdateInventory = (itemId: string, quantitySold: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stockQty: Math.max(0, item.stockQty - quantitySold),
          updatedAt: new Date().toISOString()
        }
      }
      return item
    }))
  }

  return (
    <div className="min-h-screen bg-theme-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1">
          <POSInterface
            inventory={inventory}
            onSaleComplete={handleSaleComplete}
            onUpdateInventory={handleUpdateInventory}
          />
        </main>
      </div>
    </div>
  )
}
