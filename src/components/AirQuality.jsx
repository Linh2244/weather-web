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

function getPollutantLevel(value, type) {
  const thresholds = {
    pm2_5: [15, 35, 55, 150, 250],
    pm10: [50, 100, 200, 350, 420],
    ozone: [60, 100, 140, 180, 240],
    nitrogen_dioxide: [40, 80, 120, 180, 240],
    sulphur_dioxide: [40, 80, 120, 180, 240],
  };
  const t = thresholds[type];
  if (!t || value == null) return { color: '#94a3b8', label: '' };
  if (value <= t[0]) return { color: '#22c55e', label: 'Tốt' };
  if (value <= t[1]) return { color: '#eab308', label: 'TB' };
  if (value <= t[2]) return { color: '#f97316', label: 'Kém' };
  if (value <= t[3]) return { color: '#ef4444', label: 'Xấu' };
  return { color: '#a855f7', label: 'Rất xấu' };
}

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'µg/m³' },
  { key: 'ozone', label: 'O₃', unit: 'µg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³' },
  { key: 'nitrogen_dioxide', label: 'NO₂', unit: 'µg/m³' },
  { key: 'sulphur_dioxide', label: 'SO₂', unit: 'µg/m³' },
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
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-xs font-semibold tracking-wide' style={{ color: 'var(--text-muted)' }}>Chất lượng không khí</span>
      </div>

      <div className='flex items-baseline gap-2 mb-4'>
        <span className='text-[28px] font-bold leading-none' style={{ color: info.color }}>{Math.round(aqi)}</span>
        <span className='text-sm font-semibold' style={{ color: info.color }}>{info.label}</span>
      </div>

      <div className='relative mb-5'>
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

      <div className='grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2'>
        {POLLUTANTS.map((p) => {
          const val = c[p.key];
          const level = getPollutantLevel(val, p.key);
          return (
            <div key={p.key} className='text-center'>
              <p className='text-[11px] font-medium' style={{ color: 'var(--text-muted)' }}>{p.label}</p>
              <p className='text-sm font-semibold mt-0.5' style={{ color: level.color }}>{val != null ? Math.round(val) : '--'}</p>
              <p className='text-[11px]' style={{ color: 'var(--text-muted)' }}>{val != null ? p.unit : ''}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default AirQuality;
