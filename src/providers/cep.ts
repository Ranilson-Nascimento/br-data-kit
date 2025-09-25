
import { globalCache } from "../cache";
import { httpJson } from "../http";
import { onlyDigits } from "../validators";

export type CepResponse = {
  cep: string;
  state: string; // UF
  city: string;
  neighborhood?: string;
  street?: string;
  service?: string;
};

export type CepOptions = { ttlMs?: number };

export async function fetchCEP(cep: string, opts: CepOptions = {}): Promise<CepResponse> {
  const key = `cep:${onlyDigits(cep)}`;
  const cached = globalCache.get<CepResponse>(key);
  if (cached) return cached;

  const s = onlyDigits(cep);
  if (s.length !== 8) throw new Error("CEP inválido");

  try {
    // 1) BrasilAPI
    const a = await httpJson<any>(`https://brasilapi.com.br/api/cep/v2/${s}`);
    const norm: CepResponse = {
      cep: a.cep ?? s,
      state: a.state ?? a.uf,
      city: a.city ?? a.cidade,
      neighborhood: a.neighborhood ?? a.bairro,
      street: a.street ?? a.logradouro,
      service: "brasilapi"
    };
    globalCache.set(key, norm, opts.ttlMs);
    return norm;
  } catch {
    // 2) ViaCEP fallback
    const b = await httpJson<any>(`https://viacep.com.br/ws/${s}/json/`);
    if (b.erro) throw new Error("CEP não encontrado");
    const norm: CepResponse = {
      cep: b.cep?.replace(/\D/g, "") ?? s,
      state: b.uf,
      city: b.localidade,
      neighborhood: b.bairro,
      street: b.logradouro,
      service: "viacep"
    };
    globalCache.set(key, norm, opts.ttlMs);
    return norm;
  }
}
