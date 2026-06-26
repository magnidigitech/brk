'use client'

import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'
import { getRoleTitle } from '@/lib/roleHelper'

interface FooterProps {
  siteSettings?: {
    candidateName?: any
    roleBadge?: any
    socialLinks?: {
      instagram?: string
      youtube?: string
      twitter?: string
    }
    delhiOffice?: {
      address?: any
      phone?: string
      email?: string
    }
    stateOffice?: {
      address?: any
      phone?: string
      email?: string
    }
  } | null
}

export default function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const { t, tContent } = useLanguage()

  // All values resolved from server-passed siteSettings
  const candidateName = tContent(siteSettings?.candidateName, 'Bhashyam Rama Krishna')
  const roleBadge = getRoleTitle(useLanguage().language)
  const instagram = siteSettings?.socialLinks?.instagram || 'https://www.instagram.com/ramakrishnabhashyam/'
  const youtube = siteSettings?.socialLinks?.youtube || 'https://www.youtube.com/@bhashyamramakrishnaofficial'
  const twitter = siteSettings?.socialLinks?.twitter || 'https://x.com/bhashyambrk'
  const delhiAddress = tContent(siteSettings?.delhiOffice?.address, '12, Rajya Sabha Members Residences, New Delhi - 110001')
  const stateAddress = tContent(siteSettings?.stateOffice?.address, 'Navabharath Nagar 4/3 Line, Guntur - 522006')
  const statePhone = siteSettings?.stateOffice?.phone || '+91 866 247 XXXX'
  const stateEmail = siteSettings?.stateOffice?.email || 'state.office@bramakrishna.mp.in'

  return (
    <footer className="bg-[#5C0606] text-slate-200 border-t-2 border-saffron-500 w-full">
      <div className="w-full px-6 sm:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-15 h-15 rounded-lg flex items-center justify-center shadow-md p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/telugudesamlogo.png"
                  alt="TDP Logo"
                  className="w-15 h-15 object-contain"
                  width={60}
                  height={60}
                />
              </div>
              <div className="text-left">
                <span className="block font-black text-white uppercase tracking-wider text-base md:text-lg">
                  {candidateName}
                </span>
                <span className="block text-xs md:text-sm text-saffron-300 font-extrabold tracking-wider uppercase">
                  {roleBadge}
                </span>
              </div>
            </div>
            <p className="text-base text-red-100/80 max-w-md mt-4 leading-relaxed text-left">
              {t('footer.description')}
            </p>

            {/* Social Media Links */}
            <div className="mt-8 flex items-center space-x-5">
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#450308] flex items-center justify-center hover:bg-saffron-500 hover:text-navy-900 transition-all border border-[#7A0D15] shadow-sm text-red-100"
                  aria-label="Instagram profile"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              )}
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#450308] flex items-center justify-center hover:bg-saffron-500 hover:text-navy-900 transition-all border border-[#7A0D15] shadow-sm text-red-100"
                  aria-label="YouTube channel"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                    <polygon points="10 15 15 12 10 9" />
                  </svg>
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#450308] flex items-center justify-center hover:bg-saffron-500 hover:text-navy-900 transition-all border border-[#7A0D15] shadow-sm text-red-100"
                  aria-label="Twitter / X profile"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h3 className="text-white font-extrabold text-base tracking-widest uppercase mb-4">
              {t('footer.resources')}
            </h3>
            <ul className="space-y-3 text-base text-red-100/90">
              <li>
                <Link href="/" className="hover:text-yellow-300 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-300 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/press-releases" className="hover:text-yellow-300 transition-colors">
                  {t('section.news')}
                </Link>
              </li>
              <li>
                <Link href="/parliamentary-updates" className="hover:text-yellow-300 transition-colors">
                  {t('section.updates')}
                </Link>
              </li>
              <li>
                <Link href="/state-focus" className="hover:text-yellow-300 transition-colors">
                  {t('nav.stateFocus')}
                </Link>
              </li>
              <li>
                <Link href="/development-works" className="hover:text-yellow-300 transition-colors">
                  {t('nav.publicInitiatives')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-300 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-yellow-300 transition-colors">
                  {t('nav.grievancePortal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="text-left">
            <h3 className="text-white font-extrabold text-base tracking-widest uppercase mb-4 text-left">
              {t('contact.addresses')}
            </h3>
            <ul className="space-y-4 text-base text-red-100/80 text-left">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-saffron-300 shrink-0 mt-0.5" />
                <div className="leading-normal">
                  <span className="block font-bold text-saffron-300 text-xs uppercase tracking-wider mb-1">{t('contact.delhiTitle')}</span>
                  <span>{delhiAddress}</span>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-saffron-300 shrink-0 mt-0.5" />
                <div className="leading-normal">
                  <span className="block font-bold text-saffron-300 text-xs uppercase tracking-wider mb-1">{t('contact.stateTitle')}</span>
                  <span>{stateAddress}</span>
                </div>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-saffron-300 shrink-0" />
                <span>{statePhone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-saffron-300 shrink-0" />
                <span>{stateEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#7A0D15] mt-12 pt-6 flex flex-col items-center text-center space-y-4 text-xs text-red-200/50">
          {/* Copyrights in a single line (on desktop/tablet only) */}
          <p className="whitespace-normal sm:whitespace-nowrap">
            © {currentYear} {t('footer.office')} {candidateName}, MP. {t('footer.rights')}
          </p>
          
          {/* Privacy Links */}
          <div className="flex space-x-4 font-medium justify-center">
            <Link href="/privacy" className="hover:text-yellow-300 transition-colors">
              {useLanguage().language === 'te' ? 'గోప్యతా విధానం' : 'Privacy Policy'}
            </Link>
            <span className="text-red-200/20">|</span>
            <Link href="/terms" className="hover:text-yellow-300 transition-colors">
              {useLanguage().language === 'te' ? 'నిబంధనలు' : 'Terms of Use'}
            </Link>
            <span className="text-red-200/20">|</span>
            <Link href="/accessibility" className="hover:text-yellow-300 transition-colors">
              {useLanguage().language === 'te' ? 'యాక్సెసిబిలిటీ' : 'Accessibility'}
            </Link>
          </div>

          {/* Below text in exactly two lines (on desktop) and centered */}
          <p className="max-w-md md:max-w-lg mx-auto leading-relaxed text-[11px] text-red-200/40">
            {useLanguage().language === 'te' ? (
              t('footer.official')
            ) : (
              <>
                This is the official public portal for citizen grievance redressal,<br />
                policy initiatives, and updates.
              </>
            )}
          </p>
        </div>

        {/* Magni Digitech Credit */}
        <div className="border-t border-[#7A0D15]/40 mt-6 pt-4 flex justify-center items-center relative group/credit">
          {/* Tooltip containing hitwebcounter */}
          <div className="absolute bottom-full mb-3 hidden group-hover/credit:flex flex-col items-center z-50 bg-[#450308] border border-saffron-400/30 text-white rounded-lg px-3 py-2 shadow-2xl pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
            <span className="text-[8px] text-saffron-300 uppercase tracking-widest font-black mb-1.5 block">
              Portal Traffic
            </span>
            <a 
              href="https://www.hitwebcounter.com/split-pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="https://www.hitwebcounter.com/split-pdf"
              className="block opacity-90 hover:opacity-100 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://www.hitwebcounter.com/counter/counter.php?page=21503716&amp;style=0024&amp;nbdigits=5&amp;type=ip" 
                alt="Visitor Counter" 
                decoding="async" 
                className="h-5 w-auto object-contain border-0 max-w-full"
              />
            </a>
            {/* Tooltip Arrow */}
            <div className="w-2 h-2 bg-[#450308] border-r border-b border-saffron-400/30 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </div>

          <a 
            href="https://www.magnidigitech.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center space-y-1.5 text-red-200/40 hover:text-white transition-colors group"
          >
            <span className="text-[10px] tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
              Designed and maintained by
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo-header.webp" 
              alt="Magni Digitech" 
              className="h-4.5 w-auto object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity duration-200"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
