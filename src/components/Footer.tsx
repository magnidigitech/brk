'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Landmark, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t, tContent } = useLanguage()

  const [settings, setSettings] = useState({
    candidateName: 'Bhashyam Ramakrishna' as any,
    roleBadge: 'Member of Parliament (Rajya Sabha)' as any,
    socialLinks: {
      instagram: 'https://www.instagram.com/ramakrishnabhashyam/',
      youtube: 'https://www.youtube.com/@bhashyamrakakrishnaoffical',
      twitter: 'https://x.com/bhashyambrk'
    },
    delhiOffice: {
      address: '12, Rajya Sabha Members Residences, New Delhi - 110001' as any,
      phone: '+91 11 2301 XXXX',
      email: 'delhi.office@bramakrishna.mp.in'
    },
    stateOffice: {
      address: 'Door No. 40-5-1, MG Road, Labbipet, Vijayawada, Andhra Pradesh - 520010' as any,
      phone: '+91 866 247 XXXX',
      email: 'state.office@bramakrishna.mp.in'
    }
  })

  useEffect(() => {
    import('@/sanity/lib/client').then(({ client }) => {
      client.fetch(`*[_type == "siteSettings"][0] {
        candidateName,
        roleBadge,
        socialLinks,
        delhiOffice,
        stateOffice
      }`)
        .then((data) => {
          if (data) {
            setSettings({
              candidateName: data.candidateName || 'Bhashyam Ramakrishna',
              roleBadge: data.roleBadge || 'Member of Parliament (Rajya Sabha)',
              socialLinks: {
                instagram: data.socialLinks?.instagram || 'https://www.instagram.com/ramakrishnabhashyam/',
                youtube: data.socialLinks?.youtube || 'https://www.youtube.com/@bhashyamrakakrishnaoffical',
                twitter: data.socialLinks?.twitter || 'https://x.com/bhashyambrk'
              },
              delhiOffice: {
                address: data.delhiOffice?.address || '12, Rajya Sabha Members Residences, New Delhi - 110001',
                phone: data.delhiOffice?.phone || '+91 11 2301 XXXX',
                email: data.delhiOffice?.email || 'delhi.office@bramakrishna.mp.in'
              },
              stateOffice: {
                address: data.stateOffice?.address || 'Door No. 40-5-1, MG Road, Labbipet, Vijayawada, Andhra Pradesh - 520010',
                phone: data.stateOffice?.phone || '+91 866 247 XXXX',
                email: data.stateOffice?.email || 'state.office@bramakrishna.mp.in'
              }
            })
          }
        })
        .catch((err) => console.error('Error fetching settings in Footer:', err))
    })
  }, [])

  return (
    <footer className="bg-navy-900 text-slate-300 border-t-2 border-saffron-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center border border-navy-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/telugudesamlogo.png" 
                  alt="TDP Logo" 
                  className="w-7 h-7 object-contain" 
                />
              </div>
              <div className="text-left">
                <span className="block font-bold text-white uppercase tracking-wider text-sm md:text-base">
                  {tContent(settings.candidateName)}
                </span>
                <span className="block text-xs text-saffron-400 font-semibold tracking-wider uppercase">
                  {tContent(settings.roleBadge)}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mt-3 leading-relaxed text-left">
              {t('footer.description')}
            </p>

            {/* Social Media Links */}
            <div className="mt-6 flex items-center space-x-4">
              {settings.socialLinks.instagram && (
                <a 
                  href={settings.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center hover:bg-saffron-500 hover:text-navy-900 transition-all border border-navy-700/50 shadow-sm text-slate-300"
                  aria-label="Instagram profile"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a 
                  href={settings.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center hover:bg-saffron-500 hover:text-navy-900 transition-all border border-navy-700/50 shadow-sm text-slate-300"
                  aria-label="YouTube channel"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                    <polygon points="10 15 15 12 10 9" />
                  </svg>
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a 
                  href={settings.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center hover:bg-saffron-500 hover:text-navy-900 transition-all border border-navy-700/50 shadow-sm text-slate-300"
                  aria-label="Twitter / X profile"
                >
                  {/* Custom X Logo */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-saffron-500 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-saffron-500 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/state-focus" className="hover:text-saffron-500 transition-colors">
                  {t('nav.stateFocus')}
                </Link>
              </li>
              <li>
                <Link href="/development-works" className="hover:text-saffron-500 transition-colors">
                  {t('nav.publicInitiatives')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-saffron-500 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-saffron-500 transition-colors">
                  {t('nav.grievancePortal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="text-left">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 text-left">
              {t('contact.addresses')}
            </h3>
            <ul className="space-y-4 text-sm text-slate-400 text-left">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 text-saffron-500 shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <span className="block font-bold text-slate-300 text-[10px] uppercase tracking-wider mb-1">{t('contact.delhiTitle')}</span>
                  <span>{tContent(settings.delhiOffice.address)}</span>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 text-saffron-500 shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <span className="block font-bold text-slate-300 text-[10px] uppercase tracking-wider mb-1">{t('contact.stateTitle')}</span>
                  <span>{tContent(settings.stateOffice.address)}</span>
                </div>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-saffron-500" />
                <span>{settings.stateOffice.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2.5 text-saffron-500" />
                <span>{settings.stateOffice.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} {t('footer.office')} {tContent(settings.candidateName)}, MP. {t('footer.rights')}</p>
          <p className="mt-2 md:mt-0 text-left">
            {t('footer.official')}
          </p>
        </div>
      </div>
    </footer>
  )
}
