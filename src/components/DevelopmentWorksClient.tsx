'use client'

import { motion } from 'framer-motion'
import { Landmark, Compass, ShieldCheck, Sparkles } from 'lucide-react'
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

export default function DevelopmentWorksClient({ projects }: DevelopmentWorksClientProps) {
  const { tContent } = useLanguage()

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 relative pb-4">
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">Development & Initiatives</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            Development Works & Public Initiatives
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Monitoring, advocating, and allocating funds for key state development works and policy initiatives across Andhra Pradesh.
          </p>
          <div className="w-24 h-1 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* MPLADS Section with yellow accent border */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm mb-16 flex flex-col md:flex-row items-center gap-8 border-l-8 border-l-saffron-500 relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
            <Landmark className="w-8 h-8 text-saffron-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">MPLADS Fund Oversight & Vision</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Under the Member of Parliament Local Area Development Scheme (MPLADS), Rajya Sabha members can recommend works in one or more districts of the State from which they are elected. Hon. MP Bhashyam Ramakrishna coordinates with state district collectors to execute public works of drinking water, sanitation, public healthcare centers, road repairs, and school libraries.
            </p>
            <span className="inline-flex items-center text-xs font-bold text-saffron-600">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              100% Transparency & Citizen Focus
            </span>
          </div>
        </div>

        {/* Development Projects Grid */}
        <h3 className="text-2xl font-black text-navy-900 mb-8 text-center">Active Initiatives & Pushes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj, idx) => {
            const category = tContent(proj.category)
            const title = tContent(proj.title)
            const location = tContent(proj.location)
            const desc = tContent(proj.desc)
            const progress = tContent(proj.progress, 'Active')

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-saffron-400 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    {category && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {category}
                      </span>
                    )}
                    {location && (
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center">
                        <Compass className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {location}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-base font-bold text-navy-900 mb-2">{title}</h4>
                  {desc && <p className="text-xs text-slate-500 leading-relaxed mb-4">{desc}</p>}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</span>
                  <span className="text-xs font-bold text-saffron-600 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-saffron-500 animate-pulse" />
                    {progress}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
