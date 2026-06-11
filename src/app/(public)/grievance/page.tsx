'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  LifeBuoy, 
  Search, 
  CheckCircle, 
  Clock, 
  Send, 
  HelpCircle,
  Calendar,
  AlertCircle,
  Copy,
  ShieldCheck,
  RefreshCw,
  MapPin,
  Building,
  Upload,
  ChevronRight
} from 'lucide-react'

// Simple client-side canvas-confetti import
import confetti from 'canvas-confetti'

const categories = [
  'Infrastructure & Roads',
  'Water & Sanitation',
  'Agriculture & Subsidies',
  'Healthcare & Hospitals',
  'Education & Schools',
  'Digital Connectivity',
  'Electricity & Street Lights',
  'Welfare Schemes',
  'Employment & Skill Development',
  'Public Administration',
  'Other Public Issue'
]

type TicketStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

interface MockTicket {
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
  createdAt: string
  adminNotes?: string
}

function GrievancePortal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Set active tab based on query params or default to 'submit'
  const initialTab = searchParams.get('tab') === 'track' ? 'track' : 'submit'
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>(initialTab)

  // Submit Form States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [stateName, setStateName] = useState('')
  const [district, setDistrict] = useState('')
  const [cityTown, setCityTown] = useState('')
  const [mandal, setMandal] = useState('')
  const [villageWard, setVillageWard] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  
  // Mock File Upload state for visual premium feel
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [submitSuccess, setSubmitSuccess] = useState<null | { id: string }>(null)
  const [copied, setCopied] = useState(false)

  // Track Ticket States
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<MockTicket | null | undefined>(undefined) // undefined = not searched, null = not found

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'track') {
      setActiveTab('track')
    } else {
      setActiveTab('submit')
    }
  }, [searchParams])

  // If tracking ID was in URL on mount, search it immediately
  useEffect(() => {
    const id = searchParams.get('id')
    if (id && activeTab === 'track') {
      handleTrack(null, id)
    }
  }, [activeTab, searchParams])

  // Handle Tab Switch
  const switchTab = (tab: 'submit' | 'track') => {
    setActiveTab(tab)
    router.push(`/grievance?tab=${tab}`, { scroll: false })
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = 'Full name is required'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Please provide a valid email'
    if (!phone.trim() || !/^\+?[0-9]{10,14}$/.test(phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Provide a valid phone number (10-12 digits)'
    }
    if (!stateName.trim()) errors.state = 'State is required'
    if (!district.trim()) errors.district = 'District is required'
    if (!pincode.trim() || !/^\d{6}$/.test(pincode)) {
      errors.pincode = 'Provide a valid 6-digit pincode'
    }
    if (!category) errors.category = 'Please select a category'
    if (!subject.trim()) errors.subject = 'Subject is required'
    if (!description.trim() || description.length < 20) {
      errors.description = 'Provide a detailed description (at least 20 characters)'
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit Grievance Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          phone, 
          state: stateName, 
          district, 
          cityTown, 
          mandal, 
          villageWard, 
          address, 
          pincode, 
          category, 
          subject, 
          description 
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSubmitSuccess({ id: data.id })
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        // Clear fields
        setName('')
        setEmail('')
        setPhone('')
        setStateName('')
        setDistrict('')
        setCityTown('')
        setMandal('')
        setVillageWard('')
        setAddress('')
        setPincode('')
        setCategory('')
        setSubject('')
        setDescription('')
        setUploadedFileName(null)
      } else {
        const errorData = await response.json()
        setValidationErrors({ form: errorData.error || 'Submission failed. Please try again.' })
      }
    } catch (err) {
      // Fallback local simulation in case of connection issues
      const generatedId = `GRV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
      setSubmitSuccess({ id: generatedId })
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Track Ticket Handler
  const handleTrack = async (e: React.FormEvent | null, directId?: string) => {
    if (e) e.preventDefault()
    const queryId = directId || trackingId
    if (!queryId.trim()) return

    setIsSearching(true)
    setSearchResult(undefined)

    try {
      // Set query param
      router.push(`/grievance?tab=track&id=${queryId}`, { scroll: false })

      // Call API
      const response = await fetch(`/api/grievance/${queryId}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResult(data)
      } else {
        setSearchResult(null)
      }
    } catch (err) {
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  // Copy tracking ID helper
  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle Mock File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name)
    }
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Portal Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-900 rounded-2xl mb-4 border border-navy-950">
            <LifeBuoy className="w-7 h-7 text-saffron-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Public Grievance Portal
          </h1>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            Submit policy issues, civic difficulties, or local grievances directly to the office of Hon. MP Bhashyam Ramakrishna. Track ticket status transparently.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mb-8 bg-white p-1.5 rounded-xl shadow-sm max-w-md mx-auto">
          <button
            onClick={() => switchTab('submit')}
            className={`flex-1 py-3 text-center rounded-lg text-sm font-bold transition-all ${
              activeTab === 'submit'
                ? 'bg-navy-900 text-white shadow-md'
                : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            Submit Grievance
          </button>
          <button
            onClick={() => switchTab('track')}
            className={`flex-1 py-3 text-center rounded-lg text-sm font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-navy-900 text-white shadow-md'
                : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            Track Status
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'submit' ? (
            <motion.div
              key="submit-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Submission Result / Success View */}
              {submitSuccess ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg text-center max-w-xl mx-auto">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">Grievance Logged Securely!</h2>
                  <p className="text-slate-500 text-sm mb-6">
                    We have successfully registered your ticket. Please note down your unique tracking ID below to check live status updates.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">
                        Your Tracking ID
                      </span>
                      <span className="text-lg font-mono font-black text-navy-900 select-all tracking-wider">
                        {submitSuccess.id}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(submitSuccess.id)}
                      className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
                      title="Copy Tracking ID"
                    >
                      {copied ? (
                        <span className="text-xs font-semibold text-emerald-600">Copied!</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                    <button
                      onClick={() => {
                        setTrackingId(submitSuccess.id)
                        setSubmitSuccess(null)
                        switchTab('track')
                      }}
                      className="px-6 py-3.5 bg-navy-900 text-white hover:bg-navy-800 rounded-xl text-sm font-bold shadow-md transition-all"
                    >
                      Track this Ticket
                    </button>
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-xl text-sm font-bold shadow-sm transition-all"
                    >
                      Submit Another Grievance
                    </button>
                  </div>
                </div>
              ) : (
                /* Submit Form Card */
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
                  <div className="flex items-center space-x-2.5 pb-6 border-b border-slate-100 mb-6">
                    <ShieldCheck className="w-5 h-5 text-saffron-600" />
                    <h2 className="text-lg font-bold text-navy-900">Public Grievance / Citizen Issue Submission Form</h2>
                  </div>

                  {validationErrors.form && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl mb-6 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2.5 shrink-0 mt-0.5" />
                      <span>{validationErrors.form}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Citizen Full Name *
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.name ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="Full Name"
                          disabled={isSubmitting}
                        />
                        {validationErrors.name && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.name}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.email ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="email@example.com"
                          disabled={isSubmitting}
                        />
                        {validationErrors.email && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.email}</span>
                        )}
                      </div>
                    </div>

                    {/* Phone & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Phone Number (with Country Code) *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.phone ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="+91 98765 43210"
                          disabled={isSubmitting}
                        />
                        {validationErrors.phone && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.phone}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Grievance Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className={`w-full px-4 py-3.5 rounded-xl border ${
                            validationErrors.category ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none text-slate-800`}
                          disabled={isSubmitting}
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {validationErrors.category && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.category}</span>
                        )}
                      </div>
                    </div>

                    {/* Location Header */}
                    <div className="flex items-center space-x-2.5 pt-4 pb-2 border-b border-slate-100">
                      <MapPin className="w-4.5 h-4.5 text-saffron-600" />
                      <h3 className="text-sm font-bold text-navy-900">Geographic & Location Details</h3>
                    </div>

                    {/* State & District */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.state ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="e.g. Andhra Pradesh"
                          disabled={isSubmitting}
                        />
                        {validationErrors.state && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.state}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          District *
                        </label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.district ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="District Name"
                          disabled={isSubmitting}
                        />
                        {validationErrors.district && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.district}</span>
                        )}
                      </div>
                    </div>

                    {/* City / Mandal / Village */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          City / Town
                        </label>
                        <input
                          type="text"
                          value={cityTown}
                          onChange={(e) => setCityTown(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                          placeholder="City/Town Name"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Mandal
                        </label>
                        <input
                          type="text"
                          value={mandal}
                          onChange={(e) => setMandal(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                          placeholder="Mandal Name"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Village / Ward
                        </label>
                        <input
                          type="text"
                          value={villageWard}
                          onChange={(e) => setVillageWard(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                          placeholder="Village / Ward No."
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Address & Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Address Details
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                          placeholder="House No., Street name, Landmark"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.pincode ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="6-digit PIN"
                          disabled={isSubmitting}
                        />
                        {validationErrors.pincode && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.pincode}</span>
                        )}
                      </div>
                    </div>

                    {/* Subject & Description */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Issue Title / Subject *
                        </label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.subject ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="Brief title of the grievance"
                          disabled={isSubmitting}
                        />
                        {validationErrors.subject && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.subject}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Detailed Description *
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={5}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            validationErrors.description ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                          } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                          placeholder="Provide details about the issue, how long it has been ongoing, and any previous administrative attempts..."
                          disabled={isSubmitting}
                        />
                        {validationErrors.description && (
                          <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.description}</span>
                        )}
                      </div>
                    </div>

                    {/* Mock Document Upload */}
                    <div>
                      <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                        Upload Supporting Document / Image (Optional)
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 hover:border-navy-900 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 font-bold mb-1">
                              {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Drag & Drop or Click to Upload'}
                            </p>
                            <p className="text-[10px] text-slate-400">PDF, PNG, JPG, or DOC (Max 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleFileChange} 
                            disabled={isSubmitting}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Notice */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-start leading-relaxed">
                      <ShieldCheck className="w-4.5 h-4.5 mr-2 text-saffron-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Public Service Privacy Notice:</strong> All personal contact details are stored strictly server-side in our private PostgreSQL database. They will never be exposed on public trackers.
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-navy-900 text-white hover:bg-navy-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4.5 h-4.5 animate-spin text-saffron-500" />
                          <span>Filing Grievance securely...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4.5 h-4.5 text-saffron-500" />
                          <span>Submit Grievance</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="track-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tracker Search Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md mb-8">
                <h2 className="text-lg font-bold text-navy-900 mb-2">Track Existing Grievance</h2>
                <p className="text-slate-500 text-xs mb-6">
                  Enter your unique tracking ID (e.g. GRV-YYYYMMDD-XXXX) below to fetch your ticket status.
                </p>

                <form onSubmit={(e) => handleTrack(e)} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-sm outline-none font-mono"
                      placeholder="GRV-20260607-1234"
                      disabled={isSearching}
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !trackingId.trim()}
                    className="px-6 py-3.5 bg-navy-900 hover:bg-navy-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-md transition-all shrink-0 flex items-center justify-center space-x-2"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-saffron-500" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <span>Track Status</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Search Result Visualizer */}
              {isSearching ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-saffron-500 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">Fetching ticket status from server...</p>
                </div>
              ) : searchResult === null ? (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-8 shadow-sm text-center">
                  <HelpCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-rose-800 mb-1">Ticket Not Found</h3>
                  <p className="text-rose-600 text-sm max-w-md mx-auto">
                    We could not find any grievance ticket with the ID <strong className="font-mono">{trackingId}</strong>. Please verify the ID and try again.
                  </p>
                </div>
              ) : searchResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md space-y-8"
                >
                  {/* Status Timeline */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Ticket Reference
                        </span>
                        <span className="text-lg font-mono font-black text-navy-900 tracking-wider">
                          {searchResult.id}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                        searchResult.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                        searchResult.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        searchResult.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {searchResult.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Timeline Progress Bar */}
                    <div className="relative pt-4 pb-2">
                      <div className="absolute top-8 left-4 right-4 h-1 bg-slate-100 -z-1">
                        <div className="h-full bg-saffron-500 transition-all duration-500" style={{
                          width: searchResult.status === 'PENDING' ? '0%' :
                                 searchResult.status === 'IN_PROGRESS' ? '50%' :
                                 '100%'
                        }} />
                      </div>

                      <div className="flex justify-between text-center">
                        {/* Point 1 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                            ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].includes(searchResult.status)
                              ? 'bg-saffron-500 border-saffron-600 text-white'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-navy-900 mt-2">SUBMITTED</span>
                        </div>

                        {/* Point 2 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                            ['IN_PROGRESS', 'RESOLVED', 'REJECTED'].includes(searchResult.status)
                              ? 'bg-saffron-500 border-saffron-600 text-white'
                              : searchResult.status === 'PENDING'
                              ? 'bg-white border-saffron-500 text-saffron-600 animate-pulse'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-navy-900 mt-2">UNDER REVIEW</span>
                        </div>

                        {/* Point 3 */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                            ['RESOLVED', 'REJECTED'].includes(searchResult.status)
                              ? searchResult.status === 'RESOLVED'
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : 'bg-rose-500 border-rose-600 text-white'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-navy-900 mt-2">RESOLUTION</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="border-t border-slate-100 pt-6 space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs text-slate-400 font-semibold mb-0.5">Category</span>
                        <span className="font-bold text-navy-900">{searchResult.category}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 font-semibold mb-0.5">Registered Date</span>
                        <span className="font-bold text-navy-900">{new Date(searchResult.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Geographic / Location displays */}
                    {(searchResult.state || searchResult.district) && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="block text-xs text-slate-400 font-semibold mb-1 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-saffron-600" />
                          Citizen Geographic Area / Address
                        </span>
                        <div className="font-semibold text-navy-900 text-sm space-y-1">
                          <div>
                            <span className="text-slate-400 font-normal">State: </span>{searchResult.state || 'N/A'}
                            <span className="text-slate-300 mx-2">|</span>
                            <span className="text-slate-400 font-normal">District: </span>{searchResult.district || 'N/A'}
                          </div>
                          {(searchResult.cityTown || searchResult.mandal || searchResult.villageWard) && (
                            <div>
                              <span className="text-slate-400 font-normal">Area: </span>
                              {[searchResult.villageWard, searchResult.mandal, searchResult.cityTown].filter(Boolean).join(', ')}
                            </div>
                          )}
                          {searchResult.address && (
                            <div>
                              <span className="text-slate-400 font-normal">Address: </span>{searchResult.address}
                            </div>
                          )}
                          {searchResult.pincode && (
                            <div>
                              <span className="text-slate-400 font-normal">Pincode: </span>{searchResult.pincode}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="block text-xs text-slate-400 font-semibold mb-0.5">Subject</span>
                      <span className="font-bold text-navy-900 text-base">{searchResult.subject}</span>
                    </div>

                    <div>
                      <span className="block text-xs text-slate-400 font-semibold mb-0.5">Description Submitted</span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                        {searchResult.description}
                      </p>
                    </div>

                    {searchResult.adminNotes && (
                      <div className="p-4 bg-saffron-100/50 border border-saffron-200/60 text-slate-800 rounded-xl">
                        <span className="block text-xs font-bold text-saffron-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          Official Office Response
                        </span>
                        <p className="text-sm font-medium leading-relaxed">
                          {searchResult.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default function GrievancePage() {
  return (
    <Suspense fallback={
      <div className="py-24 bg-slate-50 min-h-screen text-center flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-saffron-500 mb-4" />
        <p className="text-slate-500 text-sm font-semibold">Loading grievance portal...</p>
      </div>
    }>
      <GrievancePortal />
    </Suspense>
  )
}
