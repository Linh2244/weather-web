import { memo, useState, useCallback, useMemo, useRef } from 'react';
import {
  UmbrellaIcon, DropletIcon, ThermometerIcon, WindIcon,
  EyeIcon, UVIcon, SunIcon, SnowflakeIcon, AlertIcon, MoonIcon,
} from './Icons';
import { getWindDirection, getAQIInfo } from '../utils/formatters';

function isRainCode(code) {
  if (code == null) return false;
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99);
}

function isThunderCode(code) {
  if (code == null) return false;
  return code >= 95 && code <= 99;
}

const WeatherAlertCarousel = memo(function WeatherAlertCarousel({ data, airQuality }) {
  const [active, setActive] = useState(0);
  const handleDot = useCallback((i) => setActive(i), []);
  const touchStartX = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current == null) return;
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(diff) < 50) return;
      if (diff > 0 && active > 0) setActive((a) => a - 1);
      if (diff < 0 && active < pages.length - 1) setActive((a) => a + 1);
    },
    [active, pages.length],
  );

  const pages = useMemo(() => {
    if (!data?.current) return [];
    const c = data.current;
    const hourly = data.hourly;
    const daily = data.daily;
    const result = [];

    const now = new Date();
    const currentHour = now.getHours();
    const startIdx = hourly?.time?.findIndex((t) => new Date(t).getHours() >= currentHour) || 0;
    const idx = startIdx >= 0 ? startIdx : 0;

    const tonightIndices = hourly?.time
      ?.map((t, i) => (new Date(t).getHours() >= 18 || new Date(t).getHours() <= 5 ? i : -1))
      ?.filter((i) => i >= 0 && i >= idx && i < idx + 14) || [];

    // === Page 1: chọn 1 tip phù hợp nhất với điều kiện thời tiết ===
    let page1 = null;
    const candidates = [];

    // Dông
    if (isThunderCode(c.weather_code) || hourly?.weather_code?.slice(idx, idx + 12)?.some((wc) => wc >= 95)) {
      candidates.push({ priority: 100, tip: { icon: <AlertIcon size={22} />, title: 'Cẩn thận khi có dông', desc: 'Sấm sét có thể xảy ra. Tránh ra ngoài trời.', value: null } });
    }

    // Mưa
    if (isRainCode(c.weather_code)) {
      candidates.push({ priority: 95, tip: { icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!', desc: 'Đang có mưa. Có thể sẽ tiếp tục.', value: c.precipitation ? c.precipitation.toFixed(1) + 'mm' : null } });
    } else {
      const nextRain = hourly?.precipitation?.slice(idx, idx + 12) || [];
      const total = nextRain.reduce((s, v) => s + (v || 0), 0);
      if (total > 0) {
        candidates.push({ priority: 90, tip: { icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!', desc: 'Có khả năng mưa sẽ đến trong vài giờ tới', value: total.toFixed(1) + 'mm' } });
      } else {
        const nextProb = hourly?.precipitation_probability?.slice(idx, idx + 12) || [];
        const maxProb = Math.max(...nextProb, 0);
        if (maxProb >= 60) {
          candidates.push({ priority: 85, tip: { icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!', desc: 'Khả năng cao sẽ có mưa', value: null } });
        } else if (daily?.precipitation_sum?.[0] > 0) {
          candidates.push({ priority: 80, tip: { icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!', desc: 'Hôm nay có mưa', value: daily.precipitation_sum[0].toFixed(1) + 'mm' } });
        }
      }
    }

    // Gió
    if (c.wind_speed_10m != null && c.wind_speed_10m >= 15) {
      candidates.push({ priority: 70, tip: { icon: <WindIcon size={22} />, title: c.wind_speed_10m + ' km/h', desc: 'Gió khá mạnh hôm nay. Hướng ' + getWindDirection(c.wind_direction_10m), value: null } });
    }

    // Nhiệt độ lạnh
    if (c.temperature_2m < 18) {
      candidates.push({ priority: 65, tip: { icon: <SnowflakeIcon size={22} />, title: Math.round(c.temperature_2m) + '°', desc: 'Giữ ấm khi ra ngoài.', value: null } });
    } else if (c.temperature_2m < 20) {
      candidates.push({ priority: 60, tip: { icon: <SnowflakeIcon size={22} />, title: Math.round(c.temperature_2m) + '°', desc: 'Nên mặc áo khoác.', value: null } });
    }

    // UV
    const uv = c.uv_index ?? daily?.uv_index_max?.[0];
    if (uv != null && uv >= 7) {
      candidates.push({ priority: 55, tip: { icon: <UVIcon size={22} />, title: 'UV ' + uv.toFixed(1), desc: 'Hạn chế ra ngoài vào buổi trưa.', value: null } });
    } else if (uv != null && uv >= 5) {
      candidates.push({ priority: 50, tip: { icon: <UVIcon size={22} />, title: 'UV ' + uv.toFixed(1), desc: 'Đừng quên kem chống nắng.', value: null } });
    } else if (uv != null && uv >= 3) {
      candidates.push({ priority: 30, tip: { icon: <UVIcon size={22} />, title: 'UV ' + uv.toFixed(1), desc: 'Đừng quên kem chống nắng.', value: null } });
    }

    // Chất lượng không khí
    if (airQuality?.current) {
      const aqi = airQuality.current.us_aqi || airQuality.current.european_aqi || 0;
      if (aqi >= 100) {
        const info = getAQIInfo(aqi);
        candidates.push({ priority: 45, tip: { icon: <EyeIcon size={22} />, title: 'AQI ' + Math.round(aqi), desc: 'Chất lượng không khí không tốt: ' + info.label, value: null } });
      }
    }

    // Đêm nay mát
    const tonightTemps = tonightIndices.map((i) => hourly?.temperature_2m?.[i]).filter((v) => v != null);
    if (tonightTemps.length > 0) {
      const minTonight = Math.min(...tonightTemps);
      if (minTonight < 23) {
        candidates.push({ priority: 35, tip: { icon: <MoonIcon size={22} />, title: Math.round(minTonight) + '°', desc: 'Đêm nay trời khá mát.', value: null } });
      }
    }

    // Gió nhẹ
    if (c.wind_speed_10m != null && c.wind_speed_10m >= 10 && candidates.every((p) => p.priority < 30)) {
      candidates.push({ priority: 20, tip: { icon: <WindIcon size={22} />, title: c.wind_speed_10m + ' km/h', desc: 'Có gió nhẹ. Hướng ' + getWindDirection(c.wind_direction_10m), value: null } });
    }

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.priority - a.priority);
      page1 = candidates[0].tip;
    }

    if (page1) result.push(page1);

    // === Page 2: Độ ẩm sẽ tạo cảm giác như ===
    result.push({
      icon: <DropletIcon size={22} />,
      title: 'Độ ẩm ' + c.relative_humidity_2m + '%',
      desc: 'Độ ẩm sẽ tạo cảm giác như ' + Math.round(c.apparent_temperature) + '°',
      value: Math.round(c.temperature_2m) + '°',
    });

    // === Page 3: Cảm giác như ngày mai ===
    if (hourly?.apparent_temperature) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().slice(0, 10);
      const tmwIndices = hourly.time
        .map((t, i) => (t.startsWith(tomorrowStr) ? i : -1))
        .filter((i) => i >= 0);
      if (tmwIndices.length > 0) {
        const temps = tmwIndices.map((i) => hourly.apparent_temperature[i]);
        const maxFeel = Math.round(Math.max(...temps));
        result.push({
          icon: <ThermometerIcon size={22} />,
          title: maxFeel + '°',
          desc: 'Cảm giác như ngày mai',
          value: null,
        });
      }
    }

    return result;
  }, [data, airQuality]);

  if (pages.length === 0) return null;

  const page = pages[active] || pages[0];

  return (
    <div
      className='glass-card'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className='flex items-start gap-3'>
        <div
          className='w-11 h-11 rounded-full flex items-center justify-center shrink-0'
          style={{ backgroundColor: 'var(--accent-soft)' }}
        >
          <span style={{ color: 'var(--accent)' }}>{page.icon}</span>
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold' style={{ color: 'var(--text-primary)' }}>{page.title}</p>
          <p className='text-xs mt-0.5' style={{ color: 'var(--text-secondary)' }}>{page.desc}</p>
        </div>
        {page.value && (
          <div className='flex items-center gap-1 shrink-0' style={{ color: 'var(--accent)' }}>
            <span className='text-sm font-semibold'>{page.value}</span>
          </div>
        )}
      </div>

      {pages.length > 1 && (
        <div className='flex items-center justify-center gap-1.5 mt-3'>
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              className='rounded-full transition-all duration-200'
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                backgroundColor: i === active ? 'var(--accent)' : 'var(--border)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default WeatherAlertCarousel;
