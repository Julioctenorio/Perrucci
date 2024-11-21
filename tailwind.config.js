// tailwind.config.js

module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif'],
      'body': [
        'Inter',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji'
      ],
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bgperrucci.webp')"
      },
      colors: {
        primary: {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
          "950": "#172554",
          "opacity": "#78a6ea"
        }
      },
      brightness: {
        10: '.1',
        25: '.25',
        30: '.30',
        40: '.4',
        50: '.5',
        175: '1.75',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}