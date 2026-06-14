'use client'

import { ExternalLink } from 'lucide-react'

interface NativeMediaPlayerProps {
  url: string
  title?: string
}

export default function NativeMediaPlayer({ url, title }: NativeMediaPlayerProps) {
  if (!url) return null

  // 1. YouTube link detection (supporting watch, embed, share, and shorts links)
  const getYouTubeId = (link: string) => {
    if (!link) return null
    // Shorts link detection (precisely matching 11 character YouTube video IDs)
    const shortsMatch = link.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/)
    if (shortsMatch) return shortsMatch[1]
    // Standard watch/embed detection
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = link.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const ytId = getYouTubeId(url)
  const isYouTube = !!ytId

  // 2. Instagram link detection (supporting posts, reels, and TV links)
  const igRegExp = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/
  const igMatch = url.match(igRegExp)
  const isInstagram = !!igMatch
  const igCode = isInstagram ? igMatch[1] : null

  if (isYouTube && ytId) {
    return (
      <div className="w-full space-y-2.5 mt-3 text-left">
        <span className="block text-[10px] font-black text-saffron-600 uppercase tracking-widest">
          Video Presentation
        </span>
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
            title={title || "YouTube video player"}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (isInstagram && igCode) {
    return (
      <div className="w-full space-y-2.5 mt-3 text-left">
        <span className="block text-[10px] font-black text-pink-600 uppercase tracking-widest">
          Social Update
        </span>
        <div className="relative w-full max-w-[480px] mx-auto h-[480px] sm:h-[580px] md:h-[660px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 flex justify-center z-0">
          <iframe
            src={`https://www.instagram.com/p/${igCode}/embed`}
            title={title || "Instagram post player"}
            className="w-full h-full border-0"
            allowTransparency={true}
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>
    )
  }

  // Fallback to a styled external button link
  return (
    <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between mt-3 text-left z-0">
      <div className="text-left shrink min-w-0 pr-3">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attached Media Link</span>
        <span className="block text-xs font-bold text-slate-700 truncate max-w-xs md:max-w-md">{url}</span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1 shrink-0"
      >
        <span>Open Link</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}
