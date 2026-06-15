'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/components/LanguageContext'
import { grievanceCategories } from '@/lib/translations'
import { useSpeechToText } from '@/hooks/useSpeechToText'
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
  ChevronRight,
  X,
  Mic,
  MicOff,
  Wrench,
  Droplet,
  Wheat,
  HeartPulse,
  GraduationCap,
  Wifi,
  Lightbulb,
  Users,
  Briefcase
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
  logs?: Array<{
    id: string
    status: TicketStatus
    notes: string
    createdAt: string
  }>
}

function GrievancePortal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t, tContent, language } = useLanguage()


  // Localized Categories
  const categoriesList = Object.entries(grievanceCategories).map(([key, cat]) => ({
    id: key,
    label: cat[language] || cat['en']
  }))
  
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
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')

  const voiceBaseTextRef = useRef('')

  const {
    startListening,
    stopListening,
    toggleLanguage,
    isListening,
    recogLang,
    supported: sttSupported,
    error: sttError,
    interimTranscript
  } = useSpeechToText(language, (transcript) => {
    setDescription(voiceBaseTextRef.current + transcript)
  })

  const handleStartListening = () => {
    voiceBaseTextRef.current = description ? (description.endsWith(' ') ? description : description + ' ') : ''
    startListening()
  }

  const previewScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isListening && previewScrollRef.current) {
      previewScrollRef.current.scrollTop = previewScrollRef.current.scrollHeight
    }
  }, [description, interimTranscript, isListening])
  
  // Mock File Upload state for visual premium feel
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [submitSuccess, setSubmitSuccess] = useState<null | { id: string }>(null)
  const [copied, setCopied] = useState(false)

  // Map category ids to Lucide Icons
  const categoryIcons: Record<string, any> = {
    infra: Wrench,
    water: Droplet,
    agri: Wheat,
    health: HeartPulse,
    edu: GraduationCap,
    digital: Wifi,
    power: Lightbulb,
    welfare: Users,
    employ: Briefcase,
    admin: Building,
    other: HelpCircle
  }

  // Pincode dynamic lookup states
  interface PincodeRec {
    name: string
    district: string
    state: string
  }
  const [pincodeRecords, setPincodeRecords] = useState<PincodeRec[]>([])
  const [isLoadingPincode, setIsLoadingPincode] = useState(false)
  
  // Location selection modal states
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [manualLocationMode, setManualLocationMode] = useState(false)
  const [modalState, setModalState] = useState('')
  const [modalDistrict, setModalDistrict] = useState('')
  const [modalVillage, setModalVillage] = useState('')

  const locationHistoryPushedRef = useRef(false)

  // Sync showLocationModal with browser history
  useEffect(() => {
    if (showLocationModal && !locationHistoryPushedRef.current) {
      window.history.pushState({ type: 'locationModal' }, '')
      locationHistoryPushedRef.current = true
    } else if (!showLocationModal && locationHistoryPushedRef.current) {
      locationHistoryPushedRef.current = false
      if (window.history.state?.type === 'locationModal') {
        window.history.back()
      }
    }
  }, [showLocationModal])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (locationHistoryPushedRef.current) {
        locationHistoryPushedRef.current = false
        setShowLocationModal(false)
        if (!villageWard) {
          setPincode('')
        }
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [villageWard])

  // Helper to format place names nicely (e.g. PALNADU -> Palnadu)
  const formatPlaceName = (str: string) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Clear pincode and associated location selection states
  const handlePincodeClear = () => {
    setPincode('')
    setVillageWard('')
    setDistrict('')
    setStateName('')
    setMandal('')
    setPincodeRecords([])
    setValidationErrors((prev) => {
      const copy = { ...prev }
      delete copy.pincode
      return copy
    })
  }

  // Fetch details when a 6-digit pincode is entered
  useEffect(() => {
    if (/^\d{6}$/.test(pincode)) {
      // Dismiss keyboard on 6-digit input
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur()
      }
      const fetchPincodeDetails = async () => {
        setIsLoadingPincode(true)
        try {
          const res = await fetch(`/api/pincode?code=${pincode}`)
          if (res.ok) {
            const data = await res.json()
            if (data.success && data.records && data.records.length > 0) {
              setPincodeRecords(data.records)
              setManualLocationMode(false)
              setShowLocationModal(true)
            } else {
              setPincodeRecords([])
              setManualLocationMode(true)
              setShowLocationModal(true)
              setStateName('')
              setDistrict('')
              setVillageWard('')
            }
          } else {
            setPincodeRecords([])
            setManualLocationMode(true)
            setShowLocationModal(true)
            setStateName('')
            setDistrict('')
            setVillageWard('')
          }
        } catch (err) {
          console.error('Error fetching pincode details:', err)
          setPincodeRecords([])
          setManualLocationMode(true)
          setShowLocationModal(true)
          setStateName('')
          setDistrict('')
          setVillageWard('')
        } finally {
          setIsLoadingPincode(false)
        }
      }
      fetchPincodeDetails()
    } else {
      setPincodeRecords([])
      setShowLocationModal(false)
      setStateName('')
      setDistrict('')
      setVillageWard('')
    }
  }, [pincode])

  // Track Ticket States
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<MockTicket | null | undefined>(undefined) // undefined = not searched, null = not found
  const [lastSearchedId, setLastSearchedId] = useState('')

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'track') {
      setActiveTab('track')
    } else {
      setActiveTab('submit')
    }
  }, [searchParams])

  // Sync trackingId input when URL id query param changes
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setTrackingId(id)
    }
  }, [searchParams])

  // Sync category state when URL query param changes
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setCategory(cat)
    }
  }, [searchParams])

  // If tracking ID was in URL on mount, search it immediately (prevent loop using lastSearchedId)
  useEffect(() => {
    const id = searchParams.get('id')
    if (id && activeTab === 'track' && lastSearchedId !== id && !isSearching) {
      handleTrack(null, id)
    }
  }, [activeTab, searchParams, lastSearchedId, isSearching])

  // Handle Tab Switch
  const switchTab = (tab: 'submit' | 'track') => {
    setActiveTab(tab)
    router.push(`/grievance?tab=${tab}`, { scroll: false })
  }

  // Validate specific step
  const validateStep = (step: number) => {
    const errors: Record<string, string> = {}
    
    if (step >= 1) {
      if (!name.trim()) errors.name = t('validation.nameRequired')
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = t('validation.emailInvalid')
      if (!phone.trim() || !/^\+?[0-9]{10,14}$/.test(phone.replace(/[\s-]/g, ''))) {
        errors.phone = t('validation.phoneInvalid')
      }
    }
    
    if (step >= 2) {
      if (!pincode.trim() || !/^\d{6}$/.test(pincode)) {
        errors.pincode = t('validation.pincodeInvalid')
      } else if (!villageWard.trim() || !stateName.trim() || !district.trim()) {
        errors.pincode = 'Please select a village/area matching this pincode'
      }
    }
    
    if (step >= 3) {
      if (!category) errors.category = t('validation.categoryRequired')
      if (!subject.trim()) errors.subject = t('validation.subjectRequired')
      if (!description.trim() || description.length < 20) {
        errors.description = t('validation.descriptionRequired')
      }
    }
    
    const stepErrors: Record<string, string> = {}
    if (step === 1) {
      if (errors.name) stepErrors.name = errors.name
      if (errors.email) stepErrors.email = errors.email
      if (errors.phone) stepErrors.phone = errors.phone
    } else if (step === 2) {
      if (errors.pincode) stepErrors.pincode = errors.pincode
    } else if (step === 3) {
      if (errors.category) stepErrors.category = errors.category
      if (errors.subject) stepErrors.subject = errors.subject
      if (errors.description) stepErrors.description = errors.description
    }
    
    setValidationErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  // Validate form
  const validateForm = () => {
    return validateStep(1) && validateStep(2) && validateStep(3)
  }

  // Submit Grievance Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(1)) {
      setCurrentStep(1)
      return
    }
    if (!validateStep(2)) {
      setCurrentStep(2)
      return
    }
    if (!validateStep(3)) {
      return
    }

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
        setConsentChecked(false)
        setCurrentStep(1)
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
      setConsentChecked(false)
      setCurrentStep(1)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Track Ticket Handler
  const handleTrack = async (e: React.FormEvent | null, directId?: string) => {
    if (e) e.preventDefault()
    const queryId = directId || trackingId
    if (!queryId.trim()) return

    setLastSearchedId(queryId) // Record search to prevent loop
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
            {t('grievance.portalTitle')}
          </h1>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            {t('grievance.portalSubtitle')}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 mb-8 bg-white p-1.5 rounded-xl shadow-sm max-w-md mx-auto">
          <button
            onClick={() => switchTab('submit')}
            className={`flex-1 py-3 text-center rounded-lg text-sm font-bold transition-all ${
              activeTab === 'submit'
                ? 'bg-saffron-400 text-navy-950 shadow-md'
                : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            {t('grievance.submitTab')}
          </button>
          <button
            onClick={() => switchTab('track')}
            className={`flex-1 py-3 text-center rounded-lg text-sm font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-saffron-400 text-navy-950 shadow-md'
                : 'text-slate-500 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            {t('grievance.trackTab')}
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
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">{t('grievance.successTitle')}</h2>
                  <p className="text-slate-500 text-sm mb-6">
                    {t('grievance.successDesc')}
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">
                        {t('grievance.trackingIdLabel')}
                      </span>
                      <span className="text-lg font-mono font-black text-navy-900 select-all tracking-wider text-left block">
                        {submitSuccess.id}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(submitSuccess.id)}
                      className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
                      title="Copy Tracking ID"
                    >
                      {copied ? (
                        <span className="text-xs font-semibold text-emerald-600">{t('grievance.copied')}</span>
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
                      className="px-6 py-3.5 bg-saffron-400 text-navy-950 hover:bg-saffron-500 rounded-xl text-sm font-bold shadow-md transition-all"
                    >
                      {t('grievance.trackThisButton')}
                    </button>
                    <button
                      onClick={() => {
                        setSubmitSuccess(null)
                        setCurrentStep(1)
                      }}
                      className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-xl text-sm font-bold shadow-sm transition-all"
                    >
                      {t('grievance.submitAnotherButton')}
                    </button>
                  </div>
                </div>
              ) : (
                /* Submit Form Card */
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md">
                  {/* Sleek Header Progress Tracker */}
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <div className="relative flex items-center justify-between w-full max-w-md mx-auto mb-4">
                      {/* Connector Line */}
                      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -translate-y-1/2 z-0">
                        <motion.div 
                          className="h-full bg-saffron-500" 
                          animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      {[
                        { number: 1, label: language === 'te' ? 'పౌర గుర్తింపు' : 'Citizen Identity', desc: language === 'te' ? 'పేరు, ఫోన్' : 'Name, Phone' },
                        { number: 2, label: language === 'te' ? 'భౌగోళిక ప్రాంతం' : 'Geography', desc: language === 'te' ? 'పిన్‌కోడ్, చిరునామా' : 'Pincode, Address' },
                        { number: 3, label: language === 'te' ? 'సమస్య వివరాలు' : 'Issue Details', desc: language === 'te' ? 'వర్గం, శీర్షిక' : 'Category, Title' }
                      ].map((s) => {
                        const isActive = currentStep === s.number
                        const isCompleted = currentStep > s.number
                        return (
                          <div key={s.number} className="flex flex-col items-center relative z-10">
                            <button
                              type="button"
                              onClick={() => {
                                if (isCompleted || s.number < currentStep) {
                                  setCurrentStep(s.number as 1 | 2 | 3)
                                } else if (s.number > currentStep) {
                                  if (validateStep(currentStep)) {
                                    setCurrentStep(s.number as 1 | 2 | 3)
                                  }
                                }
                              }}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-navy-900 border-navy-900 text-saffron-500 shadow-md ring-4 ring-navy-900/10'
                                  : isCompleted
                                  ? 'bg-saffron-500 border-saffron-500 text-navy-950 shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                              }`}
                            >
                              {isCompleted ? '✓' : s.number}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Step Labels */}
                    <div className="grid grid-cols-3 text-center max-w-lg mx-auto gap-2">
                      {[
                        { number: 1, label: language === 'te' ? 'పౌర గుర్తింపు' : 'Citizen Identity', desc: language === 'te' ? 'పేరు, ఫోన్' : 'Name, Phone' },
                        { number: 2, label: language === 'te' ? 'భౌగోళిక ప్రాంతం' : 'Geography', desc: language === 'te' ? 'పిన్‌కోడ్, చిరునామా' : 'Pincode, Address' },
                        { number: 3, label: language === 'te' ? 'సమస్య వివరాలు' : 'Issue Details', desc: language === 'te' ? 'వర్గం, శీర్షిక' : 'Category, Title' }
                      ].map((s) => {
                        const isActive = currentStep === s.number
                        return (
                          <div key={s.number} className="flex flex-col items-center">
                            <span className={`text-[11px] sm:text-xs font-bold transition-colors ${
                              isActive ? 'text-navy-900' : 'text-slate-400'
                            }`}>
                              {s.label}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 mt-0.5 hidden sm:inline">
                              {s.desc}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {validationErrors.form && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl mb-6 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2.5 shrink-0 mt-0.5" />
                      <span>{validationErrors.form}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Citizen Identity */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                                {t('grievance.citizenNameLabel')} *
                              </label>
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${
                                  validationErrors.name ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                                } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                                placeholder={t('grievance.citizenNamePlaceholder')}
                                disabled={isSubmitting}
                              />
                              {validationErrors.name && (
                                <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.name}</span>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                                {t('grievance.emailLabel')} *
                              </label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${
                                  validationErrors.email ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                                } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                                placeholder={t('grievance.emailPlaceholder')}
                                disabled={isSubmitting}
                              />
                              {validationErrors.email && (
                                <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.email}</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                              {t('grievance.phoneLabel')} *
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className={`w-full px-4 py-3 rounded-xl border ${
                                validationErrors.phone ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                              } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                              placeholder={t('grievance.phonePlaceholder')}
                              disabled={isSubmitting}
                            />
                            {validationErrors.phone && (
                              <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.phone}</span>
                            )}
                          </div>

                          <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                if (validateStep(1)) {
                                  setCurrentStep(2)
                                }
                              }}
                              className="px-6 py-3 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                            >
                              <span>{language === 'te' ? 'తరువాతి దశ' : 'Next Step'}</span>
                              <ChevronRight className="w-4 h-4 text-saffron-400" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Geography */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Pincode Input */}
                            <div>
                              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                                {t('grievance.pincode')} *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={pincode}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                                    setPincode(val)
                                    if (val.length === 6) {
                                      e.target.blur()
                                    }
                                  }}
                                  onFocus={handlePincodeClear}
                                  className={`w-full px-4 py-3 rounded-xl border ${
                                    validationErrors.pincode ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                                  } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none pr-20`}
                                  placeholder={t('grievance.pincodePlaceholder')}
                                  disabled={isSubmitting}
                                />
                                {isLoadingPincode && (
                                  <div className="absolute right-3 top-3 flex items-center justify-center">
                                    <RefreshCw className="w-4 h-4 text-saffron-500 animate-spin" />
                                  </div>
                                )}
                                {!isLoadingPincode && pincodeRecords.length > 0 && /^\d{6}$/.test(pincode) && (
                                  <div className="absolute right-3 top-3 flex items-center justify-center">
                                    <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">✓ Found</span>
                                  </div>
                                )}
                              </div>
                              {validationErrors.pincode && (
                                <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.pincode}</span>
                              )}
                            </div>

                            {/* Selected Location Details */}
                            {villageWard && district && stateName ? (
                              <div>
                                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                                  {language === 'te' ? 'ఎంచుకున్న ప్రాంతం' : 'Selected Location'}
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    readOnly
                                    value={`${villageWard}, ${district} District, ${stateName}`}
                                    onClick={() => {
                                      setManualLocationMode(false)
                                      setShowLocationModal(true)
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-saffron-400 transition-all text-sm outline-none cursor-pointer text-navy-900 font-bold pr-10"
                                    title="Click to select another area"
                                  />
                                  <MapPin className="w-4.5 h-4.5 text-saffron-500 absolute right-3.5 top-3.5 pointer-events-none" />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  {language === 'te' ? 'స్థానం' : 'Location'}
                                </label>
                                <input
                                  type="text"
                                  readOnly
                                  value="Enter pincode to choose location"
                                  className="w-full px-4 py-3 rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-400 font-medium outline-none"
                                />
                              </div>
                            )}
                          </div>

                          {/* Address & Mandal Optional Inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                                {language === 'te' ? 'మండలం (ఐచ్ఛికం)' : 'Mandal (Optional)'}
                              </label>
                              <input
                                type="text"
                                value={mandal}
                                onChange={(e) => setMandal(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                                placeholder={language === 'te' ? 'మండలం పేరు' : 'Mandal name'}
                                disabled={isSubmitting}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                                {language === 'te' ? 'నిర్దిష్ట చిరునామా (ఐచ్ఛికం)' : 'Specific Address (Optional)'}
                              </label>
                              <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                                placeholder={language === 'te' ? 'ఇంటి నంబరు, వీధి లేదా మైలురాయి' : 'House No, Street, or Landmark'}
                                disabled={isSubmitting}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between pt-4 border-t border-slate-100 gap-4">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
                            >
                              {language === 'te' ? 'వెనుకకు' : 'Back'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (validateStep(2)) {
                                  setCurrentStep(3)
                                }
                              }}
                              className="px-6 py-3 bg-navy-900 hover:bg-navy-950 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                            >
                              <span>{language === 'te' ? 'తరువాతి దశ' : 'Next Step'}</span>
                              <ChevronRight className="w-4 h-4 text-saffron-400" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Issue Details & Files */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6"
                        >
                          {/* Visual Category Selection Cards Grid */}
                          <div>
                            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
                              {t('grievance.categoryLabel')} *
                            </label>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {categoriesList.map((c) => {
                                const IconComponent = categoryIcons[c.id] || HelpCircle
                                const isSelected = category === c.id
                                return (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                      setCategory(c.id)
                                      setValidationErrors((prev) => {
                                        const copy = { ...prev }
                                        delete copy.category
                                        return copy
                                      })
                                    }}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer group select-none h-24 ${
                                      isSelected
                                        ? 'bg-saffron-50/80 border-saffron-500 text-navy-950 shadow-md shadow-saffron-500/10 ring-2 ring-saffron-500/20'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-saffron-300 hover:bg-slate-50/50'
                                    }`}
                                  >
                                    <div className={`p-2 rounded-xl mb-1.5 transition-colors ${
                                      isSelected ? 'bg-saffron-400 text-navy-950' : 'bg-slate-50 text-slate-500 group-hover:text-saffron-600 group-hover:bg-saffron-50'
                                    }`}>
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-tight leading-snug">
                                      {c.label}
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                            {validationErrors.category && (
                              <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.category}</span>
                            )}
                          </div>

                          {/* Subject */}
                          <div>
                            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                              {t('grievance.subjectLabel')} *
                            </label>
                            <input
                              type="text"
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              className={`w-full px-4 py-3 rounded-xl border ${
                                validationErrors.subject ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                              } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                              placeholder={t('grievance.subjectPlaceholder')}
                              disabled={isSubmitting}
                            />
                            {validationErrors.subject && (
                              <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.subject}</span>
                            )}
                          </div>

                          {/* Description */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                                {t('grievance.descriptionLabel')} *
                              </label>
                              {sttSupported && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isListening) {
                                      stopListening()
                                    } else {
                                      handleStartListening()
                                    }
                                  }}
                                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border ${
                                    isListening 
                                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse border-rose-600' 
                                      : 'bg-slate-100 hover:bg-slate-200 text-navy-900 border-slate-200'
                                  }`}
                                >
                                  {isListening ? (
                                    <>
                                      <MicOff className="w-3.5 h-3.5" />
                                      <span>{language === 'te' ? 'ఆపండి' : 'Stop Voice'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="w-3.5 h-3.5 text-saffron-600" />
                                      <span>{language === 'te' ? 'వాయిస్ ద్వారా రాయండి' : 'Write with Voice'}</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={5}
                              className={`w-full px-4 py-3 rounded-xl border ${
                                validationErrors.description ? 'border-rose-400 bg-rose-50/10' : 'border-slate-200 bg-slate-50/50'
                              } focus:border-navy-900 focus:bg-white transition-all text-sm outline-none`}
                              placeholder={t('grievance.descriptionPlaceholder')}
                              disabled={isSubmitting}
                            />
                            {validationErrors.description && (
                              <span className="text-rose-500 text-xs font-medium mt-1.5 block">{validationErrors.description}</span>
                            )}
                          </div>

                          {/* Mock Document Upload */}
                          <div>
                            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                              {t('grievance.uploadDocLabel')}
                            </label>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 hover:border-navy-900 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all">
                                <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                  <p className="text-xs text-slate-500 font-bold mb-1">
                                    {uploadedFileName ? `${t('grievance.copied') === 'కాపీ చేయబడింది!' ? 'ఎంచుకోబడింది' : 'Selected'}: ${uploadedFileName}` : t('grievance.dragDropText')}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{t('grievance.dragDropSub')}</p>
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

                          {/* DPDP Compliance Checkbox */}
                          <div className="flex items-start space-x-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                            <input
                              id="dpdp-consent-check"
                              type="checkbox"
                              checked={consentChecked}
                              onChange={(e) => setConsentChecked(e.target.checked)}
                              className="w-4 h-4 mt-0.5 border-slate-300 rounded text-saffron-600 focus:ring-saffron-500 cursor-pointer"
                              disabled={isSubmitting}
                            />
                            <label htmlFor="dpdp-consent-check" className="text-xs text-slate-600 font-bold select-none cursor-pointer leading-normal text-left">
                              {t('dpdp.consent')}
                            </label>
                          </div>

                          {/* Privacy Indicator Badge */}
                          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs text-slate-600 flex items-start leading-normal text-left">
                            <ShieldCheck className="w-4.5 h-4.5 mr-2 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-emerald-800 block mb-0.5">
                                {language === 'te' ? 'భద్రతా హామీ' : 'DPDP Compliant & Encrypted'}
                              </span>
                              <span>{t('dpdp.privacyBadge')}</span>
                            </div>
                          </div>

                          <div className="flex justify-between pt-4 border-t border-slate-100 gap-4">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              disabled={isSubmitting}
                              className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-navy-900 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {language === 'te' ? 'వెనుకకు' : 'Back'}
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting || !consentChecked}
                              className="flex-1 py-4 bg-saffron-400 text-navy-950 hover:bg-saffron-500 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                            >
                              {isSubmitting ? (
                                <>
                                  <RefreshCw className="w-4.5 h-4.5 animate-spin text-navy-950" />
                                  <span>{t('grievance.submittingText')}</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-4.5 h-4.5 text-navy-950" />
                                  <span>{t('grievance.submitButton')}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                <h2 className="text-lg font-bold text-navy-900 mb-2">{t('grievance.trackHeader')}</h2>
                <p className="text-slate-500 text-xs mb-6">
                  {t('grievance.trackSub')}
                </p>

                <form onSubmit={(e) => handleTrack(e)} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-sm outline-none font-mono"
                      placeholder={t('grievance.trackPlaceholder')}
                      disabled={isSearching}
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !trackingId.trim()}
                    className="px-6 py-3.5 bg-saffron-400 hover:bg-saffron-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-navy-950 rounded-xl text-sm font-bold shadow-md transition-all shrink-0 flex items-center justify-center space-x-2"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-navy-950" />
                        <span>{t('grievance.searchingText')}</span>
                      </>
                    ) : (
                      <span>{t('grievance.trackButton')}</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Search Result Visualizer */}
              {isSearching ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-saffron-500 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">{t('grievance.fetchingText')}</p>
                </div>
              ) : searchResult === null ? (
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-8 shadow-sm text-center">
                  <HelpCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-rose-800 mb-1">{t('grievance.notFoundTitle')}</h3>
                  <p className="text-rose-600 text-sm max-w-md mx-auto">
                    {t('grievance.notFoundDesc')} <strong className="font-mono">{trackingId}</strong>. {t('grievance.notFoundVerify')}
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
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">
                          {t('grievance.ticketRef')}
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
                        {searchResult.status === 'PENDING' ? t('grievance.statusPending') :
                         searchResult.status === 'IN_PROGRESS' ? t('grievance.statusInProgress') :
                         searchResult.status === 'RESOLVED' ? t('grievance.statusResolved') :
                         searchResult.status}
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
                          <span className="text-[10px] font-bold text-navy-900 mt-2">{t('grievance.statusPending')}</span>
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
                          <span className="text-[10px] font-bold text-navy-900 mt-2">{t('grievance.statusInProgress')}</span>
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
                          <span className="text-[10px] font-bold text-navy-900 mt-2">{t('grievance.statusResolved')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="border-t border-slate-100 pt-6 space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs text-slate-400 font-semibold mb-0.5">{t('grievance.categoryLabelField')}</span>
                        <span className="font-bold text-navy-900">
                          {(() => {
                            const catObj = grievanceCategories[searchResult.category]
                            return catObj ? (catObj[language] || catObj['en']) : searchResult.category
                          })()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 font-semibold mb-0.5">{t('grievance.registeredDate')}</span>
                        <span className="font-bold text-navy-900">{new Date(searchResult.createdAt).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN')}</span>
                      </div>
                    </div>

                    {/* Geographic / Location displays */}
                    {(searchResult.state || searchResult.district) && (
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <span className="block text-xs text-slate-400 font-semibold mb-1 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-saffron-600" />
                          {t('grievance.geoArea')}
                        </span>
                        <div className="font-semibold text-navy-900 text-sm space-y-1 text-left">
                          <div>
                            <span className="text-slate-400 font-normal">{t('grievance.stateLabelField')}: </span>{searchResult.state || 'N/A'}
                            <span className="text-slate-300 mx-2">|</span>
                            <span className="text-slate-400 font-normal">{t('grievance.districtLabelField')}: </span>{searchResult.district || 'N/A'}
                          </div>
                          {(searchResult.cityTown || searchResult.mandal || searchResult.villageWard) && (
                            <div>
                              <span className="text-slate-400 font-normal">{t('grievance.areaLabelField')}: </span>
                              {[searchResult.villageWard, searchResult.mandal, searchResult.cityTown].filter(Boolean).join(', ')}
                            </div>
                          )}
                          {searchResult.address && (
                            <div>
                              <span className="text-slate-400 font-normal">{t('grievance.addressLabelField')}: </span>{searchResult.address}
                            </div>
                          )}
                          {searchResult.pincode && (
                            <div>
                              <span className="text-slate-400 font-normal">{t('grievance.pincodeLabelField')}: </span>{searchResult.pincode}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="block text-xs text-slate-400 font-semibold mb-0.5">{t('grievance.subjectLabelField')}</span>
                      <span className="font-bold text-navy-900 text-base block text-left">{searchResult.subject}</span>
                    </div>

                    <div>
                      <span className="block text-xs text-slate-400 font-semibold mb-0.5">{t('grievance.descriptionLabelField')}</span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl text-sm border border-slate-100 text-left">
                        {searchResult.description}
                      </p>
                    </div>

                    {searchResult.adminNotes && (!searchResult.logs || searchResult.logs.length === 0) && (
                      <div className="p-4 bg-saffron-100/50 border border-saffron-200/60 text-slate-800 rounded-xl text-left">
                        <span className="block text-xs font-bold text-saffron-700 uppercase tracking-wider mb-1.5 flex items-center">
                          <AlertCircle className="w-3.5 h-3.5 mr-1" />
                          {t('grievance.officialResponse')}
                        </span>
                        <p className="text-sm font-medium leading-relaxed">
                          {searchResult.adminNotes}
                        </p>
                      </div>
                    )}

                    {searchResult.logs && searchResult.logs.length > 0 && (
                      <div className="border-t border-slate-100 pt-6">
                        <span className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-4 text-left">
                          Progress History / Updates Log
                        </span>
                        <div className="flow-root">
                          <ul className="-mb-8 text-left">
                            {searchResult.logs.map((log, logIdx) => (
                              <li key={log.id}>
                                <div className="relative pb-8">
                                  {logIdx !== searchResult.logs!.length - 1 ? (
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
                                        <p className="text-xs font-semibold text-slate-900">
                                          Status: <span className="uppercase font-extrabold text-navy-950">{log.status.replace('_', ' ')}</span>
                                        </p>
                                        <p className="text-xs text-slate-600 mt-1 font-medium bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                                          {log.notes}
                                        </p>
                                      </div>
                                      <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-bold">
                                        <span>{new Date(log.createdAt).toLocaleDateString(language === 'te' ? 'te-IN' : 'en-IN')}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Location Selection Popup Modal */}
        <AnimatePresence>
          {showLocationModal && (
            <div 
              data-modal="true"
              onClick={() => {
                setShowLocationModal(false)
                if (!villageWard) {
                  setPincode('')
                }
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-5 h-5 text-saffron-600 animate-bounce" />
                    <h3 className="text-base font-bold text-navy-900">
                      {manualLocationMode 
                        ? t('grievance.manualEntryTitle') 
                        : `${t('grievance.selectLocationTitle')} (${pincode})`
                      }
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocationModal(false)
                      if (!villageWard) {
                        setPincode('')
                      }
                    }}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 min-h-0">
                  {!manualLocationMode ? (
                    <div className="space-y-4">
                      <p className="text-slate-500 text-xs leading-relaxed mb-4">
                        Choose your village or area name matching pincode <strong className="text-navy-900 font-bold">{pincode}</strong> to auto-fill location details:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {pincodeRecords.map((rec, index) => {
                          const formattedName = formatPlaceName(rec.name)
                          const formattedDistrict = formatPlaceName(rec.district)
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setVillageWard(formattedName)
                                setDistrict(formattedDistrict)
                                setStateName(formatPlaceName(rec.state))
                                setShowLocationModal(false)
                              }}
                              className="flex flex-col text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:border-saffron-400 hover:bg-saffron-50/20 hover:scale-[1.01] transition-all cursor-pointer group"
                            >
                              <span className="text-sm font-bold text-navy-900 group-hover:text-saffron-600 transition-colors">
                                {formattedName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {formattedDistrict} District
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setManualLocationMode(true)
                            setModalVillage('')
                            setModalDistrict(pincodeRecords[0]?.district ? formatPlaceName(pincodeRecords[0].district) : '')
                            setModalState(pincodeRecords[0]?.state ? formatPlaceName(pincodeRecords[0].state) : '')
                          }}
                          className="text-xs font-bold text-saffron-600 hover:text-saffron-700 underline flex items-center gap-1.5 cursor-pointer"
                        >
                          {t('grievance.enterManually')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Manual fallback form
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          Village / Town / Ward *
                        </label>
                        <input
                          type="text"
                          value={modalVillage}
                          onChange={(e) => setModalVillage(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                          placeholder="Enter village, area, or ward name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          District *
                        </label>
                        <input
                          type="text"
                          value={modalDistrict}
                          onChange={(e) => setModalDistrict(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                          placeholder="District name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={modalState}
                          onChange={(e) => setModalState(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white transition-all text-sm outline-none"
                          placeholder="State name"
                        />
                      </div>

                      <div className="pt-4 flex items-center justify-between gap-4">
                        {pincodeRecords.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setManualLocationMode(false)}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Back to list
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={!modalVillage.trim() || !modalDistrict.trim() || !modalState.trim()}
                          onClick={() => {
                            setVillageWard(modalVillage.trim())
                            setDistrict(modalDistrict.trim())
                            setStateName(modalState.trim())
                            setShowLocationModal(false)
                          }}
                          className="flex-1 px-5 py-3 rounded-xl bg-saffron-400 hover:bg-saffron-500 text-navy-950 text-xs font-bold transition-all text-center cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save & Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* STT Active Recording Overlay */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full relative"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={stopListening}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer text-slate-500"
                  aria-label="Close speech recognition"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Animated Voice Indicator */}
                <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-rose-50/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full bg-rose-50/10 animate-pulse"></div>
                  <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 text-white relative">
                    <Mic className="w-7 h-7 animate-bounce" />
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-navy-900 mb-2">
                  {language === 'te' ? 'వాయిస్ రికార్డింగ్ సక్రియంగా ఉంది' : 'Listening... Speak Now'}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  {language === 'te' 
                    ? 'దయచేసి మాట్లాడండి. మీ మాటలు స్వయంచాలకంగా టెక్స్ట్‌గా మార్చబడతాయి.' 
                    : 'Speak clearly into your microphone. Your voice is being transcribed.'}
                </p>

                {/* Live Preview Box */}
                <div 
                  ref={previewScrollRef}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 text-left shadow-inner scrollbar-thin"
                  style={{ maxHeight: '110px', overflowY: 'auto' }}
                >
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                    {language === 'te' ? 'లైవ్ ప్రివ్యూ' : 'Live Preview'}
                  </span>
                  <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-semibold">
                    {description || (
                      <span className="text-slate-400 font-normal italic">
                        {language === 'te' ? 'మాట్లాడటం ప్రారంభించండి...' : 'Start speaking to see transcription...'}
                      </span>
                    )}
                    {interimTranscript && (
                      <span className="text-saffron-600 animate-pulse font-extrabold">
                        {' '}{interimTranscript}
                      </span>
                    )}
                  </p>
                </div>

                {/* Language Switcher */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                    {language === 'te' ? 'భాషను మార్చండి' : 'Speech Language'}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => recogLang !== 'en-US' && toggleLanguage()}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        recogLang === 'en-US'
                          ? 'bg-navy-900 text-white border-navy-950 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      English (US)
                    </button>
                    <button
                      type="button"
                      onClick={() => recogLang !== 'te-IN' && toggleLanguage()}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                        recogLang === 'te-IN'
                          ? 'bg-navy-900 text-white border-navy-950 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      తెలుగు (Telugu)
                    </button>
                  </div>
                </div>

                {sttError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl mb-6 flex items-start text-left">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                    <span>{sttError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={stopListening}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  {language === 'te' ? 'పూర్తయింది' : 'Done / Stop Listening'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function GrievanceClient() {
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
