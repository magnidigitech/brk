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
  Sparkles
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

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
  const [expandedSector, setExpandedSector] = useState<string | null>(null)
  const { tContent } = useLanguage()

  const toggleSector = (id: string) => {
    if (expandedSector === id) {
      setExpandedSector(null)
    } else {
      setExpandedSector(id)
    }
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 relative pb-4">
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">State-Level Commitments</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            State Focus & Priority Sectors
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Our legislative agenda focuses on state-wide development concerns. Below are the priority sectors and policy issues currently being tracked by our office.
          </p>
          <div className="w-24 h-1 bg-saffron-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Priority Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectors.map((sec) => {
            const IconComponent = sec.iconName && iconMap[sec.iconName] ? iconMap[sec.iconName] : Sparkles
            const isExpanded = expandedSector === sec._id
            
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
                className={`bg-white border-2 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 relative hover:scale-[1.01] hover:shadow-md ${
                  isExpanded ? 'border-saffron-500' : 'border-slate-200 hover:border-saffron-400/80'
                }`}
              >
                {isExpanded && <div className="absolute top-0 left-0 right-0 h-1 bg-saffron-500"></div>}
                <button
                  onClick={() => toggleSector(sec._id)}
                  className="w-full p-6 text-left flex items-start justify-between focus:outline-none"
                >
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                      <IconComponent className="w-6 h-6 text-saffron-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900">{title}</h3>
                      {short && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{short}</p>}
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 mt-1 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4">
                        {vision && (
                          <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Development Vision</span>
                            <p className="text-xs text-slate-600 leading-relaxed">{vision}</p>
                          </div>
                        )}
                        
                        {concerns && concerns.length > 0 && (
                          <div>
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Key Focus Points & Concerns</span>
                            <ul className="space-y-1">
                              {concerns.map((con, cIdx) => (
                                <li key={cIdx} className="text-xs text-slate-600 flex items-start">
                                  <span className="text-saffron-600 mr-2">•</span>
                                  <span>{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
