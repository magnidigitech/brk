'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Send, CheckCircle2, RefreshCw } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)

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
          <span className="text-xs font-bold text-saffron-600 tracking-widest uppercase block mb-2">Get in Touch</span>
          <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
            Contact the Office of Rajya Sabha MP
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Reach out to our offices in New Delhi or our State headquarters. Submit inquiries, suggestions, or policy feedback directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Offices List */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-navy-900">Office Addresses</h2>
            
            {/* Delhi Office */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-bold text-saffron-600 tracking-wider uppercase block mb-2">New Delhi Office</span>
              <h3 className="text-sm font-bold text-navy-900 mb-3">Rajya Sabha Secretariat</h3>
              <ul className="space-y-3 text-xs text-slate-500">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2.5 text-navy-900 shrink-0 mt-0.5" />
                  <span>
                    12, Rajya Sabha Members Residences,<br />
                    New Delhi - 110001
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>+91 11 2301 XXXX</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>delhi.office@bramakrishna.mp.in</span>
                </li>
              </ul>
            </div>

            {/* State Headquarters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-bold text-saffron-600 tracking-wider uppercase block mb-2">State Camp Office</span>
              <h3 className="text-sm font-bold text-navy-900 mb-3">Andhra Pradesh Headquarters</h3>
              <ul className="space-y-3 text-xs text-slate-500">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2.5 text-navy-900 shrink-0 mt-0.5" />
                  <span>
                    Door No. 40-5-1, MG Road, Labbipet,<br />
                    Vijayawada, Andhra Pradesh - 520010
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>+91 866 247 XXXX</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2.5 text-navy-900 shrink-0" />
                  <span>state.office@bramakrishna.mp.in</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="md:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-navy-900 mb-2">Send a Message</h2>
              <p className="text-xs text-slate-500 mb-6">
                Fill out the form below, and our staff will review your message and reply as soon as possible.
              </p>

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl mb-6 flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 text-emerald-500" />
                  <span>Message sent successfully! Our administrative team will reach out to you shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder="Full Name"
                    disabled={isSending}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder="email@example.com"
                    disabled={isSending}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder="Brief subject of message"
                    disabled={isSending}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Message Details *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-xs outline-none"
                    placeholder="Write details of your message..."
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
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-saffron-500" />
                      <span>Send Message</span>
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
