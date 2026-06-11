'use client'

import { useState, useEffect } from 'react'
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
  FileText
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
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
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

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchTickets()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      fetchTickets()
    } else {
      setAuthError('Invalid passcode. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
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
    setEditingNotes(ticket.adminNotes || '')
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
          adminNotes: editingNotes
        })
      })

      if (response.ok) {
        const updated = await response.json()
        setTickets(prev => prev.map(t => t.id === updated.id ? updated : t))
        setSelectedTicket(updated)
        // Trigger success notification or confetti
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
            <h1 className="text-xl font-extrabold text-white">Grievance Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-2">Enter administration passcode to access the office dashboard.</p>
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
                Passcode *
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 focus:border-saffron-500 transition-all text-sm outline-none text-white font-mono tracking-widest text-center"
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
      <header className="sticky top-0 z-40 bg-navy-900 text-white border-b border-navy-950 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-navy-850 rounded-lg flex items-center justify-center border border-navy-800">
              <LifeBuoy className="w-5 h-5 text-saffron-500 animate-spin" />
            </div>
            <div>
              <span className="block font-bold text-sm text-white uppercase tracking-wider leading-tight">
                Grievance Administration
              </span>
              <span className="block text-[10px] font-semibold text-saffron-400 tracking-widest uppercase">
                MP Rajya Sabha Office
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={fetchTickets}
              className="p-2.5 bg-navy-850 border border-navy-800 hover:bg-navy-800 text-slate-300 rounded-lg transition-all"
              title="Refresh Tickets"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
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

          {/* Filtering Dropdowns */}
          <div className="flex gap-4 w-full md:w-auto">
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
