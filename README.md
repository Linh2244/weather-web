<div align="center">

# Thời Tiết — Weather Web

**Trang web thời tiết cho Việt Nam** với giao diện Apple-inspired, dark/light mode, GPS tự động, animation mượt mà.

A **weather website for Vietnam** with Apple-inspired glassmorphism UI, dark/light mode, GPS detection, and smooth animations.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-✓-5A0FC8)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Screenshots / Hình ảnh

<div align="center">

![Screenshot](/screenshots/screenshot.jpg)

</div>


---

## Tính năng / Features

- **Thời tiết realtime** — nhiệt độ, độ ẩm, gió, tầm nhìn, áp suất, điểm sương
- **Dự báo theo giờ** — 24h với biểu đồ nhiệt độ dạng đường + phần trăm mưa
- **Dự báo 7 ngày** — min/max, thanh nhiệt độ, xác suất mưa
- **Chỉ số UV** — gauge với thang màu, khuyến nghị bảo vệ da
- **Chất lượng không khí** — AQI + chi tiết PM2.5, PM10, O₃, NO₂, SO₂
- **Mặt trời & mặt trăng** — biểu đồ vòm mặt trời realtime, phase mặt trăng
- **Cảnh báo thời tiết** — carousel 4 trang: tip quan trọng nhất → độ ẩm → cảm giác ngày mai → gió
- **Tìm kiếm địa điểm** — tìm theo tỉnh/xã/phường tiếng Việt, lưu lịch sử vào localStorage
- **GPS tự động** — xác định vị trí hiện tại, fallback về Hà Nội
- **Dark/Light mode** — tự động theo hệ thống, lưu localStorage
- **PWA** — cài đặt như app trên mobile/desktop
- **Service Worker** — tự động cập nhật, cache offline
- **Animations** — spring easing, stagger, shimmer, fade-in, slide-in, reduced-motion hỗ trợ
- **Glassmorphism UI** — Apple Weather-inspired, backdrop-blur, animated transitions

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 3 |
| APIs | [Open-Meteo](https://open-meteo.com) (miễn phí, không cần key) |
| Icons | Custom SVG (20+ icons) |
| PWA | vite-plugin-pwa (autoUpdate + skipWaiting) |
| Linting | Oxlint |
| Chunk | ~617 KB JS, ~25 KB CSS (gzipped ~102 KB / ~6 KB) |

---

## Bắt đầu / Getting Started

```bash
git clone https://github.com/Linh2244/weather-web.git
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

## API Endpoints (Miễn phí, không cần API key)

| Endpoint | Usage |
|----------|-------|
| `api.open-meteo.com/v1/forecast` | Weather + hourly + daily forecast |
| `air-quality-api.open-meteo.com/v1/air-quality` | AQI + PM2.5, PM10, O₃, NO₂, SO₂ |
| `geocoding-api.open-meteo.com/v1/search` | Location search (fallback) |

---

## Cấu trúc dự án / Project Structure

```
src/
├── App.jsx                   # Main app + ThemeProvider + Layout
├── main.jsx                  # Entry point
├── index.css                 # Tailwind + CSS variables (dark/light) + keyframes
├── constants.js              # API URLs
├── components/
│   ├── AirQuality.jsx        # AQI + pollutant breakdown grid
│   ├── CurrentWeather.jsx    # Hero temperature + emoji + animated count
│   ├── DailyForecast.jsx     # 7-day forecast with temp bars
│   ├── DetailsGrid.jsx       # 2×3 grid: UV, Humidity, Wind, etc.
│   ├── HourlyForecast.jsx    # 24h scrollable + SVG line chart
│   ├── Icons.jsx             # All SVG icon components
│   ├── Layout.jsx            # Header + search slide-in panel
│   ├── Loading.jsx           # Pulse skeleton loading
│   ├── RainfallChart.jsx     # Hourly precipitation bars
│   ├── SearchBox.jsx         # Search + history + GPS
│   ├── SunMoon.jsx           # Sun arc + moon arc + moon phase
│   ├── ThemeProvider.jsx     # Dark/light context + localStorage
│   ├── UvIndex.jsx           # UV gauge + color scale
│   ├── WeatherAlertCarousel.jsx # 4-page tips carousel
│   ├── WeatherBackground.jsx # Dynamic gradient + particles
│   └── WeatherIcon.jsx       # Animated SVG weather icons
├── hooks/
│   ├── useDebounce.js        # Input debounce
│   ├── useGeolocation.js     # GPS auto-detect
│   ├── useInView.js          # IntersectionObserver scroll animation
│   ├── useSearchHistory.js   # localStorage search history
│   └── useWeatherData.js     # Weather + AQI data fetching
└── utils/
    ├── api.js                # fetchWeather, fetchAirQuality, searchLocation
    ├── formatters.js         # formatTemp, formatTime, getWindDirection, etc.
    ├── moonPhase.js          # Moon phase from Julian day
    └── vietnamCities.js      # VIETNAM_CITIES + findClosestLocation
```

---

## Tính năng nổi bật / Highlights

### Weather Alert Carousel
4 trang lời khuyên thời tiết thông minh, tự động chọn tip theo điều kiện hiện tại (dông > mưa > gió > UV > AQI > nhiệt độ). Vuốt trái/phải để chuyển trang.

### Search History
Lưu 8 địa điểm gần đây vào localStorage, hiển thị khi focus input, có nút "Xóa lịch sử".

### Sun/Moon Arc
SVG vòm mặt trời di chuyển realtime theo giờ trong ngày. Ban đêm tự động chuyển sang mặt trăng.

### Animations
Spring easing, stagger items, fade-in, slide-in, shimmer loading, animated nhiệt độ đếm. Hỗ trợ `prefers-reduced-motion`.

---

## Deployment / Triển khai

```bash
npm run build     # Build ra dist/
```

Copy thư mục `dist/` vào web server (cấu hình với `base: '/'`).

---

## License

[MIT](LICENSE) © 2026
