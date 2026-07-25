import { memo } from 'react';

const svgMap = {
  'clear-day': <svg viewBox="0 0 64 64" fill="none" className="animate-sun-pulse"><circle cx="32" cy="32" r="12" fill="#FFD93D"/><g stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" style={{transformOrigin:'32px 32px'}}>{Array.from({length:8},(_,i)=><line key={i} x1="32" y1={8+5*i} x2="32" y2="16" transform={`rotate(${45*i},32,32)`}/>)}</g></svg>,
  'clear-night': <svg viewBox="0 0 64 64" className="animate-moon-glow"><path d="M36 12C24 12 16 22 16 32s8 20 20 20c-4-2-8-6-8-12s4-10 8-12c0-8-4-16-4-16 4 2 8 6 12 12 0-8-4-16-8-20z" fill="#B8C6D0"/></svg>,
  'partly-cloudy-day': <svg viewBox="0 0 64 64"><circle cx="26" cy="24" r="10" fill="#FFD93D" className="animate-sun-pulse"/><path d="M18 38c0-4 4-8 8-8h18c5 0 8 4 8 8s-3 8-8 8H26c-4 0-8-4-8-8z" fill="#CBD5E1" className="animate-cloud-float"/></svg>,
  'partly-cloudy-night': <svg viewBox="0 0 64 64"><path d="M24 12c-2 4-4 10-4 14s2 10 6 12" stroke="#B8C6D0" strokeWidth="2" fill="none" className="animate-moon-glow"/><circle cx="28" cy="16" r="2" fill="#B8C6D0" className="animate-moon-glow"/><path d="M14 38c0-4 4-8 8-8h22c5 0 8 4 8 8s-3 8-8 8H22c-4 0-8-4-8-8z" fill="#CBD5E1" className="animate-cloud-float"/></svg>,
  'cloudy': <svg viewBox="0 0 64 64"><path d="M12 40c0-5 4-9 9-9h22c6 0 10 4 10 10s-4 10-10 10H21c-5 0-9-5-9-11z" fill="#CBD5E1" className="animate-cloud-float-slow"/><path d="M20 34c0-4 3-7 7-7h16c5 0 8 3 8 8s-3 8-8 8H27c-4 0-7-4-7-9z" fill="#94A3B8" className="animate-cloud-float"/></svg>,
  'overcast': <svg viewBox="0 0 64 64"><path d="M8 36c0-4 3-8 8-8h32c5 0 8 4 8 8s-3 8-8 8H16c-4 0-8-4-8-8z" fill="#94A3B8" className="animate-cloud-float-slow"/><path d="M14 30c0-3 3-6 6-6h24c4 0 6 3 6 6s-2 6-6 6H20c-3 0-6-3-6-6z" fill="#64748B" className="animate-cloud-float"/></svg>,
  'fog': <svg viewBox="0 0 64 64"><rect x="12" y="28" rx="3" width="40" height="4" fill="#94A3B8" opacity="0.5" className="animate-cloud-float"/><rect x="12" y="36" rx="3" width="40" height="4" fill="#94A3B8" opacity="0.4" className="animate-cloud-float-slow"/><rect x="12" y="44" rx="3" width="40" height="4" fill="#94A3B8" opacity="0.3"/></svg>,
  'drizzle': <svg viewBox="0 0 64 64"><path d="M14 32c0-4 3-8 8-8h20c4 0 8 4 8 8s-4 8-8 8H22c-5 0-8-4-8-8z" fill="#94A3B8" className="animate-cloud-float"/><line x1="24" y1="42" x2="22" y2="52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/><line x1="32" y1="42" x2="30" y2="52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/><line x1="40" y1="42" x2="38" y2="52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/></svg>,
  'rain': <svg viewBox="0 0 64 64"><path d="M12 30c0-5 4-9 9-9h22c5 0 9 4 9 9s-4 9-9 9H21c-5 0-9-4-9-9z" fill="#64748B" className="animate-cloud-float"/><line x1="20" y1="42" x2="18" y2="56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6"/><line x1="28" y1="42" x2="26" y2="56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6"/><line x1="36" y1="42" x2="34" y2="56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6"/><line x1="44" y1="42" x2="42" y2="56" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.6"/></svg>,
  'snow': <svg viewBox="0 0 64 64"><path d="M14 28c0-4 3-8 8-8h20c5 0 8 4 8 8s-3 8-8 8H22c-4 0-8-4-8-8z" fill="#94A3B8" className="animate-cloud-float"/><circle cx="18" cy="46" r="2.5" fill="white" opacity="0.7"/><circle cx="26" cy="48" r="2.5" fill="white" opacity="0.7"/><circle cx="34" cy="46" r="2.5" fill="white" opacity="0.7"/><circle cx="42" cy="48" r="2.5" fill="white" opacity="0.7"/><circle cx="22" cy="54" r="2" fill="white" opacity="0.5"/><circle cx="38" cy="54" r="2" fill="white" opacity="0.5"/></svg>,
  'thunderstorm': <svg viewBox="0 0 64 64"><path d="M12 26c0-5 4-9 9-9h22c5 0 9 4 9 9s-4 9-9 9H21c-5 0-9-4-9-9z" fill="#475569" className="animate-cloud-float"/><polygon points="28,34 24,44 30,44 26,54 38,40 32,40 36,34" fill="#FBBF24" opacity="0.8"/><line x1="20" y1="38" x2="18" y2="52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/><line x1="42" y1="38" x2="40" y2="52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/><line x1="48" y1="38" x2="46" y2="52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/></svg>,
  'new-moon': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#94A3B8"/><circle cx="32" cy="32" r="16" fill="#1E293B"/></svg>,
  'waxing-crescent': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#94A3B8"/><path d="M38 16c6 4 6 16 0 32-6-4-6-16 0-32" fill="#1E293B"/></svg>,
  'first-quarter': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#94A3B8"/><rect x="32" y="16" width="16" height="32" fill="#1E293B"/></svg>,
  'waxing-gibbous': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#94A3B8"/><path d="M40 16c-4 4-4 16 0 32 4-4 4-16 0-32" fill="#1E293B"/></svg>,
  'full-moon': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#FEF08A"/><circle cx="28" cy="26" r="3" fill="#EAB308" opacity="0.3"/><circle cx="36" cy="36" r="2" fill="#EAB308" opacity="0.3"/><circle cx="30" cy="40" r="1.5" fill="#EAB308" opacity="0.3"/></svg>,
  'waning-gibbous': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#94A3B8"/><path d="M24 16c4 4 4 16 0 32-4-4-4-16 0-32" fill="#1E293B"/></svg>,
  'last-quarter': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#94A3B8"/><rect x="16" y="16" width="16" height="32" fill="#1E293B"/></svg>,
  'waning-crescent': <svg viewBox="0 0 64 64" className="animate-moon-glow"><circle cx="32" cy="32" r="16" fill="#94A3B8"/><path d="M26 16c-6 4-6 16 0 32 6-4 6-16 0-32" fill="#1E293B"/></svg>,
};

const WeatherIcon = memo(function WeatherIcon({ code, size = 48, isDay = true }) {
  const key = typeof code === 'string' ? code : getKey(code, isDay);
  const svg = svgMap[key] || svgMap['cloudy'];
  return <span style={{ width: size, height: size, display: 'inline-flex' }}>{svg}</span>;
});

function getKey(code, isDay) {
  const map = {
    0: isDay ? 'clear-day' : 'clear-night',
    1: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
    2: 'cloudy', 3: 'overcast',
    45: 'fog', 48: 'fog',
    51: 'drizzle', 53: 'drizzle', 55: 'drizzle',
    56: 'drizzle', 57: 'drizzle',
    61: 'rain', 63: 'rain', 65: 'rain', 66: 'rain', 67: 'rain',
    71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow',
    80: 'rain', 81: 'rain', 82: 'rain',
    85: 'snow', 86: 'snow',
    95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm',
  };
  return map[code] || 'cloudy';
}

export default WeatherIcon;