import { useState } from 'react'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_BACKEND_URL

function joinDetails(detail) {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map(d => d.msg || d.message || JSON.stringify(d)).join(', ')
  if (detail && typeof detail === 'object') {
    // Common FastAPI/Pydantic error shape or nested messages
    if (detail.msg) return detail.msg
    if (detail.message) return detail.message
    return JSON.stringify(detail)
  }
  return ''
}

async function extractErrorMessage(res) {
  try {
    const text = await res.text()
    try {
      const data = JSON.parse(text)
      const fromDetail = joinDetails(data.detail)
      if (fromDetail) return fromDetail
      if (data.error) return joinDetails(data.error)
      if (data.message) return joinDetails(data.message)
      return text || res.statusText || 'Request failed'
    } catch {
      return text || res.statusText || 'Request failed'
    }
  } catch {
    return res.statusText || 'Request failed'
  }
}

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (!API) throw new Error('App is not configured. Missing backend URL.')

      if (mode === 'signup') {
        const r = await fetch(`${API}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        if (!r.ok) {
          const msg = await extractErrorMessage(r)
          throw new Error(msg || 'Sign up failed')
        }
      }
      const body = new URLSearchParams()
      body.append('username', email)
      body.append('password', password)
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data ? (joinDetails(data.detail) || data.message || '') : ''
        throw new Error(msg || 'Login failed')
      }
      if (!data || !data.access_token) throw new Error('Invalid response from server')
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user_email', email)
      window.location.href = '/'
    } catch (e) {
      const message = e?.message || 'Something went wrong'
      // Avoid showing "[object Object]"
      setError(typeof message === 'string' ? message : JSON.stringify(message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full max-w-md bg-slate-800/60 border border-white/10 rounded-2xl p-6">
        <h1 className="text-white text-2xl font-semibold mb-6">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        {error && <div className="mb-4 text-red-300 text-sm" role="alert">{error}</div>}
        <form onSubmit={submit} className="grid gap-4">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-blue-500" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 ring-blue-500" required />
          <button disabled={loading} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg py-3">{loading ? 'Please wait…' : (mode === 'login' ? 'Log in' : 'Sign up')}</button>
        </form>
        <div className="mt-4 text-sm text-blue-200">
          {mode === 'login' ? (
            <button className="underline" onClick={()=>setMode('signup')}>Need an account? Sign up</button>
          ) : (
            <button className="underline" onClick={()=>setMode('login')}>Have an account? Log in</button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
