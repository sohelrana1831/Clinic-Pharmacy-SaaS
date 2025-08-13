import { useState, useEffect, useCallback } from 'react'
import { ApiResponse } from '@/lib/api'

// Generic API hook with loading, error, and data state
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiCall()
      
      if (response.success) {
        setData(response.data)
      } else {
        setError(response.message || 'An error occurred')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
  }
}

// Hook for paginated API calls
export function usePaginatedApi<T>(
  apiCall: (params: any) => Promise<ApiResponse<T[]>>,
  initialParams: any = {}
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [params, setParams] = useState(initialParams)

  const fetchData = useCallback(async (customParams?: any, customPage?: number, customLimit?: number) => {
    // Don't make requests on the server side
    if (typeof window === 'undefined') {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const requestParams = {
        ...(customParams !== undefined ? customParams : params),
        page: customPage !== undefined ? customPage : pagination.page,
        limit: customLimit !== undefined ? customLimit : pagination.limit,
      }

      const response = await apiCall(requestParams)

      if (response.success) {
        setData(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.message || 'An error occurred')
      }
    } catch (err: any) {
      console.error('API fetch error:', err)

      // Handle specific error types
      if (err.message === 'Failed to fetch' || err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError(err.message || 'An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, []) // Remove apiCall dependency to prevent recreation

  // Initial load only - check if we're on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchData(initialParams, 1, 10)
    }
  }, [fetchData]) // Only depend on fetchData

  // Handle params changes - only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && JSON.stringify(params) !== JSON.stringify(initialParams)) {
      fetchData(params, 1, pagination.limit)
    }
  }, [params, initialParams]) // Remove fetchData and pagination.limit dependencies

  // Handle page changes
  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
    fetchData(params, page, pagination.limit)
  }, [params, pagination.limit, fetchData])

  // Handle page size changes
  const changePageSize = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
    fetchData(params, 1, limit)
  }, [params, fetchData])

  const updateParams = useCallback((newParams: any) => {
    const updatedParams = { ...params, ...newParams }
    setParams(updatedParams)
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [params])

  const refetch = useCallback(() => {
    fetchData(params, pagination.page, pagination.limit)
  }, [fetchData, params, pagination.page, pagination.limit])

  return {
    data,
    loading,
    error,
    pagination,
    params,
    updateParams,
    goToPage,
    changePageSize,
    refetch,
    setData,
  }
}

// Hook for form submissions
export function useApiMutation<T, D = any>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const mutate = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>,
    options?: {
      onSuccess?: (data: T) => void
      onError?: (error: string) => void
    }
  ) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      
      const response = await apiCall()
      
      if (response.success) {
        setSuccess(true)
        options?.onSuccess?.(response.data)
        return response.data
      } else {
        const errorMsg = response.message || 'An error occurred'
        setError(errorMsg)
        options?.onError?.(errorMsg)
        throw new Error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred'
      setError(errorMsg)
      options?.onError?.(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setSuccess(false)
  }, [])

  return {
    mutate,
    loading,
    error,
    success,
    reset,
  }
}

// Hook for search functionality with debouncing
export function useSearch(
  onSearch: (query: string) => void,
  delay: number = 300
) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay])

  // Call search function when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  return {
    query,
    setQuery,
    debouncedQuery,
  }
}

// Hook for managing multiple selection
export function useSelection<T>(
  items: T[],
  getId: (item: T) => string | number
) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set())

  const isSelected = (item: T) => selectedIds.has(getId(item))
  
  const isAllSelected = items.length > 0 && items.every(item => isSelected(item))
  
  const isIndeterminate = selectedIds.size > 0 && !isAllSelected

  const toggleItem = (item: T) => {
    const id = getId(item)
    const newSelected = new Set(selectedIds)
    
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    
    setSelectedIds(newSelected)
  }

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(items.map(getId)))
    }
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const getSelectedItems = () => {
    return items.filter(item => isSelected(item))
  }

  return {
    selectedIds,
    isSelected,
    isAllSelected,
    isIndeterminate,
    toggleItem,
    toggleAll,
    clearSelection,
    getSelectedItems,
    selectedCount: selectedIds.size,
  }
}

export default useApi
