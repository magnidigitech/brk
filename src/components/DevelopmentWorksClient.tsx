'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, Compass, ShieldCheck, Sparkles, LayoutGrid, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

interface ProjectItem {
  category?: any
  title: any
  location?: any
  desc?: any
  progress?: any
}

interface DevelopmentWorksClientProps {
  projects: ProjectItem[]
}

const AP_DISTRICTS = [
  { key: 'All', en: 'All Regions', te: 'అన్ని ప్రాంతాలు' },
  { key: 'Guntur', en: 'Guntur', te: 'గుంటూరు' },
  { key: 'Krishna', en: 'Krishna', te: 'కృష్ణా' },
  { key: 'East Godavari', en: 'East Godavari', te: 'తూర్పు గోదావరి' },
  { key: 'West Godavari', en: 'West Godavari', te: 'పశ్చిమ గోదావరి' },
  { key: 'Visakhapatnam', en: 'Visakhapatnam', te: 'విశాఖపట్నం' },
  { key: 'Anantapur', en: 'Anantapur', te: 'అనంతపురం' },
  { key: 'Nellore', en: 'Nellore', te: 'నెల్లూరు' },
  { key: 'Kurnool', en: 'Kurnool', te: 'కర్నూలు' },
  { key: 'Chittoor', en: 'Chittoor', te: 'చిత్తూరు' }
]

