'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Patient } from '@/lib/patients-data'
import { Search, Eye, Edit, Plus, Calendar, FileText } from 'lucide-react'

interface PatientsTableProps {
  patients: Patient[]
  onViewPatient: (patient: Patient) => void
  onEditPatient: (patient: Patient) => void
  onAddPatient: () => void
}

export function PatientsTable({ patients, onViewPatient, onEditPatient, onAddPatient }: PatientsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPatients, setFilteredPatients] = useState(patients)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(term.toLowerCase()) ||
      patient.phone.includes(term) ||
      patient.id.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredPatients(filtered)
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">রোগীর তালিকা</h1>
          <p className="text-gray-600">সকল রোগীর তথ্য দেখুন ও পরিচালনা করুন</p>
        </div>
        <Button onClick={onAddPatient} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          নতুন রোগী
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="নাম, ফোন বা ID দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">মোট: {filteredPatients.length} জন</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  রোগী ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  নাম
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ফোন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  বয়স
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  শেষ ভিজিট
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  কার্যক্রম
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{patient.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium text-sm">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.gender === 'male' ? 'পুরুষ' : patient.gender === 'female' ? 'মহিলা' : 'অন্যান্য'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.phone}</div>
                    {patient.email && (
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{calculateAge(patient.dateOfBirth)} বছর</div>
                    <div className="text-sm text-gray-500">{formatDate(patient.dateOfBirth)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.lastVisit ? (
                      <div className="text-sm text-gray-900">{formatDate(patient.lastVisit)}</div>
                    ) : (
                      <div className="text-sm text-gray-500">কোনো ভিজিট নেই</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewPatient(patient)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditPatient(patient)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? 'কোনো রোগী পাওয়া যায়নি' : 'এখনো কোনো রোগী যোগ করা হয়নি'}
            </div>
            {!searchTerm && (
              <Button 
                onClick={onAddPatient} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                প্রথম রোগী যোগ করুন
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
