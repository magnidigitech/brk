'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Lock, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Paperclip, 
  ExternalLink, 
  Search, 
  Calendar,
  X,
  Check,
  FileText,
  Video,
  Code
} from 'lucide-react'

// Document types interfaces
interface PressRelease {
  _id: string
  _type: 'pressRelease'
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt?: string
  speechUrl?: string
  mainImageUrl?: string
  mainImageAssetId?: string
  slideshowImageUrls?: string[]
  slideshowAssetIds?: string[]
  body?: any[]
}

interface ParliamentaryUpdate {
  _id: string
  _type: 'parliamentaryUpdate'
  title: string
  slug: { current: string }
  date: string
  summary: string
  speechUrl?: string
  mainImageUrl?: string
  mainImageAssetId?: string
  slideshowImageUrls?: string[]
  slideshowAssetIds?: string[]
  documentUrl?: string
  documentAssetId?: string
  documentOriginalName?: string
}

interface DailyUpdate {
  _id: string
  _type: 'dailyUpdate'
  title: string
  slug: { current: string }
  date: string
  summary: string
  speechUrl?: string
  mainImageUrl?: string
  mainImageAssetId?: string
  slideshowImageUrls?: string[]
  slideshowAssetIds?: string[]
  body?: any[]
}

// Convert portable text blocks back to raw text for editing
function convertBlocksToText(blocks: any[] | undefined): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map((c: any) => c.text).join('')
      }
      return ''
    })
    .filter(Boolean)
    .join('\n\n')
}

function resolveLocale(field: any): string {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field.en || field.te || field.ten || ''
}

/**
 * autoFormatText — converts raw AI-pasted text (ChatGPT / Gemini output)
 * into the app's custom markdown format understood by RichTextRenderer:
 *   - ### Heading          — section header with saffron left border
 *   - - item               — bullet list item
 *   - normal paragraph     — plain text
 *   - **bold**             — inline bold
 */
