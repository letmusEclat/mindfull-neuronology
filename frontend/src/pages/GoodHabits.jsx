import { useState, useEffect, useCallback } from 'react'
import NeuronAvatar from '../components/NeuronAvatar'
import SpeechBubble from '../components/SpeechBubble'
import HeatmapGrid from '../components/HeatmapGrid'
import client from '../api/client'

const DEFAULT_HABITS = [
  { id: -1, name: 'Nutrición Equilibrada', description: 'Come verduras verdes', category: 'nutrition', emoji: '🍽️', icon_color: '#facd3b', completed: false },
  { id: -2, name: 'Movimiento Diario',     description: '30 min caminando',     category: 'exercise',  emoji: '🏃', icon_color: '#feb072', completed: false },
  { id: -3, name: 'Lectura Consciente',    description: 'Lee 20 páginas',        category: 'growth',    emoji: '📖', icon_color: '#b2e251', completed: false },
]

const BUBBLE_MSGS = [
  '¡La constancia es clave para crecer! Sigue nutriendo esas vías neuronales.',
  'Pequeños hábitos, grandes ganancias cerebrales. ¡Cada marca cuenta!',
  'Construye la rutina — tus neuronas te están apoyando.',
]

const CATEGORY_LABELS = {
  nutrition: { label: 'Nutrición', color: '#facd3b', bg: '#fffbe6' },
  exercise:  { label: 'Ejercicio',  color: '#feb072', bg: '#fff3e6' },
  growth:    { label: 'Crecimiento', color: '#b2e251', bg: '#f2fce6' },
}

export default function GoodHabits() {
  const [habits, setHabits] = useState(DEFAULT_HABITS)
  const [heatmap, setHeatmap] = useState([])
  const [loading, setLoading] = useState(false)
  const [bubbleIdx] = useState(Math.floor(Math.random() * BUBBLE_MSGS.length))
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', description: '', category: 'nutrition' })
  const [saving, setSaving] = useState(false)

  const loadTodayHabits = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await client.get('/habits/today/')
      if (data.length > 0) setHabits(data)
    } catch {
      /* show defaults */
    } finally {
      setLoading(false)
    }
  }, [])

  const loadHeatmap = useCallback(async () => {
    try {
      const { data } = await client.get('/habits/heatmap/')
      setHeatmap(data)
    } catch {
      // Generate mock heatmap for demo
      const mock = []
      for (let i = 0; i < 56; i++) {
        mock.push({ date: '', count: Math.floor(Math.random() * 4), total: 3 })
      }
      setHeatmap(mock)
    }
  }, [])

  useEffect(() => {
    loadTodayHabits()
    loadHeatmap()
  }, [loadTodayHabits, loadHeatmap])

  const toggleHabit = async (habit) => {
    const newCompleted = !habit.completed
    setHabits((prev) => prev.map((h) => h.habit_id === habit.habit_id || h.id === habit.id ? { ...h, completed: newCompleted } : h))
    if (habit.habit_id > 0 || habit.id > 0) {
      try {
        await client.post('/habits/today/', { habit_id: habit.habit_id ?? habit.id, completed: newCompleted })
        // Sync pixel to Pixela if a habit gets completed
        if (newCompleted) {
          client.post('/pixela/pixel/', { quantity: '1' }).catch(() => {})
        }
      } catch { /* offline */ }
    }
  }

  const addHabit = async () => {
    if (!newHabit.name.trim()) return
    setSaving(true)
    try {
      const { data } = await client.post('/habits/', { ...newHabit, emoji: '✨' })
      setHabits((prev) => [...prev, { ...data, completed: false }])
      setNewHabit({ name: '', description: '', category: 'nutrition' })
      setShowAddForm(false)
    } catch {
      // add locally
      const local = { ...newHabit, id: Date.now(), emoji: '✨', completed: false }
      setHabits((prev) => [...prev, local])
      setShowAddForm(false)
    } finally {
      setSaving(false)
    }
  }

  const completedCount = habits.filter((h) => h.completed).length
  const goalPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <NeuronAvatar variant="habits" size={42} />
          <h1 className="text-base font-bold text-secondary">Hola, Explorador Neuronal</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <div className="flex-1 px-4 overflow-y-auto animate-slide-up">
        {/* Motivation card */}
        <div className="bg-white rounded-2xl p-4 flex items-center gap-4 mb-5 shadow-sm border border-outline-variant">
          <NeuronAvatar variant="habits" size={64} animated={false} />
          <div>
            <p className="font-bold text-on-surface text-sm">¡La constancia es clave para crecer!</p>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">Sigue nutriendo esas vías neuronales.</p>
          </div>
        </div>

        {/* Neural Garden (Pixela heatmap) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-on-surface text-sm">Jardín Neural</h2>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <span>Menos</span>
              {['#fce8d8', '#e8b89a', '#c88860', '#a06030', '#7a3c10'].map((c) => (
                <div key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
              ))}
              <span>Más</span>
            </div>
          </div>
          {heatmap.length > 0 ? (
            <HeatmapGrid data={heatmap} />
          ) : (
            <div className="h-20 flex items-center justify-center text-on-surface-variant text-xs">Cargando jardín…</div>
          )}
        </div>

        {/* Daily Goal summary */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-on-surface text-sm">Meta diaria</p>
            <p className="text-xs text-on-surface-variant">{completedCount} de {habits.length} hábitos completados</p>
          </div>
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#eee1ce" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="#4a6800" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${goalPercent * 0.88} 88`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">{goalPercent}%</span>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-on-surface text-sm">Enfoque de hoy</h2>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="text-xs font-semibold text-primary border border-primary px-3 py-1 rounded-full hover:bg-primary-container transition-colors"
          >
            {showAddForm ? 'Cancelar' : '+ Agregar'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl p-4 border border-outline-variant shadow-sm mb-3 animate-slide-up">
            <input
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="Nombre del hábito"
              className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:border-primary"
            />
            <input
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              placeholder="Descripción (opcional)"
              className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:border-primary"
            />
            <select
              value={newHabit.category}
              onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
              className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary"
            >
              <option value="nutrition">Nutrición</option>
              <option value="exercise">Ejercicio</option>
              <option value="growth">Crecimiento</option>
            </select>
            <button
              onClick={addHabit}
              disabled={saving}
              className="w-full bg-primary text-on-primary font-semibold py-2.5 rounded-full text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Agregar hábito'}
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary-container border-t-primary rounded-full animate-spin" />
          </div>
        )}

        <div className="flex flex-col gap-2 pb-2">
          {habits.map((habit) => {
            const cat = CATEGORY_LABELS[habit.category] || CATEGORY_LABELS.growth
            return (
              <div
                key={habit.id ?? habit.habit_id}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm border border-outline-variant"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: cat.bg }}
                >
                  {habit.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm truncate">{habit.name}</p>
                  {habit.description && (
                    <p className="text-xs text-on-surface-variant truncate">{habit.description}</p>
                  )}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block"
                    style={{ background: cat.bg, color: cat.color }}>
                    {cat.label}
                  </span>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggleHabit(habit)}
                  className={`relative w-12 h-6 rounded-full flex-shrink-0 transition-colors duration-300 ${
                    habit.completed ? 'bg-primary' : 'bg-surface-variant'
                  }`}
                  aria-label={habit.completed ? 'Marcar incompleto' : 'Marcar completo'}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                      habit.completed ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
