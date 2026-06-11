'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LifeBuoy, Globe } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { Language } from '@/lib/translations'

interface NavbarProps {
  siteSettings?: {
    candidateName?: any
    roleBadge?: any
  } | null
}

export default function Navbar({ siteSettings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t, tContent } = useLanguage()
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)

  // Resolve localized name from server-provided settings
  const rawName = siteSettings?.candidateName
  let dispName = tContent(rawName, 'B. Ramakrishna')
  if (dispName.startsWith('Bhashyam')) dispName = 'B. Ramakrishna'

  const dispBadge = tContent(siteSettings?.roleBadge, 'Rajya Sabha MP')

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setLangDropdownOpen(false)
  }

  const languageLabels: Record<Language, string> = {
    en: 'English',
    te: 'తెలుగు',
    ten: 'Tenglish'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-saffron-400 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 border-2 border-white shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/telugudesamlogo.png" 
                  alt="TDP Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <span className="block font-black text-base md:text-lg text-navy-900 tracking-wide leading-tight uppercase">
                  {dispName}
                </span>
                <span className="block text-[10px] font-bold text-saffron-600 tracking-widest uppercase leading-tight md:leading-normal">
                  {dispBadge.includes('(') ? (
                    <>
                      <span className="block md:inline">{dispBadge.split('(')[0].trim()}</span>
                      <span className="block md:inline md:ml-1">({dispBadge.split('(')[1]}</span>
                    </>
                  ) : (
                    dispBadge
                  )}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-bold text-navy-900 hover:text-saffron-600 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-bold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              {t('nav.about')}
            </Link>
            <Link
              href="/state-focus"
              className="text-sm font-bold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              {t('nav.stateFocus')}
            </Link>
            <Link
              href="/development-works"
              className="text-sm font-bold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              {t('nav.publicInitiatives')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-bold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              {t('nav.contact')}
            </Link>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-navy-900" />
                <span>{languageLabels[language]}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50">
                  {(['en', 'te'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`block w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer hover:bg-slate-50 ${
                        language === lang ? 'text-saffron-600 bg-saffron-50/50' : 'text-slate-700'
                      }`}
                    >
                      {languageLabels[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grievance Portal CTA */}
            <Link
              href="/grievance"
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-extrabold text-white bg-navy-900 hover:bg-navy-800 border border-navy-950 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <LifeBuoy className="w-4 h-4 mr-2 text-saffron-400" />
              {t('nav.grievancePortal')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            {/* Quick Language switch on mobile header */}
            <button
              onClick={() => {
                const nextLang: Record<Language, Language> = { en: 'te', te: 'ten', ten: 'en' }
                setLanguage(nextLang[language])
              }}
              className="p-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 flex items-center space-x-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{language}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md transition-all">
          <div className="px-3 pt-3 pb-5 space-y-1 sm:px-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-navy-900 hover:bg-slate-50"
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
            >
              {t('nav.about')}
            </Link>
            <Link
              href="/state-focus"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
            >
              {t('nav.stateFocus')}
            </Link>
            <Link
              href="/development-works"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
            >
              {t('nav.publicInitiatives')}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
            >
              {t('nav.contact')}
            </Link>

            {/* Mobile language switchers */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Language</span>
              <div className="flex space-x-2">
                {(['en', 'te'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      handleLanguageChange(lang)
                      setIsOpen(false)
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      language === lang 
                        ? 'bg-saffron-500 border-saffron-500 text-navy-900 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {languageLabels[lang]}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/grievance"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3.5 mt-4 rounded-xl text-base font-black text-white bg-navy-900 hover:bg-navy-800 shadow-md"
            >
              <LifeBuoy className="w-5 h-5 mr-2 text-saffron-400 animate-pulse" />
              {t('nav.grievancePortal')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
