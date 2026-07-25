export const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
export const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
export const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
export const DEFAULT_COORDS = { lat: 21.0285, lon: 105.8542, name: 'Hà Nội' };
export const AQI_LEVELS = [
  { max: 50, label: 'Tốt', color: '#00e400', textColor: 'text-green-400' },
  { max: 100, label: 'Trung bình', color: '#ffff00', textColor: 'text-yellow-400' },
  { max: 150, label: 'Kém', color: '#ff7e00', textColor: 'text-orange-400' },
  { max: 200, label: 'Xấu', color: '#ff0000', textColor: 'text-red-500' },
  { max: 300, label: 'Rất xấu', color: '#8f3f97', textColor: 'text-purple-500' },
  { max: Infinity, label: 'Nguy hại', color: '#7e0023', textColor: 'text-rose-800' },
];
export const UV_LEVELS = [
  { max: 2, label: 'Thấp', color: '#3a87' },
  { max: 5, label: 'Trung bình', color: '#f5e642' },
  { max: 7, label: 'Cao', color: '#f59e0b' },
  { max: 10, label: 'Rất cao', color: '#ef4444' },
  { max: Infinity, label: 'Cực kì cao', color: '#7c3aed' },
];
export const WMO_DESCRIPTIONS = {
  0: 'Trời quang', 1: 'Trời ít mây', 2: 'Trời nhiều mây', 3: 'Trời u ám',
  45: 'Sương mù', 48: 'Sương mù đông',
  51: 'Mưa phùn nhẹ', 53: 'Mưa phùn vừa', 55: 'Mưa phùn đầy',
  61: 'Mưa nhẹ', 63: 'Mưa vừa', 65: 'Mưa to',
  71: 'Tuyết nhẹ', 73: 'Tuyết vừa', 75: 'Tuyết to',
  80: 'Mưa rào nhẹ', 81: 'Mưa rào vừa', 82: 'Mưa rào to',
  95: 'Giông bão', 96: 'Giông bão kèm mưa đá', 99: 'Giông bão kèm mưa đá to'
};
