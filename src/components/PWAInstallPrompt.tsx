'use client'

import { useState, useEffect } from 'react'
import { X, Share2, PlusSquare, ArrowDown, Smartphone, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { usePathname } from 'next/navigation'

export default function PWAInstallPrompt() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // Auto-close if we shift away from home page
  useEffect(() => {
    if (pathname !== '/') {
      setShowPrompt(false)
    }
  }, [pathname])

  // 5 seconds auto-dismiss
  useEffect(() => {
    if (showPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showPrompt])

  useEffect(() => {
    // Avoid SSR issues
    if (typeof window === 'undefined') return
    if (pathname !== '/') return

    // 1. Check if permanently dismissed
    const isPermanentlyDismissed = localStorage.getItem('pwa-prompt-dismissed-permanently') === 'true'
    if (isPermanentlyDismissed) {
      return
    }

    // 2. Check if already shown in this session (fresh load check)
    const isShownThisSession = sessionStorage.getItem('pwa-prompt-session-shown') === 'true'
    if (isShownThisSession) {
      return
    }

    // 3. Check if already installed / running in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true

    if (isStandalone) {
      return
    }

    // 4. Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isAndroidUA = /android/.test(userAgent)
    const isIPhoneOrIPad = /iphone|ipad|ipod/.test(userAgent)

    // Force Android priority first so we don't accidentally fall back to iOS Safari info
    if (isAndroidUA) {
      setIsAndroid(true)
      setIsIOS(false)

      // Listen for standard browser PWA install event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowPrompt(true)
        sessionStorage.setItem('pwa-prompt-session-shown', 'true')
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      // Fallback: show Android manual steps if beforeinstallprompt is not fired after 5s
      const timer = setTimeout(() => {
        setShowPrompt(true)
        sessionStorage.setItem('pwa-prompt-session-shown', 'true')
      }, 5000)

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        clearTimeout(timer)
      }
    } else if (isIPhoneOrIPad) {
      setIsIOS(true)
      setIsAndroid(false)
      // For iOS Safari, show the instruction prompt after a short delay to feel less intrusive
      const timer = setTimeout(() => {
        setShowPrompt(true)
        sessionStorage.setItem('pwa-prompt-session-shown', 'true')
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      // General mobile fallback (simulate Android/Chrome instructions)
      const isMobileDevice = window.innerWidth < 768
      if (!isMobileDevice) return

      setIsAndroid(false)
      setIsIOS(false)
      const timer = setTimeout(() => {
        setShowPrompt(true)
        sessionStorage.setItem('pwa-prompt-session-shown', 'true')
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`PWA install prompt outcome: ${outcome}`)

    // Clean up
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    // Store permanent dismiss state in localStorage
    localStorage.setItem('pwa-prompt-dismissed-permanently', 'true')
    setShowPrompt(false)
  }

  if (pathname !== '/' || !showPrompt) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pwaScale {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .pwa-animate-scale {
          animation: pwaScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div id="pwa-install-prompt" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-3xl border-2 border-saffron-400 shadow-2xl overflow-hidden p-6 text-slate-800 w-full max-w-sm pwa-animate-scale relative">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-100 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/logo.png?v=2" 
                  alt="App Icon" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-black text-navy-900 text-sm tracking-wide uppercase">
                  {t('pwa.installTitle')}
                </h3>
                <p className="text-[11px] font-bold text-saffron-600 tracking-wider uppercase">
                  B. RAMA KRISHNA MP PORTAL
                </p>
              </div>
            </div>
            <button 
              onClick={handleDismiss}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-3.5 leading-relaxed text-left">
            {t('pwa.installDesc')}
          </p>

          <div className="border-t border-slate-100 my-4"></div>

          {/* Conditional Instructions or CTAs */}
          {isIOS ? (
            <div className="space-y-3">
              <span className="block text-[10px] font-bold text-navy-900/60 uppercase tracking-widest text-left">
                {t('pwa.iosInstructions')}
              </span>
              <div className="space-y-2 text-xs text-left">
                <div className="flex items-center space-x-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-700">{t('pwa.iosTapShare')}</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="p-1.5 bg-saffron-50 text-saffron-600 rounded-lg shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-700">{t('pwa.iosTapAdd')}</span>
                </div>
              </div>
            </div>
          ) : isAndroid && deferredPrompt ? (
            <div className="flex space-x-3 mt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-black text-navy-900 bg-saffron-500 hover:bg-saffron-400 transition-all hover:scale-[1.02] shadow-md cursor-pointer border border-saffron-600"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {t('pwa.btnInstall')}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
              >
                {t('pwa.dismiss')}
              </button>
            </div>
          ) : (
            /* Android/Other general fallback instructions when browser doesn't expose programmatic prompt */
            <div className="space-y-3">
              <span className="block text-[10px] font-bold text-navy-900/60 uppercase tracking-widest text-left">
                {t('pwa.androidInstructions')}
              </span>
              <div className="space-y-2 text-xs text-left">
                <div className="flex items-center space-x-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="p-1.5 bg-navy-50 text-navy-600 rounded-lg shrink-0 font-bold">
                    ⁝
                  </div>
                  <span className="font-medium text-slate-700">{t('pwa.androidTapMenu')}</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="p-1.5 bg-saffron-50 text-saffron-600 rounded-lg shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-slate-700">{t('pwa.androidTapAdd')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
