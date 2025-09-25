
import { globalCache } from './cache.js';

export type Municipio = { id: number; nome: string; microrregiao?: any; [k: string]: any };
export async function fetchMunicipios(uf: string, ttlMs = 1000*60*60) : Promise<Municipio[]> {
  const key = `ibge:municipios:${uf.toUpperCase()}`;
  const cached = globalCache.get<Municipio[]>(key);
  if (cached) return cached;
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha IBGE');
  const data = await res.json();
  globalCache.set(key, data, ttlMs);
  return data;
}
