import { memo, useState, useCallback } from 'react';
import { UmbrellaIcon, DropletIcon } from './Icons';

const alerts = [
  {
    title: 'Nhớ lấy ô!',
    desc: 'Có khả năng mưa sấm sét sẽ tiếp tục',
    total: '7mm',
  },
  {
    title: 'Gió mạnh',
    desc: 'Tốc độ gió có thể đạt 20 km/h',
    total: '20 km/h',
  },
  {
    title: 'Độ ẩm cao',
    desc: 'Độ ẩm không khí trên 80%',
    total: '80%',
  },
  {
    title: 'Tầm nhìn hạn chế',
    desc: 'Sương mù có thể làm giảm tầm nhìn',
    total: '< 5 km',
  },
];

const WeatherAlertCarousel = memo(function WeatherAlertCarousel({ weatherCode }) {
  const [active, setActive] = useState(0);

  const handleDot = useCallback((i) => setActive(i), []);

  const alert = alerts[0];

  return (
    <div className='glass-card'>
      <div className='flex items-start gap-3'>
        <div
          className='w-12 h-12 rounded-full flex items-center justify-center shrink-0'
          style={{ backgroundColor: 'var(--accent-soft)' }}
        >
          <UmbrellaIcon size={22} style={{ color: 'var(--accent)' }} />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-base font-semibold' style={{ color: 'var(--text-primary)' }}>{alert.title}</h3>
          <p className='text-xs mt-0.5' style={{ color: 'var(--text-secondary)' }}>{alert.desc}</p>
        </div>
        <div className='flex items-center gap-1 shrink-0' style={{ color: 'var(--accent)' }}>
          <DropletIcon size={14} />
          <span className='text-sm font-semibold'>{alert.total}</span>
        </div>
      </div>

      <div className='flex items-center justify-center gap-1.5 mt-4'>
        {alerts.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className='rounded-full transition-all duration-200'
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              backgroundColor: i === active ? 'var(--accent)' : 'var(--border)',
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default WeatherAlertCarousel;
