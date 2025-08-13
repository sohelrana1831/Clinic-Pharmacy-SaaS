'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/modals/modal'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { medicinesApi, Medicine } from '@/lib/api'
import { usePaginatedApi, useApiMutation, useSearch, useSelection } from '@/hooks/useApi'

interface EnhancedInventoryTableProps {
  className?: string
}

export function EnhancedInventoryTable({ className }: EnhancedInventoryTableProps) {
  // API hooks
  const {
    data: medicines,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    changePageSize,
    refetch,
    setData
  } = usePaginatedApi(medicinesApi.getMedicines, {
    search: '',
    category: '',
    lowStock: false,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const createMutation = useApiMutation<Medicine>()
  const updateMutation = useApiMutation<Medicine>()
  const deleteMutation = useApiMutation<any>()
  const stockMutation = useApiMutation<Medicine>()

  // Search functionality
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch(
    useCallback((query: string) => {
      updateParams({ search: query })
    }, [updateParams]),
    500
  )

  // Selection functionality
  const selection = useSelection(medicines || [], (item) => item.id)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStockModal, setShowStockModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  // Form states
  const [medicineForm, setMedicineForm] = useState({
    sku: '',
    name: '',
    genericName: '',
    category: '',
    manufacturer: '',
    strength: '',
    unit: 'piece',
    purchasePrice: 0,
    sellingPrice: 0,
    stockQty: 0,
    reorderLevel: 10,
    expiryDate: '',
    batchNumber: '',
  })

  const [stockForm, setStockForm] = useState({
    quantity: 0,
    type: 'add' as 'add' | 'subtract',
    reason: ''
  })

  // Reset form
  const resetMedicineForm = () => {
    setMedicineForm({
      sku: '',
      name: '',
      genericName: '',
      category: '',
      manufacturer: '',
      strength: '',
      unit: 'piece',
      purchasePrice: 0,
      sellingPrice: 0,
      stockQty: 0,
      reorderLevel: 10,
      expiryDate: '',
      batchNumber: '',
    })
  }

  // Handle medicine creation
  const handleCreateMedicine = async () => {
    try {
      const newMedicine = await createMutation.mutate(
        () => medicinesApi.createMedicine(medicineForm),
        {
          onSuccess: () => {
            setShowAddModal(false)
            resetMedicineForm()
            refetch()
          }
        }
      )
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Handle medicine update
  const handleUpdateMedicine = async () => {
    if (!selectedMedicine) return

    try {
      await updateMutation.mutate(
        () => medicinesApi.updateMedicine(selectedMedicine.id, medicineForm),
        {
          onSuccess: () => {
            setShowEditModal(false)
            setSelectedMedicine(null)
            resetMedicineForm()
            refetch()
          }
        }
      )
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Handle stock update
  const handleUpdateStock = async () => {
    if (!selectedMedicine) return

    try {
      await stockMutation.mutate(
        () => medicinesApi.updateStock(selectedMedicine.id, stockForm),
        {
          onSuccess: () => {
            setShowStockModal(false)
            setSelectedMedicine(null)
            setStockForm({ quantity: 0, type: 'add', reason: '' })
            refetch()
          }
        }
      )
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Handle medicine deletion
  const handleDeleteMedicine = async () => {
    if (!selectedMedicine) return

    try {
      await deleteMutation.mutate(
        () => medicinesApi.deleteMedicine(selectedMedicine.id),
        {
          onSuccess: () => {
            setShowDeleteModal(false)
            setSelectedMedicine(null)
            refetch()
          }
        }
      )
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Open edit modal
  const openEditModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setMedicineForm({
      sku: medicine.sku,
      name: medicine.name,
      genericName: medicine.genericName || '',
      category: medicine.category,
      manufacturer: medicine.manufacturer || '',
      strength: medicine.strength || '',
      unit: medicine.unit,
      purchasePrice: medicine.purchasePrice,
      sellingPrice: medicine.sellingPrice,
      stockQty: medicine.stockQty,
      reorderLevel: medicine.reorderLevel,
      expiryDate: medicine.expiryDate ? medicine.expiryDate.split('T')[0] : '',
      batchNumber: medicine.batchNumber || '',
    })
    setShowEditModal(true)
  }

  // Open stock modal
  const openStockModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setShowStockModal(true)
  }

  // Get stock status color
  const getStockStatus = (medicine: Medicine) => {
    if (medicine.stockQty <= 0) return 'text-red-600 bg-red-50'
    if (medicine.stockQty <= medicine.reorderLevel) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
            <Button onClick={refetch} size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage medicines and stock levels</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicines..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={params.category || ''}
                onChange={(e) => updateParams({ category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Capsule">Capsule</option>
                <option value="Ointment">Ointment</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="stockFilter">Stock Level</Label>
              <Select
                id="stockFilter"
                value={params.lowStock ? 'low' : 'all'}
                onChange={(e) => updateParams({ lowStock: e.target.value === 'low' })}
              >
                <option value="all">All Stock</option>
                <option value="low">Low Stock Only</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="pageSize">Per Page</Label>
              <Select
                id="pageSize"
                value={pagination.limit.toString()}
                onChange={(e) => changePageSize(parseInt(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Medicines ({pagination.total})</span>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Expiry</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines?.map((medicine) => (
                  <tr
                    key={medicine.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{medicine.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.genericName}</p>
                        <p className="text-xs text-gray-400">{medicine.strength}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                        {medicine.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${getStockStatus(medicine)}`}
                        >
                          {medicine.stockQty} {medicine.unit}
                        </span>
                        {medicine.stockQty <= medicine.reorderLevel && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">৳{medicine.sellingPrice}</p>
                        <p className="text-sm text-gray-500">Cost: ৳{medicine.purchasePrice}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {medicine.expiryDate ? (
                        <span className="text-sm">
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openStockModal(medicine)}
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(medicine)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedMedicine(medicine)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {medicines?.length === 0 && !loading && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No medicines found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={pagination.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Medicine Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          resetMedicineForm()
        }}
        title="Add New Medicine"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={medicineForm.sku}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Medicine SKU"
              />
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={medicineForm.name}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Medicine name"
              />
            </div>
            <div>
              <Label htmlFor="genericName">Generic Name</Label>
              <Input
                id="genericName"
                value={medicineForm.genericName}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, genericName: e.target.value }))}
                placeholder="Generic name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                value={medicineForm.category}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Capsule">Capsule</option>
                <option value="Ointment">Ointment</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={medicineForm.manufacturer}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, manufacturer: e.target.value }))}
                placeholder="Manufacturer"
              />
            </div>
            <div>
              <Label htmlFor="strength">Strength</Label>
              <Input
                id="strength"
                value={medicineForm.strength}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, strength: e.target.value }))}
                placeholder="e.g., 500mg"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit *</Label>
              <Select
                id="unit"
                value={medicineForm.unit}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, unit: e.target.value }))}
              >
                <option value="piece">Piece</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
                <option value="strip">Strip</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                value={medicineForm.purchasePrice}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="sellingPrice">Selling Price</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                value={medicineForm.sellingPrice}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, sellingPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="stockQty">Initial Stock</Label>
              <Input
                id="stockQty"
                type="number"
                value={medicineForm.stockQty}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, stockQty: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="reorderLevel">Reorder Level</Label>
              <Input
                id="reorderLevel"
                type="number"
                value={medicineForm.reorderLevel}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, reorderLevel: parseInt(e.target.value) || 0 }))}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={medicineForm.expiryDate}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false)
                resetMedicineForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMedicine}
              disabled={createMutation.loading}
            >
              {createMutation.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Medicine
            </Button>
          </div>
          
          {createMutation.error && (
            <div className="text-sm text-red-600 mt-2">{createMutation.error}</div>
          )}
        </div>
      </Modal>

      {/* Edit Medicine Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedMedicine(null)
          resetMedicineForm()
        }}
        title="Edit Medicine"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Same form fields as Add modal */}
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={medicineForm.name}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Medicine name"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                id="edit-category"
                value={medicineForm.category}
                onChange={(e) => setMedicineForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select category</option>
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Capsule">Capsule</option>
                <option value="Ointment">Ointment</option>
              </Select>
            </div>
            {/* Add other fields as needed */}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                setSelectedMedicine(null)
                resetMedicineForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateMedicine}
              disabled={updateMutation.loading}
            >
              {updateMutation.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Medicine
            </Button>
          </div>
          
          {updateMutation.error && (
            <div className="text-sm text-red-600 mt-2">{updateMutation.error}</div>
          )}
        </div>
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => {
          setShowStockModal(false)
          setSelectedMedicine(null)
          setStockForm({ quantity: 0, type: 'add', reason: '' })
        }}
        title={`Update Stock - ${selectedMedicine?.name}`}
      >
        <div className="space-y-4">
          <div>
            <Label>Current Stock</Label>
            <p className="text-lg font-semibold">{selectedMedicine?.stockQty} {selectedMedicine?.unit}</p>
          </div>
          
          <div>
            <Label htmlFor="stockType">Action</Label>
            <Select
              id="stockType"
              value={stockForm.type}
              onChange={(e) => setStockForm(prev => ({ ...prev, type: e.target.value as 'add' | 'subtract' }))}
            >
              <option value="add">Add Stock</option>
              <option value="subtract">Remove Stock</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={stockForm.quantity}
              onChange={(e) => setStockForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              placeholder="Enter quantity"
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={stockForm.reason}
              onChange={(e) => setStockForm(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Reason for stock adjustment"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowStockModal(false)
                setSelectedMedicine(null)
                setStockForm({ quantity: 0, type: 'add', reason: '' })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStock}
              disabled={stockMutation.loading}
              className={stockForm.type === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {stockMutation.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {stockForm.type === 'add' ? 'Add Stock' : 'Remove Stock'}
            </Button>
          </div>
          
          {stockMutation.error && (
            <div className="text-sm text-red-600 mt-2">{stockMutation.error}</div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedMedicine(null)
        }}
        title="Delete Medicine"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete <strong>{selectedMedicine?.name}</strong>?</p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedMedicine(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteMedicine}
              disabled={deleteMutation.loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Medicine
            </Button>
          </div>
          
          {deleteMutation.error && (
            <div className="text-sm text-red-600 mt-2">{deleteMutation.error}</div>
          )}
        </div>
      </Modal>
    </div>
  )
}
