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

// Configure i18next
i18n
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback language
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
    load: 'languageOnly',

    // Backend options for future file loading
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  })

// Handle RTL languages
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

export default i18n
