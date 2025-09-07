import { Github, Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UI_TEXT } from '../constants/text';

interface HeaderProps {
  theme: string;
  onThemeToggle: () => void;
}

export default function Header({ theme, onThemeToggle }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkClass = (active: boolean) =>
    `relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
      active
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
        : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
    }`;

  const mobileLinkClass = (active: boolean) =>
    `block px-4 py-3 text-base font-medium transition-all duration-200 border-l-4 ${
      active
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500'
        : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-transparent'
    }`;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60"
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
              aria-label={`${UI_TEXT.APP_NAME} - Home`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
                <Sparkles size={18} className="text-white" aria-hidden="true" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                  {UI_TEXT.APP_NAME}
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-1">
                  {UI_TEXT.APP_TAGLINE}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-1"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className={linkClass(isActive('/'))}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            <Link
              to="/studio"
              className={linkClass(isActive('/studio'))}
              aria-current={isActive('/studio') ? 'page' : undefined}
            >
              Studio
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {theme === 'dark' ? (
                <Sun
                  size={18}
                  aria-hidden="true"
                  className="text-zinc-600 dark:text-zinc-400"
                />
              ) : (
                <Moon
                  size={18}
                  aria-hidden="true"
                  className="text-zinc-600 dark:text-zinc-400"
                />
              )}
            </button>
            <a
              href="https://github.com/tejassavaliya/ai-dataflow-architect"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code on GitHub"
              className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Github
                size={18}
                aria-hidden="true"
                className="text-zinc-600 dark:text-zinc-400"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun
                  size={18}
                  aria-hidden="true"
                  className="text-zinc-600 dark:text-zinc-400"
                />
              ) : (
                <Moon
                  size={18}
                  aria-hidden="true"
                  className="text-zinc-600 dark:text-zinc-400"
                />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isMobileMenuOpen ? (
                <X
                  size={20}
                  aria-hidden="true"
                  className="text-zinc-600 dark:text-zinc-400"
                />
              ) : (
                <Menu
                  size={20}
                  aria-hidden="true"
                  className="text-zinc-600 dark:text-zinc-400"
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <nav
              className="py-2"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <Link
                to="/"
                className={mobileLinkClass(isActive('/'))}
                aria-current={isActive('/') ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/studio"
                className={mobileLinkClass(isActive('/studio'))}
                aria-current={isActive('/studio') ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Studio
              </Link>
              <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                <a
                  href="https://github.com/tejassavaliya/ai-dataflow-architect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Github size={18} aria-hidden="true" />
                  <span className="text-sm font-medium">View on GitHub</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
