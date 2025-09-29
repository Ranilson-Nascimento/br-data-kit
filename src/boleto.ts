
import { onlyDigits } from './validators.js';

type BoletoInfo = {
  barCode: string;
  amount?: number;
  expirationDate?: Date;
  isValid: boolean;
  type: 'bancario' | 'concessionaria' | 'desconhecido';
  refModulo?: 10 | 11;
  errors?: string[];
};

function mod10Bloco(bloco: string): number {
  let sum = 0, mult = 2;
  for (let i = bloco.length -1; i >= 0; i--) {
    let n = parseInt(bloco[i],10) * mult;
    if (n > 9) n = Math.floor(n/10) + (n%10);
    sum += n;
    mult = mult === 2 ? 1 : 2;
  }
  const dv = (10 - (sum % 10)) % 10;
  return dv;
}

function barcodeFromLinhaBancario(d: string): string {
  // 47 dígitos -> 44 (código de barras)
  const campo1 = d.slice(0,9);    // banco(3)+moeda(1)+cc(5)
  const dv1 = d.slice(9,10);
  const campo2 = d.slice(10,20);  // 10
  const dv2 = d.slice(20,21);
  const campo3 = d.slice(21,31);  // 10
  const dv3 = d.slice(31,32);
  const dvG = d.slice(32,33);
  const fator = d.slice(33,37);
  const valor = d.slice(37,47);
  const bancoMoeda = campo1.slice(0,4);
  const campoLivre = campo1.slice(4) + campo2 + campo3; // 5+10+10 = 25
  return bancoMoeda + dvG + fator + valor + campoLivre;
}

function fatorToDate(fator: string): Date | undefined {
  const n = parseInt(fator,10);
  if (!Number.isFinite(n) || n===0) return undefined;
  const base = new Date(1997, 9, 7); // 07/10/1997
  const dt = new Date(base.getTime() + (n*86400000));
  return dt;
}

export function isValidBoletoLinhaDigitavel(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length === 47) {
    // Bancário: validar DV de cada campo (mod10)
    const c1 = d.slice(0,9), dv1 = parseInt(d.slice(9,10),10);
    const c2 = d.slice(10,20), dv2 = parseInt(d.slice(20,21),10);
    const c3 = d.slice(21,31), dv3 = parseInt(d.slice(31,32),10);
    return mod10Bloco(c1) === dv1 && mod10Bloco(c2) === dv2 && mod10Bloco(c3) === dv3;
  }
  // Concessionária (48) – regras variam por carteira; aqui retornamos falso por padrão
  return false;
}

export function parseBoleto(input: string): BoletoInfo {
  const d = onlyDigits(input);
  const out: BoletoInfo = { barCode: '', isValid: false, type: 'desconhecido' };
  if (d.length === 47) {
    out.type = 'bancario';
    const valid = isValidBoletoLinhaDigitavel(d);
    out.isValid = valid;
    const bar = barcodeFromLinhaBancario(d);
    out.barCode = bar;
    const fator = bar.slice(5,9);
    const valorStr = bar.slice(9,19);
    const valor = parseInt(valorStr,10);
    if (!isNaN(valor) && valor>0) out.amount = valor/100;
    const dt = fatorToDate(fator);
    if (dt) out.expirationDate = dt;
    return out;
  }
  if (d.length === 48) {
    out.type = 'concessionaria';
    out.barCode = d;
    out.refModulo = detectConcessionariaModulo(d);
    // 4 blocos de 12: (11 base + 1 DV)
    const blocos = [0,12,24,36].map(i => d.slice(i, i+12));
    const valids = blocos.map(b => {
      const base = b.slice(0,11);
      const dv = parseInt(b.slice(11,12),10);
      const calc = out.refModulo === 10 ? mod10Bloco(base) : mod11Bloco(base);
      return calc === dv;
    });
    out.isValid = valids.every(Boolean);
    return out;
  }
  out.errors = ['Tamanho inválido (esperado 47 ou 48 dígitos)'];
  return out;
}


function mod11Bloco(bloco: string): number {
  let sum = 0, weight = 2;
  for (let i = bloco.length -1; i >= 0; i--) {
    sum += parseInt(bloco[i],10) * weight;
    weight = weight === 9 ? 2 : (weight + 1);
  }
  const resto = sum % 11;
  const dv = (resto === 0 || resto === 1) ? 0 : (11 - resto);
  return dv;
}

function detectConcessionariaModulo(d: string): 10 | 11 {
  // Regra comum de mercado: o 3º dígito (posição 2) indica o módulo (6 ou 7 -> mod 10; 8 ou 9 -> mod 11).
  const ind = parseInt(d[2],10);
  return (ind === 6 || ind === 7) ? 10 : 11;
}
