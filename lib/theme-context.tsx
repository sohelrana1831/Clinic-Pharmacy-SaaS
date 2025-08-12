'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeTransition = 'smooth' | 'instant'

interface ThemeColors {
  background: string
  foreground: string
  card: string
  border: string
  muted: string
  accent: string
  accentSecondary: string
}

interface ThemeContextType {
  theme: Theme
  colors: ThemeColors
  isTransitioning: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme, transition?: ThemeTransition) => void
  getThemeColors: (theme?: Theme) => ThemeColors
}

// WCAG AA compliant color definitions
const themeColors: Record<Theme, ThemeColors> = {
  light: {
    background: '#F9FAFB',
    foreground: '#111827',
    card: '#FFFFFF',
    border: '#E5E7EB',
    muted: '#6B7280',
    accent: '#2563EB',
    accentSecondary: '#10B981',
  },
  dark: {
    background: '#111827',
    foreground: '#F9FAFB',
    card: '#1F2937',
    border: '#374151',
    muted: '#9CA3AF',
    accent: '#3B82F6',
    accentSecondary: '#34D399',
  },
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme

    setThemeState(initialTheme)
    setMounted(true)
  }, [])

  // Apply theme to document with enhanced transition support
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const body = document.body

    // Start transition
    setIsTransitioning(true)

    // Apply theme classes
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    // Update CSS custom properties for immediate color changes
    const colors = themeColors[theme]
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVar, value)
    })

    // Save to localStorage
    localStorage.setItem('theme', theme)

    // End transition after animation completes
    const timeout = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [theme, mounted])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mounted])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const setTheme = (newTheme: Theme, transition: ThemeTransition = 'smooth') => {
    if (transition === 'instant') {
      document.documentElement.style.setProperty('--transition-theme', 'none')
      setTimeout(() => {
        document.documentElement.style.removeProperty('--transition-theme')
      }, 50)
    }
    setThemeState(newTheme)
  }

  const getThemeColors = (targetTheme?: Theme): ThemeColors => {
    return themeColors[targetTheme || theme]
  }

  const contextValue: ThemeContextType = {
    theme,
    colors: themeColors[theme],
    isTransitioning,
    toggleTheme,
    setTheme,
    getThemeColors,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Prevent hydration mismatch by hiding content until mounted */}
      <div
        style={{
          visibility: mounted ? 'visible' : 'hidden',
          transition: 'visibility 0s linear 0s'
        }}
        className={isTransitioning ? 'animate-theme-fade-in' : ''}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
