
import { isIEWithChecksum } from '../dist/ie.js';

// Exemplos genéricos (valores aqui são apenas para fluxo de teste; substitua por casos reais quando tiver a base oficial)
console.log('IE RJ checksum (flow check):', typeof isIEWithChecksum('RJ', '00000000') === 'boolean');
console.log('IE PR checksum (flow check):', typeof isIEWithChecksum('PR', '0000000000') === 'boolean');
