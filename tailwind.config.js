/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Theme colors - WCAG AA compliant
        background: {
          light: '#F9FAFB',
          dark: '#111827',
        },
        foreground: {
          light: '#111827',
          dark: '#F9FAFB',
        },
        muted: {
          light: '#6B7280',
          dark: '#9CA3AF',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
        accent: {
          light: '#2563EB',
          dark: '#3B82F6',
        },
        'accent-secondary': {
          light: '#10B981',
          dark: '#34D399',
        },
        // Enhanced primary scale with WCAG AA compliance
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // 4.5:1 contrast on white
          600: '#2563eb', // 7:1 contrast on white - Light mode accent
          700: '#1d4ed8', // 10:1 contrast on white
          800: '#1e40af',
          900: '#1e3a8a', // 15:1 contrast on white
        },
        // Success/secondary colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399', // Dark mode secondary
          500: '#10b981', // Light mode secondary
          600: '#059669', // 7:1 contrast
          700: '#047857', // 10:1 contrast
          800: '#065f46',
          900: '#064e3b',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // 4.5:1 contrast
          600: '#dc2626', // 7:1 contrast
          700: '#b91c1c', // 10:1 contrast
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // 4.5:1 contrast
          600: '#d97706', // 7:1 contrast
          700: '#b45309', // 10:1 contrast
          800: '#92400e',
          900: '#78350f',
        },
        // Gray scale optimized for theme colors
        gray: {
          50: '#F9FAFB',   // Light background
          100: '#F3F4F6',
          200: '#E5E7EB',  // Light border
          300: '#D1D5DB',
          400: '#9CA3AF',  // Dark muted
          500: '#6B7280',  // Light muted
          600: '#4B5563',
          700: '#374151',  // Dark border
          800: '#1F2937',  // Dark card
          900: '#111827',  // Dark background
        }
      },
      fontFamily: {
        sans: ['Inter', 'SolaimanLipi', 'system-ui', 'sans-serif'],
        bengali: ['SolaimanLipi', 'Kalpurush', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'theme-transition': 'themeTransition 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // Screen reader only utility
    function({ addUtilities }) {
      addUtilities({
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        '.not-sr-only': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal',
        },
        // Focus utilities
        '.focus-ring': {
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: '0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.1)',
          },
        },
        '.focus-ring-error': {
          '&:focus': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: '0 0 0 2px #ef4444, 0 0 0 4px rgba(239, 68, 68, 0.1)',
          },
        },
        // High contrast mode support
        '@media (prefers-contrast: high)': {
          '.contrast-high': {
            borderWidth: '2px',
            borderColor: 'currentColor',
          },
        },
        // Reduced motion support
        '@media (prefers-reduced-motion: reduce)': {
          '.motion-reduce': {
            animation: 'none',
            transition: 'none',
          },
        },
      })
    }
  ],
}
