import { memo, useMemo } from 'react';
import WeatherIcon from './WeatherIcon';
import { DropletIcon } from './Icons';
import { useInView } from '../hooks/useInView';

function formatDayFull(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hôm nay';
  if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
  return days[d.getDay()];
}

const DailyForecast = memo(function DailyForecast({ data }) {
  const [ref, inView] = useInView();
  if (!data?.daily) return null;
  const d = data.daily;

  const days = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const all = d.time.map((t, i) => ({
      time: t,
      minT: Math.round(d.temperature_2m_min[i]),
      maxT: Math.round(d.temperature_2m_max[i]),
      code: d.weather_code[i],
      precip: d.precipitation_sum[i] || 0,
    }));

    const yesterdayIdx = d.time.findIndex(t => t === yesterdayStr);
    if (yesterdayIdx >= 0) {
      return [{ ...all[yesterdayIdx], isYesterday: true }, ...all.filter((_, i) => i !== yesterdayIdx).slice(0, 6)];
    }
    return all.slice(0, 7);
  }, [d]);

  return (
    <div ref={ref} className='glass-card'>
      <div className='divide-y' style={{ borderColor: 'var(--border)' }}>
        {days.map((day, i) => (
          <div
            key={day.time}
            className='flex items-center gap-2 py-2.5'
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.3s ease ${i * 40}ms, transform 0.3s ease ${i * 40}ms`,
            }}
          >
            <span className='text-[13px] w-[60px] shrink-0 font-medium' style={{ color: day.isYesterday ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              {formatDayFull(day.time)}
            </span>
            {day.precip > 0 && (
              <span className='text-[11px] flex items-center gap-0.5 w-[50px] shrink-0' style={{ color: 'var(--accent)' }}>
                <DropletIcon size={10} />{Math.round(day.precip)}%
              </span>
            )}
            {!day.precip && <span className='w-[50px]' />}
            <div className='flex items-center gap-1' style={{ transform: 'scale(0.65)', transformOrigin: 'left center' }}>
              <WeatherIcon code={day.code} size={26} />
            </div>
            <span className='text-[13px] w-12 text-right font-medium' style={{ color: 'var(--text-muted)' }}>
              {day.minT}°
            </span>
            <div className='flex-1 mx-1 h-[4px] rounded-full' style={{ backgroundColor: 'var(--border)' }}>
              <div
                className='h-full rounded-full'
                style={{
                  width: '100%',
                  background: day.maxT > 32 ? 'linear-gradient(to right, #60a5fa, #f97316)' : 'linear-gradient(to right, #60a5fa, #93c5fd)',
                  opacity: 0.6,
                }}
              />
            </div>
            <span className='text-[13px] w-12 shrink-0 font-semibold text-right' style={{ color: 'var(--text-primary)' }}>
              {day.maxT}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default DailyForecast;
