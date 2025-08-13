import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/auth/login'
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Failed to fetch') {
      console.error('Network error - possibly CORS or server issue')
    }

    return Promise.reject(error)
  }
)

// Generic API response interface
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: any
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Generic API service class
class ApiService {
  // Generic GET request
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.get(url, { params })
      return response.data
    } catch (error: any) {
      console.error(`GET ${url} failed:`, error)
      throw new Error(error.response?.data?.message || error.message || 'Request failed')
    }
  }

  // Generic POST request
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data)
      return response.data
    } catch (error: any) {
      console.error(`POST ${url} failed:`, error)
      throw new Error(error.response?.data?.message || error.message || 'Request failed')
    }
  }

  // Generic PUT request
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data)
      return response.data
    } catch (error: any) {
      console.error(`PUT ${url} failed:`, error)
      throw new Error(error.response?.data?.message || error.message || 'Request failed')
    }
  }

  // Generic PATCH request
  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.patch(url, data)
      return response.data
    } catch (error: any) {
      console.error(`PATCH ${url} failed:`, error)
      throw new Error(error.response?.data?.message || error.message || 'Request failed')
    }
  }

  // Generic DELETE request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api.delete(url)
      return response.data
    } catch (error: any) {
      console.error(`DELETE ${url} failed:`, error)
      throw new Error(error.response?.data?.message || error.message || 'Request failed')
    }
  }
}

const apiService = new ApiService()

// ================== PATIENTS API ==================
export interface Patient {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  dateOfBirth?: string
  gender?: string
  bloodGroup?: string
  createdAt: string
  updatedAt: string
}

