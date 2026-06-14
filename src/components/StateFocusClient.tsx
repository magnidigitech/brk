'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  HeartPulse,
  Sprout,
  Navigation,
  Briefcase,
  Users,
  Cpu,
  Leaf,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Quote,
  Activity,
  FileText,
  CheckCircle2
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import Link from 'next/link'

const iconMap: Record<string, any> = {
  BookOpen,
  HeartPulse,
  Sprout,
  Navigation,
  Briefcase,
  Users,
  Cpu,
  Leaf
}

interface SectorItem {
  _id: string
  title: any
  short?: any
  iconName?: string
  vision?: any
  concerns?: any[]
}

interface StateFocusClientProps {
  sectors: SectorItem[]
}

export default function StateFocusClient({ sectors }: StateFocusClientProps) {
  const [selectedId, setSelectedId] = useState<string>(sectors[0]?._id || '')
  const [expandedIdMobile, setExpandedIdMobile] = useState<string | null>(null)
  const { tContent, language } = useLanguage()

  // Local translations for premium UI texts
  const localT = {
    badge: {
      en: 'State-Level Commitments',
      te: 'రాష్ట్ర స్థాయి ప్రాధాన్యతలు'
    },
    title: {
      en: 'State Focus & Priority Sectors',
      te: 'రాష్ట్ర ప్రాధాన్యతలు & విధానాలు'
    },
    subtitle: {
      en: 'Our legislative agenda focuses on state-wide development concerns. Below are the priority sectors and policy issues currently being tracked by our office.',
      te: 'ఆంధ్రప్రదేశ్ రాష్ట్ర ప్రగతి ప్రస్థానంలో మా ప్రాధాన్యతలు మరియు శాసనసభ అజెండా. వివిధ రంగాలలో మా విధానాలు మరియు అభివృద్ధి ప్రణాళికను ఇక్కడ వీక్షించండి.'
    },
    visionTitle: {
      en: 'Development Vision',
      te: 'అభివృద్ధి విజన్'
    },
    concernsTitle: {
      en: 'Key Focus Points & Concerns',
      te: 'కీలక సమస్యలు & లక్ష్యాలు'
    },
    ctaTitle: {
      en: 'Connect & Submit Grievance',
      te: 'సమస్యను సమర్పించండి (గ్రీవెన్స్)'
    },
    ctaDesc: {
      en: 'Have a complaint, feedback, or suggestion regarding this sector? Submit a grievance directly to our office for tracking and resolution.',
      te: 'ఈ రంగానికి సంబంధించి మీకు ఏవైనా ఫిర్యాదులు, సూచనలు లేదా సలహాలు ఉన్నాయా? నేరుగా మా కార్యాలయానికి సమర్పించండి.'
    },
    ctaBtn: {
      en: 'Submit Grievance Now',
      te: 'గ్రీవెన్స్ నమోదు చేయండి'
    },
    activeLabel: {
      en: 'Active Tracking',
      te: 'పర్యవేక్షణలో ఉంది'
    }
  }

  // Get active sector details
  const activeSector = sectors.find(s => s._id === selectedId) || sectors[0]

  // Map sector title to Grievance category parameter
  const getMappedGrievanceCategory = (title: string): string => {
    const t = (title || '').toLowerCase()
    if (t.includes('education') || t.includes('schools') || t.includes('విద్య')) return 'Education & Schools'
    if (t.includes('health') || t.includes('hospital') || t.includes('వైద్యం') || t.includes('ఆరోగ్యం')) return 'Healthcare & Hospitals'
    if (t.includes('infrastructure') || t.includes('roads') || t.includes('రోడ్లు') || t.includes('రవాణా')) return 'Infrastructure & Roads'
    if (t.includes('water') || t.includes('sanitation') || t.includes('నీరు') || t.includes('పారిశుధ్యం')) return 'Water & Sanitation'
    if (t.includes('agriculture') || t.includes('farming') || t.includes('వ్యవసాయం')) return 'Agriculture & Subsidies'
    if (t.includes('digital') || t.includes('internet') || t.includes('కనెక్టివిటీ')) return 'Digital Connectivity'
    if (t.includes('skill') || t.includes('job') || t.includes('ఉపాధి') || t.includes('నైపుణ్యం')) return 'Employment & Skill Development'
    return 'Other Public Issue'
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Background ambient radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,0,0.07)_0%,transparent_55%)] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-saffron-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Page Header */}
        <div className="text-center mb-16 relative">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black bg-saffron-100 text-saffron-600 mb-3 uppercase tracking-widest border border-saffron-200/50 shadow-sm">
            <Activity className="w-3.5 h-3.5 mr-1 text-saffron-500 animate-pulse" />
            {localT.badge[language]}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight mb-4">
            {localT.title[language]}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            {localT.subtitle[language]}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-saffron-400 to-saffron-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* ── DESKTOP DASHBOARD GRID LAYOUT (lg and above) ──────────────── */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">

          {/* Left Column: Interactive Sectors Menu (lg:col-span-5) */}
          <div className="col-span-5 space-y-4">
            {sectors.map((sec) => {
              const IconComponent = sec.iconName && iconMap[sec.iconName] ? iconMap[sec.iconName] : Sparkles
              const isActive = selectedId === sec._id
              const title = tContent(sec.title)
              const short = tContent(sec.short)

              return (
                <motion.button
                  key={sec._id}
                  onClick={() => setSelectedId(sec._id)}
                  whileHover={{ x: 6 }}
                  className={`w-full text-left p-5 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 relative overflow-hidden cursor-pointer ${isActive
                    ? 'bg-white border-saffron-500 shadow-md ring-1 ring-saffron-500/20'
                    : 'bg-white/80 backdrop-blur-sm border-slate-200/80 hover:border-saffron-400/60 hover:bg-white'
                    }`}
                >
                  {/* Saffron side indicator stripe */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-saffron-400 to-saffron-500 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'
                    }`} />

                  <div className="flex space-x-4 pr-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${isActive
                      ? 'bg-saffron-50 border-saffron-200 text-saffron-600 scale-[1.05]'
                      : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-navy-900 leading-snug truncate">{title}</h3>
                      {short && (
                        <p className="text-slate-500 text-[11px] font-medium leading-relaxed mt-1 line-clamp-1">
                          {short}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center shrink-0">
                    <div className={`w-2 h-2 rounded-full mr-2.5 transition-all duration-300 ${isActive ? 'bg-saffron-500 scale-[1.25] shadow-lg shadow-saffron-500/30' : 'bg-slate-300'
                      }`} />
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'translate-x-1 text-saffron-600' : 'text-slate-400'
                      }`} />
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Right Column: Dynamic Spotlight Policy Panel (lg:col-span-7) */}
          <div className="col-span-7 bg-white border-2 border-slate-200/80 rounded-3xl p-8 shadow-md sticky top-24 relative overflow-hidden min-h-[500px] flex flex-col">
            {/* Visual ambient accent ring */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-saffron-100/30 rounded-full blur-2xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeSector && (
                <motion.div
                  key={activeSector._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header: Title and Icon */}
                    <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
                      <div className="w-14 h-14 rounded-2xl bg-saffron-100 text-saffron-600 border border-saffron-200 flex items-center justify-center shadow-inner shrink-0 relative">
                        {/* Dynamic pulse halo ring */}
                        <div className="absolute inset-0 rounded-2xl bg-saffron-400/20 animate-ping -z-1" />
                        {(() => {
                          const IconComp = activeSector.iconName && iconMap[activeSector.iconName] ? iconMap[activeSector.iconName] : Sparkles
                          return <IconComp className="w-6 h-6" />
                        })()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            {localT.activeLabel[language]}
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-navy-900 leading-snug">
                          {tContent(activeSector.title)}
                        </h2>
                      </div>
                    </div>

                    {/* Content Section 1: Development Vision */}
                    {activeSector.vision && (
                      <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-2xl group">
                        {/* Quotes visuals */}
                        <Quote className="w-7 h-7 text-saffron-200 absolute top-4 left-4 stroke-[2.5] opacity-60" />
                        <div className="pl-6 relative">
                          <span className="block text-[9px] text-saffron-600 font-black uppercase tracking-wider mb-2">
                            {localT.visionTitle[language]}
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold justify-clean italic">
                            &ldquo;{tContent(activeSector.vision)}&rdquo;
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Content Section 2: Key Concerns & Focus list */}
                    {activeSector.concerns && activeSector.concerns.length > 0 && (
                      <div className="space-y-3">
                        <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">
                          {localT.concernsTitle[language]}
                        </span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {activeSector.concerns.map((con, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex items-start space-x-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200/80 hover:bg-slate-50/30 transition-colors"
                            >
                              <ShieldCheck className="w-4.5 h-4.5 text-saffron-600 shrink-0 mt-0.5" />
                              <span className="text-xs font-semibold text-slate-700 leading-relaxed text-left">
                                {tContent(con)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Grievance Presets Call-to-Action */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-5 rounded-2xl border border-dashed border-slate-200">
                    <div className="text-left max-w-sm">
                      <h4 className="text-xs font-black text-navy-900 uppercase tracking-wide">
                        {localT.ctaTitle[language]}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-1 font-medium">
                        {localT.ctaDesc[language]}
                      </p>
                    </div>
                    <Link
                      href={`/grievance?tab=submit&category=${encodeURIComponent(getMappedGrievanceCategory(tContent(activeSector.title)))}`}
                      className="inline-flex items-center justify-center px-4 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-navy-900 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 border border-saffron-600/10"
                    >
                      {localT.ctaBtn[language]}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── MOBILE ACCORDION FALLBACK LAYOUT (lg:hidden) ─────────────── */}
        <div className="lg:hidden space-y-4 max-w-2xl mx-auto">
          {sectors.map((sec) => {
            const IconComponent = sec.iconName && iconMap[sec.iconName] ? iconMap[sec.iconName] : Sparkles
            const isOpen = expandedIdMobile === sec._id

            // Localize values
            const title = tContent(sec.title)
            const short = tContent(sec.short)
            const vision = tContent(sec.vision)
            const concerns = sec.concerns && sec.concerns.length > 0
              ? sec.concerns.map(con => tContent(con))
              : []

            return (
              <div
                key={sec._id}
                className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 relative ${isOpen ? 'border-saffron-500 shadow-md' : 'border-slate-200 hover:border-saffron-400/60'
                  }`}
              >
                {/* Accent top stripe when open */}
                {isOpen && <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-500" />}

                <button
                  type="button"
                  onClick={() => setExpandedIdMobile(isOpen ? null : sec._id)}
                  className="w-full p-5 text-left flex items-center justify-between focus:outline-none cursor-pointer"
                >
                  <div className="flex space-x-3.5 pr-2 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300 ${isOpen ? 'bg-saffron-100 border-saffron-200 text-saffron-600' : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-navy-900 leading-snug truncate">{title}</h3>
                      {short && <p className="text-slate-500 text-[10px] mt-1 font-medium truncate">{short}</p>}
                    </div>
                  </div>
                  <ChevronDown className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-300 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-saffron-600' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-4 text-left">
                        {/* Mobile Vision */}
                        {vision && (
                          <div className="p-4 bg-white border border-slate-200 rounded-xl">
                            <span className="block text-[9px] text-saffron-600 font-black uppercase tracking-wider mb-1">
                              {localT.visionTitle[language]}
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold italic justify-clean">
                              &ldquo;{vision}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Mobile Focus Concerns */}
                        {concerns && concerns.length > 0 && (
                          <div className="space-y-2">
                            <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">
                              {localT.concernsTitle[language]}
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {concerns.map((con, cIdx) => (
                                <div key={cIdx} className="flex items-start space-x-2.5 p-2 bg-white border border-slate-200 rounded-xl">
                                  <ShieldCheck className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                                  <span className="text-xs font-semibold text-slate-700 leading-relaxed">
                                    {con}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mobile Grievance CTA Link */}
                        <div className="pt-2">
                          <Link
                            href={`/grievance?tab=submit&category=${encodeURIComponent(getMappedGrievanceCategory(title))}`}
                            className="w-full py-2.5 bg-saffron-500 hover:bg-saffron-600 text-navy-900 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-saffron-600/10"
                          >
                            <span>{localT.ctaBtn[language]}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
