
import { useMemo, useState } from 'react';
import { maskPhoneBR } from '../formatters.js';

export function usePhoneMask(initial = '') {
  const [value, setValue] = useState(initial);
  const masked = useMemo(() => maskPhoneBR(value), [value]);
  return { value: masked, setValue };
}

export default { usePhoneMask };
