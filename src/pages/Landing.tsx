import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Wand2, Stars } from 'lucide-react'
import { useState } from 'react'

const EXAMPLES = [
  'Connect Shopify to BigQuery',
  'Sync Salesforce contacts to Mailchimp',
  'Stream Stripe payments to Google Sheets',
  'Connect Shopify orders to Snowflake'
]

export default function Landing() {
  const nav = useNavigate()
  const [value, setValue] = useState('')

  function go(prompt: string) {
    nav('/studio', { state: { seed: prompt } })
  }

  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-cyan-500/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-500/20 via-sky-500/10 to-indigo-500/20 blur-3xl animate-pulse" />

      <div className="relative mx-auto max-w-4xl px-4 py-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 shadow-sm backdrop-blur">
          <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs text-zinc-700 dark:text-zinc-300">AI Data Flow Architect</span>
        </div>

        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Conversational Data Integration
          </span>
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Describe your pipeline and watch it become an interactive flow. Natural language in, production‑ready orchestration out.
        </p>

        {/* Prompt card */}
        <div className="mt-10 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/50 shadow-xl shadow-indigo-500/5 backdrop-blur">
          <div className="p-3 sm:p-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Wand2 size={14} />
              <span>Prompt</span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="group relative flex w-full items-center rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/40 px-4 py-3 shadow-sm transition focus-within:ring-2 focus-within:ring-indigo-500/60">
              <Stars size={18} className="mr-3 text-indigo-500/80" />
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') go(value) }}
                placeholder="e.g., Connect Shopify orders to Snowflake"
                className="flex-1 bg-transparent outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-zinc-100"
                aria-label="Enter your pipeline prompt"
              />
              <button
                onClick={() => go(value)}
                className="ml-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 px-4 py-2 text-white shadow-md transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 hover:brightness-110"
              >
                Build
                <ArrowRight size={16} className="opacity-90" />
              </button>
            </div>

            {/* Example options */}
            <div className="mt-5">
              <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Try one</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => go(ex)}
                    className="relative inline-flex w-full items-center justify-start rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/40 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                    aria-label={`Use example: ${ex}`}
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-fuchsia-500/0 to-cyan-500/0 opacity-0 transition-opacity hover:opacity-20" />
                    <span className="relative truncate">{ex}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subtle footer CTA */}
        <div className="mt-8 text-xs text-zinc-500">
          Press Enter to build, or pick an example.
        </div>
      </div>
    </section>
  )
}
