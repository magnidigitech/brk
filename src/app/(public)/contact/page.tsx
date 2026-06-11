'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Send, CheckCircle2, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

export default function ContactPage() {
  const { t, tContent } = useLanguage()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const [settings, setSettings] = useState({
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
        delhiOffice,
        stateOffice
      }`)
        .then((data) => {
          if (data) {
            setSettings({
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
        .catch((err) => console.error('Error fetching contact office details:', err))
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setSuccess(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setTimeout(() => setSuccess(false), 5000)
    }, 1500)
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
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-saffron-200 transition-colors text-left">
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
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-saffron-200 transition-colors text-left">
              <span className="text-xs font-bold text-saffron-600 tracking-wider uppercase block mb-2">{t('contact.stateTitle')}</span>
              <h3 className="text-sm font-bold text-navy-900 mb-3">{t('contact.stateSubtitle')}</h3>
              <ul className="space-y-3 text-xs text-slate-500">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2.5 text-navy-900 shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line text-left block">{tContent(settings.stateOffice.address)}</span>
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

                <button
                  type="submit"
                  disabled={isSending || !name || !email || !message}
                  className="w-full py-3.5 bg-navy-900 hover:bg-navy-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-saffron-500" />
                      <span>{t('contact.sendingText')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-saffron-500" />
                      <span>{t('contact.sendButton')}</span>
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
