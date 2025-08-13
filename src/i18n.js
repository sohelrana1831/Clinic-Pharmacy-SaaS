import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
import enTranslation from './locales/en/translation.json'
import bnTranslation from './locales/bn/translation.json'
import arTranslation from './locales/ar/translation.json'

const resources = {
  en: {
    translation: enTranslation
  },
  bn: {
    translation: bnTranslation
  },
  ar: {
    translation: arTranslation
  }
}

// Check if we're on the client side
const isClient = typeof window !== 'undefined'

// Configure i18next
if (isClient) {
  // Client-side configuration with language detection
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'bn', // Default to Bengali
      debug: process.env.NODE_ENV === 'development',

      // Language detection options
      detection: {
        order: [
          'localStorage', 
          'sessionStorage', 
          'navigator', 
          'htmlTag', 
          'path', 
          'subdomain'
        ],
        caches: ['localStorage', 'sessionStorage'],
        lookupLocalStorage: 'i18nextLng',
        lookupSessionStorage: 'i18nextLng',
        checkWhitelist: true
      },

      interpolation: {
        escapeValue: false // React already does escaping
      },

      // React specific options
      react: {
        useSuspense: false // Disable suspense mode to avoid issues with SSR
      },

      // Language whitelist
      supportedLngs: ['en', 'bn', 'ar'],
      nonExplicitSupportedLngs: true,

      // Namespace options
      defaultNS: 'translation',
      ns: ['translation'],

      // Key separator
      keySeparator: '.',
      nsSeparator: ':',

      // Load options
      load: 'languageOnly'
    })

  // Handle RTL languages (client-side only)
  i18n.on('languageChanged', (lng) => {
    const isRTL = lng === 'ar'
    const htmlElement = document.documentElement
    
    if (isRTL) {
      htmlElement.setAttribute('dir', 'rtl')
      htmlElement.classList.add('rtl')
    } else {
      htmlElement.setAttribute('dir', 'ltr')
      htmlElement.classList.remove('rtl')
    }
    
    // Store language preference
    localStorage.setItem('i18nextLng', lng)
  })
} else {
  // Server-side configuration (minimal setup)
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'bn', // Default language for SSR
      fallbackLng: 'bn',
      debug: false,

      interpolation: {
        escapeValue: false
      },

      react: {
        useSuspense: false
      },

      // Namespace options
      defaultNS: 'translation',
      ns: ['translation'],

      // Key separator
      keySeparator: '.',
      nsSeparator: ':'
    })
}

export default i18n
