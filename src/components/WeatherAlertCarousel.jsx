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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const WeatherAlertCarousel = memo(function WeatherAlertCarousel({ data, airQuality }) {
  const [active, setActive] = useState(0);
  const handleDot = useCallback((i) => setActive(i), []);
  const touchStartX = useRef(null);
  const pagesRef = useRef(0);

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
      if (diff < 0 && active < pagesRef.current - 1) setActive((a) => a + 1);
    },
    [active],
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

    // === Group 0: Các câu tip theo điều kiện ===
    const tips = [];

    // Dông
    if (isThunderCode(c.weather_code) || hourly?.weather_code?.slice(idx, idx + 12)?.some((wc) => wc >= 95)) {
      tips.push(...[
        'Cẩn thận khi có dông. Sấm sét có thể xảy ra trong khu vực.',
        'Tránh đứng dưới cây lớn khi có sấm sét.',
        'Gió giật có thể xuất hiện. Tìm nơi trú an toàn.',
        'Mưa lớn có thể đến nhanh. Hạn chế ở ngoài trời.',
        'Theo dõi diễn biến thời tiết nếu cần di chuyển.',
        'Điều kiện thời tiết có thể thay đổi nhanh.',
      ].map((d) => ({ icon: <AlertIcon size={22} />, title: 'Cẩn thận khi có dông', desc: d, value: null, priority: 100 })));
    }

    // Đang có mưa / dự báo mưa
    const rainTips = [
      'Đừng quên mang theo ô.',
      'Áo mưa sẽ hữu ích hôm nay.',
      'Đường có thể trơn sau cơn mưa.',
      'Mưa có thể kéo dài trong vài giờ tới.',
      'Tầm nhìn sẽ giảm khi mưa lớn.',
      'Hãy cẩn thận khi đi xe máy.',
      'Một số khu vực có thể xuất hiện ngập cục bộ.',
      'Giao thông có thể chậm hơn bình thường.',
      'Nhiệt độ sẽ giảm sau mưa.',
      'Mặt đường sẽ trơn hơn bình thường.',
      'Mưa sẽ giúp không khí dịu hơn.',
      'Cơn mưa có thể kết thúc vào cuối buổi.',
      'Khả năng mưa đang tăng.',
    ];
    if (isRainCode(c.weather_code)) {
      tips.push({ icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!',
        desc: 'Đang có mưa. ' + pickRandom(['Có thể sẽ tiếp tục.', 'Mưa nhỏ có thể xuất hiện bất chợt.', 'Hãy giữ các thiết bị điện tử khô ráo.']),
        value: c.precipitation ? c.precipitation.toFixed(1) + 'mm' : null, priority: 95 });
    } else {
      const nextRain = hourly?.precipitation?.slice(idx, idx + 12) || [];
      const total = nextRain.reduce((s, v) => s + (v || 0), 0);
      if (total > 0) {
        tips.push({ icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!',
          desc: pickRandom(rainTips), value: total.toFixed(1) + 'mm', priority: 90 });
      } else {
        const nextProb = hourly?.precipitation_probability?.slice(idx, idx + 12) || [];
        const maxProb = Math.max(...nextProb, 0);
        if (maxProb >= 60) {
          tips.push({ icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!',
            desc: pickRandom(rainTips), value: null, priority: 85 });
        } else if (daily?.precipitation_sum?.[0] > 0) {
          tips.push({ icon: <UmbrellaIcon size={22} />, title: 'Nhớ lấy ô!',
            desc: pickRandom(rainTips), value: daily.precipitation_sum[0].toFixed(1) + 'mm', priority: 80 });
        }
      }
    }

    // Gió
    if (c.wind_speed_10m != null) {
      if (c.wind_speed_10m >= 15) {
        tips.push({ icon: <WindIcon size={22} />, title: c.wind_speed_10m + ' km/h',
          desc: pickRandom([
            'Gió đang thổi khá mạnh.',
            'Gió sẽ mạnh hơn vào buổi chiều.',
            'Giữ chắc các vật dụng nhẹ.',
            'Cẩn thận khi điều khiển xe trên cầu.',
            'Cây cối có thể rung lắc mạnh.',
            'Nhiệt độ cảm nhận có thể thấp hơn thực tế.',
          ]), value: 'Hướng ' + getWindDirection(c.wind_direction_10m), priority: 70 });
      } else if (c.wind_speed_10m >= 5) {
        tips.push({ icon: <WindIcon size={22} />, title: c.wind_speed_10m + ' km/h',
          desc: pickRandom([
            'Gió nhẹ giúp thời tiết dễ chịu hơn.',
            'Thời tiết thích hợp để thông gió trong nhà.',
            'Gió sẽ giảm dần vào tối nay.',
          ]), value: 'Hướng ' + getWindDirection(c.wind_direction_10m), priority: 15 });
      }
    }

    // Nắng / UV cao
    const uv = c.uv_index ?? daily?.uv_index_max?.[0];
    if (uv != null) {
      if (uv >= 7) {
        tips.push({ icon: <UVIcon size={22} />, title: 'UV ' + uv.toFixed(1),
          desc: pickRandom([
            'Ánh nắng khá mạnh vào buổi trưa.',
            'Nên tránh vận động mạnh giữa trưa.',
            'Chỉ số UV đang ở mức cao.',
            'Hãy tìm bóng râm nếu ở ngoài quá lâu.',
            'Hạn chế ra ngoài vào buổi trưa.',
          ]), value: null, priority: 55 });
        tips.push({ icon: <SunIcon size={22} />, title: Math.round(c.temperature_2m) + '°',
          desc: pickRandom([
            'Đừng quên mang theo nước uống.',
            'Mũ và kính râm sẽ giúp bạn thoải mái hơn.',
            'Quần áo sáng màu sẽ dễ chịu hơn.',
            'Nắng có thể khiến mặt đường nóng hơn bình thường.',
            'Cửa kính gần cửa sổ có thể hấp thụ nhiều nhiệt.',
          ]), value: null, priority: 40 });
      } else if (uv >= 5) {
        tips.push({ icon: <UVIcon size={22} />, title: 'UV ' + uv.toFixed(1),
          desc: pickRandom([
            'Kem chống nắng sẽ hữu ích hôm nay.',
            'Đừng quên kem chống nắng.',
            'Ánh nắng sẽ kéo dài đến cuối chiều.',
          ]), value: null, priority: 50 });
        tips.push({ icon: <SunIcon size={22} />, title: Math.round(c.temperature_2m) + '°',
          desc: pickRandom([
            'Đừng quên mang theo nước uống.',
            'Mũ và kính râm sẽ giúp bạn thoải mái hơn.',
            'Nhiệt độ sẽ tăng dần trong ngày.',
          ]), value: null, priority: 38 });
      } else if (uv >= 3) {
        tips.push({ icon: <UVIcon size={22} />, title: 'UV ' + uv.toFixed(1),
          desc: pickRandom([
            'Kem chống nắng sẽ hữu ích hôm nay.',
            'Đừng quên kem chống nắng.',
          ]), value: null, priority: 30 });
      }
    }

    // Nóng
    if (c.temperature_2m >= 30) {
      tips.push({ icon: <ThermometerIcon size={22} />, title: Math.round(c.temperature_2m) + '°',
        desc: pickRandom([
          'Hôm nay nhiệt độ khá cao.',
          'Uống nước thường xuyên sẽ giúp cơ thể dễ chịu hơn.',
          'Nên nghỉ ngơi ở nơi thoáng mát.',
          'Nhiệt độ có thể vượt mức trung bình.',
        ]), value: null, priority: 42 });
    }

    // Lạnh
    if (c.temperature_2m < 20) {
      const coldTips = c.temperature_2m < 18
        ? ['Giữ ấm khi ra ngoài.', 'Hãy mặc thêm áo nếu ra ngoài.', 'Gió lạnh khiến nhiệt độ cảm nhận giảm.']
        : ['Nên mặc áo khoác.', 'Không khí mát hơn vào sáng sớm.', 'Buổi tối sẽ lạnh hơn ban ngày.'];
      const extraCold = [
        'Chênh lệch nhiệt độ ngày và đêm khá lớn.',
        'Sáng sớm có thể se lạnh.',
        'Nhiệt độ sẽ giảm sau khi mặt trời lặn.',
        'Độ ẩm cao có thể khiến cảm giác lạnh rõ hơn.',
      ];
      tips.push({ icon: <SnowflakeIcon size={22} />, title: Math.round(c.temperature_2m) + '°',
        desc: pickRandom(coldTips), value: null,
        priority: c.temperature_2m < 18 ? 65 : 60 });
      tips.push({ icon: <SnowflakeIcon size={22} />, title: Math.round(c.temperature_2m) + '°',
        desc: pickRandom(extraCold), value: null,
        priority: c.temperature_2m < 16 ? 58 : 28 });
    }

    // Đêm nay mát
    const tonightTemps = tonightIndices.map((i) => hourly?.temperature_2m?.[i]).filter((v) => v != null);
    if (tonightTemps.length > 0) {
      const minTonight = Math.min(...tonightTemps);
      if (minTonight < 23) {
        tips.push({ icon: <MoonIcon size={22} />, title: Math.round(minTonight) + '°',
          desc: pickRandom([
            'Đêm nay trời khá mát.',
            'Hãy giữ ấm nếu ở ngoài lâu.',
            'Không khí lạnh đang tăng cường.',
          ]), value: null, priority: 35 });
      }
    }

    // Chất lượng không khí
    if (airQuality?.current) {
      const aqi = airQuality.current.us_aqi || airQuality.current.european_aqi || 0;
      if (aqi >= 100) {
        const info = getAQIInfo(aqi);
        tips.push({ icon: <EyeIcon size={22} />, title: 'AQI ' + Math.round(aqi),
          desc: 'Chất lượng không khí không tốt: ' + info.label + '.', value: null, priority: 45 });
      } else if (aqi <= 50 && aqi > 0) {
        tips.push({ icon: <EyeIcon size={22} />, title: 'AQI ' + Math.round(aqi),
          desc: pickRandom([
            'Không khí hôm nay khá trong lành.',
            'Chất lượng không khí đang ở mức tốt.',
          ]), value: null, priority: 5 });
      }
    }

    // Trời quang / ít mây
    const wc = c.weather_code;
    if (wc === 0 || wc === 1) {
      tips.push({ icon: <SunIcon size={22} />, title: Math.round(c.temperature_2m) + '°',
        desc: pickRandom([
          'Trời quang, ít mây.',
          'Tầm nhìn ngoài trời rất tốt.',
          'Hôm nay thích hợp để phơi quần áo.',
          'Thời tiết thích hợp cho các hoạt động ngoài trời.',
          'Thời tiết ổn định trong phần lớn thời gian.',
          'Nhiệt độ cảm nhận có thể cao hơn nhiệt độ thực tế.',
        ]), value: null, priority: 10 });
    }

    // Nhiều mây / u ám
    if (wc === 2 || wc === 3) {
      tips.push({ icon: <MoonIcon size={22} />, title: '',
        desc: pickRandom([
          'Bầu trời nhiều mây nhưng vẫn khô ráo.',
          'Thời tiết khá dễ chịu.',
          'Nhiệt độ ít thay đổi trong ngày.',
          'Ánh nắng xuất hiện từng lúc.',
          'Không khí mát hơn so với hôm qua.',
          'Mây có xu hướng tăng vào buổi chiều.',
          'Mây sẽ tan dần vào cuối ngày.',
          'Thời tiết phù hợp để đi dạo.',
          'Mặt trời sẽ xuất hiện xen kẽ giữa các đám mây.',
        ]), value: null, priority: 8 });
    }

    // Độ ẩm cao
    if (c.relative_humidity_2m >= 80) {
      tips.push({ icon: <DropletIcon size={22} />, title: c.relative_humidity_2m + '%',
        desc: pickRandom([
          'Độ ẩm hiện ở mức cao.',
          'Không khí khá ẩm. Có thể cảm thấy hơi ngột ngạt.',
        ]), value: null, priority: 12 });
    }

    // Sương mù
    if (wc === 45 || wc === 48) {
      tips.push({ icon: <EyeIcon size={22} />, title: '',
        desc: pickRandom([
          'Tầm nhìn có thể bị hạn chế.',
          'Hãy bật đèn khi lái xe nếu cần.',
          'Đi chậm hơn để đảm bảo an toàn.',
          'Sương mù sẽ tan khi mặt trời lên cao.',
          'Giữ khoảng cách an toàn khi tham gia giao thông.',
          'Buổi sáng phủ một lớp sương nhẹ.',
          'Tầm nhìn có thể cải thiện trong vài giờ tới.',
          'Hãy quan sát kỹ khi di chuyển.',
          'Một buổi sáng yên tĩnh với màn sương.',
        ]), value: null, priority: 25 });
    }

    // Thời tiết ổn định / chung chung
    tips.push({ icon: <EyeIcon size={22} />, title: '',
      desc: pickRandom([
        'Thời tiết ổn định trong vài giờ tới.',
        'Điều kiện thời tiết hiện khá ổn định.',
        'Không có dấu hiệu mưa trong thời gian tới.',
        'Điều kiện thời tiết thuận lợi cho việc di chuyển.',
        'Độ ẩm ở mức dễ chịu.',
        'Không khí khá ổn định.',
        'Không khí hôm nay khá ẩm.',
      ]), value: null, priority: 3 });

    // === Sắp xếp tips theo priority, chọn tip cao nhất làm page 1 ===
    if (tips.length > 0) {
      tips.sort((a, b) => b.priority - a.priority);
      result.push(tips[0]);
    }

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
        const tmwTemps = tmwIndices.map((i) => hourly.apparent_temperature[i]);
        const maxFeel = Math.round(Math.max(...tmwTemps));
        result.push({
          icon: <ThermometerIcon size={22} />,
          title: maxFeel + '°',
          desc: 'Cảm giác như ngày mai',
          value: null,
        });
      }
    }

    // === Additional tips (thêm 2-3 tips phụ từ các điều kiện khác) ===
    if (tips.length > 1) {
      const added = new Set([0]);
      const extraCount = Math.min(tips.length - 1, 3);
      let attempts = 0;
      while (added.size < extraCount + 1 && attempts < 20) {
        const ri = Math.floor(Math.random() * tips.length);
        if (!added.has(ri)) {
          added.add(ri);
          result.push(tips[ri]);
        }
        attempts++;
      }
    }

    return result;
  }, [data, airQuality]);

  pagesRef.current = pages.length;

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
