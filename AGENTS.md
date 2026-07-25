# Weather Web - Agent Notes

## Project Overview
Weather website using React + Tailwind CSS + Open-Meteo APIs (no API key needed, CORS enabled).

## Tech Stack
- **Build**: Vite + React
- **Styling**: Tailwind CSS v3 (dark mode via `class` strategy)
- **APIs**: Open-Meteo Weather Forecast, Geocoding, Air Quality
- **Icons**: Custom SVG components in `WeatherIcon.jsx`

## Key Files
- `src/App.jsx` - Main app with ThemeProvider + Layout
- `src/components/` - All UI components
- `src/hooks/` - Custom hooks (useGeolocation, useDebounce, useWeatherData)
- `src/utils/` - API calls, formatters, moon phase calculation, weather code mapping
- `src/index.css` - Tailwind directives + CSS variables for dark mode theming

## Build & Dev
```bash
npm run dev      # Start dev server
npm run build    # Production build to dist/
npm run lint     # Oxlint code checking
```

## API Endpoints (no key required)
- Weather: `https://api.open-meteo.com/v1/forecast`
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Air Quality: `https://air-quality-api.open-meteo.com/v1/air-quality`

## Architecture Notes
- All API calls are client-side (browser directly to Open-Meteo)
- GPS auto-detection with fallback to Ha Noi coords (21.0285, 105.8542)
- Dark mode persisted in localStorage and follows `prefers-color-scheme` default
- WMO weather codes mapped to SVG weather icons
- Moon phase calculated from Julian day number