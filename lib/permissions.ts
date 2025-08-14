// Role-based permissions system
import React from 'react'

export type UserRole = 'admin' | 'doctor' | 'staff'

export interface Permission {
  resource: string
  actions: string[]
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'patients', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'prescriptions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'medicines', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'inventory', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'sales', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'reports', actions: ['read'] },
    { resource: 'settings', actions: ['read', 'update'] },
    { resource: 'billing', actions: ['read', 'update'] },
  ],
  doctor: [
    { resource: 'patients', actions: ['create', 'read', 'update'] },
    { resource: 'appointments', actions: ['create', 'read', 'update'] },
    { resource: 'prescriptions', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'medicines', actions: ['read'] },
    { resource: 'reports', actions: ['read'] },
  ],
  staff: [
    { resource: 'patients', actions: ['create', 'read', 'update'] },
    { resource: 'appointments', actions: ['create', 'read', 'update'] },
    { resource: 'medicines', actions: ['read', 'update'] },
    { resource: 'inventory', actions: ['read', 'update'] },
    { resource: 'sales', actions: ['create', 'read'] },
  ],
}

// Check if user has permission
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return false

  const resourcePermission = rolePermissions.find(p => p.resource === resource)
  if (!resourcePermission) return false

  return resourcePermission.actions.includes(action)
}

// Check multiple permissions
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.some(({ resource, action }) => 
    hasPermission(userRole, resource, action)
  )
}

// Check if user can access a route/page
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, { resource: string; action: string }> = {
    '/dashboard/users': { resource: 'users', action: 'read' },
    '/dashboard/patients': { resource: 'patients', action: 'read' },
    '/dashboard/appointments': { resource: 'appointments', action: 'read' },
    '/dashboard/prescriptions': { resource: 'prescriptions', action: 'read' },
    '/dashboard/prescriptions-list': { resource: 'prescriptions', action: 'read' },
    '/dashboard/inventory': { resource: 'inventory', action: 'read' },
    '/dashboard/pos': { resource: 'sales', action: 'create' },
    '/dashboard/reports': { resource: 'reports', action: 'read' },
    '/dashboard/billing': { resource: 'billing', action: 'read' },
    '/dashboard/settings': { resource: 'settings', action: 'read' },
  }

  const routePermission = routePermissions[route]
  if (!routePermission) return true // Allow access to unprotected routes

  return hasPermission(userRole, routePermission.resource, routePermission.action)
}

// Get filtered navigation items based on user role
export interface NavItem {
  name: string
  href: string
  icon: any
  badge?: string
  subItems?: NavItem[]
}

export function getFilteredNavigation(userRole: UserRole, allNavItems: NavItem[]): NavItem[] {
  return allNavItems.filter(item => {
    // Check main item permission
    if (!canAccessRoute(userRole, item.href)) {
      return false
    }

    // Filter sub-items if they exist
    if (item.subItems) {
      item.subItems = item.subItems.filter(subItem => 
        canAccessRoute(userRole, subItem.href)
      )
    }

    return true
  })
}

// Permission checker hook for components
export function usePermissions(userRole: UserRole) {
  return {
    can: (resource: string, action: string) => hasPermission(userRole, resource, action),
    canAny: (permissions: Array<{ resource: string; action: string }>) => 
      hasAnyPermission(userRole, permissions),
    canAccess: (route: string) => canAccessRoute(userRole, route),
  }
}

// Permission wrapper component
export interface PermissionWrapperProps {
  userRole: UserRole
  resource: string
  action: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionWrapper({
  userRole,
  resource,
  action,
  children,
  fallback = null
}: PermissionWrapperProps): React.ReactElement | null {
  if (!hasPermission(userRole, resource, action)) {
    return fallback as React.ReactElement | null
  }

  return children as React.ReactElement
}

// Get user role label
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: 'অ্যাডমিন',
    doctor: 'ডাক্তার',
    staff: 'কর্মী',
  }
  return labels[role] || role
}

// Check if user can perform bulk operations
export function canPerformBulkOperations(userRole: UserRole, resource: string): boolean {
  return userRole === 'admin' || hasPermission(userRole, resource, 'delete')
}

// Get available actions for a resource based on user role
export function getAvailableActions(userRole: UserRole, resource: string): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return []

  const resourcePermission = rolePermissions.find(p => p.resource === resource)
  return resourcePermission?.actions || []
}
