
export function onlyDigits(v: string): string {
  return (v || "").replace(/\D+/g, "");
}

export function isCPF(v: string): boolean {
  const s = onlyDigits(v).padStart(11, "0");
  if (s.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(s[i], 10) * (10 - i);
  let d1 = 11 - (sum % 11);
  d1 = d1 > 9 ? 0 : d1;
  if (d1 !== parseInt(s[9], 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(s[i], 10) * (11 - i);
  let d2 = 11 - (sum % 11);
  d2 = d2 > 9 ? 0 : d2;
  return d2 === parseInt(s[10], 10);
}

export function isCNPJ(v: string): boolean {
  const s = onlyDigits(v).padStart(14, "0");
  if (s.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(s)) return false;
  const calc = (base: number) => {
    let sum = 0;
    let pos = base - 7;
    for (let i = 0; i < base; i++) {
      sum += parseInt(s[i], 10) * pos--;
      if (pos < 2) pos = 9;
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(12);
  const d2 = calc(13);
  return d1 === parseInt(s[12], 10) && d2 === parseInt(s[13], 10);
}
