'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  BookOpen,
  ChevronRight,
  ChevronDown,
  X,
  Download,
  Video,
  ExternalLink,
  FileText,
  Sparkles
} from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { useLanguage } from '@/components/LanguageContext'

interface NewsItem {
  _id: string
  title: any
  publishedAt: string
  excerpt?: any
  body?: any[]
  image?: any
}

interface PressReleasesClientProps {
  releases: NewsItem[]
}

interface ActiveMedia {
  src: string
  title: string
  caption?: string
  date?: string
}

interface ActiveContent {
  type: 'update' | 'news'
  title: string
  date: string
  excerpt?: string
  body?: any[]
  imageSrc?: string
  speechUrl?: string
  documentUrl?: string
}

function renderBody(body: any[]): string[] {
  if (!body || !Array.isArray(body)) return []
  const paragraphs: string[] = []
  for (const block of body) {
    if (block._type === 'block' && Array.isArray(block.children)) {
      const text = block.children
        .map((child: any) => child.text || '')
        .join('')
      if (text.trim()) paragraphs.push(text.trim())
    }
  }
  return paragraphs
}

export default function PressReleasesClient({ releases }: PressReleasesClientProps) {
  const { t, tContent } = useLanguage()
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null)
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null)

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
      window.history.pushState({ type: 'activeContent' }, '')
      historyPushedRef.current.content = true
    } else if (!hasContent && historyPushedRef.current.content) {
      historyPushedRef.current.content = false
      if (window.history.state?.type === 'activeContent') {
        window.history.back()
      }
    }
  }, [activeMedia, activeContent])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (historyPushedRef.current.media) {
        historyPushedRef.current.media = false
        setActiveMedia(null)
      } else if (historyPushedRef.current.content) {
        historyPushedRef.current.content = false
        setActiveContent(null)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Grouping releases by Month and Year
  const groups: Record<string, { label: string; year: number; month: number; items: NewsItem[] }> = {}
  
  releases.forEach((item) => {
    const dateObj = new Date(item.publishedAt)
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
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">Media & Press Room</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            Official Press Releases
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Browse through historical archives and official press announcements published by our office.
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
                        <FileText className={`w-5 h-5 ${isOpen ? 'text-saffron-600' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-navy-900">{group.label}</h3>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{group.items.length} {group.items.length === 1 ? 'Release' : 'Releases'}</span>
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
                              const ntitle = tContent(item.title)
                              const nexcerpt = tContent(item.excerpt)
                              const imgSrc = item.image
                                ? (typeof item.image === 'string' ? item.image : urlFor(item.image).width(800).url())
                                : undefined

                              return (
                                <div
                                  key={item._id}
                                  className="group flex flex-col cursor-pointer bg-white hover:bg-saffron-50/10 border border-slate-100 hover:border-saffron-200 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md"
                                  onClick={() => setActiveContent({
                                    type: 'news',
                                    title: ntitle,
                                    date: item.publishedAt,
                                    excerpt: nexcerpt,
                                    body: item.body,
                                    imageSrc: imgSrc,
                                  })}
                                >
                                  {item.image && (
                                    <div className="mb-4 rounded-xl overflow-hidden h-44 relative bg-slate-100 border border-slate-200/60 shadow-sm shrink-0">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={imgSrc}
                                        alt={ntitle}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                      />
                                    </div>
                                  )}
                                  <span className="block text-xs text-slate-500 font-semibold mb-2">
                                    {new Date(item.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                  </span>
                                  <h4 className="text-sm font-bold text-navy-900 group-hover:text-saffron-600 transition-colors leading-snug mb-2 line-clamp-2">
                                    {ntitle}
                                  </h4>
                                  {nexcerpt && (
                                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4 flex-grow">
                                      {nexcerpt}
                                    </p>
                                  )}
                                  <span className="inline-flex items-center text-xs font-bold text-saffron-600 group-hover:text-saffron-700 transition-colors mt-auto pt-2">
                                    <BookOpen className="w-3.5 h-3.5 mr-1" /> Read full article <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                  </span>
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
            <p className="text-slate-500 text-sm">No press releases found in the archive.</p>
          </div>
        )}

      </div>

      {/* ── Image Lightbox Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            data-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMedia(null)}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <div
              className="w-full max-w-5xl flex items-center justify-between mb-3 px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white/70 text-xs font-semibold truncate max-w-xs">{activeMedia.title}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(activeMedia.src, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-900 text-xs font-bold transition-colors shadow-lg cursor-pointer"
                  aria-label="Download image"
                >
                  <Download className="w-4 h-4" />
                  View Original
                </button>
                <button
                  onClick={() => setActiveMedia(null)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center w-full max-w-5xl min-h-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeMedia.src}
                alt={activeMedia.title}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </motion.div>

            {(activeMedia.caption || activeMedia.date) && (
              <div
                className="mt-4 text-center max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {activeMedia.date && (
                  <span className="block text-saffron-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    {new Date(activeMedia.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                )}
                {activeMedia.caption && (
                  <p className="text-white/75 text-sm leading-relaxed">{activeMedia.caption}</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full Content Detail Modal ────────────────────────────────── */}
      <AnimatePresence>
        {activeContent && (
          <motion.div
            data-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveContent(null)}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl border border-saffron-200 flex flex-col max-h-[92vh] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-saffron-600" />
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-widest">
                    Press Release
                  </span>
                </div>
                <button
                  onClick={() => setActiveContent(null)}
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
                  {activeContent.title}
                </h2>

                {activeContent.imageSrc && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group/img cursor-zoom-in"
                    onClick={() => {
                      setActiveContent(null)
                      setTimeout(() => setActiveMedia({
                        src: activeContent.imageSrc!,
                        title: activeContent.title,
                        date: activeContent.date,
                      }), 150)
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeContent.imageSrc}
                      alt={activeContent.title}
                      className="w-full object-cover max-h-72 group-hover/img:brightness-90 transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <span className="bg-black/70 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                        Click to view full image
                      </span>
                    </div>
                  </div>
                )}

                {activeContent.excerpt && (
                  <p className="text-base text-slate-700 leading-relaxed font-medium mb-5 pb-5 border-b border-slate-100">
                    {activeContent.excerpt}
                  </p>
                )}

                {activeContent.body && activeContent.body.length > 0 ? (
                  <div className="space-y-4">
                    {renderBody(activeContent.body).map((para, i) => (
                      <p key={i} className="text-slate-700 text-sm leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : (
                  !activeContent.excerpt && (
                    <p className="text-slate-400 text-sm italic">No additional content available.</p>
                  )
                )}
              </div>

              {(activeContent.speechUrl || activeContent.documentUrl) && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-wrap gap-3">
                  {activeContent.speechUrl && (
                    <a
                      href={activeContent.speechUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-saffron-400 text-navy-950 text-sm font-bold hover:bg-saffron-500 transition-colors shadow-sm"
                    >
                      <Video className="w-4 h-4 mr-2 text-navy-950" />
                      Watch Speech
                      <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-60" />
                    </a>
                  )}
                  {activeContent.documentUrl && (
                    <a
                      href={activeContent.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-slate-200 text-navy-900 text-sm font-bold hover:bg-slate-300 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Document
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
