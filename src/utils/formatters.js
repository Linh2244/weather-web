export function formatTemp(celsius) {
  return Math.round(celsius) + '°';
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export function formatHour(timeStr) {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  return d.getHours() + ':00';
}

export function formatDay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return 'Hôm nay';
  if (d.toDateString() === tomorrow.toDateString()) return 'Ngày mai';
  return days[d.getDay()];
}

export function getAQIInfo(usAqi) {
  if (usAqi <= 50) return { label: 'Tốt', color: '#22c55e', level: 1 };
  if (usAqi <= 100) return { label: 'Trung bình', color: '#eab308', level: 2 };
  if (usAqi <= 150) return { label: 'Kém', color: '#f97316', level: 3 };
  if (usAqi <= 200) return { label: 'Xấu', color: '#ef4444', level: 4 };
  if (usAqi <= 300) return { label: 'Rất xấu', color: '#a855f7', level: 5 };
  return { label: 'Nguy hại', color: '#7e22ce', level: 6 };
}

export function getUVInfo(uv) {
  if (uv <= 2) return { label: 'Thấp', color: '#22c55e', level: 1 };
  if (uv <= 5) return { label: 'Trung bình', color: '#eab308', level: 2 };
  if (uv <= 7) return { label: 'Cao', color: '#f97316', level: 3 };
  if (uv <= 10) return { label: 'Rất cao', color: '#ef4444', level: 4 };
  return { label: 'Cực kì cao', color: '#7c3aed', level: 5 };
}

export function getWindDirection(deg) {
  const dirs = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
  return dirs[Math.round(deg / 45) % 8];
}

export function getWeatherDescription(code) {
  const desc = {
    0: 'Trời quang', 1: 'Trời ít mây', 2: 'Trời nhiều mây', 3: 'Trời u ám',
    45: 'Sương mù', 48: 'Sương mù đông',
    51: 'Mưa phùn nhẹ', 53: 'Mưa phùn vừa', 55: 'Mưa phùn đầy',
    56: 'Mưa phùn đông', 57: 'Mưa phùn đông ngày',
    61: 'Mưa nhẹ', 63: 'Mưa vừa', 65: 'Mưa to',
    66: 'Mưa đông nhẹ', 67: 'Mưa đông vừa',
    71: 'Tuyết nhẹ', 73: 'Tuyết vừa', 75: 'Tuyết to',
    77: 'Hạt tuyết',
    80: 'Mưa rào nhẹ', 81: 'Mưa rào vừa', 82: 'Mưa rào to',
    85: 'Tuyết rào nhẹ', 86: 'Tuyết rào to',
    95: 'Giông bão', 96: 'Giông bão kèm mưa đá', 99: 'Giông bão kèm mưa đá to'
  };
  return desc[code] || '';
}