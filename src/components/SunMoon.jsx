import { memo, useMemo } from 'react';
import { formatTime } from '../utils/formatters';
import { getMoonPhase } from '../utils/moonPhase';
import { useInView } from '../hooks/useInView';
import { SunriseIcon, SunsetIcon, ClockIcon } from './Icons';

function moonEmoji(icon) {
  const map = { 'new-moon': '🌑', 'waxing-crescent': '🌒', 'first-quarter': '🌓', 'waxing-gibbous': '🌔', 'full-moon': '🌕', 'waning-gibbous': '🌖', 'last-quarter': '🌗', 'waning-crescent': '🌘' };
  return map[icon] || '🌑';
}

function SunArc({ sunrise, Sunset, inView }) {
  const now = new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(Sunset);
  const dayLength = sunsetTime - sunriseTime;
  const elapsed = now - sunriseTime;
  const progress = Math.max(0, Math.min(1, elapsed / dayLength));
  const isUp = now >= sunriseTime && now <= sunsetTime;

  const svgW = 200;
  const svgH = 80;
  const cx = svgW / 2;
  const cy = svgH - 5;
  const r = 75;

  const startX = cx - r;
  const endX = cx + r;
  const startY = cy;
  const endY = cy;

  const sunAngle = Math.PI * (1 - progress);
  const sunX = cx + r * Math.cos(sunAngle);
  const sunY = cy - r * Math.sin(sunAngle);

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className='w-full' style={{ maxHeight: '80px' }}>
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
        fill='none'
        stroke='var(--border)'
        strokeWidth='2'
        strokeLinecap='round'
      />
      {isUp && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
          fill='none'
          stroke='#f59e0b'
          strokeWidth='2'
          strokeLinecap='round'
          className={inView ? 'animate-draw-arc' : ''}
        />
      )}
      {isUp && (
        <circle cx={sunX} cy={sunY} r='5' fill='#f59e0b'>
          <animate attributeName='r' values='5;6;5' dur='2s' repeatCount='indefinite' />
        </circle>
      )}
      {!isUp && (
        <>
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke='var(--border)' strokeWidth='1' strokeDasharray='4 3' />
          <circle cx={cx} cy={cy - r - 2} r='4' fill='none' stroke='var(--text-muted)' strokeWidth='1' opacity='0.4' />
        </>
      )}
      <circle cx={startX} cy={startY} r='3' fill='#f97316' />
      <circle cx={endX} cy={endY} r='3' fill='#6366f1' />
    </svg>
  );
}

const SunMoon = memo(function SunMoon({ daily }) {
  const [ref, inView] = useInView();
  if (!daily) return null;
  const moon = useMemo(() => getMoonPhase(daily.time[0]), [daily.time]);
  const daylightH = Math.round(daily.daylight_duration[0] / 3600);
  const daylightM = Math.round((daily.daylight_duration[0] % 3600) / 60);

  return (
    <div ref={ref} className={`glass-card reveal ${inView ? 'visible' : ''}`}>
      <h3 className='text-[13px] font-semibold mb-3 tracking-wide' style={{ color: 'var(--text-muted)' }}>
        MẶT TRỜI & MẶT TRĂNG
      </h3>

      <SunArc sunrise={daily.sunrise[0]} Sunset={daily.sunset[0]} inView={inView} />

      <div className='flex items-center justify-between mt-2'>
        <div className='flex items-center gap-2'>
          <SunriseIcon size={16} style={{ color: '#f97316' }} />
          <span className='text-xs font-medium' style={{ color: 'var(--text-primary)' }}>{formatTime(daily.sunrise[0])}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <ClockIcon size={13} style={{ color: 'var(--text-muted)' }} />
          <span className='text-[11px]' style={{ color: 'var(--text-muted)' }}>{daylightH}h {daylightM}m</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium' style={{ color: 'var(--text-primary)' }}>{formatTime(daily.sunset[0])}</span>
          <SunsetIcon size={16} style={{ color: '#6366f1' }} />
        </div>
      </div>

      <div className='flex items-center justify-center gap-2 mt-3 pt-3' style={{ borderTop: '1px solid var(--border)' }}>
        <span className='text-2xl animate-scale-in' style={{ animationDelay: '0.5s' }}>{moonEmoji(moon.icon)}</span>
        <span className='text-sm' style={{ color: 'var(--text-secondary)' }}>{moon.name}</span>
      </div>
    </div>
  );
});

export default SunMoon;