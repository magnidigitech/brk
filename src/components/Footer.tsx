import Link from 'next/link'
import { Landmark, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 text-slate-300 border-t-2 border-saffron-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <Landmark className="w-5 h-5 text-saffron-500" />
              </div>
              <div>
                <span className="block font-bold text-white uppercase tracking-wider text-base">
                  Bhashyam Ramakrishna
                </span>
                <span className="block text-xs text-saffron-400 font-semibold tracking-wider uppercase">
                  Member of Parliament (Rajya Sabha)
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mt-3 leading-relaxed">
              Dedicated to representing the voices, issues, and growth of our citizens in the Parliament of India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Resources & Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-saffron-500 transition-colors">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-saffron-500 transition-colors">
                  About MP
                </Link>
              </li>
              <li>
                <Link href="/state-focus" className="hover:text-saffron-500 transition-colors">
                  State Focus
                </Link>
              </li>
              <li>
                <Link href="/development-works" className="hover:text-saffron-500 transition-colors">
                  Public Initiatives
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-saffron-500 transition-colors">
                  Contact Office
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-saffron-500 transition-colors">
                  Public Grievance Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Office Contacts
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 text-saffron-500 shrink-0 mt-0.5" />
                <span>
                  12, Rajya Sabha Members Residences,
                  New Delhi - 110001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-saffron-500" />
                <span>+91 11 2301 XXXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2.5 text-saffron-500" />
                <span>contact@bramakrishna.mp.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} Office of Bhashyam Ramakrishna, MP. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">
            This is the official public portal for citizen grievance redressal, policy initiatives, and updates.
          </p>
        </div>
      </div>
    </footer>
  )
}
