<div align="center">

# Thời Tiết — Weather Web

**Trang web thời tiết cho Việt Nam** với giao diện Apple-inspired, dark/light mode, và GPS tự động.

A **weather website for Vietnam** with Apple-inspired glassmorphism UI, dark/light mode, and auto GPS detection.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-✓-5A0FC8)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-✓-222222?logo=githubpages)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Screenshots / Hình ảnh

<div align="center">

![Light Mode](screenshots/light.png)
![Dark Mode](screenshots/dark.png)

</div>

> Add your screenshots to the `screenshots/` folder and update the links above.

---

## Tính năng / Features

- **3.355 địa điểm** — 34 tỉnh/thành phố + 3.321 xã/phường từ database chính thức
- **Tìm kiếm** — theo tên tỉnh, xã, phường (tiếng Việt, có dấu)
- **GPS tự động** — xác định vị trí hiện tại, fallback về Hà Nội
- **Dự báo thời tiết** — theo giờ (24h) và 7 ngày
- **Chỉ số UV & AQI** — chất lượng không khí realtime
- **Mặt trời & mặt trăng** — giờ mọc/lặn, phase mặt trăng
- **Dark/Light mode** — tự động theo hệ thống, lưu localStorage
- **Glassmorphism UI** — Apple Weather-inspired, backdrop-blur, animated transitions
- **SVG icons** — 20+ biểu tượng thời tiết tùy chỉnh
- **PWA** — cài đặt như app trên mobile/desktop
- **Reduced motion** — hỗ trợ `prefers-reduced-motion`

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 3 |
| APIs | [Open-Meteo](https://open-meteo.com) (miễn phí, không cần key) |
| Icons | Custom SVG |
| PWA | vite-plugin-pwa |
| Linting | Oxlint |

---

## Bắt đầu / Getting Started

```bash
git clone https://github.com/your-username/weather-web.git
cd weather-web
npm install
npm run dev
```

### Scripts

| Command | Mô tả / Description |
|---------|---------------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Oxlint code checking |

---

## Cấu trúc dự án / Project Structure

```
src/
├── App.jsx                  # Main app + ThemeProvider + Layout
├── main.jsx                 # Entry point
├── index.css                # Tailwind + CSS variables (dark/light)
├── constants.js             # API URLs, WMO codes, AQI/UV levels
├── components/
│   ├── AirQuality.jsx       # AQI + pollutant breakdown
│   ├── DailyForecast.jsx    # 7-day forecast với temp bars
│   ├── HourlyForecast.jsx   # 24h scrollable forecast
│   ├── Icons.jsx            # Search, Location, Sun, Moon SVG icons
│   ├── Layout.jsx           # Fixed glassmorphism header + search
│   ├── Loading.jsx          # Pulse skeleton loading
│   ├── SearchBox.jsx        # Local search + Open-Meteo fallback
│   ├── SunMoon.jsx          # SVG sun arc + moon phase
│   ├── ThemeProvider.jsx    # Dark/light context + localStorage
│   ├── UvIndex.jsx          # UV gauge + color scale
│   ├── WeatherBackground.jsx# Dynamic gradient + particles
│   ├── WeatherIcon.jsx      # 20 animated SVG weather icons
│   └── CurrentWeather.jsx   # Hero temperature + quick stats
├── hooks/
│   ├── useDebounce.js       # Input debounce
│   ├── useGeolocation.js    # GPS auto-detect
│   ├── useInView.js         # IntersectionObserver scroll animation
│   └── useWeather.js        # Weather + AQI data fetching
└── utils/
    ├── api.js               # fetchWeather, fetchAirQuality, searchLocation
    ├── formatters.js        # formatTemp, formatTime, formatDay, getWindDirection
    ├── locations.js         # 3.355 địa điểm Việt Nam
    ├── moonPhase.js         # Moon phase from Julian day
    └── vietnamCities.js     # VIETNAM_CITIES + findClosestLocation
```

---

## API (Miễn phí, không cần API key)

| Endpoint | Usage |
|----------|-------|
| `api.open-meteo.com/v1/forecast` | Weather + hourly + daily forecast |
| `air-quality-api.open-meteo.com/v1/air-quality` | AQI + PM2.5, PM10, NO₂ |
| `geocoding-api.open-meteo.com/v1/search` | Location search (fallback) |

---

## Dữ liệu hành chính / Administrative Data

Administrative data is based on [vietnamese-provinces-database v4.0.0](https://github.com/webuild-community/vietnamese-provinces-database) (updated per Decree 30/2026/QH16) and includes **34 provinces/cities** and **3,321 communes/wards**.

---

## Deployment / Triển khai

This project is configured for automatic deployment to **GitHub Pages**:

1. Create a repo named `weather-web` on GitHub
2. Push the code to `main` branch
3. GitHub Actions will auto-deploy to `https://<username>.github.io/weather-web/`

---

## License

[MIT](LICENSE) © 2026
