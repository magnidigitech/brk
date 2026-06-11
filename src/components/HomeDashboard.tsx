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
  Sparkles
} from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import { useLanguage } from '@/components/LanguageContext'

interface UpdateItem {
  _id: string
  title: any
  date: string
  summary: any
  speechUrl?: string
}

interface NewsItem {
  _id: string
  title: any
  publishedAt: string
  excerpt?: any
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
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
}

export default function HomeDashboard({ updates, news, gallery, settings }: HomeDashboardProps) {
  const [activeMedia, setActiveMedia] = useState<ActiveMedia | null>(null)
  const { t, tContent, language } = useLanguage()

  // Localized values
  const candidateName = tContent(settings.candidateName, 'Bhashyam Ramakrishna')
  const roleBadge = tContent(settings.roleBadge, 'Rajya Sabha Nominee')
  const tagline = tContent(settings.tagline, 'A Visionary Educationist | A Committed Public Leader | A Voice for AP')
  const stateRepresented = tContent(settings.stateRepresented, 'Andhra Pradesh')

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading with TDP Yellow Saffron Accent Line */}
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
          {/* 1. Profile / Hero Bento Card with TDP colors */}
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

            {/* Attendance statistics */}
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

          {/* 2. Grievance Portal Call-To-Action with Yellow frame glow */}
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
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-md flex flex-col justify-between hover:border-saffron-200/50 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <TrendingUp className="w-5 h-5 text-saffron-600" />
                  <h3 className="text-lg font-bold text-navy-900">{t('section.updates')}</h3>
                </div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Latest Session</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {updates && updates.length > 0 ? (
                  updates.map((update, index) => {
                    const utitle = tContent(update.title)
                    const usummary = tContent(update.summary)
                    return (
                      <div key={update._id} className={`py-5 md:py-0 ${index > 0 ? 'md:pl-8' : ''}`}>
                        <div className="flex items-center space-x-2 mb-2.5 text-xs text-slate-500 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(update.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                        </div>
                        <h4 className="text-base font-bold text-navy-900 mb-2 hover:text-saffron-600 transition-colors">
                          {utitle}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {usummary}
                        </p>
                        {update.speechUrl && (
                          <a 
                            href={update.speechUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-3 text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-colors"
                          >
                            {t('button.watchSpeech')} <ArrowRight className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-slate-500 py-6 md:col-span-2 text-center">No updates logged yet.</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* 4. Press Releases Card */}
          <motion.div 
            variants={itemVariants}
            id="news"
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-md flex flex-col justify-between hover:border-saffron-200/50 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-saffron-600" />
                  <h3 className="text-lg font-bold text-navy-900">{t('section.news')}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Featured News (Left, spans 2 columns) */}
                {news && news.length > 0 ? (
                  (() => {
                    const ntitle = tContent(news[0].title)
                    const nexcerpt = tContent(news[0].excerpt)
                    return (
                      <div className="md:col-span-2 group flex flex-col justify-between">
                        <div>
                          {news[0].image && (
                            <div 
                              onClick={() => {
                                const imgUrl = typeof news[0].image === 'string' ? news[0].image : urlFor(news[0].image).width(1200).url()
                                setActiveMedia({
                                  src: imgUrl,
                                  title: ntitle,
                                  caption: nexcerpt,
                                  date: news[0].publishedAt
                                })
                              }}
                              className="mb-4 rounded-2xl overflow-hidden h-64 relative bg-slate-100 border border-slate-200 cursor-zoom-in group/img shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={typeof news[0].image === 'string' ? news[0].image : urlFor(news[0].image).width(800).url()} 
                                alt={ntitle} 
                                className="w-full h-full object-cover group-hover/img:scale-102 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="bg-black/65 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg">
                                  Click to expand image
                                </span>
                              </div>
                            </div>
                          )}
                          <span className="block text-xs text-slate-500 font-semibold mb-1.5">
                            {new Date(news[0].publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </span>
                          <h4 className="text-xl font-bold text-navy-900 hover:text-saffron-600 transition-colors leading-snug">
                            {ntitle}
                          </h4>
                          {nexcerpt && (
                            <p className="text-slate-600 text-sm mt-2.5 leading-relaxed">
                              {nexcerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  <p className="text-sm text-slate-500 py-6 md:col-span-2 text-center">No press releases published yet.</p>
                )}

                {/* Other News List (Right, spans 1 column) */}
                <div className="space-y-6 divide-y divide-slate-100 md:col-span-1">
                  {news && news.length > 1 ? (
                    news.slice(1).map((item, index) => {
                      const ititle = tContent(item.title)
                      const iexcerpt = tContent(item.excerpt)
                      return (
                        <div key={item._id} className={`group cursor-pointer ${index > 0 ? 'pt-5' : ''}`}
                          onClick={() => {
                            if (item.image) {
                              const imgUrl = typeof item.image === 'string' ? item.image : urlFor(item.image).width(1200).url()
                              setActiveMedia({
                                src: imgUrl,
                                title: ititle,
                                caption: iexcerpt,
                                date: item.publishedAt
                              })
                            }
                          }}
                        >
                          <span className="block text-xs text-slate-500 font-semibold mb-1">
                            {new Date(item.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </span>
                          <h4 className="text-sm font-bold text-navy-900 group-hover:text-saffron-600 transition-colors line-clamp-2 leading-snug">
                            {ititle}
                          </h4>
                          {iexcerpt && (
                            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed line-clamp-2">
                              {iexcerpt}
                            </p>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    news && news.length > 0 && <p className="text-sm text-slate-400 italic py-6">No additional releases.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. Activity Gallery */}
          <motion.div 
            variants={itemVariants}
            id="gallery"
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-8 shadow-md hover:border-saffron-200/50 transition-all duration-300"
          >
            <div className="flex items-center space-x-2.5 mb-8 pb-3 border-b border-slate-100">
              <Video className="w-5 h-5 text-saffron-600" />
              <h3 className="text-lg font-bold text-navy-900">{t('section.gallery')}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {gallery && gallery.length > 0 ? (
                gallery.map((img) => {
                  const imgUrl = img.image 
                    ? (typeof img.image === 'string' ? img.image : urlFor(img.image).width(800).height(480).url()) 
                    : '/fallback.jpg'
                  const gtitle = tContent(img.title)
                  const gcaption = tContent(img.caption)
                  return (
                    <div 
                      key={img._id} 
                      onClick={() => {
                        setActiveMedia({
                          src: typeof img.image === 'string' ? img.image : urlFor(img.image).width(1200).url(),
                          title: gtitle,
                          caption: gcaption,
                          date: img.date
                        })
                      }}
                      className="group rounded-2xl overflow-hidden border border-slate-150 shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50 cursor-pointer"
                    >
                      <div className="h-48 overflow-hidden relative bg-slate-200">
                        <div className="absolute inset-0 bg-navy-900/10 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={imgUrl} 
                            alt={gtitle} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                      <div className="p-5">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                          {new Date(img.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                        <h4 className="text-sm font-bold text-navy-900 group-hover:text-saffron-600 transition-colors mb-1.5">
                          {gtitle}
                        </h4>
                        {gcaption && (
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                            {gcaption}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-slate-500 py-6 md:col-span-3 text-center">No images in gallery yet.</p>
              )}
            </div>
          </motion.div>

        </motion.div>

      </div>

      {/* Lightbox / Image Popup Modal */}
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
              {/* Close Button */}
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer text-xl font-bold"
                aria-label="Close image popup"
              >
                &times;
              </button>

              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  className="max-h-full max-w-full object-contain"
                />
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

    </div>
  )
}
