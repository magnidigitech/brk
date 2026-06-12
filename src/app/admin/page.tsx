'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Lock, 
  AlertCircle, 
  Users, 
  Smartphone, 
  LifeBuoy, 
  FileText, 
  RefreshCw, 
  ChevronRight, 
  TrendingUp, 
  Globe, 
  Calendar,
  LogOut,
  Map
} from 'lucide-react'

interface AnalyticsData {
  totalVisitors: number
  totalPwaInstalls: number
  popularPages: Array<{ pathname: string; count: number }>
  recentEvents: Array<{ id: string; type: string; pathname: string | null; createdAt: string }>
}

interface GrievanceStats {
  total: number
  pending: number
  resolved: number
}

export default function MasterAdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [grievanceStats, setGrievanceStats] = useState<GrievanceStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check auth on mount
  useEffect(() => {
    const authEmail = localStorage.getItem('admin_authenticated_email')
    if (authEmail === 'magnidigitech@gmail.com') {
      setIsAuthenticated(true)
      fetchDashboardData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'magnidigitech@gmail.com' && password === 'Magni@221299') {
      localStorage.setItem('admin_authenticated_email', 'magnidigitech@gmail.com')
      setIsAuthenticated(true)
      fetchDashboardData()
    } else {
      setAuthError('Invalid email or password. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated_email')
    setIsAuthenticated(false)
    setAnalytics(null)
    setGrievanceStats(null)
  }

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch Analytics
      const analyticsRes = await fetch('/api/admin/analytics')
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }

      // Fetch Grievances Stats
      const grievancesRes = await fetch('/api/admin/grievance')
      if (grievancesRes.ok) {
        const grievancesList = await grievancesRes.json()
        setGrievanceStats({
          total: grievancesList.length,
          pending: grievancesList.filter((t: any) => t.status === 'PENDING').length,
          resolved: grievancesList.filter((t: any) => t.status === 'RESOLVED').length
        })
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Render Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/10 rounded-full blur-3xl -z-1" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-900 border border-navy-800 rounded-2xl mb-4 text-saffron-500">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white">Office Admin Login</h1>
            <p className="text-xs text-slate-400 mt-2">Enter credentials to access the central administration dashboard.</p>
          </div>

          {authError && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 text-rose-400 text-xs rounded-xl mb-6 flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-saffron-500 transition-all text-sm outline-none text-white"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-saffron-500 transition-all text-sm outline-none text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-saffron-500 hover:bg-saffron-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Log In to Portal
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <header className="sticky top-0 z-40 bg-navy-900 text-white border-b border-navy-950 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-navy-850 rounded-lg flex items-center justify-center border border-navy-800">
              <Globe className="w-5 h-5 text-saffron-500 animate-pulse" />
            </div>
            <div>
              <span className="block font-bold text-sm text-white uppercase tracking-wider leading-tight">
                Central Office Administration
              </span>
              <span className="block text-[10px] font-semibold text-saffron-400 tracking-widest uppercase">
                Sitewide Master Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-navy-850 border border-navy-800 hover:bg-navy-800 text-slate-300 rounded-lg transition-all"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4.5 h-4.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Bento Grid Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Visitors Count Bento Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between min-h-[160px] relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute right-0 bottom-0 text-slate-100 translate-x-4 translate-y-4 pointer-events-none group-hover:scale-110 transition-transform">
              <Users className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-navy-50 text-navy-700 border border-navy-100 tracking-wide uppercase">
                  Sitewide Hits
                </span>
                <h3 className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-wider">Total Visitors</h3>
              </div>
              <span className="text-4xl font-black text-navy-900 mt-4 leading-none">
                {analytics?.totalVisitors ?? 0}
              </span>
            </div>
          </div>

          {/* 2. PWA Installs Bento Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between min-h-[160px] relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute right-0 bottom-0 text-slate-100 translate-x-4 translate-y-4 pointer-events-none group-hover:scale-110 transition-transform">
              <Smartphone className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-saffron-50 text-saffron-600 border border-saffron-100 tracking-wide uppercase">
                  App Installations
                </span>
                <h3 className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-wider">PWA Installs</h3>
              </div>
              <span className="text-4xl font-black text-saffron-600 mt-4 leading-none">
                {analytics?.totalPwaInstalls ?? 0}
              </span>
            </div>
          </div>

          {/* 3. Grievances Summary Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <LifeBuoy className="w-5 h-5 text-saffron-600 animate-spin-slow" />
                <h3 className="text-sm font-black text-navy-900 uppercase tracking-wide">Grievances Office</h3>
              </div>
              <Link 
                href="/admin/grievances"
                className="inline-flex items-center text-xs font-bold text-saffron-600 hover:text-saffron-700 transition-colors"
              >
                Open Panel <ChevronRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 py-3">
              <div className="text-center bg-slate-50 rounded-xl p-2 border border-slate-100">
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                <strong className="text-base font-extrabold text-navy-900">{grievanceStats?.total ?? 0}</strong>
              </div>
              <div className="text-center bg-amber-50/40 rounded-xl p-2 border border-amber-100/40">
                <span className="block text-[8px] font-bold text-amber-500 uppercase tracking-wider">Pending</span>
                <strong className="text-base font-extrabold text-amber-600">{grievanceStats?.pending ?? 0}</strong>
              </div>
              <div className="text-center bg-emerald-50/40 rounded-xl p-2 border border-emerald-100/40">
                <span className="block text-[8px] font-bold text-emerald-500 uppercase tracking-wider">Resolved</span>
                <strong className="text-base font-extrabold text-emerald-600">{grievanceStats?.resolved ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* 4. Popular Pages Chart Card */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-sm font-black text-navy-900 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-saffron-600" />
              Most Visited Pages
            </h3>
            {analytics?.popularPages && analytics.popularPages.length > 0 ? (
              <div className="space-y-4">
                {analytics.popularPages.map((page, index) => {
                  const maxCount = Math.max(...analytics.popularPages.map(p => p.count))
                  const pct = maxCount > 0 ? (page.count / maxCount) * 100 : 0

                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-navy-950 truncate max-w-md">{page.pathname}</span>
                        <span className="font-bold text-slate-500">{page.count} views</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-saffron-500 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-10">No traffic logged yet.</p>
            )}
          </div>

          {/* 5. OneSignal Info Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-sm font-black text-navy-900 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <Map className="w-4.5 h-4.5 text-saffron-600" />
              OneSignal Notifications
            </h3>
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-2xl">
                <span className="block text-[10px] font-bold text-blue-700 uppercase tracking-wider">Service Status</span>
                <p className="text-xs text-blue-900 mt-1 font-medium leading-relaxed">
                  OneSignal SDK is successfully registered sitewide on the root layout.
                </p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Service Worker</span>
                  <span className="font-semibold text-emerald-600">Active</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">SDK Version</span>
                  <span className="font-semibold text-slate-700">v16.page</span>
                </div>
              </div>
              <a 
                href="https://dashboard.onesignal.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Go to OneSignal Dashboard
              </a>
            </div>
          </div>

          {/* 6. Recent Platform Events Stream */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-sm font-black text-navy-900 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
              Live Office Event Stream
            </h3>
            {analytics?.recentEvents && analytics.recentEvents.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {analytics.recentEvents.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== analytics.recentEvents.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              event.type === 'PWA_INSTALL' ? 'bg-saffron-100 text-saffron-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {event.type === 'PWA_INSTALL' ? (
                                <Smartphone className="w-4 h-4" />
                              ) : (
                                <Users className="w-4 h-4" />
                              )}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs text-slate-600">
                                {event.type === 'PWA_INSTALL' ? (
                                  <>Progressive Web App <strong className="font-bold text-navy-900">Installed</strong> successfully</>
                                ) : (
                                  <>Page hit registered on <code className="bg-slate-50 px-1 py-0.5 rounded font-mono font-bold text-navy-900">{event.pathname || '/'}</code></>
                                )}
                              </p>
                            </div>
                            <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-bold flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(event.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-slate-400 text-xs text-center py-10">No recent events logged.</p>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
