'use client'

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
  return (
    <div
      className={`mb-4 rounded-xl overflow-hidden h-48 relative bg-white border border-slate-200 p-1.5 shadow-sm shrink-0 flex items-center justify-center transition-all duration-300 ${containerClassName}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300 ease-out ${className}`}
      />
    </div>
  )
}
