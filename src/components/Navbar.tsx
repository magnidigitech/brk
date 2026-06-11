'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Landmark, FileText, LifeBuoy, Image as ImageIcon } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Landmark className="w-6 h-6 text-saffron-500" />
              </div>
              <div>
                <span className="block font-bold text-lg text-navy-900 tracking-wide leading-tight uppercase">
                  B. Ramakrishna
                </span>
                <span className="block text-xs font-semibold text-saffron-600 tracking-widest uppercase">
                  Rajya Sabha MP
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-semibold text-navy-900 hover:text-saffron-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              About MP
            </Link>
            <Link
              href="/state-focus"
              className="text-sm font-semibold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              State Focus
            </Link>
            <Link
              href="/development-works"
              className="text-sm font-semibold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              Public Initiatives
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-slate-600 hover:text-saffron-600 transition-colors"
            >
              Contact Office
            </Link>
            <Link
              href="/grievance"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 border border-navy-900 shadow-md transition-all hover:-translate-y-0.5"
            >
              <LifeBuoy className="w-4 h-4 mr-2 text-saffron-500" />
              Grievance Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md transition-all">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-navy-900 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              About MP
            </Link>
            <Link
              href="/state-focus"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              State Focus
            </Link>
            <Link
              href="/development-works"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              Public Initiatives
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              Contact Office
            </Link>
            <Link
              href="/grievance"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-3 mt-2 rounded-md text-base font-bold text-white bg-navy-900 hover:bg-navy-800"
            >
              <LifeBuoy className="w-5 h-5 mr-2 text-saffron-500" />
              Grievance Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
