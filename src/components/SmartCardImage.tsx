'use client'

import { useState } from 'react'

interface SmartCardImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
}

export default function SmartCardImage({
  src,
  alt,
  className = '',
  containerClassName = ''
}: SmartCardImageProps) {
  const [isPortrait, setIsPortrait] = useState(false)

  return (
    <div
      className={`mb-4 rounded-xl overflow-hidden h-48 relative border border-slate-200/80 shadow-sm shrink-0 flex items-center justify-center transition-all duration-300 ${
        isPortrait ? 'bg-white p-1.5' : 'bg-slate-100'
      } ${containerClassName}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onLoad={(e) => {
          const img = e.currentTarget
          if (img.naturalHeight > img.naturalWidth) {
            setIsPortrait(true)
          }
        }}
        className={`w-full h-full transition-transform duration-500 ease-out group-hover:scale-105 ${
          isPortrait ? 'object-contain' : 'object-cover'
        } ${className}`}
      />
    </div>
  )
}
