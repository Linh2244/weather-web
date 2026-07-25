export function getWeatherIcon(code, isDay = true) {
  const icons = {
    0: isDay ? 'clear-day' : 'clear-night',
    1: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
    2: 'cloudy', 3: 'overcast',
    45: 'fog', 48: 'fog',
    51: 'drizzle', 53: 'drizzle', 55: 'drizzle',
    56: 'drizzle', 57: 'drizzle',
    61: 'rain', 63: 'rain', 65: 'rain',
    66: 'rain', 67: 'rain',
    71: 'snow', 73: 'snow', 75: 'snow',
    77: 'snow',
    80: 'rain', 81: 'rain', 82: 'rain',
    85: 'snow', 86: 'snow',
    95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm',
  };
  return icons[code] || 'cloudy';
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
