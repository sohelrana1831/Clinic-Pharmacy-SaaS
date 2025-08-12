'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()

  const menuItems = [
    { icon: LayoutDashboard, label: t('navigation.dashboard'), href: '/dashboard' },
    { icon: Users, label: t('navigation.patients'), href: '/dashboard/patients' },
    { icon: Calendar, label: t('navigation.appointments'), href: '/dashboard/appointments' },
    { icon: FileText, label: t('navigation.prescriptions'), href: '/prescriptions/editor' },
    { icon: Package, label: t('navigation.inventory'), href: '/dashboard/inventory' },
    { icon: Pill, label: t('navigation.pos'), href: '/dashboard/pos' },
    { icon: BarChart3, label: t('navigation.reports'), href: '/dashboard/reports' },
    { icon: CreditCard, label: t('navigation.billing'), href: '/dashboard/billing' },
    { icon: UserCheck, label: t('navigation.subscriptions'), href: '/admin/subscriptions' },
    { icon: DollarSign, label: t('navigation.pricing'), href: '/pricing' },
    { icon: Settings, label: t('navigation.settings'), href: '/dashboard/settings' },
  ]

  return (
    <div className={`
      ${collapsed ? 'w-16' : 'w-64'}
      h-screen bg-theme-card border-r border-theme-default theme-transition flex flex-col
    `}>
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-theme-default flex items-center justify-between">
        {!collapsed && (
          <div>
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
              <li key={index}>
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
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-theme-default">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center theme-transition">
              <span className="text-theme-accent font-medium">SR</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-theme-foreground">SR Pharma</p>
              <p className="text-xs text-theme-muted">{t('user.admin')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
