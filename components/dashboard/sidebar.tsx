'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/lib/user-context'
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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()
  const { hasPermission, user } = useUser()

  const allMenuItems = [
    { icon: LayoutDashboard, label: t('navigation.dashboard'), href: '/dashboard', permission: 'view_dashboard' },
    { icon: Users, label: t('navigation.patients'), href: '/dashboard/patients', permission: 'manage_patients' },
    { icon: Calendar, label: t('navigation.appointments'), href: '/dashboard/appointments', permission: 'manage_appointments' },
    { icon: FileText, label: t('navigation.prescriptions'), href: '/dashboard/prescriptions', permission: 'manage_prescriptions' },
    { icon: Package, label: t('navigation.inventory'), href: '/dashboard/inventory', permission: 'manage_inventory' },
    { icon: Pill, label: t('navigation.pos'), href: '/dashboard/pos', permission: 'manage_pos' },
    { icon: BarChart3, label: t('navigation.reports'), href: '/dashboard/reports', permission: 'view_reports' },
    { icon: CreditCard, label: t('navigation.billing'), href: '/dashboard/billing', permission: 'manage_billing' },
    { icon: UserCheck, label: t('navigation.users'), href: '/dashboard/users', permission: 'manage_users' },
    { icon: Settings, label: t('navigation.settings'), href: '/dashboard/settings', permission: 'manage_settings' },
  ]

  // Filter menu items based on user permissions
  const menuItems = allMenuItems.filter(item => hasPermission(item.permission))

  return (
    <div className={`
      ${collapsed ? 'w-16' : 'w-64'}
      h-screen bg-theme-card border-r border-theme-default theme-transition flex flex-col
    `} suppressHydrationWarning>
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-theme-default flex items-center justify-between">
        {!collapsed && (
          <div suppressHydrationWarning>
            <h2 className="text-xl font-bold text-theme-accent">{t('app.title')}</h2>
            <p className="text-sm text-theme-muted">{t('app.subtitle')}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover-theme-bg theme-transition"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-theme-muted" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-theme-muted" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <li key={index} suppressHydrationWarning>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-3 py-3 rounded-lg text-sm font-medium theme-transition
                    ${isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-theme-accent border-r-2 border-theme-accent'
                      : 'text-theme-foreground hover-theme-bg'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  {!collapsed && <span suppressHydrationWarning>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-theme-default" suppressHydrationWarning>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center theme-transition">
              <span className="text-theme-accent font-medium">SR</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-theme-foreground">SR Pharma</p>
              <p className="text-xs text-theme-muted" suppressHydrationWarning>{t('user.admin')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
