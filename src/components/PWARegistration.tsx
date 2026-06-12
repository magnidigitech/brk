'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, RefreshCw } from 'lucide-react'

export default function PWARegistration() {
  const pathname = usePathname()
  const [showUpdate, setShowUpdate] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  // 1. Track page views / visits when pathname changes
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'VISIT', pathname })
    }).catch((err) => console.warn('Failed to log page visit', err))
  }, [pathname])

  // 2. Track PWA installs and manage Service Worker Registration
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track PWA Install Event
    const handleAppInstalled = () => {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'PWA_INSTALL', pathname })
      }).catch((err) => console.warn('Failed to log PWA install', err))
    }
    window.addEventListener('appinstalled', handleAppInstalled)

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Service Worker registered successfully with scope:', reg.scope)
            
            // Do not prompt for initial waiting worker on every refresh; only prompt when a new update is detected and installed
            // if (reg.waiting) {
            //   setWaitingWorker(reg.waiting)
            //   setShowUpdate(true)
            // }

            // Listen for subsequent updates
            reg.onupdatefound = () => {
              const installingWorker = reg.installing
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      setWaitingWorker(installingWorker)
                      setShowUpdate(true)
                    }
                  }
                }
              }
            }
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err)
          })
      }

      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
      }

      // Reload page when the new Service Worker takes control
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [pathname])

  const handleUpdateReload = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    }
    setShowUpdate(false)
  }

  if (pathname.startsWith('/admin') || !showUpdate) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pwaSlideUp {
          from {
            transform: translateY(100%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .pwa-animate-slideup {
          animation: pwaSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[99999] pwa-animate-slideup">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-saffron-400 shadow-2xl overflow-hidden p-5 text-slate-800">
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
              <div className="flex-1">
                <h3 className="font-black text-navy-900 text-sm tracking-wide uppercase">
                  New Update Available!
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed text-left">
                  An updated version of the portal is ready. Click below to load the latest changes.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowUpdate(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleUpdateReload}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-black text-navy-900 bg-saffron-500 hover:bg-saffron-400 transition-all hover:scale-[1.02] shadow-md cursor-pointer border border-saffron-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Now
            </button>
            <button
              onClick={() => setShowUpdate(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
