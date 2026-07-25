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

const AirQuality = memo(function AirQuality({ data }) {
  const [ref, inView] = useInView();
  if (!data?.current) return null;
  const c = data.current;
  const aqi = c.us_aqi || c.european_aqi || 0;
  const info = getAQIInfo(aqi);
  const pct = Math.min(aqi / 300 * 100, 100);

  return (
    <div ref={ref} className='glass-card'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-xs font-semibold tracking-wide' style={{ color: 'var(--text-muted)' }}>AQI</span>
      </div>

      <div className='flex items-baseline gap-2 mb-3'>
        <span className='text-[28px] font-bold leading-none' style={{ color: info.color }}>{Math.round(aqi)}</span>
        <span className='text-sm font-semibold' style={{ color: info.color }}>{info.label}</span>
      </div>

      <div className='relative'>
        <div className='h-[5px] rounded-full overflow-hidden flex'>
          {AQI_SEGMENTS.map((seg, i) => {
            const prevMax = AQI_SEGMENTS[i - 1]?.max || 0;
            const width = ((seg.max - prevMax) / 300) * 100;
            return <div key={i} className='h-full' style={{ width: width + '%', backgroundColor: seg.color }} />;
          })}
        </div>
        <div
          className='absolute top-0 h-[5px] w-[3px] rounded-full bg-white'
          style={{
            left: inView ? `calc(${pct}% - 1.5px)` : '0%',
            boxShadow: `0 0 6px ${info.color}`,
            transition: 'left 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }}
        />
      </div>
    </div>
  );
});

export default AirQuality;
