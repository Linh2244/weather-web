import { useMemo } from 'react';

function RainDrop({ delay }) {
  const left = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 0.5 + Math.random() * 0.3, []);
  const width = useMemo(() => 2 + Math.random() * 2, []);
  const height = useMemo(() => 28 + Math.random() * 16, []);
  const opacity = useMemo(() => 0.2 + Math.random() * 0.3, []);

  return (
    <div className='rain-drop' style={{
      left: left + '%', width: width + 'px', height: height + 'px',
      opacity, animationDuration: duration + 's', animationDelay: delay + 's',
    }} />
  );
}

function SnowFlake({ delay }) {
  const left = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 2.5 + Math.random() * 2, []);
  const size = useMemo(() => 2 + Math.random() * 3, []);

  return (
    <div className='snow-flake' style={{
      left: left + '%', width: size + 'px', height: size + 'px',
      animationDuration: duration + 's', animationDelay: delay + 's',
    }} />
  );
}

function FogLayer({ index }) {
  const top = useMemo(() => 20 + index * 15, [index]);
  const duration = useMemo(() => 8 + index * 3, [index]);

  return (
    <div className='fog-layer' style={{
      top: top + '%', animationDuration: duration + 's', animationDelay: (index * 2) + 's',
    }} />
  );
}

function SunRay({ index }) {
  return (
    <div className='sun-ray' style={{
      transform: `rotate(${index * 45}deg)`, animationDelay: (index * -2.5) + 's',
    }} />
  );
}

function ThunderFlash() {
  return <div className='thunder-flash' />;
}

function Star({ top, left, size, duration, delay }) {
  return (
    <div className='star' style={{
      top: top + '%', left: left + '%', width: size + 'px', height: size + 'px',
      animationDuration: duration + 's', animationDelay: delay + 's',
    }} />
  );
}

function ShootingStar() {
  const top = useMemo(() => Math.random() * 40, []);
  const left = useMemo(() => Math.random() * 60, []);
  const delay = useMemo(() => Math.random() * 8, []);

  return (
    <div className='shooting-star' style={{
      top: top + '%', left: left + '%', animationDelay: delay + 's',
    }} />
  );
}

const WEATHER_BG = {
  clear: 'linear-gradient(180deg, rgba(135,206,250,0.15) 0%, rgba(255,200,100,0.05) 60%, transparent 100%)',
  clearDark: 'linear-gradient(180deg, rgba(10,15,40,0.95) 0%, rgba(20,30,70,0.6) 50%, transparent 100%)',
  cloudy: 'linear-gradient(180deg, rgba(186,210,235,0.12) 0%, transparent 50%)',
  cloudyDark: 'linear-gradient(180deg, rgba(20,25,45,0.9) 0%, rgba(30,40,60,0.4) 50%, transparent 100%)',
  overcast: 'linear-gradient(180deg, rgba(148,163,184,0.15) 0%, transparent 50%)',
  overcastDark: 'linear-gradient(180deg, rgba(30,35,50,0.9) 0%, rgba(40,50,70,0.4) 50%, transparent 100%)',
  rain: 'linear-gradient(180deg, rgba(100,116,139,0.2) 0%, transparent 50%)',
  rainDark: 'linear-gradient(180deg, rgba(15,20,35,0.9) 0%, rgba(25,35,55,0.4) 50%, transparent 100%)',
  snow: 'linear-gradient(180deg, rgba(226,232,240,0.15) 0%, transparent 50%)',
  snowDark: 'linear-gradient(180deg, rgba(20,25,45,0.85) 0%, rgba(35,45,65,0.4) 50%, transparent 100%)',
  thunder: 'linear-gradient(180deg, rgba(51,65,85,0.3) 0%, transparent 50%)',
  thunderDark: 'linear-gradient(180deg, rgba(10,15,30,0.95) 0%, rgba(20,30,50,0.5) 50%, transparent 100%)',
  fog: 'linear-gradient(180deg, rgba(148,163,184,0.15) 0%, transparent 50%)',
  fogDark: 'linear-gradient(180deg, rgba(25,30,45,0.85) 0%, rgba(35,45,60,0.4) 50%, transparent 100%)',
};

const HORIZON_GLOW = {
  sunset: 'linear-gradient(to top, rgba(255,140,50,0.15), transparent)',
  sunrise: 'linear-gradient(to top, rgba(255,180,80,0.12), transparent)',
  night: 'linear-gradient(to top, rgba(30,50,100,0.08), transparent)',
  day: 'transparent',
};

function getWeatherType(code) {
  if (code === 0) return 'clear';
  if (code <= 2) return 'cloudy';
  if (code === 3) return 'overcast';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95) return 'thunder';
  return 'clear';
}

function isSunriseSunset() {
  const h = new Date().getHours();
  return (h >= 5 && h < 7) || (h >= 17 && h < 19);
}

export default function WeatherBackground({ weatherCode, isDay }) {
  const weatherType = getWeatherType(weatherCode);
  const isRain = weatherType === 'rain' || weatherType === 'drizzle' || weatherType === 'thunder';
  const isSnow = weatherType === 'snow';
  const isFog = weatherType === 'fog';
  const isThunder = weatherType === 'thunder';
  const isClear = weatherType === 'clear';
  const showStars = !isDay && (isClear || weatherType === 'cloudy');
  const showSunRays = isDay && isClear;

  const bgKey = isDay ? weatherType : weatherType + 'Dark';
  const bg = WEATHER_BG[bgKey] || (isDay ? WEATHER_BG.clear : WEATHER_BG.clearDark);

  const horizonKey = !isDay ? 'night' : isSunriseSunset() ? 'sunset' : 'day';
  const horizon = HORIZON_GLOW[horizonKey];

  const stars = useMemo(() => {
    if (!showStars) return null;
    return Array.from({ length: 30 }, (_, i) => (
      <Star key={i} top={Math.random() * 60} left={Math.random() * 100}
        size={Math.random() * 2 + 1} duration={2 + Math.random() * 3} delay={Math.random() * 4} />
    ));
  }, [showStars]);

  const shootingStars = useMemo(() => {
    if (!showStars) return null;
    return <ShootingStar />;
  }, [showStars]);

  const rainDrops = useMemo(() => {
    if (!isRain) return null;
    const count = isThunder ? 20 : weatherType === 'rain' ? 15 : 8;
    return Array.from({ length: count }, (_, i) => (
      <RainDrop key={i} delay={Math.random() * 1.2} />
    ));
  }, [isRain, weatherType, isThunder]);

  const snowFlakes = useMemo(() => {
    if (!isSnow) return null;
    return Array.from({ length: 10 }, (_, i) => (
      <SnowFlake key={i} delay={Math.random() * 2} />
    ));
  }, [isSnow]);

  const fogLayers = useMemo(() => {
    if (!isFog) return null;
    return Array.from({ length: 3 }, (_, i) => (
      <FogLayer key={i} index={i} />
    ));
  }, [isFog]);

  if (!weatherCode && weatherCode !== 0) return null;

  return (
    <div className='weather-bg fixed inset-0 pointer-events-none overflow-hidden' style={{ zIndex: 0 }}>
      <div className='absolute inset-0 transition-opacity duration-700' style={{ background: bg }} />
      <div className='horizon-glow' style={{ background: horizon }} />
      {showSunRays && Array.from({ length: 4 }, (_, i) => (
        <SunRay key={i} index={i} />
      ))}
      {stars}
      {shootingStars}
      {rainDrops}
      {snowFlakes}
      {fogLayers}
      {isThunder && <ThunderFlash />}
    </div>
  );
}