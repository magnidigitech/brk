'use client'

import { WifiOff, Home, Info, PhoneCall, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function OfflinePage() {
  const [lang, setLang] = useState<'en' | 'te'>('en')

  useEffect(() => {
    // Check cookie or localStorage for language preference
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )user-language=([^;]+)'))
      if (match && match[2] === 'te') {
        setLang('te')
      } else {
        const localLang = localStorage.getItem('language')
        if (localLang === 'te') {
          setLang('te')
        }
      }
    }
  }, [])

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const translations = {
    title: {
      en: 'You are Offline',
      te: 'మీరు ఆఫ్-లైన్ లో ఉన్నారు'
    },
    message: {
      en: "It seems you've lost your network connection. You can still navigate pages you've previously visited, or retry when connection is restored.",
      te: 'మీ నెట్‌వర్క్ కనెక్షన్ నిలిచిపోయింది. గతంలో మీరు సందర్శించిన పేజీలను వీక్షించవచ్చు, లేదా నెట్‌వర్క్ కనెక్ట్ అయిన తర్వాత మళ్లీ ప్రయత్నించండి.'
    },
    retryBtn: {
      en: 'Retry Connection',
      te: 'మళ్లీ ప్రయత్నించండి'
    },
    goHome: {
      en: 'Go to Home',
      te: 'హోమ్ పేజీ'
    },
    about: {
      en: 'About Shri BRK',
      te: 'శ్రీ భీఆర్కే గురించి'
    },
    contact: {
      en: 'Contact Office',
      te: 'కార్యాలయం సంప్రదించండి'
    },
    portalSubtitle: {
      en: 'SHRI BHASHYAM RAMA KRISHNA PORTAL',
      te: 'శ్రీ భాష్యం రామకృష్ణ అధికారిక పోర్టల్'
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
        {/* TDP Yellow Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFD200]" />
        
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD200]/10 border border-[#FFD200]/20 rounded-2xl mb-6 text-navy-900 animate-pulse">
          <WifiOff className="w-8 h-8 text-[#FFD200] stroke-[2.5]" />
        </div>

        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {translations.portalSubtitle[lang]}
        </span>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight mb-3">
          {translations.title[lang]}
        </h1>
        <p className="text-slate-600 text-xs leading-relaxed mb-8 px-2">
          {translations.message[lang]}
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-[#FFD200] hover:bg-[#FFD200]/90 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#FFD200]"
          >
            <RefreshCw className="w-4 h-4" />
            {translations.retryBtn[lang]}
          </button>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <a
              href="/"
              className="py-2.5 px-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-xl transition-all flex flex-col items-center gap-1"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>{translations.goHome[lang]}</span>
            </a>
            
            <a
              href="/about"
              className="py-2.5 px-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-xl transition-all flex flex-col items-center gap-1"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span className="truncate w-full text-center">{translations.about[lang]}</span>
            </a>

            <a
              href="/contact"
              className="py-2.5 px-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-xl transition-all flex flex-col items-center gap-1"
            >
              <PhoneCall className="w-4 h-4 text-slate-500" />
              <span>{translations.contact[lang]}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
