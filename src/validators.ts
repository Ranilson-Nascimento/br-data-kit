
const onlyDigits = (s: string) => (s||'').replace(/\D+/g, '');

// CPF
export function isCPF(input: string): boolean {
  const cpf = onlyDigits(input);
  if (!cpf || cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (base: string, fac: number) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i],10) * fac--;
    const rest = (sum*10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calc(cpf.slice(0,9), 10);
  const d2 = calc(cpf.slice(0,10), 11);
  return d1 === parseInt(cpf[9],10) && d2 === parseInt(cpf[10],10);
}

// CNPJ
export function isCNPJ(input: string): boolean {
  const cnpj = onlyDigits(input);
  if (!cnpj || cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base: string) => {
    const weights = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    let sum = 0;
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i],10) * weights[i+ (weights.length - base.length)];
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const d1 = calc(cnpj.slice(0,12));
  const d2 = calc(cnpj.slice(0,13));
  return d1 === parseInt(cnpj[12],10) && d2 === parseInt(cnpj[13],10);
}

// CEP
export function isCEP(input: string): boolean {
  const cep = onlyDigits(input);
  return cep.length === 8;
}

// Phone BR (10 ou 11 dígitos; celular 11 inicia com 9 no 3º dígito)
export function isPhoneBR(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length === 10) return true; // fixo
  if (d.length === 11) return d[2] === '9';
  return false;
}

// PIS/PASEP (módulo 11)
export function isPIS(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length !== 11) return false;
  const w = [3,2,9,8,7,6,5,4,3,2];
  let sum = 0;
  for (let i=0;i<10;i++) sum += parseInt(d[i],10)*w[i];
  const rest = sum % 11;
  const dv = rest < 2 ? 0 : 11 - rest;
  return dv === parseInt(d[10],10);
}

// RENAVAM (novo – 11 dígitos; dv mod 11 base 2..9)
export function isRENAVAM(input: string): boolean {
  let d = onlyDigits(input);
  if (d.length === 9) d = '00'+d; // normaliza para 11
  if (d.length !== 11) return false;
  const base = d.slice(0,10).split('').reverse();
  const weights = [2,3,4,5,6,7,8,9];
  let sum = 0;
  for (let i=0;i<base.length;i++) sum += parseInt(base[i],10)*weights[i % weights.length];
  const mod = sum % 11;
  const dv = (mod === 0 || mod === 1) ? 0 : (11 - mod);
  return dv === parseInt(d[10],10);
}

// CNH (SENATRAN)
export function isCNH(input: string): boolean {
  const d = onlyDigits(input);
  if (d.length !== 11) return false;
  const calc = (wStart: number) => {
    let sum = 0;
    for (let i=0;i<9;i++) sum += parseInt(d[i],10)*(wStart - i);
    let rest = sum % 11;
    return rest > 9 ? 0 : rest;
  };
  const d1 = calc(9);
  const d2 = (function(){
    let sum = 0;
    for (let i=0;i<9;i++) sum += parseInt(d[i],10)*(1 + i);
    let rest = sum % 11;
    return rest > 9 ? 0 : rest;
  })();
  return d1 === parseInt(d[9],10) && d2 === parseInt(d[10],10);
}

// Placa BR (antiga AAA-0000 ou Mercosul AAA0A00)
export function isPlateBR(input: string): boolean {
  const s = (input||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  return /^[A-Z]{3}\d{4}$/.test(s) || /^[A-Z]{3}\d[A-Z]\d{2}$/.test(s);
}

export { onlyDigits };
