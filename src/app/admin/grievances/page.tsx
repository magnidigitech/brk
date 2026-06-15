'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LifeBuoy, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Lock, 
  ArrowLeft, 
  RefreshCw, 
  ChevronRight, 
  SlidersHorizontal,
  MapPin,
  Calendar,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Download
} from 'lucide-react'

type TicketStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

interface Ticket {
  id: string
  name: string
  email: string
  phone: string
  state?: string
  district?: string
  cityTown?: string
  mandal?: string
  villageWard?: string
  address?: string
  pincode?: string
  category: string
  subject: string
  description: string
  status: TicketStatus
  adminNotes?: string
  createdAt: string
  updatedAt: string
  logs?: Array<{
    id: string
    status: TicketStatus
    notes: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  
  // Edit forms
  const [editingStatus, setEditingStatus] = useState<TicketStatus>('PENDING')
  const [editingNotes, setEditingNotes] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  const [activeView, setActiveView] = useState<'list' | 'trends'>('list')

  // Memoized stats & geographical aggregates
  const districtData = useMemo(() => {
    const standardDistricts = [
      'Guntur', 'Krishna', 'Visakhapatnam', 'East Godavari', 'West Godavari', 
      'Chittoor', 'Nellore', 'Prakasam', 'Kurnool', 'Anantapur', 'Kadapa', 
      'Srikakulam', 'Vizianagaram', 'ASR', 'Anakapalli', 'Kakinada', 
      'Konaseema', 'Eluru', 'Palnadu', 'Bapatla', 'Nandyal', 'Sri Sathya Sai', 
      'Annamayya', 'Tirupati', 'Parvathipuram Manyam'
    ]

    const registry: Record<string, { name: string; count: number; categories: Record<string, number> }> = {}
    standardDistricts.forEach(d => {
      registry[d.toLowerCase()] = { name: d, count: 0, categories: {} }
    })
    registry['other'] = { name: 'Other / Not Specified', count: 0, categories: {} }

    tickets.forEach(t => {
      const dist = t.district ? t.district.trim().toLowerCase().replace(/\s+district$/, '') : ''
      let matchKey = 'other'
      
      if (dist) {
        const found = standardDistricts.find(sd => sd.toLowerCase() === dist || sd.toLowerCase().includes(dist))
        if (found) {
          matchKey = found.toLowerCase()
        }
      }

      registry[matchKey].count += 1
      if (t.category) {
        registry[matchKey].categories[t.category] = (registry[matchKey].categories[t.category] || 0) + 1
      }
    })

    const list = Object.values(registry).map(item => {
      let topCategory = 'N/A'
      let maxCount = 0
      Object.entries(item.categories).forEach(([cat, val]) => {
        if (val > maxCount) {
          maxCount = val
          topCategory = cat
        }
      })
      return {
        name: item.name,
        count: item.count,
        topCategory
      }
    })

    return list.sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count
      }
      if (a.name === 'Other / Not Specified') return 1
      if (b.name === 'Other / Not Specified') return -1
      return a.name.localeCompare(b.name)
    })
  }, [tickets])

  const localSpikes = useMemo(() => {
    const activeTickets = tickets.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS')
    const aggregates: Record<string, { category: string; location: string; count: number; district: string; mandal?: string }> = {}

    activeTickets.forEach(t => {
      const districtStr = t.district ? t.district.trim() : ''
      const mandalStr = t.mandal ? t.mandal.trim() : ''
      
      if (!districtStr) return
      
      const locKey = mandalStr 
        ? `${districtStr}-${mandalStr}-${t.category}`.toLowerCase()
        : `${districtStr}-${t.category}`.toLowerCase()
      
      const displayLocation = mandalStr 
        ? `${mandalStr} Mandal, ${districtStr}` 
        : `${districtStr} District`

      if (!aggregates[locKey]) {
        aggregates[locKey] = {
          category: t.category,
          location: displayLocation,
          count: 0,
          district: districtStr,
          mandal: mandalStr || undefined
        }
      }
      aggregates[locKey].count += 1
    })

    return Object.values(aggregates)
      .filter(item => item.count >= 2)
      .sort((a, b) => b.count - a.count)
  }, [tickets])

  const hotspots = useMemo(() => {
    const locations: Record<string, { name: string; type: 'District' | 'Mandal' | 'Pincode'; count: number; categories: Record<string, number> }> = {}

    tickets.forEach(t => {
      const dist = t.district?.trim()
      const mandal = t.mandal?.trim()
      const pin = t.pincode?.trim()

      const addEntry = (name: string, type: 'District' | 'Mandal' | 'Pincode') => {
        const key = `${type.toLowerCase()}-${name.toLowerCase()}`
        if (!locations[key]) {
          locations[key] = { name, type, count: 0, categories: {} }
        }
        locations[key].count += 1
        if (t.category) {
          locations[key].categories[t.category] = (locations[key].categories[t.category] || 0) + 1
        }
      }

      if (dist) addEntry(dist, 'District')
      if (mandal) addEntry(mandal, 'Mandal')
      if (pin) addEntry(pin, 'Pincode')
    })

    return Object.values(locations)
      .map(loc => {
        let topCategory = 'N/A'
        let max = 0
        Object.entries(loc.categories).forEach(([cat, val]) => {
          if (val > max) {
            max = val
            topCategory = cat
          }
        })
        return {
          name: loc.name,
          type: loc.type,
          count: loc.count,
          topCategory
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [tickets])

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated_email')
    if (auth === 'magnidigitech@gmail.com') {
      setIsAuthenticated(true)
      fetchTickets()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'magnidigitech@gmail.com' && password === 'Magni@221299') {
      localStorage.setItem('admin_authenticated_email', 'magnidigitech@gmail.com')
      setIsAuthenticated(true)
      fetchTickets()
    } else {
      setAuthError('Invalid email or password. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated_email')
    setIsAuthenticated(false)
    setTickets([])
  }

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/grievance')
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (err) {
      console.error('Failed to load tickets', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setEditingStatus(ticket.status)
    setEditingNotes('')
  }

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/grievance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicket.id,
          status: editingStatus,
          notes: editingNotes
        })
      })

      if (response.ok) {
        const updated = await response.json()
        setTickets(prev => prev.map(t => t.id === updated.id ? updated : t))
        setSelectedTicket(updated)
        setEditingNotes('')
      }
    } catch (err) {
      console.error('Failed to update ticket', err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Categories list
  const categories = Array.from(new Set(tickets.map(t => t.category)))

  // Stats calculation
  const totalCount = tickets.length
  const pendingCount = tickets.filter(t => t.status === 'PENDING').length
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length

  // Filtered tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
      
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter
    const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleExportCSV = () => {
    if (filteredTickets.length === 0) return

    // Define CSV columns
    const headers = [
      'Ticket ID',
      'Name',
      'Email',
      'Phone',
      'State',
      'District',
      'City/Town',
      'Mandal',
      'Village/Ward',
      'Address',
      'Pincode',
      'Category',
      'Subject',
      'Description',
      'Status',
      'Created At',
      'Updated At',
      'Admin Notes'
    ]

    // Map tickets to rows
    const rows = filteredTickets.map(t => [
      t.id,
      t.name,
      t.email,
      t.phone,
      t.state || '',
      t.district || '',
      t.cityTown || '',
      t.mandal || '',
      t.villageWard || '',
      t.address || '',
      t.pincode || '',
      t.category,
      t.subject,
      t.description,
      t.status,
      new Date(t.createdAt).toLocaleString('en-IN'),
      new Date(t.updatedAt).toLocaleString('en-IN'),
      t.adminNotes || ''
    ])

    // Construct CSV file payload with proper wrapping/escaping
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(value => {
          const strValue = String(value).replace(/"/g, '""')
          return `"${strValue}"`
        }).join(',')
      )
    ].join('\n')

    // Create anchor tag, trigger click, and download local blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `BRK_Grievances_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Saffron background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/10 rounded-full blur-3xl -z-1" />
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-900 border border-navy-800 rounded-2xl mb-4 text-saffron-500">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white">Grievances Office Access</h1>
            <p className="text-xs text-slate-400 mt-2">Enter administration credentials to access the citizens' grievances portal.</p>
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
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFD200] text-slate-950 border-b border-[#e0b900] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-yellow-600/20 shadow-sm shrink-0">
              <img src="/images/logo.png" alt="TDP Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="block font-black text-sm text-slate-950 uppercase tracking-wider leading-tight">
                Grievance Administration
              </span>
              <span className="block text-[9px] font-black text-navy-900 tracking-wider uppercase">
                MP Rajya Sabha Office
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchTickets}
              className="p-2.5 bg-slate-950/5 hover:bg-slate-950/10 text-slate-950 rounded-xl transition-all border border-slate-950/10"
              title="Refresh Tickets"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tickets</span>
            <span className="text-3xl font-black text-navy-900 mt-2">{totalCount}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between border-l-4 border-l-slate-400">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</span>
            <span className="text-3xl font-black text-slate-600 mt-2">{pendingCount}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Under Review</span>
            <span className="text-3xl font-black text-amber-600 mt-2">{inProgressCount}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Tickets</span>
            <span className="text-3xl font-black text-emerald-600 mt-2">{resolvedCount}</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200 mb-6 space-x-4">
          <button
            onClick={() => setActiveView('list')}
            className={`pb-3 text-xs font-black uppercase tracking-wider px-2 border-b-2 cursor-pointer transition-all ${
              activeView === 'list' 
                ? 'border-navy-900 text-navy-900 border-b-2 border-b-navy-900' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Petitions List ({filteredTickets.length})
          </button>
          <button
            onClick={() => {
              setActiveView('trends')
              setSearchQuery('')
              setStatusFilter('ALL')
              setCategoryFilter('ALL')
            }}
            className={`pb-3 text-xs font-black uppercase tracking-wider px-2 border-b-2 cursor-pointer transition-all ${
              activeView === 'trends' 
                ? 'border-navy-900 text-navy-900 border-b-2 border-b-navy-900' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Geographical Trends
          </button>
        </div>

        {activeView === 'list' ? (
          <>
            {/* Action Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-grow w-full md:max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none"
                  placeholder="Search by Ticket ID, Citizen Name, or Subject..."
                />
                <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-3" />
              </div>

              {/* Filtering Dropdowns & Export */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="flex gap-4 w-full">
                  <div className="flex-1 md:flex-none">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none text-slate-800"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">Under Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>

                  <div className="flex-1 md:flex-none">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none text-slate-800"
                    >
                      <option value="ALL">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleExportCSV}
                  disabled={filteredTickets.length === 0}
                  className="px-4 py-3 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Download className="w-4 h-4 text-[#FFD200]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Tickets Grid / Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="text-center py-20">
                  <RefreshCw className="w-8 h-8 animate-spin text-saffron-500 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">Loading grievance tickets...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-20">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-slate-600 mb-1">No Tickets Found</h3>
                  <p className="text-slate-400 text-xs">There are no tickets matching your current search filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket ID</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citizen</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="relative px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {filteredTickets.map((ticket) => (
                        <tr 
                          key={ticket.id}
                          onClick={() => handleSelectTicket(ticket)}
                          className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-mono font-bold text-navy-900 tracking-wider">
                            {ticket.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                            {ticket.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                            {ticket.category}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-700 max-w-xs truncate font-medium">
                            {ticket.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                              ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                              ticket.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                              ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                            <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Insights Alerts & Location Hotspots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Local Issue Spikes Warning list */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-navy-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />
                    Active Local Issue Spikes
                  </h3>
                  {localSpikes.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                      <p className="text-xs text-slate-600 font-bold">No Localized Spikes Detected</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Citizens' complaints are currently distributed evenly without regional clusters.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {localSpikes.map((spike, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl gap-3">
                          <div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-700 uppercase tracking-wider mb-1">
                              {spike.category} Spike
                            </span>
                            <p className="text-xs font-black text-navy-950">
                              {spike.location}
                            </p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                              {spike.count} active unresolved petitions in this region.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSearchQuery(spike.district)
                              setCategoryFilter(spike.category)
                              setActiveView('list')
                            }}
                            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer shadow-sm text-center"
                          >
                            Inspect Petitions
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Top Hotspots list */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-navy-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-saffron-600" />
                    Top Hotspot Locations
                  </h3>
                  {hotspots.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-8 text-center">No location hotspot data available.</p>
                  ) : (
                    <div className="space-y-3">
                      {hotspots.map((hotspot, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                          <div>
                            <span className="font-extrabold text-navy-950 block">{hotspot.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{hotspot.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-navy-900 block">{hotspot.count} tickets</span>
                            <span className="text-[10px] text-slate-500 font-semibold truncate block max-w-[130px]">{hotspot.topCategory}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AP Districts Heatmap Grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
                <div>
                  <h3 className="text-sm font-black text-navy-900 flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-navy-600" />
                    Andhra Pradesh District Heatmap
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    Visualizing complaint volumes across districts of AP. Click any active card to inspect district tickets.
                  </p>
                </div>
                {/* Heatmap Legend */}
                <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-wider text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-slate-50 border border-slate-200 rounded" /> 0 tickets</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-50/40 border border-yellow-250 border-l-2 border-l-[#FFD200] rounded" /> 1-2</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-50/40 border border-amber-250 border-l-2 border-l-amber-500 rounded" /> 3-5</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-50/40 border border-rose-250 border-l-2 border-l-rose-600 rounded animate-pulse" /> 6+</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {districtData.map((d) => (
                  <div
                    key={d.name}
                    onClick={() => {
                      if (d.count > 0) {
                        setSearchQuery(d.name === 'Other / Not Specified' ? '' : d.name)
                        setActiveView('list')
                      }
                    }}
                    className={`border rounded-2xl p-4.5 transition-all duration-300 flex flex-col justify-between select-none ${
                      d.count === 0 
                        ? 'bg-slate-50/30 border-slate-200 opacity-60 cursor-default' 
                        : 'hover:shadow-md hover:scale-[1.01] cursor-pointer'
                    } ${
                      d.count === 0 ? '' :
                      d.count <= 2 ? 'bg-yellow-50/15 border-yellow-200 border-l-4 border-l-[#FFD200]' :
                      d.count <= 5 ? 'bg-amber-50/15 border-amber-200 border-l-4 border-l-amber-500' :
                      'bg-rose-50/15 border-rose-200 border-l-4 border-l-rose-600'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-black text-navy-900 text-xs sm:text-sm">{d.name}</span>
                        {d.count > 0 && (
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            d.count <= 2 ? 'bg-yellow-100 text-yellow-800' :
                            d.count <= 5 ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {d.count} tickets
                          </span>
                        )}
                      </div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        {d.count === 0 ? 'No petitions' : 'Active Region'}
                      </span>
                    </div>

                    {d.count > 0 ? (
                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">Top Category:</span>
                        <span className="text-navy-950 font-black truncate max-w-[130px]">{d.topCategory}</span>
                      </div>
                    ) : (
                      <div className="mt-4 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 italic">
                        No issues reported
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail View Drawer/Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTicket(null)}
              className="absolute inset-0 bg-navy-950/70"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-navy-900 text-white flex justify-between items-center sticky top-0 z-10 border-b border-navy-950">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">Grievance Reference</span>
                  <h3 className="text-base font-mono font-black text-white tracking-wider flex items-center">
                    {selectedTicket.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 flex-grow space-y-6">
                {/* Details Section */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-xs">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 font-medium">Citizen Name:</span>
                      <strong className="text-navy-900 font-bold">{selectedTicket.name}</strong>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 font-medium">Registered:</span>
                      <strong className="text-navy-900 font-bold">{new Date(selectedTicket.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 font-medium">Phone:</span>
                      <strong className="text-navy-900 font-bold">{selectedTicket.phone}</strong>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500 font-medium">Email:</span>
                      <strong className="text-navy-900 font-bold">{selectedTicket.email}</strong>
                    </div>
                  </div>

                  {/* Location Area details */}
                  {(selectedTicket.state || selectedTicket.district) && (
                    <div className="border-t border-slate-200/60 pt-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Geographic Area Details</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500">State:</span> <strong className="text-navy-900 font-bold">{selectedTicket.state || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">District:</span> <strong className="text-navy-900 font-bold">{selectedTicket.district || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Mandal:</span> <strong className="text-navy-900 font-bold">{selectedTicket.mandal || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">City/Town:</span> <strong className="text-navy-900 font-bold">{selectedTicket.cityTown || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Village/Ward:</span> <strong className="text-navy-900 font-bold">{selectedTicket.villageWard || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Pincode:</span> <strong className="text-navy-900 font-bold">{selectedTicket.pincode || 'N/A'}</strong>
                        </div>
                      </div>
                      {selectedTicket.address && (
                        <div className="mt-2 text-xs">
                          <span className="text-slate-500">Address:</span> <strong className="text-navy-900 font-bold">{selectedTicket.address}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Subject and Description */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500 font-medium">Category:</span>
                    <strong className="text-navy-900 font-bold">{selectedTicket.category}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Subject</span>
                    <h4 className="text-sm font-extrabold text-navy-900">{selectedTicket.subject}</h4>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Grievance Description</span>
                    <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-xl">
                      {selectedTicket.description}
                    </p>
                  </div>
                </div>

                {/* Logs History / Steps */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-saffron-600" />
                    Grievance Update Log History
                  </h4>
                  {selectedTicket.logs && selectedTicket.logs.length > 0 ? (
                    <div className="flow-root bg-slate-50 border border-slate-100 rounded-2xl p-5">
                      <ul className="-mb-8">
                        {selectedTicket.logs.map((log, logIdx) => (
                          <li key={log.id}>
                            <div className="relative pb-8">
                              {logIdx !== selectedTicket.logs!.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    log.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' :
                                    log.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' :
                                    log.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-600' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    <Clock className="w-4 h-4" />
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-xs font-bold text-navy-950 flex items-center gap-2">
                                      <span>Status:</span>
                                      <span className="uppercase text-[9px] font-black tracking-wider bg-white px-2 py-0.5 rounded border border-slate-200">
                                        {log.status.replace('_', ' ')}
                                      </span>
                                    </p>
                                    <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed whitespace-pre-wrap">
                                      {log.notes}
                                    </p>
                                  </div>
                                  <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-bold">
                                    <span>{new Date(log.createdAt).toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No progress logs recorded yet.</p>
                  )}
                </div>

                {/* Edit Form */}
                <form onSubmit={handleUpdateTicket} className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center">
                    <SlidersHorizontal className="w-4 h-4 mr-1.5 text-saffron-600" />
                    Administrative Actions
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Update Status</label>
                      <select
                        value={editingStatus}
                        onChange={(e) => setEditingStatus(e.target.value as TicketStatus)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none text-slate-800"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">Under Review</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Official Response Notes</label>
                    <textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none text-slate-700"
                      placeholder="Add official notes, actions taken, or resolution information..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-3 bg-navy-900 text-white hover:bg-navy-800 disabled:bg-slate-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-saffron-500" />
                        <span>Saving changes...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
