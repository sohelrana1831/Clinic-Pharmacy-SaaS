'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface HydrationSafeTextProps {
  tKey: string
  fallback?: string
  className?: string
}

export function HydrationSafeText({ tKey, fallback, className }: HydrationSafeTextProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and before hydration, show fallback or empty
  if (!mounted) {
    return <span className={className}>{fallback || ''}</span>
  }

  // After hydration, show translated text
  return <span className={className}>{t(tKey)}</span>
}
