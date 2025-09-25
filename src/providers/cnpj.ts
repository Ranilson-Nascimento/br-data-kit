
import { globalCache } from "../cache";
import { httpJson } from "../http";
import { onlyDigits } from "../validators";

export type CnpjResponse = {
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  porte?: string;
  natureza_juridica?: string;
  abertura?: string;
  situacao_cadastral?: string;
  email?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  atividade_principal?: { code: string; text: string };
  atividades_secundarias?: { code: string; text: string }[];
  fonte?: string;
};

export type CnpjOptions = { ttlMs?: number; receitawsUrl?: string };

export async function fetchCNPJ(cnpj: string, opts: CnpjOptions = {}): Promise<CnpjResponse> {
  const s = onlyDigits(cnpj);
  if (s.length !== 14) throw new Error("CNPJ inválido");
  const key = `cnpj:${s}`;
  const cached = globalCache.get<CnpjResponse>(key);
  if (cached) return cached;

  try {
    // 1) BrasilAPI (sem API key)
    const a = await httpJson<any>(`https://brasilapi.com.br/api/cnpj/v1/${s}`, { timeoutMs: 9000 });
    const norm: CnpjResponse = {
      cnpj: s,
      razao_social: a.razao_social ?? a.razao,
      nome_fantasia: a.nome_fantasia,
      porte: a.porte,
      natureza_juridica: a.natureza_juridica,
      abertura: a.data_inicio_atividade ?? a.abertura,
      situacao_cadastral: a.situacao_cadastral ?? a.situacao,
      email: a.email,
      telefone: a.ddd_telefone_1 ?? a.telefone,
      cep: a.cep?.replace(/\D/g, ""),
      logradouro: a.logradouro,
      numero: a.numero,
      complemento: a.complemento,
      bairro: a.bairro,
      municipio: a.municipio ?? a.cidade,
      uf: a.uf,
      atividade_principal: a.cnae_fiscal_descricao ? { code: String(a.cnae_fiscal), text: a.cnae_fiscal_descricao } : undefined,
      atividades_secundarias: Array.isArray(a.cnaes_secundarios) ? a.cnaes_secundarios.map((x: any) => ({ code: String(x.codigo), text: x.descricao })) : undefined,
      fonte: "brasilapi"
    };
    globalCache.set(key, norm, opts.ttlMs);
    return norm;
  } catch {
    // 2) Fallback Receitaws (via proxy configurável)
    const base = opts.receitawsUrl ?? "https://receitaws.com.br/v1/cnpj";
    const b = await httpJson<any>(`${base}/${s}`, { timeoutMs: 9000 });
    if (b.status === "ERROR") throw new Error(b.message || "CNPJ não encontrado");
    const norm: CnpjResponse = {
      cnpj: s,
      razao_social: b.nome,
      nome_fantasia: b.fantasia,
      abertura: b.abertura,
      situacao_cadastral: b.situacao,
      email: b.email,
      telefone: b.telefone,
      cep: b.cep?.replace(/\D/g, ""),
      logradouro: b.logradouro,
      numero: b.numero,
      complemento: b.complemento,
      bairro: b.bairro,
      municipio: b.municipio,
      uf: b.uf,
      atividade_principal: Array.isArray(b.atividade_principal) && b.atividade_principal[0] ? { code: b.atividade_principal[0].code, text: b.atividade_principal[0].text } : undefined,
      atividades_secundarias: Array.isArray(b.atividades_secundarias) ? b.atividades_secundarias.map((x: any) => ({ code: x.code, text: x.text })) : undefined,
      fonte: "receitaws"
    };
    globalCache.set(key, norm, opts.ttlMs);
    return norm;
  }
}
