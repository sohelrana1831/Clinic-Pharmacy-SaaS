'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ChevronDown, Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
]

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
    
    // Store language preference in localStorage
    localStorage.setItem('i18nextLng', languageCode)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 theme-transition focus-ring"
        aria-label={t('language.label')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 text-theme-foreground" />
        <span className="text-sm font-medium text-theme-foreground">
          {currentLanguage.nativeName}
        </span>
        <ChevronDown className={`h-4 w-4 text-theme-foreground theme-transition ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-48 modal-theme rounded-lg z-50 animate-slide-up">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-medium text-theme-muted uppercase tracking-wider border-b border-theme-default mb-2">
              {t('language.label')}
            </div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 text-sm rounded-md theme-transition focus-ring
                  ${i18n.language === language.code
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-theme-accent'
                    : 'text-theme-foreground hover-theme-bg'
                  }
                `}
                role="option"
                aria-selected={i18n.language === language.code}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-theme-muted">{language.name}</span>
                </div>
                {i18n.language === language.code && (
                  <div className="w-2 h-2 bg-theme-accent rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
