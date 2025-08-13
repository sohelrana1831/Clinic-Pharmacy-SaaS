'use client'

import { useTheme } from '@/lib/theme-context'
import { BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react'

interface ChartPlaceholderProps {
  title: string
  type: 'bar' | 'line' | 'pie' | 'area'
  description?: string
  data?: any[]
  height?: number
  children?: React.ReactNode
}

export function ChartPlaceholder({
  title,
  type,
  description,
  data = [],
  height = 256,
  children
}: ChartPlaceholderProps) {
  const { theme } = useTheme()
  const getChartIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="h-12 w-12 text-primary-500 dark:text-primary-400 mb-2" />
      case 'line':
        return <TrendingUp className="h-12 w-12 text-success-500 dark:text-success-400 mb-2" />
      case 'pie':
        return <PieChart className="h-12 w-12 text-purple-500 dark:text-purple-400 mb-2" />
      case 'area':
        return <LineChart className="h-12 w-12 text-warning-500 dark:text-warning-400 mb-2" />
      default:
        return <BarChart3 className="h-12 w-12 text-primary-500 dark:text-primary-400 mb-2" />
    }
  }

  const getGradientColors = () => {
    switch (type) {
      case 'bar':
        return 'from-primary-50 to-primary-100 border-primary-300 dark:from-primary-900 dark:to-primary-800 dark:border-primary-700'
      case 'line':
        return 'from-success-50 to-success-100 border-success-300 dark:from-success-900 dark:to-success-800 dark:border-success-700'
      case 'pie':
        return 'from-purple-50 to-purple-100 border-purple-300 dark:from-purple-900 dark:to-purple-800 dark:border-purple-700'
      case 'area':
        return 'from-warning-50 to-warning-100 border-warning-300 dark:from-warning-900 dark:to-warning-800 dark:border-warning-700'
      default:
        return 'from-primary-50 to-primary-100 border-primary-300 dark:from-primary-900 dark:to-primary-800 dark:border-primary-700'
    }
  }

  return (
    <div 
      className={`w-full bg-gradient-to-br ${getGradientColors()} rounded-lg flex flex-col items-center justify-center border-2 border-dashed relative overflow-hidden`}
      style={{ height: `${height}px` }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="grid grid-cols-8 h-full gap-1 p-4">
          {Array.from({ length: 32 }).map((_, i) => {
            // Use consistent heights based on index to avoid hydration mismatch
            const heights = [25, 45, 65, 35, 55, 75, 40, 60, 30, 50, 70, 35, 45, 55, 40, 65, 25, 35, 60, 45, 55, 75, 30, 50, 40, 65, 35, 55, 45, 60, 30, 70]
            return (
              <div
                key={i}
                className="bg-theme-foreground rounded"
                style={{ height: `${heights[i]}%` }}
              />
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {getChartIcon()}
        <p className="text-theme-foreground font-medium text-lg mb-1">{title}</p>
        {description && (
          <p className="text-sm text-theme-muted mb-2">{description}</p>
        )}
        <div className="text-xs text-theme-muted bg-theme-card/70 px-3 py-1 rounded-full border border-theme-default">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart • {data.length} data points
        </div>
        {children}
      </div>

      {/* Corner Badge */}
      <div className="absolute top-3 right-3 bg-theme-card/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-theme-foreground border border-theme-default">
        Preview Mode
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  suffix?: string
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  color = 'blue',
  suffix = ''
}: MetricCardProps) {
  const { theme } = useTheme()

  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700',
    green: 'from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700',
    purple: 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700',
    orange: 'from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700',
    red: 'from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-lg border`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-theme-card/70 rounded-lg border border-theme-default">
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            change > 0
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : change < 0
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-theme-muted mb-1">{title}</p>
        <p className="text-2xl font-bold text-theme-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix && <span className="text-sm font-normal text-theme-muted">{suffix}</span>}
        </p>
      </div>
    </div>
  )
}

interface DataTableProps {
  headers: string[]
  data: any[]
  maxHeight?: number
}

export function DataTable({ headers, data, maxHeight = 300 }: DataTableProps) {
  return (
    <div className="table-theme rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-theme">
          <thead className="border-b">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-medium form-label-theme">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
        <table className="w-full table-theme">
          <tbody className="divide-y">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700 theme-transition">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-theme-foreground">
                    {row[header] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface ExportButtonsProps {
  onExportCSV: () => void
  onExportPDF: () => void
  disabled?: boolean
}

export function ExportButtons({ onExportCSV, onExportPDF, disabled = false }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onExportCSV}
        disabled={disabled}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-theme-foreground bg-theme-card border border-theme-default rounded-md hover-theme-bg disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        CSV
      </button>
      <button
        onClick={onExportPDF}
        disabled={disabled}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-theme-foreground bg-theme-card border border-theme-default rounded-md hover-theme-bg disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        PDF
      </button>
    </div>
  )
}
