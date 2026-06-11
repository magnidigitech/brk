'use client'

import { useEffect } from 'react'

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('Service Worker registered successfully with scope:', reg.scope)
            // Force checking for updates immediately on load
            reg.update().catch((e) => console.warn('SW update check failed:', e))
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err)
          })
      })

      // Reload page when the new Service Worker takes control
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }
  }, [])

  return null
}
