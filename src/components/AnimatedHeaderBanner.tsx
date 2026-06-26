'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AnimatedHeaderBannerProps {
  staticFallbackPath?: string
  bgPath?: string
  logoPath?: string
  cbnPath?: string
  lokeshPath?: string
  brkPath?: string
}

export default function AnimatedHeaderBanner({
  staticFallbackPath = '/images/header.png?v=2',
  bgPath = '/images/header_bg.png?v=2',
  logoPath = '/images/header_logo.png?v=2',
  cbnPath = '/images/header_cbn.png?v=2',
  lokeshPath = '/images/header_lokesh.png?v=2',
  brkPath = '/images/header_brk.png?v=2',
}: AnimatedHeaderBannerProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Pre-verify that all individual assets exist and load, fallback to static if any fail
  useEffect(() => {
    if (typeof window === 'undefined') return

    const imagesToLoad = [bgPath, logoPath, cbnPath, lokeshPath, brkPath]
    let loadedCount = 0
    let failed = false

    imagesToLoad.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loadedCount++
        if (loadedCount === imagesToLoad.length && !failed) {
          setIsLoaded(true)
        }
      }
      img.onerror = () => {
        failed = true
        setHasError(true)
      }
    })
  }, [bgPath, logoPath, cbnPath, lokeshPath, brkPath])

  // Fallback to static banner image if layered assets are missing
  if (hasError) {
    return (
      <div className="w-full overflow-hidden bg-white border-b border-slate-200/80 relative aspect-[2.33/1] max-h-[260px] sm:max-h-[380px] md:max-h-[480px] shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={staticFallbackPath}
          alt="Telugu Desam Party Banner"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-yellow-300 via-saffron-300 to-saffron-400 border-b border-slate-200/80 relative aspect-[2.33/1] max-h-[260px] sm:max-h-[380px] md:max-h-[480px] shadow-sm select-none">
      {/* Background cityscape gradient image */}
      {isLoaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgPath}
          alt="Banner Background"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          fetchPriority="high"
        />
      )}

      {/* Layered Animations (Overlapping transparent layers of same size) */}
      {isLoaded && (
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {/* 1. Alliance Logo: Animate scale from large to small, anchored at top center */}
          <motion.div
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1], // Custom premium easing curve
            }}
            style={{ transformOrigin: 'top center' }}
            className="absolute inset-0 w-full h-full z-20"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoPath}
              alt="Alliance Logo"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </motion.div>

          {/* 2. Middle Chandrababu: Fade up */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.8,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: 'bottom center' }}
            className="absolute inset-0 w-full h-full z-30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cbnPath}
              alt="N. Chandrababu Naidu"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </motion.div>

          {/* 3. Left Lokesh: Fade in from left */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: 1.1,
              duration: 0.8,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: 'bottom left' }}
            className="absolute inset-0 w-full h-full z-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lokeshPath}
              alt="Nara Lokesh"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </motion.div>

          {/* 4. Right Rama Krishna: Fade in from right */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              delay: 1.1,
              duration: 0.8,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: 'bottom right' }}
            className="absolute inset-0 w-full h-full z-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brkPath}
              alt="Bhashyam Rama Krishna"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </motion.div>
        </div>
      )}

      {/* Placeholder static image while checking/loading layered assets */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-300 via-saffron-300 to-saffron-400 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staticFallbackPath}
            alt="Telugu Desam Party Banner Placeholder"
            className="w-full h-full object-cover opacity-85"
            fetchPriority="high"
          />
        </div>
      )}
    </div>
  )
}
