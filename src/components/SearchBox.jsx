import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchLocation } from '../utils/api';
import { findClosestLocation, searchLocations } from '../utils/vietnamCities';
import { SearchIcon, LocationIcon } from './Icons';

export default function SearchBox({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const debounced = useDebounce(query);
  const ref = useRef();

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
    <div className='relative' ref={ref}>
      <div className='relative'>
        <span className='absolute left-3.5 top-1/2 -translate-y-1/2' style={{ color: 'var(--text-muted)' }}>
          <SearchIcon size={15} />
        </span>
        <input
          type='text'
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.length >= 2 && results.length > 0 && setOpen(true)}
          placeholder='Tìm kiếm địa điểm...'
          className='w-full pl-10 pr-10 py-2.5 rounded-2xl text-sm outline-none border-0 transition-all duration-200'
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
          className='absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-xl flex items-center justify-center transition-all disabled:opacity-50'
          style={{ color: gpsLoading ? 'var(--accent)' : 'var(--text-muted)' }}
          title='Vị trí hiện tại'
        >
          {gpsLoading ? (
            <span className='animate-spin'><LocationIcon size={15} /></span>
          ) : (
            <LocationIcon size={15} />
          )}
        </button>
      </div>
      {gpsError && (
        <div
          className='absolute top-full mt-2 w-full rounded-xl z-50 p-3 text-center text-xs'
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            color: '#ef4444',
          }}
        >
          {gpsError}
        </div>
      )}
      {open && results.length > 0 && (
        <div
          className='absolute top-full mt-2 w-full rounded-xl z-50 overflow-hidden'
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className='w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-2'
              style={{
                borderBottom: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              <LocationIcon size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span className='font-medium'>{r.name}</span>
              {r.province && <span style={{ color: 'var(--text-muted)' }}> · {r.province}</span>}
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div
          className='absolute top-full mt-2 w-full rounded-xl z-50 p-4 text-center text-sm'
          style={{
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-muted)',
          }}
        >
          Không tìm thấy địa điểm
        </div>
      )}
    </div>
  );
}