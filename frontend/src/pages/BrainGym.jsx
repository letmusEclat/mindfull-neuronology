import { useState, useEffect, useCallback } from 'react'
import NeuronAvatar from '../components/NeuronAvatar'
import SpeechBubble from '../components/SpeechBubble'
import client from '../api/client'

const CATEGORIES = [
  { id: 18, name: 'Informática', icon: '💻', color: '#4a6800', bg: '#d6f0a0' },
  { id: 19, name: 'Matemáticas y Lógica', icon: '🧮', color: '#745b00', bg: '#fff0b0' },
  { id: 17, name: 'Ciencia y Naturaleza', icon: '🧬', color: '#374e00', bg: '#c8e878' },
  { id: 22, name: 'Geografía', icon: '🌍', color: '#8b501a', bg: '#ffd8b0' },
  { id: 23, name: 'Historia', icon: '📜', color: '#5c3000', bg: '#f0c898' },
  { id: 9,  name: 'Conocimiento General', icon: '🧠', color: '#4a6800', bg: '#d6f0a0' },
]

const WORKOUT_CARDS = [
  { title: 'Palacio de Memoria', desc: 'Mejora el recuerdo espacial y la memoria a corto plazo mediante visualización vívida.', tag: 'Concentración',   tagBg: '#eee1ce', icon: '🏛️', category: 18 },
  { title: 'Cadenas Lógicas',   desc: 'Fortalece el pensamiento analítico y las rutas de razonamiento deductivo.',            tag: 'Resolución',      tagBg: '#d6f0a0', icon: '🔗', category: 19 },
  { title: 'Juego de Patrones', desc: 'Mejora el reconocimiento visual y la velocidad de predicción de secuencias.',          tag: 'Velocidad',       tagBg: '#ffd8b0', icon: '🎯', category: 17 },
]

