'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/modals/modal'
import { ManualInvoiceModal } from '@/components/admin/manual-invoice-modal'
import { 
  adminClinicData, 
  subscriptionPlans, 
  formatCurrency, 
  getStatusBadgeColor, 
  getStatusText 
} from '@/lib/subscription-data'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  FileText,
  Ban,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  Building,
  CreditCard,
  Plus
} from 'lucide-react'

export default function AdminSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [showManualInvoice, setShowManualInvoice] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null)
  const [showClinicDetails, setShowClinicDetails] = useState(false)

  // Calculate statistics
  const totalClinics = adminClinicData.length
  const activeClinics = adminClinicData.filter(clinic => clinic.status === 'active').length
  const totalRevenue = adminClinicData.reduce((sum, clinic) => sum + clinic.revenue, 0)
  const avgRevenuePerClinic = totalRevenue / totalClinics

  const filteredClinics = adminClinicData.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || clinic.status === statusFilter
    const matchesPlan = planFilter === 'all' || clinic.planId === planFilter
    
    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleChangePlan = (clinicId: string, newPlanId: string) => {
    // In real app, this would call API to change plan
    alert(`Clinic ${clinicId} এর প��ল্যান ${newPlanId} এ পরিবর্তন করা হচ্ছে...`)
  }

  const handleSuspendClinic = (clinicId: string) => {
    // In real app, this would call API to suspend clinic
    if (confirm('এই ক্লিনিকের সাবস্ক্রিপশন স্থ���িত করতে চান?')) {
      alert(`Clinic ${clinicId} স্থগিত করা হচ্ছে...`)
    }
  }

  const handleCreateManualInvoice = (clinicId: string) => {
    setSelectedClinic(clinicId)
    setShowManualInvoice(true)
  }

  const handleViewClinicDetails = (clinicId: string) => {
    setSelectedClinic(clinicId)
    setShowClinicDetails(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">সাবস্ক্রিপশন ম্যানেজমেন্ট</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">��কল ক্লিনিকের সাবস্ক্রিপশন পরিচালনা করুন</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          নতুন ক্লিনিক যোগ �����ুন
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">মোট ক্লিনিক</p>
                <p className="text-3xl font-bold text-gray-900">{totalClinics}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-600 ml-1">গত মাসের তুলনায়</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">সক্রিয় ক্ল��নিক</p>
                <p className="text-3xl font-bold text-gray-900">{activeClinics}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">সফলতার হা��:</span>
              <span className="text-green-600 ml-1 font-medium">
                {((activeClinics / totalClinics) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">মোট আয়</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue, 'BDT')}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600">+8.2%</span>
              <span className="text-gray-600 ml-1">এ মাসে</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">গড় ARPC</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(avgRevenuePerClinic, 'BDT')}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Average Revenue Per Clinic</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ক্লিনিকের নাম বা ইমেইল দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="active">সক্রিয়</option>
              <option value="past_due">বক��য়া</option>
              <option value="cancelled">বাতিল</option>
            </Select>

            <Select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="all">সকল প্ল্যান</option>
              {subscriptionPlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              আরো ফিল্টার
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clinics Table */}
      <Card>
        <CardHeader>
          <CardTitle>ক্লিনিক তালিকা ({filteredClinics.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ক্লিনিক</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">প্ল্যান</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">স্ট্য���টাস</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">পরবর্তী বিলিং</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">মাসিক আয়</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">যোগদান</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">অ্����াকশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredClinics.map((clinic) => {
                  const plan = subscriptionPlans.find(p => p.id === clinic.planId)
                  return (
                    <tr key={clinic.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{clinic.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {clinic.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block w-3 h-3 rounded-full bg-${plan?.color}-400`}></span>
                          <span className="font-medium">{plan?.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(plan?.price || 0, 'BDT')}/মাস
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(clinic.status)}`}>
                          {getStatusText(clinic.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(clinic.billingDate).toLocaleDateString('bn-BD')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-green-600">
                          {formatCurrency(clinic.revenue, 'BDT')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(clinic.joinDate).toLocaleDateString('bn-BD')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewClinicDetails(clinic.id)}
                          >
                            বিস্তারিত
                          </Button>
                          <div className="relative group">
                            <Button size="sm" variant="outline">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <div className="py-2">
                                <button
                                  onClick={() => handleChangePlan(clinic.id, 'pro')}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  প্ল্যান পরিবর্তন
                                </button>
                                <button
                                  onClick={() => handleCreateManualInvoice(clinic.id)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  ম্যানুয়াল ইনভ��়েস
                                </button>
                                <button
                                  onClick={() => handleSuspendClinic(clinic.id)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center text-red-600"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  স্থগিত করুন
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showManualInvoice && selectedClinic && (
        <ManualInvoiceModal
          clinicId={selectedClinic}
          onClose={() => {
            setShowManualInvoice(false)
            setSelectedClinic(null)
          }}
        />
      )}

      {showClinicDetails && selectedClinic && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowClinicDetails(false)
            setSelectedClinic(null)
          }}
          title="ক্লিনিকের বিস্তারিত তথ্য"
        >
          {(() => {
            const clinic = adminClinicData.find(c => c.id === selectedClinic)
            const plan = subscriptionPlans.find(p => p.id === clinic?.planId)
            
            if (!clinic) return <div>ক্লিনিক পাওয়া যায়নি</div>

            return (
              <div className="space-y-6">
                {/* Clinic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>সাধারণ তথ্য</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ক্লিনিকের নাম</label>
                        <p className="font-medium">{clinic.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ইমেইল</label>
                        <p>{clinic.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">যোগদানের তারিখ</label>
                        <p>{new Date(clinic.joinDate).toLocaleDateString('bn-BD')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">স্ট্যাটাস</label>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(clinic.status)}`}>
                          {getStatusText(clinic.status)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>সাবস্ক্রিপশন তথ্য</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">বর্তমান প্ল্যান</label>
                        <p className="font-medium">{plan?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">মাসিক ফি</label>
                        <p className="font-medium text-green-600">
                          {formatCurrency(clinic.revenue, 'BDT')}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">পর���র্তী বিলিং</label>
                        <p>{new Date(clinic.billingDate).toLocaleDateString('bn-BD')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    ইমেইল পাঠান
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    প্ল্যান পরিবর্তন
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    ���নভ��়েস তৈরি
                  </Button>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}
          </div>
        </main>
      </div>
    </div>
  )
}
