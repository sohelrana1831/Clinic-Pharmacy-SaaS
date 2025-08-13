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
  User, 
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplet,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { patientsApi, Patient } from '@/lib/api'
import { usePaginatedApi, useApiMutation, useSearch } from '@/hooks/useApi'

interface EnhancedPatientsTableProps {
  className?: string
}

export function EnhancedPatientsTable({ className }: EnhancedPatientsTableProps) {
  // API hooks
  const {
    data: patients,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    changePageSize,
    refetch,
    setData
  } = usePaginatedApi(patientsApi.getPatients, {
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const createMutation = useApiMutation<Patient>()
  const updateMutation = useApiMutation<Patient>()
  const deleteMutation = useApiMutation<any>()

  // Search functionality
  const { query: searchQuery, setQuery: setSearchQuery } = useSearch(
    useCallback((query: string) => {
      updateParams({ search: query })
    }, [updateParams]),
    500
  )

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  // Form state
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
  })

  // Reset form
  const resetPatientForm = () => {
    setPatientForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      bloodGroup: '',
    })
  }

  // Handle patient creation
  const handleCreatePatient = async () => {
    try {
      await createMutation.mutate(
        () => patientsApi.createPatient(patientForm),
        {
          onSuccess: () => {
            setShowAddModal(false)
            resetPatientForm()
            refetch()
          }
        }
      )
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Handle patient update
  const handleUpdatePatient = async () => {
    if (!selectedPatient) return

    try {
      await updateMutation.mutate(
        () => patientsApi.updatePatient(selectedPatient.id, patientForm),
        {
          onSuccess: () => {
            setShowEditModal(false)
            setSelectedPatient(null)
            resetPatientForm()
            refetch()
          }
        }
      )
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Handle patient deletion
  const handleDeletePatient = async () => {
    if (!selectedPatient) return

    try {
      await deleteMutation.mutate(
        () => patientsApi.deletePatient(selectedPatient.id),
        {
          onSuccess: () => {
            setShowDeleteModal(false)
            setSelectedPatient(null)
            refetch()
          }
        }
      )
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Open edit modal
  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient)
    setPatientForm({
      name: patient.name,
      email: patient.email || '',
      phone: patient.phone,
      address: patient.address || '',
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
      gender: patient.gender || '',
      bloodGroup: patient.bloodGroup || '',
    })
    setShowEditModal(true)
  }

  // Open view modal
  const openViewModal = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Patient Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage patient records and information</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search Patients</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, or email..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                id="sortBy"
                value={params.sortBy || 'name'}
                onChange={(e) => updateParams({ sortBy: e.target.value })}
              >
                <option value="name">Name</option>
                <option value="createdAt">Date Added</option>
                <option value="dateOfBirth">Age</option>
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
            <span>Patients ({pagination.total})</span>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Details</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Registered</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients?.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{patient.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {patient.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{patient.phone}</span>
                        </div>
                        {patient.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{patient.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {patient.gender && (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{patient.gender}</span>
                          </div>
                        )}
                        {patient.bloodGroup && (
                          <div className="flex items-center space-x-2">
                            <Droplet className="h-4 w-4 text-red-400" />
                            <span className="text-sm">{patient.bloodGroup}</span>
                          </div>
                        )}
                        {patient.dateOfBirth && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openViewModal(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPatient(patient)
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

            {patients?.length === 0 && !loading && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No patients found</p>
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

      {/* Add Patient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          resetPatientForm()
        }}
        title="Add New Patient"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={patientForm.name}
                onChange={(e) => setPatientForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Patient name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={patientForm.phone}
                onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={patientForm.email}
                onChange={(e) => setPatientForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={patientForm.dateOfBirth}
                onChange={(e) => setPatientForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                value={patientForm.gender}
                onChange={(e) => setPatientForm(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Select gender</option>
                <option value="পুরুষ">পুরুষ</option>
                <option value="মহিলা">মহিলা</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                id="bloodGroup"
                value={patientForm.bloodGroup}
                onChange={(e) => setPatientForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={patientForm.address}
                onChange={(e) => setPatientForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Patient address"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false)
                resetPatientForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePatient}
              disabled={createMutation.loading}
            >
              {createMutation.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Patient
            </Button>
          </div>
          
          {createMutation.error && (
            <div className="text-sm text-red-600 mt-2">{createMutation.error}</div>
          )}
        </div>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPatient(null)
          resetPatientForm()
        }}
        title="Edit Patient"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Same form fields as Add modal */}
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={patientForm.name}
                onChange={(e) => setPatientForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Patient name"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone *</Label>
              <Input
                id="edit-phone"
                value={patientForm.phone}
                onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
            {/* Add other fields as needed */}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                setSelectedPatient(null)
                resetPatientForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePatient}
              disabled={updateMutation.loading}
            >
              {updateMutation.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Patient
            </Button>
          </div>
          
          {updateMutation.error && (
            <div className="text-sm text-red-600 mt-2">{updateMutation.error}</div>
          )}
        </div>
      </Modal>

      {/* View Patient Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false)
          setSelectedPatient(null)
        }}
        title={`Patient Profile - ${selectedPatient?.name}`}
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="text-lg font-medium">{selectedPatient.name}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p>{selectedPatient.phone}</p>
              </div>
              {selectedPatient.email && (
                <div>
                  <Label>Email</Label>
                  <p>{selectedPatient.email}</p>
                </div>
              )}
              {selectedPatient.dateOfBirth && (
                <div>
                  <Label>Date of Birth</Label>
                  <p>{new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</p>
                </div>
              )}
              {selectedPatient.gender && (
                <div>
                  <Label>Gender</Label>
                  <p>{selectedPatient.gender}</p>
                </div>
              )}
              {selectedPatient.bloodGroup && (
                <div>
                  <Label>Blood Group</Label>
                  <p>{selectedPatient.bloodGroup}</p>
                </div>
              )}
              {selectedPatient.address && (
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <p>{selectedPatient.address}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedPatient(null)
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedPatient(null)
        }}
        title="Delete Patient"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete <strong>{selectedPatient?.name}</strong>?</p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedPatient(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePatient}
              disabled={deleteMutation.loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Patient
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
