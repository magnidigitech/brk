'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  BookOpen
} from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { useLanguage } from '@/components/LanguageContext'

interface UpdateItem {
  _id: string
  title: any
  date: string
  summary: any
  speechUrl?: string
  documentUrl?: string
}

interface NewsItem {
  _id: string
  title: any
  publishedAt: string
  excerpt?: any
  body?: any[]
  image?: any
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

interface HomeDashboardProps {
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

export default function HomeDashboard({ updates, news, gallery, settings }: HomeDashboardProps) {
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null)
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null)
  const { t, tContent } = useLanguage()

  // Localized values
  const candidateName = tContent(settings.candidateName, 'Bhashyam Ramakrishna')
  const roleBadge = tContent(settings.roleBadge, 'Rajya Sabha Nominee')
  const tagline = tContent(settings.tagline, 'A Visionary Educationist | A Committed Public Leader | A Voice for AP')
  const stateRepresented = tContent(settings.stateRepresented, 'Andhra Pradesh')

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-10 text-center md:text-left relative pb-4 border-b border-slate-200">
          <div className="absolute left-0 bottom-0 h-1 w-24 bg-saffron-500 rounded-full"></div>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-saffron-100 text-saffron-600 mb-3 uppercase tracking-wider border border-saffron-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {roleBadge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight leading-tight">
            {candidateName}
          </h1>
          <p className="mt-2 text-base md:text-lg text-slate-600 max-w-3xl font-medium">
            {tagline}
          </p>
        </div>

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
            className="md:col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-white p-8 relative shadow-lg border-2 border-navy-950 flex flex-col justify-between min-h-[360px]"
          >
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12">
              <Layers className="w-96 h-96" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 text-saffron-400 font-extrabold text-xs uppercase tracking-widest mb-4">
                <Award className="w-4 h-4 text-saffron-400" />
                <span>{t('home.profileIntro')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 max-w-xl leading-snug">
                {t('home.introCommitment')}
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed mb-6">
                {candidateName} is a respected educationist, Founder Chairman of Bhashyam Educational Institutions, and public service leader from {stateRepresented}. With decades of contribution to the education sector, he has helped shape the academic future of thousands of students.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-navy-800 pt-6">
              <div>
                <span className="block text-2xl md:text-3xl font-black text-saffron-500">98%</span>
                <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-bold">{t('stats.attendance')}</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-black text-saffron-500">120+</span>
                <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-bold">{t('stats.debates')}</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-black text-saffron-500">250+</span>
                <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-bold">{t('stats.questions')}</span>
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
                className="flex items-center justify-between w-full px-5 py-3.5 bg-navy-900 text-white rounded-2xl font-bold text-sm hover:bg-navy-800 shadow-md transition-all group-hover:shadow-lg"
              >
                <span>{t('grievance.submitTab')}</span>
                <ArrowRight className="w-4 h-4 text-saffron-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/grievance?tab=track"
                className="flex items-center justify-center w-full px-5 py-3.5 bg-slate-50 text-navy-900 border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                {t('grievance.trackTab')}
              </Link>
            </div>
          </motion.div>

          {/* 3. Parliamentary Updates Card */}
          <motion.div
            variants={itemVariants}
            id="updates"
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-md hover:border-saffron-200/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <TrendingUp className="w-5 h-5 text-saffron-600" />
                <h3 className="text-lg font-bold text-navy-900">{t('section.updates')}</h3>
              </div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Latest Session</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {updates && updates.length > 0 ? (
                updates.map((update, index) => {
                  const utitle = tContent(update.title)
                  const usummary = tContent(update.summary)
                  return (
                    <div
                      key={update._id}
                      onClick={() => setActiveContent({
                        type: 'update',
                        title: utitle,
                        date: update.date,
                        excerpt: usummary,
                        speechUrl: update.speechUrl,
                        documentUrl: update.documentUrl,
                      })}
                      className={`group cursor-pointer rounded-2xl border border-slate-100 hover:border-saffron-200 bg-slate-50 hover:bg-saffron-50/30 p-5 transition-all duration-200 ${index > 0 ? '' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(update.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        </div>
                        <span className="text-[10px] text-saffron-600 font-bold uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read more <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-navy-900 mb-2 group-hover:text-saffron-700 transition-colors">
                        {utitle}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {usummary}
                      </p>
                      {(update.speechUrl || update.documentUrl) && (
                        <div className="mt-3 flex items-center gap-3">
                          {update.speechUrl && (
                            <span className="inline-flex items-center text-xs font-bold text-saffron-600">
                              <Video className="w-3 h-3 mr-1" /> Speech available
                            </span>
                          )}
                          {update.documentUrl && (
                            <span className="inline-flex items-center text-xs font-bold text-navy-700">
                              <Download className="w-3 h-3 mr-1" /> Document attached
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-slate-500 py-6 md:col-span-2 text-center">No updates logged yet.</p>
              )}
            </div>
          </motion.div>

          {/* 4. Press Releases Card */}
          <motion.div
            variants={itemVariants}
            id="news"
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-md hover:border-saffron-200/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-saffron-600" />
                <h3 className="text-lg font-bold text-navy-900">{t('section.news')}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured Press Release (left, 2 cols) */}
              {news && news.length > 0 ? (
                (() => {
                  const ntitle = tContent(news[0].title)
                  const nexcerpt = tContent(news[0].excerpt)
                  const imgSrc = news[0].image
                    ? (typeof news[0].image === 'string' ? news[0].image : urlFor(news[0].image).width(1200).url())
                    : undefined
                  return (
                    <div
                      className="md:col-span-2 group flex flex-col cursor-pointer"
                      onClick={() => setActiveContent({
                        type: 'news',
                        title: ntitle,
                        date: news[0].publishedAt,
                        excerpt: nexcerpt,
                        body: news[0].body,
                        imageSrc: imgSrc,
                      })}
                    >
                      {news[0].image && (
                        <div className="mb-4 rounded-2xl overflow-hidden h-64 relative bg-slate-100 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={typeof news[0].image === 'string' ? news[0].image : urlFor(news[0].image).width(800).url()}
                            alt={ntitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/20 transition-colors flex items-end p-4">
                            <span className="bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to read full release
                            </span>
                          </div>
                        </div>
                      )}
                      <span className="block text-xs text-slate-500 font-semibold mb-1.5">
                        {new Date(news[0].publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                      <h4 className="text-xl font-bold text-navy-900 group-hover:text-saffron-600 transition-colors leading-snug mb-2">
                        {ntitle}
                      </h4>
                      {nexcerpt && (
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-1">
                          {nexcerpt}
                        </p>
                      )}
                      <span className="mt-3 inline-flex items-center text-xs font-bold text-saffron-600 group-hover:text-saffron-700 transition-colors">
                        <BookOpen className="w-3.5 h-3.5 mr-1" /> Read full article <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  )
                })()
              ) : (
                <p className="text-sm text-slate-500 py-6 md:col-span-2 text-center">No press releases published yet.</p>
              )}

              {/* Other Press Releases (right, 1 col) */}
              <div className="space-y-5 divide-y divide-slate-100 md:col-span-1">
                {news && news.length > 1 ? (
                  news.slice(1).map((item, index) => {
                    const ititle = tContent(item.title)
                    const iexcerpt = tContent(item.excerpt)
                    const imgSrc = item.image
                      ? (typeof item.image === 'string' ? item.image : urlFor(item.image).width(800).url())
                      : undefined
                    return (
                      <div
                        key={item._id}
                        className={`group cursor-pointer ${index > 0 ? 'pt-5' : ''}`}
                        onClick={() => setActiveContent({
                          type: 'news',
                          title: ititle,
                          date: item.publishedAt,
                          excerpt: iexcerpt,
                          body: item.body,
                          imageSrc: imgSrc,
                        })}
                      >
                        <span className="block text-xs text-slate-500 font-semibold mb-1">
                          {new Date(item.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                        <h4 className="text-sm font-bold text-navy-900 group-hover:text-saffron-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                          {ititle}
                        </h4>
                        {iexcerpt && (
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                            {iexcerpt}
                          </p>
                        )}
                        <span className="mt-2 inline-flex items-center text-[10px] font-bold text-saffron-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read more <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    )
                  })
                ) : (
                  news && news.length > 0 && <p className="text-sm text-slate-400 italic py-6">No additional releases.</p>
                )}
              </div>
            </div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMedia(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full border-2 border-saffron-400 shadow-2xl relative cursor-default"
            >
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeMedia.src} alt={activeMedia.title} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-6 border-t border-slate-100 bg-white">
                {activeMedia.date && (
                  <span className="block text-[10px] text-saffron-600 font-bold uppercase tracking-wider mb-1">
                    {new Date(activeMedia.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </span>
                )}
                <h3 className="text-xl font-bold text-navy-900 mb-2">{activeMedia.title}</h3>
                {activeMedia.caption && (
                  <p className="text-slate-600 text-sm leading-relaxed">{activeMedia.caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full Content Detail Modal ────────────────────────────────── */}
      <AnimatePresence>
        {activeContent && (
          <motion.div
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
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center space-x-2.5">
                  {activeContent.type === 'update' ? (
                    <TrendingUp className="w-5 h-5 text-saffron-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-saffron-600" />
                  )}
                  <span className="text-xs font-bold text-saffron-600 uppercase tracking-widest">
                    {activeContent.type === 'update' ? 'Parliamentary Update' : 'Press Release'}
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
                  {activeContent.title}
                </h2>

                {/* Image (if press release with image) */}
                {activeContent.imageSrc && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeContent.imageSrc}
                      alt={activeContent.title}
                      className="w-full object-cover max-h-72"
                    />
                  </div>
                )}

                {/* Excerpt */}
                {activeContent.excerpt && (
                  <p className="text-base text-slate-700 leading-relaxed font-medium mb-5 pb-5 border-b border-slate-100">
                    {activeContent.excerpt}
                  </p>
                )}

                {/* Full Body Content */}
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

              {/* Footer Actions */}
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
