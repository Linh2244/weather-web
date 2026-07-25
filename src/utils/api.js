import { WEATHER_API, GEOCODING_API, AIR_QUALITY_API } from '../constants';

export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat, longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,is_day,wind_speed_10m,wind_direction_10m,uv_index,surface_pressure,dew_point_2m,visibility',
    hourly: 'temperature_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max,sunrise,sunset,daylight_duration,uv_index_max',
    timezone: 'auto',
  });
  const res = await fetch(WEATHER_API + '?' + params);
  return res.json();
}

export async function fetchAirQuality(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat, longitude: lon,
    current: 'european_aqi,us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide',
    hourly: 'european_aqi,us_aqi,pm2_5,pm10,ozone',
    timezone: 'auto',
  });
  const res = await fetch(AIR_QUALITY_API + '?' + params);
  return res.json();
}

export async function searchLocation(query) {
  if (!query || query.length < 2) return [];
  const params = new URLSearchParams({ name: query, count: 5, language: 'vi', format: 'json' });
  const res = await fetch(GEOCODING_API + '?' + params);
  const data = await res.json();
  return data.results || [];
}
