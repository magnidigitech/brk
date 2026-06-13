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
    const targetLang = lang === 'te' ? 'te-IN' : 'en-IN'
    utterance.lang = targetLang

    // Set voice asynchronously with preference for Indian English and Telugu Female voices
    const voices = synth.getVoices()
    let chosenVoice: SpeechSynthesisVoice | null = null

    if (lang === 'te') {
      const teVoices = voices.filter((v) => v.lang === 'te-IN' || v.lang.toLowerCase().startsWith('te'))
      // Known Telugu female voice keywords (like macOS Vani, Google, Hema, Swara, Shravya)
      const femaleKeywords = ['vani', 'google', 'female', 'swara', 'hema', 'shravya']
      chosenVoice = teVoices.find((v) => {
        const nameLower = v.name.toLowerCase()
        return femaleKeywords.some((kw) => nameLower.includes(kw))
      }) || null

      if (!chosenVoice) {
        chosenVoice = teVoices.find((v) => v.lang === 'te-IN') || null
      }
      if (!chosenVoice) {
        chosenVoice = teVoices[0] || null
      }
    } else {
      const enInVoices = voices.filter((v) => v.lang === 'en-IN')
      // Known Indian English female voice keywords (like macOS Veena, Windows Heera, Google India)
      const enInFemaleKeywords = ['veena', 'heera', 'ishita', 'priti', 'google', 'female']
      chosenVoice = enInVoices.find((v) => {
        const nameLower = v.name.toLowerCase()
        return enInFemaleKeywords.some((kw) => nameLower.includes(kw))
      }) || null

      if (!chosenVoice) {
        chosenVoice = enInVoices[0] || null
      }
      if (!chosenVoice) {
        const anyEnVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
        const generalFemaleKeywords = ['samantha', 'victoria', 'google', 'female', 'zira', 'hazel']
        chosenVoice = anyEnVoices.find((v) => {
          const nameLower = v.name.toLowerCase()
          return generalFemaleKeywords.some((kw) => nameLower.includes(kw))
        }) || null
      }
      if (!chosenVoice) {
        chosenVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en')) || null
      }
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice
      utterance.lang = chosenVoice.lang
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
