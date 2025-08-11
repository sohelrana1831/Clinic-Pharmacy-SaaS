'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InventoryItem, formatCurrency, isNearExpiry, isExpired } from '@/lib/inventory-data'
import { Search, Plus, Edit, Package, AlertTriangle, Calendar } from 'lucide-react'

interface InventoryTableProps {
  inventory: InventoryItem[]
  onEditItem: (item: InventoryItem) => void
  onAddStock: (item: InventoryItem) => void
  onAddNew: () => void
}

export function InventoryTable({ inventory, onEditItem, onAddStock, onAddNew }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.stockQty === 0) {
      return { status: 'out-of-stock', color: 'text-red-600 bg-red-50', label: 'স্টক শেষ' }
    } else if (item.stockQty <= item.reorderLevel) {
      return { status: 'low-stock', color: 'text-orange-600 bg-orange-50', label: 'কম স্টক' }
    } else {
      return { status: 'in-stock', color: 'text-green-600 bg-green-50', label: 'স্টক আছে' }
    }
  }

  const getExpiryStatus = (item: InventoryItem) => {
    if (item.batches.length === 0) return null
    
    const earliestExpiry = item.batches
      .filter(batch => batch.remaining > 0)
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0]
    
    if (!earliestExpiry) return null
    
    if (isExpired(earliestExpiry.expiryDate)) {
      return { status: 'expired', color: 'text-red-600', label: 'মেয়াদ শেষ' }
    } else if (isNearExpiry(earliestExpiry.expiryDate, 30)) {
      return { status: 'expiring-soon', color: 'text-orange-600', label: 'শীঘ��রই মেয়াদ শেষ' }
    }
    
    return null
  }

  const categories = Array.from(new Set(inventory.map(item => item.category)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ইনভেন্টরি ম্যানেজমেন্ট</h1>
          <p className="text-gray-600">ওষুধের স্টক পরিচালনা করুন</p>
        </div>
        <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          নতুন ওষুধ যোগ করুন
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="নাম, SKU বা জেনেরিক নাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
        >
          <option value="">সব ক্যাটেগরি</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <div className="text-sm text-gray-600">
          মোট: {filteredInventory.length} টি পণ্য
        </div>
      </div>

      {/* Low Stock Alert */}
      {inventory.filter(item => item.stockQty <= item.reorderLevel).length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <p className="text-orange-800 font-medium">
              {inventory.filter(item => item.stockQty <= item.reorderLevel).length} টি ওষুধের স্টক কম রয়েছে
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ওষুধের নাম
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ক্যাটেগরি
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  স্টক
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  দাম
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  রিঅর্ডার লেভেল
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ম���য়াদ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  কার্যক্রম
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item)
                const expiryStatus = getExpiryStatus(item)
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{item.sku}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        {item.genericName && (
                          <div className="text-sm text-gray-500">{item.genericName}</div>
                        )}
                        <div className="text-xs text-gray-400">{item.manufacturer}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{item.stockQty}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(item.unitPrice)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.reorderLevel}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {expiryStatus ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className={`text-xs font-medium ${expiryStatus.color}`}>
                            {expiryStatus.label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">ভালো</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditItem(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onAddStock(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500">
              {searchTerm || selectedCategory ? 'কোনো পণ্য পাওয়া যায়নি' : 'এখনো কোনো পণ্য যোগ করা হয়নি'}
            </div>
            {!searchTerm && !selectedCategory && (
              <Button 
                onClick={onAddNew} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                প্রথম পণ্য যোগ করুন
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">মোট পণ্য</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">কম স্টক</p>
              <p className="text-2xl font-bold text-orange-600">
                {inventory.filter(item => item.stockQty <= item.reorderLevel).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">স্টক শেষ</p>
              <p className="text-2xl font-bold text-red-600">
                {inventory.filter(item => item.stockQty === 0).length}
              </p>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">মোট মূল্য</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(inventory.reduce((sum, item) => sum + (item.stockQty * item.unitPrice), 0))}
              </p>
            </div>
            <div className="text-green-600 font-bold text-2xl">৳</div>
          </div>
        </div>
      </div>
    </div>
  )
}
