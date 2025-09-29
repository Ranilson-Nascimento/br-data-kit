
import { onlyDigits } from './validators.js';

export function formatBRL(value: number, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', ...opts }).format(value);
}

export const maskCPF = (v: string) => {
  const d = onlyDigits(v).slice(0,11);
  return d.replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskCNPJ = (v: string) => {
  const d = onlyDigits(v).slice(0,14);
  return d.replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const maskCEP = (v: string) => {
  const d = onlyDigits(v).slice(0,8);
  return d.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
};

export const maskPhoneBR = (v: string) => {
  const d = onlyDigits(v).slice(0,11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
};

export const maskPIS = (v: string) => {
  const d = onlyDigits(v).slice(0,11);
  return d.replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{5})(\d)/, '$1.$2')
          .replace(/(\d{5})(\d{1,2})$/, '$1-$2');
};

export const maskRENAVAM = (v: string) => {
  let d = onlyDigits(v).slice(0,11);
  if (d.length === 9) d = '00'+d;
  if (d.length <= 9) return d;
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').replace(/-$/, '');
};

export const maskPlate = (v: string) => (v||'').toUpperCase().replace(/[^A-Z0-9-]/g,'').slice(0,8);
