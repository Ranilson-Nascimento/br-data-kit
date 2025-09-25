
import { onlyDigits } from './validators.js';

export type UF = 'AC'|'AL'|'AP'|'AM'|'BA'|'CE'|'DF'|'ES'|'GO'|'MA'|'MT'|'MS'|'MG'|'PA'|'PB'|'PR'|'PE'|'PI'|'RJ'|'RN'|'RS'|'RO'|'RR'|'SC'|'SP'|'SE'|'TO';

function isDigits(s: string) { return /^\d+$/.test(s); }

const rules: Record<UF, (ie: string) => boolean> = {
  AC: (ie) => isDigits(ie) && ie.length in {13:1},
  AL: (ie) => isDigits(ie) && ie.length === 9,
  AP: (ie) => isDigits(ie) && ie.length === 9,
  AM: (ie) => isDigits(ie) && ie.length === 9,
  BA: (ie) => isDigits(ie) && (ie.length === 8 || ie.length === 9),
  CE: (ie) => isDigits(ie) && ie.length === 9,
  DF: (ie) => isDigits(ie) && ie.length === 13,
  ES: (ie) => isDigits(ie) && ie.length === 9,
  GO: (ie) => isDigits(ie) && ie.length === 9,
  MA: (ie) => isDigits(ie) && ie.length === 9,
  MT: (ie) => isDigits(ie) && ie.length === 11,
  MS: (ie) => isDigits(ie) && ie.length === 9,
  MG: (ie) => isDigits(ie) && ie.length === 13,
  PA: (ie) => isDigits(ie) && ie.length === 9,
  PB: (ie) => isDigits(ie) && ie.length === 9,
  PR: (ie) => isDigits(ie) && ie.length === 10,
  PE: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 14),
  PI: (ie) => isDigits(ie) && ie.length === 9,
  RJ: (ie) => isDigits(ie) && ie.length === 8,
  RN: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 10),
  RS: (ie) => isDigits(ie) && ie.length === 10,
  RO: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 14),
  RR: (ie) => isDigits(ie) && ie.length === 9,
  SC: (ie) => isDigits(ie) && ie.length === 9,
  SP: (ie) => {
    const s = ie.toUpperCase();
    if (s.length === 12) {
      if (/^P\d{11}$/.test(s)) return true;
      if (/^\d{12}$/.test(s)) return true;
    }
    return false;
  },
  SE: (ie) => isDigits(ie) && ie.length === 9,
  TO: (ie) => isDigits(ie) && (ie.length === 9 || ie.length === 11),
};

export function isIE(uf: string, ie: string): boolean {
  const clean = (ie||'').replace(/[.\-\/\s]/g,'');
  const UF = (uf||'').toUpperCase() as UF;
  if (!(UF in rules)) return false;
  return rules[UF](clean);
}

// --- Official checksum implementations ---

// RJ: 8 digits, 7 + DV. Weights 2..7, then 2 (cycle) (based on SEFAZ-RJ spec).
// sum = Σ(d[i] * w[i]); dv = 11 - (sum % 11); if dv >= 10 -> 0
function dvRJ(base7: string): number {
  const weights = [2, 7, 6, 5, 4, 3, 2]; // applied to digits 0..6
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += parseInt(base7[i],10) * weights[i];
  let dv = 11 - (sum % 11);
  if (dv >= 10) dv = 0;
  return dv;
}

function validateRJ(ie: string): boolean {
  if (!rules['RJ'](ie)) return false;
  const d = ie;
  const dv = dvRJ(d.slice(0,7));
  return dv === parseInt(d[7],10);
}

// PR: 10 digits, 8 + 2 DVs. Both DVs mod 11 with weights 3..7.. (7..2) descending.
// DV1: sobre d0..d7 com pesos 3..2; DV2: sobre d0..d7 + DV1 com mesmos pesos.
function dvPR(base8: string): number {
  const weights = [3,2,7,6,5,4,3,2];
  let sum = 0;
  for (let i=0;i<8;i++) sum += parseInt(base8[i],10)*weights[i];
  let mod = sum % 11;
  let dv = 11 - mod;
  if (dv >= 10) dv = 0;
  return dv;
}

