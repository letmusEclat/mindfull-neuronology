import { useState } from 'react'
import { useUser } from '../context/UserContext'
import NeuronAvatar from '../components/NeuronAvatar'
import SpeechBubble from '../components/SpeechBubble'

export default function Auth() {
  const { login, register } = useUser()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ username: '', email: '', password: '', objective: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form.username, form.email, form.password, form.objective)
      }
    } catch (err) {
      setError(err.response?.data?.detail ?? err.response?.data?.username?.[0] ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-surface">
      <SpeechBubble message="Welcome! Your brain is ready for its daily workout. Let's get started." className="mb-6 w-full max-w-xs" />
      <NeuronAvatar variant="breathe" size={100} />

      <h1 className="text-2xl font-bold text-on-surface mt-6 mb-1">Mindful Neuron</h1>
      <p className="text-xs text-on-surface-variant mb-6 text-center">Neuroplasticity awareness, one habit at a time</p>

      <form onSubmit={handle} className="w-full max-w-xs flex flex-col gap-3">
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          required
          className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white"
        />
        {mode === 'register' && (
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            type="email"
            required
            className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white"
          />
        )}
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          type="password"
          required
          minLength={8}
          className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white"
        />
        {mode === 'register' && (
          <input
            value={form.objective}
            onChange={(e) => setForm({ ...form, objective: e.target.value })}
            placeholder="Your focus objective (optional)"
            className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white"
          />
        )}

        {error && <p className="text-error text-xs text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-semibold py-3.5 rounded-full text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 mt-1"
        >
          {loading ? 'Loading…' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="mt-4 text-sm text-primary font-semibold hover:underline"
      >
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>

      {/* Demo bypass */}
      <button
        onClick={() => {
          localStorage.setItem('access', 'demo')
          window.location.reload()
        }}
        className="mt-2 text-xs text-on-surface-variant hover:underline"
      >
        Explore without account (demo mode)
      </button>
    </div>
  )
}
