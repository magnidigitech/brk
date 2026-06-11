'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, uiTranslations } from '@/lib/translations'

interface LanguageContextProps {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  tContent: (field: any, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  // Load language preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user-language') as Language
      if (stored === 'en' || stored === 'te' || stored === 'ten') {
        setLanguageState(stored)
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-language', lang)
    }
  }

  // Translation function for UI keys
  const t = (key: string): string => {
    const translationGroup = uiTranslations[key]
    if (!translationGroup) {
      return key
    }
    return translationGroup[language] || translationGroup['en'] || key
  }

  // Helper to resolve localized Sanity fields (which have subfields en, te, ten)
  const tContent = (field: any, fallback: string = ''): string => {
    if (!field) return fallback
    if (typeof field === 'string') return field
    
    // Check custom localized fields { en, te, ten }
    const val = field[language] || field['en'] || field['te'] || field['ten']
    if (val && typeof val === 'string') return val
    
    return fallback
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tContent }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
