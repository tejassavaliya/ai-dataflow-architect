# Nexla – Data Flow Architect (Frontend Take‑Home)

A React + TypeScript + Tailwind app that turns natural‑language data flow prompts into an interactive canvas.
Gemini (via Genkit) powers clarifying questions in the chat.

> Stack: React 18, TypeScript, Tailwind, React Router, Zustand, Lucide.  
> AI: Google Gemini 1.5 Flash via Genkit, exposed with a Netlify Function.

## Quickstart

1) **Install**  
```bash
npm i
```

2) **Configure AI**  
Create a `.env` file at project root and set:
```
GOOGLE_API_KEY=your_google_api_key
```
> Genkit auto‑reads `GOOGLE_API_KEY`. No REACT/VITE prefix is needed because it runs serverside in the Netlify Function.

3) **Run (with Netlify dev)**  
```bash
npx netlify dev
```
Open http://localhost:5173

If you don't want Netlify, you can deploy the function anywhere that supports a Node handler.
Update the frontend `VITE_API_BASE` if needed.

## Notes

- Landing page with example prompts and dark/light toggle.
- Studio has a 3‑pane layout: chat, canvas, properties.
- Canvas uses simple columnar layout for Source → Transform → Destination, with status rings.
- Zustand store manages nodes, edges, selection, and inline property editing.
- Chat asks Genkit/Gemini; integrate its answers to update nodes/statuses later.

## Deploy

- **Netlify**: Push to a Git repo and connect the repo in Netlify. Environment variable `GOOGLE_API_KEY` must be set in the Netlify project.
- **Vercel/Other**: Move the function under their serverless layout and adapt the proxy (see `netlify.toml`).

## License

MIT
