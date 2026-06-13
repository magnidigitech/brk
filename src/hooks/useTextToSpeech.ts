'use client'

import { useState, useEffect, useRef } from 'react'

export type SpeechState = 'idle' | 'playing' | 'paused'

export function useTextToSpeech(text: string, lang: 'en' | 'te') {
  const [state, setState] = useState<SpeechState>('idle')
  const [supported, setSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true)
    }
  }, [])

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = () => {
    if (!supported || !text) return

    const synth = window.speechSynthesis

    // Resume if paused
    if (state === 'paused') {
      synth.resume()
      setState('playing')
      return
    }

    // Cancel any current utterance
    synth.cancel()

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Configure language parameters
    const targetLang = lang === 'te' ? 'te-IN' : 'en-US'
    utterance.lang = targetLang

    // Set voice asynchronously if voices load late
    const voices = synth.getVoices()
    const voice = voices.find((v) => v.lang === targetLang || v.lang.startsWith(lang))
    if (voice) {
      utterance.voice = voice
    }

    // Handle end, error, and boundary events
    utterance.onend = () => {
      setState('idle')
    }

    utterance.onerror = (e) => {
      // Don't flag 'interrupted' as error state since it happens on manual stop
      if (e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e)
      }
      setState('idle')
    }

    setState('playing')
    synth.speak(utterance)
  }

  const pause = () => {
    if (!supported || state !== 'playing') return
    window.speechSynthesis.pause()
    setState('paused')
  }

  const stop = () => {
    if (!supported) return
    window.speechSynthesis.cancel()
    setState('idle')
  }

  return {
    speak,
    pause,
    stop,
    state,
    supported
  }
}
