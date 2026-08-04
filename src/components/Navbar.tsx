'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, LifeBuoy, Globe, Bell, Search, Accessibility, Calendar } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { Language } from '@/lib/translations'
import { useRouter, usePathname } from 'next/navigation'
import { getRoleTitle } from '@/lib/roleHelper'
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from 'framer-motion'
import { cleanExcerpt } from '@/lib/cleanExcerpt'

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

  // Search states
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchFaqs, setSearchFaqs] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery('')
      setSearchResults([])
      setSearchFaqs([])
      setHasSearched(false)
      return
    }
  }, [searchOpen])

  useEffect(() => {
    const delayDebounceId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setSearchFaqs([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceId)
  }, [searchQuery])

  const performSearch = async (q: string) => {
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.items || [])
        setSearchFaqs(data.faqs || [])
        setHasSearched(true)
      }
    } catch (err) {
      console.error('Search failed', err)
    } finally {
      setSearchLoading(false)
    }
  }

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

  useEffect(() => {
    if (searchOpen) {
      window.history.pushState({ type: 'searchOpen' }, '')
    }
  }, [searchOpen])

  // Subpage popstate handling (redirect to / if no overlay is open)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (window.location.pathname === '/') {
        return
      }

      // If we popped history but are still on the same subpage, do not redirect
      if (window.history.state && window.history.state.subpageEntry === window.location.pathname) {
        return
      }

      const hasOpenModal = !!document.querySelector('[data-modal="true"]')

      if (searchOpen) {
        setSearchOpen(false)
        window.history.pushState({ subpageEntry: window.location.pathname }, '')
        return
      }

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
  }, [isOpen, langDropdownOpen, searchOpen, router])

  // Resolve localized name from server-provided settings
  const rawName = siteSettings?.candidateName
  let dispName = tContent(rawName, 'B. Rama Krishna')
  if (dispName.startsWith('Bhashyam')) dispName = 'B. Rama Krishna'

  const dispBadge = getRoleTitle(language)

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === ''
    }
    return pathname.startsWith(path)
  }

  const getBottomNavLabel = (key: string): string => {
    if (key === 'home') return t('nav.home')
    if (key === 'daily') return language === 'te' ? 'రోజువారీ' : 'Daily'
    if (key === 'news') return language === 'te' ? 'పత్రికా' : 'Press'
    if (key === 'grievance') return language === 'te' ? 'ఫిర్యాదు' : 'Grievance'
    if (key === 'updates') return language === 'te' ? 'పార్లమెంట్' : 'Parliament'
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

  // Mobile bottom navbar gesture variables
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(375)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const isDraggingActive = useRef(false)

  // Get active tab index
  const getActiveIndex = (path: string) => {
    if (path === '/') return 0
    if (path.startsWith('/daily-updates')) return 1
    if (path.startsWith('/grievance')) return 2
    if (path.startsWith('/press-releases')) return 3
    if (path.startsWith('/parliamentary-updates')) return 4
    return 0
  }
  const activeIndex = getActiveIndex(pathname)
  const [localActiveIndex, setLocalActiveIndex] = useState(activeIndex)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Sync local active index with pathname changes
  useEffect(() => {
    setLocalActiveIndex(activeIndex)
  }, [activeIndex])

  // Motion values for spring and velocity scaling
  const targetX = useMotionValue(0)
  const springX = useSpring(targetX, { stiffness: 350, damping: 28, mass: 0.8 })
  const velocity = useVelocity(springX)
  const scaleX = useTransform(velocity, [-1500, 0, 1500], [1.25, 1, 1.25])
  const skewX = useTransform(velocity, [-1500, 0, 1500], [-8, 0, 8])

  // ResizeObserver to track bottom navbar width
  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setContainerWidth(rect.width)

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Update target position based on active index / hover index
  useEffect(() => {
    if (!isDragging && containerWidth > 0) {
      const tabWidth = containerWidth / 5
      const activeIdxToUse = hoveredIndex !== null ? hoveredIndex : localActiveIndex
      const center = (activeIdxToUse + 0.5) * tabWidth
      targetX.set(center)
    }
  }, [localActiveIndex, hoveredIndex, containerWidth, isDragging, targetX])

  // Drag Gesture Handlers
  const handleStart = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left
    setIsDragging(true)
    isDraggingActive.current = false
    dragStartX.current = clientX
    targetX.set(relativeX)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left))
    targetX.set(relativeX)
    
    if (Math.abs(clientX - dragStartX.current) > 5) {
      isDraggingActive.current = true
    }
  }

  const handleEnd = () => {
    if (!isDragging || !containerRef.current) return
    setIsDragging(false)
    const rect = containerRef.current.getBoundingClientRect()
    const tabWidth = rect.width / 5
    const currentVal = targetX.get()
    const index = Math.max(0, Math.min(4, Math.floor(currentVal / tabWidth)))
    
    setLocalActiveIndex(index)
    const center = (index + 0.5) * tabWidth
    targetX.set(center)

    if (isDraggingActive.current) {
      const paths = [
        '/',
        '/daily-updates',
        '/grievance',
        '/press-releases',
        '/parliamentary-updates'
      ]
      router.push(paths[index])
    }
  }

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-50 backdrop-blur-md bg-slate-50/85 support-backdrop-blur:bg-slate-50/60 border-b-2 border-saffron-400 shadow-sm">
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
                <div className="flex flex-col justify-center py-1">
                  <span className="block font-black text-base md:text-lg text-navy-900 tracking-wide leading-normal uppercase">
                    {dispName}
                  </span>
                  <span className="block text-[10px] font-bold text-saffron-600 tracking-widest uppercase leading-normal mt-0.5 md:mt-1">
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
                    href="/daily-updates"
                    className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-saffron-600 transition-colors"
                  >
                    {t('nav.dailyUpdates')}
                  </Link>
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

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer flex items-center hover:scale-105 shadow-sm text-navy-950"
                aria-label="Search site"
              >
                <Search className="w-4 h-4" />
              </button>

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
              {/* Quick Search Button on mobile header */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 border border-slate-200 rounded-lg text-slate-700 bg-slate-50 flex items-center"
                aria-label="Search site"
              >
                <Search className="w-3.5 h-3.5 text-navy-900" />
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
                href="/daily-updates"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-bold text-slate-600 hover:bg-slate-50"
              >
                {t('nav.dailyUpdates')}
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
                className="block px-4 py-3 mx-3 rounded-xl text-center text-base font-black text-navy-950 bg-saffron-400 hover:bg-saffron-500 border border-saffron-500/30 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <LifeBuoy className="w-5 h-5 animate-pulse text-navy-950" />
                <span>{t('nav.grievancePortal')}</span>
              </Link>

              {/* Mobile Accessibility Controls Trigger */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'te' ? 'యాక్సెసిబిలిటీ' : 'Accessibility'}
                </span>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    // Let the drawer close transition finish smoothly before opening panel
                    setTimeout(() => {
                      window.dispatchEvent(new Event('toggle-a11y-panel'))
                    }, 200)
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-slate-200 text-slate-700 bg-slate-50 flex items-center space-x-1 cursor-pointer hover:bg-slate-100"
                >
                  <Accessibility className="w-3.5 h-3.5 text-navy-900" />
                  <span>{language === 'te' ? 'సెట్టింగ్స్' : 'Configure'}</span>
                </button>
              </div>

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
      <div 
        ref={containerRef}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => {
          if (e.cancelable) e.preventDefault()
          handleMove(e.touches[0].clientX)
        }}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={() => {
          handleEnd()
          setHoveredIndex(null)
        }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-t border-white/20 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] select-none"
      >
        <div className="relative flex items-stretch h-16 w-full">
          
          {/* Liquid Selector Pill (Background indicator) */}
          <motion.div
            style={{
              x: springX,
              scaleX,
              skewX,
              originX: 0.5,
              width: containerWidth / 5,
              left: 0,
              marginLeft: -(containerWidth / 10), // Half of width to center it at springX
            }}
            className="absolute top-1.5 bottom-1.5 flex flex-col items-center justify-end pointer-events-none z-0"
          >
            {/* Liquid glass pill */}
            <div className="absolute inset-0 bg-navy-900/5 border border-navy-900/10 rounded-2xl shadow-[0_2px_8px_rgba(11,25,44,0.04)]" />
            
            {/* Active state line indicator (_) */}
            <div className="w-5 h-0.75 bg-navy-900 rounded-full mb-1 z-10" />
          </motion.div>

          {/* TABS */}
          {[
            {
              id: 'home',
              path: '/',
              label: getBottomNavLabel('home'),
              icon: (isActive: boolean) => (
                <svg className={`w-5.5 h-5.5 mb-1 transition-colors ${isActive ? 'text-navy-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )
            },
            {
              id: 'daily',
              path: '/daily-updates',
              label: getBottomNavLabel('daily'),
              icon: (isActive: boolean) => (
                <Calendar className={`w-5.5 h-5.5 mb-1 transition-colors ${isActive ? 'text-navy-900' : 'text-slate-500'}`} />
              )
            },
            {
              id: 'grievance',
              path: '/grievance',
              label: getBottomNavLabel('grievance'),
              icon: (isActive: boolean) => (
                <LifeBuoy className={`w-5.5 h-5.5 mb-1 transition-colors ${isActive ? 'text-navy-900' : 'text-slate-500'} ${isActive ? 'animate-pulse' : ''}`} />
              )
            },
            {
              id: 'press',
              path: '/press-releases',
              label: getBottomNavLabel('news'),
              icon: (isActive: boolean) => (
                <svg className={`w-5.5 h-5.5 mb-1 transition-colors ${isActive ? 'text-navy-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              )
            },
            {
              id: 'parliament',
              path: '/parliamentary-updates',
              label: getBottomNavLabel('updates'),
              icon: (isActive: boolean) => (
                <svg className={`w-5.5 h-5.5 mb-1 transition-colors ${isActive ? 'text-navy-900' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )
            }
          ].map((tab, idx) => {
            const isTabActive = localActiveIndex === idx
            return (
              <div
                key={tab.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setLocalActiveIndex(idx)
                  router.push(tab.path)
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(idx)}
                onBlur={() => setHoveredIndex(null)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-black transition-colors z-10 cursor-pointer ${
                  isTabActive ? 'text-navy-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon(isTabActive)}
                <span className="mb-0.5">{tab.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom sitewide notification prompt popup */}
      {showNotificationPrompt && (
        <div id="notification-permission-prompt" className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
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

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-md flex justify-center items-start pt-16 md:pt-24 px-4 overflow-y-auto" data-modal="true">
          <div className="bg-white w-full max-w-2xl rounded-2xl border-2 border-saffron-400 shadow-2xl overflow-hidden mb-12 pwa-animate-slideup text-left">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center space-x-2 text-navy-900">
                <Search className="w-5 h-5 text-saffron-600" />
                <span className="font-extrabold text-xs md:text-sm uppercase tracking-wider">
                  {language === 'te' ? 'ద్విభాషా శోధన' : 'Bilingual Search'}
                </span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input field */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder') || 'Search...'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white text-slate-800 shadow-inner"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-6">
              {searchLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-slate-400">
                    {language === 'te' ? 'వెతుకుతున్నాము...' : 'Searching...'}
                  </span>
                </div>
              )}

              {!searchLoading && searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
                <p className="text-center text-xs text-slate-400 font-bold py-6">
                  {language === 'te' ? 'కనీసం 2 అక్షరాలను నమోదు చేయండి' : 'Enter at least 2 characters to search'}
                </p>
              )}

              {!searchLoading && hasSearched && searchResults.length === 0 && searchFaqs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-slate-500">
                    {t('search.noResults') || 'No results found.'}
                  </p>
                </div>
              )}

              {!searchLoading && hasSearched && (searchResults.length > 0 || searchFaqs.length > 0) && (
                <div className="space-y-6">
                  {/* Results Count */}
                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    {(t('search.resultsCount') || 'Found {count} results').replace('{count}', String(searchResults.length + searchFaqs.length))}
                  </div>

                  {/* Press Releases / Parliamentary Speeches Group */}
                  {searchResults.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-navy-900 border-b pb-1">
                        {language === 'te' ? 'వార్తలు & పార్లమెంటరీ అప్‌డేట్స్' : 'News & Parliamentary Updates'}
                      </h4>
                      <div className="divide-y divide-slate-100">
                        {searchResults.map((item) => {
                          const isPress = item._type === 'pressRelease'
                          const path = isPress ? '/press-releases' : '/parliamentary-updates'
                          const linkHref = `${path}/${item.slug?.current || item._id}`
                          const displayDate = isPress ? item.publishedAt : item.date

                          return (
                            <Link
                              key={item._id}
                              href={linkHref}
                              onClick={() => setSearchOpen(false)}
                              className="block py-3 hover:bg-slate-50 transition-colors group rounded-lg px-2"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${isPress ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-saffron-50 text-saffron-700 border border-saffron-100'
                                    }`}>
                                    {isPress ? (t('search.pressType') || 'Press Release') : (t('search.speechType') || 'Parliament Speech')}
                                  </span>
                                  <h5 className="font-bold text-sm text-navy-950 group-hover:text-saffron-600 transition-colors">
                                    {item.title}
                                  </h5>
                                  <p className="text-xs text-slate-500 line-clamp-2">
                                    {cleanExcerpt(item.excerpt || item.summary)}
                                  </p>
                                </div>
                                {displayDate && (
                                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap ml-4">
                                    {new Date(displayDate).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                )}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Constituency FAQs Group */}
                  {searchFaqs.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-extrabold text-navy-900 border-b pb-1">
                        {language === 'te' ? 'జీవిత చరిత్ర & ప్రశ్నలు (FAQs)' : 'Biography & FAQs'}
                      </h4>
                      <div className="space-y-3">
                        {searchFaqs.map((faq) => (
                          <Link
                            key={faq.id}
                            href="/about#faq"
                            onClick={() => setSearchOpen(false)}
                            className="block p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition-all group"
                          >
                            <span className="inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-navy-50 text-navy-700 border border-navy-100 mb-1.5">
                              {t('search.faqType') || 'FAQ'}
                            </span>
                            <h5 className="font-extrabold text-xs text-navy-950 group-hover:text-saffron-600 transition-colors">
                              {faq.question[language]}
                            </h5>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-3">
                              {faq.answer[language]}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
