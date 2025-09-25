
import { useEffect, useMemo, useState } from 'react';
import { maskCEP } from '../formatters.js';
import { providers } from '../providers.js';

export function useCepAuto(initial = '', debounceMs = 400) {
  const [value, setValue] = useState(initial);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const masked = useMemo(() => maskCEP(value), [value]);

  useEffect(() => {
    const raw = (value||'').replace(/\D+/g,'');
    if (raw.length !== 8) { setData(null); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const d = await providers.fetchCEP(raw);
        setData(d);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(t);
  }, [value, debounceMs]);

  return { value: masked, setValue, data, loading };
}

export default { useCepAuto };
