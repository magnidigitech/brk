'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Download,
  Video,
  ExternalLink,
  TrendingUp,
  Sparkles,
  Share2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Eye,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { urlFor } from '@/sanity/lib/image'
import MediaCarousel from '@/components/MediaCarousel'
import NativeMediaPlayer from '@/components/NativeMediaPlayer'
import RichTextRenderer from '@/components/RichTextRenderer'
import PdfPreviewModal from '@/components/PdfPreviewModal'
import { cleanExcerpt } from '@/lib/cleanExcerpt'
import SmartCardImage from '@/components/SmartCardImage'

interface UpdateItem {
  _id: string
  slug?: { current: string }
  title: any
  date: string
  summary: any
  speechUrl?: string
  documentUrl?: string
  image?: any
  images?: any[]
}

interface ParliamentaryUpdatesClientProps {
  updates: UpdateItem[]
}

interface ActiveContent {
  _id: string
  type: 'update' | 'news'
  title: string
  date: string
  excerpt?: string
  body?: any[]
  imageSrc?: string
  speechUrl?: string
  documentUrl?: string
  images?: any[]
}

interface WordToken {
  text: string
  start: number
  end: number
}

function tokenizeText(text: string, globalOffset: number): WordToken[] {
  const words: WordToken[] = []
  let currentWord = ''
  let wordStart = -1

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (/\S/.test(char)) {
      if (wordStart === -1) {
        wordStart = i
      }
      currentWord += char
    } else {
      if (currentWord) {
        words.push({
          text: currentWord,
          start: globalOffset + wordStart,
          end: globalOffset + i
        })
        currentWord = ''
        wordStart = -1
      }
    }
  }
  if (currentWord) {
    words.push({
      text: currentWord,
      start: globalOffset + wordStart,
      end: globalOffset + text.length
    })
  }

  return words
}

