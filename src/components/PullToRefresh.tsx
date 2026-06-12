'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowDown, RefreshCw } from 'lucide-react'

export default function PullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const startY = useRef(0)
  const currentY = useRef(0)
  
  const threshold = 70 // Pull threshold in px
  const maxPull = 110   // Maximum pull distance in px

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull-to-refresh when scrolled to the absolute top of the page
      if (window.scrollY === 0 && !isRefreshing) {
        startY.current = e.touches[0].clientY
        currentY.current = startY.current
        setIsPulling(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return

      currentY.current = e.touches[0].clientY
      const diff = currentY.current - startY.current

      if (diff > 0) {
        // Apply resistance / damping
        const pull = Math.min(maxPull, diff * 0.4)
        setPullDistance(pull)

        // Prevent default browser refresh pull-down indicator
        if (e.cancelable) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = () => {
      if (!isPulling || isRefreshing) return
      setIsPulling(false)

      if (pullDistance >= threshold) {
        setIsRefreshing(true)
        setPullDistance(threshold)
        
        // Trigger page refresh with a clean delay for the loading animation to shine
        setTimeout(() => {
          window.location.reload()
        }, 800)
      } else {
        // Smoothly animate back to 0
        setPullDistance(0)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, pullDistance, isRefreshing])

  if (pullDistance === 0 && !isRefreshing) return null

  // Calculate visual rotation and scale based on progress
  const progressPercent = Math.min(100, (pullDistance / threshold) * 100)
  const rotateAngle = Math.min(360, (pullDistance / threshold) * 360)

  return (
    <div 
      className="fixed left-0 right-0 top-0 z-[99999] flex justify-center pointer-events-none transition-all duration-150 ease-out"
      style={{ 
        transform: `translateY(${pullDistance}px)`,
        opacity: Math.min(1, pullDistance / 15)
      }}
    >
      <div className="bg-white rounded-full p-1.5 shadow-2xl border border-slate-200 flex items-center justify-center -translate-y-12">
        <div className="w-10 h-10 rounded-full bg-[#FFD200] text-slate-950 flex items-center justify-center shadow-md relative overflow-hidden shrink-0">
          {isRefreshing ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <div 
              className="transition-transform duration-75"
              style={{ transform: `rotate(${rotateAngle}deg)` }}
            >
              <ArrowDown className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
          )}
          
          {/* Progress circle outline indicator */}
          <div 
            className="absolute inset-0 border-2 border-navy-950/20 rounded-full"
            style={{
              clipPath: `inset(${(100 - progressPercent)}% 0px 0px 0px)`
            }}
          />
        </div>
      </div>
    </div>
  )
}
