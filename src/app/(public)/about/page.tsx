'use client'

import { motion } from 'framer-motion'
import { Landmark, GraduationCap, Award, Compass, ShieldCheck, CheckCircle2, Quote, Lightbulb } from 'lucide-react'

const keyFocusAreas = [
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

const values = [
  { name: 'Discipline', desc: 'The baseline for all successful educational and social institutions.' },
  { name: 'Education', desc: 'The core pillar of public progress and individual empowerment.' },
  { name: 'Service', desc: 'The highest responsibility of public and political leadership.' },
  { name: 'Integrity', desc: 'A transparent commitment to honest governance and representation.' },
  { name: 'Social Progress', desc: 'Driving inclusive and long-term socio-economic growth.' }
]

export default function AboutPage() {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-saffron-100 text-saffron-600 mb-3 uppercase tracking-wider">
            Rajya Sabha Candidate
          </span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-3">
            Bhashyam Ramakrishna
          </h1>
          <p className="text-slate-500 text-sm font-semibold max-w-xl mx-auto uppercase tracking-wide">
            A Visionary Educationist | A Committed Public Leader | A Voice for AP
          </p>
        </div>

        {/* Profile Card & Bio */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md grid grid-cols-1 md:grid-cols-3 mb-16">
          <div className="bg-navy-900 p-8 flex flex-col justify-between text-white md:col-span-1">
            <div>
              <h2 className="text-2xl font-black tracking-wide mb-6">B. Ramakrishna</h2>

              <div className="space-y-4 text-sm text-slate-300">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomination</span>
                  <span className="font-semibold text-white">Rajya Sabha Candidate</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">State Represented</span>
                  <span className="font-semibold text-white">Andhra Pradesh</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Party Association</span>
                  <span className="font-semibold text-white">Telugu Desam Party (TDP)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:col-span-2 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center">
              <Compass className="w-5 h-5 mr-2 text-saffron-600" />
              Public Service Profile
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm mb-4">
              Bhashyam Ramakrishna is a respected educationist, institution builder, and public service leader from Andhra Pradesh. With decades of dedicated work in the field of education, he has played a significant role in shaping the academic journey of thousands of students through Bhashyam Educational Institutions.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Known for his disciplined approach, service-oriented mindset, and strong commitment to youth development, Bhashyam Ramakrishna has built a reputation as a leader who believes that education is the foundation for social progress. His work has always focused on empowering students, supporting families, and contributing to the growth of society through quality education and value-based learning.
            </p>
          </div>
        </div>

        {/* Educational Leadership */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <div className="w-14 h-14 rounded-2xl bg-saffron-50 flex items-center justify-center mb-4 border border-saffron-100">
              <GraduationCap className="w-7 h-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-bold text-navy-900">Educational Leadership</h3>
          </div>

          <div className="md:col-span-3 text-sm text-slate-600 leading-relaxed space-y-3">
            <h4 className="font-bold text-navy-900 text-base">Founder Chairman of Bhashyam Educational Institutions</h4>
            <p>
              Under Bhashyam Ramakrishna&apos;s leadership, the Bhashyam group has grown into one of the well-known educational networks in Andhra Pradesh and Telangana. His vision has always been to make quality education accessible, structured, and result-oriented.
            </p>
            <p>
              His belief is simple and powerful: when students are guided with the right education, values, and confidence, they can build a better future for themselves, their families, and the nation.
            </p>
          </div>
        </div>

        {/* Public Service Journey */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <div className="w-14 h-14 rounded-2xl bg-saffron-50 flex items-center justify-center mb-4 border border-saffron-100">
              <Landmark className="w-7 h-7 text-saffron-600" />
            </div>
            <h3 className="text-base font-bold text-navy-900">Public Service Journey</h3>
          </div>

          <div className="md:col-span-3 text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Beyond education, Bhashyam Ramakrishna has remained closely connected with public service and social development. His journey reflects a strong commitment to people, especially students, youth, parents, teachers, and communities that seek better opportunities.
            </p>
            <p>
              His public service approach is rooted in listening to people, understanding their challenges, and working towards practical solutions. As a Rajya Sabha candidate from Andhra Pradesh nominated by the Telugu Desam Party (TDP), Bhashyam Ramakrishna represents a leadership profile built on education, discipline, development, and service.
            </p>
          </div>
        </div>

        {/* Vision for Public Life */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-navy-900 mb-8 text-center flex items-center justify-center">
            <Lightbulb className="w-6 h-6 mr-2 text-saffron-600" />
            Vision for Public Life
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyFocusAreas.map((area, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start space-x-3"
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {values.map((v, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
                <span className="block font-bold text-navy-900 text-sm mb-2">{v.name}</span>
                <p className="text-slate-500 text-[10px] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Quote */}
        <div className="bg-navy-900 rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-lg mb-16">
          <div className="absolute top-4 left-6 text-white/5 font-serif text-8xl pointer-events-none select-none">“</div>
          <Quote className="w-8 h-8 text-saffron-500 mx-auto mb-4" />
          <p className="text-base italic leading-relaxed max-w-3xl mx-auto mb-6 text-slate-200">
            &ldquo;Education has the power to change lives, strengthen families, and build the future of our society. My journey has always been guided by the belief that service to people is the highest responsibility. I remain committed to working for the progress of Andhra Pradesh, the empowerment of youth, and the development of our nation.&rdquo;
          </p>
          <span className="block text-xs font-bold text-saffron-400 uppercase tracking-widest">— Bhashyam Ramakrishna</span>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-navy-900 mb-3">Profile Summary</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Bhashyam Ramakrishna is an educationist, Founder Chairman of Bhashyam Educational Institutions, and a public service leader from Andhra Pradesh. With decades of contribution to education and social development, he continues to work with a vision to empower youth, support families, and contribute to the progress of society. His journey from education to public service reflects his commitment to creating meaningful change and serving people with dedication, discipline, and responsibility.
          </p>
        </div>

      </div>
    </div>
  )
}
