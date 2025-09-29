
import { fetchCEP } from '../src/providers/cep';
import { fetchCNPJ } from '../src/providers/cnpj';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const g: any = globalThis as any;

beforeEach(() => {
  g.fetch = vi.fn(async (url: string) => {
    if (url.includes('/api/cep/')) {
      return { ok: true, json: async () => ({ cep: '01001000', state: 'SP', city: 'São Paulo' }) } as any;
    }
    if (url.includes('/api/cnpj/')) {
      return { ok: true, json: async () => ({ cnpj: '19131243000197', razao_social: 'ACME' }) } as any;
    }
    return { ok: true, json: async () => ({}) } as any;
  });
});

describe('providers', () => {
  it('cep mocked', async () => {
    const r = await fetchCEP('01001000');
    expect(r.city).toBeDefined();
  });
  it('cnpj mocked', async () => {
    const r = await fetchCNPJ('19131243000197');
    expect(r.cnpj).toBe('19131243000197');
  });
});
