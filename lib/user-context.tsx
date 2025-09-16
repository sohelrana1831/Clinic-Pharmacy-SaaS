'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
  avatar?: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (savedUser && token) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      } else {
        // Set demo user for development
        const demoUser: User = {
          id: '1',
          name: 'ডা. রহিম উদ্দিন',
          email: 'rahim@srpharma.com',
          role: 'admin',
          permissions: [
            'view_dashboard',
            'manage_appointments',
            'manage_patients',
            'manage_prescriptions',
            'manage_inventory',
            'manage_pos',
            'view_reports',
            'manage_users',
            'manage_settings',
            'manage_billing'
          ]
        }
        setUser(demoUser)
        localStorage.setItem('user', JSON.stringify(demoUser))
        localStorage.setItem('token', 'demo-token')
      }
      setIsLoading(false)
    }
  }, [])

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
  }

  const contextValue: UserContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
    logout,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

// Role definitions with permissions
export const ROLES = {
  admin: {
    name: 'Admin',
    permissions: [
      'view_dashboard',
      'manage_appointments',
      'manage_patients', 
      'manage_prescriptions',
      'manage_inventory',
      'manage_pos',
      'view_reports',
      'manage_users',
      'manage_settings',
      'manage_billing'
    ]
  },
  doctor: {
    name: 'Doctor',
    permissions: [
      'view_dashboard',
      'manage_appointments',
      'manage_patients',
      'manage_prescriptions',
      'view_reports'
    ]
  },
  pharmacist: {
    name: 'Pharmacist', 
    permissions: [
      'view_dashboard',
      'manage_inventory',
      'manage_pos',
      'view_reports'
    ]
  },
  receptionist: {
    name: 'Receptionist',
    permissions: [
      'view_dashboard',
      'manage_appointments',
      'manage_patients'
    ]
  }
} as const

export type RoleType = keyof typeof ROLES
