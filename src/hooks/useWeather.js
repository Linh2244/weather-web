import { useState, useEffect } from 'react';
import { fetchWeather, fetchAirQuality } from '../utils/api';

export function useWeatherData(lat, lon) {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    setError(null);
    Promise.all([fetchWeather(lat, lon), fetchAirQuality(lat, lon)])
      .then(([w, a]) => { setWeather(w); setAirQuality(a); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  return { weather, airQuality, loading, error };
}
