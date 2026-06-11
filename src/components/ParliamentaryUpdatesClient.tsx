'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  ChevronRight,
  ChevronDown,
  X,
  Download,
  Video,
  ExternalLink,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

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
  const { t, tContent } = useLanguage()
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null)

  const historyPushedRef = useRef<{ content: boolean }>({ content: false })

  // Modal History Stack Interception
  useEffect(() => {
    const hasContent = !!activeContent

    if (hasContent && !historyPushedRef.current.content) {
      window.history.pushState({ type: 'activeContent' }, '')
      historyPushedRef.current.content = true
    } else if (!hasContent && historyPushedRef.current.content) {
      historyPushedRef.current.content = false
      if (window.history.state?.type === 'activeContent') {
        window.history.back()
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
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl border border-saffron-200 flex flex-col max-h-[92vh] overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <TrendingUp className="w-5 h-5 text-saffron-600" />
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-widest">
                    Parliamentary Update
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

                {activeContent.excerpt && (
                  <p className="text-base text-slate-700 leading-relaxed font-medium mb-5 pb-5">
                    {activeContent.excerpt}
                  </p>
                )}
              </div>

              {(activeContent.speechUrl || activeContent.documentUrl) && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-wrap gap-3">
                  {activeContent.speechUrl && (
                    <a
                      href={activeContent.speechUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-bold hover:bg-navy-800 transition-colors shadow-sm"
                    >
                      <Video className="w-4 h-4 mr-2 text-saffron-400" />
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
