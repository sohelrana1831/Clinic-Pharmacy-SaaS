// Translation utilities with SSR fallbacks

import { useTranslation } from 'react-i18next'

// Default translations for SSR fallback
const defaultTranslations = {
  'app.title': 'ক্লিনিক MS',
  'app.subtitle': 'ম্যানেজমেন্ট সিস্টেম',
  'navigation.dashboard': 'ড্যাশবোর্ড',
  'navigation.patients': 'রোগীগণ',
  'navigation.appointments': 'অ্যাপয়েন্টমেন্ট',
  'navigation.prescriptions': 'প্রেসক্রিপশন',
  'navigation.inventory': 'ইনভেন্টরি',
  'navigation.pos': 'POS',
  'navigation.reports': 'রিপোর্ট',
  'navigation.billing': 'বিলিং',
  'navigation.subscriptions': 'সাবস্ক্রিপশন',
  'navigation.pricing': 'প্রাইসিং',
  'navigation.settings': 'সেটিংস',
  'user.admin': 'অ্যাডমিন',
  'user.profile': 'প্রোফাইল',
  'user.logout': 'লগআউট',
  'dashboard.title': 'ড্যাশবোর্ড',
  'dashboard.subtitle': 'আপনার ক্লিনিকের সামগ্রিক তথ্য এক নজরে দেখুন',
  'search.placeholder': 'রোগী, ওষুধ বা ডাক্তার খুঁজুন...',
  'language.label': 'ভাষা'
}

// Safe translation hook with fallback
export function useSafeTranslation() {
  try {
    const { t, i18n } = useTranslation()
    return {
      t: (key: string, fallback?: string) => {
        try {
          const translation = t(key)
          return translation !== key ? translation : (fallback || defaultTranslations[key as keyof typeof defaultTranslations] || key)
        } catch {
          return fallback || defaultTranslations[key as keyof typeof defaultTranslations] || key
        }
      },
      i18n
    }
  } catch {
    // Fallback when i18n context is not available (SSR)
    return {
      t: (key: string, fallback?: string) => {
        return fallback || defaultTranslations[key as keyof typeof defaultTranslations] || key
      },
      i18n: null
    }
  }
}

// Server-safe translation function
export function getTranslation(key: string, fallback?: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return fallback or default
    return fallback || defaultTranslations[key as keyof typeof defaultTranslations] || key
  }
  
  // Client-side: use the translation system
  try {
    // This would be called client-side after hydration
    return fallback || defaultTranslations[key as keyof typeof defaultTranslations] || key
  } catch {
    return fallback || key
  }
}
