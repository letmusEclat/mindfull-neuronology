import { useState, useEffect } from 'react'
import NeuronAvatar from '../components/NeuronAvatar'
import client from '../api/client'
import { useUser } from '../context/UserContext'

const LEVEL_NAMES = {
  1: 'Sinapsis Naciente',
  2: 'Semilla Neuronal',
  3: 'Brote Sináptico',
  4: 'Tejedor de Dendritas',
  5: 'Pionero Axonal',
}

const MENU_ITEMS = [
  {
    section: 'CUENTA Y PREFERENCIAS',
    items: [
      { icon: '👤', title: 'Información Personal', desc: 'Actualiza tus datos' },
      { icon: '🔔', title: 'Notificaciones', desc: 'Recordatorios y actualizaciones' },
      { icon: '🎯', title: 'Metas Diarias', desc: 'Ajusta tus objetivos neuronales' },
    ],
  },
  {
    section: 'SOPORTE Y ACERCA DE',
    items: [
      { icon: '❓', title: 'Centro de Ayuda', desc: null },
    ],
  },
]

export default function Profile() {
  const { profile, logout, refreshProfile } = useUser()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    bio: '',
    objective: '',
    pixela_username: '',
    pixela_token: '',
    pixela_graph_id: '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio ?? '',
        objective: profile.objective ?? '',
        pixela_username: profile.pixela_username ?? '',
        pixela_token: profile.pixela_token ?? '',
        pixela_graph_id: profile.pixela_graph_id ?? 'mindful-neuron',
      })
    }
  }, [profile])

  const save = async () => {
    setSaving(true)
    try {
      await client.patch('/profile/', form)
      await refreshProfile()
      setMsg('¡Perfil actualizado!')
      setEditing(false)
    } catch {
      setMsg('Error al guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const currentProfile = profile ?? {
    username: 'Explorador Neuronal',
    bio: 'Estudiante dedicado de neuroplasticidad',
    objective: 'Construir hábitos diarios conscientes',
    sessions_completed: 0,
    time_invested: 0,
    level: 1,
    level_name: 'Nascent Synapse',
  }

  const levelName = currentProfile.level_name ?? LEVEL_NAMES[currentProfile.level] ?? 'Neural Explorer'

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 pb-3">
        <h1 className="text-base font-bold text-secondary">Perfil</h1>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <div className="flex-1 px-4 overflow-y-auto animate-slide-up">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative">
            <NeuronAvatar variant="profile" size={90} />
            <button
              onClick={() => setEditing(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-on-surface rounded-full flex items-center justify-center border-2 border-surface"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="white" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <h2 className="text-lg font-bold text-on-surface mt-3">{currentProfile.username}</h2>
          <p className="text-xs text-on-surface-variant">{currentProfile.bio}</p>

          {/* Objective */}
          {currentProfile.objective && (
            <div className="mt-3 px-4 py-2.5 rounded-xl text-center" style={{ background: 'var(--color-objective-bg)', border: '1px solid var(--color-tertiary-container)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-on-tertiary-container)' }}>
                Objetivo de enfoque: {currentProfile.objective}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 text-center border border-outline-variant shadow-sm">
            <div className="flex justify-center mb-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-secondary" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-on-surface">{currentProfile.sessions_completed}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Sesiones completadas</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-outline-variant shadow-sm">
            <div className="flex justify-center mb-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-secondary" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 20V10m-6 10V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-on-surface">{currentProfile.time_invested}h</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Tiempo invertido</p>
          </div>
        </div>

        {/* Level card */}
        <div className="bg-secondary-container rounded-2xl p-4 flex items-center justify-between mb-5 relative overflow-hidden">
          <div>
            <p className="text-xs font-semibold text-on-secondary-container opacity-70">Nivel actual</p>
            <p className="font-bold text-on-secondary-container text-base">{levelName}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center bg-white/40">
            <span className="font-bold text-secondary text-sm">L{currentProfile.level}</span>
          </div>
          {/* Decorative blob */}
          <svg viewBox="0 0 100 80" className="absolute right-16 opacity-10 w-24" fill="currentColor">
            <path d="M80 40 C80 62 62 80 40 80 C18 80 0 62 0 40 C0 18 18 0 40 0 C62 0 80 18 80 40Z" />
          </svg>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-white rounded-2xl p-4 border border-outline-variant shadow-sm mb-4 animate-slide-up">
            <h3 className="font-semibold text-on-surface mb-3 text-sm">Editar perfil</h3>
            <label className="text-xs text-on-surface-variant font-medium">Bio</label>
            <input
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-3 mt-1 focus:outline-none focus:border-primary"
            />
            <label className="text-xs text-on-surface-variant font-medium">Objetivo de enfoque</label>
            <textarea
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              rows={2}
              className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-3 mt-1 focus:outline-none focus:border-primary resize-none"
            />
            <div className="border-t border-outline-variant pt-3 mb-3">
              <p className="text-xs font-semibold text-on-surface-variant mb-2">Integración Pixela (Jardín Neural)</p>
              <input
                value={form.pixela_username}
                onChange={(e) => setForm({ ...form, pixela_username: e.target.value })}
                placeholder="Usuario de Pixela"
                className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:border-primary"
              />
              <input
                value={form.pixela_token}
                type="password"
                onChange={(e) => setForm({ ...form, pixela_token: e.target.value })}
                placeholder="Token de Pixela (almacenado de forma segura)"
                className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:border-primary"
              />
              <input
                value={form.pixela_graph_id}
                onChange={(e) => setForm({ ...form, pixela_graph_id: e.target.value })}
                placeholder="ID del gráfico (ej. mindful-neuron)"
                className="w-full border border-outline-variant rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="flex-1 border border-outline text-on-surface-variant font-semibold py-2.5 rounded-full text-sm">
                Cancelar
              </button>
              <button onClick={save} disabled={saving} className="flex-1 bg-primary text-on-primary font-semibold py-2.5 rounded-full text-sm hover:opacity-90 disabled:opacity-60">
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        )}

        {msg && (
          <div className="text-center text-sm font-medium text-primary mb-3 animate-slide-up">{msg}</div>
        )}

        {/* Settings Menu */}
        {MENU_ITEMS.map((section) => (
          <div key={section.section} className="mb-4">
            <p className="text-[10px] font-bold text-on-surface-variant tracking-widest mb-2 px-1">{section.section}</p>
            <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.title}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-container transition-colors ${
                    i > 0 ? 'border-t border-outline-variant' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                    {item.desc && <p className="text-xs text-on-surface-variant">{item.desc}</p>}
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-on-surface-variant" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Log Out */}
        <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden mb-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="var(--color-error)" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-error">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}
