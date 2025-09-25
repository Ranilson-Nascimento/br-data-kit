
import { onlyDigits } from "./validators";

export function maskCPF(v: string): string {
  const s = onlyDigits(v).slice(0, 11);
  return s.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, a, b, c, d) =>
    d ? `${a}.${b}.${c}-${d}` : `${a}.${b}.${c}`
  );
}

export function maskCNPJ(v: string): string {
  const s = onlyDigits(v).slice(0, 14);
  return s.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, (m, a, b, c, d, e) =>
    e ? `${a}.${b}.${c}/${d}-${e}` : `${a}.${b}.${c}/${d}`
  );
}

export function maskCEP(v: string): string {
  const s = onlyDigits(v).slice(0, 8);
  return s.replace(/(\d{5})(\d{0,3})/, (m, a, b) => (b ? `${a}-${b}` : a));
}

export function formatBRL(n: number | string): string {
  const val = typeof n === "string" ? Number(n) : n;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val || 0);
}

export function formatPhoneBR(v: string): string {
  const s = onlyDigits(v).slice(0, 11);
  if (s.length <= 10)
    return s.replace(/(\d{2})(\d{4})(\d{0,4})/, (m, a, b, c) => (c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`));
  return s.replace(/(\d{2})(\d{5})(\d{0,4})/, (m, a, b, c) => (c ? `(${a}) ${b}-${c}` : `(${a}) ${b}`));
}
