import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API = import.meta.env.VITE_BACKEND_URL

export default function Study() {
  const { deckId } = useParams()
  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [idx, setIdx] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [done, setDone] = useState(false)
  const startTime = useRef(Date.now())
  const [results, setResults] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API}/api/study/${deckId}/start`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json()).then(data => { setDeck(data.deck); setCards(data.cards)})
  }, [deckId])

  const current = cards[idx]

  const answer = (know) => {
    setResults(r => [...r, { cardId: current.id, correct: !!know }])
    setShowBack(false)
    if (idx + 1 >= cards.length) {
      setDone(true)
    } else {
      setIdx(idx + 1)
    }
  }

  const finish = async () => {
    const token = localStorage.getItem('token')
    const durationSec = Math.round((Date.now() - startTime.current) / 1000)
    const r = await fetch(`${API}/api/study/${deckId}/finish`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ durationSec, results })})
    const data = await r.json()
    setSummary(data)
  }

  const [summary, setSummary] = useState(null)

  useEffect(() => { if (done) finish() }, [done])

  if (!deck) return <div className="max-w-3xl mx-auto p-6 text-blue-200">Loading…</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-white text-2xl font-semibold mb-4">{deck.name}</h1>
      <div className="relative h-64">
        <AnimatePresence mode="wait">
          {current && !done && (
            <motion.div key={current.id + (showBack?'b':'a')} initial={{opacity:0, rotateY: showBack? 180:0}} animate={{opacity:1, rotateY: showBack? 180:0}} exit={{opacity:0}} transition={{duration:0.4}} className="absolute inset-0 [transform-style:preserve-3d]">
              <div onClick={()=>setShowBack(!showBack)} className="absolute inset-0 bg-slate-800/60 border border-white/10 rounded-xl p-6 text-white backface-hidden flex items-center justify-center text-center cursor-pointer">{current.question}</div>
              <div onClick={()=>setShowBack(!showBack)} className="absolute inset-0 bg-slate-900/70 border border-white/10 rounded-xl p-6 text-white rotate-y-180 backface-hidden flex items-center justify-center text-center cursor-pointer">{current.answer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <div className="mt-4 flex items-center gap-3">
          <button onClick={()=>answer(false)} className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2">I Don't Know</button>
          <button onClick={()=>answer(true)} className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2">I Know</button>
        </div>
      )}

      {done && (
        <div className="mt-6 bg-slate-800/60 border border-white/10 rounded-xl p-4 text-blue-100">
          <div className="text-white font-semibold">Session Summary</div>
          {summary ? (
            <div className="text-sm">Accuracy: {summary.accuracy?.toFixed?.(1)}% • Questions: {summary.total}</div>
          ) : (
            <div className="text-sm">Saving your progress…</div>
          )}
        </div>
      )}
    </div>
  )
}
