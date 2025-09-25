
import { isIE } from '../dist/ie.js';

console.log('IE SP digitos (structural):', isIE('SP', '110042490114') === true);
console.log('IE SP rural P (structural):', isIE('SP', 'P011004249011') === true);
console.log('IE RJ 8 digitos (structural):', isIE('RJ', '99999999') === true);
