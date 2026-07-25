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

export default function CurrentWeather({ data, locationName }) {
  if (!data?.current) return null;
  const c = data.current;
  const d = data.daily;
  const desc = getWeatherDescription(c.weather_code);
  const maxT = d?.temperature_2m_max?.[0];
  const minT = d?.temperature_2m_min?.[0];

  return (
    <div className='pt-6'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='hero-temp text-left'>
            <AnimatedTemp value={Math.round(c.temperature_2m)} />
          </div>
          <p className='text-base font-medium mt-1' style={{ color: 'var(--text-secondary)' }}>{desc}</p>
          {maxT != null && minT != null && (
            <p className='text-sm mt-0.5' style={{ color: 'var(--text-muted)' }}>
              {Math.round(maxT)}° / {Math.round(minT)}° Cảm giác như {Math.round(c.apparent_temperature)}°
            </p>
          )}
        </div>
        <div className='shrink-0 -mt-2 -mr-3'>
          <svg viewBox="0 0 140 140" width="140" height="140">
            <g opacity="0.3">
              <path d="M25 75 Q30 60 45 62 Q50 48 65 50 Q70 40 85 45 Q95 35 105 42 Q110 50 105 60 Q115 58 120 68 Q122 78 112 82 H30 Q22 80 25 75Z" fill="#60a5fa"/>
              <path d="M50 58 Q55 46 68 48 Q72 38 85 42 Q92 34 100 40 Q104 46 100 54 Q108 52 112 60 Q114 68 106 72 H52 Q46 70 48 62Z" fill="#93c5fd" opacity="0.6"/>
            </g>
            <circle cx="65" cy="82" r="4" fill="#3b82f6" opacity="0.3"/>
            <circle cx="80" cy="85" r="5" fill="#3b82f6" opacity="0.25"/>
            <circle cx="75" cy="90" r="3" fill="#3b82f6" opacity="0.3"/>
            <circle cx="88" cy="80" r="4" fill="#3b82f6" opacity="0.2"/>
            <path d="M110 96 Q112 94 116 96 Q114 100 110 96Z" fill="#3b82f6" opacity="0.4"/>
            <path d="M118 100 Q120 98 124 100 Q122 104 118 100Z" fill="#3b82f6" opacity="0.3"/>
            <g transform="translate(0, 0)">
              <circle cx="105" cy="78" r="2.5" fill="#f59e0b" opacity="0.15"/>
              <circle cx="105" cy="78" r="5" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.1"/>
            </g>
            <g transform="translate(15, 95)">
              <circle cx="0" cy="0" r="3" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" opacity="0.3" />
              <line x1="0" y1="3" x2="0" y2="10" stroke="var(--text-primary)" strokeWidth="1.2" opacity="0.25" />
              <line x1="-2.5" y1="5" x2="2.5" y2="5" stroke="var(--text-primary)" strokeWidth="1.2" opacity="0.25" />
              <line x1="-1.5" y1="7.5" x2="1.5" y2="7.5" stroke="var(--text-primary)" strokeWidth="1.2" opacity="0.2" />
              <line x1="-2" y1="12" x2="-0.5" y2="16" stroke="var(--text-primary)" strokeWidth="1.2" opacity="0.2" />
              <line x1="2" y1="12" x2="0.5" y2="16" stroke="var(--text-primary)" strokeWidth="1.2" opacity="0.2" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