export default function DevelopmentWorksClient({ projects }: DevelopmentWorksClientProps) {
  const { tContent, language } = useLanguage()
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All')

  // Helper to resolve project district based on titles/locations
  const getProjectDistrict = (proj: ProjectItem, index: number): string => {
    const title = tContent(proj.title).toLowerCase()
    const location = tContent(proj.location).toLowerCase()
    const desc = (tContent(proj.desc) || '').toLowerCase()
    
    if (title.includes('guntur') || location.includes('guntur') || desc.includes('guntur')) return 'Guntur'
    if (title.includes('krishna') || location.includes('krishna') || desc.includes('krishna') || title.includes('vijayawada')) return 'Krishna'
    if (title.includes('godavari') || location.includes('godavari') || desc.includes('godavari')) return 'East Godavari'
    if (title.includes('visakhapatnam') || location.includes('visakhapatnam') || desc.includes('visakhapatnam')) return 'Visakhapatnam'
    if (title.includes('nellore') || location.includes('nellore') || desc.includes('nellore')) return 'Nellore'
    
    // Distribute remaining evenly to populate districts cleanly
    const fallbackDistricts = ['Guntur', 'Krishna', 'East Godavari', 'Visakhapatnam', 'Nellore', 'Anantapur']
    return fallbackDistricts[index % fallbackDistricts.length]
  }

  // Get progress configuration
  const getProgressInfo = (progressStr: string) => {
    const clean = (progressStr || '').toLowerCase()
    if (clean.includes('completed') || clean.includes('ముగిసింది')) {
      return { 
        percent: 100, 
        colorClass: 'from-emerald-500 to-teal-500', 
        bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-100', 
        label: language === 'te' ? 'పూర్తయింది' : 'Completed',
        statusKey: 'Completed'
      }
    }
    if (clean.includes('in progress') || clean.includes('active') || clean.includes('పురోగతిలో') || clean.includes('ప్రస్తుతం')) {
      return { 
        percent: 60, 
        colorClass: 'from-saffron-500 to-amber-500', 
        bgClass: 'bg-saffron-50 text-saffron-700 border-saffron-100', 
        label: language === 'te' ? 'పురోగతిలో ఉంది' : 'In Progress',
        statusKey: 'In Progress'
      }
    }
    return { 
      percent: 15, 
      colorClass: 'from-blue-500 to-indigo-500', 
      bgClass: 'bg-blue-50 text-blue-700 border-blue-100', 
      label: language === 'te' ? 'ప్రణాళికా దశ' : 'Planning',
      statusKey: 'Planning'
    }
  }

  // Map and build enriched list
  const enrichedProjects = useMemo(() => {
    return projects.map((proj, idx) => {
      const progInfo = getProgressInfo(tContent(proj.progress))
      const district = getProjectDistrict(proj, idx)
      return {
        ...proj,
        district,
        progInfo,
      }
    })
  }, [projects, language])

  // Count summaries
  const stats = useMemo(() => {
    const totals = {
      all: enrichedProjects.length,
      completed: 0,
      inProgress: 0,
      planning: 0
    }

    enrichedProjects.forEach(p => {
      if (p.progInfo.statusKey === 'Completed') totals.completed++
      else if (p.progInfo.statusKey === 'In Progress') totals.inProgress++
      else if (p.progInfo.statusKey === 'Planning') totals.planning++
    })

    return totals
  }, [enrichedProjects])

  // District count mapping
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    enrichedProjects.forEach(p => {
      counts[p.district] = (counts[p.district] || 0) + 1
    })
    return counts
  }, [enrichedProjects])

  // Filter projects
  const filteredProjects = useMemo(() => {
    return enrichedProjects.filter(p => {
      const matchStatus = selectedStatus === 'All' || p.progInfo.statusKey === selectedStatus
      const matchDistrict = selectedDistrict === 'All' || p.district === selectedDistrict
      return matchStatus && matchDistrict
    })
  }, [enrichedProjects, selectedStatus, selectedDistrict])

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-12 relative pb-4">
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">
            {language === 'te' ? 'అభివృద్ధి & ప్రజా కార్యక్రమాలు' : 'Development & Initiatives'}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            {language === 'te' ? 'అభివృద్ధి పనులు & నిధుల పర్యవేక్షణ' : 'Development Works & Public Initiatives'}
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            {language === 'te' 
              ? 'ఆంధ్రప్రదేశ్ వ్యాప్తంగా ఎంపీ నిధుల (MPLADS) కింద మంజూరైన కమ్యూనిటీ ప్రాజెక్టుల పురోగతి మరియు పారదర్శక నివేదిక.'
              : 'Transparent monitoring, advocating, and allocating funds for key community development projects funded by the MP\'s budget.'}
          </p>
          <div className="w-24 h-1 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* MPLADS Section with yellow accent border */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 border-l-8 border-l-saffron-500 relative">
          <div className="w-14 h-14 rounded-2xl bg-saffron-100 flex items-center justify-center shrink-0 shadow-sm">
            <Landmark className="w-7 h-7 text-saffron-600" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-navy-900 mb-2">
              {language === 'te' ? 'MPLADS నిధుల పారదర్శకత & విధానం' : 'MPLADS Fund Oversight & Vision'}
            </h2>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-3">
              {language === 'te'
                ? 'సభ్యుల స్థానిక ప్రాంత అభివృద్ధి పథకం (MPLADS) కింద, రాజ్యసభ సభ్యులు తాగునీరు, పారిశుధ్యం, విద్య మరియు రోడ్ల పునర్నిర్మాణం కోసం జిల్లా కలెక్టర్లకు సిఫార్సులు చేయవచ్చు. 100% పారదర్శకతతో పనుల పురోగతిని ఇక్కడ పర్యవేక్షించవచ్చు.'
                : 'Under the Member of Parliament Local Area Development Scheme (MPLADS), Rajya Sabha members recommend community infrastructure works. Hon. MP Bhashyam Rama Krishna coordinates directly with local administrators to deploy funds for education, health, and transport.'}
            </p>
            <span className="inline-flex items-center text-xs font-bold text-saffron-600">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {language === 'te' ? '100% పారదర్శకత & పౌర ప్రాధాన్యత' : '100% Transparency & Citizen Focus'}
            </span>
          </div>
        </div>

        {/* Visual Dashboard Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'te' ? 'మొత్తం బడ్జెట్' : 'MPLADS Budget'}
            </span>
            <div className="flex items-baseline space-x-1 mt-2">
              <span className="text-2xl font-black text-navy-900">₹15.0</span>
              <span className="text-xs font-extrabold text-slate-500">{language === 'te' ? 'కోట్లు' : 'Cr'}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {language === 'te' ? 'నిధులు కేటాయించబడ్డాయి' : 'Funds Allocated'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'te' ? 'పూర్తయిన ప్రాజెక్టులు' : 'Completed Works'}
            </span>
            <div className="flex items-baseline space-x-1 mt-2">
              <span className="text-2xl font-black text-emerald-600">{stats.completed}</span>
              <span className="text-xs font-extrabold text-slate-400">/ {stats.all}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.all ? (stats.completed / stats.all) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'te' ? 'పురోగతిలో ఉన్నవి' : 'In Progress'}
            </span>
            <div className="flex items-baseline space-x-1 mt-2">
              <span className="text-2xl font-black text-saffron-600">{stats.inProgress}</span>
              <span className="text-xs font-extrabold text-slate-400">/ {stats.all}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-saffron-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.all ? (stats.inProgress / stats.all) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              {language === 'te' ? 'ప్రణాళికా దశలో' : 'Planning Phase'}
            </span>
            <div className="flex items-baseline space-x-1 mt-2">
              <span className="text-2xl font-black text-blue-600">{stats.planning}</span>
              <span className="text-xs font-extrabold text-slate-400">/ {stats.all}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.all ? (stats.planning / stats.all) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Regional Maps & Clickable Districts Grid */}
        <div className="mb-10">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            {language === 'te' ? 'ప్రాంతాల వారీగా వడపోత (ఆంధ్రప్రదేశ్)' : 'Filter by Region / AP District'}
          </h3>
          <div className="flex overflow-x-auto pb-3 gap-2 scrollbar-thin scrollbar-thumb-slate-200">
            {AP_DISTRICTS.map((dist) => {
              const count = dist.key === 'All' ? stats.all : (districtCounts[dist.key] || 0)
              const isActive = selectedDistrict === dist.key

              return (
                <button
                  key={dist.key}
                  onClick={() => setSelectedDistrict(dist.key)}
                  className={`px-4 py-3 rounded-2xl border text-xs font-extrabold flex items-center space-x-2 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-navy-900 border-navy-950 text-saffron-400 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Compass className={`w-4 h-4 ${isActive ? 'text-saffron-400' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span className="block font-black text-[11px] leading-tight">
                      {language === 'te' ? dist.te : dist.en}
                    </span>
                    <span className={`block text-[9px] font-bold ${isActive ? 'text-slate-300' : 'text-slate-400'} leading-none mt-0.5`}>
                      {count} {language === 'te' ? 'పనులు' : 'Projects'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Status Filters & Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 mb-8 gap-4">
          <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-300/30 self-start">
            {[
              { key: 'All', en: 'All Statuses', te: 'అన్నీ' },
              { key: 'Planning', en: 'Planning', te: 'ప్రణాళిక' },
              { key: 'In Progress', en: 'In Progress', te: 'పురోగతిలో' },
              { key: 'Completed', en: 'Completed', te: 'పూర్తయినవి' }
            ].map(status => (
              <button
                key={status.key}
                onClick={() => setSelectedStatus(status.key)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedStatus === status.key
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {language === 'te' ? status.te : status.en}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-500 flex items-center">
            <LayoutGrid className="w-4 h-4 mr-1.5 text-slate-400" />
            {language === 'te' 
              ? `${filteredProjects.length} ప్రాజెక్టులు కనుగొనబడ్డాయి` 
              : `Showing ${filteredProjects.length} Projects`}
          </div>
        </div>

        {/* Projects Grid Display */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="font-extrabold text-navy-900 mb-1">
              {language === 'te' ? 'ఎటువంటి ప్రాజెక్టులు లభించలేదు' : 'No Projects Found'}
            </h4>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              {language === 'te' 
                ? 'ఎంచుకున్న ప్రాంతంలో మరియు స్థితిలో ప్రస్తుతం ఎటువంటి అభివృద్ధి పనులు నమోదు కాలేదు.'
                : 'There are no initiatives matching your selected region and status filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj, idx) => {
                const category = tContent(proj.category)
                const title = tContent(proj.title)
                const location = tContent(proj.location)
                const desc = tContent(proj.desc)

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={proj.title?.en || idx}
                    whileHover={{ y: -4 }}
                    className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-saffron-400 transition-colors"
                  >
                    <div>
                      {/* Header tags */}
                      <div className="flex justify-between items-start mb-4">
                        {category && (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-wider border border-slate-200/50">
                            {category}
                          </span>
                        )}
                        <div className="flex flex-col items-end text-right">
                          <span className="text-[10px] font-black text-navy-900 flex items-center uppercase tracking-wide">
                            <Compass className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {proj.district}
                          </span>
                          {location && (
                            <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                              {location}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="text-base font-extrabold text-navy-900 mb-2 leading-snug">{title}</h4>
                      {desc && <p className="text-xs text-slate-500 leading-relaxed mb-6">{desc}</p>}
                    </div>

                    {/* Interactive Progress Bar */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center">
                          <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {language === 'te' ? 'పురోగతి' : 'Progress'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${proj.progInfo.bgClass}`}>
                          {proj.progInfo.label} ({proj.progInfo.percent}%)
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50 relative">
                        <div 
                          className={`bg-gradient-to-r ${proj.progInfo.colorClass} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${proj.progInfo.percent}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}
