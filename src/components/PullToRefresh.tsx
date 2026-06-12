'use client'

import { useState, useEffect, useRef } from 'react'

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

  // Calculate visual progress percentage (0 to 100)
  const progressPercent = Math.min(100, (pullDistance / threshold) * 100)

  // Calculate vertical translation of the wave in mask coordinate space (5000x5000).
  // 5200 is below the viewport (hidden), -200 is above (fully filled).
  const waveY = isRefreshing ? -200 : 5200 - (progressPercent / 100) * 5400

  return (
    <div 
      className="fixed left-0 right-0 top-0 z-[99999] flex justify-center pointer-events-none transition-all duration-150 ease-out"
      style={{ 
        transform: `translateY(${pullDistance}px)`,
        opacity: Math.min(1, pullDistance / 15)
      }}
    >
      {/* Inline styles for the horizontal wave movement */}
      <style>{`
        @keyframes ptr-wave-move {
          0% { transform: translateX(-2500px); }
          100% { transform: translateX(0px); }
        }
      `}</style>

      <div className="bg-white rounded-full p-2 shadow-2xl border border-slate-200/80 flex items-center justify-center -translate-y-14 transition-transform">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner border border-slate-100">
          
          {/* 1. Background Logo (Grey Outline/Fill) */}
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <svg 
              viewBox="0 0 5000 5000" 
              className="w-8 h-8 text-slate-200" 
              style={{ fill: 'currentColor' }}
            >
              <g id="Layer_x0020_1">
                <g id="_1678021877488">
                  <path d="M1625.8 1708.29l-348.09 -439.43c-51.09,19.05 -55.03,31.58 -87.96,75.26 -87.28,115.76 -107.52,126.83 -199.95,279.87 -635,1051.33 72.94,2560.37 1416.73,2621.4l-1.21 -403.49c-927.78,-82.98 -1464.94,-984.65 -1159.15,-1820.44l40.93 -71.81c84.81,78.31 273.58,376.63 358.86,416.47l350.7 -437.47 0.39 1468.07 404.31 2.89 5.27 -2638.01 -53.91 52.35c-19.53,23.3 -28,36.97 -49.36,63.31 -97.62,120.39 -623.23,793.63 -677.56,831.04z" />
                  <path d="M2595.15 3400.22l406.78 -1.87 2.76 -2140.88c246,74.39 498.64,318.8 632.93,529.16 524.17,821.1 -3.74,1977.69 -1040.01,2054.57l-2.95 404.02c905.92,-33.73 1650.61,-811.43 1651.08,-1745.32 0.47,-941.41 -742.17,-1699.63 -1650.23,-1745.3l-0.35 2645.61z" />
                </g>
              </g>
            </svg>
          </div>

          {/* 2. Foreground Logo (Full Color) with Wavy Mask for fill progress */}
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <svg 
              viewBox="0 0 5000 5000" 
              className="w-8 h-8"
            >
              <defs>
                {/* Wavy Mask definition inside the SVG workspace */}
                <mask id="ptr-wave-mask" maskUnits="userSpaceOnUse" x="-5000" y="-1000" width="15000" height="7000">
                  <rect x="-5000" y="-1000" width="15000" height="7000" fill="black" />
                  <g style={{ transform: `translateY(${waveY}px)`, transition: 'transform 0.1s ease-out' }}>
                    <path 
                      d="M -5000 0 C -3750 -200, -3750 200, -2500 0 C -1250 -200, -1250 200, 0 0 C 1250 -200, 1250 200, 2500 0 C 3750 -200, 3750 200, 5000 0 C 6250 -200, 6250 200, 7500 0 C 8750 -200, 8750 200, 10000 0 L 10000 6000 L -5000 6000 Z" 
                      fill="white" 
                      className="animate-[ptr-wave-move_1.5s_linear_infinite]"
                    />
                  </g>
                </mask>
              </defs>
              
              <g mask="url(#ptr-wave-mask)">
                <g id="_1678021877488">
                  <path d="M1625.8 1708.29l-348.09 -439.43c-51.09,19.05 -55.03,31.58 -87.96,75.26 -87.28,115.76 -107.52,126.83 -199.95,279.87 -635,1051.33 72.94,2560.37 1416.73,2621.4l-1.21 -403.49c-927.78,-82.98 -1464.94,-984.65 -1159.15,-1820.44l40.93 -71.81c84.81,78.31 273.58,376.63 358.86,416.47l350.7 -437.47 0.39 1468.07 404.31 2.89 5.27 -2638.01 -53.91 52.35c-19.53,23.3 -28,36.97 -49.36,63.31 -97.62,120.39 -623.23,793.63 -677.56,831.04z" fill="#C2302A" />
                  <path d="M2595.15 3400.22l406.78 -1.87 2.76 -2140.88c246,74.39 498.64,318.8 632.93,529.16 524.17,821.1 -3.74,1977.69 -1040.01,2054.57l-2.95 404.02c905.92,-33.73 1650.61,-811.43 1651.08,-1745.32 0.47,-941.41 -742.17,-1699.63 -1650.23,-1745.3l-0.35 2645.61z" fill="#FFCC29" />
                </g>
              </g>
            </svg>
          </div>

        </div>
      </div>
    </div>
  )
}
