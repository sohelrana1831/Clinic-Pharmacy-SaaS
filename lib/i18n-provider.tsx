'use client'

import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/src/i18n'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Initialize i18n when component mounts on client
    if (!i18n.isInitialized) {
      i18n.init()
    }
  }, [])

  // Always render with I18nextProvider to prevent hydration mismatch
  // i18n will fallback to default language during SSR
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}
