import { useEffect, useRef } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, AreaChart,
  Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const CHART_CONFIG = {
  temperature_2m: { label: 'Nhiệt độ', unit: '°C', color: '#f97316', type: 'line' },
  apparent_temperature: { label: 'Cảm giác như', unit: '°', color: '#a855f7', type: 'line' },
  relative_humidity_2m: { label: 'Độ ẩm', unit: '%', color: '#0ea5e9', type: 'line' },
  wind_speed_10m: { label: 'Gió', unit: 'km/h', color: '#14b8a6', type: 'line' },
  precipitation: { label: 'Lượng mưa', unit: 'mm', color: '#3b82f6', type: 'bar' },
  visibility: { label: 'Tầm nhìn', unit: 'km', color: '#8b5cf6', type: 'area' },
  surface_pressure: { label: 'Áp suất', unit: 'hPa', color: '#06b6d4', type: 'line' },
  dew_point_2m: { label: 'Điểm sương', unit: '°', color: '#10b981', type: 'line' },
  uv_index: { label: 'UV', unit: '', color: '#eab308', type: 'area' },
};

function formatHour(timeStr) {
  const d = new Date(timeStr);
  const h = d.getHours().toString().padStart(2, '0');
  return h + 'h';
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className='chart-tooltip'>
      <p className='chart-tooltip-time'>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className='chart-tooltip-value' style={{ color: p.color }}>
          {p.value} {p.name}
        </p>
      ))}
    </div>
  );
}

export default function ChartModal({ open, field, hourly, onClose }) {
  const overlayRef = useRef();
  const startY = useRef(0);
  const diffY = useRef(0);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const config = CHART_CONFIG[field];
  if (!config || !hourly?.time?.length || !hourly[field]) return null;

  const raw = hourly.time.map((t, i) => {
    let val = hourly[field]?.[i];
    if (field === 'visibility' && val != null) val = (val / 1000).toFixed(1);
    if (field === 'uv_index' && val != null) val = parseFloat(val.toFixed(1));
    if (val != null && typeof val === 'number') val = Math.round(val * 10) / 10;
    return { time: formatHour(t), rawTime: t, value: val };
  });

  const now = new Date();
  const currentHour = now.getHours();
  const startIdx = raw.findIndex((d) => {
    const h = parseInt(d.time);
    return h >= currentHour;
  });
  const idx = startIdx >= 0 ? startIdx : 0;
  const chartData = raw.slice(idx, idx + 24);

  const chartProps = {
    data: chartData,
    margin: { top: 8, right: 8, bottom: 4, left: -20 },
  };

  const handleTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const handleTouchMove = (e) => { diffY.current = e.touches[0].clientY - startY.current; };
  const handleTouchEnd = () => { if (diffY.current > 80) onClose(); diffY.current = 0; };

  const ChartComponent = config.type === 'bar' ? BarChart
    : config.type === 'area' ? AreaChart
    : LineChart;

  const DataComponent = config.type === 'bar' ? Bar
    : config.type === 'area' ? Area
    : Line;

  return (
    <div
      ref={overlayRef}
      className='chart-overlay'
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className='chart-modal animate-scale-in'>
        <div className='chart-header'>
          <div>
            <p className='chart-title'>{config.label}</p>
            <p className='chart-unit'>{config.unit}</p>
          </div>
          <button className='chart-close' onClick={onClose}>✕</button>
        </div>
        <div className='chart-body'>
          <ResponsiveContainer width='100%' height={240}>
            <ChartComponent {...chartProps}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
              <XAxis dataKey='time' tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={3} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--text-muted)', strokeDasharray: '3 3' }} />
              <DataComponent type='monotone' dataKey='value' stroke={config.color} fill={config.color} fillOpacity={0.15} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} radius={[4, 4, 0, 0]} />
            </ChartComponent>
          </ResponsiveContainer>
        </div>
        <div className='chart-footer'>
          <span className='chart-footer-label'>Vuốt xuống để đóng</span>
        </div>
      </div>
    </div>
  );
}
