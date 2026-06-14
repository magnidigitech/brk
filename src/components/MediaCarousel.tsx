'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'

interface MediaCarouselProps {
  images: any[]
  title?: string
}

export default function MediaCarousel({ images, title }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!images || images.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [images, isPaused])

  if (!images || images.length === 0) return null

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
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
          width: `${images.length * 100}%`
        }}
      >
        {images.map((img, idx) => {
          let resolvedUrl = ''
          try {
            resolvedUrl = urlFor(img).url()
          } catch (e) {
            console.error('Failed to resolve image URL', e)
          }

          if (!resolvedUrl) return null

          return (
            <div key={idx} className="relative h-full flex-1 w-full select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvedUrl}
                alt={`${title || 'Carousel Slide'} - ${idx + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          )
        })}
      </div>

      {/* Manual Control Arrows */}
      {images.length > 1 && (
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
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
          {images.map((_, idx) => (
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
