export function getMoonPhase(dateStr) {
  if (!dateStr) return { phase: 0, name: 'Không rõ', icon: 'moon-unknown' };
  const d = new Date(dateStr + 'T12:00:00');
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  const day = d.getDate();
  let c = 0, e = 0, jd = 0, b = 0;
  if (month < 3) { year--; month += 12; }
  month++;
  c = 365.25 * year;
  e = 30.66 * month;
  jd = c + e + day - 694959;
  b = jd / 29.5305882;
  b = b - Math.floor(b);
  const phase = b;
  const phases = [
    { name: 'Trái non', icon: 'new-moon' },
    { name: 'Trăng lưỡi liềm', icon: 'waxing-crescent' },
    { name: 'Trăng khuyết đầu', icon: 'first-quarter' },
    { name: 'Trăng gibbous sáng', icon: 'waxing-gibbous' },
    { name: 'Trăng tròn', icon: 'full-moon' },
    { name: 'Trăng gibbous non', icon: 'waning-gibbous' },
    { name: 'Trăng khuyết cuối', icon: 'last-quarter' },
    { name: 'Trăng lưỡi liềm non', icon: 'waning-crescent' },
  ];
  const idx = Math.floor(phase * 8) % 8;
  return { phase, name: phases[idx].name, icon: phases[idx].icon };
}
