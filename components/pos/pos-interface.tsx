'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  InventoryItem, 
  SaleItem, 
  Sale,
  formatCurrency, 
  calculateSaleTotal,
  searchInventory,
  getLowStockItems
} from '@/lib/inventory-data'
import { 
  Search, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Printer, 
  AlertTriangle,
  CreditCard,
  DollarSign,
  Phone,
  User,
  Minus
} from 'lucide-react'

interface POSInterfaceProps {
  inventory: InventoryItem[]
  onSaleComplete: (sale: Sale) => void
  onUpdateInventory: (itemId: string, quantitySold: number) => void
}

export function POSInterface({ inventory, onSaleComplete, onUpdateInventory }: POSInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash')
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false)
  const [filteredMedicines, setFilteredMedicines] = useState<InventoryItem[]>([])
  const [globalDiscount, setGlobalDiscount] = useState(0)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const lowStockItems = getLowStockItems(inventory)

  // Filter medicines based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = searchInventory(inventory, searchTerm).filter(item => item.stockQty > 0)
      setFilteredMedicines(filtered.slice(0, 8)) // Show max 8 items
    } else {
      setFilteredMedicines([])
    }
  }, [searchTerm, inventory])

  // Calculate totals
  const { subtotal, totalDiscount, grandTotal } = calculateSaleTotal(saleItems)
  const finalTotal = grandTotal - globalDiscount

  const addMedicineToSale = (medicine: InventoryItem, quantity: number = 1) => {
    const existingItemIndex = saleItems.findIndex(item => item.medicineId === medicine.id)
    
    if (existingItemIndex >= 0) {
      // Update existing item
      setSaleItems(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { 
              ...item, 
              quantity: Math.min(item.quantity + quantity, medicine.stockQty),
              lineTotal: (Math.min(item.quantity + quantity, medicine.stockQty)) * item.unitPrice - item.discount
            }
          : item
      ))
    } else {
      // Add new item
      const newItem: SaleItem = {
        id: `sale-item-${Date.now()}`,
        medicineId: medicine.id,
        medicineName: medicine.name,
        sku: medicine.sku,
        quantity: Math.min(quantity, medicine.stockQty),
        unitPrice: medicine.unitPrice,
        discount: 0,
        lineTotal: Math.min(quantity, medicine.stockQty) * medicine.unitPrice
      }
      setSaleItems(prev => [...prev, newItem])
    }
    
    setSearchTerm('')
    setShowMedicineDropdown(false)
    searchInputRef.current?.focus()
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    const item = saleItems.find(item => item.id === itemId)
    if (!item) return
    
    const medicine = inventory.find(med => med.id === item.medicineId)
    if (!medicine) return
    
    const validQuantity = Math.max(0, Math.min(newQuantity, medicine.stockQty))
    
    if (validQuantity === 0) {
      removeSaleItem(itemId)
      return
    }
    
    setSaleItems(prev => prev.map(saleItem => 
      saleItem.id === itemId 
        ? { 
            ...saleItem, 
            quantity: validQuantity,
            lineTotal: validQuantity * saleItem.unitPrice - saleItem.discount
          }
        : saleItem
    ))
  }

  const updateItemDiscount = (itemId: string, discount: number) => {
    setSaleItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            discount: Math.max(0, Math.min(discount, item.quantity * item.unitPrice)),
            lineTotal: (item.quantity * item.unitPrice) - Math.max(0, Math.min(discount, item.quantity * item.unitPrice))
          }
        : item
    ))
  }

  const removeSaleItem = (itemId: string) => {
    setSaleItems(prev => prev.filter(item => item.id !== itemId))
  }

  const completeSale = () => {
    if (saleItems.length === 0) return
    
    const sale: Sale = {
      id: `sale-${Date.now()}`,
      items: saleItems,
      subtotal,
      totalDiscount: totalDiscount + globalDiscount,
      grandTotal: finalTotal,
      paymentMethod,
      customerPhone: customerPhone || undefined,
      customerName: customerName || undefined,
      cashierId: 'cashier-1', // In real app, get from auth
      createdAt: new Date().toISOString(),
      status: 'completed'
    }
    
    // Update inventory
    saleItems.forEach(item => {
      onUpdateInventory(item.medicineId, item.quantity)
    })
    
    onSaleComplete(sale)
    
    // Reset form
    setSaleItems([])
    setCustomerPhone('')
    setCustomerName('')
    setGlobalDiscount(0)
    setSearchTerm('')
    searchInputRef.current?.focus()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        completeSale()
      } else if (e.key === 'F1') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [saleItems])

  return (
    <div className="h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Panel - Medicine Search & Cart */}
        <div className="lg:col-span-2 space-y-4 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">POS বিক্রয়</h1>
            <div className="text-sm text-gray-600">
              <span className="font-medium">শর্টকাট:</span> F1 = খুঁজুন, Ctrl+Enter = বিক্রয় সম্পন্ন
            </div>
          </div>

          {/* Low Stock Warning */}
          {lowStockItems.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                <p className="text-orange-800 text-sm">
                  <strong>সতর্কতা:</strong> {lowStockItems.length} টি ওষুধের স্টক কম রয়েছে
                </p>
              </div>
            </div>
          )}

          {/* Medicine Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">ওষুধ খুঁজুন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ওষুধের নাম বা SKU দিয়ে খুঁজুন... (F1)"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowMedicineDropdown(true)
                  }}
                  onFocus={() => setShowMedicineDropdown(true)}
                  className="pl-10"
                />
                
                {/* Medicine Dropdown */}
                {showMedicineDropdown && filteredMedicines.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
                    {filteredMedicines.map((medicine) => (
                      <button
                        key={medicine.id}
                        type="button"
                        onClick={() => addMedicineToSale(medicine)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{medicine.name}</p>
                            <p className="text-sm text-gray-500">
                              {medicine.sku} • স্টক: {medicine.stockQty} • {formatCurrency(medicine.unitPrice)}
                            </p>
                          </div>
                          <Plus className="h-4 w-4 text-blue-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sale Items */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                বিক্রয়ের তালিকা ({saleItems.length} টি পণ্য)
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 overflow-hidden">
              {saleItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">ওষুধ খুঁজে যোগ করুন</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {saleItems.map((item) => {
                    const medicine = inventory.find(med => med.id === item.medicineId)
                    return (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.medicineName}</p>
                            <p className="text-sm text-gray-500">
                              {item.sku} • {formatCurrency(item.unitPrice)} প্রতি ইউনিট
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeSaleItem(item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">পরিমাণ</Label>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                max={medicine?.stockQty}
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="h-8 text-center"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= (medicine?.stockQty || 0)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">ছাড় (৳)</Label>
                            <Input
                              type="number"
                              min="0"
                              max={item.quantity * item.unitPrice}
                              value={item.discount}
                              onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                              className="h-8"
                              placeholder="০"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">মোট</Label>
                            <div className="h-8 flex items-center">
                              <span className="font-medium text-green-600">
                                {formatCurrency(item.lineTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {medicine && item.quantity > medicine.stockQty && (
                          <p className="text-xs text-red-600 mt-1">
                            সতর্কতা: স্টকে শুধু {medicine.stockQty} টি আছে
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Customer & Payment */}
        <div className="space-y-4">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2" />
                ক্রেতার তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="customerName" className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-1" />
                  নাম (ঐচ্ছিক)
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ক্রেতার নাম"
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone" className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-1" />
                  ফোন (ঐচ্ছিক)
                </Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="০১৭xxxxxxxx"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="h-5 w-5 mr-2" />
                পেমেন্ট
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">পেমেন্ট মেথড</Label>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'card' | 'mobile')}
                >
                  <option value="cash">নগদ</option>
                  <option value="card">কার্ড</option>
                  <option value="mobile">মোবাইল ব্যাংকিং</option>
                </Select>
              </div>

              <div>
                <Label className="text-sm">সামগ্রিক ছাড় (৳)</Label>
                <Input
                  type="number"
                  min="0"
                  max={grandTotal}
                  value={globalDiscount}
                  onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="০"
                />
              </div>

              {/* Bill Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>সাবটোটাল:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>আইটেম ছাড়:</span>
                  <span>-{formatCurrency(totalDiscount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>সামগ্রিক ছাড়:</span>
                  <span>-{formatCurrency(globalDiscount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>সর্বমোট:</span>
                  <span className="text-green-600">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button
                  onClick={completeSale}
                  disabled={saleItems.length === 0 || finalTotal <= 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  বিক্রয় সম্পন্ন করুন (Ctrl+Enter)
                </Button>
                
                <Button
                  variant="outline"
                  disabled={saleItems.length === 0}
                  className="w-full"
                  onClick={() => window.open('/pos/receipt', '_blank')}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  রসিদ প্রিন্ট করুন
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">আজকের পরিসংখ্যান</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>আজকের বিক্রয়:</span>
                  <span className="font-medium">৳১২,৫০০</span>
                </div>
                <div className="flex justify-between">
                  <span>বিক্রয়ের সংখ্যা:</span>
                  <span className="font-medium">২৫ টি</span>
                </div>
                <div className="flex justify-between">
                  <span>গড় বিক্রয়:</span>
                  <span className="font-medium">৳৫০০</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
