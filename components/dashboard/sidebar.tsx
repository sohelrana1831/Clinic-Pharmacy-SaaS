'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Pill,
  BarChart3,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  UserCheck,
  DollarSign
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'ড্যাশবোর্ড', href: '/dashboard' },
  { icon: Users, label: 'রোগীগণ', href: '/dashboard/patients' },
  { icon: Calendar, label: 'অ্যাপয়েন্টমেন্ট', href: '/dashboard/appointments' },
  { icon: FileText, label: 'প্রেসক্রিপশন', href: '/prescriptions/editor' },
  { icon: Package, label: 'ইনভেন্টরি', href: '/dashboard/inventory' },
  { icon: Pill, label: 'POS', href: '/dashboard/pos' },
  { icon: BarChart3, label: 'রিপোর্ট', href: '/dashboard/reports' },
  { icon: CreditCard, label: 'বিলিং', href: '/dashboard/billing' },
  { icon: UserCheck, label: 'সাবস্ক্রিপশন', href: '/admin/subscriptions' },
  { icon: DollarSign, label: 'প্রাইসিং', href: '/pricing' },
  { icon: Settings, label: 'সেটিংস', href: '/dashboard/settings' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={`
      ${collapsed ? 'w-16' : 'w-64'} 
      h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
    `}>
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-xl font-bold text-blue-600">ক্লিনিক MS</h2>
            <p className="text-sm text-gray-500">ম্যানেজমেন্ট সিস্টেম</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">SR</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">SR Pharma</p>
              <p className="text-xs text-gray-500">অ্যাডমিন</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
