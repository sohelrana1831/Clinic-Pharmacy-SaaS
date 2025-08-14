'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaginatedApi, useApiMutation } from '@/hooks/useApi'
import { prescriptionsApi, Prescription } from '@/lib/api'
import { PrescriptionModal } from '@/components/prescriptions/prescription-modal'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  User,
  Calendar,
  Filter,
  Eye,
  Printer,
  Download
} from 'lucide-react'

export default function PrescriptionsListPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null)

  // API hooks
  const {
    data: prescriptions,
    loading,
    error,
    pagination,
    updateParams,
    refetch
  } = usePaginatedApi(prescriptionsApi.getPrescriptions, { 
    status: statusFilter || undefined,
    doctorId: doctorFilter || undefined
  })

  const { mutate: deletePrescription, loading: deleting } = useApiMutation()

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    updateParams({ status: status || undefined, page: 1 })
  }

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription)
    setIsModalOpen(true)
  }

  const handleDelete = async (prescriptionId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই প্রেসক্রিপশন মুছে ফেলতে চান?')) {
      try {
        await deletePrescription(() => prescriptionsApi.deletePrescription(prescriptionId))
        refetch()
      } catch (error) {
        console.error('Error deleting prescription:', error)
      }
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingPrescription(null)
    refetch()
  }

  const handleExport = () => {
    const csvContent = generateCSV(prescriptions || [])
    downloadCSV(csvContent, `prescriptions-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const generateCSV = (data: Prescription[]) => {
    const headers = ['ID', 'Patient', 'Doctor', 'Date', 'Diagnosis', 'Medicines', 'Status', 'Notes']
    const rows = data.map(prescription => [
      prescription.id,
      prescription.patient?.name || '',
      prescription.doctor?.name || '',
      new Date(prescription.date).toLocaleDateString('bn-BD'),
      prescription.diagnosis,
      prescription.medicines?.length || 0,
      prescription.status,
      prescription.notes || ''
    ])

    return [headers, ...rows].map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n')
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'issued':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'dispensed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'খসড়া'
      case 'issued': return 'জারি করা'
      case 'dispensed': return 'প্রদান করা'
      default: return status
    }
  }

  // Calculate stats
  const totalPrescriptions = pagination.total
  const draftCount = prescriptions?.filter(p => p.status === 'draft').length || 0
  const issuedCount = prescriptions?.filter(p => p.status === 'issued').length || 0
  const dispensedCount = prescriptions?.filter(p => p.status === 'dispensed').length || 0

  return (
    <div className="min-h-screen bg-theme-background theme-transition">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-foreground">প্রেসক্রিপশন তালিকা</h1>
            <p className="text-theme-muted">সকল প্রেসক্রিপশন দেখুন এবং পরিচালনা করুন</p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="h-9"
          >
            <Download className="h-4 w-4 mr-2" />
            এক্সপোর্ট
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            নতুন প্রেসক্রিপশন
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">মোট প্রেসক্রিপশন</p>
                  <p className="text-2xl font-bold text-theme-foreground">{totalPrescriptions}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">খসড়া</p>
                  <p className="text-2xl font-bold text-gray-600">{draftCount}</p>
                </div>
                <Edit className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">জারি করা</p>
                  <p className="text-2xl font-bold text-blue-600">{issuedCount}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">প্রদান করা</p>
                  <p className="text-2xl font-bold text-green-600">{dispensedCount}</p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-theme border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-muted" />
                <Input
                  type="text"
                  placeholder="রোগী বা ডাক্তারের নাম দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-theme"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme"
              >
                <option value="">সব স্ট্যাটাস</option>
                <option value="draft">খসড়া</option>
                <option value="issued">জারি করা</option>
                <option value="dispensed">প্রদান করা</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions Table */}
        <Card className="card-theme border">
          <CardHeader>
            <CardTitle className="text-theme-foreground">প্রেসক্রিপশনের তালিকা</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-theme-muted mt-2">লোড হচ্ছে...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <Button onClick={refetch} className="mt-4">পুনরায় চেষ্টা করুন</Button>
              </div>
            ) : (
              <div className="table-theme rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-theme">
                    <thead className="border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          প্রেসক্রিপশন ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          রোগী
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          ডাক্তার
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          তারিখ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          রোগ নির্ণয়
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          ওষুধ সংখ্যা
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          স্ট্যাটাস
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          কার্যক্রম
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {prescriptions?.map((prescription) => (
                        <tr key={prescription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 theme-transition">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-blue-600">{prescription.id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-theme-foreground">{prescription.patient?.name}</div>
                            <div className="text-sm text-theme-muted">{prescription.patient?.phone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-theme-foreground">{prescription.doctor?.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-theme-foreground">
                              {new Date(prescription.date).toLocaleDateString('bn-BD')}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-theme-foreground max-w-xs truncate">
                              {prescription.diagnosis}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-theme-foreground">{prescription.medicines?.length || 0} টি</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                              {getStatusLabel(prescription.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.location.href = `/prescriptions/print?id=${prescription.id}`}
                                className="h-8 w-8 p-0"
                                title="দেখুন/প্রিন্ট"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.location.href = `/prescriptions/editor?id=${prescription.id}`}
                                className="h-8 w-8 p-0"
                                title="সম্পাদনা"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(prescription.id)}
                                disabled={deleting}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(!prescriptions || prescriptions.length === 0) && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-theme-muted mx-auto mb-4" />
                    <div className="text-theme-muted">
                      {statusFilter ? 'কোনো প্রেসক্রিপশন পাওয়া যায়নি' : 'কোনো প্রেসক্রিপশন নেই'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-theme-muted">
                  মোট {pagination.total} এর মধ্যে {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateParams({ page: pagination.page - 1 })}
                    disabled={pagination.page <= 1}
                  >
                    পূর্ববর্তী
                  </Button>
                  <span className="text-sm text-theme-foreground">
                    পৃষ্ঠা {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateParams({ page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    পরবর্তী
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
