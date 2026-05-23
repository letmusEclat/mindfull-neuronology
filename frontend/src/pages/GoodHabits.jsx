import { useState, useEffect, useCallback } from 'react'
import { FiActivity, FiBell, FiBookOpen, FiCoffee, FiStar } from 'react-icons/fi'
import NeuronAvatar from '../components/NeuronAvatar'
import HeatmapGrid from '../components/HeatmapGrid'
import client from '../api/client'

const DEFAULT_HABITS = [
  { id: -1, name: 'Nutrición Equilibrada', description: 'Come verduras verdes', category: 'nutrition', emoji: '🍽️', completed: false },
  { id: -2, name: 'Movimiento Diario', description: '30 min caminando', category: 'exercise', emoji: '🏃', completed: false },
  { id: -3, name: 'Lectura Consciente', description: 'Lee 20 páginas', category: 'growth', emoji: '📖', completed: false },
]

const CATEGORY_LABELS = {
  nutrition: { label: 'Nutrición', color: 'var(--color-habits-nutrition)', bg: 'var(--color-habits-nutrition-bg)' },
  exercise: { label: 'Ejercicio', color: 'var(--color-habits-exercise)', bg: 'var(--color-habits-exercise-bg)' },
  growth: { label: 'Crecimiento', color: 'var(--color-habits-growth)', bg: 'var(--color-habits-growth-bg)' },
}

const CATEGORY_ICONS = {
  nutrition: FiCoffee,
  exercise: FiActivity,
  growth: FiBookOpen,
}

const CATEGORY_EMOJIS = {
  nutrition: '🍽️',
  exercise: '🏃',
  growth: '📖',
}

function getHabitKey(habit) {
  if (habit?.habit_id != null) return `habit-${habit.habit_id}`
  if (habit?.id != null) return `id-${habit.id}`
  return `tmp-${habit?.name ?? 'habit'}`
}

function getPersistedHabitId(habit) {
  const candidate = habit?.habit_id ?? habit?.id
  if (typeof candidate === 'number' && candidate > 0) return candidate
  return null
}

function normalizeHabit(habit) {
  const id = habit?.habit_id ?? habit?.id ?? null
  return {
    ...habit,
    id: habit?.id ?? id,
    habit_id: habit?.habit_id ?? id,
    completed: Boolean(habit?.completed),
  }
}

function countCompletedHabits(items) {
  return items.filter((h) => h.completed).length
}

function getLegendTooltipByLevel(level) {
  if (level <= 0) return '0-2 hábitos cumplidos'
  if (level === 1) return '3-5 hábitos cumplidos'
  if (level === 2) return '6-8 hábitos cumplidos'
  if (level === 3) return '9-11 hábitos cumplidos'
  return '12+ hábitos cumplidos'
}

export default function GoodHabits() {
  const [habits, setHabits] = useState(DEFAULT_HABITS)
  const [heatmap, setHeatmap] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', description: '', category: 'nutrition' })
  const [saving, setSaving] = useState(false)

  const upsertTodayHeatmap = useCallback((completedCount, totalHabits) => {
    const today = new Date().toISOString().slice(0, 10)
    const safeTotal = Math.max(1, Number(totalHabits) || 1)
    const safeCount = Math.max(0, Number(completedCount) || 0)

    setHeatmap((prev) => {
      const next = [...prev]
      const idx = next.findIndex((d) => d.date === today)
      const payload = { date: today, count: safeCount, total: safeTotal }
      if (idx >= 0) next[idx] = { ...next[idx], ...payload }
      else next.push(payload)
      return next
    })
  }, [])

  const loadTodayHabits = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await client.get('/habits/today/')
      if (data.length > 0) {
        const incoming = data.map(normalizeHabit)
        setHabits((prev) => {
          const prevCompleted = new Map(prev.map((h) => [getHabitKey(h), Boolean(h.completed)]))
          return incoming.map((h) => {
            const key = getHabitKey(h)
            const wasCompleted = prevCompleted.get(key) ?? false
            return { ...h, completed: h.completed || wasCompleted }
          })
        })
      }
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
      // Fallback: show only today's cell with zero progress.
      const today = new Date().toISOString().slice(0, 10)
      setHeatmap([{ date: today, count: 0, total: 1 }])
    }
  }, [])

  useEffect(() => {
    loadTodayHabits()
    loadHeatmap()
  }, [loadTodayHabits, loadHeatmap])

  useEffect(() => {
    upsertTodayHeatmap(countCompletedHabits(habits), habits.length)
  }, [habits, upsertTodayHeatmap])

  const toggleHabit = async (habit) => {
    const newCompleted = !habit.completed
    const targetKey = getHabitKey(habit)

    setHabits((prev) => {
      return prev.map((h) => (getHabitKey(h) === targetKey ? { ...h, completed: newCompleted } : h))
    })

    const persistedHabitId = getPersistedHabitId(habit)
    if (persistedHabitId) {
      try {
        await client.post('/habits/today/', { habit_id: persistedHabitId, completed: newCompleted })
        // Keep Pixela day pixel in sync with current completed-habits count.
        client.post('/pixela/pixel/', { quantity: String(nextCompletedCount) }).catch(() => {})
      } catch { /* offline */ }
    }
  }

  const addHabit = async () => {
    if (!newHabit.name.trim()) return
    setSaving(true)
    try {
      const { data } = await client.post('/habits/', {
        ...newHabit,
        emoji: CATEGORY_EMOJIS[newHabit.category] ?? '✨',
      })
      setHabits((prev) => {
        return [...prev, { ...normalizeHabit(data), completed: false }]
      })
      setNewHabit({ name: '', description: '', category: 'nutrition' })
      setShowAddForm(false)
    } catch {
      // add locally
      const local = {
        ...newHabit,
        id: Date.now(),
        emoji: CATEGORY_EMOJIS[newHabit.category] ?? '✨',
        completed: false,
      }
      setHabits((prev) => {
        return [...prev, normalizeHabit(local)]
      })
      setShowAddForm(false)
    } finally {
      setSaving(false)
    }
  }

  const completedCount = habits.filter((h) => h.completed).length
  const goalPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0
  const heatmapLegendColors = [
    'var(--color-heatmap-0)',
    'var(--color-heatmap-1)',
    'var(--color-heatmap-2)',
    'var(--color-heatmap-3)',
    'var(--color-heatmap-4)',
  ]

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <NeuronAvatar variant="habits" size={42} />
          <h1 className="text-base font-bold text-secondary">Hola, Explorador Neuronal</h1>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <FiBell className="w-5 h-5" />
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
              {heatmapLegendColors.map((c, idx) => (
                <div
                  key={c}
                  className="w-3 h-3 rounded-sm"
                  style={{ background: c }}
                  title={getLegendTooltipByLevel(idx)}
                  aria-label={getLegendTooltipByLevel(idx)}
                />
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
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-surface-container-highest)" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="var(--color-primary)" strokeWidth="4"
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
            const HabitIcon = CATEGORY_ICONS[habit.category] || FiStar
            return (
              <div
                key={getHabitKey(habit)}
                className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm border border-outline-variant"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: cat.bg }}
                >
                  <HabitIcon className="w-5 h-5" style={{ color: cat.color }} />
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
