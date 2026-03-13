
import { useMemo, useState } from 'react';

export type UseCurrencyMaskResult = {
  /**
   * Valor formatado em BRL (ex: "R$ 1.234,56").
   * Alias de `masked` para compatibilidade com a documentação.
   */
  value: string;
  /**
   * Mesmo valor de `value`, mantido por clareza semântica.
   */
  masked: string;
  /**
   * Valor numérico correspondente (ex: "1234,56" -> 1234.56).
   */
  raw: number;
  /**
   * Atualiza o valor base (aceita número ou string).
   * Útil para setar programaticamente o valor monetário.
   */
  setValue(next: number | string): void;
  /**
   * Mantido por compatibilidade: altera o valor "cru" interno.
   * Para novos usos, prefira `setValue`.
   */
  setRaw(next: string): void;
};

export function useCurrencyMask(initialNumber: number | string = ''): UseCurrencyMaskResult {
  const [rawInput, setRawInput] = useState(String(initialNumber));

  const { formatted, numeric } = useMemo(() => {
    const digits = String(rawInput).replace(/\D+/g, '');
    const cents = (digits || '0').replace(/^0+/, '') || '0';
    const num = Number(cents) / 100;
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
    return { formatted, numeric: num };
  }, [rawInput]);

  const setValue = (next: number | string) => {
    if (typeof next === 'number') {
      // Converte número para string mantendo duas casas decimais
      setRawInput(next.toFixed(2).replace('.', ','));
    } else {
      setRawInput(next);
    }
  };

  return {
    value: formatted,
    masked: formatted,
    raw: numeric,
    setValue,
    setRaw: setRawInput,
  };
}

export default { useCurrencyMask };
