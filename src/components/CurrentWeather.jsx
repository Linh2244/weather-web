import { useState, useEffect, useRef } from 'react';
import { getWeatherDescription } from '../utils/formatters';

function AnimatedTemp({ value }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const raf = useRef(null);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) return;
    const duration = 500;
    let startTime = null;
    function tick(now) {
      if (!startTime) startTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.round(from + (to - from) * t * (2 - t)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);
  return <>{display}°</>;
}

function getWeatherEmoji(code, isDay) {
  if (code >= 95 && code <= 99) return '⛈️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code === 45 || code === 48) return '🌫️';
  if (code === 3) return '☁️';
  if (code === 2) return '⛅';
  if (code === 1) return '🌤️';
  if (code === 0) return isDay ? '☀️' : '🌙';
  return isDay ? '☀️' : '🌙';
}

export default function CurrentWeather({ data, locationName }) {
  if (!data?.current) return null;
  const c = data.current;
  const d = data.daily;
  const desc = getWeatherDescription(c.weather_code);
  const maxT = d?.temperature_2m_max?.[0];
  const minT = d?.temperature_2m_min?.[0];

  return (
    <div className='pt-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          <div className='text-temp-lg sm:text-hero text-left'>
            <AnimatedTemp value={Math.round(c.temperature_2m)} />
          </div>
          <p className='text-base font-medium mt-1' style={{ color: 'var(--text-secondary)' }}>{desc}</p>
          {maxT != null && minT != null && (
            <p className='text-sm mt-0.5' style={{ color: 'var(--text-muted)' }}>
              {Math.round(maxT)}° / {Math.round(minT)}° Cảm giác như {Math.round(c.apparent_temperature)}°
            </p>
          )}
        </div>
        <div className='shrink-0'>
          <div
            className='w-20 h-20 sm:w-[120px] sm:h-[120px] rounded-3xl flex items-center justify-center'
            style={{ backgroundColor: 'var(--accent-soft)' }}
          >
            <span className='text-4xl sm:text-7xl leading-none' style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
              {getWeatherEmoji(c.weather_code, c.is_day)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
