'use client'

import { useState } from 'react'
import { InventoryTable } from '@/components/inventory/inventory-table'
import { AddStockModal } from '@/components/inventory/add-stock-modal'
import { MedicineModal } from '@/components/inventory/medicine-modal'
import { sampleInventory, InventoryItem, Batch } from '@/lib/inventory-data'

export default function InventoryPage() {
  const [inventory, setInventory] = useState(sampleInventory)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [showMedicineModal, setShowMedicineModal] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<InventoryItem | null>(null)

  const handleEditItem = (item: InventoryItem) => {
    setEditingMedicine(item)
    setShowMedicineModal(true)
  }

  const handleAddStock = (item: InventoryItem) => {
    setSelectedItem(item)
    setShowAddStockModal(true)
  }

  const handleAddNew = () => {
    setEditingMedicine(null)
    setShowMedicineModal(true)
  }

  const handleSaveMedicine = (medicineData: Partial<InventoryItem>) => {
    if (editingMedicine) {
      // Update existing medicine
      setInventory(prev => prev.map(item =>
        item.id === editingMedicine.id
          ? { ...item, ...medicineData, updatedAt: new Date().toISOString() }
          : item
      ))
    } else {
      // Add new medicine
      const newMedicine: InventoryItem = {
        id: `med-${Date.now()}`,
        sku: medicineData.sku || `MED${Date.now()}`,
        name: medicineData.name || '',
        genericName: medicineData.genericName,
        manufacturer: medicineData.manufacturer || '',
        category: medicineData.category || '',
        unitPrice: medicineData.unitPrice || 0,
        stockQty: medicineData.stockQty || 0,
        reorderLevel: medicineData.reorderLevel || 10,
        description: medicineData.description,
        dosageForm: medicineData.dosageForm,
        strength: medicineData.strength,
        batches: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setInventory(prev => [...prev, newMedicine])
    }
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
    <div>
      <InventoryTable
        inventory={inventory}
        onEditItem={handleEditItem}
        onAddStock={handleAddStock}
        onAddNew={handleAddNew}
      />

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

      <MedicineModal
        isOpen={showMedicineModal}
        onClose={() => {
          setShowMedicineModal(false)
          setEditingMedicine(null)
        }}
        medicine={editingMedicine}
        onSave={handleSaveMedicine}
      />
    </div>
  )
}
