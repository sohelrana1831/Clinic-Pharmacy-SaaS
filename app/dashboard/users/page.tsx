'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePaginatedApi, useApiMutation } from '@/hooks/useApi'
import { usersApi, User } from '@/lib/api'
import { UserFormModal } from '@/components/users/user-form-modal'
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  UserCheck,
  Shield,
  Activity,
  Filter
} from 'lucide-react'

export default function UsersPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // API hooks
  const {
    data: users,
    loading,
    error,
    pagination,
    updateParams,
    refetch
  } = usePaginatedApi(usersApi.getUsers, { search: searchTerm, role: roleFilter })

  const { mutate: deleteUser, loading: deleting } = useApiMutation()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateParams({ search: value, page: 1 })
  }

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role)
    updateParams({ role: role || undefined, page: 1 })
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারী মুছে ফেলতে চান?')) {
      try {
        await deleteUser(() => usersApi.deleteUser(userId))
        refetch()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    refetch()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'doctor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'staff':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'অ্যাডমিন'
      case 'doctor': return 'ডাক্তার'
      case 'staff': return 'কর্মী'
      default: return role
    }
  }

  // Calculate stats
  const totalUsers = pagination.total
  const admins = users?.filter(u => u.role === 'admin').length || 0
  const doctors = users?.filter(u => u.role === 'doctor').length || 0
  const staff = users?.filter(u => u.role === 'staff').length || 0

  return (
    <div className="min-h-screen bg-theme-background theme-transition">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-foreground">ব্যবহারকারী ব্যবস্থাপনা</h1>
            <p className="text-theme-muted">সিস্টেম ব্যবহারকারী এবং তাদের ভূমিকা পরিচালনা করুন</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            নতুন ব্যবহারকারী
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">মোট ব্যবহারকারী</p>
                  <p className="text-2xl font-bold text-theme-foreground">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">অ্যাডমিন</p>
                  <p className="text-2xl font-bold text-purple-600">{admins}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">ডাক্তার</p>
                  <p className="text-2xl font-bold text-blue-600">{doctors}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-theme border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-muted">কর্মী</p>
                  <p className="text-2xl font-bold text-green-600">{staff}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
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
                  placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 input-theme"
                />
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="px-3 py-2 border border-theme-default rounded-md bg-theme-card text-theme-foreground input-theme"
              >
                <option value="">সব ভূমিকা</option>
                <option value="admin">অ্যাডমিন</option>
                <option value="doctor">ডাক্তার</option>
                <option value="staff">কর্মী</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="card-theme border">
          <CardHeader>
            <CardTitle className="text-theme-foreground">��্যবহারকারীর তালিকা</CardTitle>
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
                          নাম
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          ��মেইল
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          ফোন
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          ভূমিকা
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          তৈরির তারিখ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium form-label-theme uppercase tracking-wider">
                          কার্যক্রম
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users?.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 theme-transition">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-theme-foreground">{user.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-theme-foreground">{user.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-theme-foreground">{user.phone || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                              {getRoleLabel(user.role)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-theme-muted">
                              {new Date(user.createdAt).toLocaleDateString('bn-BD')}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(user)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(user.id)}
                                disabled={deleting}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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

                {(!users || users.length === 0) && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-theme-muted mx-auto mb-4" />
                    <div className="text-theme-muted">
                      {searchTerm || roleFilter ? 'কোনো ব্যবহারকারী পাওয়া যায়নি' : 'কোনো ব্যবহ��রকারী নেই'}
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

        {/* User Form Modal */}
        <UserFormModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          user={editingUser}
        />
      </div>
    </div>
  )
}
