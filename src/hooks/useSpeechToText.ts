'use client'

import { useState, useEffect, useRef } from 'react'

export function useSpeechToText(defaultLang: 'en' | 'te', onTranscriptChange: (text: string) => void) {
  const [isListening, setIsListening] = useState(false)
  const [recogLang, setRecogLang] = useState<'te-IN' | 'en-US'>(defaultLang === 'te' ? 'te-IN' : 'en-US')
  const [supported, setSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [interimTranscript, setInterimTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSupported(true)
        const rec = new SpeechRecognition()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = recogLang
        recognitionRef.current = rec
      }
    }
  }, [recogLang])

  // Sync default language context changes
  useEffect(() => {
    setRecogLang(defaultLang === 'te' ? 'te-IN' : 'en-US')
  }, [defaultLang])

  // Stop listening on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (!supported || !recognitionRef.current || isListening) return

    const rec = recognitionRef.current
    setError(null)
    setInterimTranscript('')

    rec.onstart = () => {
      setIsListening(true)
    }

    rec.onresult = (event: any) => {
      let finalTranscript = ''
      let currentInterim = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        } else {
          currentInterim += event.results[i][0].transcript
        }
      }
      setInterimTranscript(currentInterim)
      if (finalTranscript) {
        onTranscriptChange(finalTranscript)
      }
    }

    rec.onerror = (e: any) => {
      console.warn('SpeechRecognition error:', e)
      if (e.error === 'not-allowed') {
        setError('Permission denied. Please allow microphone access.')
      } else {
        setError(e.error || 'An error occurred during voice input.')
      }
      setIsListening(false)
    }

    rec.onend = () => {
      setIsListening(false)
    }

    try {
      rec.start()
    } catch (e) {
      console.error('Failed to start speech recognition:', e)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const toggleLanguage = () => {
    const nextLang = recogLang === 'te-IN' ? 'en-US' : 'te-IN'
    setRecogLang(nextLang)
    if (isListening) {
      // Restart with new language
      stopListening()
      setTimeout(() => {
        startListening()
      }, 200)
    }
  }

  return {
    startListening,
    stopListening,
    toggleLanguage,
    isListening,
    recogLang,
    supported,
    error,
    interimTranscript
  }
}