function autoFormatText(raw: string): string {
  if (!raw || !raw.trim()) return raw

  let text = raw

  // 1. Normalize Windows line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 2. Convert markdown headings (#, ##, ###) → ### Heading (all levels map to ###)
  text = text.replace(/^#{1,3}\s+(.+)$/gm, '### $1')

  // 3. **Bold text on its own line** → ### Heading (common AI pattern for section titles)
  //    e.g.  "**Key Highlights**"  or  "**Key Highlights:**"
  text = text.replace(/^\s*\*\*([^*\n]{3,80}?)\*\*\s*:?\s*$/gm, '### $1:')

  // 4. **Bold text followed by colon + content on same line** → heading + rest as paragraph
  //    e.g.  "**Purpose:** This scheme aims to..."
  text = text.replace(/^\s*\*\*([^*\n]{3,60}?):\*\*\s*(.*)$/gm, (_, heading, rest) => {
    return rest.trim() ? `### ${heading}:\n${rest.trim()}` : `### ${heading}:`
  })

  // 5. All-caps or Title-case line ending with colon on its own → ### Heading
  //    e.g.  "KEY HIGHLIGHTS:"  or  "Budget Allocation:"
  text = text.replace(/^([A-Z][A-Z0-9\s&/\-–—"']{2,59}:)\s*$/gm, '### $1')

  // 6. Convert numbered lists (1. 2. 3.) and emoji bullets → "- item"
  text = text.replace(/^\s*(\d+)\.\s+(.*)$/gm, '- $2')

  // 7. Convert bullet variations: •, *, ➤, ▸, ► → "-"
  text = text.replace(/^\s*[•\*➤▸►✔✓→]\s+(.*)$/gm, '- $1')

  // 8. Convert honorific-prefixed lines (Dr., Mr., Ms., Shri) as bullets if not heading
  text = text.replace(/^(Dr\.|Mr\.|Ms\.|Shri|Smt\.)\s+(.*)$/gm, '- $1 $2')

  // 9. Remove leftover bold markers that remain in regular paragraphs (keep ** for inline)
  //    But only remove *isolated* wrapping around short phrases that are already headings
  //    (We leave **word** inside paragraphs intact so RichTextRenderer can render inline bold)

  // 10. Merge lines that ran together without a blank line between them
  //     (AI sometimes puts two different paragraphs on adjacent lines with no blank line)
  //     Strategy: if a line ends without punctuation and next line starts uppercase → split
  text = text.replace(/([a-z,;])(\n)([A-Z])/g, '$1\n\n$3')

  // 11. Ensure there's a blank line before every ### heading
  text = text.replace(/([^\n])\n(### )/g, '$1\n\n$2')

  // 12. Ensure there's a blank line after every ### heading
  text = text.replace(/(### [^\n]+)\n([^#\n-])/g, '$1\n\n$2')

  // 13. Collapse 3+ consecutive blank lines to 2
  text = text.replace(/\n{3,}/g, '\n\n')

  return text.trim()
}

export default function ContentManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Content Data States
  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdate[]>([])
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([])
  const [parliamentaryUpdates, setParliamentaryUpdates] = useState<ParliamentaryUpdate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'daily' | 'press' | 'parliament' | 'video'>('daily')

  // Video Settings States
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitleEn, setVideoTitleEn] = useState('')
  const [videoTitleTe, setVideoTitleTe] = useState('')
  const [videoTitleTen, setVideoTitleTen] = useState('')
  const [showVideo, setShowVideo] = useState(false)
  const [customEmbedCode, setCustomEmbedCode] = useState('')
  const [showCustomEmbed, setShowCustomEmbed] = useState(false)
  const [isSavingVideo, setIsSavingVideo] = useState(false)
  const [videoSaveError, setVideoSaveError] = useState('')
  const [videoSaveSuccess, setVideoSaveSuccess] = useState(false)
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('')

  // Form Modals
  const [isOpenFormModal, setIsOpenFormModal] = useState(false)
  const [formType, setFormType] = useState<'pressRelease' | 'parliamentaryUpdate' | 'dailyUpdate'>('dailyUpdate')
  const [editingDocId, setEditingDocId] = useState<string | null>(null) // null = Creating, string = Editing

  // Form Fields State
  const [title, setTitle] = useState('')
  const [dateField, setDateField] = useState('') // publishedAt or date
  const [excerptOrSummary, setExcerptOrSummary] = useState('') // excerpt or summary
  const [bodyContent, setBodyContent] = useState('') // press release body
  const [speechUrl, setSpeechUrl] = useState('')
  
  // Upload States
  const [isUploadingMain, setIsUploadingMain] = useState(false)
  const [mainImageAssetId, setMainImageAssetId] = useState<string>('')
  const [mainImageUrl, setMainImageUrl] = useState<string>('')
  const [removeMainImage, setRemoveMainImage] = useState(false)

  const [isUploadingSlides, setIsUploadingSlides] = useState(false)
  const [slideshowAssetIds, setSlideshowAssetIds] = useState<string[]>([])
  const [slideshowImageUrls, setSlideshowImageUrls] = useState<string[]>([])
  const [removeSlideshowImages, setRemoveSlideshowImages] = useState(false)

  const [isUploadingDoc, setIsUploadingDoc] = useState(false)
  const [documentAssetId, setDocumentAssetId] = useState<string>('')
  const [documentUrl, setDocumentUrl] = useState<string>('')
  const [documentOriginalName, setDocumentOriginalName] = useState<string>('')
  const [removeDocument, setRemoveDocument] = useState(false)

  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Deletion Modals
  const [deletingDoc, setDeletingDoc] = useState<{ id: string; title: string; type: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Auth Hook
  useEffect(() => {
    const authEmail = localStorage.getItem('admin_authenticated_email')
    if (authEmail === 'magnidigitech@gmail.com') {
      setIsAuthenticated(true)
      fetchContent()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'magnidigitech@gmail.com' && password === 'Magni@221299') {
      localStorage.setItem('admin_authenticated_email', 'magnidigitech@gmail.com')
      setIsAuthenticated(true)
      fetchContent()
    } else {
      setAuthError('Invalid email or password. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated_email')
    setIsAuthenticated(false)
    setDailyUpdates([])
    setPressReleases([])
    setParliamentaryUpdates([])
  }

  // Fetch all content items
  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/content')
      if (res.ok) {
        const data = await res.json()
        setDailyUpdates(data.dailyUpdates || [])
        setPressReleases(data.pressReleases || [])
        setParliamentaryUpdates(data.parliamentaryUpdates || [])
        if (data.siteSettings) {
          const settings = data.siteSettings
          setVideoUrl(settings.introVideoUrl || '')
          setVideoTitleEn(settings.introVideoTitle?.en || settings.introVideoTitle || '')
          setVideoTitleTe(settings.introVideoTitle?.te || '')
          setVideoTitleTen(settings.introVideoTitle?.ten || '')
          setShowVideo(!!settings.showIntroVideo)
          setCustomEmbedCode(settings.customEmbedCode || '')
          setShowCustomEmbed(!!settings.showCustomEmbed)
        }
      }
    } catch (err) {
      console.error('Failed to fetch content list', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Opening Form Modal for Creation
  const handleOpenCreate = (type: 'pressRelease' | 'parliamentaryUpdate' | 'dailyUpdate') => {
    setFormType(type)
    setEditingDocId(null)
    
    // Reset fields
    setTitle('')
    setDateField(type === 'pressRelease' ? new Date().toISOString().split('T')[0] + 'T12:00:00' : new Date().toISOString().split('T')[0])
    setExcerptOrSummary('')
    setBodyContent('')
    setSpeechUrl('')
    
    setMainImageAssetId('')
    setMainImageUrl('')
    setRemoveMainImage(false)

    setSlideshowAssetIds([])
    setSlideshowImageUrls([])
    setRemoveSlideshowImages(false)

    setDocumentAssetId('')
    setDocumentUrl('')
    setDocumentOriginalName('')
    setRemoveDocument(false)

    setFormError('')
    setIsOpenFormModal(true)
  }

  // Handle Opening Form Modal for Editing
  const handleOpenEdit = (item: any, type: 'pressRelease' | 'parliamentaryUpdate' | 'dailyUpdate') => {
    setFormType(type)
    setEditingDocId(item._id)

    setTitle(resolveLocale(item.title))
    setSpeechUrl(item.speechUrl || '')

    setMainImageAssetId(item.mainImageAssetId || '')
    setMainImageUrl(item.mainImageUrl || '')
    setRemoveMainImage(false)

    setSlideshowAssetIds(item.slideshowAssetIds || [])
    setSlideshowImageUrls(item.slideshowImageUrls || [])
    setRemoveSlideshowImages(false)

    if (type === 'pressRelease') {
      // Adjust standard datetime input format
      setDateField(item.publishedAt ? item.publishedAt.substring(0, 16) : '')
      setExcerptOrSummary(resolveLocale(item.excerpt))
      setBodyContent(convertBlocksToText(item.body))
    } else if (type === 'dailyUpdate') {
      setDateField(item.date || '')
      setExcerptOrSummary(resolveLocale(item.summary))
      setBodyContent(convertBlocksToText(item.body))
      
      setDocumentAssetId('')
      setDocumentUrl('')
      setDocumentOriginalName('')
      setRemoveDocument(false)
    } else {
      setDateField(item.date || '')
      setExcerptOrSummary(resolveLocale(item.summary))
      
      setDocumentAssetId(item.documentAssetId || '')
      setDocumentUrl(item.documentUrl || '')
      setDocumentOriginalName(item.documentOriginalName || '')
      setRemoveDocument(false)
    }

    setFormError('')
    setIsOpenFormModal(true)
  }

  // File Upload Handlers
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingMain(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setMainImageAssetId(data.assetId)
        setMainImageUrl(data.url)
        setRemoveMainImage(false)
      } else {
        const errData = await res.json()
        setFormError(errData.error || 'Failed to upload cover image.')
      }
    } catch (err) {
      setFormError('Network error uploading cover image.')
      console.error(err)
    } finally {
      setIsUploadingMain(false)
    }
  }

  const handleSlideshowUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingSlides(true)
    const newAssetIds = [...slideshowAssetIds]
    const newImageUrls = [...slideshowImageUrls]

    try {
      // Upload files sequentially or in parallel
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'image')

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          newAssetIds.push(data.assetId)
          newImageUrls.push(data.url)
        } else {
          const errData = await res.json()
          setFormError(errData.error || `Failed to upload image: ${file.name}`)
        }
      }

      setSlideshowAssetIds(newAssetIds)
      setSlideshowImageUrls(newImageUrls)
      setRemoveSlideshowImages(false)
    } catch (err) {
      setFormError('Network error uploading slideshow images.')
      console.error(err)
    } finally {
      setIsUploadingSlides(false)
    }
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingDoc(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'file')

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setDocumentAssetId(data.assetId)
        setDocumentUrl(data.url)
        setDocumentOriginalName(file.name)
        setRemoveDocument(false)
      } else {
        const errData = await res.json()
        setFormError(errData.error || 'Failed to upload PDF document.')
      }
    } catch (err) {
      setFormError('Network error uploading PDF document.')
      console.error(err)
    } finally {
      setIsUploadingDoc(false)
    }
  }

  // Remove individual slideshow image from form array state
  const handleRemoveSlideshowImageIndex = (index: number) => {
    const newAssetIds = [...slideshowAssetIds]
    const newImageUrls = [...slideshowImageUrls]
    newAssetIds.splice(index, 1)
    newImageUrls.splice(index, 1)

    setSlideshowAssetIds(newAssetIds)
    setSlideshowImageUrls(newImageUrls)

    if (newAssetIds.length === 0) {
      setRemoveSlideshowImages(true)
    }
  }

  // Form Submit Handler (Create or Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setIsSubmitting(true)

    const isEditing = !!editingDocId
    const endpoint = '/api/admin/content'
    const method = isEditing ? 'PATCH' : 'POST'

    // Form data packaging
    const payload: any = {
      id: editingDocId || undefined,
      type: formType,
      title,
      speechUrl,
      mainImageAssetId: mainImageAssetId || undefined,
      removeMainImage,
      slideshowAssetIds: slideshowAssetIds.length > 0 ? slideshowAssetIds : undefined,
      removeSlideshowImages,
    }

    if (formType === 'pressRelease') {
      payload.publishedAt = dateField
      payload.excerpt = excerptOrSummary
      payload.bodyContent = bodyContent
    } else if (formType === 'dailyUpdate') {
      payload.date = dateField
      payload.summary = excerptOrSummary
      payload.bodyContent = bodyContent
    } else {
      payload.date = dateField
      payload.summary = excerptOrSummary
      payload.documentAssetId = documentAssetId || undefined
      payload.removeDocument = removeDocument
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setIsOpenFormModal(false)
        fetchContent()
      } else {
        const errData = await res.json()
        setFormError(errData.error || 'An error occurred during save operations.')
      }
    } catch (err) {
      setFormError('Network error submitting content.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveVideoSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setVideoSaveError('')
    setVideoSaveSuccess(false)
    setIsSavingVideo(true)

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'siteSettings',
          type: 'siteSettings',
          introVideoUrl: videoUrl,
          introVideoTitle: {
            en: videoTitleEn,
            te: videoTitleTe,
            ten: videoTitleTen
          },
          showIntroVideo: showVideo,
          customEmbedCode: customEmbedCode,
          showCustomEmbed: showCustomEmbed
        }),
      })

      if (res.ok) {
        setVideoSaveSuccess(true)
        setTimeout(() => setVideoSaveSuccess(false), 3500)
        fetchContent()
      } else {
        const errData = await res.json()
        setVideoSaveError(errData.error || 'Failed to save video settings.')
      }
    } catch (err) {
      setVideoSaveError('Network error saving video settings.')
      console.error(err)
    } finally {
      setIsSavingVideo(false)
    }
  }

  // Deletion Handlers
  const handleConfirmDelete = async () => {
    if (!deletingDoc) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/admin/content?id=${deletingDoc.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setDeletingDoc(null)
        fetchContent()
      }
    } catch (err) {
      console.error('Failed to delete document', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter lists by search query
  const filteredDaily = dailyUpdates.filter(item => 
    resolveLocale(item.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
    resolveLocale(item.summary).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPress = pressReleases.filter(item => 
    resolveLocale(item.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.excerpt && resolveLocale(item.excerpt).toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredUpdates = parliamentaryUpdates.filter(item => 
    resolveLocale(item.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
    resolveLocale(item.summary).toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/10 rounded-full blur-3xl -z-1" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-navy-900 border border-navy-800 rounded-2xl mb-4 text-saffron-500">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white">Content Manager Login</h1>
            <p className="text-xs text-slate-400 mt-2">Enter credentials to edit website press releases and updates.</p>
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
              Log In to Manager
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner */}
      <header className="sticky top-0 z-40 bg-[#FFD200] text-slate-950 border-b border-[#e0b900] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link 
              href="/admin"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 rounded-xl transition-all border border-slate-950/10 mr-1 text-[10px] font-black uppercase shrink-0"
              title="Back to Admin Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Home</span>
            </Link>
            <div className="w-9 h-9 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-yellow-600/20 shadow-sm shrink-0">
              <img src="/images/logo.png" alt="TDP Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="block font-black text-xs sm:text-sm text-slate-950 uppercase tracking-wider leading-tight">
                Sanity Content Management
              </span>
              <span className="block text-[8px] sm:text-[9px] font-black text-navy-900 tracking-wider uppercase">
                MP Rajya Sabha Office
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto md:justify-end shrink-0">
            <button
              onClick={fetchContent}
              className="p-2.5 bg-slate-950/5 hover:bg-slate-950/10 text-slate-950 rounded-xl transition-all border border-slate-950/10 shrink-0"
              title="Refresh Content"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0"
            >
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => { setActiveTab('daily'); setSearchQuery(''); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'daily' 
                  ? 'bg-navy-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Daily Updates
            </button>
            <button
              onClick={() => { setActiveTab('press'); setSearchQuery(''); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'press' 
                  ? 'bg-navy-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Press Releases
            </button>
            <button
              onClick={() => { setActiveTab('parliament'); setSearchQuery(''); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'parliament' 
                  ? 'bg-navy-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Parliamentary Updates
            </button>
            <button
              onClick={() => { setActiveTab('video'); setSearchQuery(''); }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'video' 
                  ? 'bg-navy-900 text-white shadow-md' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Video Settings
            </button>
          </div>

          {activeTab !== 'video' && (
            <button
              onClick={() => handleOpenCreate(activeTab === 'daily' ? 'dailyUpdate' : activeTab === 'press' ? 'pressRelease' : 'parliamentaryUpdate')}
              className="flex items-center space-x-2 px-5 py-3.5 bg-saffron-500 hover:bg-saffron-600 text-slate-950 font-bold text-xs tracking-wider uppercase rounded-2xl shadow-md transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Create {activeTab === 'daily' ? 'Daily Update' : activeTab === 'press' ? 'Press Release' : 'Parliamentary Update'}</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        {activeTab !== 'video' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none"
                placeholder={`Search ${activeTab === 'daily' ? 'Daily Updates' : activeTab === 'press' ? 'Press Releases' : 'Parliamentary Updates'} by title or text...`}
              />
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>
        )}

        {/* Content Lists */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="text-center py-24">
              <RefreshCw className="w-9 h-9 animate-spin text-saffron-500 mx-auto mb-4" />
              <p className="text-slate-500 text-sm font-semibold">Loading content items from Sanity...</p>
            </div>
          ) : activeTab === 'daily' ? (
            /* Daily Updates Table */
            filteredDaily.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-600 mb-1">No Daily Updates Found</h3>
                <p className="text-slate-400 text-xs">Create one to get started, or refine your search filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cover</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title / Summary</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Media Players</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slideshow</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredDaily.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.mainImageUrl ? (
                            <img src={item.mainImageUrl} alt="" className="w-12 h-12 object-contain bg-slate-100 rounded-xl border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <h4 className="text-xs font-bold text-navy-900 line-clamp-1">{resolveLocale(item.title)}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{resolveLocale(item.summary) || 'No summary provided.'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
                          {item.date ? new Date(item.date).toLocaleDateString() : 'Draft'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.speechUrl ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                              <Video className="w-3 h-3" />
                              <span>Player Enabled</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.slideshowImageUrls && item.slideshowImageUrls.length > 0 ? (
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                              {item.slideshowImageUrls.length} image{item.slideshowImageUrls.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No slide</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2.5">
                          <button
                            onClick={() => handleOpenEdit(item, 'dailyUpdate')}
                            className="p-2 bg-slate-100 hover:bg-navy-50 text-slate-600 hover:text-navy-955 rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingDoc({ id: item._id, title: resolveLocale(item.title), type: 'dailyUpdate' })}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'press' ? (
            /* Press Releases Table */
            filteredPress.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-600 mb-1">No Press Releases Found</h3>
                <p className="text-slate-400 text-xs">Create one to get started, or refine your search filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cover</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title / Excerpt</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Media Players</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slideshow</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredPress.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.mainImageUrl ? (
                            <img src={item.mainImageUrl} alt="" className="w-12 h-12 object-contain bg-slate-100 rounded-xl border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <h4 className="text-xs font-bold text-navy-900 line-clamp-1">{resolveLocale(item.title)}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{resolveLocale(item.excerpt) || 'No excerpt summary provided.'}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Draft'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.speechUrl ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                              <Video className="w-3 h-3" />
                              <span>Player Enabled</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.slideshowImageUrls && item.slideshowImageUrls.length > 0 ? (
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                              {item.slideshowImageUrls.length} image{item.slideshowImageUrls.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No slide</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2.5">
                          <button
                            onClick={() => handleOpenEdit(item, 'pressRelease')}
                            className="p-2 bg-slate-100 hover:bg-navy-50 text-slate-600 hover:text-navy-955 rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingDoc({ id: item._id, title: resolveLocale(item.title), type: 'pressRelease' })}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'parliament' ? (
            /* Parliamentary Updates Table */
            filteredUpdates.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-600 mb-1">No Parliamentary Updates Found</h3>
                <p className="text-slate-400 text-xs">Create one to get started, or refine your search filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preview</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Title / Summary</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">PDF File</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Media Player</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slideshow</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredUpdates.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.mainImageUrl ? (
                            <img src={item.mainImageUrl} alt="" className="w-12 h-12 object-contain bg-slate-100 rounded-xl border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <h4 className="text-xs font-bold text-navy-900 line-clamp-1">{resolveLocale(item.title)}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{resolveLocale(item.summary)}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
                          {item.date ? new Date(item.date).toLocaleDateString() : 'Draft'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.documentUrl ? (
                            <a 
                              href={item.documentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase hover:underline"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span className="max-w-[100px] truncate">{item.documentOriginalName || 'Download PDF'}</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No PDF attached</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.speechUrl ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                              <Video className="w-3 h-3" />
                              <span>Player Enabled</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.slideshowImageUrls && item.slideshowImageUrls.length > 0 ? (
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                              {item.slideshowImageUrls.length} image{item.slideshowImageUrls.length > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No slide</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2.5">
                          <button
                            onClick={() => handleOpenEdit(item, 'parliamentaryUpdate')}
                            className="p-2 bg-slate-100 hover:bg-navy-50 text-slate-600 hover:text-navy-955 rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingDoc({ id: item._id, title: resolveLocale(item.title), type: 'parliamentaryUpdate' })}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* activeTab === 'video' -> Video Settings Form */
            <div className="p-6 max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-base font-extrabold text-navy-900 mb-1">Featured Video Player Settings</h3>
                <p className="text-xs text-slate-400">Configure the dynamic YouTube video block displayed on the home page.</p>
              </div>

              {videoSaveError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl mb-6 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                  <span>{videoSaveError}</span>
                </div>
              )}

              {videoSaveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl mb-6 flex items-start">
                  <Check className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                  <span>Video settings updated successfully! Changes published to Sanity.</span>
                </div>
              )}

              <form onSubmit={handleSaveVideoSettings} className="space-y-6">
                {/* Segment 1: Custom HTML Embed Settings */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Code className="w-4 h-4 text-saffron-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-navy-900">Custom HTML Embed block</h3>
                  </div>

                  {/* Custom Embed Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200/40 rounded-xl">
                    <div>
                      <label className="block text-xs font-bold text-navy-900">Show Custom Embed Block</label>
                      <span className="block text-[10px] text-slate-400 mt-0.5">Toggle to show or hide the custom embed code on the Home page.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showCustomEmbed}
                        onChange={(e) => setShowCustomEmbed(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900"></div>
                    </label>
                  </div>

                  {/* Custom Embed HTML Code */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Custom Embed HTML Code
                    </label>
                    <textarea
                      value={customEmbedCode}
                      onChange={(e) => setCustomEmbedCode(e.target.value)}
                      placeholder="Paste your HTML/iframe code here..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy-900 bg-white text-xs outline-none font-mono min-h-[120px]"
                      disabled={isSavingVideo}
                    />
                    <span className="block text-[9px] text-slate-400 mt-1.5">Paste standard HTML code (e.g. YouTube iframe, external widgets, custom scripts).</span>
                  </div>
                </div>

                {/* Segment 2: YouTube Video Player Settings */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Video className="w-4 h-4 text-saffron-600 animate-pulse" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-navy-900">YouTube Video Player</h3>
                  </div>

                  {/* Toggle switch */}
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200/40 rounded-xl">
                    <div>
                      <label className="block text-xs font-bold text-navy-900">Show Video Player</label>
                      <span className="block text-[10px] text-slate-400 mt-0.5">Toggle to show or hide the video block on the Home page.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showVideo}
                        onChange={(e) => setShowVideo(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900"></div>
                    </label>
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy-900 bg-white text-xs outline-none"
                      disabled={isSavingVideo}
                    />
                    <span className="block text-[9px] text-slate-400 mt-1.5">Provide a standard YouTube watch or short share link.</span>
                  </div>

                  {/* Localized Titles */}
                  <div className="border-t border-slate-150 pt-4 space-y-4">
                    <h4 className="text-xs font-bold text-navy-900">Video Section Title (Multilingual)</h4>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        value={videoTitleEn}
                        onChange={(e) => setVideoTitleEn(e.target.value)}
                        placeholder="Featured Video"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy-900 bg-white text-xs outline-none"
                        disabled={isSavingVideo}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Title (Telugu)
                      </label>
                      <input
                        type="text"
                        value={videoTitleTe}
                        onChange={(e) => setVideoTitleTe(e.target.value)}
                        placeholder="ఫీచర్ చేసిన వీడియో"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy-900 bg-white text-xs outline-none"
                        disabled={isSavingVideo}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Title (Tenglish)
                      </label>
                      <input
                        type="text"
                        value={videoTitleTen}
                        onChange={(e) => setVideoTitleTen(e.target.value)}
                        placeholder="Featured Video"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-navy-900 bg-white text-xs outline-none"
                        disabled={isSavingVideo}
                      />
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-navy-900 hover:bg-navy-850 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                    disabled={isSavingVideo}
                  >
                    {isSavingVideo ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Video Settings</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* CREATE & EDIT FORM OVERLAY MODAL */}
      <AnimatePresence>
        {isOpenFormModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenFormModal(false)}
              className="absolute inset-0 bg-navy-950/70"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Form Header */}
              <div className="px-6 py-5 bg-navy-900 text-white flex justify-between items-center sticky top-0 z-10 border-b border-navy-950">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    {formType === 'dailyUpdate' ? 'Daily Update Document' : formType === 'pressRelease' ? 'Press Release Document' : 'Parliamentary Update Document'}
                  </span>
                  <h3 className="text-base font-black text-white tracking-wide">
                    {editingDocId ? 'Edit Existing Document' : 'Create New Document'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpenFormModal(false)}
                  className="p-2 rounded-lg bg-navy-850 hover:bg-navy-800 text-slate-300 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitForm} className="p-6 flex-grow space-y-6 text-left">
                {formError && (
                  <div className="p-4 bg-rose-950/10 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none font-semibold text-navy-950"
                    placeholder="Enter document title..."
                  />
                </div>

                {/* Date and Speech URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {formType === 'pressRelease' ? 'Publication Date (Date Only) *' : formType === 'dailyUpdate' ? 'Date of Update *' : 'Session Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={dateField ? dateField.substring(0, 10) : ''}
                      onChange={(e) => setDateField(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none font-semibold text-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>YouTube or Instagram Link</span>
                      <span className="text-[9px] text-slate-400 font-medium italic lowercase">Supports native embedding</span>
                    </label>
                    <input
                      type="url"
                      value={speechUrl}
                      onChange={(e) => setSpeechUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none text-navy-950"
                      placeholder="e.g., https://youtube.com/shorts/... or instagram.com/reel/..."
                    />
                  </div>
                </div>

                {/* Excerpt / Summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {formType === 'pressRelease' ? 'Short Excerpt / Intro (Plain Text)' : formType === 'dailyUpdate' ? 'Summary / Intro *' : 'Summary Description *'}
                    </label>
                    {(formType === 'parliamentaryUpdate' || formType === 'pressRelease' || formType === 'dailyUpdate') && (
                      <button
                        type="button"
                        onClick={() => {
                          setExcerptOrSummary(prev => autoFormatText(prev))
                        }}
                        className="text-[10px] font-bold text-saffron-700 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        ✨ Auto-Format Headings & Lists
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={formType === 'pressRelease' ? 2 : 5}
                    required={formType === 'parliamentaryUpdate' || formType === 'dailyUpdate'}
                    value={excerptOrSummary}
                    onChange={(e) => setExcerptOrSummary(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none text-slate-800 leading-relaxed font-sans"
                    placeholder={formType === 'pressRelease' ? 'Provide a brief summary for lists pages...' : formType === 'dailyUpdate' ? 'Enter a brief summary of the daily update...' : 'Enter the complete update summary... Use ### Heading for section titles.'}
                  />
                </div>

                {/* Body Content (Press Release & Daily Updates only) */}
                {(formType === 'pressRelease' || formType === 'dailyUpdate') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Main Body Content
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setBodyContent((prev) => prev + '\n\n### Heading Title\n')}
                          className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          + Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => setBodyContent((prev) => prev + '\n- Bullet item')}
                          className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          + Bullet
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBodyContent(prev => autoFormatText(prev))
                          }}
                          className="text-[10px] font-bold text-saffron-700 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          ✨ Auto-Format Headings & Lists
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={8}
                      value={bodyContent}
                      onChange={(e) => setBodyContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-navy-900 focus:bg-white text-xs outline-none text-slate-800 leading-relaxed font-sans"
                      placeholder="Enter main body text. Use '### Heading Title:' for section headers and '- Item' for bullet points. Click '✨ Auto-Format' to automatically format pasted text."
                    />
                  </div>
                )}

                {/* Cover Image Selector */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Cover Preview Image
                  </label>
                  
                  {mainImageUrl && !removeMainImage ? (
                    <div className="flex items-center space-x-4">
                      <img src={mainImageUrl} alt="" className="w-16 h-16 object-contain bg-slate-100 rounded-xl border border-slate-200 shadow-sm" />
                      <div>
                        <span className="block text-[10px] text-emerald-600 font-bold flex items-center">
                          <Check className="w-3.5 h-3.5 mr-0.5" /> Image Registered
                        </span>
                        <button
                          type="button"
                          onClick={() => { setRemoveMainImage(true); setMainImageAssetId(''); }}
                          className="mt-1 text-[10px] font-bold text-rose-600 hover:underline inline-flex items-center"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="mainImageUpload"
                        onChange={handleMainImageUpload}
                        className="hidden"
                        disabled={isUploadingMain}
                      />
                      <label
                        htmlFor="mainImageUpload"
                        className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                      >
                        {isUploadingMain ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-saffron-600" />
                            <span>Uploading image to Sanity...</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>Upload Cover Image</span>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                {/* PDF Document Upload (Parliamentary Update only) */}
                {formType === 'parliamentaryUpdate' && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Attached Official Document (PDF)
                    </label>
                    
                    {documentOriginalName && !removeDocument ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center justify-center">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div className="shrink min-w-0 pr-2">
                          <span className="block text-xs font-bold text-slate-700 truncate max-w-xs">{documentOriginalName}</span>
                          <button
                            type="button"
                            onClick={() => { setRemoveDocument(true); setDocumentAssetId(''); }}
                            className="mt-0.5 text-[10px] font-bold text-rose-600 hover:underline inline-flex items-center"
                          >
                            Remove Attachment
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept=".pdf"
                          id="documentUpload"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          disabled={isUploadingDoc}
                        />
                        <label
                          htmlFor="documentUpload"
                          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          {isUploadingDoc ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-saffron-600" />
                              <span>Uploading document to Sanity...</span>
                            </>
                          ) : (
                            <>
                              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                              <span>Upload PDF File</span>
                            </>
                          )}
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Slideshow Carousel Images Array */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>Slideshow Carousel Images</span>
                    {slideshowImageUrls.length > 0 && (
                      <span className="text-[9px] text-slate-400 font-semibold">{slideshowImageUrls.length} Active Slides</span>
                    )}
                  </label>
                  
                  {/* Thumbnail Lists */}
                  {slideshowImageUrls.length > 0 && !removeSlideshowImages && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                      {slideshowImageUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-slate-100 flex items-center justify-center">
                          <img src={url} alt="" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveSlideshowImageIndex(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 cursor-pointer flex items-center justify-center shadow-md"
                            title="Remove slide"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="slideshowUpload"
                      onChange={handleSlideshowUpload}
                      className="hidden"
                      disabled={isUploadingSlides}
                    />
                    <label
                      htmlFor="slideshowUpload"
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                    >
                      {isUploadingSlides ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-saffron-600" />
                          <span>Uploading slides...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                          <span>Upload Multiple Slideshow Images</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </form>

              {/* Form Footer Buttons */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 sticky bottom-0 z-10">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitForm}
                  className="flex-grow py-3 bg-navy-900 text-white hover:bg-navy-800 disabled:bg-slate-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-saffron-500" />
                      <span>Saving changes to Sanity...</span>
                    </>
                  ) : (
                    <span>{editingDocId ? 'Save and Publish Changes' : 'Publish Document to Sanity'}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpenFormModal(false)}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-500 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETION CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingDoc && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 text-slate-800 w-full max-w-md relative overflow-hidden"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="font-black text-navy-900 text-base">Delete Document?</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Are you sure you want to delete <strong className="font-bold text-navy-950">"{deletingDoc.title}"</strong>?<br />
                  This action is permanent and will delete the document immediately from Sanity CMS.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-grow py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-350 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Deleting from Sanity...</span>
                    </>
                  ) : (
                    <span>Delete Permanently</span>
                  )}
                </button>
                <button
                  onClick={() => setDeletingDoc(null)}
                  className="px-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
