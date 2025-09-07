import { ExternalLink, Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60"
      role="contentinfo"
    >
      <div className="px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <span>&copy; {currentYear}</span>
            <span>•</span>
            <span>Built with</span>
            <Heart
              size={12}
              className="text-red-500 fill-current"
              aria-hidden="true"
            />
            <span>by</span>
            <a
              href="https://github.com/tejassavaliya"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
            >
              Tejas Savaliya
            </a>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/tejassavaliya/ai-dataflow-architect"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1"
                aria-label="View source code on GitHub"
              >
                <Github size={16} aria-hidden="true" />
                <span>View Source</span>
                <span
                  className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                  aria-hidden="true"
                ></span>
                <ExternalLink
                  size={12}
                  aria-hidden="true"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
