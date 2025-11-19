import { Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Decks from './components/Decks'
import Create from './components/Create'
import Study from './components/Study'
import Settings from './components/Settings'
import Auth from './components/Auth'

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Navbar/>
      {children}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth/>} />
      <Route path="/" element={<Shell><Hero/><Dashboard/></Shell>} />
      <Route path="/decks" element={<Shell><Decks/></Shell>} />
      <Route path="/create" element={<Shell><Create/></Shell>} />
      <Route path="/study/:deckId" element={<Shell><Study/></Shell>} />
      <Route path="/settings" element={<Shell><Settings/></Shell>} />
    </Routes>
  )
}

export default App
