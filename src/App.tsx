import { Github, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutContext';
import './styles/accessibility.css';

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );
  const loc = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Fixed Header */}
      <header
        className="border-b border-zinc-200 dark:border-zinc-800 fixed top-0 left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur z-10"
        role="banner"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="font-semibold tracking-tight"
            aria-label="AI Data Flow Architect - Home"
          >
            AI – Data Flow Architect
          </Link>
          <nav
            className="text-sm flex items-center gap-4"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className={`${linkCls(loc.pathname === '/')} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              aria-current={loc.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              to="/studio"
              className={`${linkCls(loc.pathname.startsWith('/studio'))} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              aria-current={
                loc.pathname.startsWith('/studio') ? 'page' : undefined
              }
            >
              Studio
            </Link>
            <a
              href="https://github.com/tejassavaliya/ai-dataflow-architect"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code on GitHub"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Github
                size={18}
                aria-hidden="true"
                className="text-zinc-600 dark:text-zinc-400"
              />
            </a>
            <button
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {theme === 'dark' ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content with proper spacing for fixed header and footer */}
      <main id="main-content" className="flex-1 pt-16 pb-16" role="main">
        <LayoutProvider>
          <Outlet />
        </LayoutProvider>
      </main>

      {/* Fixed Footer */}
      <footer
        className="border-t border-zinc-200 dark:border-zinc-800 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur fixed bottom-0 left-0 right-0 z-10"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs text-zinc-500">
            Built with React + TS + Tailwind. AI: Gemini via Genkit.
          </p>
        </div>
      </footer>
    </div>
  );
}

function linkCls(active: boolean) {
  return (
    'px-2 py-1 rounded-md ' +
    (active
      ? 'bg-zinc-100 dark:bg-zinc-900'
      : 'hover:bg-zinc-100 dark:hover:bg-zinc-900')
  );
}
