
import { useEffect, useState } from "react";
import { fetchCNPJ, CnpjResponse } from "../providers/cnpj";
import { useDebouncedValue } from "./useDebouncedValue";

export function useCnpj(input: string, opts?: { ttlMs?: number; receitawsUrl?: string }) {
  const value = useDebouncedValue(input, 500);
  const [data, setData] = useState<CnpjResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = (value || "").replace(/\D+/g, "");
    if (s.length !== 14) { setData(null); setError(null); return; }
    let cancelled = false;
    setLoading(true);
    fetchCNPJ(s, { ttlMs: opts?.ttlMs, receitawsUrl: opts?.receitawsUrl })
      .then((r) => { if (!cancelled) { setData(r); setError(null); } })
      .catch((e) => { if (!cancelled) { setError(String(e.message || e)); setData(null); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [value, opts?.ttlMs, opts?.receitawsUrl]);

  return { data, loading, error };
}
