'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  LifeBuoy, 
  Compass, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react'
import { useLanguage } from '@/components/LanguageContext'

interface AIAssistantProps {
  siteSettings?: {
    candidateName?: string
    delhiOffice?: { address?: string; phone?: string; email?: string }
    stateOffice?: { address?: string; phone?: string; email?: string }
  }
}

interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: Date
  richCard?: {
    type: 'contact' | 'grievance' | 'updates' | 'about' | 'sectors'
    data?: any
  }
}

export default function AIAssistant({ siteSettings }: AIAssistantProps) {
  const { language, t } = useLanguage()
  
  // States
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
  const [latestNews, setLatestNews] = useState<any[]>([])
  
  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Standard static localizations
  const localT = {
    headerTitle: { en: 'Office Assistant', te: 'కార్యాలయ సహాయకుడు' },
    statusOnline: { en: 'Online', te: 'లైవ్‌లో ఉన్నారు' },
    placeholder: { en: 'Ask me anything...', te: 'ఏదైనా అడగండి...' },
    greeting: {
      en: "Namaste! I am the official digital assistant for the office of Rajya Sabha Nominee Shri Bhashyam Rama Krishna. I can assist you with locating Camp Offices, submitting Grievance Petitions, exploring Key Focus Sectors, or searching recent announcements. What can I help you with today?",
      te: "నమస్తే! రాజ్యసభ అభ్యర్థి శ్రీ భాష్యం రామకృష్ణ గారి కార్యాలయ డిజిటల్ సహాయకుడిని. నేను మీకు క్యాంప్ కార్యాలయాల చిరునామా, ప్రజా ఫిర్యాదుల సమర్పణ, ప్రాధాన్యత రంగాలు లేదా తాజా పత్రికా ప్రకటనల శోధనలో సహాయం చేయగలను. నేను ఈ రోజు మీకు ఏ విధంగా సహాయం చేయాలి?"
    },
    chipContact: { en: 'Camp Offices', te: 'కార్యాలయాల వివరాలు' },
    chipGrievance: { en: 'Submit Grievance', te: 'ఫిర్యాదు చేయడం ఎలా' },
    chipBio: { en: 'About MP', te: 'మన నాయకత్వం గురించి' },
    chipSectors: { en: 'Priority Sectors', te: 'రాష్ట్ర రంగాలు' },
    chipNews: { en: 'Latest News', te: 'తాజా వార్తలు' },
    voiceListening: { en: 'Listening...', te: 'వింటున్నాను...' },
    copLink: { en: 'Copy Details', te: 'కాపీ చేయండి' },
    copied: { en: 'Copied!', te: 'కాపీ చేయబడింది!' }
  }

  // Fetch latest news on mount from Sanity client-side
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const { client } = await import('@/sanity/lib/client')
        const items = await client.fetch(
          `*[_type in ["pressRelease", "parliamentaryUpdate"]] | order(publishedAt desc, date desc)[0...3] {
            _id,
            _type,
            title,
            publishedAt,
            date,
            excerpt,
            summary
          }`
        )
        setLatestNews(items || [])
      } catch (err) {
        console.error('Failed to fetch latest news for chatbot:', err)
      }
    }
    fetchLatestNews()
  }, [])

  // Hydrate messages & open state from localStorage on mount (Client-side only)
  useEffect(() => {
    try {
      const storedOpen = localStorage.getItem('ai-assistant-open')
      if (storedOpen === 'true') {
        setIsOpen(true)
      }
      
      const storedMessages = localStorage.getItem('ai-assistant-messages')
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages)
        const messagesWithDates = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
        if (messagesWithDates.length > 0) {
          setMessages(messagesWithDates)
          return
        }
      }
    } catch (err) {
      console.warn('Failed to restore AI Assistant cache:', err)
    }

    // Default welcome message if cache is empty
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: localT.greeting[language],
        timestamp: new Date()
      }
    ])
  }, [language])

  // Save messages to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('ai-assistant-messages', JSON.stringify(messages))
      } catch (err) {
        console.warn('Failed to cache AI Assistant messages:', err)
      }
    }
  }, [messages])

  // Save open state to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('ai-assistant-open', String(isOpen))
    } catch (err) {
      console.warn('Failed to cache AI Assistant open status:', err)
    }
  }, [isOpen])


  // Scroll to bottom on updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const rec = new SpeechRecognition()
        rec.continuous = false
        rec.interimResults = false
        rec.lang = language === 'te' ? 'te-IN' : 'en-IN'

        rec.onstart = () => setIsListening(true)
        rec.onend = () => setIsListening(false)
        rec.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript
          if (transcript) {
            setInputValue(transcript)
          }
        }
        rec.onerror = (err: any) => {
          console.error('Speech recognition error:', err)
          setIsListening(false)
        }
        recognitionRef.current = rec
      }
    }
  }, [language])

  // Trigger TTS voice output
  const speakText = (text: string) => {
    if (isMuted || typeof window === 'undefined') return
    const synth = window.speechSynthesis
    if (synth) {
      synth.cancel() // Cancel any ongoing narration
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === 'te' ? 'te-IN' : 'en-IN'
      synth.speak(utterance)
    }
  }

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert(language === 'te' ? 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు.' : 'Voice recognition is not supported in this browser.')
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim()
    if (!query) return

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    // Stop speech synthesis if playing
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    // Process Bot Response
    const lowerQuery = query.toLowerCase()
    let replyText = ''
    let richCard: ChatMessage['richCard'] = undefined

    // Check if it is an exact suggestion chip match to preserve quick actions
    const isChipContact = query === localT.chipContact.en || query === localT.chipContact.te
    const isChipGrievance = query === localT.chipGrievance.en || query === localT.chipGrievance.te
    const isChipBio = query === localT.chipBio.en || query === localT.chipBio.te
    const isChipSectors = query === localT.chipSectors.en || query === localT.chipSectors.te
    const isChipNews = query === localT.chipNews.en || query === localT.chipNews.te

    if (isChipContact) {
      replyText = language === 'te'
        ? "శ్రీ భాష్యం రామకృష్ణ గారి క్యాంప్ కార్యాలయాల వివరాలు క్రింద ఇవ్వబడ్డాయి. మీరు న్యూఢిల్లీ లేదా గుంటూరు క్యాంప్ కార్యాలయాన్ని నేరుగా ఫోన్ లేదా ఈమెయిల్ ద్వారా సంప్రదించవచ్చు."
        : "Here are the contact details for Shri Bhashyam Rama Krishna's official New Delhi and Guntur camp offices:"
      richCard = { type: 'contact' }
    } else if (isChipGrievance) {
      replyText = language === 'te'
        ? "మీరు మీ స్థానిక సమస్యలను నేరుగా సమర్పించి, వాటి పురోగతిని ట్రాక్ చేయడానికి మన ప్రజా ఫిర్యాదుల పోర్టల్‌ను ఉపయోగించవచ్చు. ఏ కేటగిరీ కింద ఫిర్యాదు చేయాలనుకుంటున్నారో ఎంచుకోండి:"
        : "You can submit your local and community concerns directly to the MP's office and track their resolution status in real-time. Choose a category to begin your petition:"
      richCard = { type: 'grievance' }
    } else if (isChipBio) {
      replyText = language === 'te'
        ? "శ్రీ భాష్యం రామకృష్ణ గారు ప్రముఖ విద్యావేత్త, భాష్యం విద్యా సంస్థల వ్యవస్థాపక చైర్మన్ మరియు ఆంధ్రప్రదేశ్ నుండి ఎన్నికైన గౌరవ రాజ్యసభ అభ్యర్థి. ఆయన విద్యా వికాసం మరియు ప్రజా సేవకు కట్టుబడి ఉన్నారు."
        : "Shri Bhashyam Rama Krishna is an educationist, Founder Chairman of Bhashyam Educational Institutions, and a dedicated Rajya Sabha representative from Andhra Pradesh, committed to social progress and empowerment."
      richCard = { type: 'about' }
    } else if (isChipSectors) {
      replyText = language === 'te'
        ? "ఆంధ్రప్రదేశ్ రాష్ట్ర సమగ్ర ప్రగతి కోసం విద్యా రంగం, యువత సాధికారత, వ్యవసాయం, వైద్యం మరియు మౌలిక వసతుల వంటి కీలక రంగాలలో ప్రజా కార్యక్రమాలను చేపట్టాము."
        : "Explore the priority sectors where the MP's office is initiating legislative push and community projects to support Andhra Pradesh's inclusive growth:"
      richCard = { type: 'sectors' }
    } else if (isChipNews) {
      if (latestNews && latestNews.length > 0) {
        replyText = language === 'te'
          ? "తాజా పత్రికా ప్రకటనలు మరియు పార్లమెంటరీ అప్‌డేట్స్ ఇక్కడ ఉన్నాయి:"
          : "Here are the latest press releases and parliamentary updates:"
        richCard = {
          type: 'updates',
          data: latestNews
        }
      } else {
        replyText = language === 'te'
          ? "తాజా పత్రికా ప్రకటనలు ఏవీ లేవు"
          : "No latest press release"
      }
    } else {
      // It is a TYPED message: query live search API first for partial/exact keyword matches
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.items && data.items.length > 0) {
            // Found updates or press releases (contains partial content match)
            replyText = language === 'te'
              ? `మీ శోధనకు సంబంధించిన పత్రికా ప్రకటనలు మరియు పార్లమెంటరీ అప్‌డేట్స్ లభించాయి:`
              : `I found these updates and press releases matching your query:`
            richCard = {
              type: 'updates',
              data: data.items.slice(0, 3)
            }
          } else if (data.faqs && data.faqs.length > 0) {
            // Found a matching FAQ
            const matchedFaq = data.faqs[0]
            replyText = matchedFaq.answer[language] || matchedFaq.answer.en
          }
        }
      } catch (err) {
        console.error('Chatbot search API failed', err)
      }

      // If search API matches are empty, fall back to checking local keyword intents
      if (!replyText) {
        const isContact = lowerQuery.includes('contact') || lowerQuery.includes('office') || lowerQuery.includes('address') || lowerQuery.includes('camp') || lowerQuery.includes('కార్యాలయం') || lowerQuery.includes('చిరునామా')
        const isGrievance = lowerQuery.includes('grievance') || lowerQuery.includes('complaint') || lowerQuery.includes('petition') || lowerQuery.includes('ticket') || lowerQuery.includes('ఫిర్యాదు') || lowerQuery.includes('సమస్య') || lowerQuery.includes('ఇబ్బంది')
        const isAbout = lowerQuery.includes('about') || lowerQuery.includes('who is') || lowerQuery.includes('biography') || lowerQuery.includes('రామకృష్ణ') || lowerQuery.includes('చరిత్ర') || lowerQuery.includes('ఎవరు')
        const isSectors = lowerQuery.includes('sector') || lowerQuery.includes('focus') || lowerQuery.includes('vision') || lowerQuery.includes('రంగాలు') || lowerQuery.includes('లక్ష్యాలు')
        const isNews = lowerQuery.includes('news') || lowerQuery.includes('press') || lowerQuery.includes('release') || lowerQuery.includes('update') || lowerQuery.includes('తాజా') || lowerQuery.includes('వార్త') || lowerQuery.includes('ప్రకటన') || lowerQuery.includes('అప్‌డేట్')

        if (isContact) {
          replyText = language === 'te'
            ? "శ్రీ భాష్యం రామకృష్ణ గారి క్యాంప్ కార్యాలయాల వివరాలు క్రింద ఇవ్వబడ్డాయి. మీరు న్యూఢిల్లీ లేదా గుంటూరు క్యాంప్ కార్యాలయాన్ని నేరుగా ఫోన్ లేదా ఈమెయిల్ ద్వారా సంప్రదించవచ్చు."
            : "Here are the contact details for Shri Bhashyam Rama Krishna's official New Delhi and Guntur camp offices:"
          richCard = { type: 'contact' }
        } else if (isGrievance) {
          replyText = language === 'te'
            ? "మీరు మీ స్థానిక సమస్యలను నేరుగా సమర్పించి, వాటి పురోగతిని ట్రాక్ చేయడానికి మన ప్రజా ఫిర్యాదుల పోర్టల్‌ను ఉపయోగించవచ్చు. ఏ కేటగిరీ కింద ఫిర్యాదు చేయాలనుకుంటున్నారో ఎంచుకోండి:"
            : "You can submit your local and community concerns directly to the MP's office and track their resolution status in real-time. Choose a category to begin your petition:"
          richCard = { type: 'grievance' }
        } else if (isAbout) {
          replyText = language === 'te'
            ? "శ్రీ భాష్యం రామకృష్ణ గారు ప్రముఖ విద్యావేత్త, భాష్యం విద్యా సంస్థల వ్యవస్థాపక చైర్మన్ మరియు ఆంధ్రప్రదేశ్ నుండి ఎన్నికైన గౌరవ రాజ్యసభ అభ్యర్థి. ఆయన విద్యా వికాసం మరియు ప్రజా సేవకు కట్టుబడి ఉన్నారు."
            : "Shri Bhashyam Rama Krishna is an educationist, Founder Chairman of Bhashyam Educational Institutions, and a dedicated Rajya Sabha representative from Andhra Pradesh, committed to social progress and empowerment."
          richCard = { type: 'about' }
        } else if (isSectors) {
          replyText = language === 'te'
            ? "ఆంధ్రప్రదేశ్ రాష్ట్ర సమగ్ర ప్రగతి కోసం విద్యా రంగం, యువత సాధికారత, వ్యవసాయం, వైద్యం మరియు మౌలిక వసతుల వంటి కీలక రంగాలలో ప్రజా కార్యక్రమాలను చేపట్టాము."
            : "Explore the priority sectors where the MP's office is initiating legislative push and community projects to support Andhra Pradesh's inclusive growth:"
          richCard = { type: 'sectors' }
        } else if (isNews) {
          if (latestNews && latestNews.length > 0) {
            replyText = language === 'te'
              ? "తాజా పత్రికా ప్రకటనలు మరియు పార్లమెంటరీ అప్‌డేట్స్ ఇక్కడ ఉన్నాయి:"
              : "Here are the latest press releases and parliamentary updates:"
            richCard = {
              type: 'updates',
              data: latestNews
            }
          } else {
            replyText = language === 'te'
              ? "తాజా పత్రికా ప్రకటనలు ఏవీ లేవు"
              : "No latest press release"
          }
        }
      }
    }


    // Fallback if no match
    if (!replyText) {
      replyText = language === 'te'
        ? "క్షమించాలి, మీరు అడిగినదానికి సరిపోలే సమాచారం లభించలేదు. దయచేసి 'కార్యాలయాల చిరునామా', 'ఫిర్యాదు చేయడం ఎలా' అని అడగండి లేదా 'విద్యా రంగం' వంటి పదాలతో శోధించండి."
        : "I couldn't find a direct match. Try asking about 'camp office contact details', 'how to submit a grievance', or search for topics like 'education' or 'infrastructure'."
    }

    // Add bot response with delay simulation
    setTimeout(() => {
      setIsTyping(false)
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date(),
        richCard
      }
      setMessages(prev => [...prev, botMsg])
      speakText(replyText)
    }, 800)
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-navy-900 hover:bg-navy-950 border border-navy-800 text-saffron-400 rounded-full flex items-center justify-center shadow-xl cursor-pointer relative"
          title="Open Assistant"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <MessageSquare className="w-6 h-6 text-[#FFD200]" />
                {/* Pulsing notification indicator dot */}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-navy-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-[148px] lg:bottom-24 right-4 lg:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-11rem)] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#0B192C] text-white flex justify-between items-center border-b border-navy-950 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-navy-950 shadow-inner relative overflow-hidden p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo.png" alt="Assistant" className="w-full h-full object-contain rounded-lg" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B192C]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white tracking-wide leading-tight">
                    {localT.headerTitle[language]}
                  </h4>
                  <span className="block text-[9px] font-black text-saffron-400 tracking-widest uppercase">
                    {localT.statusOnline[language]}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Mute/Speak Toggle */}
                <button
                  onClick={() => {
                    setIsMuted(!isMuted)
                    if (isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
                      window.speechSynthesis.cancel()
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    !isMuted ? 'bg-navy-800 text-saffron-400' : 'text-slate-400 hover:text-white'
                  }`}
                  title={!isMuted ? 'Mute Assistant voice output' : 'Enable Assistant voice output'}
                >
                  {!isMuted ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center mr-2 shrink-0 mt-0.5 shadow-sm overflow-hidden p-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/logo.png" alt="Bot Logo" className="w-full h-full object-contain rounded-md" />
                    </div>
                  )}

                  <div className="max-w-[80%] flex flex-col space-y-1.5">
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs leading-relaxed font-semibold shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-navy-900 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none border-l-4 border-l-saffron-400'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Rich Cards Rendering */}
                      {msg.sender === 'bot' && msg.richCard && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                          
                          {/* 1. Contact Info Card */}
                          {msg.richCard.type === 'contact' && (
                            <div className="space-y-3">
                              {/* State Camp Office */}
                              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] leading-relaxed relative">
                                <span className="block text-[8px] font-black text-saffron-600 uppercase tracking-widest mb-1.5">Guntur Camp Office</span>
                                <p className="text-navy-950 font-bold mb-1.5 flex items-start">
                                  <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-400 mt-0.5" />
                                  {siteSettings?.stateOffice?.address || 'Navabharath Nagar 4/3 Line, Guntur - 522006'}
                                </p>
                                <div className="space-y-1 font-bold text-slate-600">
                                  <a href={`tel:${siteSettings?.stateOffice?.phone || '+918662470000'}`} className="flex items-center hover:text-navy-900">
                                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {siteSettings?.stateOffice?.phone || '+91 866 247 XXXX'}
                                  </a>
                                  <a href={`mailto:${siteSettings?.stateOffice?.email || 'state.office@bramakrishna.mp.in'}`} className="flex items-center hover:text-navy-900 truncate">
                                    <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" /> {siteSettings?.stateOffice?.email || 'state.office@bramakrishna.mp.in'}
                                  </a>
                                </div>
                                <button
                                  onClick={() => handleCopy(`${siteSettings?.stateOffice?.address || 'Navabharath Nagar 4/3 Line, Guntur - 522006'} Phone: ${siteSettings?.stateOffice?.phone || '+918662470000'}`, 'state-office')}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-navy-900"
                                >
                                  {copiedIndex === 'state-office' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>

                              {/* Delhi Office */}
                              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] leading-relaxed relative">
                                <span className="block text-[8px] font-black text-saffron-600 uppercase tracking-widest mb-1.5">New Delhi Residence</span>
                                <p className="text-navy-950 font-bold mb-1.5 flex items-start">
                                  <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-400 mt-0.5" />
                                  {siteSettings?.delhiOffice?.address || '12, Rajya Sabha Members Residences, New Delhi - 110001'}
                                </p>
                                <div className="space-y-1 font-bold text-slate-600">
                                  <a href={`tel:${siteSettings?.delhiOffice?.phone || '+911123700000'}`} className="flex items-center hover:text-navy-900">
                                    <Phone className="w-3 h-3 mr-1 text-slate-400" /> {siteSettings?.delhiOffice?.phone || 'Delhi Office'}
                                  </a>
                                  <a href={`mailto:${siteSettings?.delhiOffice?.email || 'delhi.office@bramakrishna.mp.in'}`} className="flex items-center hover:text-navy-900 truncate">
                                    <Mail className="w-3 h-3 mr-1 text-slate-400" /> {siteSettings?.delhiOffice?.email || 'delhi.office@bramakrishna.mp.in'}
                                  </a>
                                </div>
                                <button
                                  onClick={() => handleCopy(`${siteSettings?.delhiOffice?.address || '12, Rajya Sabha Members Residences, New Delhi - 110001'}`, 'delhi-office')}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-navy-900"
                                >
                                  {copiedIndex === 'delhi-office' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 2. Grievance Link Card */}
                          {msg.richCard.type === 'grievance' && (
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-wider">
                              <a
                                href="/grievance?category=infra"
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-saffron-400 hover:bg-white text-center text-navy-950 flex flex-col items-center gap-1.5"
                              >
                                <Compass className="w-4 h-4 text-slate-500" />
                                Roads & Infra
                              </a>
                              <a
                                href="/grievance?category=water"
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-saffron-400 hover:bg-white text-center text-navy-950 flex flex-col items-center gap-1.5"
                              >
                                <LifeBuoy className="w-4 h-4 text-slate-500" />
                                Water Scarcity
                              </a>
                              <a
                                href="/grievance?category=agri"
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-saffron-400 hover:bg-white text-center text-navy-950 flex flex-col items-center gap-1.5"
                              >
                                <HelpCircle className="w-4 h-4 text-slate-500" />
                                Farm Support
                              </a>
                              <a
                                href="/grievance"
                                className="p-2.5 bg-saffron-400 hover:bg-saffron-500 rounded-xl text-center text-navy-950 flex flex-col items-center gap-1.5 col-span-2 border border-saffron-500"
                              >
                                <LifeBuoy className="w-4 h-4" />
                                Open Grievance Portal
                              </a>
                            </div>
                          )}

                          {/* 3. About Page redirect Card */}
                          {msg.richCard.type === 'about' && (
                            <a
                              href="/about"
                              className="inline-flex items-center justify-between px-3 py-2 bg-saffron-400 hover:bg-saffron-500 border border-saffron-500 text-[10px] font-black uppercase tracking-wider rounded-xl text-navy-950 w-full"
                            >
                              <span>Read Full Biography</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* 4. Focus Sectors redirect Card */}
                          {msg.richCard.type === 'sectors' && (
                            <a
                              href="/state-focus"
                              className="inline-flex items-center justify-between px-3 py-2 bg-saffron-400 hover:bg-saffron-500 border border-saffron-500 text-[10px] font-black uppercase tracking-wider rounded-xl text-navy-950 w-full"
                            >
                              <span>Explore Priority Sectors</span>
                              <Compass className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* 5. Live Search API results List */}
                          {msg.richCard.type === 'updates' && msg.richCard.data && (
                            <div className="space-y-2">
                              {msg.richCard.data.map((item: any) => {
                                const isPress = item._type === 'pressRelease'
                                const isDaily = item._type === 'dailyUpdate'
                                const linkUrl = isDaily
                                  ? `/daily-updates?id=${item._id}`
                                  : isPress 
                                    ? `/press-releases?id=${item._id}`
                                    : `/parliamentary-updates?id=${item._id}`
                                const localizedTitle = item.title?.[language] || item.title?.en || item.title
                                
                                return (
                                  <a
                                    key={item._id}
                                    href={linkUrl}
                                    className="flex justify-between items-start p-2.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-saffron-400 rounded-xl text-[11px] leading-snug text-navy-950 font-bold transition-all"
                                  >
                                    <div className="pr-2 truncate">
                                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                                        {isDaily ? 'Daily Update' : isPress ? 'Press Release' : 'Parliamentary Update'}
                                      </span>
                                      <span className="block truncate max-w-[200px]">{localizedTitle}</span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                                  </a>
                                )
                              })}
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                    
                    <span className={`text-[8px] text-slate-400 font-bold ${msg.sender === 'user' ? 'text-right' : 'text-left pl-1'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start justify-start">
                  <div className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center mr-2 shrink-0 shadow-sm overflow-hidden p-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/logo.png" alt="Bot Logo" className="w-full h-full object-contain rounded-md" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 rounded-tl-none flex items-center space-x-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 border-t border-slate-100 flex overflow-x-auto gap-2 shrink-0 bg-white scrollbar-hide py-3">
              <button
                onClick={() => handleSend(localT.chipNews[language])}
                className="px-3 py-1.5 border border-slate-200 hover:border-saffron-400 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-navy-950 rounded-full shrink-0 transition-colors cursor-pointer font-bold border-saffron-400/60 bg-saffron-50/20"
              >
                {localT.chipNews[language]}
              </button>
              <button
                onClick={() => handleSend(localT.chipContact[language])}
                className="px-3 py-1.5 border border-slate-200 hover:border-saffron-400 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-navy-950 rounded-full shrink-0 transition-colors cursor-pointer"
              >
                {localT.chipContact[language]}
              </button>
              <button
                onClick={() => handleSend(localT.chipGrievance[language])}
                className="px-3 py-1.5 border border-slate-200 hover:border-saffron-400 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-navy-950 rounded-full shrink-0 transition-colors cursor-pointer"
              >
                {localT.chipGrievance[language]}
              </button>
              <button
                onClick={() => handleSend(localT.chipBio[language])}
                className="px-3 py-1.5 border border-slate-200 hover:border-saffron-400 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-navy-950 rounded-full shrink-0 transition-colors cursor-pointer"
              >
                {localT.chipBio[language]}
              </button>
              <button
                onClick={() => handleSend(localT.chipSectors[language])}
                className="px-3 py-1.5 border border-slate-200 hover:border-saffron-400 hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-navy-950 rounded-full shrink-0 transition-colors cursor-pointer"
              >
                {localT.chipSectors[language]}
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex items-center space-x-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend()
                  }}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:border-navy-900 focus:bg-white text-xs outline-none font-semibold"
                  placeholder={isListening ? localT.voiceListening[language] : localT.placeholder[language]}
                  disabled={isListening}
                />
                
                {/* Voice Input Button - Show only when input is empty */}
                {inputValue.trim() === '' && (
                  <button
                    onClick={toggleListen}
                    className={`absolute right-2.5 top-1.5 p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isListening 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'text-slate-400 hover:text-navy-900 hover:bg-slate-100'
                    }`}
                    title={isListening ? 'Stop voice input' : 'Start voice input'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Send Button - Show only when there is input */}
              {inputValue.trim() !== '' && (
                <button
                  onClick={() => handleSend()}
                  className="p-3 bg-saffron-500 hover:bg-saffron-600 text-slate-950 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center shrink-0 border border-saffron-600"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
