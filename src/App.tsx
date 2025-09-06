import { Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Moon, Sun, PanelLeft, PanelRight } from 'lucide-react'
import { LayoutProvider } from './context/LayoutContext'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const loc = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">Nexla – Data Flow Architect</Link>
          <nav className="text-sm flex items-center gap-4">
            <Link to="/" className={linkCls(loc.pathname === '/')}>Home</Link>
            <Link to="/studio" className={linkCls(loc.pathname.startsWith('/studio'))}>Studio</Link>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
          </nav>
        </div>
      </header>
      
      {/* Main Content with proper spacing for fixed header and footer */}
      <main className="flex-1 pt-16 pb-16">
        <LayoutProvider>
          <Outlet/>
        </LayoutProvider>
      </main>
      
      {/* Fixed Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs text-zinc-500">
            Built with React + TS + Tailwind. AI: Gemini via Genkit.
          </p>
        </div>
      </footer>
    </div>
  )
}

function linkCls(active: boolean) {
  return 'px-2 py-1 rounded-md ' + (active ? 'bg-zinc-100 dark:bg-zinc-900' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900')
}
