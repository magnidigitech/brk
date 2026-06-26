'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Landmark, 
  GraduationCap, 
  Award, 
  Compass, 
  CheckCircle2, 
  Quote, 
  Lightbulb, 
  HelpCircle, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  MapPin, 
  FileText,
  Activity,
  Users,
  Building2,
  ChevronRight
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { getRoleTitle } from '@/lib/roleHelper'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

interface AboutClientProps {
  data: {
    title?: any
    subtitle?: any
    badgeText?: any
    profileShortName?: any
    bioParagraph1?: any
    bioParagraph2?: any
    eduTitle?: any
    eduContent?: any
    publicTitle?: any
    publicContent?: any
    focusAreas?: any[]
    values?: Array<{ name: any; desc: any }>
    quoteText?: any
    quoteAuthor?: any
    summaryContent?: any
  }
  siteSettings?: {
    partyName?: any
    stateRepresented?: any
    roleBadge?: any
  }
}

export default function AboutClient({ data, siteSettings }: AboutClientProps) {
  const { tContent, t, language } = useLanguage()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'vision' | 'values'>('vision')

  // Localize page settings
  const title = tContent(data.title, 'Bhashyam Rama Krishna')
  const subtitle = tContent(data.subtitle, 'A Visionary Educationist | A Committed Public Leader | A Voice for AP')
  const badgeText = getRoleTitle(language)
  const profileShortName = tContent(data.profileShortName, 'B. Rama Krishna')
  const bioParagraph1 = tContent(data.bioParagraph1, 'Bhashyam Rama Krishna is a respected educationist, institution builder, and public service leader from Andhra Pradesh. With decades of dedicated work in the field of education, he has played a significant role in shaping the academic journey of thousands of students through Bhashyam Educational Institutions.')
  const bioParagraph2 = tContent(data.bioParagraph2, 'Known for his disciplined approach, service-oriented mindset, and strong commitment to youth development, Bhashyam Rama Krishna has built a reputation as a leader who believes that education is the foundation for social progress. His work has always focused on empowering students, supporting families, and contributing to the growth of society through quality education and value-based learning.')

  const eduTitle = tContent(data.eduTitle, 'Founder Chairman of Bhashyam Educational Institutions')
  const eduContent = tContent(data.eduContent, 'Under Bhashyam Rama Krishna\'s leadership, the Bhashyam group has grown into one of the well-known educational networks in Andhra Pradesh and Telangana. His vision has always been to make quality education accessible, structured, and result-oriented. His belief is simple and powerful: when students are guided with the right education, values, and confidence, they can build a better future for themselves, their families, and the nation.')
  
  const publicTitle = tContent(data.publicTitle, 'Public Service Journey')
  const publicContent = tContent(data.publicContent, 'Beyond education, Bhashyam Rama Krishna has remained closely connected with public service and social development. His journey reflects a strong commitment to people, especially students, youth, parents, teachers, and communities that seek better opportunities. His public service approach is rooted in listening to people, understanding their challenges, and working towards practical solutions. As a Rajya Sabha candidate from Andhra Pradesh nominated by the Telugu Desam Party (TDP), Bhashyam Rama Krishna represents a leadership profile built on education, discipline, development, and service.')

  const quoteText = tContent(data.quoteText, 'Education has the power to change lives, strengthen families, and build the future of our society. My journey has always been guided by the belief that service to people is the highest responsibility. My team and I remain committed to working for the progress of Andhra Pradesh, the empowerment of youth, and the development of our nation.')
  const quoteAuthor = tContent(data.quoteAuthor, 'Bhashyam Rama Krishna')
  const summaryContent = tContent(data.summaryContent, 'Bhashyam Rama Krishna is an educationist, Founder Chairman of Bhashyam Educational Institutions, and a public service leader from Andhra Pradesh. With decades of contribution to education and social development, he continues to work with a vision to empower youth, support families, and contribute to the progress of society. His journey from education to public service reflects his commitment to creating meaningful change and serving people with dedication, discipline, and responsibility.')

  const partyName = tContent(siteSettings?.partyName, 'Telugu Desam Party (TDP)')
  const stateRepresented = tContent(siteSettings?.stateRepresented, 'Andhra Pradesh')

  // Localize array fields
  const displayFocusAreas = data.focusAreas && data.focusAreas.length > 0 
    ? data.focusAreas.map(area => tContent(area)) 
    : [
        'Quality education for all sections of society',
        'Youth empowerment and skill development',
        'Employment-oriented learning',
        'Support for students and families',
        'Strengthening public institutions',
        'Rural and urban development',
        'Better healthcare and public welfare',
        'Technology-driven governance',
        'Social responsibility and inclusive growth'
      ]

  const displayValues = data.values && data.values.length > 0 
    ? data.values.map(val => ({
        name: tContent(val.name),
        desc: tContent(val.desc)
      }))
    : [
        { name: 'Discipline', desc: 'The baseline for all successful educational and social institutions.' },
        { name: 'Education', desc: 'The core pillar of public progress and individual empowerment.' },
        { name: 'Service', desc: 'The highest responsibility of public and political leadership.' },
        { name: 'Integrity', desc: 'A transparent commitment to honest governance and representation.' },
        { name: 'Social Progress', desc: 'Driving inclusive and long-term socio-economic growth.' }
      ]

  // Combine readable texts for biography narration
  const readableBioText = `${profileShortName}. ${bioParagraph1} ${bioParagraph2} ${eduTitle}. ${eduContent} ${publicTitle}. ${publicContent}`
  const { speak, pause, stop, state: ttsState, supported: ttsSupported } = useTextToSpeech(readableBioText, language)

  // Local translations for redesigned elements
  const localT = {
    badge: { en: 'Official Biography', te: 'అధికారిక జీవిత చరిత్ర' },
    visionTab: { en: 'Key Focus Areas', te: 'ప్రాధాన్యతా రంగాలు' },
    valuesTab: { en: 'Core Values', te: 'నాయకత్వ విలువలు' },
    summaryTitle: { en: 'Profile Summary', te: 'సంక్షిప్త పరిచయం' },
    detailsTitle: { en: 'Leadership Details', te: 'నాయకత్వ వివరాలు' },
    milestonesTitle: { en: 'Key Milestones', te: 'ప్రధాన మైలురాళ్లు' }
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Ambient Radial Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,210,0,0.06)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-saffron-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-900/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Page Header & Narration Player ─────────────────────────── */}
        <div className="text-center mb-10 sm:mb-16 relative">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black bg-saffron-100 text-saffron-600 mb-3 uppercase tracking-widest border border-saffron-200/50 shadow-sm">
            <Activity className="w-3.5 h-3.5 mr-1 text-saffron-500 animate-pulse" />
            {localT.badge[language]}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-bold max-w-2xl mx-auto uppercase tracking-wide leading-relaxed">
            {subtitle}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-saffron-400 to-saffron-500 mx-auto mt-4 rounded-full" />

          {/* TTS Player Bar */}
          {ttsSupported && (
            <div className="flex items-center justify-center mt-6 space-x-3 bg-white border border-slate-200/80 rounded-full px-5 py-2.5 max-w-xs mx-auto shadow-md hover:shadow-lg transition-shadow">
              <button
                type="button"
                onClick={ttsState === 'playing' ? pause : speak}
                className="flex items-center justify-center px-4 py-1.5 rounded-full bg-saffron-500 hover:bg-saffron-400 text-navy-900 transition-colors cursor-pointer text-xs font-black shadow-sm"
                title={ttsState === 'playing' ? 'Pause narration' : 'Play biography narration'}
              >
                {ttsState === 'playing' ? (
                  <VolumeX className="w-4 h-4 mr-1.5 animate-pulse text-rose-700" />
                ) : (
                  <Volume2 className="w-4 h-4 mr-1.5 text-navy-900" />
                )}
                <span>
                  {ttsState === 'playing' 
                    ? (language === 'te' ? 'ఆపండి' : 'Pause') 
                    : (language === 'te' ? 'వినండి' : 'Listen Biography')}
                </span>
              </button>
              {ttsState !== 'idle' && (
                <button
                  type="button"
                  onClick={stop}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-[10px] font-black uppercase tracking-wider"
                  title="Stop narration"
                >
                  {language === 'te' ? 'ముగించు' : 'Stop'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Biography Bento Grid Layout ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 sm:mb-16 items-stretch">
          
          {/* Left Block: Identity Sidebar (md:col-span-4) */}
          <div className="md:col-span-4 bg-gradient-to-br from-navy-950 via-navy-900 to-[#121E36] rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-white/5 min-h-[350px]">
            {/* Ambient subtle glow ring */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-saffron-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner mb-6">
                <Landmark className="w-6 h-6 text-saffron-400" />
              </div>
              <h2 className="text-xl font-black tracking-wide mb-6 text-white">{profileShortName}</h2>
              
              <div className="space-y-5">
                <div className="border-l-2 border-saffron-400/50 pl-3">
                  <span className="block text-[9px] text-white/50 font-bold uppercase tracking-wider">Candidate Nomination</span>
                  <span className="text-xs font-extrabold text-white leading-snug block mt-0.5">{badgeText}</span>
                </div>
                <div className="border-l-2 border-saffron-400/50 pl-3">
                  <span className="block text-[9px] text-white/50 font-bold uppercase tracking-wider">State Represented</span>
                  <span className="text-xs font-extrabold text-white leading-snug block mt-0.5">{stateRepresented}</span>
                </div>
                <div className="border-l-2 border-saffron-400/50 pl-3">
                  <span className="block text-[9px] text-white/50 font-bold uppercase tracking-wider">Party Association</span>
                  <span className="text-xs font-black text-saffron-400 leading-snug block mt-0.5">{partyName}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center text-[10px] text-white/60 font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4 mr-1.5 text-saffron-400" />
              Andhra Pradesh, India
            </div>
          </div>

          {/* Right Block: Profile Biography (md:col-span-8) */}
          <div className="md:col-span-8 bg-white border-2 border-slate-200/80 rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center text-left relative overflow-hidden">
            {/* Visual drop cap effect decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50/50 rounded-bl-full pointer-events-none" />
            
            <h3 className="text-base font-black text-navy-900 mb-4 flex items-center uppercase tracking-wide">
              <Compass className="w-5 h-5 mr-2 text-saffron-600 stroke-[2.5]" />
              {localT.milestonesTitle[language]}
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              <p className="justify-clean relative pl-4 border-l-4 border-saffron-400/80">
                {bioParagraph1}
              </p>
              <p className="justify-clean">
                {bioParagraph2}
              </p>
            </div>
          </div>
        </div>

        {/* ── Educational vs Public Journey Split Track ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 sm:mb-16">
          
          {/* Track 1: Educational Leadership */}
          <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-saffron-400/60 transition-all duration-300 flex flex-col text-left relative overflow-hidden group">
            {/* Top Yellow Bar on Hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-4 mb-4">
              <div className="w-11 h-11 bg-saffron-50 border border-saffron-100 text-saffron-600 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Institution Builder</span>
                <h3 className="text-sm font-black text-navy-900">{language === 'te' ? 'విద్యా రంగంలో ప్రస్థానం' : 'Educational Leadership'}</h3>
              </div>
            </div>
            <h4 className="font-extrabold text-navy-950 text-xs sm:text-sm mb-2 leading-snug">{eduTitle}</h4>
            <p className="text-slate-500 text-xs leading-relaxed justify-clean">{eduContent}</p>
          </div>

          {/* Track 2: Public Service Journey */}
          <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-6 shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-saffron-400/60 transition-all duration-300 flex flex-col text-left relative overflow-hidden group">
            {/* Top Yellow Bar on Hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center space-x-4 border-b border-slate-100 pb-4 mb-4">
              <div className="w-11 h-11 bg-saffron-50 border border-saffron-100 text-saffron-600 rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Political & Social Carrier</span>
                <h3 className="text-sm font-black text-navy-900">{language === 'te' ? 'రాజకీయ & సామాజిక ప్రయాణం' : 'Public Service Career'}</h3>
              </div>
            </div>
            <h4 className="font-extrabold text-navy-950 text-xs sm:text-sm mb-2 leading-snug">{publicTitle}</h4>
            <p className="text-slate-500 text-xs leading-relaxed justify-clean">{publicContent}</p>
          </div>
        </div>

        {/* ── Signature Quote Card (Gold Border Accent) ───────────────── */}
        <div className="bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-3xl p-6 sm:p-8 text-center text-navy-900 relative overflow-hidden shadow-lg mb-10 sm:mb-16 border border-saffron-500 flex flex-col items-center">
          <div className="absolute top-4 left-6 text-navy-950/5 font-serif text-8xl pointer-events-none select-none">“</div>
          <Quote className="w-7 h-7 text-navy-950 mb-4 stroke-[2.5]" />
          <p className="text-sm sm:text-base italic leading-relaxed max-w-3xl mx-auto mb-6 text-navy-900 font-extrabold justify-clean">
            &ldquo;{quoteText}&rdquo;
          </p>
          <div className="flex flex-col items-center">
            <div className="w-12 h-0.5 bg-navy-950/20 mb-2 rounded-full" />
            <span className="block text-xs font-black text-navy-950 uppercase tracking-widest">— {quoteAuthor}</span>
          </div>
        </div>

        {/* ── Interactive Tabs: Focus Areas & Core Values ─────────────── */}
        <div className="mb-10 sm:mb-16">
          <div className="flex justify-center mb-8 bg-slate-200/50 p-1 rounded-full max-w-sm mx-auto border border-slate-200">
            <button
              onClick={() => setActiveTab('vision')}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'vision'
                  ? 'bg-navy-900 text-saffron-400 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{localT.visionTab[language]}</span>
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'values'
                  ? 'bg-navy-900 text-saffron-400 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{localT.valuesTab[language]}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'vision' ? (
              <motion.div
                key="vision-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 text-left"
              >
                {displayFocusAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start space-x-3 hover:border-saffron-400 hover:shadow-md hover:scale-[1.01] transition-all duration-300 group"
                  >
                    <CheckCircle2 className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-slate-700 text-sm sm:text-xs font-bold leading-relaxed">{area}</span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="values-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-left items-start sm:items-stretch"
              >
                {displayValues.map((v, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-saffron-400/80 hover:shadow-md hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group/val flex flex-col justify-start sm:justify-between sm:min-h-[135px] text-left sm:text-center"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-400 opacity-0 group-hover/val:opacity-100 transition-opacity" />
                    <span className="block font-black text-navy-900 text-base sm:text-sm mb-1.5">{v.name}</span>
                    <p className="text-slate-600 text-sm sm:text-[11px] leading-relaxed font-semibold sm:mt-auto">{v.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FAQ Accordion Section ──────────────────────────────────── */}
        <div className="mb-10 sm:mb-16">
          <h3 className="text-2xl font-black text-navy-900 mb-8 text-center flex items-center justify-center">
            <HelpCircle className="w-5.5 h-5.5 mr-2 text-saffron-600 animate-pulse" />
            {t('faq.sectionTitle')}
          </h3>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              { q: t('faq.q1'), a: t('faq.a1') },
              { q: t('faq.q2'), a: t('faq.a2') },
              { q: t('faq.q3'), a: t('faq.a3') },
              { q: t('faq.q4'), a: t('faq.a4') },
              { q: t('faq.q5'), a: t('faq.a5') },
              { q: t('faq.q6'), a: t('faq.a6') },
              { q: t('faq.q7'), a: t('faq.a7') },
              { q: t('faq.q8'), a: t('faq.a8') }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                    isOpen ? 'border-saffron-500 shadow-md' : 'border-slate-200 hover:border-saffron-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <span className="font-black text-navy-900 text-xs sm:text-sm leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${
                        isOpen ? 'rotate-180 text-saffron-600' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 pt-2 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100/60 justify-clean text-left whitespace-pre-line font-medium">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Profile Summary Card ───────────────────────────────────── */}
        <div className="bg-white border-2 border-slate-200/80 rounded-3xl p-8 shadow-sm text-center max-w-3xl mx-auto border-t-4 border-t-saffron-500 relative overflow-hidden group hover:border-saffron-400/60 transition-all duration-300">
          <h3 className="text-base font-black text-navy-900 mb-3 flex items-center justify-center uppercase tracking-wide">
            <FileText className="w-5 h-5 mr-2 text-saffron-600" />
            {localT.summaryTitle[language]}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed justify-clean font-semibold">
            {summaryContent}
          </p>
        </div>

      </div>
    </div>
  )
}
