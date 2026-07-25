import { useState, useEffect } from 'react';
import { DEFAULT_COORDS } from '../constants';

export function useGeolocation() {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, name: 'Vi tri cua ban' });
        setLoading(false);
      },
      () => { setLoading(false); },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  return { coords, setCoords, loading };
}
