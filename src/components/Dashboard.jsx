import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_BACKEND_URL

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch(`${API}/api/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="h-40 bg-slate-800/40 rounded-xl animate-pulse"/>
      </div>
    )
  }

  const progress = Math.min(100, Math.round((stats.todayReviewed || 0) / (stats.dailyGoal || 20) * 100))

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 rounded-xl p-6 border border-white/10">
          <div className="text-blue-200 text-sm">Total Decks</div>
          <div className="text-3xl font-bold text-white">{stats.totalDecks}</div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-6 border border-white/10">
          <div className="text-blue-200 text-sm">Total Cards</div>
          <div className="text-3xl font-bold text-white">{stats.totalCards}</div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-6 border border-white/10">
          <div className="text-blue-200 text-sm">Total Study Time</div>
          <div className="text-3xl font-bold text-white">{Math.round(stats.totalStudyTime/60)} min</div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 rounded-xl p-6 border border-white/10 flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-blue-900/40" strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="45" className="stroke-blue-500" strokeWidth="10" fill="none" strokeDasharray={`${progress * 2.83} 283`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">{progress}%</div>
          </div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Recently Studied</h3>
            <Link to="/create" className="text-blue-300 hover:text-white text-sm">Create New Deck</Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {(stats.recentDecks||[]).map(d => (
              <Link key={d.id} to={`/study/${d.id}`} className="bg-slate-900/60 border border-white/10 rounded-lg p-3 text-blue-100 hover:bg-slate-900">
                <div className="font-medium text-white">{d.name}</div>
                <div className="text-xs text-blue-300">Last studied: {d.lastStudied ? new Date(d.lastStudied).toLocaleString() : '—'}</div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
