'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Check, Globe } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import { getRoleTitle } from '@/lib/roleHelper'

interface SocialsClientProps {
  settings?: {
    candidateName?: any
    roleBadge?: any
    tagline?: any
    socialLinks?: {
      instagram?: string
      youtube?: string
      twitter?: string
      facebook?: string
    }
  } | null
}

export default function SocialsClient({ settings }: SocialsClientProps) {
  const { t, tContent, language } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const candidateName = tContent(settings?.candidateName, 'Bhashyam Rama Krishna')
  const roleTitle = getRoleTitle(language)
  const tagline = tContent(settings?.tagline, 'A Visionary Educationist | A Committed Public Leader | A Voice for AP')

  const socials = [
    {
      name: 'Instagram',
      username: '@ramakrishnabhashyam',
      url: settings?.socialLinks?.instagram || 'https://www.instagram.com/ramakrishnabhashyam',
      color: 'hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-red-500 hover:to-purple-600 hover:text-white',
      accentColor: '#E1306C',
      description: language === 'te' ? 'చిత్రాలు & నిత్య జీవిత విశేషాలు' : 'Photos & Daily Highlights',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      username: 'ramakrishnabhashyam',
      url: settings?.socialLinks?.facebook || 'https://www.facebook.com/ramakrishnabhashyam',
      color: 'hover:bg-[#1877F2] hover:text-white',
      accentColor: '#1877F2',
      description: language === 'te' ? 'కార్యక్రమాలు & ప్రజా సమూహం' : 'Community Events & Announcements',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      username: '@bhashyambrk',
      url: settings?.socialLinks?.twitter || 'https://x.com/bhashyambrk',
      color: 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
      accentColor: '#000000',
      description: language === 'te' ? 'తాజా ప్రస్తావనలు & తక్షణ సమాచారం' : 'Press Statements & Thoughts',
      icon: (
        <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      username: '@ramakrishnabhashyam',
      url: settings?.socialLinks?.youtube || 'https://www.youtube.com/@ramakrishnabhashyam',
      color: 'hover:bg-[#FF0000] hover:text-white',
      accentColor: '#FF0000',
      description: language === 'te' ? 'అధికారిక ప్రసంగాలు & సమాచారం' : 'Official Speeches & Updates',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    }
  ]

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-6 relative overflow-hidden flex items-center justify-center font-sans">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-saffron-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-red-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        
        {/* Navigation / Utility buttons */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm font-bold text-navy-800 hover:text-saffron-600 transition-colors bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'te' ? 'హోమ్' : 'Home'}</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 text-sm font-bold text-navy-800 hover:text-saffron-600 transition-colors bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs"
            aria-label="Copy page link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600 animate-scale" />
                <span className="text-green-600">{language === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{language === 'te' ? 'షేర్ లింక్' : 'Share Page'}</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="text-center mb-10 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-saffron-500 via-[#7A0D15] to-[#5C0606]" />
          
          <div className="relative inline-block mt-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-[#FFE600] flex items-center justify-center mx-auto relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brk.png"
                alt={`${candidateName} - Official Social Media Link Tree`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                width={112}
                height={112}
              />
            </div>
            
            {/* Party Badge indicator */}
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/telugudesamlogo.png"
                alt="TDP"
                className="w-full h-full object-contain"
                width={28}
                height={28}
              />
            </div>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-navy-950 mt-5 uppercase tracking-wide">
            {candidateName}
          </h1>
          <p className="text-xs md:text-sm text-saffron-600 font-extrabold tracking-wider uppercase mt-1">
            {roleTitle}
          </p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto mt-3 border-t border-slate-100 pt-3">
            {tagline}
          </p>
        </div>

        {/* Links Stack */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {socials.map((platform) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredCard(platform.name)}
              onMouseLeave={() => setHoveredCard(null)}
              className="flex items-center p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs transition-all duration-300 cursor-pointer group relative overflow-hidden"
              style={{
                backgroundColor: hoveredCard === platform.name ? platform.accentColor : '#ffffff',
                color: hoveredCard === platform.name ? '#ffffff' : 'inherit'
              }}
            >
              {/* Glow element on hover */}
              <div 
                className="absolute inset-y-0 left-0 w-1 transition-all duration-300"
                style={{ backgroundColor: hoveredCard === platform.name ? '#ffffff' : platform.accentColor }}
              />

              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 transition-all duration-300"
                style={{ 
                  backgroundColor: hoveredCard === platform.name ? '#ffffff' : `${platform.accentColor}10`,
                  color: platform.accentColor 
                }}
              >
                {platform.icon}
              </div>

              <div className="text-left flex-grow">
                <span 
                  className="block font-black text-base transition-colors"
                  style={{ color: hoveredCard === platform.name ? '#ffffff' : '#020617' }}
                >
                  {platform.name}
                </span>
                <span 
                  className="block text-xs font-medium transition-colors mt-0.5"
                  style={{ color: hoveredCard === platform.name ? 'rgba(255, 255, 255, 0.75)' : '#94a3b8' }}
                >
                  {platform.username}
                </span>
                <span 
                  className="block text-[11px] font-normal transition-colors mt-1"
                  style={{ color: hoveredCard === platform.name ? 'rgba(255, 255, 255, 0.9)' : '#64748b' }}
                >
                  {platform.description}
                </span>
              </div>
            </motion.a>
          ))}

          {/* Website Link */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="flex items-center p-4 bg-[#5C0606] text-white border border-transparent rounded-2xl shadow-sm hover:bg-[#450308] transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mr-4 text-saffron-300">
                <Globe className="w-6 h-6" />
              </div>

              <div className="text-left flex-grow">
                <span className="block font-black text-base text-white">
                  {language === 'te' ? 'అధికారిక వెబ్‌సైట్' : 'Official Portal'}
                </span>
                <span className="block text-xs text-saffron-300 font-bold mt-0.5">
                  bhashyamramakrishna.in
                </span>
                <span className="block text-[11px] text-red-100/70 mt-1">
                  {language === 'te' ? 'ఫిర్యాదులు, వార్తలు మరియు పార్లమెంట్ అప్‌డేట్స్' : 'Grievances, News & Parliament updates'}
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer Credit */}
        <div className="text-center mt-12 text-[10px] text-slate-400 font-medium tracking-wide">
          <p>© {new Date().getFullYear()} {language === 'te' ? 'భాష్యం రామకృష్ణ కార్యాలయం' : 'Office of Bhashyam Rama Krishna'}</p>
          <p className="mt-1 opacity-75">{language === 'te' ? 'సర్వ హక్కులు ప్రత్యేకించబడినవి.' : 'All Rights Reserved.'}</p>
        </div>

      </div>
    </div>
  )
}
