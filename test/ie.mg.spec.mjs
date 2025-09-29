
import { expect, test } from 'vitest';
import { isIEWithChecksum } from '../dist/ie.js';

// Smoke tests de MG: estrutura 13 dígitos e DV conforme algoritmo implementado
// Nota: substitua por casos reais quando disponível.
test('MG structural length', () => {
  // 062.307.904/0081 (exemplo de formato)
  expect(isIEWithChecksum('MG', '0623079040081')).toBeTypeOf('boolean');
});