export const patientsApi = {
  // Get all patients with pagination and search
  getPatients: (params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => apiService.get<Patient[]>('/patients', params),

  // Get patient by ID
  getPatient: (id: string) => apiService.get<Patient>(`/patients/${id}`),

  // Create new patient
  createPatient: (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiService.post<Patient>('/patients', data),

  // Update patient
  updatePatient: (id: string, data: Partial<Patient>) => 
    apiService.put<Patient>(`/patients/${id}`, data),

  // Delete patient
  deletePatient: (id: string) => apiService.delete(`/patients/${id}`),
}

// ================== MEDICINES API ==================
export interface Medicine {
  id: string
  sku: string
  name: string
  genericName?: string
  category: string
  manufacturer?: string
  strength?: string
  unit: string
  purchasePrice: number
  sellingPrice: number
  stockQty: number
  reorderLevel: number
  expiryDate?: string
  batchNumber?: string
  createdAt: string
  updatedAt: string
}

export const medicinesApi = {
  // Get all medicines with pagination and search
  getMedicines: (params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    lowStock?: boolean
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => apiService.get<Medicine[]>('/medicines', params),

  // Get medicine by ID
  getMedicine: (id: string) => apiService.get<Medicine>(`/medicines/${id}`),

  // Create new medicine
  createMedicine: (data: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiService.post<Medicine>('/medicines', data),

  // Update medicine
  updateMedicine: (id: string, data: Partial<Medicine>) => 
    apiService.put<Medicine>(`/medicines/${id}`, data),

  // Delete medicine
  deleteMedicine: (id: string) => apiService.delete(`/medicines/${id}`),

  // Update stock
  updateStock: (id: string, data: { quantity: number; type: 'add' | 'subtract'; reason?: string }) =>
    apiService.post(`/medicines/${id}/stock`, data),

  // Get stock movements
  getStockMovements: (id: string) => apiService.get(`/medicines/${id}/movements`),
}

// ================== APPOINTMENTS API ==================
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  patient?: Patient
  doctor?: { id: string; name: string }
  date: string
  time: string
  type: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const appointmentsApi = {
  // Get all appointments with pagination and filters
  getAppointments: (params?: {
    page?: number
    limit?: number
    date?: string
    status?: string
    doctorId?: string
    patientId?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => apiService.get<Appointment[]>('/appointments', params),

  // Get appointment by ID
  getAppointment: (id: string) => apiService.get<Appointment>(`/appointments/${id}`),

  // Create new appointment
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'doctor'>) => 
    apiService.post<Appointment>('/appointments', data),

  // Update appointment
  updateAppointment: (id: string, data: Partial<Appointment>) => 
    apiService.put<Appointment>(`/appointments/${id}`, data),

  // Delete appointment
  deleteAppointment: (id: string) => apiService.delete(`/appointments/${id}`),

  // Get today's appointments
  getTodayAppointments: () => apiService.get<Appointment[]>('/appointments/today'),
}

// ================== PRESCRIPTIONS API ==================
export interface PrescriptionMedicine {
  id: string
  medicineId: string
  medicine?: Medicine
  dosage: string
  frequency: string
  duration: string
  instructions?: string
  quantity: number
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  patient?: Patient
  doctor?: { id: string; name: string }
  date: string
  diagnosis: string
  notes?: string
  status: string
  medicines: PrescriptionMedicine[]
  createdAt: string
  updatedAt: string
}

export const prescriptionsApi = {
  // Get all prescriptions with pagination and filters
  getPrescriptions: (params?: {
    page?: number
    limit?: number
    patientId?: string
    doctorId?: string
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => apiService.get<Prescription[]>('/prescriptions', params),

  // Get prescription by ID
  getPrescription: (id: string) => apiService.get<Prescription>(`/prescriptions/${id}`),

  // Create new prescription
  createPrescription: (data: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'patient' | 'doctor'>) => 
    apiService.post<Prescription>('/prescriptions', data),

  // Update prescription
  updatePrescription: (id: string, data: Partial<Prescription>) => 
    apiService.put<Prescription>(`/prescriptions/${id}`, data),

  // Delete prescription
  deletePrescription: (id: string) => apiService.delete(`/prescriptions/${id}`),
}

// ================== SALES API ==================
export interface SaleItem {
  id: string
  medicineId: string
  medicine?: Medicine
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Sale {
  id: string
  invoiceNo: string
  patientId?: string
  patient?: Patient
  totalAmount: number
  discount: number
  tax: number
  finalAmount: number
  paymentMethod: string
  status: string
  items: SaleItem[]
  createdAt: string
  updatedAt: string
}

export const salesApi = {
  // Get all sales with pagination and filters
  getSales: (params?: {
    page?: number
    limit?: number
    date?: string
    paymentMethod?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => apiService.get<Sale[]>('/sales', params),

  // Get sale by ID
  getSale: (id: string) => apiService.get<Sale>(`/sales/${id}`),

  // Create new sale
  createSale: (data: Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'patient'>) => 
    apiService.post<Sale>('/sales', data),

  // Update sale
  updateSale: (id: string, data: Partial<Sale>) => 
    apiService.put<Sale>(`/sales/${id}`, data),

  // Delete sale
  deleteSale: (id: string) => apiService.delete(`/sales/${id}`),

  // Get sales analytics
  getAnalytics: (params?: { startDate?: string; endDate?: string }) =>
    apiService.get('/sales/analytics', params),
}

// ================== DASHBOARD API ==================
export interface DashboardStats {
  todayAppointments: number
  totalPatients: number
  todaySales: number
  lowStockMedicines: number
  recentAppointments: Appointment[]
  recentSales: Sale[]
  salesChart: { date: string; amount: number }[]
}

export const dashboardApi = {
  // Get dashboard statistics
  getStats: () => apiService.get<DashboardStats>('/dashboard/stats'),
}

// ================== USERS API ==================
export interface User {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export const usersApi = {
  // Get all users (doctors/staff)
  getUsers: (params?: { role?: string }) => apiService.get<User[]>('/users', params),

  // Get current user profile
  getProfile: () => apiService.get<User>('/users/profile'),

  // Update profile
  updateProfile: (data: Partial<User>) => apiService.put<User>('/users/profile', data),
}

export default apiService
