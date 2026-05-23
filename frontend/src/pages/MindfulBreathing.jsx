import { useState, useEffect, useRef, useCallback } from 'react'
import NeuronAvatar from '../components/NeuronAvatar'
import SpeechBubble from '../components/SpeechBubble'
import client from '../api/client'

const SESSION_OPTIONS = [
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
]

const BREATH_MESSAGES = [
  'Inhala profundo… siente tus vías neuronales encenderse.',
  'Exhala lentamente… libera lo que no necesitas.',
  'Mantén suavemente… deja que tu mente se asiente.',
  'Inhala calma… exhala tensión.',
  'Tu cerebro te agradece este momento de paz.',
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function MindfulBreathing() {
  const [phase, setPhase] = useState('intro')   // intro | session
  const [totalTime, setTotalTime] = useState(300)
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [sessionId, setSessionId] = useState(null)

  const intervalRef = useRef(null)
  const msgIntervalRef = useRef(null)

  const progress = Math.min(elapsed / totalTime, 1)
  const remaining = totalTime - elapsed

  const startSession = useCallback(async () => {
    setPhase('session')
    setElapsed(0)
    setIsPlaying(true)
    try {
      const { data } = await client.post('/breathing/', { duration_seconds: totalTime, elapsed_seconds: 0 })
      setSessionId(data.id)
    } catch { /* offline – continue anyway */ }
  }, [totalTime])

  const stopSession = useCallback(async (completed = false) => {
    clearInterval(intervalRef.current)
    clearInterval(msgIntervalRef.current)
    setIsPlaying(false)
    if (sessionId) {
      try {
        await client.patch?.(`/breathing/${sessionId}/`, { elapsed_seconds: elapsed, completed })
      } catch { /* best effort */ }
    }
    setPhase('intro')
    setElapsed(0)
    setSessionId(null)
  }, [sessionId, elapsed])

  // Timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= totalTime) {
            clearInterval(intervalRef.current)
            setIsPlaying(false)
            setPhase('intro')
            // mark complete
            client.post('/breathing/', { duration_seconds: totalTime, elapsed_seconds: totalTime, completed: true }).catch(() => {})
            return totalTime
          }
          return e + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, totalTime])

  // Rotate messages every 8s
  useEffect(() => {
    if (phase === 'session') {
      msgIntervalRef.current = setInterval(() => {
        setMsgIdx((i) => (i + 1) % BREATH_MESSAGES.length)
      }, 8000)
    }
    return () => clearInterval(msgIntervalRef.current)
  }, [phase])

  const rewind10 = () => setElapsed((e) => Math.max(0, e - 10))
  const togglePlay = () => setIsPlaying((v) => !v)

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <NeuronAvatar variant="breathe" size={42} />
          <h1 className="text-base font-bold text-secondary">Respiración Consciente</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-slide-up">
          <SpeechBubble message="Respira profundo. Tus vías neuronales están listas para relajarse y renovarse." className="mb-8 w-full max-w-xs" />

          <NeuronAvatar variant="breathe" size={130} />

          <h2 className="text-xl font-bold text-on-surface mt-8 mb-2">Duración de la sesión</h2>
          <p className="text-sm text-on-surface-variant mb-5">Elige cuánto tiempo quieres respirar conscientemente</p>

          <div className="flex gap-3 mb-8">
            {SESSION_OPTIONS.map((opt) => (
              <button
                key={opt.seconds}
                onClick={() => setTotalTime(opt.seconds)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  totalTime === opt.seconds
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                    : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={startSession}
            className="w-full max-w-xs bg-primary text-on-primary font-semibold py-4 rounded-full text-base hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
            Comenzar sesión
          </button>
        </div>
      )}

      {/* ── SESSION ── */}
      {phase === 'session' && (
        <div className="flex-1 flex flex-col items-center px-6 pt-4 animate-slide-up">
          {/* Bubble */}
          <SpeechBubble message={BREATH_MESSAGES[msgIdx]} className="mb-6 w-full max-w-xs" />

          {/* Aura animation */}
          <div className="relative flex items-center justify-center mb-8" style={{ width: 240, height: 240 }}>
            {/* Outermost aura */}
            <div className="absolute inset-0 rounded-full animate-breathe-aura" style={{ background: 'rgba(252, 205, 59, 0.18)' }} />
            {/* Middle aura */}
            <div className="absolute rounded-full animate-breathe-mid" style={{ width: 196, height: 196, background: 'rgba(252, 205, 59, 0.25)' }} />
            {/* Inner aura */}
            <div className="absolute rounded-full animate-breathe-inner" style={{ width: 160, height: 160, background: 'rgba(252, 205, 59, 0.35)' }} />
            {/* Avatar */}
            <div className="relative z-10">
              <NeuronAvatar variant="breathe" size={130} animated={false} />
            </div>
          </div>

          {/* Timer */}
          <p className="text-4xl font-bold text-secondary mb-1">{formatTime(remaining)}</p>
          <p className="text-xs text-on-surface-variant mb-4">Session Time: {formatTime(totalTime)}</p>

          {/* Progress bar */}
          <div className="w-full max-w-xs h-3 bg-surface-variant rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <button
              onClick={rewind10}
              className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-sm"
              aria-label="Rewind 10 seconds"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2">
                <path d="M12 8V4l-4 4 4 4V8c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8c0-2.757 1.392-5.19 3.5-6.65" strokeLinecap="round" strokeLinejoin="round" />
                <text x="8" y="16" fontSize="6" fill="currentColor" stroke="none" fontWeight="700">10</text>
              </svg>
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg hover:opacity-90 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => stopSession(false)}
              className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-sm"
              aria-label="Stop"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
