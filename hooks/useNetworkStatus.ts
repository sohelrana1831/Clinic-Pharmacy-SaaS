'use client'

import { useState, useEffect } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setIsReconnecting(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setIsReconnecting(false)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !navigator.onLine) {
        // Tab became visible but we're offline
        setIsReconnecting(true)
        
        // Try to reconnect after a short delay
        setTimeout(() => {
          if (navigator.onLine) {
            setIsOnline(true)
            setIsReconnecting(false)
          } else {
            setIsReconnecting(false)
          }
        }, 1000)
      }
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Function to manually check connectivity
  const checkConnectivity = async () => {
    if (typeof window === 'undefined') {
      return true
    }

    try {
      setIsReconnecting(true)
      
      // Try to fetch a small resource to test connectivity
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(3000)
      })
      
      const connected = response.ok
      setIsOnline(connected)
      return connected
    } catch (error) {
      setIsOnline(false)
      return false
    } finally {
      setIsReconnecting(false)
    }
  }

  return {
    isOnline,
    isReconnecting,
    checkConnectivity
  }
}
