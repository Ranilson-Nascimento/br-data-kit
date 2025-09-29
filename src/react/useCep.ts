
import { useEffect, useState } from "react";
import { fetchCEP, CepResponse } from "../providers/cep";
import { maskCEP } from "../formatters";
import { useDebouncedValue } from "./useDebouncedValue";

export function useCep(input: string, opts?: { ttlMs?: number }) {
  const value = useDebouncedValue(input, 400);
  const [data, setData] = useState<CepResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = value.replace(/\D+/g, "");
    if (s.length !== 8) { setData(null); setError(null); return; }
    let cancelled = false;
    setLoading(true);
    fetchCEP(s, { ttlMs: opts?.ttlMs })
      .then((r) => { if (!cancelled) { setData(r); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(String(e.message || e)); setData(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [value, opts?.ttlMs]);

  return { data, loading, error, masked: maskCEP(input) };
}
