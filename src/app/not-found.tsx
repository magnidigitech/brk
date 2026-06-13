'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Compass, RefreshCw } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/')
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, router])

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center bg-slate-50 text-slate-800 p-6 relative overflow-hidden select-none">
      {/* Background ambient radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,230,0,0.12)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-saffron-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl relative z-10 text-center flex flex-col items-center">
        
        {/* Animated compass badge */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-300 via-saffron-400 to-saffron-500 p-0.5 shadow-md shadow-saffron-500/10 mb-6 animate-bounce">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Compass className="w-10 h-10 text-saffron-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-navy-950 mb-1 select-text selection:bg-saffron-200 selection:text-navy-950">
          404
        </h1>
        <h2 className="text-lg sm:text-xl font-extrabold text-saffron-600 mb-3 tracking-wide">
          Page Not Found / మార్గం కనుగొనబడలేదు
        </h2>
        
        {/* Message */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          <br />
          <span className="text-xs text-slate-500 mt-2 block font-medium">
            మీరు వెతుకుతున్న పేజీ అందుబాటులో లేదు లేదా మార్చబడింది.
          </span>
        </p>

        {/* Circular SVG Countdown Progress */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Track Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-100"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress Indicator */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-saffron-500 transition-all duration-1000 ease-linear"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * countdown) / 10}
              strokeLinecap="round"
            />
          </svg>
          {/* Inner Counter Text */}
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-navy-950">{countdown}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">seconds</span>
          </div>
        </div>

        {/* Redirect Caption */}
        <p className="text-[11px] font-bold text-slate-500 flex items-center mb-6">
          <RefreshCw className="w-3 h-3 mr-1.5 animate-spin text-saffron-500" />
          Redirecting to Home page automatically...
        </p>

        {/* Go back immediately link */}
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-saffron-400 hover:bg-saffron-500 text-navy-950 font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg shadow-saffron-500/10 cursor-pointer text-sm"
        >
          <Home className="w-4 h-4 mr-2" />
          Go to Home Now / హోమ్ పేజీకి వెళ్ళండి
        </Link>
      </div>
    </div>
  )
}
