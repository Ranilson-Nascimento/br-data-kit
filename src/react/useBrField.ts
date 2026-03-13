import { useMemo, useState } from 'react';
import {
  isCPF,
  isCNPJ,
  isCEP,
  isPhoneBR,
} from '../validators.js';
import {
  maskCPF,
  maskCNPJ,
  maskCEP,
  maskPhoneBR,
} from '../formatters.js';
import { useCurrencyMask, UseCurrencyMaskResult } from './useCurrencyMask.js';

export type BrFieldType = 'cpf' | 'cnpj' | 'cep' | 'phone' | 'currency';

export type BrFieldState = {
  /**
   * Valor "cru" digitado (sem máscara aplicada).
   */
  raw: string;
  /**
   * Valor com máscara aplicada (use em inputs controlados).
   */
  masked: string;
  /**
   * Flag de validade, usando os validadores oficiais do pacote.
   */
  valid: boolean;
  /**
   * Mensagem de erro amigável em pt-BR (ou null se estiver ok).
   */
  error: string | null;
  /**
   * Handler pronto para `onChange` / `onChangeText`.
   */
  onChange(next: string): void;
};

export type BrCurrencyFieldState = BrFieldState & Pick<UseCurrencyMaskResult, 'value' | 'raw' | 'setValue'>;

/**
 * Hook de alto nível pensado para formulários brasileiros.
 * Unifica máscara + validação para tipos comuns: CPF, CNPJ, CEP, telefone e moeda BRL.
 */
export function useBrField(type: 'cpf', initial?: string): BrFieldState;
export function useBrField(type: 'cnpj', initial?: string): BrFieldState;
export function useBrField(type: 'cep', initial?: string): BrFieldState;
export function useBrField(type: 'phone', initial?: string): BrFieldState;
export function useBrField(type: 'currency', initial?: number | string): BrCurrencyFieldState;
export function useBrField(type: BrFieldType, initial: string | number = ''): BrFieldState | BrCurrencyFieldState {
  if (type === 'currency') {
    const currency = useCurrencyMask(initial);
    const [raw, setRaw] = useState(String(initial));
    const masked = currency.value;
    const valid = true; // qualquer número é aceito; validações extras ficam a cargo do schema externo
    const error = null;

    const onChange = (next: string) => {
      setRaw(next);
      currency.setValue(next);
    };

    return {
      raw,
      masked,
      valid,
      error,
      onChange,
      value: currency.value,
      setValue: currency.setValue,
    } as BrCurrencyFieldState;
  }

  const [raw, setRaw] = useState(typeof initial === 'string' ? initial : String(initial));

  const { masked, valid } = useMemo(() => {
    const v = raw || '';
    switch (type) {
      case 'cpf':
        return { masked: maskCPF(v), valid: isCPF(v) };
      case 'cnpj':
        return { masked: maskCNPJ(v), valid: isCNPJ(v) };
      case 'cep':
        return { masked: maskCEP(v), valid: isCEP(v) };
      case 'phone':
        return { masked: maskPhoneBR(v), valid: isPhoneBR(v) };
      default:
        return { masked: v, valid: true };
    }
  }, [raw, type]);

  const error = useMemo(() => {
    if (!raw) return null;
    if (valid) return null;
    switch (type) {
      case 'cpf': return 'CPF inválido';
      case 'cnpj': return 'CNPJ inválido';
      case 'cep': return 'CEP inválido';
      case 'phone': return 'Telefone inválido';
      default: return 'Valor inválido';
    }
  }, [raw, valid, type]);

  const onChange = (next: string) => {
    setRaw(next);
  };

  return {
    raw,
    masked,
    valid,
    error,
    onChange,
  };
}

