'use client'

import { useState, useEffect, useRef } from 'react'
import { Accessibility, X, Type, Contrast, Sparkles, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

type TextSize = 'normal' | 'medium' | 'large' | 'xlarge'

export default function AccessibilityPanel() {
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const openTimeRef = useRef(0)

  // A11y states
  const [textSize, setTextSize] = useState<TextSize>('normal')
  const [grayscale, setGrayscale] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [dyslexic, setDyslexic] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Confirmation popup states
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [hideDueToOverlap, setHideDueToOverlap] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Track panel open time to prevent race conditions during toggle click
  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now()
    }
  }, [isOpen])

  // Track responsive screen size (desktop check)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Detect overlap with PWA and Notification prompts
  useEffect(() => {
    if (!showConfirmation) return

    const checkOverlap = () => {
      const pwaPrompt = document.getElementById('pwa-install-prompt')
      const notifyPrompt = document.getElementById('notification-permission-prompt')
      setHideDueToOverlap(!!(pwaPrompt || notifyPrompt))
    }

    checkOverlap()
    const interval = setInterval(checkOverlap, 250)
    return () => clearInterval(interval)
  }, [showConfirmation])

  // 1. Load settings from localStorage on mount (Client-side only)
  useEffect(() => {
    try {
      const savedTextSize = localStorage.getItem('a11y-text-size') as TextSize
      const savedGrayscale = localStorage.getItem('a11y-grayscale') === 'true'
      const savedContrast = localStorage.getItem('a11y-contrast') === 'true'
      const savedDyslexic = localStorage.getItem('a11y-dyslexic') === 'true'

      const hasCustom =
        (savedTextSize && savedTextSize !== 'normal') ||
        savedGrayscale ||
        savedContrast ||
        savedDyslexic

      if (savedTextSize) setTextSize(savedTextSize)
      setGrayscale(savedGrayscale)
      setHighContrast(savedContrast)
      setDyslexic(savedDyslexic)

      // If any setting is custom, show confirmation toast
      if (hasCustom) {
        setShowConfirmation(true)
        // Auto-dismiss confirmation after 5 seconds
        const timer = setTimeout(() => {
          setShowConfirmation(false)
        }, 5000)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      console.warn('Failed to read a11y preferences from localStorage', e)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // 2. Listen to custom navbar toggle events
  useEffect(() => {
    const handleToggleEvent = () => {
      setIsOpen(prev => !prev)
    }
    window.addEventListener('toggle-a11y-panel', handleToggleEvent)
    return () => window.removeEventListener('toggle-a11y-panel', handleToggleEvent)
  }, [])

  // 3. Apply styles dynamically on the html element (fully bulletproof)
  useEffect(() => {
    if (typeof document === 'undefined') return

    const html = document.documentElement

    // Font size scaling
    const sizeMap: Record<TextSize, string> = {
      normal: '100%',
      medium: '110%',
      large: '120%',
      xlarge: '130%',
    }
    html.style.fontSize = sizeMap[textSize]

    // Toggle stylesheet classes
    if (grayscale) {
      html.classList.add('a11y-grayscale')
    } else {
      html.classList.remove('a11y-grayscale')
    }

    if (highContrast) {
      html.classList.add('a11y-high-contrast')
    } else {
      html.classList.remove('a11y-high-contrast')
    }

    if (dyslexic) {
      html.classList.add('a11y-dyslexic')
    } else {
      html.classList.remove('a11y-dyslexic')
    }

    // Cleanup legacy custom stylesheet if present
    const legacyStyle = document.getElementById('a11y-custom-style')
    if (legacyStyle) {
      legacyStyle.remove()
    }

    // Save to localStorage ONLY after initial preferences have been loaded
    if (isInitialized) {
      try {
        localStorage.setItem('a11y-text-size', textSize)
        localStorage.setItem('a11y-grayscale', String(grayscale))
        localStorage.setItem('a11y-contrast', String(highContrast))
        localStorage.setItem('a11y-dyslexic', String(dyslexic))
      } catch (e) {
        // Ignore
      }
    }
  }, [textSize, grayscale, highContrast, dyslexic, isInitialized])

  // 4. Close panel when clicking outside (safeguarded against fast toggle race conditions)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (Date.now() - openTimeRef.current < 150) return
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleReset = () => {
    setTextSize('normal')
    setGrayscale(false)
    setHighContrast(false)
    setDyslexic(false)
  }

  const textSizes: { value: TextSize; label: string }[] = [
    { value: 'normal', label: '100%' },
    { value: 'medium', label: '110%' },
    { value: 'large', label: '120%' },
    { value: 'xlarge', label: '130%' },
  ]

  return (
    <div ref={panelRef}>
      {/* Animation declarations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .pwa-animate-slidedown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* Confirmation Toast for Reopened Page */}
      {showConfirmation && !hideDueToOverlap && (
        <div className="fixed top-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[99998] pwa-animate-slidedown">
          <div className="bg-white rounded-2xl border-2 border-saffron-400 shadow-2xl p-4 flex flex-col space-y-3">
            <div className="flex items-start space-x-2.5">
              <Accessibility className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-xs font-black text-navy-900 uppercase tracking-wide">
                  {language === 'te' ? 'యాక్సెసిబిలిటీ సెట్టింగ్స్' : 'Accessibility Settings'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {language === 'te' 
                    ? 'గతంలో సేవ్ చేసిన యాక్సెసిబిలిటీ సెట్టింగ్స్‌తో కొనసాగుదామా?' 
                    : 'Continue with your previously saved accessibility settings?'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-1.5 bg-saffron-500 hover:bg-saffron-400 text-navy-900 text-[10px] font-black rounded-lg transition-all cursor-pointer text-center"
              >
                {language === 'te' ? 'కొనసాగించు' : 'Keep Settings'}
              </button>
              <button
                onClick={() => {
                  handleReset()
                  setShowConfirmation(false)
                }}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center"
              >
                {language === 'te' ? 'రీసెట్ చేయి' : 'Reset Default'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger floating button (visible on desktop only, hidden on mobile) */}
      {isDesktop && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[99999] w-12 h-12 rounded-full bg-navy-900 text-saffron-400 hover:bg-navy-950 flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer border border-saffron-400/20"
          title={t('a11y.widgetTooltip') || 'Accessibility Settings'}
          aria-label="Open accessibility menu"
        >
          <Accessibility className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Settings Panel Popover (Mobile Modal overlay / Desktop floating popover) */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:bottom-6 lg:left-6 lg:right-auto lg:top-auto lg:w-auto lg:h-auto">
          <div className="w-80 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-saffron-400 shadow-2xl overflow-hidden p-5 text-slate-800 pwa-animate-slideup text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-navy-900">
                <Accessibility className="w-5 h-5 text-saffron-600" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  {t('a11y.title') || 'Accessibility Settings'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close settings panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Font Size zoom control */}
              <div>
                <div className="flex items-center space-x-2 text-xs font-black text-navy-900 uppercase tracking-wide mb-2">
                  <Type className="w-4 h-4 text-slate-500" />
                  <span>{t('a11y.textZoom') || 'Text Size'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {textSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setTextSize(size.value)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        textSize === size.value
                          ? 'bg-saffron-500 text-navy-900 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Filters */}
              <div className="space-y-2.5 pt-2">
                {/* Grayscale Mode */}
                <button
                  onClick={() => setGrayscale(!grayscale)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    grayscale
                      ? 'bg-navy-50/50 border-navy-500 text-navy-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-slate-400 border border-slate-500 inline-block"></span>
                    <span>{t('a11y.grayscale') || 'Grayscale Mode'}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${grayscale ? 'bg-navy-900' : 'bg-slate-200'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-all transform ${grayscale ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* High Contrast Mode */}
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    highContrast
                      ? 'bg-navy-50/50 border-navy-500 text-navy-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Contrast className="w-4 h-4 text-slate-600" />
                    <span>{t('a11y.contrast') || 'High Contrast'}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${highContrast ? 'bg-navy-900' : 'bg-slate-200'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-all transform ${highContrast ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>

                {/* Dyslexia font toggle */}
                <button
                  onClick={() => setDyslexic(!dyslexic)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    dyslexic
                      ? 'bg-navy-50/50 border-navy-500 text-navy-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-slate-600" />
                    <span>{t('a11y.dyslexic') || 'Dyslexia Friendly'}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${dyslexic ? 'bg-navy-900' : 'bg-slate-200'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-all transform ${dyslexic ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  {t('a11y.reset') || 'Reset'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 bg-navy-900 hover:bg-navy-950 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  {t('a11y.close') || 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
