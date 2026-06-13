'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import {
  Calendar,
  ChevronRight,
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
  VolumeX
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

interface UpdateItem {
  _id: string
  title: any
  date: string
  summary: any
  speechUrl?: string
  documentUrl?: string
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
}

export default function ParliamentaryUpdatesClient({ updates }: ParliamentaryUpdatesClientProps) {
  const { t, tContent, language } = useLanguage()
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null)
  const dragControls = useDragControls()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const readableUpdateText = activeContent
    ? `${activeContent.title}. ${activeContent.excerpt || ''}`
    : ''
  const { speak, pause, stop, state: ttsState, supported: ttsSupported } = useTextToSpeech(readableUpdateText, language)

  useEffect(() => {
    if (!activeContent) {
      stop()
    }
  }, [activeContent])
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const historyPushedRef = useRef<{ content: boolean }>({ content: false })

  // Modal History Stack Interception
  useEffect(() => {
    const hasContent = !!activeContent

    if (hasContent && !historyPushedRef.current.content) {
      const params = new URLSearchParams(window.location.search)
      params.set('id', activeContent._id)
      window.history.pushState({ type: 'activeContent' }, '', `${window.location.pathname}?${params.toString()}`)
      historyPushedRef.current.content = true
    } else if (!hasContent && historyPushedRef.current.content) {
      historyPushedRef.current.content = false
      if (window.history.state?.type === 'activeContent') {
        window.history.back()
      }
    }
  }, [activeContent])

  // Check query parameter on mount and updates load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id && updates.length > 0) {
      const item = updates.find((u) => u._id === id)
      if (item) {
        setActiveContent({
          _id: item._id,
          type: 'update',
          title: tContent(item.title),
          date: item.date,
          excerpt: tContent(item.summary),
          speechUrl: item.speechUrl,
          documentUrl: item.documentUrl,
        })
      }
    }
  }, [updates])

  // Sync activeContent changes with URL query parameter
  useEffect(() => {
    if (!activeContent) {
      const params = new URLSearchParams(window.location.search)
      if (params.has('id')) {
        params.delete('id')
        const searchStr = params.toString()
        const newUrl = `${window.location.pathname}${searchStr ? '?' + searchStr : ''}`
        window.history.replaceState({ ...window.history.state }, '', newUrl)
      }
    }
  }, [activeContent])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (historyPushedRef.current.content) {
        historyPushedRef.current.content = false
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

                              return (
                                <div
                                  key={item._id}
                                  className="group flex flex-col cursor-pointer bg-white hover:bg-saffron-50/10 border border-slate-100 hover:border-saffron-200 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md justify-between"
                                  onClick={() => setActiveContent({
                                    _id: item._id,
                                    type: 'update',
                                    title: utitle,
                                    date: item.date,
                                    excerpt: usummary,
                                    speechUrl: item.speechUrl,
                                    documentUrl: item.documentUrl,
                                  })}
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
                                    <h4 className="text-base font-bold text-navy-900 group-hover:text-saffron-600 transition-colors leading-snug mb-2 line-clamp-2">
                                      {utitle}
                                    </h4>
                                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                                      {usummary}
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
            onClick={() => setActiveContent(null)}
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
                  setActiveContent(null)
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
                  onClick={() => setActiveContent(null)}
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
                  {activeContent.title}
                </h2>

                {activeContent.excerpt && (
                  <p className="text-base text-slate-700 leading-relaxed font-medium mb-5 pb-5">
                    {activeContent.excerpt}
                  </p>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap gap-3">
                  {isClient && ttsSupported && (
                    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                      <button
                        type="button"
                        onClick={ttsState === 'playing' ? pause : speak}
                        className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-saffron-100 hover:bg-saffron-200 text-navy-900 transition-colors cursor-pointer"
                        title={ttsState === 'playing' ? 'Pause' : 'Listen to update'}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {ttsState === 'playing' ? (
                          <VolumeX className="w-4 h-4 mr-1.5 animate-pulse text-rose-600" />
                        ) : (
                          <Volume2 className="w-4 h-4 mr-1.5 text-saffron-600" />
                        )}
                        <span className="text-xs font-bold">
                          {ttsState === 'playing'
                            ? (language === 'te' ? 'ఆపండి' : 'Pause')
                            : (language === 'te' ? 'వినండి' : 'Listen')}
                        </span>
                      </button>
                      {ttsState !== 'idle' && (
                        <button
                          type="button"
                          onClick={stop}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-bold"
                          title="Stop narration"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          {language === 'te' ? 'ముగించు' : 'Stop'}
                        </button>
                      )}
                    </div>
                  )}

                  {activeContent.speechUrl && (
                    <a
                      href={activeContent.speechUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-saffron-400 text-navy-950 text-sm font-bold hover:bg-saffron-500 transition-colors shadow-sm"
                      onPointerDown={(e) => e.stopPropagation()}
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
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Document
                    </a>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={async (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const shareUrl = `${window.location.origin}/parliamentary-updates?id=${activeContent._id}`
                      const summary = activeContent.excerpt || ''
                      const shareData = {
                        title: activeContent.title,
                        text: summary || activeContent.title,
                        url: shareUrl
                      }

                      if (navigator.share) {
                        try {
                          await navigator.share(shareData)
                          return
                        } catch (err) {
                          console.warn('Native share failed or dismissed:', err)
                        }
                      }
                      setShowShareMenu(!showShareMenu)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="inline-flex items-center px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-sm font-bold transition-colors cursor-pointer border border-slate-200/50 shadow-sm"
                  >
                    <Share2 className="w-4 h-4 mr-2 text-slate-600" />
                    Share
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
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                              activeContent.title + '\n\n' + 
                              (activeContent.excerpt || '').slice(0, 180) + (activeContent.excerpt ? '...' : '') + '\n\nRead here: ' + 
                              window.location.origin + '/parliamentary-updates?id=' + activeContent._id
                            )}`}
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
                            )}&url=${encodeURIComponent(window.location.origin + '/parliamentary-updates?id=' + activeContent._id)}`}
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
                              const shareUrl = `${window.location.origin}/parliamentary-updates?id=${activeContent._id}`
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
