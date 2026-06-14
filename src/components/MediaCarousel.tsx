'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'

interface MediaCarouselProps {
  images: any[]
  title?: string
  onImageClick?: (src: string) => void
}

export default function MediaCarousel({ images, title, onImageClick }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Pre-resolve and filter out invalid/unresolvable image URLs
  const resolvedImages = (images || [])
    .map((img) => {
      if (!img) return ''
      if (typeof img === 'string') return img.trim()
      try {
        // Handle Sanity image object resolution safely
        return urlFor(img).url() || ''
      } catch (e) {
        console.error('Failed to resolve image URL', e)
        return ''
      }
    })
    .filter((url) => url.length > 0)

  const totalSlides = resolvedImages.length

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
    }, 3000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [totalSlides, isPaused])

  if (totalSlides === 0) return null

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
  }

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation()
    setCurrentIndex(idx)
  }

  return (
    <div
      className="relative w-full aspect-video md:aspect-[16/10] overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Slides wrapper */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {resolvedImages.map((resolvedUrl, idx) => (
          <div
            key={idx}
            className={`relative h-full w-full flex-shrink-0 select-none ${onImageClick ? 'cursor-zoom-in group/slide' : ''}`}
            onClick={() => onImageClick?.(resolvedUrl)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedUrl}
              alt={`${title || 'Carousel Slide'} - ${idx + 1}`}
              className="w-full h-full object-cover group-hover/slide:brightness-90 transition-all duration-300"
              draggable={false}
            />
            {onImageClick && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/slide:opacity-100 transition-opacity bg-black/15 pointer-events-none">
                <span className="bg-black/70 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                  Click to view full image
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Manual Control Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 cursor-pointer z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 cursor-pointer z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide Index Indicators / Dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
          {resolvedImages.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => handleDotClick(e, idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? 'bg-saffron-500 w-5' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
