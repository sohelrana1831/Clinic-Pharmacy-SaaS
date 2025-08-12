'use client'

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
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full gap-1 p-4">
          {Array.from({ length: 32 }).map((_, i) => {
            // Use consistent heights based on index to avoid hydration mismatch
            const heights = [25, 45, 65, 35, 55, 75, 40, 60, 30, 50, 70, 35, 45, 55, 40, 65, 25, 35, 60, 45, 55, 75, 30, 50, 40, 65, 35, 55, 45, 60, 30, 70]
            return (
              <div
                key={i}
                className="bg-gray-400 rounded"
                style={{ height: `${heights[i]}%` }}
              />
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {getChartIcon()}
        <p className="text-gray-700 font-medium text-lg mb-1">{title}</p>
        {description && (
          <p className="text-sm text-gray-500 mb-2">{description}</p>
        )}
        <div className="text-xs text-gray-500 bg-white/70 px-3 py-1 rounded-full">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart • {data.length} data points
        </div>
        {children}
      </div>

      {/* Corner Badge */}
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-600">
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
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 text-blue-600 border-blue-200',
    green: 'from-green-50 to-green-100 text-green-600 border-green-200',
    purple: 'from-purple-50 to-purple-100 text-purple-600 border-purple-200',
    orange: 'from-orange-50 to-orange-100 text-orange-600 border-orange-200',
    red: 'from-red-50 to-red-100 text-red-600 border-red-200'
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-lg border`}>
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-white/70 rounded-lg">
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            change > 0 
              ? 'bg-green-100 text-green-700' 
              : change < 0 
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix && <span className="text-sm font-normal text-gray-600">{suffix}</span>}
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
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-gray-900">
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
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        CSV
      </button>
      <button
        onClick={onExportPDF}
        disabled={disabled}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        PDF
      </button>
    </div>
  )
}
