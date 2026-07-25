import { memo } from 'react';
import { getWindDirection, getUVInfo } from '../utils/formatters';
import { useInView } from '../hooks/useInView';
import { UVIcon, DropletIcon, WindIcon, SnowflakeIcon, GaugeIcon, EyeIcon } from './Icons';

const DetailsGrid = memo(function DetailsGrid({ data }) {
  const [ref, inView] = useInView();
  if (!data?.current) return null;
  const c = data.current;
  const visKm = c.visibility != null ? (c.visibility / 1000).toFixed(1) : null;

  const uv = c.uv_index ?? data.daily?.uv_index_max?.[0];
  const uvInfo = uv != null ? getUVInfo(uv) : null;

  const items = [
    { icon: <UVIcon size={18} />, label: 'Chỉ số UV', value: uv != null ? `${uv.toFixed(1)} · ${uvInfo?.label || ''}` : '--' },
    { icon: <DropletIcon size={18} />, label: 'Độ ẩm', value: c.relative_humidity_2m != null ? `${c.relative_humidity_2m}%` : '--' },
    { icon: <WindIcon size={18} />, label: 'Gió', value: c.wind_speed_10m != null ? `${c.wind_speed_10m} km/h` : '--' },
    { icon: <SnowflakeIcon size={18} />, label: 'Điểm sương', value: c.dew_point_2m != null ? `${Math.round(c.dew_point_2m)}°` : '--' },
    { icon: <GaugeIcon size={18} />, label: 'Áp suất', value: c.surface_pressure ? `${Math.round(c.surface_pressure)} hPa` : '--' },
    { icon: <EyeIcon size={18} />, label: 'Tầm nhìn', value: visKm != null ? `${visKm} km` : '--' },
  ];

  return (
    <div ref={ref} className='grid grid-cols-3 gap-3'>
      {items.map((item, i) => (
        <div
          key={item.label}
          className='glass-card py-4 px-3 text-center'
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 0.3s ease ${i * 60}ms, transform 0.3s ease ${i * 60}ms`,
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
          <p className='text-[20px] font-semibold mt-1 leading-tight' style={{ color: 'var(--text-primary)' }}>{item.value}</p>
          <p className='text-[10px] mt-0.5' style={{ color: 'var(--text-muted)' }}>{item.label}</p>
        </div>
      ))}
    </div>
  );
});

export default DetailsGrid;