function validatePR(ie: string): boolean {
  if (!rules['PR'](ie)) return false;
  const d = ie;
  const dv1 = dvPR(d.slice(0,8));
  const dv2 = dvPR(d.slice(0,8) + String(dv1));
  return dv1 === parseInt(d[8],10) && dv2 === parseInt(d[9],10);
}

// SP/MG: checksums complexos (regras específicas). Manteremos estrutural por ora.
function validateSP(_ie: string): boolean { return true; }
function validateMG(_ie: string): boolean { return true; }

export function isIEWithChecksum(uf: string, ie: string): boolean {
  const clean = (ie||'').replace(/[.\-\/\s]/g,'');
  const UF = (uf||'').toUpperCase() as UF;
  // Primeiro: checagem estrutural
  if (!isIE(UF, clean)) return false;
  switch (UF) {
    case 'RJ': return validateRJ(clean);
    case 'PR': return validatePR(clean);
    case 'SP': return validateSPChecksum(clean);
    case 'MG': return validateMGChecksum(clean);
    default:
      // UFs restantes: por enquanto sem DV oficial; cair no estrutural
      return true;
  }
}

// --- SP & MG official checksums ---

// SP: 12 chars (9th and 12th are DVs). For rural starting with 'P', manteremos estrutural por ora.
function dvSP1(first8: string): number {
  const weights = [1,3,4,5,6,7,8,10];
  let sum = 0;
  for (let i=0;i<8;i++) sum += parseInt(first8[i],10) * weights[i];
  const r = sum % 11;
  return r % 10; // "algarismo mais à direita" do resto
}
function dvSP2(first11: string): number {
  const weights = [3,2,10,9,8,7,6,5,4,3,2];
  let sum = 0;
  for (let i=0;i<11;i++) sum += parseInt(first11[i],10) * weights[i];
  const r = sum % 11;
  return r % 10;
}
function validateSPChecksum(ie: string): boolean {
  // IE SP: 12 dígitos numéricos ou 'P' + 11. Para 'P', manter estrutural.
  if (!/^\d{12}$/.test(ie)) return true; // estrutural já foi checada; 'P' cases return true here
  const d = ie;
  const d1 = dvSP1(d.slice(0,8));
  if (d1 !== parseInt(d[8],10)) return false;
  const d2 = dvSP2(d.slice(0,11));
  return d2 === parseInt(d[11],10);
}

// MG: 13 dígitos (3 + 8 + 2 DVs).
// D1: inserir zero após o 3º dígito -> 12 dígitos; multiplicar por pesos alternados 1 e 2 da esquerda para a direita;
// somar os dígitos dos produtos (ex.: 12 -> 1+2=3); DV1 = (10 - (soma % 10)) % 10
function dvMG1(first11: string): number {
  // inserir '0' após o 3º dígito
  const base12 = first11.slice(0,3) + '0' + first11.slice(3);
  let sum = 0;
  for (let i=0;i<12;i++) {
    const w = (i % 2) === 0 ? 1 : 2;
    const p = parseInt(base12[i],10) * w;
    sum += Math.floor(p/10) + (p % 10); // soma de dígitos
  }
  return (10 - (sum % 10)) % 10;
}
// D2: sobre os 12 primeiros dígitos (inclui D1 na 12ª posição), aplicar pesos [3,2,11,10,9,8,7,6,5,4,3,2];
// soma, mod 11; DV2 = 11 - (soma % 11); se resultado for 10 ou 11 => 0.
function dvMG2(first12: string): number {
  const weights = [3,2,11,10,9,8,7,6,5,4,3,2];
  let sum = 0;
  for (let i=0;i<12;i++) sum += parseInt(first12[i],10) * weights[i];
  const mod = sum % 11;
  const dv = 11 - mod;
  return (dv === 10 || dv === 11) ? 0 : dv;
}
function validateMGChecksum(ie: string): boolean {
  if (!/^\d{13}$/.test(ie)) return false;
  const base11 = ie.slice(0,11);
  const d1 = dvMG1(base11);
  if (d1 !== parseInt(ie[11],10)) return false;
  const d2 = dvMG2(base11 + String(d1));
  return d2 === parseInt(ie[12],10);
}
