import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Settings() {
  const [dailyGoal, setDailyGoal] = useState(20)
  const [theme, setTheme] = useState('light')
  const [geminiKey, setGeminiKey] = useState('')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API}/api/settings`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(data => {
        setDailyGoal(data.dailyGoal)
        setTheme(data.theme)
        setSaved(data.hasGeminiKey ? 'Gemini key is set' : '')
      })
  }, [])

  const save = async () => {
    const token = localStorage.getItem('token')
    const r = await fetch(`${API}/api/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ dailyGoal: Number(dailyGoal), theme, geminiApiKey: geminiKey || undefined }) })
    if (r.ok) setSaved('Settings saved')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-5 text-blue-100">
        <div className="text-white font-semibold text-lg mb-4">Settings</div>
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span>Daily Study Goal</span>
            <input type="number" min={1} value={dailyGoal} onChange={e=>setDailyGoal(e.target.value)} className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white w-40" />
          </label>
          <label className="grid gap-2">
            <span>Theme</span>
            <select value={theme} onChange={e=>setTheme(e.target.value)} className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white w-40">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span>Gemini API Key</span>
            <input value={geminiKey} onChange={e=>setGeminiKey(e.target.value)} placeholder="Paste your key" className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-white" />
            <span className="text-xs text-blue-300">{saved}</span>
          </label>
          <button onClick={save} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 w-32">Save</button>
        </div>
      </div>
    </div>
  )
}
