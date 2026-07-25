import { memo } from 'react';
import { getAQIInfo } from '../utils/formatters';
import { useInView } from '../hooks/useInView';

const AQI_SEGMENTS = [
  { max: 50, color: '#22c55e' },
  { max: 100, color: '#eab308' },
  { max: 150, color: '#f97316' },
  { max: 200, color: '#ef4444' },
  { max: 300, color: '#a855f7' },
  { max: 500, color: '#7e22ce' },
];

function getBarColor(v) {
  if (v <= 12) return '#22c55e';
  if (v <= 25) return '#eab308';
  if (v <= 35) return '#f97316';
  return '#ef4444';
}

const AirQuality = memo(function AirQuality({ data }) {
  const [ref, inView] = useInView();
  if (!data || !data.current) return null;
  const c = data.current;
  const aqi = c.us_aqi || c.european_aqi || 0;
  const info = getAQIInfo(aqi);
  const pct = Math.min(aqi / 300 * 100, 100);

  return (
    <div ref={ref} className={`glass-card reveal ${inView ? 'visible' : ''}`}>
      <h3 className='text-[13px] font-semibold mb-3 tracking-wide' style={{ color: 'var(--text-muted)' }}>
        CHẤT LƯỢNG KHÔNG KHÍ
      </h3>

      <div className='flex items-baseline gap-2 mb-3'>
        <span className='text-[32px] font-bold leading-none' style={{ color: info.color }}>{Math.round(aqi)}</span>
        <div>
          <span className='text-sm font-semibold' style={{ color: info.color }}>{info.label}</span>
          <span className='text-[11px] ml-1' style={{ color: 'var(--text-muted)' }}>US AQI</span>
        </div>
      </div>

      <div className='relative mb-1'>
        <div className='h-[6px] rounded-full overflow-hidden flex'>
          {AQI_SEGMENTS.map((seg, i) => {
            const prevMax = AQI_SEGMENTS[i - 1]?.max || 0;
            const width = ((seg.max - prevMax) / 300) * 100;
            return (
              <div key={i} className='h-full' style={{ width: width + '%', backgroundColor: seg.color }} />
            );
          })}
        </div>
        <div
          className='absolute top-0 h-[6px] w-[3px] rounded-full bg-white'
          style={{
            left: inView ? `calc(${pct}% - 1.5px)` : '0%',
            boxShadow: `0 0 6px ${info.color}`,
            transition: 'left 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }}
        />
      </div>

      <div className='flex justify-between mb-4 px-0.5'>
        {[0, 50, 100, 150, 200, 300].map((v) => (
          <span key={v} className='text-[9px]' style={{ color: 'var(--text-muted)' }}>{v}</span>
        ))}
      </div>

      <div className='space-y-2.5'>
        {[
          { label: 'PM2.5', value: c.pm2_5, max: 35 },
          { label: 'PM10', value: c.pm10, max: 50 },
          { label: 'O₃', value: c.ozone, max: 70 },
          { label: 'NO₂', value: c.nitrogen_dioxide, max: 40 },
        ].map((p, i) => (
          <div key={p.label} className='flex items-center gap-3'>
            <span className='text-xs w-10 shrink-0' style={{ color: 'var(--text-muted)' }}>{p.label}</span>
            <div className='flex-1 h-[3px] rounded-full overflow-hidden' style={{ backgroundColor: 'var(--border)' }}>
              <div
                className='h-full rounded-full'
                style={{
                  width: inView ? Math.min((p.value || 0) / p.max * 100, 100) + '%' : '0%',
                  backgroundColor: getBarColor(p.value),
                  transition: `width 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 100 + 400}ms`,
                }}
              />
            </div>
            <span className='text-xs font-medium w-16 text-right shrink-0' style={{ color: 'var(--text-primary)' }}>
              {p.value ? p.value.toFixed(1) : '--'} <span className='text-[10px] font-normal' style={{ color: 'var(--text-muted)' }}>μg/m³</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default AirQuality;