import { useState, useEffect, useRef } from 'react';
import { getWindDirection, getWeatherDescription } from '../utils/formatters';
import { useInView } from '../hooks/useInView';
import { ThermometerIcon, DropletIcon, WindDirIcon, RainIcon, EyeIcon, GaugeIcon, SnowflakeIcon, UVIcon } from './Icons';

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
  const [gridRef, gridInView] = useInView();
  if (!data) return null;
  const c = data.current;
  if (!c) return null;
  const d = data.daily;
  const desc = getWeatherDescription(c.weather_code);
  const maxT = d?.temperature_2m_max?.[0];
  const minT = d?.temperature_2m_min?.[0];
  const visKm = c.visibility != null ? (c.visibility / 1000).toFixed(0) : null;

  const details = [
    { icon: <ThermometerIcon size={18} />, label: 'Cảm giác như', value: Math.round(c.apparent_temperature) + '°' },
    { icon: <DropletIcon size={18} />, label: 'Độ ẩm', value: c.relative_humidity_2m + '%' },
    { icon: <WindDirIcon deg={c.wind_direction_10m} size={16} />, label: 'Gió', value: c.wind_speed_10m + ' km/h ' + getWindDirection(c.wind_direction_10m) },
    { icon: <RainIcon size={18} />, label: 'Lượng mưa', value: (c.precipitation || 0) + ' mm' },
    { icon: <EyeIcon size={18} />, label: 'Tầm nhìn', value: visKm != null ? visKm + ' km' : '--' },
    { icon: <GaugeIcon size={18} />, label: 'Áp suất', value: c.surface_pressure ? Math.round(c.surface_pressure) + ' hPa' : '--' },
    { icon: <SnowflakeIcon size={18} />, label: 'Điểm sương', value: c.dew_point_2m != null ? Math.round(c.dew_point_2m) + '°' : '--' },
    { icon: <UVIcon size={18} />, label: 'UV', value: c.uv_index != null ? c.uv_index.toFixed(1) : '--' },
  ];

  return (
    <div className='animate-fade-slide-up delay-0 text-center pt-4 pb-2'>
      {locationName && (
        <p
          className='text-sm font-medium tracking-widest uppercase mb-4'
          style={{ color: 'var(--text-muted)' }}
        >
          {locationName}
        </p>
      )}

      <div className='flex flex-col items-center gap-1 mb-2'>
        <p className='hero-temp animate-count'>
          <AnimatedTemp value={Math.round(c.temperature_2m)} />
        </p>
      </div>

      <p className='text-lg mb-1 animate-fade-slide-up' style={{ color: 'var(--text-secondary)', animationDelay: '100ms' }}>{desc}</p>

      {maxT != null && minT != null && (
        <p className='text-sm animate-fade-slide-up' style={{ color: 'var(--text-muted)', animationDelay: '150ms' }}>
          Cao {Math.round(maxT)}° · Thấp {Math.round(minT)}°
        </p>
      )}

      <div ref={gridRef} className={`glass-card mt-4 grid grid-cols-2 gap-x-4 gap-y-3 stagger-children ${gridInView ? 'visible' : ''}`}>
        {details.map((item) => (
          <div key={item.label} className='stagger-item flex flex-col items-center gap-0.5 py-1'>
            <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
            <p className='text-[11px] leading-tight' style={{ color: 'var(--text-muted)' }}>{item.label}</p>
            <p className='text-base font-semibold' style={{ color: 'var(--text-primary)' }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}