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

const CLOUD_SHAPES = [
  <svg key="cloud1" viewBox="0 0 120 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40c0-8 6-14 14-14 2-7 8-12 16-12 5 0 9 2 12 5 2-5 7-9 13-9 7 0 12 5 14 11 4-1 7 0 10 2 4 2 7 6 7 11 0 3-1 6-3 8H23c-2 0-3-1-3-2z"/>
    <ellipse cx="28" cy="42" rx="18" ry="8"/>
    <ellipse cx="54" cy="38" rx="22" ry="12"/>
    <ellipse cx="86" cy="40" rx="20" ry="9"/>
    <ellipse cx="104" cy="42" rx="14" ry="6"/>
  </svg>,
  <svg key="cloud2" viewBox="0 0 100 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 34c0-7 5-12 12-12 2-6 7-10 13-10 4 0 8 2 10 5 2-4 6-7 11-7 6 0 10 4 12 9 3-1 6 0 8 2 3 2 5 5 5 9 0 3-1 5-3 7H18c-2 0-3-1-3-3z"/>
    <ellipse cx="22" cy="36" rx="15" ry="7"/>
    <ellipse cx="46" cy="32" rx="18" ry="10"/>
    <ellipse cx="72" cy="34" rx="17" ry="8"/>
    <ellipse cx="88" cy="36" rx="12" ry="5"/>
  </svg>,
  <svg key="cloud3" viewBox="0 0 80 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 28c0-6 4-10 10-10 1-5 5-8 10-8 3 0 6 1 8 3 1-3 5-5 9-5 5 0 8 3 10 7 2-1 5 0 6 2 2 2 3 4 3 7 0 2-1 4-2 5H14c-1 0-2-1-2-1z"/>
    <ellipse cx="18" cy="30" rx="12" ry="6"/>
    <ellipse cx="38" cy="28" rx="15" ry="8"/>
    <ellipse cx="60" cy="30" rx="13" ry="6"/>
  </svg>,
  <svg key="cloud4" viewBox="0 0 60 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="20" rx="14" ry="8"/>
    <ellipse cx="30" cy="16" rx="16" ry="10"/>
    <ellipse cx="44" cy="20" rx="14" ry="7"/>
    <ellipse cx="52" cy="22" rx="10" ry="5"/>
  </svg>,
];

function BgCloud({ shapeIndex, className, style }) {
  return (
    <div className={'cloud ' + className} style={style}>
      {CLOUD_SHAPES[shapeIndex % CLOUD_SHAPES.length]}
    </div>
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
  const isCloudy = weatherType === 'cloudy';
  const isOvercast = weatherType === 'overcast';
  const showStars = !isDay && (isClear || isCloudy);
  const showClouds = !isClear && !isFog;
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

  const clouds = useMemo(() => {
    if (!showClouds) return null;
    const count = isOvercast ? 6 : isCloudy ? 4 : isThunder ? 3 : isRain ? 3 : isSnow ? 3 : 2;
    const baseOpacity = isOvercast ? 0.5 : isCloudy ? 0.35 : 0.2;
    const color = isDay ? 'rgba(255,255,255,' : 'rgba(200,210,230,';
    return Array.from({ length: count }, (_, i) => {
      const shapeIndex = i % CLOUD_SHAPES.length;
      const size = 0.6 + Math.random() * 0.8;
      const top = Math.random() * 25;
      const left = Math.random() * 80;
      const opacity = baseOpacity + Math.random() * 0.15;
      const dur = 25 + Math.random() * 25;
      const delay = Math.random() * -30;
      const animClass = i % 3 === 0 ? 'animate-cloud-drift-slow' : i % 3 === 1 ? 'animate-cloud-drift' : 'animate-cloud-drift-reverse';
      return (
        <BgCloud key={i} shapeIndex={shapeIndex}
          className={animClass}
          style={{
            top: top + '%', left: left + '%',
            width: size * 120 + 'px', height: size * 60 + 'px',
            opacity, color: color + opacity + ')',
            animationDuration: dur + 's', animationDelay: delay + 's',
          }} />
      );
    });
  }, [showClouds, isOvercast, isCloudy, isThunder, isRain, isSnow, isDay]);

  if (!weatherCode && weatherCode !== 0) return null;

  return (
    <div className='weather-bg fixed inset-0 pointer-events-none overflow-hidden' style={{ zIndex: 0 }}>
      <div className='absolute inset-0 transition-opacity duration-700' style={{ background: bg }} />
      <div className='horizon-glow' style={{ background: horizon }} />
      {showSunRays && Array.from({ length: 4 }, (_, i) => (
        <SunRay key={i} index={i} />
      ))}
      {clouds}
      {stars}
      {shootingStars}
      {rainDrops}
      {snowFlakes}
      {fogLayers}
      {isThunder && <ThunderFlash />}
    </div>
  );
}