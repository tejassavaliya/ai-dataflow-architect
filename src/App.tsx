import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutContext';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/accessibility.css';

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header theme={theme} onThemeToggle={handleThemeToggle} />

      {/* Main Content */}
      <main id="main-content" className="flex-1 pb-16" role="main">
        <LayoutProvider>
          <Outlet />
        </LayoutProvider>
      </main>

      <Footer />
    </div>
  );
}