function decode(str) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function BrainGym() {
  const [phase, setPhase] = useState('intro') // intro | quiz | results
  const [category, setCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCats, setShowCats] = useState(false)

  const BUBBLE_MSGS = [
    '"¿Listo para estirar tu mente hoy? ¡Construyamos nuevas conexiones!"',
    '"Cada quiz forma una nueva sinapsis. ¡Vamos!"',
    '"¡Desafía tu cerebro — las neuronas que se activan juntas se conectan juntas!"',
  ]
  const [bubbleIdx] = useState(Math.floor(Math.random() * BUBBLE_MSGS.length))

  const fetchQuiz = useCallback(async (catId) => {
    setLoading(true)
    setError('')
    try {
      const url = `https://opentdb.com/api.php?amount=10&category=${catId}&difficulty=medium&type=multiple`
      const res = await fetch(url)
      const json = await res.json()
      if (json.response_code !== 0) throw new Error('No questions available for this category.')
      const qs = json.results.map((q) => ({
        question: decode(q.question),
        correct: decode(q.correct_answer),
        choices: shuffle([q.correct_answer, ...q.incorrect_answers].map(decode)),
      }))
      setQuestions(qs)
      setCurrent(0)
      setScore(0)
      setSelected(null)
      setAnswered(false)
      setPhase('quiz')
    } catch (e) {
      setError(e.message || 'Failed to load questions.')
    } finally {
      setLoading(false)
    }
  }, [])

  const startWorkout = (card) => {
    setCategory({ id: card.category, name: card.title })
    fetchQuiz(card.category)
  }

  const startCategory = (cat) => {
    setCategory(cat)
    setShowCats(false)
    fetchQuiz(cat.id)
  }

  const handleAnswer = (choice) => {
    if (answered) return
    setSelected(choice)
    setAnswered(true)
    if (choice === questions[current].correct) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      // Save attempt
      client.post('/quiz/', {
        category_id: category?.id ?? 0,
        category_name: category?.name ?? 'General',
        total_questions: questions.length,
        correct_answers: score + (selected === questions[current]?.correct ? 0 : 0),
      }).catch(() => {})
      setPhase('results')
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const q = questions[current]

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <NeuronAvatar variant="gym" size={42} />
          <h1 className="text-base font-bold text-secondary">Hola, Explorador Neuronal</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div className="flex-1 px-4 animate-slide-up">
          {/* Quote bubble */}
          <div className="mx-2 mb-6">
            <SpeechBubble message={BUBBLE_MSGS[bubbleIdx]} />
          </div>
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <NeuronAvatar variant="gym" size={120} />
          </div>

          {/* Today's Workout */}
          <h2 className="text-xl font-bold text-on-surface mb-4">Entrenamiento de hoy</h2>
          <div className="flex flex-col gap-3 mb-6">
            {WORKOUT_CARDS.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-xl">
                    {card.icon}
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-on-surface-variant" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="5" width="14" height="14" rx="2" />
                    <path d="M9 9h6M9 12h6M9 15h3" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-semibold text-on-surface mb-1">{card.title}</p>
                <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{card.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: card.tagBg, color: '#4f4636' }}>{card.tag}</span>
                  <button
                    onClick={() => startWorkout(card)}
                    className="bg-primary text-on-primary text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all"
                  >
                    Comenzar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Browse Categories */}
          <button
            onClick={() => setShowCats((v) => !v)}
            className="w-full text-sm font-semibold text-primary border border-primary rounded-full py-2.5 hover:bg-primary-container transition-colors mb-3"
          >
            {showCats ? 'Ocultar categorías' : 'Ver todas las categorías'}
          </button>
          {showCats && (
            <div className="grid grid-cols-2 gap-2 mb-4 animate-slide-up">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => startCategory(cat)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-outline-variant hover:shadow-sm active:scale-95 transition-all"
                  style={{ background: cat.bg }}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-semibold" style={{ color: cat.color }}>{cat.name}</span>
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-primary-container border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* ── QUIZ ── */}
      {phase === 'quiz' && q && (
        <div className="flex-1 px-4 animate-slide-up">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setPhase('intro')} className="text-on-surface-variant">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-on-surface-variant">
              {current + 1}/{questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-container text-on-primary-container">
              {category?.name}
            </span>
            <span className="text-xs font-medium text-on-surface-variant">Puntuación: {score}</span>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant mb-6">
            <p className="font-semibold text-on-surface text-base leading-relaxed">{q.question}</p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {q.choices.map((choice) => {
              let style = 'border border-outline-variant bg-white text-on-surface hover:bg-surface-container'
              if (answered) {
                if (choice === q.correct) style = 'border-2 border-primary bg-primary-container text-on-primary-container'
                else if (choice === selected) style = 'border-2 border-red-400 bg-red-50 text-red-700'
              }
              return (
                <button
                  key={choice}
                  onClick={() => handleAnswer(choice)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all active:scale-98 ${style}`}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          {answered && (
            <button
              onClick={handleNext}
              className="w-full bg-primary text-on-primary font-semibold py-3.5 rounded-full hover:opacity-90 active:scale-95 transition-all animate-slide-up"
            >
              {current + 1 >= questions.length ? 'Ver resultados' : 'Siguiente pregunta →'}
            </button>
          )}
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === 'results' && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 animate-slide-up">
          <NeuronAvatar variant="gym" size={100} />
          <h2 className="text-2xl font-bold text-on-surface mt-6 mb-2">
            {score >= questions.length * 0.8 ? '🎉 ¡Excelente!' : score >= questions.length * 0.5 ? '💪 ¡Bien hecho!' : '🧠 ¡Sigue adelante!'}
          </h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Obtuviste <strong className="text-primary">{score}</strong> de <strong>{questions.length}</strong>
          </p>
          <div className="w-full bg-white rounded-2xl p-5 border border-outline-variant shadow-sm mb-6 text-center">
            <p className="text-4xl font-bold text-primary">{Math.round((score / questions.length) * 100)}%</p>
            <p className="text-on-surface-variant text-xs mt-1">Precisión — {category?.name}</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => { setPhase('intro') }}
              className="flex-1 border border-primary text-primary font-semibold py-3 rounded-full hover:bg-primary-container transition-colors"
            >
              Volver al inicio
            </button>
            <button
              onClick={() => fetchQuiz(category?.id)}
              className="flex-1 bg-primary text-on-primary font-semibold py-3 rounded-full hover:opacity-90 active:scale-95 transition-all"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
