'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, GraduationCap, Award, Compass, ShieldCheck, CheckCircle2, Quote, Lightbulb, HelpCircle, ChevronDown, Volume2, VolumeX } from 'lucide-react'
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

  // Localize page settings
  const title = tContent(data.title, 'Bhashyam Ramakrishna')
  const subtitle = tContent(data.subtitle, 'A Visionary Educationist | A Committed Public Leader | A Voice for AP')
  const badgeText = getRoleTitle(language)
  const profileShortName = tContent(data.profileShortName, 'B. Ramakrishna')
  const bioParagraph1 = tContent(data.bioParagraph1, 'Bhashyam Ramakrishna is a respected educationist, institution builder, and public service leader from Andhra Pradesh. With decades of dedicated work in the field of education, he has played a significant role in shaping the academic journey of thousands of students through Bhashyam Educational Institutions.')
  const bioParagraph2 = tContent(data.bioParagraph2, 'Known for his disciplined approach, service-oriented mindset, and strong commitment to youth development, Bhashyam Ramakrishna has built a reputation as a leader who believes that education is the foundation for social progress. His work has always focused on empowering students, supporting families, and contributing to the growth of society through quality education and value-based learning.')

  const eduTitle = tContent(data.eduTitle, 'Founder Chairman of Bhashyam Educational Institutions')
  const eduContent = tContent(data.eduContent, 'Under Bhashyam Ramakrishna\'s leadership, the Bhashyam group has grown into one of the well-known educational networks in Andhra Pradesh and Telangana. His vision has always been to make quality education accessible, structured, and result-oriented. His belief is simple and powerful: when students are guided with the right education, values, and confidence, they can build a better future for themselves, their families, and the nation.')
  
  const publicTitle = tContent(data.publicTitle, 'Public Service Journey')
  const publicContent = tContent(data.publicContent, 'Beyond education, Bhashyam Ramakrishna has remained closely connected with public service and social development. His journey reflects a strong commitment to people, especially students, youth, parents, teachers, and communities that seek better opportunities. His public service approach is rooted in listening to people, understanding their challenges, and working towards practical solutions. As a Rajya Sabha candidate from Andhra Pradesh nominated by the Telugu Desam Party (TDP), Bhashyam Ramakrishna represents a leadership profile built on education, discipline, development, and service.')

  const quoteText = tContent(data.quoteText, 'Education has the power to change lives, strengthen families, and build the future of our society. My journey has always been guided by the belief that service to people is the highest responsibility. My team and I remain committed to working for the progress of Andhra Pradesh, the empowerment of youth, and the development of our nation.')
  const quoteAuthor = tContent(data.quoteAuthor, 'Bhashyam Ramakrishna')
  const summaryContent = tContent(data.summaryContent, 'Bhashyam Ramakrishna is an educationist, Founder Chairman of Bhashyam Educational Institutions, and a public service leader from Andhra Pradesh. With decades of contribution to education and social development, he continues to work with a vision to empower youth, support families, and contribute to the progress of society. His journey from education to public service reflects his commitment to creating meaningful change and serving people with dedication, discipline, and responsibility.')

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

  // Combine readable texts for biography
  const readableBioText = `${profileShortName}. ${bioParagraph1} ${bioParagraph2} ${eduTitle}. ${eduContent} ${publicTitle}. ${publicContent}`
  const { speak, pause, stop, state: ttsState, supported: ttsSupported } = useTextToSpeech(readableBioText, language)

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
 
        {/* Page Header */}
        <div className="text-center mb-16 relative pb-4">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-saffron-100 text-saffron-600 mb-3 uppercase tracking-wider border border-saffron-200 shadow-sm">
            {badgeText}
          </span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-slate-600 text-sm font-semibold max-w-xl mx-auto uppercase tracking-wide">
            {subtitle}
          </p>
          <div className="w-24 h-1 bg-saffron-500 mx-auto mt-4 rounded-full"></div>

          {/* TTS Player Bar */}
          {ttsSupported && (
            <div className="flex items-center justify-center mt-6 space-x-3 bg-white border border-slate-200/80 rounded-2xl px-4 py-2 max-w-xs mx-auto shadow-sm">
              <button
                type="button"
                onClick={ttsState === 'playing' ? pause : speak}
                className="flex items-center justify-center p-2 rounded-xl bg-saffron-100 hover:bg-saffron-200 text-navy-900 transition-colors cursor-pointer"
                title={ttsState === 'playing' ? 'Pause narration' : 'Play biography narration'}
              >
                {ttsState === 'playing' ? (
                  <VolumeX className="w-4 h-4 mr-2 animate-pulse text-rose-600" />
                ) : (
                  <Volume2 className="w-4 h-4 mr-2 text-saffron-600" />
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
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-bold"
                  title="Stop narration"
                >
                  {language === 'te' ? 'ముగించు' : 'Stop'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Card & Bio with TDP Yellow Frame Accents */}
        <div className="bg-white border-2 border-slate-200/80 rounded-3xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.005] hover:border-saffron-300/60 transition-all duration-300 grid grid-cols-1 md:grid-cols-3 mb-16 relative">
          <div className="bg-gradient-to-br from-saffron-300 via-saffron-400 to-saffron-500 p-8 flex flex-col justify-between text-navy-900 md:col-span-1 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <h2 className="text-2xl font-black tracking-wide mb-6 text-navy-900">{profileShortName}</h2>

              <div className="space-y-5 text-sm text-navy-900/80">
                <div>
                  <span className="block text-[10px] text-navy-900/60 font-bold uppercase tracking-wider">Nomination</span>
                  <span className="font-semibold text-navy-900">{badgeText}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-navy-900/60 font-bold uppercase tracking-wider">State Represented</span>
                  <span className="font-semibold text-navy-900">{stateRepresented}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-navy-900/60 font-bold uppercase tracking-wider">Party Association</span>
                  <span className="font-extrabold text-navy-950">{partyName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:col-span-2 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center">
              <Compass className="w-5 h-5 mr-2 text-saffron-600" />
              Public Service Profile
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-4 justify-clean">
              {bioParagraph1}
            </p>
            <p className="text-slate-600 leading-relaxed text-sm justify-clean">
              {bioParagraph2}
            </p>
          </div>
        </div>

        {/* Educational Leadership */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-16 grid grid-cols-1 md:grid-cols-4 gap-8 hover:border-saffron-200/50 transition-all">
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <div className="w-14 h-14 rounded-2xl bg-saffron-50 flex items-center justify-center mb-4 border border-saffron-100">
              <GraduationCap className="w-7 h-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-bold text-navy-900">Educational Leadership</h3>
          </div>

          <div className="md:col-span-3 text-sm text-slate-600 leading-relaxed space-y-3">
            <h4 className="font-bold text-navy-900 text-base">{eduTitle}</h4>
            <p className="justify-clean">{eduContent}</p>
          </div>
        </div>

        {/* Public Service Journey */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-16 grid grid-cols-1 md:grid-cols-4 gap-8 hover:border-saffron-200/50 transition-all">
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <div className="w-14 h-14 rounded-2xl bg-saffron-50 flex items-center justify-center mb-4 border border-saffron-100">
              <Landmark className="w-7 h-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-bold text-navy-900">{publicTitle}</h3>
          </div>

          <div className="md:col-span-3 text-sm text-slate-600 leading-relaxed space-y-3">
            <p className="justify-clean">{publicContent}</p>
          </div>
        </div>

        {/* Vision for Public Life */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-navy-900 mb-8 text-center flex items-center justify-center">
            <Lightbulb className="w-6 h-6 mr-2 text-saffron-600 animate-pulse" />
            Vision for Public Life
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayFocusAreas.map((area, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start space-x-3 hover:border-saffron-400 hover:shadow-md transition-all duration-300"
              >
                <CheckCircle2 className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 text-xs font-semibold leading-relaxed">{area}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leadership Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-navy-900 mb-8 text-center flex items-center justify-center">
            <Award className="w-6 h-6 mr-2 text-saffron-600" />
            Leadership Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {displayValues.map((v, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm text-center hover:border-saffron-400/80 hover:shadow-md transition-all duration-300 relative overflow-hidden group/val"
              >
                {/* Subtle top saffron indicator bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-400 opacity-0 group-hover/val:opacity-100 transition-opacity" />
                <span className="block font-extrabold text-navy-900 text-sm mb-2">{v.name}</span>
                <p className="text-slate-500 text-[10px] leading-relaxed font-medium">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message Quote in Yellow Frame */}
        <div className="bg-saffron-400 rounded-3xl p-8 text-center text-navy-900 relative overflow-hidden shadow-lg mb-16 border-2 border-saffron-500">
          <div className="absolute top-4 left-6 text-navy-900/5 font-serif text-8xl pointer-events-none select-none">“</div>
          <Quote className="w-8 h-8 text-navy-950 mx-auto mb-4" />
          <p className="text-base italic leading-relaxed max-w-3xl mx-auto mb-6 text-navy-900 font-medium">
            &ldquo;{quoteText}&rdquo;
          </p>
          <span className="block text-xs font-bold text-navy-950 uppercase tracking-widest">— {quoteAuthor}</span>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-navy-900 mb-8 text-center flex items-center justify-center">
            <HelpCircle className="w-6 h-6 mr-2 text-saffron-600 animate-pulse" />
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
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-saffron-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-navy-900 text-sm leading-snug">{faq.q}</span>
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
                        <div className="px-6 pb-5 pt-2 text-slate-600 text-xs leading-relaxed border-t border-slate-100/60 justify-clean text-left whitespace-pre-line">
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

        {/* Profile Summary Card with TDP yellow border framing */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center max-w-3xl mx-auto border-t-4 border-t-saffron-500">
          <h3 className="text-lg font-bold text-navy-900 mb-3">Profile Summary</h3>
          <p className="text-slate-600 text-xs leading-relaxed justify-clean">
            {summaryContent}
          </p>
        </div>

      </div>
    </div>
  )
}
