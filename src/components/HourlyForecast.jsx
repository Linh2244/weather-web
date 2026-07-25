import { memo, useMemo } from 'react';
import WeatherIcon from './WeatherIcon';
import { formatHour, formatTime, getWeatherDescription } from '../utils/formatters';
import { SunsetIcon, DropletIcon } from './Icons';

const HourlyForecast = memo(function HourlyForecast({ data }) {
  if (!data?.hourly || !data?.daily) return null;

  const hours = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const times = data.hourly.time;
    const startIdx = times.findIndex((t) => new Date(t).getHours() >= currentHour);
    const idx = startIdx >= 0 ? startIdx : 0;
    const sunsetTime = data.daily.sunset?.[0] ? new Date(data.daily.sunset[0]).getTime() : null;

    let sunsetIdx = -1;
    if (sunsetTime) {
      let minDiff = Infinity;
      data.hourly.time.forEach((t, i) => {
        const diff = Math.abs(new Date(t).getTime() - sunsetTime);
        if (diff < minDiff) { minDiff = diff; sunsetIdx = i; }
      });
    }

    const items = data.hourly.time.slice(idx, idx + 24).map((t, i) => {
      const idx2 = idx + i;
      return {
        time: t,
        temp: Math.round(data.hourly.temperature_2m[idx2]),
        precip: data.hourly.precipitation_probability[idx2] || 0,
        code: data.hourly.weather_code[idx2],
        isNow: i === 0,
        isSunset: sunsetIdx >= 0 && idx2 === sunsetIdx,
      };
    });
    return items;
  }, [data]);

  if (hours.length === 0) return null;

  const temps = hours.map(h => h.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = Math.max(maxTemp - minTemp, 5);

  const svgW = hours.length * 48;
  const svgH = 50;
  const padL = 20;
  const padR = 20;
  const padT = 5;
  const padB = 5;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const points = hours.map((h, i) => {
    const x = padL + (i / (hours.length - 1)) * chartW;
    const y = padT + chartH - ((h.temp - minTemp) / range) * chartH;
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const desc = getWeatherDescription(data.current?.weather_code);
  const minNightTemp = Math.min(...data.hourly.temperature_2m.slice(18, 30));

  return (
    <div className='glass-card'>
      <h3 className='text-[13px] font-semibold mb-3 tracking-wide' style={{ color: 'var(--text-muted)' }}>
        {desc}. Thấp {Math.round(minNightTemp)}°C.
      </h3>

      <div className='relative overflow-x-auto scrollbar-hide -mx-5 px-5'>
        <div className='flex gap-0' style={{ minWidth: hours.length * 48 }}>
          {hours.map((h, i) => (
            <div key={h.time} className='flex flex-col items-center gap-1' style={{ width: 48 }}>
              <span className='text-[10px] font-medium whitespace-nowrap' style={{ color: h.isSunset ? '#6366f1' : 'var(--text-muted)' }}>
                {h.isSunset ? 'Hoàng hôn' : h.isNow ? 'Bây giờ' : formatHour(h.time)}
              </span>
              <span style={{ opacity: h.isSunset ? 0.7 : 1, transform: h.isSunset ? 'scale(0.75)' : 'scale(0.65)', transformOrigin: 'center', display: 'inline-flex' }}>
                {h.isSunset ? <SunsetIcon size={26} /> : <WeatherIcon code={h.code} size={26} />}
              </span>
              <span className='text-[11px] font-semibold' style={{ color: 'var(--text-primary)' }}>{h.temp}°</span>
              {h.precip > 0 && (
                <span className='text-[9px] flex items-center gap-0.5' style={{ color: 'var(--accent)' }}>
                  <DropletIcon size={8} />{h.precip}%
                </span>
              )}
              {!h.precip && <span style={{ height: 13 }} />}
            </div>
          ))}
        </div>

        <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className='mt-1' style={{ overflow: 'visible' }}>
          <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2" fill="var(--accent)" opacity="0.6" />
          ))}
        </svg>
      </div>
    </div>
  );
});

export default HourlyForecast;
