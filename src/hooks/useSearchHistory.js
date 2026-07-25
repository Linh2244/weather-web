import { useState, useCallback } from 'react';

const STORAGE_KEY = 'weather_search_history';
const MAX_ITEMS = 8;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export default function useSearchHistory() {
  const [history, setHistory] = useState(loadHistory);

  const saveLocation = useCallback((location) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (h) => !(h.lat === location.lat && h.lon === location.lon)
      );
      const next = [{ ...location }, ...filtered].slice(0, MAX_ITEMS);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { history, saveLocation, clearHistory };
}
