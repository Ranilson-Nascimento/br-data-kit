
import { globalCache } from './cache.js';
import { onlyDigits } from './validators.js';

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export type CEPData = {
  cep: string;
  state: string;
  city: string;
  neighborhood?: string;
  street?: string;
  service?: string;
  uf?: string;
};

export type CNPJData = any;

export const providers = {
  async fetchCEP(raw: string) : Promise<CEPData> {
    const cep = onlyDigits(raw);
    const key = `cep:${cep}`;
    const cached = globalCache.get<CEPData>(key);
    if (cached) return cached;
    // 1) BrasilAPI
    try {
      const data = await fetchJson(`https://brasilapi.com.br/api/cep/v2/${cep}`);
      const out: CEPData = {
        cep: (data.cep || cep).replace(/\D/g,''),
        state: data.state || data.uf,
        city: data.city || data.localidade,
        neighborhood: data.neighborhood || data.bairro,
        street: data.street || data.logradouro,
        service: 'brasilapi',
        uf: data.state || data.uf
      };
      globalCache.set(key, out);
      return out;
    } catch {}
    // 2) ViaCEP
    try {
      const data = await fetchJson(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) throw new Error('CEP não encontrado');
      const out: CEPData = {
        cep: (data.cep || cep).replace(/\D/g,''),
        state: data.uf,
        city: data.localidade,
        neighborhood: data.bairro,
        street: data.logradouro,
        service: 'viacep',
        uf: data.uf
      };
      globalCache.set(key, out);
      return out;
    } catch {}
    throw new Error('Falha ao buscar CEP em BrasilAPI e ViaCEP');
  },

  async fetchCNPJ(raw: string): Promise<CNPJData> {
    const cnpj = onlyDigits(raw);
    const key = `cnpj:${cnpj}`;
    const cached = globalCache.get<CNPJData>(key);
    if (cached) return cached;
    // 1) BrasilAPI
    try {
      const data = await fetchJson(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      globalCache.set(key, data);
      return data;
    } catch {}
    throw new Error('Falha ao buscar CNPJ (BrasilAPI)');
  }
};
