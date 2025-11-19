import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Menu, LogOut, Settings as SettingsIcon, LayoutDashboard, Library, PlusSquare } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('token')
    const e = localStorage.getItem('user_email')
    setEmail(e || '')
    if (!t) {
      navigate('/login')
    }
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_email')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/flame-icon.svg" className="w-8 h-8" alt="Smriti" />
          <span className="font-semibold text-white">Smriti</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-blue-100">
          <Link to="/" className="hover:text-white flex items-center gap-2"><LayoutDashboard size={18}/> Dashboard</Link>
          <Link to="/decks" className="hover:text-white flex items-center gap-2"><Library size={18}/> Decks</Link>
          <Link to="/create" className="hover:text-white flex items-center gap-2"><PlusSquare size={18}/> Create</Link>
          <Link to="/settings" className="hover:text-white flex items-center gap-2"><SettingsIcon size={18}/> Settings</Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-blue-200 text-sm">{email}</div>
          <button onClick={logout} className="hidden md:inline-flex text-red-300 hover:text-red-200 text-sm flex items-center gap-2"><LogOut size={16}/> Logout</button>
          <button onClick={() => setOpen(!open)} className="md:hidden text-blue-100"><Menu/></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/80">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 text-blue-100">
            <Link to="/" onClick={() => setOpen(false)}>Dashboard</Link>
            <Link to="/decks" onClick={() => setOpen(false)}>Decks</Link>
            <Link to="/create" onClick={() => setOpen(false)}>Create</Link>
            <Link to="/settings" onClick={() => setOpen(false)}>Settings</Link>
            <button onClick={logout} className="text-left text-red-300">Logout</button>
          </div>
        </div>
      )}
    </header>
  )
}
