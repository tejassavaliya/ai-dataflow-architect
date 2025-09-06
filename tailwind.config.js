/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        source: "#2563EB",
        transform: "#7C3AED",
        destination: "#16A34A",
        pending: "#F59E0B",
        partial: "#3B82F6",
        complete: "#22C55E",
        error: "#EF4444"
      }
    },
  },
  darkMode: "class",
  plugins: [],
}
