import { memo, useMemo } from 'react';
import { formatTime } from '../utils/formatters';
import { getMoonPhase } from '../utils/moonPhase';
import { useInView } from '../hooks/useInView';
import { SunriseIcon, SunsetIcon, ClockIcon, SunIcon, MoonIcon } from './Icons';

function SunArc({ sunrise, sunset, inView }) {
  const now = new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  const dayLength = sunsetTime - sunriseTime;
  const nightLength = 24 * 3600000 - dayLength;
  const elapsed = now - sunriseTime;
  const progress = Math.max(0, Math.min(1, elapsed / dayLength));
  const isUp = now >= sunriseTime && now <= sunsetTime;

  const nightElapsed = now - sunsetTime;
  const nightProgress = Math.max(0, Math.min(1, nightElapsed / nightLength));

  const svgW = 200;
  const svgH = 80;
  const cx = svgW / 2;
  const cy = svgH - 5;
  const r = 75;

  const leftX = cx - r;
  const rightX = cx + r;
  const endY = cy;

  const sweep = 1;
  const arcStart = leftX;
  const arcEnd = rightX;

  const sunAngle = Math.PI * (1 - progress);
  const sunX = cx + r * Math.cos(sunAngle);
  const sunY = cy - r * Math.sin(sunAngle);

  const moonAngle = Math.PI * (1 - nightProgress);
  const moonX = cx + r * Math.cos(moonAngle);
  const moonY = cy - r * Math.sin(moonAngle);

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className='w-full' style={{ maxHeight: '80px' }}>
      <path
        d={`M ${arcStart} ${endY} A ${r} ${r} 0 0 ${sweep} ${arcEnd} ${endY}`}
        fill='none'
        stroke='var(--border)'
        strokeWidth='2'
        strokeLinecap='round'
      />
      {isUp && (
        <path
          d={`M ${arcStart} ${endY} A ${r} ${r} 0 0 ${sweep} ${sunX} ${sunY}`}
          fill='none'
          stroke='#f59e0b'
          strokeWidth='2'
          strokeLinecap='round'
          className={inView ? 'animate-draw-arc' : ''}
        />
      )}
      {!isUp && (
        <path
          d={`M ${arcStart} ${endY} A ${r} ${r} 0 0 ${sweep} ${moonX} ${moonY}`}
          fill='none'
          stroke='var(--border)'
          strokeWidth='1.5'
          strokeDasharray='4 3'
        />
      )}
      {isUp && (
        <g transform={`translate(${sunX - 7}, ${sunY - 7})`}>
          <circle cx="7" cy="7" r="4.5" fill="#f59e0b" />
          {[0,45,90,135,180,225,270,315].map((a) => {
            const rad = a * Math.PI / 180;
            return (
              <line key={a} x1={7 + 5.5 * Math.cos(rad)} y1={7 + 5.5 * Math.sin(rad)}
                    x2={7 + 7.5 * Math.cos(rad)} y2={7 + 7.5 * Math.sin(rad)}
                    stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />
            );
          })}
        </g>
      )}
      {!isUp && (
        <g transform={`translate(${moonX - 8}, ${moonY - 8})`}>
          <circle cx="8" cy="8" r="10" fill="#94a3b8" opacity="0.12" />
          <path d="M13 3.79A6.5 6.5 0 1 1 4.71 7 5 5 0 0 0 13 3.79z" fill="#cbd5e1" />
          <circle cx="14.5" cy="4.5" r="0.7" fill="#cbd5e1" opacity="0.4" />
          <circle cx="16" cy="7.5" r="0.5" fill="#cbd5e1" opacity="0.3" />
        </g>
      )}
      <circle cx={leftX} cy={endY} r='3' fill='#f97316' />
      <circle cx={rightX} cy={endY} r='3' fill='#6366f1' />
    </svg>
  );
}

function moonEmoji(icon) {
  const map = {
    'new-moon': '🌑', 'waxing-crescent': '🌒', 'first-quarter': '🌓',
    'waxing-gibbous': '🌔', 'full-moon': '🌕', 'waning-gibbous': '🌖',
    'last-quarter': '🌗', 'waning-crescent': '🌘',
  };
  return map[icon] || '🌑';
}

const SunMoon = memo(function SunMoon({ daily }) {
  const [ref, inView] = useInView();
  if (!daily) return null;
  const now = new Date();
  const sunriseTime = new Date(daily.sunrise[0]);
  const sunsetTime = new Date(daily.sunset[0]);
  const isDaytime = now >= sunriseTime && now <= sunsetTime;
  const moon = useMemo(() => getMoonPhase(daily.time[0]), [daily.time]);
  const daylightH = Math.round(daily.daylight_duration[0] / 3600);
  const daylightM = Math.round((daily.daylight_duration[0] % 3600) / 60);

  return (
    <div ref={ref} className='glass-card'>
      <SunArc sunrise={daily.sunrise[0]} sunset={daily.sunset[0]} inView={inView} />

      <div className='flex items-center justify-between mt-2'>
        <div className='flex items-center gap-2'>
          {isDaytime ? <SunriseIcon size={16} style={{ color: '#f97316' }} /> : <SunsetIcon size={16} style={{ color: '#6366f1' }} />}
          <div>
            <p className='text-[10px]' style={{ color: 'var(--text-muted)' }}>{isDaytime ? 'Bình minh' : 'Hoàng hôn'}</p>
            <p className='text-xs font-medium' style={{ color: 'var(--text-primary)' }}>{formatTime(isDaytime ? daily.sunrise[0] : daily.sunset[0])}</p>
          </div>
        </div>
        <div className='flex items-center gap-1.5'>
          <ClockIcon size={13} style={{ color: 'var(--text-muted)' }} />
          <span className='text-[11px]' style={{ color: 'var(--text-muted)' }}>{daylightH}h {daylightM}m</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='text-right'>
            <p className='text-[10px]' style={{ color: 'var(--text-muted)' }}>{isDaytime ? 'Hoàng hôn' : 'Bình minh'}</p>
            <p className='text-xs font-medium' style={{ color: 'var(--text-primary)' }}>{formatTime(isDaytime ? daily.sunset[0] : daily.sunrise[0])}</p>
          </div>
          {isDaytime ? <SunsetIcon size={16} style={{ color: '#6366f1' }} /> : <SunriseIcon size={16} style={{ color: '#f97316' }} />}
        </div>
      </div>

      <div className='flex items-center justify-between mt-3 pt-3' style={{ borderTop: '1px solid var(--border)' }}>
        <div className='flex items-center gap-2'>
          {isDaytime ? (
            <>
              <span style={{ color: '#f59e0b' }}><SunIcon size={28} /></span>
              <span className='text-sm font-medium' style={{ color: 'var(--text-secondary)' }}>Ban ngày</span>
            </>
          ) : (
            <>
              <span className='text-2xl'>{moonEmoji(moon.icon)}</span>
              <span className='text-sm font-medium' style={{ color: 'var(--text-secondary)' }}>{moon.name}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default SunMoon;
