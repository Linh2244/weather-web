import { memo, useMemo } from 'react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/formatters';
import { useInView } from '../hooks/useInView';
import { DropletIcon } from './Icons';

function formatDayFull(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Hôm nay';
  if (d.toDateString() === tomorrow.toDateString()) return 'Ngày mai';
  return days[d.getDay()];
}

const DailyForecast = memo(function DailyForecast({ data }) {
  const [ref, inView] = useInView();
  if (!data || !data.daily) return null;
  const d = data.daily;

  const days = useMemo(() => {
    const allMin = Math.min(...d.temperature_2m_min);
    const allMax = Math.max(...d.temperature_2m_max);
    const globalRange = Math.max(allMax - allMin, 1);
    return d.time.map((t, i) => {
      const minT = d.temperature_2m_min[i];
      const maxT = d.temperature_2m_max[i];
      return {
        time: t,
        minT,
        maxT,
        code: d.weather_code[i],
        precip: d.precipitation_sum[i],
        leftPct: ((minT - allMin) / globalRange) * 100,
        widthPct: (Math.max(maxT - minT, 1) / globalRange) * 100,
        isToday: i === 0,
      };
    });
  }, [d]);

  return (
    <div ref={ref} className={`glass-card reveal ${inView ? 'visible' : ''}`}>
      <h3 className='text-[13px] font-semibold mb-4 tracking-wide' style={{ color: 'var(--text-muted)' }}>
        DỰ BÁO 7 NGÀY
      </h3>
      <div className='space-y-1'>
        {days.map((day, i) => (
          <div
            key={day.time}
            className='flex items-center gap-3 py-3 px-2 rounded-xl'
            style={{
              backgroundColor: day.isToday ? 'var(--accent-soft)' : 'transparent',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(-12px)',
              transition: `opacity 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms, background-color 0.2s ease`,
            }}
          >
            <span
              className='w-[72px] text-[15px] shrink-0'
              style={{
                color: day.isToday ? 'var(--accent)' : 'var(--text-primary)',
                fontWeight: day.isToday ? 600 : 500,
              }}
            >
              {formatDayFull(day.time)}
            </span>

            <WeatherIcon code={day.code} size={30} />

            <span className='text-[15px] w-10 text-right shrink-0 font-medium' style={{ color: 'var(--text-muted)' }}>
              {formatTemp(day.minT)}
            </span>

            <div className='flex-1 mx-1'>
              <div className='relative h-[6px] rounded-full overflow-hidden' style={{ backgroundColor: 'var(--border)' }}>
                <div
                  className='absolute top-0 h-full rounded-full'
                  style={{
                    left: day.leftPct + '%',
                    width: inView ? day.widthPct + '%' : '0%',
                    background: 'linear-gradient(to right, #60a5fa, #facc15, #f97316)',
                    transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 60 + 200}ms, left 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 60 + 200}ms`,
                  }}
                />
              </div>
            </div>

            <span className='text-[15px] w-10 shrink-0 font-semibold' style={{ color: 'var(--text-primary)' }}>
              {formatTemp(day.maxT)}
            </span>

            <span className='text-[12px] w-12 text-right shrink-0 flex items-center justify-end gap-0.5' style={{ color: 'var(--text-muted)' }}>
              {day.precip > 0 && (
                <>
                  <DropletIcon size={11} />
                  <span>{day.precip}mm</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default DailyForecast;