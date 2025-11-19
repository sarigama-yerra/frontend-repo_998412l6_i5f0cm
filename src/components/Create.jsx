import { useState } from 'react'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_BACKEND_URL

export default function Create() {
  const [tab, setTab] = useState('ai')
  const [topic, setTopic] = useState('')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const token = localStorage.getItem('token')

  const createManual = async () => {
    setLoading(true)
    setMsg('')
    const r = await fetch(`${API}/api/decks`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, description: desc }) })
    const data = await r.json()
    setLoading(false)
    if (r.ok) {
      setMsg('Deck created successfully')
    } else {
      setMsg(data.detail || 'Failed')
    }
  }

  const createAI = async () => {
    setLoading(true)
    setMsg('Brewing your cards…')
    const r = await fetch(`${API}/api/generate/topic`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ topic, deckName: name || undefined }) })
    const data = await r.json()
    setLoading(false)
    if (r.ok) {
      setMsg(`Created ${data.created} cards`) 
    } else {
      setMsg(data.detail || 'Failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
        <div className="flex gap-2 mb-4">
          <button className={`px-4 py-2 rounded-lg ${tab==='ai'?'bg-blue-500 text-white':'bg-slate-900/60 text-blue-200'}`} onClick={()=>setTab('ai')}>Generate with AI</button>
          <button className={`px-4 py-2 rounded-lg ${tab==='manual'?'bg-blue-500 text-white':'bg-slate-900/60 text-blue-200'}`} onClick={()=>setTab('manual')}>Create Manually</button>
        </div>

        {tab==='ai' ? (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="grid gap-3">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Deck name (optional)" className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-white" />
              <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic e.g. React Hooks" className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-white" />
              <button disabled={loading} onClick={createAI} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg px-4 py-2">{loading? 'Brewing your cards…':'Generate'}</button>
              {msg && <div className="text-blue-200 text-sm">{msg}</div>}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="grid gap-3">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Deck name" className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-white" />
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-white"></textarea>
              <button disabled={loading} onClick={createManual} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg px-4 py-2">{loading? 'Please wait…':'Create Deck'}</button>
              {msg && <div className="text-blue-200 text-sm">{msg}</div>}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
