import { useState, useCallback } from 'react'
import {
  FiAward,
  FiBell,
  FiBookOpen,
  FiChevronLeft,
  FiCode,
  FiCpu,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiLink2,
  FiMap,
  FiRefreshCw,
  FiTarget,
  FiThumbsUp,
  FiTrendingUp,
} from 'react-icons/fi'
import NeuronAvatar from '../components/NeuronAvatar'
import SpeechBubble from '../components/SpeechBubble'
import client from '../api/client'

const CATEGORIES = [
  { id: 18, name: 'Informática', icon: FiCode, color: 'var(--color-primary)', bg: 'var(--color-brain-cat-tech-bg)' },
  { id: 19, name: 'Matemáticas y Lógica', icon: FiGrid, color: 'var(--color-secondary)', bg: 'var(--color-brain-cat-math-bg)' },
  { id: 17, name: 'Ciencia y Naturaleza', icon: FiCpu, color: 'var(--color-on-primary-container)', bg: 'var(--color-brain-cat-science-bg)' },
  { id: 22, name: 'Geografía', icon: FiGlobe, color: 'var(--color-tertiary)', bg: 'var(--color-brain-cat-geo-bg)' },
  { id: 23, name: 'Historia', icon: FiBookOpen, color: 'var(--color-brain-cat-history-fg)', bg: 'var(--color-brain-cat-history-bg)' },
  { id: 9, name: 'Conocimiento General', icon: FiTrendingUp, color: 'var(--color-primary)', bg: 'var(--color-brain-cat-tech-bg)' },
]

const WORKOUT_CARDS = [
  { title: 'Palacio de Memoria', desc: 'Mejora el recuerdo espacial y la memoria a corto plazo mediante visualización vívida.', tag: 'Concentración', tagBg: 'var(--color-surface-container-highest)', icon: FiMap, category: 18, mode: 'memory' },
  { title: 'Cadenas Lógicas', desc: 'Fortalece el pensamiento analítico y las rutas de razonamiento deductivo.', tag: 'Resolución', tagBg: 'var(--color-brain-cat-tech-bg)', icon: FiLink2, category: 19, mode: 'quiz' },
  { title: 'Juego de Patrones', desc: 'Mejora el reconocimiento visual y la velocidad de predicción de secuencias.', tag: 'Velocidad', tagBg: 'var(--color-brain-cat-geo-bg)', icon: FiTarget, category: 17, mode: 'quiz' },
]

function decode(str) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function randomUniqueIds(count, min, max) {
  const ids = new Set()
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return [...ids]
}

