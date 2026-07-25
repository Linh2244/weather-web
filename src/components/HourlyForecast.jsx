import { memo, useMemo } from 'react';
import WeatherIcon from './WeatherIcon';
import { formatHour } from '../utils/formatters';
import { useInView } from '../hooks/useInView';
import { DropletIcon } from './Icons';

const HourlyForecast = memo(function HourlyForecast({ data }) {
  const [ref, inView] = useInView();
  if (!data || !data.hourly) return null;

  const hours = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const times = data.hourly.time;
    const startIdx = times.findIndex((t) => new Date(t).getHours() >= currentHour);
    const idx = startIdx >= 0 ? startIdx : 0;
    return data.hourly.time.slice(idx, idx + 24).map((t, i) => {
      const idx2 = idx + i;
      return {
        time: t,
        temp: Math.round(data.hourly.temperature_2m[idx2]),
        precip: data.hourly.precipitation_probability[idx2] || 0,
        code: data.hourly.weather_code[idx2],
        isNow: i === 0,
      };
    });
  }, [data]);

  return (
    <div ref={ref} className={`glass-card reveal ${inView ? 'visible' : ''}`}>
      <h3 className='text-[13px] font-semibold mb-4 tracking-wide' style={{ color: 'var(--text-muted)' }}>
        DỰ BÁO THEO GIỜ
      </h3>
      <div className='flex gap-2 overflow-x-auto scrollbar-hide scroll-snap-x pb-1 -mx-1 px-1'>
        {hours.map((h, i) => (
          <div
            key={h.time}
            className='flex flex-col items-center gap-1.5 min-w-[68px] py-3 px-2 rounded-2xl shrink-0 transition-all'
            style={{
              backgroundColor: h.isNow ? 'var(--accent)' : 'var(--glass-bg)',
              color: h.isNow ? 'white' : 'var(--text-primary)',
              border: h.isNow ? 'none' : '1px solid var(--glass-border)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 30}ms, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 30}ms`,
            }}
          >
            <span className='text-[11px] font-medium'>{h.isNow ? 'Bây giờ' : formatHour(h.time)}</span>
            <WeatherIcon code={h.code} size={26} />
            <span className='text-sm font-semibold'>{h.temp}°</span>
            {h.precip > 0 && (
              <span className='text-[10px] flex items-center gap-0.5' style={{ color: h.isNow ? 'rgba(255,255,255,0.8)' : 'var(--accent)' }}>
                <DropletIcon size={10} />{h.precip}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default HourlyForecast;