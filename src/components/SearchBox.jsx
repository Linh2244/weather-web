import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchLocation } from '../utils/api';
import { findClosestLocation, searchLocations } from '../utils/vietnamCities';
import { SearchIcon, LocationIcon } from './Icons';

export default function SearchBox({ onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const debounced = useDebounce(query);
  const ref = useRef();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounced.length < 2) { setResults([]); return; }
    setLoading(true);
    const local = searchLocations(debounced).map((loc) => ({
      id: 'local-' + loc.type + '-' + loc.name,
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      type: loc.type,
      province: loc.province || null,
    }));
    setResults(local);
    searchLocation(debounced)
      .then((r) => {
        const api = r.map((x) => ({ id: 'api-' + x.id, name: x.name, lat: x.latitude, lon: x.longitude, type: 'api', province: x.admin1 || null }));
        setResults([...local, ...api]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current || !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (r) => {
    const label = r.province ? r.name + ' · ' + r.province : r.name;
    onSelect({ lat: r.lat, lon: r.lon, name: label });
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const handleGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Trình duyệt không hỗ trợ GPS');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const loc = findClosestLocation(lat, lon);
        onSelect({ lat, lon, name: loc.name });
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        setGpsError('Không thể xác định vị trí');
        setTimeout(() => setGpsError(''), 3000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div ref={ref}>
      <div className='relative'>
        <span className='absolute left-4 top-1/2 -translate-y-1/2' style={{ color: 'var(--text-muted)' }}>
          <SearchIcon size={16} />
        </span>
        <input
          ref={inputRef}
          type='text'
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.length >= 2 && results.length > 0 && setOpen(true)}
          placeholder='Tìm kiếm địa điểm...'
          className='w-full pl-11 pr-12 py-3 rounded-2xl text-sm outline-none transition-all duration-200'
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={handleGps}
          disabled={gpsLoading}
          className='absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 hover:scale-110 active:scale-90'
          style={{ color: gpsLoading ? 'var(--accent)' : 'var(--text-muted)' }}
          title='Vị trí hiện tại'
        >
          <span className={gpsLoading ? 'animate-ping' : ''}>
            <LocationIcon size={16} />
          </span>
        </button>
      </div>
      {gpsError && (
        <div
          className='mt-2 rounded-2xl z-50 p-3 text-center text-xs animate-fade-in'
        >
          {gpsError}
        </div>
      )}
      {open && results.length > 0 && (
        <div
          className='mt-2 rounded-2xl z-50 overflow-hidden animate-fade-in'
        >
          {results.map((r, i) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className='w-full px-4 py-3.5 text-left text-sm transition-all flex items-center gap-3 hover:pl-5 active:scale-[0.98] animate-slide-in-up'
              style={{
                borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                color: 'var(--text-primary)',
                animationDelay: `${i * 50}ms`,
              }}
            >
              <LocationIcon size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <div className='flex-1 min-w-0'>
                <span className='font-medium'>{r.name}</span>
                {r.province && <span className='ml-1' style={{ color: 'var(--text-muted)' }}>{r.province}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div
          className='mt-2 rounded-2xl z-50 p-6 text-center animate-fade-in'
        >
          <SearchIcon size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 8px', opacity: 0.5 }} />
          <p className='text-sm' style={{ color: 'var(--text-muted)' }}>Không tìm thấy địa điểm</p>
        </div>
      )}
      {loading && open && (
        <div
          className='mt-2 rounded-2xl z-50 p-4 space-y-3 animate-fade-in'
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center gap-3 px-2'>
              <div className='w-5 h-5 rounded-full shimmer' />
              <div className='h-3 w-3/4 rounded shimmer' />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
