
import { isCPF, isCNPJ } from '../src/validators';
import { describe, it, expect } from 'vitest';

describe('validators', () => {
  it('cpf válido', () => {
    expect(isCPF('390.533.447-05')).toBe(true);
  });
  it('cnpj válido', () => {
    expect(isCNPJ('19.131.243/0001-97')).toBe(true);
  });
});
