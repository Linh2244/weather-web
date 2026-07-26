import { memo, useMemo } from 'react';
import { formatHour } from '../utils/formatters';
import { RainIcon } from './Icons';
import { useInView } from '../hooks/useInView';

const RainfallChart = memo(function RainfallChart({ data }) {
  const [ref, inView] = useInView();
  if (!data?.hourly) return null;

  const hours = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const times = data.hourly.time;
    const startIdx = times.findIndex((t) => new Date(t).getHours() >= currentHour);
    const idx = startIdx >= 0 ? startIdx : 0;
    return data.hourly.time.slice(idx, idx + 12).map((t, i) => {
      const val = data.hourly.precipitation?.[idx + i] || 0;
      return { time: t, value: val };
    });
  }, [data]);

  const maxVal = Math.max(...hours.map(h => h.value), 0.1);
  const barMaxH = 80;

  return (
    <div ref={ref} className='glass-card'>
      <div className='flex items-center gap-1.5 mb-4'>
        <RainIcon size={16} style={{ color: 'var(--accent)' }} />
        <span className='text-sm font-semibold' style={{ color: 'var(--text-primary)' }}>Lượng mưa</span>
      </div>

      <div className='relative overflow-x-auto scrollbar-hide -mx-5 px-5'>
        <div className='flex items-end gap-2' style={{ height: barMaxH + 20, minWidth: hours.length * 40 }}>
        {hours.map((h, i) => {
          const pct = maxVal > 0 ? (h.value / maxVal) : 0;
          const barH = Math.max(pct * barMaxH, h.value > 0 ? 2 : 0);
          return (
            <div key={h.time} className='flex-1 flex flex-col items-center gap-1'>
              <span className='text-[11px] font-medium' style={{ color: 'var(--text-muted)' }}>
                {h.value > 0 ? h.value.toFixed(h.value >= 10 ? 1 : 2) + 'mm' : ''}
              </span>
              <div
                className='w-full rounded-sm transition-all duration-500'
                style={{
                  height: inView ? barH : 0,
                  background: h.value > 0.5
                    ? 'linear-gradient(to top, #2563eb, #60a5fa)'
                    : h.value > 0
                    ? 'linear-gradient(to top, #3b82f6, #93c5fd)'
                    : 'transparent',
                  opacity: h.value > 0 ? 0.8 : 0,
                  borderRadius: 2,
                }}
              />
              <span className='text-[11px]' style={{ color: 'var(--text-muted)' }}>
                {formatHour(h.time)}
              </span>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
});

export default RainfallChart;
