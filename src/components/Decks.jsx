import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API = import.meta.env.VITE_BACKEND_URL

export default function Decks() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')

  const load = async () => {
    const token = localStorage.getItem('token')
    const r = await fetch(`${API}/api/decks?q=${encodeURIComponent(q)}`, { headers: { Authorization: `Bearer ${token}` }})
    const data = await r.json()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search decks…" className="bg-slate-800/60 border border-white/10 rounded-lg px-4 py-2 text-white" />
        <button onClick={load} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2">Search</button>
      </div>
      <AnimatePresence mode="popLayout">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(d => (
            <motion.div key={d.id} layout initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
              <div className="text-white font-semibold">{d.name}</div>
              <div className="text-sm text-blue-200">{d.totalCards} cards</div>
              <Link to={`/study/${d.id}`} className="inline-block mt-3 text-blue-300 hover:text-white text-sm">Study</Link>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}
