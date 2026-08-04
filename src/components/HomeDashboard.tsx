'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  LifeBuoy,
  ArrowRight,
  TrendingUp,
  Award,
  Video,
  Calendar,
  Layers,
  Sparkles,
  X,
  ExternalLink,
  Download,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Share2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Code,
  Eye,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { useLanguage } from '@/components/LanguageContext'
import AnimatedHeaderBanner from '@/components/AnimatedHeaderBanner'
import { getRoleTitle } from '@/lib/roleHelper'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import MediaCarousel from '@/components/MediaCarousel'
import NativeMediaPlayer from '@/components/NativeMediaPlayer'
import RichTextRenderer from '@/components/RichTextRenderer'
import PdfPreviewModal from '@/components/PdfPreviewModal'
import { cleanExcerpt } from '@/lib/cleanExcerpt'

interface UpdateItem {
  _id: string
  title: any
  date: string
  summary: any
  speechUrl?: string
  documentUrl?: string
  image?: any
  images?: any[]
}

interface NewsItem {
  _id: string
  title: any
  publishedAt: string
  excerpt?: any
  body?: any[]
  image?: any
  images?: any[]
  speechUrl?: string
}

interface GalleryItem {
  _id: string
  title: any
  caption?: any
  date: string
  image: any
}

interface ActiveMedia {
  src: string
  title: string
  caption?: string
  date?: string
  allImages?: string[]   // full list for arrow navigation
  currentIndex?: number  // position of `src` in allImages
}

interface DailyUpdateItem {
  _id: string
  title: any
  date: string
  summary: any
  body?: any[]
  image?: any
  images?: any[]
  speechUrl?: string
}

interface ActiveContent {
  _id: string
  type: 'update' | 'news' | 'daily'
  title: string
  date: string
  excerpt?: string
  body?: any[]
  imageSrc?: string
  speechUrl?: string
  documentUrl?: string
  images?: any[]
}

