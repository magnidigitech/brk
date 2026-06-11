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

interface UpdateItem {
  _id: string
  title: string
  date: string
  summary: string
  speechUrl?: string
}

interface NewsItem {
  _id: string
  title: string
  publishedAt: string
  excerpt?: string
  image?: any
}

interface GalleryItem {
  _id: string
  title: string
  caption?: string
  date: string
  image: any
}

interface HomeDashboardProps {
  updates: UpdateItem[]
  news: NewsItem[]
  gallery: GalleryItem[]
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

export default function HomeDashboard({ updates, news, gallery }: HomeDashboardProps) {
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null)

  return (
    <div className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="mb-10 text-center md:text-left">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-saffron-100 text-saffron-600 mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Rajya Sabha Candidate / Nominee
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight leading-tight">
            Bhashyam Ramakrishna
          </h1>
          <p className="mt-2 text-lg text-slate-600 max-w-2xl font-medium">
            Educationist | Public Service Leader | Rajya Sabha Candidate from Andhra Pradesh
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
            className="md:col-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 text-white p-8 relative shadow-lg border border-navy-950 flex flex-col justify-between min-h-[360px]"
          >
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
              <Layers className="w-96 h-96" />
            </div>

            <div>
              <div className="flex items-center space-x-2.5 text-saffron-400 font-bold text-xs uppercase tracking-widest mb-4">
                <Award className="w-4 h-4" />
                <span>Profile Intro</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4 max-w-xl leading-snug">
                Committed to education, youth empowerment, social progress, and the development of Andhra Pradesh.
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed mb-6">
                Bhashyam Ramakrishna is a respected educationist, Founder Chairman of Bhashyam Educational Institutions, and public service leader from Andhra Pradesh. With decades of contribution to the education sector, he has helped shape the academic future of thousands of students.
              </p>
            </div>

            {/* Attendance statistics */}
            <div className="grid grid-cols-3 gap-4 border-t border-navy-700/60 pt-6">
              <div>
                <span className="block text-2xl md:text-3xl font-black text-saffron-500">98%</span>
                <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-semibold">Attendance</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-black text-saffron-500">120+</span>
                <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-semibold">Debates Joined</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-black text-saffron-500">250+</span>
                <span className="block text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-semibold">Questions Raised</span>
              </div>
            </div>
          </motion.div>

          {/* 2. Grievance Portal Call-To-Action */}
          <motion.div 
            variants={itemVariants}
            className="rounded-2xl bg-white border border-slate-200 p-8 shadow-md flex flex-col justify-between min-h-[360px] glow-card"
          >
            <div>
              <div className="w-12 h-12 bg-saffron-100 rounded-xl flex items-center justify-center mb-6">
                <LifeBuoy className="w-6 h-6 text-saffron-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Public Grievance Portal</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Submit local challenges, community requests, or suggestions directly to our office. Track ticket updates and resolutions live.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/grievance"
                className="flex items-center justify-between w-full px-5 py-3.5 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-navy-800 shadow-md transition-all group"
              >
                <span>Submit Grievance</span>
                <ArrowRight className="w-4 h-4 text-saffron-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/grievance?tab=track"
                className="flex items-center justify-center w-full px-5 py-3.5 bg-slate-50 text-navy-900 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                Track Ticket Status
              </Link>
            </div>
          </motion.div>

          {/* 3. Parliamentary Updates Card */}
          <motion.div 
            variants={itemVariants}
            id="updates"
            className="md:col-span-3 rounded-2xl bg-white border border-slate-200 p-8 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2.5">
                  <TrendingUp className="w-5 h-5 text-saffron-600" />
                  <h3 className="text-lg font-bold text-navy-900">Parliamentary Updates</h3>
                </div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Latest Session</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {updates && updates.length > 0 ? (
                  updates.map((update, index) => (
                    <div key={update._id} className={`py-5 md:py-0 ${index > 0 ? 'md:pl-8' : ''}`}>
                      <div className="flex items-center space-x-2 mb-1.5 text-xs text-slate-500 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(update.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                      </div>
                      <h4 className="text-base font-bold text-navy-900 mb-2 hover:text-saffron-600 transition-colors">
                        {update.title}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {update.summary}
                      </p>
                      {update.speechUrl && (
                        <a 
                          href={update.speechUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-3 text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-colors"
                        >
                          Watch Speech <ArrowRight className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-6 md:col-span-2 text-center">No parliamentary updates logged yet.</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-6">
              <span className="text-xs text-slate-400 font-medium italic block">
                Cached updates. Refreshed hourly.
              </span>
            </div>
          </motion.div>

          {/* 4. Press Releases Card */}
          <motion.div 
            variants={itemVariants}
            id="news"
            className="md:col-span-3 rounded-2xl bg-white border border-slate-200 p-8 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-saffron-600" />
                  <h3 className="text-lg font-bold text-navy-900">Press Releases</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Featured News (Left, spans 2 columns) */}
                {news && news.length > 0 ? (
                  <div className="md:col-span-2 group cursor-pointer flex flex-col justify-between">
                    <div>
                      {news[0].image && (
                        <div className="mb-4 rounded-xl overflow-hidden h-64 relative bg-slate-100 border border-slate-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={typeof news[0].image === 'string' ? news[0].image : urlFor(news[0].image).width(800).url()} 
                            alt={news[0].title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <span className="block text-xs text-slate-500 font-semibold mb-1">
                        {new Date(news[0].publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                      <h4 className="text-xl font-bold text-navy-900 group-hover:text-saffron-600 transition-colors">
                        {news[0].title}
                      </h4>
                      {news[0].excerpt && (
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                          {news[0].excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-6 md:col-span-2 text-center">No press releases published yet.</p>
                )}

                {/* Other News List (Right, spans 1 column) */}
                <div className="space-y-6 divide-y divide-slate-100 md:col-span-1">
                  {news && news.length > 1 ? (
                    news.slice(1).map((item, index) => (
                      <div key={item._id} className={`group cursor-pointer ${index > 0 ? 'pt-5' : ''}`}>
                        <span className="block text-xs text-slate-500 font-semibold mb-1">
                          {new Date(item.publishedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                        <h4 className="text-sm font-bold text-navy-900 group-hover:text-saffron-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        {item.excerpt && (
                          <p className="text-slate-600 text-xs mt-1.5 leading-relaxed line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    news && news.length > 0 && <p className="text-sm text-slate-400 italic py-6">No additional releases.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 mt-6">
              <span className="text-xs text-slate-400 font-medium italic block">
                Official releases. Refreshed hourly.
              </span>
            </div>
          </motion.div>

          {/* 5. Activity Gallery */}
          <motion.div 
            variants={itemVariants}
            id="gallery"
            className="md:col-span-3 rounded-2xl bg-white border border-slate-200 p-8 shadow-md"
          >
            <div className="flex items-center space-x-2.5 mb-8">
              <Video className="w-5 h-5 text-saffron-600" />
              <h3 className="text-lg font-bold text-navy-900">Activity Gallery</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gallery && gallery.length > 0 ? (
                gallery.map((img) => {
                  const imgUrl = img.image 
                    ? (typeof img.image === 'string' ? img.image : urlFor(img.image).width(800).height(480).url()) 
                    : '/fallback.jpg'
                  return (
                    <div 
                      key={img._id} 
                      onClick={() => setActiveImage(img)}
                      className="group rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 bg-slate-50 cursor-pointer"
                    >
                      <div className="h-48 overflow-hidden relative bg-slate-200">
                        <div className="absolute inset-0 bg-navy-900/10 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={imgUrl} 
                            alt={img.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                      <div className="p-5">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                          {new Date(img.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </span>
                        <h4 className="text-sm font-bold text-navy-900 group-hover:text-saffron-600 transition-colors mb-1.5">
                          {img.title}
                        </h4>
                        {img.caption && (
                          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                            {img.caption}
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
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full border border-slate-200 shadow-2xl relative cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/75 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer text-xl font-bold"
                aria-label="Close image popup"
              >
                &times;
              </button>

              <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    activeImage.image
                      ? (typeof activeImage.image === 'string' ? activeImage.image : urlFor(activeImage.image).width(1200).url())
                      : '/fallback.jpg'
                  }
                  alt={activeImage.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-6">
                <span className="block text-[10px] text-saffron-600 font-bold uppercase tracking-wider mb-1">
                  {new Date(activeImage.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                </span>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{activeImage.title}</h3>
                {activeImage.caption && (
                  <p className="text-slate-600 text-sm leading-relaxed">{activeImage.caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
