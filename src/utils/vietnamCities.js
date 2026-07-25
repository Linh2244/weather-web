import { ALL_LOCATIONS } from './locations';

export const VIETNAM_CITIES = ALL_LOCATIONS;

export const REGIONS = {
  'Bắc': { label: 'Miền Bắc', color: '#3b82f6' },
  'Trung': { label: 'Miền Trung', color: '#f59e0b' },
  'Nam': { label: 'Miền Nam', color: '#10b981' },
};

export function findClosestLocation(lat, lon) {
  let best = ALL_LOCATIONS[0];
  let bestDist = Infinity;
  const R = 6371;
  const latRad = lat * Math.PI / 180;
  for (const loc of ALL_LOCATIONS) {
    const dLat = loc.lat * Math.PI / 180 - latRad;
    const dLon = loc.lon * Math.PI / 180 - lon * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(latRad) * Math.cos(loc.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (d < bestDist) { bestDist = d; best = loc; }
  }
  return best;
}

export function searchLocations(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const matches = ALL_LOCATIONS.filter((loc) => loc.name.toLowerCase().includes(q));
  const provinces = matches.filter((m) => m.type === 'province').slice(0, 10);
  const wards = matches.filter((m) => m.type === 'ward').slice(0, 20);
  return [...provinces, ...wards];
}