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
  ZoomOut,
  Mic2,
  HelpCircle,
  FileText,
  Play,
  Clock,
  Building2,
  BadgeCheck,
  ChevronUp,
  MessageSquare,
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
import { useRouter, useSearchParams } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface QuestionItem {
  _id: string
  slug?: { current: string }
  title: any
  date: string
  questionNumber?: string
  sessionInfo?: string
  category?: string
  ministry?: string
  summary: any
  officialAnswer?: any
  documentUrl?: string
  image?: any
}

interface SpeechItem {
  _id: string
  slug?: { current: string }
  title: any
  date: string
  sessionInfo?: string
  speechUrl: string
  duration?: string
  summary: any
  topic?: string
  documentUrl?: string
}

interface ActiveContent {
  _id: string
  type: 'update' | 'question' | 'speech'
  title: string
  date: string
  excerpt?: string
  body?: any[]
  imageSrc?: string
  speechUrl?: string
  documentUrl?: string
  images?: any[]
  questionNumber?: string
  sessionInfo?: string
  category?: string
  ministry?: string
  officialAnswer?: string
  topic?: string
  duration?: string
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
      if (wordStart === -1) wordStart = i
      currentWord += char
    } else {
      if (currentWord) {
        words.push({ text: currentWord, start: globalOffset + wordStart, end: globalOffset + i })
        currentWord = ''
        wordStart = -1
      }
    }
  }
  if (currentWord) words.push({ text: currentWord, start: globalOffset + wordStart, end: globalOffset + text.length })
  return words
}

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const shortsMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/shorts\/)([a-zA-Z0-9_-]{11})/)
  if (shortsMatch) return shortsMatch[1]
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'starred':        { label: 'Starred',        color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
  'unstarred':      { label: 'Unstarred',       color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  'short-notice':   { label: 'Short Notice',    color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
  'supplementary':  { label: 'Supplementary',   color: 'text-teal-700',    bg: 'bg-teal-50 border-teal-200' },
  'zero-hour':      { label: 'Zero Hour',        color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200' },
  'special-mention':{ label: 'Special Mention', color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  updates?: UpdateItem[]
  questions?: QuestionItem[]
  speeches?: SpeechItem[]
  activeId?: string | null
  initialTab?: 'speeches' | 'questions' | 'updates'
}

export default function ParliamentaryUpdatesClient({ updates = [], questions = [], speeches = [], activeId, initialTab = 'updates' }: Props) {
  const { t, tContent, language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<'speeches' | 'questions' | 'updates'>(initialTab)
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null)
  const [activeSpeech, setActiveSpeech] = useState<SpeechItem | null>(null)
  const [activeMedia, setActiveMedia] = useState<{ src: string; title: string; date?: string; caption?: string; allImages?: string[]; currentIndex?: number } | null>(null)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const lightboxContainerRef = useRef<HTMLDivElement>(null)
  const lightboxImageRef = useRef<HTMLImageElement>(null)
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null)
  const [dismissedId, setDismissedId] = useState<string | null>(null)
  const dragControls = useDragControls()
  const [isClient, setIsClient] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)

  useEffect(() => { setIsClient(true) }, [])

  // ── Sync tab with URL ──────────────────────────────────────────────────────
  const TAB_ROUTES: Record<'speeches' | 'questions' | 'updates', string> = {
    speeches: '/parliamentary-speeches',
    questions: '/parliamentary-questions',
    updates: '/parliamentary-updates',
  }

  const switchTab = (tab: 'speeches' | 'questions' | 'updates') => {
    setActiveTab(tab)
    setActiveContent(null)
    setActiveSpeech(null)
    router.push(TAB_ROUTES[tab])
  }

  // ── TTS ──────────────────────────────────────────────────────────────────
  const readableUpdateText = activeContent ? `${activeContent.title}. ${activeContent.excerpt || ''}` : ''
  const { speak, stop, state: ttsState, supported: ttsSupported, currentCharIndex } = useTextToSpeech(readableUpdateText, language)
  const titleTokens = activeContent ? tokenizeText(activeContent.title, 0) : []
  const excerptOffset = activeContent ? activeContent.title.length + 2 : 0
  const excerptTokens = activeContent && activeContent.excerpt ? tokenizeText(activeContent.excerpt, excerptOffset) : []

  useEffect(() => { if (!activeContent) stop() }, [activeContent])

  // ── Lightbox touch/pinch ──────────────────────────────────────────────────
  const getDragConstraints = () => {
    if (!lightboxContainerRef.current || !lightboxImageRef.current) return { left: 0, right: 0, top: 0, bottom: 0 }
    const Cw = lightboxContainerRef.current.clientWidth
    const Ch = lightboxContainerRef.current.clientHeight
    const W = lightboxImageRef.current.clientWidth
    const H = lightboxImageRef.current.clientHeight
    const maxDragX = Math.max(0, (W * lightboxZoom - Cw) / 2)
    const maxDragY = Math.max(0, (H * lightboxZoom - Ch) / 2)
    return { left: -maxDragX, right: maxDragX, top: -maxDragY, bottom: maxDragY }
  }

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

  // ── Share logic ────────────────────────────────────────────────────────────
  const sharePath = '/parliamentary-updates'
  const currentSlugOrId = activeContent ? (updates.find(r => r._id === activeContent._id)?.slug?.current || activeContent._id) : ''
  const shareUrl = activeContent ? `${isClient ? window.location.origin : ''}${sharePath}/${currentSlugOrId}` : ''
  const siteUrl = isClient ? window.location.origin : ''
  const rawExcerptText = activeContent ? (activeContent.excerpt || '') : ''
  const truncatedExcerptText = rawExcerptText.length > 250 ? rawExcerptText.slice(0, 250) + '...' : rawExcerptText
  const whatsappShareText = activeContent ? `🏛️ *SHRI BHASHYAM RAMA KRISHNA PORTAL*\n━━━━━━━━━━━━━━━━━━\n📰 *${activeContent.title}*\n\n📅 _${new Date(activeContent.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}_\n\n${truncatedExcerptText}\n\n🔗 *Read Full:*\n${shareUrl}\n\n🌐 *Visit:* ${siteUrl}\n━━━━━━━━━━━━━━━━━━` : ''

  // ── Modal history ──────────────────────────────────────────────────────────
  const historyPushedRef = useRef<{ media: boolean; content: boolean }>({ media: false, content: false })

  useEffect(() => {
    if (!activeContent) return
    const slugOrId = updates.find(r => r._id === activeContent._id)?.slug?.current || activeContent._id
    window.history.pushState({ type: 'activeContent' }, '', `${sharePath}/${slugOrId}`)
    historyPushedRef.current.content = true
  }, [activeContent])

  const closeModal = useCallback(() => {
    if (activeContent) setDismissedId(activeContent._id)
    setActiveContent(null)
    setActiveMedia(null)
    if (typeof window !== 'undefined' && window.location.pathname !== sharePath) {
      window.history.pushState({}, '', sharePath)
    }
  }, [activeContent, sharePath])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state
      if (!state?.type) {
        setActiveMedia(null)
        setActiveContent(null)
        setActiveSpeech(null)
      } else if (state?.type === 'activeContent') {
        setActiveMedia(null)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // ── URL activeId handling ──────────────────────────────────────────────────
  useEffect(() => {
    let id = activeId
    if (!id && isClient) {
      const params = new URLSearchParams(window.location.search)
      id = params.get('id')
    }
    if (id && id === dismissedId) return
    if (!id || updates.length === 0) return

    const item = updates.find((u) => u.slug?.current === id || u._id === id || u._id.startsWith(id))
    if (item) {
      const imgSrc = item.image
        ? (typeof item.image === 'string' ? item.image : urlFor(item.image).width(800).url())
        : undefined
      const combinedImages = []
      if (item.image) combinedImages.push(item.image)
      if (item.images && Array.isArray(item.images)) combinedImages.push(...item.images)
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
  }, [updates, activeId, isClient, dismissedId])

  // ── Group updates by month ─────────────────────────────────────────────────
  const groups: Record<string, { label: string; year: number; month: number; items: UpdateItem[] }> = {}
  updates.forEach((item) => {
    const dateObj = new Date(item.date)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth()
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' })
    const key = `${year}-${String(month + 1).padStart(2, '0')}`
    if (!groups[key]) groups[key] = { label: `${monthName} ${year}`, year, month, items: [] }
    groups[key].items.push(item)
  })
  const sortedGroupKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a))
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(sortedGroupKeys[0] || null)
  const toggleGroup = (key: string) => setActiveGroupKey(activeGroupKey === key ? null : key)

  // ─── TAB BAR ────────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'speeches' as const, label: t('parliament.tab.speeches'), icon: <Mic2 className="w-4 h-4" /> },
    { id: 'questions' as const, label: t('parliament.tab.questions'), icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'updates' as const, label: t('parliament.tab.updates'), icon: <FileText className="w-4 h-4" /> },
  ]

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-8 relative pb-4 px-4 sm:px-0">
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">Legislative Activity</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-3">Parliamentary Activity</h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Speeches, questions raised, and legislative updates by Shri Bhashyam Rama Krishna in the Rajya Sabha.
          </p>
          <div className="w-24 h-1 bg-saffron-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* ── Tab Bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center mb-8 px-4 sm:px-0">
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-md border border-slate-200 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-navy-900 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === 'speeches' && (
            <motion.div
              key="speeches"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
            >
              <SpeechesTab
                speeches={speeches}
                tContent={tContent}
                language={language}
                onPlay={(s) => setActiveSpeech(s)}
              />
            </motion.div>
          )}

          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
            >
              <QuestionsTab
                questions={questions}
                tContent={tContent}
                language={language}
                expandedId={expandedQuestionId}
                setExpandedId={setExpandedQuestionId}
                questionIndex={questionIndex}
                setQuestionIndex={setQuestionIndex}
              />
            </motion.div>
          )}

          {activeTab === 'updates' && (
            <motion.div
              key="updates"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
            >
              <UpdatesTab
                updates={updates}
                tContent={tContent}
                groups={groups}
                sortedGroupKeys={sortedGroupKeys}
                activeGroupKey={activeGroupKey}
                toggleGroup={toggleGroup}
                onOpen={(item) => {
                  const imgSrc = item.image
                    ? (typeof item.image === 'string' ? item.image : urlFor(item.image).width(800).url())
                    : (item.images?.[0] ? (typeof item.images[0] === 'string' ? item.images[0] : urlFor(item.images[0]).width(800).url()) : undefined)
                  const combinedImages: any[] = []
                  if (item.image) combinedImages.push(item.image)
                  if (item.images && Array.isArray(item.images)) combinedImages.push(...item.images)
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
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Speech Player Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeSpeech && (
          <motion.div
            data-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSpeech(null)}
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
              <div className="w-full pt-3 pb-1 flex justify-center shrink-0 select-none">
                <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <Mic2 className="w-5 h-5 text-saffron-600" />
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-widest">Parliamentary Speech</span>
                </div>
                <button onClick={() => setActiveSpeech(null)} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer" aria-label="Close">
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-6 py-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(activeSpeech.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </span>
                  {activeSpeech.duration && (
                    <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <Clock className="w-3 h-3" /> {activeSpeech.duration}
                    </span>
                  )}
                  {activeSpeech.sessionInfo && (
                    <span className="text-xs font-bold text-navy-700 bg-navy-50 border border-navy-100 px-2.5 py-0.5 rounded-full">
                      {activeSpeech.sessionInfo}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-navy-900 leading-snug mb-3">{tContent(activeSpeech.title)}</h2>
                {activeSpeech.topic && (
                  <p className="text-xs font-bold text-saffron-600 uppercase tracking-wider mb-4">Topic: {activeSpeech.topic}</p>
                )}
                <p className="text-slate-600 text-sm leading-relaxed mb-5">{cleanExcerpt(tContent(activeSpeech.summary))}</p>
                {activeSpeech.speechUrl && (
                  <div className="border-t border-slate-100 pt-4">
                    <NativeMediaPlayer url={activeSpeech.speechUrl} title={tContent(activeSpeech.title)} />
                  </div>
                )}
                {activeSpeech.documentUrl && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewPdfUrl(activeSpeech.documentUrl || null)}
                      className="inline-flex items-center px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2 text-saffron-400" /> Preview Transcript
                    </button>
                    <a href={activeSpeech.documentUrl} download className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold border border-slate-200/60 transition-colors">
                      <Download className="w-3.5 h-3.5 mr-2" /> Download PDF
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Update Detail Modal ───────────────────────────────────────────────── */}
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
              onDragEnd={(event, info) => { if (info.offset.y > 120 || info.velocity.y > 600) closeModal() }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl border border-saffron-200 flex flex-col max-h-[92vh] overflow-hidden"
            >
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
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-widest">Parliamentary Update</span>
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
                  <span>{new Date(activeContent.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                </div>

                <h2 className="text-2xl font-black text-navy-900 leading-snug mb-4">
                  {ttsState !== 'idle'
                    ? titleTokens.map((tk, i) => (
                        <span key={i} className={currentCharIndex >= tk.start && currentCharIndex < tk.end ? 'bg-saffron-100 text-saffron-800 px-0.5 rounded transition-all' : ''}>
                          {tk.text}{' '}
                        </span>
                      ))
                    : activeContent.title}
                </h2>

                {activeContent.images && activeContent.images.length > 0 ? (
                  <div className="mb-6">
                    <MediaCarousel
                      images={activeContent.images}
                      title={activeContent.title}
                      onImageClick={(src, idx, allSrcs) => setActiveMedia({ src, title: activeContent.title, date: activeContent.date, allImages: allSrcs, currentIndex: idx })}
                    />
                  </div>
                ) : (
                  activeContent.imageSrc && (
                    <div
                      className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group/img cursor-zoom-in bg-white p-2 flex items-center justify-center"
                      onClick={() => setActiveMedia({ src: activeContent.imageSrc!, title: activeContent.title, date: activeContent.date, allImages: [activeContent.imageSrc!], currentIndex: 0 })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activeContent.imageSrc} alt={activeContent.title} className="w-full object-contain max-h-80 bg-white group-hover/img:brightness-95 transition-all duration-300" />
                    </div>
                  )
                )}

                {activeContent.excerpt && (
                  <div className="mb-5 pb-5">
                    <RichTextRenderer content={activeContent.excerpt} ttsState={ttsState} currentCharIndex={currentCharIndex} />
                  </div>
                )}

                {activeContent.documentUrl && (
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewPdfUrl(activeContent.documentUrl || null)}
                      className="inline-flex items-center px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4 mr-2 text-saffron-400" /> Preview Official Document
                    </button>
                    <a href={activeContent.documentUrl} download className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold border border-slate-200/60 transition-colors" onPointerDown={(e) => e.stopPropagation()}>
                      <Download className="w-3.5 h-3.5 mr-2 text-slate-600" /> Download PDF
                    </a>
                  </div>
                )}

                {activeContent.speechUrl && (
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <NativeMediaPlayer url={activeContent.speechUrl} title={activeContent.title} />
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 w-full">
                <div className={`grid ${isClient && ttsSupported ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5 w-full`}>
                  {isClient && ttsSupported && (
                    <button
                      type="button"
                      onClick={ttsState === 'playing' ? stop : speak}
                      className="flex items-center justify-center w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-navy-900 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {ttsState === 'playing'
                        ? <><VolumeX className="w-4 h-4 mr-2 text-rose-600 animate-pulse" /><span>{language === 'te' ? 'ఆపండి' : 'Stop'}</span></>
                        : <><Volume2 className="w-4.5 h-4.5 mr-2 text-saffron-600" /><span>{language === 'te' ? 'వినండి' : 'Listen'}</span></>}
                    </button>
                  )}

                  <div className="relative w-full">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowShareMenu(!showShareMenu) }}
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
                              target="_blank" rel="noopener noreferrer"
                              onClick={() => setShowShareMenu(false)}
                              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
                            >
                              <svg className="w-4 h-4 mr-3 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              WhatsApp
                            </a>
                            <button
                              onClick={async () => {
                                try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
                                setShowShareMenu(false)
                              }}
                              className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-left"
                            >
                              {copied ? <><Check className="w-4 h-4 mr-3 text-emerald-600" /><span className="text-emerald-600">Link Copied!</span></> : <><Copy className="w-4 h-4 mr-3 text-slate-500" />Copy Link</>}
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

      {/* ── Image Lightbox ────────────────────────────────────────────────────── */}
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
                <button onClick={() => setActiveMedia(null)} className="w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer" aria-label="Close"><X className="w-5 h-5" /></button>
              </div>
            </div>
            {activeMedia.allImages && activeMedia.allImages.length > 1 && (<button onClick={(e) => { e.stopPropagation(); const imgs = activeMedia.allImages!; const next = (lightboxIndex - 1 + imgs.length) % imgs.length; setLightboxIndex(next); setLightboxZoom(1); setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m) }} className="fixed left-3 top-1/2 -translate-y-1/2 z-[70] w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xl border border-white/10"><ChevronLeft className="w-6 h-6" /></button>)}
            {activeMedia.allImages && activeMedia.allImages.length > 1 && (<button onClick={(e) => { e.stopPropagation(); const imgs = activeMedia.allImages!; const next = (lightboxIndex + 1) % imgs.length; setLightboxIndex(next); setLightboxZoom(1); setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m) }} className="fixed right-3 top-1/2 -translate-y-1/2 z-[70] w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xl border border-white/10"><ChevronRight className="w-6 h-6" /></button>)}
            <motion.div
              drag={lightboxZoom > 1 ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => { if (lightboxZoom <= 1 && (Math.abs(info.offset.y) > 120 || Math.abs(info.velocity.y) > 600)) setActiveMedia(null) }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center w-full max-w-5xl min-h-0 select-none overflow-hidden relative"
              ref={lightboxContainerRef}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                ref={lightboxImageRef}
                src={activeMedia.src}
                alt={activeMedia.title}
                drag={lightboxZoom > 1}
                dragConstraints={getDragConstraints()}
                dragElastic={0.15}
                animate={{ scale: lightboxZoom, x: lightboxZoom > 1 ? undefined : 0, y: lightboxZoom > 1 ? undefined : 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onDoubleClick={() => setLightboxZoom(z => z > 1 ? 1 : 2.25)}
                style={{ cursor: lightboxZoom > 1 ? 'grab' : 'zoom-in', maxHeight: '75vh', transformOrigin: 'center center' }}
                className="max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </motion.div>
            <div className="mt-3 flex flex-col items-center gap-1 max-w-2xl" onClick={(e) => e.stopPropagation()}>
              {activeMedia.allImages && activeMedia.allImages.length > 1 && (<span className="text-white/50 text-[11px] font-bold">{lightboxIndex + 1} / {activeMedia.allImages.length}</span>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview */}
      <PdfPreviewModal
        isOpen={!!previewPdfUrl}
        onClose={() => setPreviewPdfUrl(null)}
        documentUrl={previewPdfUrl || ''}
        title={activeContent?.title || activeSpeech?.title || 'Document Preview'}
      />
    </div>
  )
}

// ─── Speeches Tab ─────────────────────────────────────────────────────────────

function SpeechesTab({ speeches, tContent, language, onPlay }: {
  speeches: SpeechItem[]
  tContent: (val: any, fallback?: string) => string
  language: string
  onPlay: (s: SpeechItem) => void
}) {
  if (speeches.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm mx-4 sm:mx-0">
        <Mic2 className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-semibold">No speeches added yet. Check back soon.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-0">
      {speeches.map((speech) => {
        const ytId = getYouTubeId(speech.speechUrl)
        const thumbnailUrl = ytId
          ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
          : null
        const title = tContent(speech.title)
        const summary = tContent(speech.summary)

        return (
          <motion.div
            key={speech._id}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group bg-white border border-slate-200 hover:border-saffron-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
            onClick={() => onPlay(speech)}
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-navy-900 overflow-hidden">
              {thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
                  <Mic2 className="w-10 h-10 text-saffron-400 opacity-60" />
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                  <Play className="w-6 h-6 text-navy-900 ml-1" />
                </div>
              </div>
              {/* Duration badge */}
              {speech.duration && (
                <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {speech.duration}
                </span>
              )}
              {/* YouTube badge */}
              {ytId && (
                <span className="absolute top-2.5 left-2.5 bg-[#FF0000] text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                  <Calendar className="w-3 h-3" />
                  {new Date(speech.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </span>
                {speech.sessionInfo && (
                  <span className="text-[10px] font-bold text-navy-700 bg-slate-100 px-2 py-0.5 rounded-full">{speech.sessionInfo}</span>
                )}
              </div>

              <h3 className="text-sm font-bold text-navy-900 group-hover:text-saffron-700 transition-colors leading-snug mb-2 line-clamp-2">{title}</h3>

              {speech.topic && (
                <p className="text-[11px] font-bold text-saffron-600 uppercase tracking-wide mb-2">{speech.topic}</p>
              )}

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-auto">{cleanExcerpt(summary)}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-saffron-600">
                  <Play className="w-3.5 h-3.5" /> Watch Speech
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-saffron-500 transition-colors" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Questions Tab ────────────────────────────────────────────────────────────

function QuestionsTab({ questions, tContent, language, expandedId, setExpandedId, questionIndex, setQuestionIndex }: {
  questions: QuestionItem[]
  tContent: (val: any, fallback?: string) => string
  language: string
  expandedId: string | null
  setExpandedId: (id: string | null) => void
  questionIndex: number
  setQuestionIndex: (i: number) => void
}) {
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null)
  const QUESTIONS_PER_PAGE = 10
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
  const paged = questions.slice(questionIndex * QUESTIONS_PER_PAGE, (questionIndex + 1) * QUESTIONS_PER_PAGE)

  if (questions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm mx-4 sm:mx-0">
        <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-sm font-semibold">No questions added yet. Check back after the next session.</p>
      </div>
    )
  }

  return (
    <>
      {/* Navigation header */}
      <div className="flex items-center justify-between mb-5 px-4 sm:px-0">
        <div>
          <h2 className="text-lg font-black text-navy-900">Questions Raised in Rajya Sabha</h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">{questions.length} questions on record</p>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuestionIndex(Math.max(0, questionIndex - 1))}
              disabled={questionIndex === 0}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-500">{questionIndex + 1} / {totalPages}</span>
            <button
              onClick={() => setQuestionIndex(Math.min(totalPages - 1, questionIndex + 1))}
              disabled={questionIndex >= totalPages - 1}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Question cards */}
      <div className="space-y-3 px-4 sm:px-0">
        {paged.map((q, idx) => {
          const isOpen = expandedId === q._id
          const title = tContent(q.title)
          const summary = tContent(q.summary)
          const answer = q.officialAnswer ? tContent(q.officialAnswer) : null
          const catConfig = q.category ? CATEGORY_CONFIG[q.category] : null
          const globalIdx = questionIndex * QUESTIONS_PER_PAGE + idx + 1

          return (
            <motion.div
              key={q._id}
              layout
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-200 ${isOpen ? 'border-saffron-300 shadow-md' : 'border-slate-200 hover:border-saffron-200 hover:shadow-md'}`}
            >
              {/* Accent bar when open */}
              {isOpen && <div className="h-1 bg-gradient-to-r from-saffron-400 to-saffron-600 w-full" />}

              {/* Header row */}
              <button
                onClick={() => setExpandedId(isOpen ? null : q._id)}
                className="w-full text-left p-4 sm:p-5 focus:outline-none cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Number badge */}
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 mt-0.5">
                    {globalIdx}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {q.questionNumber && (
                        <span className="text-[10px] font-black text-saffron-700 uppercase tracking-widest">{q.questionNumber}</span>
                      )}
                      {catConfig && (
                        <span className={`text-[10px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full ${catConfig.color} ${catConfig.bg}`}>
                          {catConfig.label}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                        <Calendar className="w-3 h-3" />
                        {new Date(q.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <h3 className={`font-bold text-navy-900 leading-snug transition-colors text-sm ${isOpen ? 'text-saffron-700' : 'group-hover:text-saffron-700'}`}>
                      {title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      {q.sessionInfo && (
                        <span className="flex items-center gap-1 text-[10px] text-navy-600 font-bold">
                          <Building2 className="w-3 h-3" /> {q.sessionInfo}
                        </span>
                      )}
                      {q.ministry && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                          <FileText className="w-3 h-3" /> {q.ministry}
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 mt-0.5"
                  >
                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-saffron-600' : 'text-slate-400'}`} />
                  </motion.div>
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-slate-100">
                      {/* Question text */}
                      <div className="mt-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <HelpCircle className="w-4 h-4 text-saffron-600 shrink-0" />
                          <span className="text-xs font-black text-saffron-600 uppercase tracking-wider">Question</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{cleanExcerpt(summary)}</p>
                      </div>

                      {/* Official answer */}
                      {answer && (
                        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Official Response</span>
                          </div>
                          <p className="text-sm text-emerald-900 leading-relaxed">{cleanExcerpt(answer)}</p>
                        </div>
                      )}

                      {/* Document */}
                      {q.documentUrl && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setPreviewPdfUrl(q.documentUrl || null)}
                            className="inline-flex items-center px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold shadow-sm cursor-pointer hover:bg-navy-800 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 mr-2 text-saffron-400" /> View Document
                          </button>
                          <a href={q.documentUrl} download className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold border border-slate-200 transition-colors">
                            <Download className="w-3.5 h-3.5 mr-2" /> Download PDF
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => { setQuestionIndex(Math.max(0, questionIndex - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={questionIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-sm font-bold text-slate-500 px-2">Page {questionIndex + 1} of {totalPages}</span>
          <button
            onClick={() => { setQuestionIndex(Math.min(totalPages - 1, questionIndex + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            disabled={questionIndex >= totalPages - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <PdfPreviewModal
        isOpen={!!previewPdfUrl}
        onClose={() => setPreviewPdfUrl(null)}
        documentUrl={previewPdfUrl || ''}
        title="Parliamentary Document"
      />
    </>
  )
}

// ─── Updates Tab ──────────────────────────────────────────────────────────────

function UpdatesTab({ updates, tContent, groups, sortedGroupKeys, activeGroupKey, toggleGroup, onOpen }: {
  updates: UpdateItem[]
  tContent: (val: any, fallback?: string) => string
  groups: Record<string, { label: string; year: number; month: number; items: UpdateItem[] }>
  sortedGroupKeys: string[]
  activeGroupKey: string | null
  toggleGroup: (key: string) => void
  onOpen: (item: UpdateItem) => void
}) {
  if (sortedGroupKeys.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm mx-4 sm:mx-0">
        <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-sm">No parliamentary updates logged.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedGroupKeys.map((key) => {
        const group = groups[key]
        const isOpen = activeGroupKey === key
        return (
          <div
            key={key}
            className="bg-white border-y sm:border-2 border-slate-200 sm:rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-saffron-300 relative"
          >
            {isOpen && <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-500" />}
            <button
              onClick={() => toggleGroup(key)}
              className={`w-full p-4 sm:p-5 text-left flex items-center justify-between focus:outline-none transition-colors ${isOpen ? 'bg-saffron-50/20' : ''}`}
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
                          : (item.images?.[0] ? (typeof item.images[0] === 'string' ? item.images[0] : urlFor(item.images[0]).width(800).url()) : undefined)

                        return (
                          <div
                            key={item._id}
                            className="group flex flex-col cursor-pointer bg-white hover:bg-saffron-50/10 border border-slate-100 hover:border-saffron-200 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md justify-between"
                            onClick={() => onOpen(item)}
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
                              <h4 className="text-base font-bold text-navy-900 group-hover:text-saffron-600 transition-colors leading-snug mb-2 line-clamp-2">{utitle}</h4>
                              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">{cleanExcerpt(usummary)}</p>
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
  )
}
