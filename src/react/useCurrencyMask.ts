
import { useEffect, useMemo, useState } from 'react';

export function useCurrencyMask(initialNumber: number | string = '') {
  const [raw, setRaw] = useState(String(initialNumber));
  const value = useMemo(() => {
    const digits = String(raw).replace(/\D+/g,'');
    const cents = (digits || '0').replace(/^0+/, '') || '0';
    const num = Number(cents)/100;
    return new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(num);
  }, [raw]);
  return { value, setRaw };
}

export default { useCurrencyMask };
