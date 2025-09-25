
import { formatBRL, maskCPF, maskCNPJ, maskCEP } from '../src/formatters';
import { describe, it, expect } from 'vitest';

describe('formatters', () => {
  it('BRL', () => {
    expect(formatBRL(1234.56)).toContain('R$');
  });
  it('masks', () => {
    expect(maskCPF('39053344705')).toBe('390.533.447-05');
    expect(maskCNPJ('19131243000197')).toBe('19.131.243/0001-97');
    expect(maskCEP('01001000')).toBe('01001-000');
  });
});
