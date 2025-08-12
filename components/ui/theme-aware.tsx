'use client'

import * as React from "react"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

interface ThemeAwareProps extends React.HTMLAttributes<HTMLElement> {
  component?: keyof JSX.IntrinsicElements
  themeColors?: {
    light: string
    dark: string
  }
}

/**
 * ThemeAware component that automatically applies theme colors
 * with WCAG AA compliance and smooth transitions
 */
export const ThemeAware = React.forwardRef<HTMLElement, ThemeAwareProps>(
  ({ className, component = 'div', themeColors, children, style, ...props }, ref) => {
    const { theme, colors } = useTheme()
    const Component = component as any

    const themeStyle = React.useMemo(() => {
      const baseStyle = {
        ...style,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }

      if (themeColors) {
        return {
          ...baseStyle,
          backgroundColor: themeColors[theme],
        }
      }

      return baseStyle
    }, [style, themeColors, theme])

    return (
      <Component
        ref={ref}
        className={cn("theme-transition", className)}
        style={themeStyle}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

ThemeAware.displayName = "ThemeAware"

/**
 * Pre-configured theme-aware components for common use cases
 */
export const ThemeBackground = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <ThemeAware
      ref={ref}
      className={cn("bg-theme-background text-theme-foreground", className)}
      {...props}
    >
      {children}
    </ThemeAware>
  )
)

export const ThemeCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <ThemeAware
      ref={ref}
      className={cn("card-theme", className)}
      {...props}
    >
      {children}
    </ThemeAware>
  )
)

export const ThemeButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <ThemeAware
      component="button"
      ref={ref}
      className={cn("btn-theme-primary", className)}
      {...props}
    >
      {children}
    </ThemeAware>
  )
)

ThemeBackground.displayName = "ThemeBackground"
ThemeCard.displayName = "ThemeCard"
ThemeButton.displayName = "ThemeButton"
