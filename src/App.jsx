import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Layout from './components/Layout';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import SunMoon from './components/SunMoon';
import UvIndex from './components/UvIndex';
import AirQuality from './components/AirQuality';
import Loading from './components/Loading';
import WeatherBackground from './components/WeatherBackground';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeatherData } from './hooks/useWeather';
import { AlertIcon } from './components/Icons';

function WeatherApp() {
  const { coords, setCoords, loading: geoLoading } = useGeolocation();
  const { weather, airQuality, loading, error } = useWeatherData(coords.lat, coords.lon);
  const [locationName, setLocationName] = useState('Đang xác định vị trí...');
  const [errorKey, setErrorKey] = useState(0);

  const handleSearch = (loc) => {
    setCoords(loc);
    setLocationName(loc.name);
  };

  useEffect(() => {
    if (coords.name && coords.name !== 'Vi tri cua ban') {
      setLocationName(coords.name);
    } else if (!geoLoading) {
      setLocationName('Vị trí hiện tại');
    }
  }, [coords, geoLoading]);

  useEffect(() => {
    if (error) setErrorKey((k) => k + 1);
  }, [error]);

  const weatherCode = weather?.current?.weather_code;
  const isDay = weather?.current?.is_day !== 0;

  return (
    <>
      <WeatherBackground weatherCode={weatherCode} isDay={isDay} />
      <Layout onSearch={handleSearch}>
        {loading && <Loading locationName={locationName} />}
        {error && (
          <div key={errorKey} className='glass-card text-center animate-shake py-10'>
            <div className='flex justify-center mb-3' style={{ color: '#ef4444' }}>
              <AlertIcon size={32} />
            </div>
            <p className='text-sm font-medium' style={{ color: 'var(--text-primary)' }}>Không thể tải dữ liệu</p>
            <p className='text-xs mt-1' style={{ color: 'var(--text-muted)' }}>{error}</p>
          </div>
        )}
        {!loading && !error && weather && (
          <>
            <CurrentWeather data={weather} locationName={locationName} />
            <HourlyForecast data={weather} />
            <DailyForecast data={weather} />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <UvIndex data={weather} />
              <AirQuality data={airQuality} />
            </div>
            <SunMoon daily={weather.daily} />
          </>
        )}
      </Layout>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherApp />
    </ThemeProvider>
  );
}