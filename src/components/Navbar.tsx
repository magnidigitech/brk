'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, LifeBuoy, Globe, Bell } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { Language } from '@/lib/translations'
import { useRouter, usePathname } from 'next/navigation'
import { getRoleTitle } from '@/lib/roleHelper'

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
  const [notifyDropdownOpen, setNotifyDropdownOpen] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const notifyRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const subpagePushedRef = useRef<string | null>(null)

  // Helper for safe localStorage access
  const getSafeLocalStorage = (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key)
      }
    } catch (e) {
      console.warn('Failed to read from localStorage', e)
    }
    return null
  }

  const setSafeLocalStorage = (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value)
      }
    } catch (e) {
      console.warn('Failed to write to localStorage', e)
    }
  }

  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)
  const [permissionState, setPermissionState] = useState<string>('default')

  // OneSignal notifications check and subscription listener
  useEffect(() => {
    if (typeof window === 'undefined') return

    const OneSignalDeferred = (window as any).OneSignalDeferred || []

    OneSignalDeferred.push(async function (OneSignal: any) {
      if (OneSignal && OneSignal.Notifications) {
        const permission = OneSignal.Notifications.permission
        setPermissionState(permission)

        // Only prompt on public pages, not on admin pages, and only if permission is default (neither granted nor denied)
        if (!pathname.startsWith('/admin') && permission !== 'granted' && permission !== 'denied') {
          const lastShown = getSafeLocalStorage('onesignal-prompt-last-shown')
          const hasBeen24Hours = lastShown
            ? Date.now() - parseInt(lastShown, 10) > 24 * 60 * 60 * 1000
            : true

          if (hasBeen24Hours) {
            setTimeout(() => {
              setShowNotificationPrompt(true)
              // Update last shown timestamp when showing it
              setSafeLocalStorage('onesignal-prompt-last-shown', Date.now().toString())
            }, 4000)
          }
        }
      }
    })
  }, [pathname])

  // Real-time Sanity Sync subscription listener
  useEffect(() => {
    let subscription: any
    import('@/sanity/lib/client').then(({ client }) => {
      subscription = client.listen(
        `*[_type in ["siteSettings", "stateSector", "developmentProject", "pressRelease", "parliamentaryUpdate", "aboutPage"]]`
      ).subscribe((update) => {
        console.log('Sanity mutation detected, refreshing page:', update)
        router.refresh()
      })
    })
    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router])

  // Click outside listener for mobile navbar & dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (langDropdownOpen && langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
      if (notifyDropdownOpen && notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setNotifyDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, langDropdownOpen, notifyDropdownOpen])

  // Page entry history state setup for backpress routing
  useEffect(() => {
    if (pathname === '/' || pathname === '') {
      subpagePushedRef.current = null
      return
    }
    if (subpagePushedRef.current !== pathname) {
      window.history.pushState({ subpageEntry: pathname }, '')
      subpagePushedRef.current = pathname
    }
  }, [pathname])

  // Subpage popstate handling (redirect to / if no overlay is open)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (window.location.pathname === '/') {
        return
      }

      const hasOpenModal = !!document.querySelector('[data-modal="true"]')

      if (isOpen) {
        setIsOpen(false)
        window.history.pushState({ subpageEntry: window.location.pathname }, '')
        return
      }

      if (langDropdownOpen) {
        setLangDropdownOpen(false)
        window.history.pushState({ subpageEntry: window.location.pathname }, '')
        return
      }

      if (hasOpenModal) {
        window.history.pushState({ subpageEntry: window.location.pathname }, '')
        return
      }

      router.push('/')
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isOpen, langDropdownOpen, router])

  // Resolve localized name from server-provided settings
  const rawName = siteSettings?.candidateName
  let dispName = tContent(rawName, 'B. Ramakrishna')
  if (dispName.startsWith('Bhashyam')) dispName = 'B. Ramakrishna'

  const dispBadge = getRoleTitle(language)

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === ''
    }
    return pathname.startsWith(path)
  }

  const getBottomNavLabel = (key: string): string => {
    if (key === 'home') return t('nav.home')
    if (key === 'news') return language === 'te' ? 'పత్రికా' : 'Press'
    if (key === 'grievance') return language === 'te' ? 'ఫిర్యాదు' : 'Grievance'
    if (key === 'updates') return language === 'te' ? 'పార్లమెంట్' : 'Parliament'
    if (key === 'contact') return language === 'te' ? 'కార్యాలయం' : 'Contact'
    return ''
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setLangDropdownOpen(false)
  }

  const languageLabels: Record<Language, string> = {
    en: 'English',
    te: 'తెలుగు'
  }

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-saffron-400 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">

            {/* Logo Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/telugudesamlogo.png"
                    alt="TDP Logo"
                    className="w-full h-full object-contain"
                    width={48}
                    height={48}
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
            <div className="hidden lg:flex items-center space-x-5 lg:space-x-6">
              <Link
                href="/"
                className={`text-sm font-bold transition-colors py-2 ${isActive('/') ? 'text-saffron-600' : 'text-slate-600 hover:text-saffron-600'
                  }`}
              >
                {t('nav.home')}
              </Link>

              {/* About Dropdown */}
              <div className="relative group py-5">
                <button className="flex items-center space-x-1 text-sm font-bold text-slate-600 hover:text-saffron-600 transition-colors cursor-pointer outline-none">
                  <span>{t('nav.about')}</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <Link
                    href="/about"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-saffron-600 transition-colors"
                  >
                    {t('nav.about')}
                  </Link>
                  <Link
                    href="/state-focus"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-saffron-600 transition-colors"
                  >
                    {t('nav.stateFocus')}
                  </Link>
                  <Link
                    href="/development-works"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-saffron-600 transition-colors"
                  >
                    {t('nav.publicInitiatives')}
                  </Link>
                </div>
              </div>

              {/* Updates Dropdown */}
              <div className="relative group py-5">
                <button className="flex items-center space-x-1 text-sm font-bold text-slate-600 hover:text-saffron-600 transition-colors cursor-pointer outline-none">
                  <span>{t('nav.updates')}</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full hidden group-hover:block w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50">
                  <Link
                    href="/press-releases"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-saffron-600 transition-colors"
                  >
                    {t('section.news')}
                  </Link>
                  <Link
                    href="/parliamentary-updates"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-saffron-600 transition-colors"
                  >
                    {t('section.updates')}
                  </Link>
                </div>
              </div>

              <Link
                href="/contact"
                className={`text-sm font-bold transition-colors py-2 ${isActive('/contact') ? 'text-saffron-600' : 'text-slate-600 hover:text-saffron-600'
                  }`}
              >
                {t('nav.contact')}
              </Link>

              {/* Language Switcher Dropdown */}
              <div ref={langRef} className="relative py-5">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center space-x-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-navy-900" />
                  <span>{languageLabels[language]}</span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50">
                    {(['en', 'te'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`block w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer hover:bg-slate-50 ${language === lang ? 'text-saffron-600 bg-saffron-50/50' : 'text-slate-700'
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
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-extrabold text-navy-950 bg-saffron-400 hover:bg-saffron-500 border border-saffron-500/30 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <LifeBuoy className="w-4 h-4 mr-2 text-navy-950" />
                {t('nav.grievancePortal')}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden space-x-2">
              {/* Quick Language switch on mobile header */}
              <button
                onClick={() => {
                  const nextLang: Record<Language, Language> = { en: 'te', te: 'en' }
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

        {/* Mobile Drawer (Hamburger Menu displaying EVERY link) */}
        {isOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 z-40 border-t border-slate-100 bg-white/98 backdrop-blur-md transition-all shadow-xl">
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
                href="/press-releases"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
              >
                {t('section.news')}
              </Link>
              <Link
                href="/parliamentary-updates"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
              >
                {t('section.updates')}
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
              <Link
                href="/grievance"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
              >
                {t('nav.grievancePortal')}
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${language === lang
                        ? 'bg-saffron-500 border-saffron-500 text-navy-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                    >
                      {languageLabels[lang]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Dedicated Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex justify-around items-center h-16 px-2">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-black transition-colors ${isActive('/') ? 'text-saffron-600' : 'text-slate-500'
              }`}
          >
            <svg className="w-5.5 h-5.5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{getBottomNavLabel('home')}</span>
          </Link>

          <Link
            href="/press-releases"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-black transition-colors ${isActive('/press-releases') ? 'text-saffron-600' : 'text-slate-500'
              }`}
          >
            <svg className="w-5.5 h-5.5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span>{getBottomNavLabel('news')}</span>
          </Link>

          <Link
            href="/grievance"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-black transition-colors ${isActive('/grievance') ? 'text-saffron-600' : 'text-slate-500'
              }`}
          >
            <LifeBuoy className="w-5.5 h-5.5 mb-1 animate-pulse" />
            <span>{getBottomNavLabel('grievance')}</span>
          </Link>

          <Link
            href="/parliamentary-updates"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-black transition-colors ${isActive('/parliamentary-updates') ? 'text-saffron-600' : 'text-slate-500'
              }`}
          >
            <svg className="w-5.5 h-5.5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{getBottomNavLabel('updates')}</span>
          </Link>

          <Link
            href="/contact"
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-black transition-colors ${isActive('/contact') ? 'text-saffron-600' : 'text-slate-500'
              }`}
          >
            <svg className="w-5.5 h-5.5 mb-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{getBottomNavLabel('contact')}</span>
          </Link>
        </div>
      </div>

      {/* Custom sitewide notification prompt popup */}
      {showNotificationPrompt && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 text-slate-800 w-full max-w-sm pwa-animate-scale relative">
            <div className="text-center">
              <div className="w-12 h-12 bg-saffron-50 rounded-full flex items-center justify-center mx-auto mb-4 text-saffron-500 animate-bounce">
                <Bell className="w-6 h-6 text-saffron-600 fill-saffron-100" />
              </div>
              <h3 className="font-extrabold text-navy-900 text-base">Enable Push Notifications?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Get real-time updates on press releases, developmental works, and Rajya Sabha updates directly on your device.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={async () => {
                    setSafeLocalStorage('onesignal-prompt-last-shown', Date.now().toString())
                    setShowNotificationPrompt(false)
                    const OneSignal = (window as any).OneSignal
                    if (OneSignal) {
                      try {
                        const permission = await OneSignal.Notifications.requestPermission()
                        setPermissionState(permission)
                        if (permission === 'granted') {
                          await OneSignal.User.PushSubscription.optIn()
                        }
                      } catch (e) {
                        console.error('Failed to request notification permission', e)
                      }
                    }
                  }}
                  className="flex-grow py-3 bg-saffron-400 hover:bg-saffron-500 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border border-saffron-500/20"
                >
                  Allow
                </button>
                <button
                  onClick={() => {
                    setSafeLocalStorage('onesignal-prompt-last-shown', Date.now().toString())
                    setShowNotificationPrompt(false)
                  }}
                  className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