export default function ParliamentaryUpdatesClient({ updates, activeId }: ParliamentaryUpdatesClientProps & { activeId?: string | null }) {
  const { t, tContent, language } = useLanguage()
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null)
  const [activeMedia, setActiveMedia] = useState<{ src: string; title: string; date?: string; caption?: string; allImages?: string[]; currentIndex?: number } | null>(null)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null)
  const [dismissedId, setDismissedId] = useState<string | null>(null)
  const dragControls = useDragControls()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const readableUpdateText = activeContent
    ? `${activeContent.title}. ${activeContent.excerpt || ''}`
    : ''
  const { speak, pause, stop, state: ttsState, supported: ttsSupported, currentCharIndex } = useTextToSpeech(readableUpdateText, language)

  // Tokenize elements for interactive word highlighting
  const titleTokens = activeContent ? tokenizeText(activeContent.title, 0) : []
  const excerptOffset = activeContent ? activeContent.title.length + 2 : 0
  const excerptTokens = activeContent && activeContent.excerpt ? tokenizeText(activeContent.excerpt, excerptOffset) : []

  useEffect(() => {
    if (!activeContent) {
      stop()
    }
  }, [activeContent])
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const sharePath = '/parliamentary-updates'
  const currentSlugOrId = activeContent ? (updates.find(r => r._id === activeContent._id)?.slug?.current || activeContent._id) : ''
  const shareUrl = activeContent ? `${isClient ? window.location.origin : ''}${sharePath}/${currentSlugOrId}` : ''
  const siteUrl = isClient ? window.location.origin : ''
  const twitterUrl = 'https://x.com/bhashyambrk'
  const instagramUrl = 'https://www.instagram.com/ramakrishnabhashyam/'
  
  const rawExcerptText = activeContent ? (activeContent.excerpt || '') : ''
  const truncatedExcerptText = rawExcerptText.length > 250 ? rawExcerptText.slice(0, 250) + '...' : rawExcerptText
  
  const whatsappShareText = activeContent ? `🏛️ *SHRI BHASHYAM RAMA KRISHNA PORTAL*
━━━━━━━━━━━━━━━━━━
📰 *${activeContent.title}*

📅 _${new Date(activeContent.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}_

${truncatedExcerptText}

🔗 *Read Full Article:*
${shareUrl}

🌐 *Visit Official Site:*
${siteUrl}

📲 *Connect on Social Media:*
• *Twitter/X:* ${twitterUrl}
• *Instagram:* ${instagramUrl}
━━━━━━━━━━━━━━━━━━` : ''

  const historyPushedRef = useRef<{ media: boolean; content: boolean }>({ media: false, content: false })

  // Modal History Stack Interception
  useEffect(() => {
    const hasMedia = !!activeMedia
    const hasContent = !!activeContent

    if (hasMedia && !historyPushedRef.current.media) {
      window.history.pushState({ type: 'activeMedia' }, '')
      historyPushedRef.current.media = true
    } else if (!hasMedia && historyPushedRef.current.media) {
      historyPushedRef.current.media = false
      if (window.history.state?.type === 'activeMedia') {
        window.history.back()
      }
    }

    if (hasContent && !historyPushedRef.current.content) {
      const slugOrId = updates.find(r => r._id === activeContent._id)?.slug?.current || activeContent._id
      window.history.pushState({ type: 'activeContent' }, '', `${sharePath}/${slugOrId}`)
      historyPushedRef.current.content = true
    } else if (!hasContent && historyPushedRef.current.content) {
      historyPushedRef.current.content = false
      if (window.location.pathname !== sharePath) {
        window.history.replaceState({}, '', sharePath)
      }
    }
  }, [activeMedia, activeContent, sharePath])

  const closeModal = useCallback(() => {
    if (activeContent) {
      setDismissedId(activeContent._id)
    }
    setActiveContent(null)
    setActiveMedia(null)
    if (typeof window !== 'undefined' && window.location.pathname !== sharePath) {
      window.history.pushState({}, '', sharePath)
    }
  }, [activeContent, sharePath])

  useEffect(() => {
    if (activeMedia) { setLightboxZoom(1); setLightboxIndex(activeMedia.currentIndex ?? 0) }
  }, [activeMedia])

  useEffect(() => {
    if (!activeMedia) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveMedia(null) }
      else if (e.key === 'ArrowRight') {
        const imgs = activeMedia.allImages
        if (imgs && imgs.length > 1) setLightboxIndex(prev => { const next = (prev + 1) % imgs.length; setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m); return next })
      } else if (e.key === 'ArrowLeft') {
        const imgs = activeMedia.allImages
        if (imgs && imgs.length > 1) setLightboxIndex(prev => { const next = (prev - 1 + imgs.length) % imgs.length; setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m); return next })
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeMedia])

  // Check activeId or query parameters on mount and updates load
  useEffect(() => {
    let id = activeId
    if (!id && isClient) {
      const params = new URLSearchParams(window.location.search)
      id = params.get('id')
    }
    if (id && id === dismissedId) return

    if (id && updates.length > 0) {
      const item = updates.find((u) => u.slug?.current === id || u._id === id || u._id.startsWith(id))
      if (item) {
        const imgSrc = item.image
          ? (typeof item.image === 'string' ? item.image : urlFor(item.image).width(800).url())
          : undefined

        const combinedImages = []
        if (item.image) {
          combinedImages.push(item.image)
        }
        if (item.images && Array.isArray(item.images)) {
          combinedImages.push(...item.images)
        }

        setActiveContent({
          _id: item._id,
          type: 'update',
          title: tContent(item.title),
          date: item.date,
          excerpt: tContent(item.summary),
          imageSrc: imgSrc,
          speechUrl: item.speechUrl,
          documentUrl: item.documentUrl,
          images: combinedImages,
        })
      }
    }
  }, [updates, activeId, isClient, dismissedId])

  // Sync activeContent changes with URL path
  useEffect(() => {
    if (activeContent && isClient) {
      const slugOrId = updates.find(r => r._id === activeContent._id)?.slug?.current || activeContent._id
      const targetPath = `${sharePath}/${slugOrId}`
      if (window.location.pathname !== targetPath) {
        window.history.replaceState({ ...window.history.state, type: 'activeContent' }, '', targetPath)
      }
    } else if (!activeContent && isClient) {
      if (window.location.pathname !== sharePath) {
        window.history.replaceState({ ...window.history.state }, '', sharePath)
      }
    }
  }, [activeContent, isClient, updates])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state
      if (state?.type === 'activeMedia') {
        historyPushedRef.current.media = true
        historyPushedRef.current.content = true
      } else if (state?.type === 'activeContent') {
        historyPushedRef.current.media = false
        historyPushedRef.current.content = true
        setActiveMedia(null)
      } else {
        historyPushedRef.current.media = false
        historyPushedRef.current.content = false
        setActiveMedia(null)
        setActiveContent(null)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Grouping updates by Month and Year
  const groups: Record<string, { label: string; year: number; month: number; items: UpdateItem[] }> = {}
  
  updates.forEach((item) => {
    const dateObj = new Date(item.date)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth()
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' })
    const key = `${year}-${String(month + 1).padStart(2, '0')}`

    if (!groups[key]) {
      groups[key] = {
        label: `${monthName} ${year}`,
        year,
        month,
        items: []
      }
    }
    groups[key].items.push(item)
  })

  // Sort months in descending order (newest first)
  const sortedGroupKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a))

  // Set the default open accordion to the most recent month group
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(sortedGroupKeys[0] || null)

  const toggleGroup = (key: string) => {
    setActiveGroupKey(activeGroupKey === key ? null : key)
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 relative pb-4 px-4 sm:px-0">
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">Legislative Activity</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            Parliamentary Updates
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Review detailed highlights of speeches, questions, debates, and activities in the Rajya Sabha.
          </p>
          <div className="w-24 h-1 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Accordion List */}
        {sortedGroupKeys.length > 0 ? (
          <div className="space-y-4">
            {sortedGroupKeys.map((key) => {
              const group = groups[key]
              const isOpen = activeGroupKey === key
              return (
                <div
                  key={key}
                  className="bg-white border-y sm:border-2 border-slate-200 sm:rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-saffron-300 relative"
                >
                  {isOpen && <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-500"></div>}
                  <button
                    onClick={() => toggleGroup(key)}
                    className={`w-full p-4 sm:p-5 text-left flex items-center justify-between focus:outline-none transition-colors ${
                      isOpen ? 'bg-saffron-50/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                        <TrendingUp className={`w-5 h-5 ${isOpen ? 'text-saffron-600' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-navy-900">{group.label}</h3>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{group.items.length} {group.items.length === 1 ? 'Update' : 'Updates'}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-saffron-600' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-1.5 sm:pt-2 border-t border-slate-100 bg-slate-50/20">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-3 sm:pt-4">
                            {group.items.map((item) => {
                              const utitle = tContent(item.title)
                              const usummary = tContent(item.summary)
                              const imgSrc = item.image
                                ? (typeof item.image === 'string' ? item.image : urlFor(item.image).width(800).url())
                                : (item.images && item.images[0] ? (typeof item.images[0] === 'string' ? item.images[0] : urlFor(item.images[0]).width(800).url()) : undefined)

                              return (
                                <div
                                  key={item._id}
                                  className="group flex flex-col cursor-pointer bg-white hover:bg-saffron-50/10 border border-slate-100 hover:border-saffron-200 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md justify-between"
                                  onClick={() => {
                                    const combinedImages = []
                                    if (item.image) {
                                      combinedImages.push(item.image)
                                    }
                                    if (item.images && Array.isArray(item.images)) {
                                      combinedImages.push(...item.images)
                                    }
                                    setActiveContent({
                                      _id: item._id,
                                      type: 'update',
                                      title: utitle,
                                      date: item.date,
                                      excerpt: usummary,
                                      imageSrc: imgSrc,
                                      speechUrl: item.speechUrl,
                                      documentUrl: item.documentUrl,
                                      images: combinedImages,
                                    })
                                  }}
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(item.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                      </div>
                                      <span className="text-[10px] text-saffron-600 font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read more <ChevronRight className="w-3 h-3" />
                                      </span>
                                    </div>
                                    {imgSrc && <SmartCardImage src={imgSrc} alt={utitle} />}
                                    <h4 className="text-base font-bold text-navy-900 group-hover:text-saffron-600 transition-colors leading-snug mb-2 line-clamp-2">
                                      {utitle}
                                    </h4>
                                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                                      {cleanExcerpt(usummary)}
                                    </p>
                                  </div>

                                  {(item.speechUrl || item.documentUrl) && (
                                    <div className="mt-auto pt-3 border-t border-slate-100/60 flex flex-col gap-1.5">
                                      {item.speechUrl && (
                                        <span className="inline-flex items-center text-[11px] font-bold text-saffron-600">
                                          <Video className="w-3 h-3 mr-1" /> Speech available
                                        </span>
                                      )}
                                      {item.documentUrl && (
                                        <span className="inline-flex items-center text-[11px] font-bold text-navy-700">
                                          <Download className="w-3 h-3 mr-1" /> Document attached
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">No parliamentary updates logged.</p>
          </div>
        )}

      </div>

      {/* ── Full Content Detail Modal ────────────────────────────────── */}
      <AnimatePresence>
        {activeContent && (
          <motion.div
            data-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.85 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) {
                  closeModal()
                }
              }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl border border-saffron-200 flex flex-col max-h-[92vh] overflow-hidden"
            >
              {/* Swipe/Drag Handle bar at the top */}
              <div
                className="w-full pt-3 pb-1 cursor-grab active:cursor-grabbing flex justify-center shrink-0 select-none touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-12 h-1.5 bg-slate-300 rounded-full hover:bg-slate-400 transition-colors" />
              </div>

              <div 
                className="flex items-center justify-between px-6 pb-4 border-b border-slate-100 shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center space-x-2.5 pointer-events-none">
                  <TrendingUp className="w-5 h-5 text-saffron-600" />
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-widest">
                    Parliamentary Update
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5">
                <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(activeContent.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-navy-900 leading-snug mb-4">
                  {ttsState !== 'idle' ? (
                    titleTokens.map((t, i) => {
                      const isHighlighted = currentCharIndex >= t.start && currentCharIndex < t.end
                      return (
                        <span
                          key={i}
                          className={isHighlighted ? 'bg-saffron-100 text-saffron-800 px-0.5 rounded transition-all' : ''}
                        >
                          {t.text}{' '}
                        </span>
                      )
                    })
                  ) : (
                    activeContent.title
                  )}
                </h2>

                {activeContent.images && activeContent.images.length > 0 ? (
                  <div className="mb-6">
                    <MediaCarousel
                      images={activeContent.images}
                      title={activeContent.title}
                      onImageClick={(src, idx, allSrcs) => {
                        setActiveMedia({ src, title: activeContent.title, date: activeContent.date, allImages: allSrcs, currentIndex: idx })
                      }}
                    />
                  </div>
                ) : (
                  activeContent.imageSrc && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group/img cursor-zoom-in bg-white p-2 flex items-center justify-center"
                      onClick={() => { setActiveMedia({ src: activeContent.imageSrc!, title: activeContent.title, date: activeContent.date, allImages: [activeContent.imageSrc!], currentIndex: 0 }) }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeContent.imageSrc}
                        alt={activeContent.title}
                        className="w-full object-contain max-h-80 bg-white group-hover/img:brightness-95 transition-all duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <span className="bg-black/70 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                          Click to view full image
                        </span>
                      </div>
                    </div>
                  )
                )}

                {activeContent.excerpt && (
                  <div className="mb-5 pb-5">
                    <RichTextRenderer
                      content={activeContent.excerpt}
                      ttsState={ttsState}
                      currentCharIndex={currentCharIndex}
                    />
                  </div>
                )}

                {/* Document Action Buttons: Preview & Download */}
                {activeContent.documentUrl && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewPdfUrl(activeContent.documentUrl || null)}
                      className="inline-flex items-center px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4 mr-2 text-saffron-400" />
                      Preview Official Document
                    </button>

                    <a
                      href={activeContent.documentUrl}
                      download
                      className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold border border-slate-200/60 transition-colors"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Download className="w-3.5 h-3.5 mr-2 text-slate-600" />
                      Download PDF
                    </a>
                  </div>
                )}

                {/* Native Media Player Embed */}
                {activeContent.speechUrl && (
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <NativeMediaPlayer url={activeContent.speechUrl} title={activeContent.title} />
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 w-full">
                <div className={`grid ${isClient && ttsSupported ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 w-full`}>
                  {/* Column 1: Listen / Stop */}
                  {isClient && ttsSupported && (
                    <button
                      type="button"
                      onClick={ttsState === 'playing' ? stop : speak}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {ttsState === 'playing' ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2 text-rose-600 animate-pulse" />
                          <span>{language === 'te' ? 'ఆపండి' : 'Stop'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4.5 h-4.5 mr-2 text-saffron-600" />
                          <span>{language === 'te' ? 'వినండి' : 'Listen'}</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Column 3: Share (at the end) */}
                  <div className="relative w-full">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowShareMenu(!showShareMenu)
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold border border-slate-200/50 shadow-sm transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 mr-2 text-slate-600" />
                      <span>{language === 'te' ? 'భాగస్వామ్యం' : 'Share'}</span>
                    </button>

                    <AnimatePresence>
                      {showShareMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute bottom-full mb-2 right-0 z-50 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-1.5"
                          >
                            <a
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setShowShareMenu(false)}
                              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
                            >
                              <svg className="w-4 h-4 mr-3 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              WhatsApp
                            </a>
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                activeContent.title + ' - ' + (activeContent.excerpt || '').slice(0, 100) + '...'
                              )}&url=${encodeURIComponent(
                                shareUrl
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setShowShareMenu(false)}
                              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
                            >
                              <svg className="w-4 h-4 mr-3 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                              X (Twitter)
                            </a>
                            <button
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(shareUrl)
                                  setCopied(true)
                                  setTimeout(() => setCopied(false), 2000)
                                } catch (err) {
                                  console.error('Failed to copy text: ', err)
                                }
                                setShowShareMenu(false)
                              }}
                              className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-left"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-4 h-4 mr-3 text-emerald-600" />
                                  <span className="text-emerald-600">Link Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-3 text-slate-500" />
                                  Copy Link
                                </>
                              )}
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Image Lightbox Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div data-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMedia(null)} className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="w-full max-w-5xl flex items-center justify-between mb-3 px-1" onClick={(e) => e.stopPropagation()}>
              <span className="text-white/70 text-xs font-semibold truncate max-w-xs">{activeMedia.title}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 rounded-xl px-1 py-0.5">
                  <button onClick={() => setLightboxZoom(z => Math.max(0.5, parseFloat((z - 0.25).toFixed(2))))} className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer" aria-label="Zoom out"><ZoomOut className="w-4 h-4" /></button>
                  <button onClick={() => setLightboxZoom(1)} className="text-white/80 text-[11px] font-bold min-w-[36px] text-center hover:text-white transition-colors cursor-pointer">{Math.round(lightboxZoom * 100)}%</button>
                  <button onClick={() => setLightboxZoom(z => Math.min(4, parseFloat((z + 0.25).toFixed(2))))} className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer" aria-label="Zoom in"><ZoomIn className="w-4 h-4" /></button>
                </div>
                <button onClick={() => window.open(activeMedia.src, '_blank')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-900 text-xs font-bold transition-colors shadow-lg cursor-pointer"><Download className="w-4 h-4" />View Original</button>
                <button onClick={() => setActiveMedia(null)} className="w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer" aria-label="Close (Esc)" title="Close (Esc)"><X className="w-5 h-5" /></button>
              </div>
            </div>
            {activeMedia.allImages && activeMedia.allImages.length > 1 && (<button onClick={(e) => { e.stopPropagation(); const imgs = activeMedia.allImages!; const next = (lightboxIndex - 1 + imgs.length) % imgs.length; setLightboxIndex(next); setLightboxZoom(1); setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m) }} className="fixed left-3 top-1/2 -translate-y-1/2 z-[70] w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xl border border-white/10" aria-label="Previous image"><ChevronLeft className="w-6 h-6" /></button>)}
            {activeMedia.allImages && activeMedia.allImages.length > 1 && (<button onClick={(e) => { e.stopPropagation(); const imgs = activeMedia.allImages!; const next = (lightboxIndex + 1) % imgs.length; setLightboxIndex(next); setLightboxZoom(1); setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m) }} className="fixed right-3 top-1/2 -translate-y-1/2 z-[70] w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xl border border-white/10" aria-label="Next image"><ChevronRight className="w-6 h-6" /></button>)}
            <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.8} onDragEnd={(_, info) => { if (lightboxZoom <= 1 && (Math.abs(info.offset.y) > 120 || Math.abs(info.velocity.y) > 600)) setActiveMedia(null) }} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center w-full max-w-5xl min-h-0 select-none touch-none overflow-auto" style={{ cursor: lightboxZoom > 1 ? 'grab' : 'zoom-in' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeMedia.src} alt={activeMedia.title} onDoubleClick={() => setLightboxZoom(1)} style={{ transform: `scale(${lightboxZoom})`, transition: 'transform 0.2s ease', transformOrigin: 'center center', maxHeight: lightboxZoom <= 1 ? '75vh' : undefined }} className="max-w-full object-contain rounded-2xl shadow-2xl border border-white/10" />
            </motion.div>
            <div className="mt-3 flex flex-col items-center gap-1 max-w-2xl" onClick={(e) => e.stopPropagation()}>
              {activeMedia.allImages && activeMedia.allImages.length > 1 && (<span className="text-white/50 text-[11px] font-bold">{lightboxIndex + 1} / {activeMedia.allImages.length}</span>)}
              {(activeMedia.caption || activeMedia.date) && (<div className="text-center">{activeMedia.date && (<span className="block text-saffron-400 text-[11px] font-bold uppercase tracking-wider mb-1">{new Date(activeMedia.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>)}{activeMedia.caption && (<p className="text-white/75 text-sm leading-relaxed">{activeMedia.caption}</p>)}</div>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Document Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewPdfUrl}
        onClose={() => setPreviewPdfUrl(null)}
        documentUrl={previewPdfUrl || ''}
        title={activeContent?.title || 'Parliamentary Document Preview'}
      />
    </div>
  )
}
