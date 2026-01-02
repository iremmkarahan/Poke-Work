/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'poke-dark': '#0f172a',    // Slate 900
                'poke-card': '#1e293b',    // Slate 800
                'poke-accent': '#06b6d4',  // Cyan 500
                'poke-yellow': '#eab308'   // Yellow 500
            }
        },
    },
    plugins: [],
}