interface HomeDashboardProps {
  dailyUpdates: DailyUpdateItem[]
  updates: UpdateItem[]
  news: NewsItem[]
  gallery: GalleryItem[]
  settings: {
    candidateName: any
    roleBadge?: any
    tagline?: any
    partyName?: any
    stateRepresented?: any
    socialLinks?: {
      instagram?: string
      youtube?: string
      twitter?: string
    }
    introVideoUrl?: string
    introVideoTitle?: any
    showIntroVideo?: boolean
    customEmbedCode?: string
    showCustomEmbed?: boolean
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
}

/** Render Sanity Portable Text blocks as readable text paragraphs */
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

/** Download an image by fetching it as a blob (works cross-origin) */
async function downloadImage(src: string, filename: string) {
  try {
    const response = await fetch(src)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'image.jpg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch {
    // Fallback: open in new tab so user can save manually
    window.open(src, '_blank')
  }
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

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const pathname = parsed.pathname

    if (parsed.hostname === 'youtu.be') {
      const videoId = pathname.slice(1).split(/[?#]/)[0]
      if (videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
      }
    }

    if (pathname.includes('/live/') || pathname.includes('/shorts/') || pathname.includes('/embed/') || pathname.includes('/v/')) {
      const parts = pathname.split('/')
      const keywordIdx = parts.findIndex(p => p === 'live' || p === 'shorts' || p === 'embed' || p === 'v')
      if (keywordIdx !== -1 && keywordIdx + 1 < parts.length) {
        const videoId = parts[keywordIdx + 1].split(/[?#]/)[0]
        if (videoId.length === 11) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
        }
      }
    }

    const searchParams = parsed.searchParams
    const videoId = searchParams.get('v')
    if (videoId && videoId.length === 11) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
    }
  } catch (e) {
    // Fallback to regex
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/|shorts\/)([^#\&\?]*).*/
  const match = url.match(regExp)
  const videoId = (match && match[2].length === 11) ? match[2] : null
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
}

export default function HomeDashboard({ dailyUpdates, updates, news, gallery, settings }: HomeDashboardProps) {
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null)
  const [lightboxZoom, setLightboxZoom] = useState(1)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null)
  const [dismissedId, setDismissedId] = useState<string | null>(null)
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null)
  const { t, tContent, language } = useLanguage()
  const dragControls = useDragControls()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const readableText = activeContent
    ? `${activeContent.title}. ${activeContent.excerpt ? activeContent.excerpt + '. ' : ''}${activeContent.body ? renderBody(activeContent.body).join(' ') : ''}`
    : ''
  const { speak, pause, stop, state: ttsState, supported: ttsSupported, currentCharIndex } = useTextToSpeech(readableText, language)

  // Tokenize elements for interactive word highlighting
  const titleTokens = activeContent ? tokenizeText(activeContent.title, 0) : []
  const excerptOffset = activeContent ? activeContent.title.length + 2 : 0
  const excerptTokens = activeContent && activeContent.excerpt ? tokenizeText(activeContent.excerpt, excerptOffset) : []
  const bodyBaseOffset = excerptOffset + (activeContent && activeContent.excerpt ? activeContent.excerpt.length + 2 : 0)
  const paragraphs = activeContent?.body ? renderBody(activeContent.body) : []

  let currentOffset = bodyBaseOffset
  const tokenizedParagraphs = paragraphs.map((paraText) => {
    const tokens = tokenizeText(paraText, currentOffset)
    currentOffset += paraText.length + 1
    return tokens
  })

  const sharePath = activeContent?.type === 'daily'
    ? '/daily-updates'
    : activeContent?.type === 'update'
      ? '/parliamentary-updates'
      : '/press-releases'
  const shareUrl = activeContent ? `${isClient ? window.location.origin : ''}${sharePath}?id=${activeContent._id.slice(0, 8)}` : ''
  const siteUrl = isClient ? window.location.origin : ''
  const twitterUrl = 'https://x.com/bhashyambrk'
  const instagramUrl = 'https://www.instagram.com/ramakrishnabhashyam/'

  const rawBodyText = activeContent && activeContent.body ? renderBody(activeContent.body).join(' ') : ''
  const rawExcerptText = activeContent ? (activeContent.excerpt || rawBodyText || '') : ''
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

  useEffect(() => {
    if (!activeContent) {
      stop()
    }
  }, [activeContent, stop])

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
      const params = new URLSearchParams(window.location.search)
      params.set('id', activeContent._id.slice(0, 8))
      window.history.pushState({ type: 'activeContent' }, '', `${window.location.pathname}?${params.toString()}`)
      historyPushedRef.current.content = true
    } else if (!hasContent && historyPushedRef.current.content) {
      historyPushedRef.current.content = false
      const params = new URLSearchParams(window.location.search)
      if (params.has('id')) {
        params.delete('id')
        const searchStr = params.toString()
        const newUrl = `${window.location.pathname}${searchStr ? '?' + searchStr : ''}`
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [activeMedia, activeContent])

  const closeModal = useCallback(() => {
    if (activeContent) {
      setDismissedId(activeContent._id)
    }
    setActiveContent(null)
    setActiveMedia(null)
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search)
      params.delete('id')
      const searchStr = params.toString()
      const newUrl = `${window.location.pathname}${searchStr ? '?' + searchStr : ''}`
      window.history.pushState({}, '', newUrl)
    }
  }, [activeContent])

  // Reset zoom when lightbox opens/changes image
  useEffect(() => {
    if (activeMedia) {
      setLightboxZoom(1)
      setLightboxIndex(activeMedia.currentIndex ?? 0)
    }
  }, [activeMedia])

  // ESC to close lightbox + arrow keys to navigate
  useEffect(() => {
    if (!activeMedia) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMedia(null)
      } else if (e.key === 'ArrowRight') {
        const imgs = activeMedia.allImages
        if (imgs && imgs.length > 1) {
          setLightboxIndex(prev => {
            const next = (prev + 1) % imgs.length
            setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m)
            return next
          })
        }
      } else if (e.key === 'ArrowLeft') {
        const imgs = activeMedia.allImages
        if (imgs && imgs.length > 1) {
          setLightboxIndex(prev => {
            const next = (prev - 1 + imgs.length) % imgs.length
            setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m)
            return next
          })
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeMedia])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      if (dismissedId && (dismissedId === id || dismissedId.startsWith(id) || id.startsWith(dismissedId))) {
        return
      }
      // Look in dailyUpdates first
      const dailyItem = dailyUpdates?.find((d) => d._id === id || d._id.startsWith(id))
      if (dailyItem) {
        const combinedImages = []
        if (dailyItem.image) {
          combinedImages.push(dailyItem.image)
        }
        if (dailyItem.images && Array.isArray(dailyItem.images)) {
          combinedImages.push(...dailyItem.images)
        }

        setActiveContent({
          _id: dailyItem._id,
          type: 'daily',
          title: tContent(dailyItem.title),
          date: dailyItem.date,
          excerpt: tContent(dailyItem.summary),
          speechUrl: dailyItem.speechUrl,
          images: combinedImages,
          imageSrc: dailyItem.image ? (typeof dailyItem.image === 'string' ? dailyItem.image : urlFor(dailyItem.image).width(800).url()) : undefined,
        })
        return
      }

      // Look in updates next
      const updateItem = updates?.find((u) => u._id === id || u._id.startsWith(id))
      if (updateItem) {
        const combinedImages = []
        if (updateItem.image) {
          combinedImages.push(updateItem.image)
        }
        if (updateItem.images && Array.isArray(updateItem.images)) {
          combinedImages.push(...updateItem.images)
        }

        setActiveContent({
          _id: updateItem._id,
          type: 'update',
          title: tContent(updateItem.title),
          date: updateItem.date,
          excerpt: tContent(updateItem.summary),
          speechUrl: updateItem.speechUrl,
          documentUrl: updateItem.documentUrl,
          images: combinedImages,
          imageSrc: updateItem.image ? (typeof updateItem.image === 'string' ? updateItem.image : urlFor(updateItem.image).width(800).url()) : undefined,
        })
        return
      }

      // Look in news/releases next
      const newsItem = news?.find((n) => n._id === id || n._id.startsWith(id))
      if (newsItem) {
        const ntitle = tContent(newsItem.title)
        const nexcerpt = tContent(newsItem.excerpt)
        const imgSrc = newsItem.image
          ? (typeof newsItem.image === 'string' ? newsItem.image : urlFor(newsItem.image).width(800).url())
          : undefined

        const combinedImages = []
        if (newsItem.image) {
          combinedImages.push(newsItem.image)
        }
        if (newsItem.images && Array.isArray(newsItem.images)) {
          combinedImages.push(...newsItem.images)
        }

        setActiveContent({
          _id: newsItem._id,
          type: 'news',
          title: ntitle,
          date: newsItem.publishedAt,
          excerpt: nexcerpt,
          body: newsItem.body,
          imageSrc: imgSrc,
          speechUrl: newsItem.speechUrl,
          images: combinedImages,
        })
      }
    }
  }, [dailyUpdates, updates, news, dismissedId])

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

  // Localized values
  const candidateName = tContent(settings.candidateName, 'Bhashyam Rama Krishna')
  const roleBadge = getRoleTitle(useLanguage().language)
  const tagline = tContent(settings.tagline, 'A Visionary Educationist | A Committed Public Leader | A Voice for AP')
  const stateRepresented = tContent(settings.stateRepresented, 'Andhra Pradesh')
  const introVideoTitle = tContent(settings.introVideoTitle, 'Featured Video')

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Full-width Animated Header Banner */}
      <AnimatedHeaderBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Page Heading */}
        <div className="mb-6 sm:mb-8 text-center md:text-left relative pb-4 border-b border-slate-200">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-24 bg-saffron-500 rounded-full md:left-0 md:translate-x-0"></div>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-saffron-100 text-saffron-600 mb-3 uppercase tracking-wider border border-saffron-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {roleBadge}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy-900 tracking-tight leading-tight">
            {candidateName}
          </h1>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl font-medium">
            {tagline}
          </p>
        </div>

        {/* Custom HTML Embed Block (Dynamic sanity field & toggle) */}
        {isClient && settings.showCustomEmbed && settings.customEmbedCode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-8 overflow-hidden rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-md hover:border-saffron-300 transition-all duration-300 relative group"
          >
            <div className="flex items-center space-x-2.5 text-navy-900 font-extrabold text-xs uppercase tracking-widest mb-4">
              <Code className="w-4 h-4 text-saffron-600 animate-pulse" />
              <span>Custom Embed Block</span>
            </div>
            <div
              className="w-full overflow-hidden rounded-2xl"
              dangerouslySetInnerHTML={{ __html: settings.customEmbedCode }}
            />
          </motion.div>
        )}

        {/* Intro Video Player (Dynamic sanity field & toggle) */}
        {settings.showIntroVideo && settings.introVideoUrl && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-8 overflow-hidden rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-md hover:border-saffron-300 transition-all duration-300 relative group"
          >
            <div className="flex items-center space-x-2.5 text-navy-900 font-extrabold text-xs uppercase tracking-widest mb-4">
              <Video className="w-4 h-4 text-saffron-600 animate-pulse" />
              <span>{introVideoTitle}</span>
            </div>
            {getYouTubeEmbedUrl(settings.introVideoUrl) ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-inner bg-slate-900 border border-slate-100">
                <iframe
                  src={getYouTubeEmbedUrl(settings.introVideoUrl)!}
                  title={introVideoTitle}
                  className="absolute top-0 left-0 w-full h-full border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-2xl flex flex-col items-center justify-center bg-slate-100 border border-dashed border-slate-200 text-slate-500 p-4">
                <Video className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium">Invalid or empty YouTube URL provided</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* 1. Profile / Hero Bento Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-300 via-saffron-300 to-saffron-400 text-navy-950 pt-6 px-0 pb-0 sm:p-8 relative shadow-lg border-2 border-saffron-400 min-h-[380px] flex flex-col justify-between"
          >
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12 text-navy-900">
              <Layers className="w-96 h-96" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
              <div className="lg:col-span-7 flex flex-col justify-between h-full px-6 sm:px-0">
                <div>
                  <div className="flex items-center space-x-2.5 text-navy-900 font-extrabold text-xs uppercase tracking-widest mb-4">
                    <Award className="w-4 h-4 text-navy-900" />
                    <span>{t('home.profileIntro')}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 leading-snug text-navy-950">
                    {t('home.introCommitment')}
                  </h2>
                  <p className="text-slate-800 text-sm leading-relaxed mb-6 font-medium">
                    {candidateName} is a respected educationist, Founder Chairman of Bhashyam Educational Institutions, and public service leader from {stateRepresented}. With decades of contribution to the education sector, he has helped shape the academic future of thousands of students.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-navy-950/15 pt-6">
                  <div>
                    <span className="block text-2xl md:text-3xl font-black text-navy-950">98%</span>
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-700 font-bold">{t('stats.attendance')}</span>
                  </div>
                  <div>
                    <span className="block text-2xl md:text-3xl font-black text-navy-950">120+</span>
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-700 font-bold">{t('stats.debates')}</span>
                  </div>
                  <div>
                    <span className="block text-2xl md:text-3xl font-black text-navy-950">250+</span>
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-700 font-bold">{t('stats.questions')}</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 h-[360px] sm:h-[420px] lg:h-auto min-h-[240px] relative overflow-hidden border-t sm:border border-navy-950/10 sm:rounded-2xl sm:shadow-md self-stretch shrink-0 bg-[#FFE600]">
                <img
                  src="/images/brk.png"
                  alt={`${candidateName} - Founder Chairman of Bhashyam Educational Institutions and Member of Parliament (Rajya Sabha)`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  fetchPriority="high"
                  width={360}
                  height={420}
                />
              </div>
            </div>
          </motion.div>

          {/* 2. Grievance Portal CTA */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-md flex flex-col justify-between min-h-[360px] hover:border-saffron-300 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-saffron-500"></div>
            <div>
              <div className="w-12 h-12 bg-saffron-50 rounded-2xl flex items-center justify-center mb-6 border border-saffron-100">
                <LifeBuoy className="w-6 h-6 text-saffron-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">{t('grievance.title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {t('grievance.subtitle')}
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/grievance"
                className="flex items-center justify-between w-full px-5 py-3.5 bg-saffron-400 text-navy-950 rounded-2xl font-bold text-sm hover:bg-saffron-500 shadow-md transition-all group-hover:shadow-lg"
              >
                <span>{t('grievance.submitTab')}</span>
                <ArrowRight className="w-4 h-4 text-navy-950 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/grievance?tab=track"
                className="flex items-center justify-center w-full px-5 py-3.5 bg-slate-50 text-navy-900 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                {t('grievance.trackTab')}
              </Link>
            </div>
          </motion.div>

          {/* 3. Daily Updates Card */}
          <motion.div
            variants={itemVariants}
            id="daily"
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-4 sm:p-8 shadow-md hover:border-saffron-200/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-5 h-5 text-saffron-600" />
                <h3 className="text-lg font-bold text-navy-900">{t('section.dailyUpdates')}</h3>
              </div>
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latest Updates</span>
                <Link
                  href="/daily-updates"
                  className="text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {dailyUpdates && dailyUpdates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {dailyUpdates.slice(0, 9).map((item) => {
                    const utitle = tContent(item.title)
                    const usummary = tContent(item.summary)
                    return (
                      <div
                        key={item._id}
                        onClick={() => {
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
                            type: 'daily',
                            title: utitle,
                            date: item.date,
                            excerpt: usummary,
                            speechUrl: item.speechUrl,
                            images: combinedImages,
                            imageSrc: imgSrc,
                          })
                        }}
                        className="group cursor-pointer rounded-2xl border border-slate-100 hover:border-saffron-200 bg-slate-50 hover:bg-saffron-50/30 p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between"
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
                          <h4 className="text-base font-bold text-navy-900 mb-2 group-hover:text-saffron-700 transition-colors line-clamp-2">
                            {utitle}
                          </h4>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                            {cleanExcerpt(usummary)}
                          </p>
                        </div>

                        {item.speechUrl && (
                          <div className="mt-auto pt-3 border-t border-slate-200/50 flex flex-col gap-1.5">
                            <span className="inline-flex items-center text-[11px] font-bold text-saffron-600">
                              <Video className="w-3 h-3 mr-1" /> Speech available
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {dailyUpdates.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Link
                      href="/daily-updates"
                      className="inline-flex items-center px-6 py-3 bg-saffron-400 hover:bg-saffron-500 text-navy-950 text-sm font-bold rounded-xl shadow-md transition-colors space-x-2"
                    >
                      <span>View All Updates</span>
                      <ChevronRight className="w-4 h-4 text-navy-950" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">No updates logged yet.</p>
            )}
          </motion.div>

          {/* 4. Press Releases Card */}
          <motion.div
            variants={itemVariants}
            id="news"
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-4 sm:p-8 shadow-md hover:border-saffron-200/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-saffron-600" />
                <h3 className="text-lg font-bold text-navy-900">{t('section.news')}</h3>
              </div>
              <Link
                href="/press-releases"
                className="text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-colors flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {news && news.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {news.slice(0, 9).map((item) => {
                    const ntitle = tContent(item.title)
                    const nexcerpt = tContent(item.excerpt)
                    const imgSrc = item.image
                      ? (typeof item.image === 'string' ? item.image : urlFor(item.image).width(800).url())
                      : undefined

                    return (
                      <div
                        key={item._id}
                        className="group flex flex-col cursor-pointer bg-slate-50 hover:bg-saffron-50/20 border border-slate-100 hover:border-saffron-200 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md"
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
                            type: 'news',
                            title: ntitle,
                            date: item.publishedAt,
                            excerpt: nexcerpt,
                            body: item.body,
                            imageSrc: imgSrc,
                            speechUrl: item.speechUrl,
                            images: combinedImages,
                          })
                        }}
                      >
                        {item.image && (
                          <div className="mb-4 rounded-xl overflow-hidden h-48 relative bg-white border border-slate-200 p-1.5 shadow-sm shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgSrc}
                              alt={ntitle}
                              className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300 ease-out"
                            />
                          </div>
                        )}
                        <span className="block text-xs text-slate-500 font-semibold mb-2">
                          {new Date(item.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                        <h4 className="text-base font-bold text-navy-900 group-hover:text-saffron-600 transition-colors leading-snug mb-2 line-clamp-2">
                          {ntitle}
                        </h4>
                        {nexcerpt && (
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4 flex-grow">
                            {cleanExcerpt(nexcerpt)}
                          </p>
                        )}
                        <span className="inline-flex items-center text-xs font-bold text-saffron-600 group-hover:text-saffron-700 transition-colors mt-auto pt-2">
                          <BookOpen className="w-3.5 h-3.5 mr-1" /> Read full article <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                    )
                  })}
                </div>
                {news.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Link
                      href="/press-releases"
                      className="inline-flex items-center px-6 py-3 bg-saffron-400 hover:bg-saffron-500 text-navy-950 text-sm font-bold rounded-xl shadow-md transition-colors space-x-2"
                    >
                      <span>View All Releases</span>
                      <ChevronRight className="w-4 h-4 text-navy-950" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">No press releases published yet.</p>
            )}
          </motion.div>

          {/* 5. Parliamentary Updates Card */}
          <motion.div
            variants={itemVariants}
            id="updates"
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-4 sm:p-8 shadow-md hover:border-saffron-200/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <TrendingUp className="w-5 h-5 text-saffron-600" />
                <h3 className="text-lg font-bold text-navy-900">{t('section.updates')}</h3>
              </div>
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline text-[10px] text-slate-400 font-bold uppercase tracking-wider">Latest Session</span>
                <Link
                  href="/parliamentary-updates"
                  className="text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {updates && updates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {updates.slice(0, 9).map((update) => {
                    const utitle = tContent(update.title)
                    const usummary = tContent(update.summary)
                    return (
                      <div
                        key={update._id}
                        onClick={() => {
                          const imgSrc = update.image
                            ? (typeof update.image === 'string' ? update.image : urlFor(update.image).width(800).url())
                            : undefined
                          const combinedImages = []
                          if (update.image) {
                            combinedImages.push(update.image)
                          }
                          if (update.images && Array.isArray(update.images)) {
                            combinedImages.push(...update.images)
                          }

                          setActiveContent({
                            _id: update._id,
                            type: 'update',
                            title: utitle,
                            date: update.date,
                            excerpt: usummary,
                            speechUrl: update.speechUrl,
                            documentUrl: update.documentUrl,
                            images: combinedImages,
                            imageSrc: imgSrc,
                          })
                        }}
                        className="group cursor-pointer rounded-2xl border border-slate-100 hover:border-saffron-200 bg-slate-50 hover:bg-saffron-50/30 p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(update.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                            </div>
                            <span className="text-[10px] text-saffron-600 font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              Read more <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-navy-900 mb-2 group-hover:text-saffron-700 transition-colors line-clamp-2">
                            {utitle}
                          </h4>
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                            {cleanExcerpt(usummary)}
                          </p>
                        </div>

                        {(update.speechUrl || update.documentUrl) && (
                          <div className="mt-auto pt-3 border-t border-slate-200/50 flex flex-col gap-1.5">
                            {update.speechUrl && (
                              <span className="inline-flex items-center text-[11px] font-bold text-saffron-600">
                                <Video className="w-3 h-3 mr-1" /> Speech available
                              </span>
                            )}
                            {update.documentUrl && (
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
                {updates.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Link
                      href="/parliamentary-updates"
                      className="inline-flex items-center px-6 py-3 bg-saffron-400 hover:bg-saffron-500 text-navy-950 text-sm font-bold rounded-xl shadow-md transition-colors space-x-2"
                    >
                      <span>View All Updates</span>
                      <ChevronRight className="w-4 h-4 text-navy-950" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">No updates logged yet.</p>
            )}
          </motion.div>

          {/* Gallery section temporarily hidden — uncomment to restore
          <motion.div variants={itemVariants} id="gallery" className="md:col-span-3 ...">
          </motion.div>
          */}
        </motion.div>

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
            {/* Top bar: title + zoom controls + download + close */}
            <div
              className="w-full max-w-5xl flex items-center justify-between mb-3 px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-white/70 text-xs font-semibold truncate max-w-xs">{activeMedia.title}</span>
              <div className="flex items-center gap-2">
                {/* Zoom controls */}
                <div className="flex items-center gap-1 bg-white/10 rounded-xl px-1 py-0.5">
                  <button
                    onClick={() => setLightboxZoom(z => Math.max(0.5, parseFloat((z - 0.25).toFixed(2))))}
                    className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                    title="Zoom out"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLightboxZoom(1)}
                    className="text-white/80 text-[11px] font-bold min-w-[36px] text-center hover:text-white transition-colors cursor-pointer"
                    title="Reset zoom"
                    aria-label="Reset zoom"
                  >
                    {Math.round(lightboxZoom * 100)}%
                  </button>
                  <button
                    onClick={() => setLightboxZoom(z => Math.min(4, parseFloat((z + 0.25).toFixed(2))))}
                    className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                    title="Zoom in"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => downloadImage(activeMedia.src, `${activeMedia.title.replace(/\s+/g, '-')}.jpg`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-navy-900 text-xs font-bold transition-colors shadow-lg cursor-pointer"
                  aria-label="Download image"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setActiveMedia(null)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close (Esc)"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Left arrow */}
            {activeMedia.allImages && activeMedia.allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const imgs = activeMedia.allImages!
                  const next = (lightboxIndex - 1 + imgs.length) % imgs.length
                  setLightboxIndex(next)
                  setLightboxZoom(1)
                  setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m)
                }}
                className="fixed left-3 top-1/2 -translate-y-1/2 z-[70] w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xl border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right arrow */}
            {activeMedia.allImages && activeMedia.allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const imgs = activeMedia.allImages!
                  const next = (lightboxIndex + 1) % imgs.length
                  setLightboxIndex(next)
                  setLightboxZoom(1)
                  setActiveMedia(m => m ? { ...m, src: imgs[next], currentIndex: next } : m)
                }}
                className="fixed right-3 top-1/2 -translate-y-1/2 z-[70] w-11 h-11 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xl border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Full image with zoom */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={(event, info) => {
                if (lightboxZoom <= 1 && (Math.abs(info.offset.y) > 120 || Math.abs(info.velocity.y) > 600)) {
                  setActiveMedia(null)
                }
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center w-full max-w-5xl min-h-0 select-none touch-none overflow-auto"
              style={{ cursor: lightboxZoom > 1 ? 'grab' : 'zoom-in' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeMedia.src}
                alt={activeMedia.title}
                onDoubleClick={() => setLightboxZoom(1)}
                style={{
                  transform: `scale(${lightboxZoom})`,
                  transition: 'transform 0.2s ease',
                  transformOrigin: 'center center',
                  maxHeight: lightboxZoom <= 1 ? '75vh' : undefined,
                }}
                className="max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </motion.div>

            {/* Caption / date below image + image counter */}
            <div
              className="mt-3 flex flex-col items-center gap-1 max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {activeMedia.allImages && activeMedia.allImages.length > 1 && (
                <span className="text-white/50 text-[11px] font-bold">
                  {lightboxIndex + 1} / {activeMedia.allImages.length}
                </span>
              )}
              {(activeMedia.caption || activeMedia.date) && (
                <div className="text-center">
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
            </div>
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

              {/* Modal Header */}
              <div
                className="flex items-center justify-between px-6 pb-4 border-b border-slate-100 shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex items-center space-x-2.5 pointer-events-none">
                  {activeContent.type === 'daily' ? (
                    <Calendar className="w-5 h-5 text-saffron-600" />
                  ) : activeContent.type === 'update' ? (
                    <TrendingUp className="w-5 h-5 text-saffron-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-saffron-600" />
                  )}
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-widest">
                    {activeContent.type === 'daily' ? 'Daily Update' : activeContent.type === 'update' ? 'Parliamentary Update' : 'Press Release'}
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

              {/* Scrollable Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5">
                {/* Date */}
                <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(activeContent.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </span>
                </div>

                {/* Title */}
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

                {/* Image (if press release with image) — click to expand, download button */}
                {activeContent.images && activeContent.images.length > 0 ? (
                  <div className="mb-6">
                    <MediaCarousel
                      images={activeContent.images}
                      title={activeContent.title}
                      onImageClick={(src, idx, allSrcs) => {
                        setActiveMedia({
                          src,
                          title: activeContent.title,
                          date: activeContent.date,
                          allImages: allSrcs,
                          currentIndex: idx,
                        })
                      }}
                    />
                  </div>
                ) : (
                  activeContent.imageSrc && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative group/img cursor-zoom-in bg-white p-2 flex items-center justify-center"
                      onClick={() => {
                        setActiveMedia({
                          src: activeContent.imageSrc!,
                          title: activeContent.title,
                          date: activeContent.date,
                          allImages: [activeContent.imageSrc!],
                          currentIndex: 0,
                        })
                      }}
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

                {/* Excerpt */}
                {activeContent.excerpt && (
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <RichTextRenderer
                      content={activeContent.excerpt}
                      ttsState={ttsState}
                      currentCharIndex={currentCharIndex}
                    />
                  </div>
                )}

                {/* Full Body Content */}
                {activeContent.body && activeContent.body.length > 0 ? (
                  <RichTextRenderer
                    content={activeContent.body}
                    ttsState={ttsState}
                    currentCharIndex={currentCharIndex}
                  />
                ) : (
                  !activeContent.excerpt && (
                    <p className="text-slate-400 text-sm italic">No additional content available.</p>
                  )
                )}

                {/* Inline Document Preview & Download Buttons */}
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
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.216 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              WhatsApp
                            </a>
                            <a
                              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                activeContent.title + ' - ' + (activeContent.excerpt || (activeContent.body ? renderBody(activeContent.body).join('\n\n') : '')).slice(0, 100) + '...'
                              )}&url=${encodeURIComponent(
                                window.location.origin + sharePath + '?id=' + activeContent._id.slice(0, 8)
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setShowShareMenu(false)}
                              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold"
                            >
                              <svg className="w-4 h-4 mr-3 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                              X (Twitter)
                            </a>
                            <button
                              onClick={async () => {
                                const shareUrl = `${window.location.origin}${sharePath}?id=${activeContent._id.slice(0, 8)}`
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

      {/* PDF Document Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewPdfUrl}
        onClose={() => setPreviewPdfUrl(null)}
        documentUrl={previewPdfUrl || ''}
        title={activeContent?.title || 'Document Preview'}
      />
    </div>
  )
}
