'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Send, CheckCircle2, RefreshCw, AlertCircle, ShieldCheck, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

interface ContactClientProps {
  settings: {
    delhiOffice: {
      address: any
      phone: string
      email: string
    }
    stateOffice: {
      address: any
      phone: string
      email: string
    }
  }
}

export default function ContactClient({ settings }: ContactClientProps) {
  const { t, tContent, language } = useLanguage()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const [isSending, setIsSending] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setIsSending(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setSuccess(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setConsentChecked(false)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      console.error('Contact submission error:', err)
      setError('An error occurred while sending your message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">{t('contact.getInTouch')}</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            {t('contact.header')}
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            {t('contact.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Offices List */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-navy-900">{t('contact.addresses')}</h2>
            
            {/* Delhi Office */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-saffron-400/80 transition-all duration-300 text-left">
              <span className="text-xs font-bold text-saffron-600 tracking-wider uppercase block mb-2">{t('contact.delhiTitle')}</span>
              <h3 className="text-sm font-bold text-navy-900 mb-3">{t('contact.delhiSubtitle')}</h3>
              <ul className="space-y-3 text-xs text-slate-500">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2.5 text-navy-900 shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line text-left block">{tContent(settings.delhiOffice.address)}</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>{settings.delhiOffice.phone}</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>{settings.delhiOffice.email}</span>
                </li>
              </ul>
            </div>

            {/* State Headquarters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-saffron-400/80 transition-all duration-300 text-left">
              <span className="text-xs font-bold text-saffron-600 tracking-wider uppercase block mb-2">{t('contact.stateTitle')}</span>
              <h3 className="text-sm font-bold text-navy-900 mb-3">{t('contact.stateSubtitle')}</h3>
              <ul className="space-y-3 text-xs text-slate-500">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2.5 text-navy-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="whitespace-pre-line text-left block">{tContent(settings.stateOffice.address)}</span>
                    <a 
                      href="https://maps.app.goo.gl/FRBmf7CNdemcodYN7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-saffron-600 hover:text-saffron-700 mt-1.5 inline-flex items-center space-x-1 transition-colors"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>{settings.stateOffice.phone}</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>{settings.stateOffice.email}</span>
                </li>
              </ul>
            </div>

            {/* Social Media Channels */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-saffron-400/80 transition-all duration-300 text-left">
              <span className="text-xs font-bold text-saffron-600 tracking-wider uppercase block mb-2">Social Connect</span>
              <h3 className="text-sm font-bold text-navy-900 mb-4">Official Channels</h3>
              <div className="flex items-center space-x-3.5">
                <a
                  href="https://www.instagram.com/ramakrishnabhashyam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 text-white flex items-center justify-center hover:scale-105 transition-all shadow-sm cursor-pointer"
                  title="Instagram"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@ramakrishnabhashyam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center hover:scale-105 transition-all shadow-sm cursor-pointer"
                  title="YouTube"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/bhashyambrk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:scale-105 transition-all shadow-sm cursor-pointer"
                  title="Twitter / X"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="md:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-navy-900 mb-2">{t('contact.sendMessage')}</h2>
              <p className="text-xs text-slate-500 mb-6 text-left">
                {t('contact.sendMessageDesc')}
              </p>

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl mb-6 flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 text-emerald-500" />
                  <span>{t('contact.successMsg')}</span>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl mb-6 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5 text-left">
                    {t('contact.yourName')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder={t('contact.namePlaceholder')}
                    disabled={isSending}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5 text-left">
                    {t('contact.emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder={t('contact.emailPlaceholder')}
                    disabled={isSending}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5 text-left">
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder={t('contact.subjectPlaceholder')}
                    disabled={isSending}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5 text-left">
                    {t('contact.messageDetails')}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder={t('contact.messagePlaceholder')}
                    disabled={isSending}
                  />
                </div>

                {/* DPDP Compliance Checkbox */}
                 <div className="flex items-start space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl my-4">
                   <input
                     id="dpdp-consent-check"
                     type="checkbox"
                     checked={consentChecked}
                     onChange={(e) => setConsentChecked(e.target.checked)}
                     className="w-4 h-4 mt-0.5 border-slate-300 rounded text-saffron-600 focus:ring-saffron-500 cursor-pointer"
                     disabled={isSending}
                   />
                   <label htmlFor="dpdp-consent-check" className="text-xs text-slate-600 font-bold select-none cursor-pointer leading-normal text-left">
                     {t('dpdp.consent')}
                   </label>
                 </div>

                 {/* Privacy Indicator Badge */}
                 <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs text-slate-600 flex items-start leading-normal text-left my-4">
                   <ShieldCheck className="w-4.5 h-4.5 mr-2 text-emerald-600 shrink-0 mt-0.5" />
                   <div>
                     <span className="font-bold text-emerald-800 block mb-0.5">
                       {language === 'te' ? 'భద్రతా హామీ' : 'DPDP Compliant & Encrypted'}
                     </span>
                     <span>{t('dpdp.privacyBadge')}</span>
                   </div>
                 </div>

                <button
                  type="submit"
                  disabled={isSending || !name || !email || !message || !consentChecked}
                  className="w-full py-3.5 bg-saffron-400 hover:bg-saffron-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-navy-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />
                      <span>{t('contact.sendingText')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-navy-950" />
                      <span>{t('button.send')}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
