
import { expect, test } from 'vitest';
import { isIEWithChecksum } from '../dist/ie.js';

// Caso oficial do site da SEFAZ-SP: 110.042.490.114
test('SP checksum official example', () => {
  expect(isIEWithChecksum('SP', '110042490114')).toBe(true);
});
