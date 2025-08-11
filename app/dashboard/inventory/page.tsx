'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { InventoryTable } from '@/components/inventory/inventory-table'
import { AddStockModal } from '@/components/inventory/add-stock-modal'
import { sampleInventory, InventoryItem, Batch } from '@/lib/inventory-data'

export default function InventoryPage() {
  const [inventory, setInventory] = useState(sampleInventory)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowEditModal(true)
  }

  const handleAddStock = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowAddStockModal(true)
  }

  const handleAddNew = () => {
    // In a real app, this would open a modal to add new medicine
    console.log('Add new medicine')
  }

  const handleSaveStock = (itemId: string, batch: Omit<Batch, 'id'>) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newBatch: Batch = {
          ...batch,
          id: `batch-${Date.now()}`
        }
        
        return {
          ...item,
          stockQty: item.stockQty + batch.quantity,
          batches: [...item.batches, newBatch],
          updatedAt: new Date().toISOString()
        }
      }
      return item
    }))
    
    setShowAddStockModal(false)
    setSelectedItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />
        
        {/* Page Content */}
        <main className="flex-1 p-6">
          <InventoryTable
            inventory={inventory}
            onEditItem={handleEditItem}
            onAddStock={handleAddStock}
            onAddNew={handleAddNew}
          />
        </main>
      </div>

      {/* Modals */}
      <AddStockModal
        isOpen={showAddStockModal}
        onClose={() => {
          setShowAddStockModal(false)
          setSelectedItem(null)
        }}
        item={selectedItem}
        onSave={handleSaveStock}
      />
    </div>
  )
}