export default function BrainGym() {
  const [phase, setPhase] = useState('intro') // intro | memory | quiz | results
  const [category, setCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCats, setShowCats] = useState(false)
  const [memoryCards, setMemoryCards] = useState([])
  const [memoryFlipped, setMemoryFlipped] = useState([])
  const [memoryMatched, setMemoryMatched] = useState([])
  const [memoryMoves, setMemoryMoves] = useState(0)
  const [memoryWon, setMemoryWon] = useState(false)

  const BUBBLE_MSGS = [
    '"¿Listo para estirar tu mente hoy? ¡Construyamos nuevas conexiones neuronales!"',
    '"Cada quiz forma una nueva sinapsis. ¡Vamos!"',
    '"¡Desafía tu cerebro — las neuronas que se activan juntas se conectan juntas!"',
  ]
  const bubbleIdx = 0

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

  const startMemoryGame = useCallback(async () => {
    setLoading(true)
    setError('')
    setMemoryFlipped([])
    setMemoryMatched([])
    setMemoryMoves(0)
    setMemoryWon(false)

    try {
      const ids = randomUniqueIds(8, 1, 826)
      const res = await fetch(`https://rickandmortyapi.com/api/character/${ids.join(',')}`)
      if (!res.ok) throw new Error('No se pudo cargar el juego de memoria.')

      const json = await res.json()
      const chars = Array.isArray(json) ? json : [json]
      const cards = shuffle(
        chars.flatMap((c) => [
          { uid: `${c.id}-a`, pairId: c.id, name: c.name, image: c.image },
          { uid: `${c.id}-b`, pairId: c.id, name: c.name, image: c.image },
        ])
      )

      setMemoryCards(cards)
      setPhase('memory')
    } catch (e) {
      setError(e.message || 'No se pudo cargar el juego de memoria.')
      setPhase('intro')
    } finally {
      setLoading(false)
    }
  }, [])

  const startWorkout = (card) => {
    setCategory({ id: card.category, name: card.title })
    if (card.mode === 'memory') {
      startMemoryGame()
      return
    }
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

  const handleMemoryCardClick = (card) => {
    if (loading || memoryWon) return
    if (memoryFlipped.length >= 2) return
    if (memoryFlipped.includes(card.uid) || memoryMatched.includes(card.uid)) return

    const nextFlipped = [...memoryFlipped, card.uid]
    setMemoryFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1)
      const [firstId, secondId] = nextFlipped
      const first = memoryCards.find((c) => c.uid === firstId)
      const second = memoryCards.find((c) => c.uid === secondId)

      if (first && second && first.pairId === second.pairId) {
        const nextMatched = [...memoryMatched, first.uid, second.uid]
        setMemoryMatched(nextMatched)
        setMemoryFlipped([])

        if (nextMatched.length === memoryCards.length) {
          setMemoryWon(true)
        }
      } else {
        setTimeout(() => {
          setMemoryFlipped([])
        }, 700)
      }
    }
  }

  const q = questions[current]
  const resultTitle =
    score >= questions.length * 0.8
      ? { text: 'Excelente', icon: FiAward }
      : score >= questions.length * 0.5
      ? { text: 'Bien hecho', icon: FiThumbsUp }
      : { text: 'Sigue adelante', icon: FiTrendingUp }

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <NeuronAvatar variant="gym" size={42} />
          <h1 className="text-base font-bold text-secondary">A crear nuevas neuronas!</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <FiBell className="w-5 h-5" />
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
                    <card.icon className="w-5 h-5 text-on-secondary-container" />
                  </div>
                  <FiFileText className="w-6 h-6 text-on-surface-variant" />
                </div>
                <p className="font-semibold text-on-surface mb-1">{card.title}</p>
                <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{card.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: card.tagBg, color: 'var(--color-on-surface-variant)' }}>{card.tag}</span>
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
                  <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
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
      {phase === 'memory' && (
        <div className="flex-1 px-4 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setPhase('intro')} className="text-on-surface-variant">
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <p className="text-xs font-semibold text-on-surface-variant">Palacio de Memoria</p>
              <h2 className="text-base font-bold text-on-surface">Encuentra los pares</h2>
            </div>
            <button
              onClick={startMemoryGame}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>

          <div className="mb-4 bg-white border border-outline-variant rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Movimientos: <strong className="text-on-surface">{memoryMoves}</strong></span>
            <span className="text-sm text-on-surface-variant">Pares: <strong className="text-on-surface">{memoryMatched.length / 2}/{memoryCards.length / 2}</strong></span>
          </div>

          {loading ? (
            <div className="flex justify-center mt-8">
              <div className="w-8 h-8 border-4 border-primary-container border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {memoryCards.map((card) => {
                const isOpen = memoryFlipped.includes(card.uid) || memoryMatched.includes(card.uid)
                return (
                  <button
                    key={card.uid}
                    onClick={() => handleMemoryCardClick(card)}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden border border-outline-variant shadow-sm active:scale-95 transition-transform"
                    disabled={isOpen || memoryFlipped.length >= 2}
                  >
                    {isOpen ? (
                      <div className="absolute inset-0">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-1">
                          <p className="text-[10px] font-semibold text-white truncate">{card.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-tertiary-container flex flex-col items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white/85 text-on-primary-container flex items-center justify-center mb-2">
                          <FiMap className="w-5 h-5" />
                        </div>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {memoryWon && (
            <div className="mt-5 bg-primary-container border border-outline-variant rounded-2xl p-4 text-center animate-slide-up">
              <p className="text-lg font-bold text-on-primary-container">¡Memoria completada!</p>
              <p className="text-sm text-on-primary-container/90 mt-1">Terminaste en {memoryMoves} movimientos.</p>
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
              <FiChevronLeft className="w-6 h-6" />
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
              {current + 1 >= questions.length ? 'Ver resultados' : 'Siguiente pregunta'}
            </button>
          )}
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === 'results' && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 animate-slide-up">
          <NeuronAvatar variant="gym" size={100} />
          <h2 className="text-2xl font-bold text-on-surface mt-6 mb-2 flex items-center gap-2">
            <resultTitle.icon className="w-7 h-7 text-primary" />
            <span>¡{resultTitle.text}!</span>
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
