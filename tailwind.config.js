/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "d-blue-900": "#0A2A5E",
        "d-blue-700": "#13438B",
        "d-blue-600": "#1554B3",
        "d-cyan-400": "#00AEEF",
        "d-emerald-500": "#2BB673",
        "d-rose-500": "#E85C70",
      },
      boxShadow: {
        card: "0 8px 30px rgba(10,42,94,.08)",
        soft: "0 4px 16px rgba(10,42,94,.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
