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
  ChevronDown
} from 'lucide-react'

const sectors = [
  {
    id: 'education',
    icon: BookOpen,
    title: 'Education',
    short: 'Modernizing primary schools and promoting digital labs in high schools.',
    vision: 'Establishing smart classrooms in rural public schools, enhancing vocational and skill-oriented secondary courses, and expanding college fellowship funds.',
    concerns: ['Digital divide in remote rural government schools.', 'Need for updated market-aligned curriculum in polytechnic colleges.']
  },
  {
    id: 'healthcare',
    icon: HeartPulse,
    title: 'Healthcare',
    short: 'Supporting primary medical centers and state health facilities.',
    vision: 'Advocating for central grants to build state-of-the-art trauma centers, increasing funding for community clinics, and improving drinking water sanitation to prevent local water-borne illnesses.',
    concerns: ['Shortage of specialist doctors in taluk and block level clinics.', 'Clean drinking water access in arid zones.']
  },
  {
    id: 'agriculture',
    icon: Sprout,
    title: 'Agriculture',
    short: 'Expanding solar irrigation, cold storage facilities, and fair crop subsidies.',
    vision: 'Encouraging minor irrigation projects, solar-powered pump distribution, setting up food processing units close to farming fields, and ensuring prompt settlement of crop insurance claims.',
    concerns: ['Erratic monsoon rains and lack of storage facilities leading to waste.', 'Inadequate market access for minor forest produce cultivators.']
  },
  {
    id: 'infrastructure',
    icon: Navigation,
    title: 'Infrastructure',
    short: 'Pushing for highway connectivity and industrial port upgrades.',
    vision: 'Driving policies to construct secondary road links connecting farming villages to national highways, and pushing for faster execution of coastal highway corridors.',
    concerns: ['Maintenance gaps in rural arterial roads.', 'Congestion near major transport checkposts.']
  },
  {
    id: 'employment',
    icon: Briefcase,
    title: 'Employment',
    short: 'Promoting vocational skill centers and startup ecosystems.',
    vision: 'Supporting training institutes that focus on modern skills like green-energy technicians, solar installers, and digital support assistants.',
    concerns: ['Under-employment among educated youth in tier-2 towns.', 'Lack of localized tech incubator spaces.']
  },
  {
    id: 'welfare',
    icon: Users,
    title: 'Women & Youth Welfare',
    short: 'Empowering self-help groups and youth sports development.',
    vision: 'Strengthening credit access for rural women self-help networks, expanding scholarship reach, and establishing rural sports development fields.',
    concerns: ['Drop-out rates among female students in higher secondary schools.', 'Underfunded local community centers.']
  },
  {
    id: 'digital',
    icon: Cpu,
    title: 'Digital Development',
    short: 'Bringing fiber-grid loops to remote villages.',
    vision: 'Ensuring 100% network connectivity in public offices, advocating for cheaper broadband infrastructure, and establishing local common service kiosks.',
    concerns: ['Incomplete telecom loop infrastructure in interior villages.', 'Digital literacy gaps among senior citizens.']
  },
  {
    id: 'environment',
    icon: Leaf,
    title: 'Environment',
    short: 'Promoting afforestation and clean river initiatives.',
    vision: 'Fostering community-led afforestation, campaigning against industrial river discharges, and boosting renewable solar panel farms.',
    concerns: ['Depletion of ground water tables.', 'Plastic accumulation in river basins.']
  }
]

export default function StateFocusPage() {
  const [expandedSector, setExpandedSector] = useState<string | null>(null)

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
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">State-Level Commitments</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            State Focus & Priority Sectors
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Our legislative agenda focuses on state-wide development concerns. Below are the priority sectors and policy issues currently being tracked by the office of Hon. MP Bhashyam Ramakrishna.
          </p>
        </div>

        {/* Priority Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectors.map((sec) => {
            const Icon = sec.icon
            const isExpanded = expandedSector === sec.id

            return (
              <div 
                key={sec.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => toggleSector(sec.id)}
                  className="w-full p-6 text-left flex items-start justify-between focus:outline-none"
                >
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                      <Icon className="w-6 h-6 text-saffron-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900">{sec.title}</h3>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{sec.short}</p>
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
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Development Vision</span>
                          <p className="text-xs text-slate-600 leading-relaxed">{sec.vision}</p>
                        </div>
                        
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Key Focus Points & Concerns</span>
                          <ul className="space-y-1">
                            {sec.concerns.map((con, cIdx) => (
                              <li key={cIdx} className="text-xs text-slate-600 flex items-start">
                                <span className="text-saffron-600 mr-2">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
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
