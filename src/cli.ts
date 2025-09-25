
import { isCPF, isCNPJ, isCEP, isPhoneBR, isPIS, isRENAVAM, isCNH, isPlateBR } from './validators.js';
import { isIE } from './ie.js';
import { maskCPF, maskCNPJ, maskCEP, maskPhoneBR, maskPIS, maskRENAVAM, maskPlate, formatBRL } from './formatters.js';
import { providers } from './providers.js';
import { isValidBoletoLinhaDigitavel, parseBoleto } from './boleto.js';

function usage() {
  console.log(`
br-data-kit CLI

Uso:
  br-data-kit validate <tipo> <valor>
    tipos: cpf | cnpj | cep | phone | pis | renavam | cnh | placa | ie <UF> <inscricao>

  br-data-kit mask <tipo> <valor>
    tipos: cpf | cnpj | cep | phone | pis | renavam | placa

  br-data-kit cep <CEP>
  br-data-kit cnpj <CNPJ>

  br-data-kit boleto validar <linha-digitavel>
  br-data-kit boleto parse <linha-digitavel>

  br-data-kit brl <numero>
`);
}

async function main() {
  const [, , cmd, arg1, ...rest] = process.argv;
  if (!cmd) { usage(); process.exit(1); }
  try {
    if (cmd === 'validate') {
      if (arg1 && arg1.toLowerCase() === 'ie') {
        const uf = (rest[0]||'').toUpperCase();
        const value = rest.slice(1).join(' ');
        if (!uf || !value) { usage(); process.exit(1); }
        console.log(isIE(uf, value));
        return;
      }
      const type = arg1; const value = rest.join(' ');
      const map = {
        cpf: isCPF, cnpj: isCNPJ, cep: isCEP, phone: isPhoneBR,
        pis: isPIS, renavam: isRENAVAM, cnh: isCNH, placa: isPlateBR
      } as any;
      if (!map[type]) { usage(); process.exit(1); }
      console.log(map[type](value)); return;
    }
    if (cmd === 'mask') {
      const type = arg1; const value = rest.join(' ');
      const map = {
        cpf: maskCPF, cnpj: maskCNPJ, cep: maskCEP, phone: maskPhoneBR,
        pis: maskPIS, renavam: maskRENAVAM, placa: maskPlate
      } as any;
      if (!map[type]) { usage(); process.exit(1); }
      console.log(map[type](value)); return;
    }
    if (cmd === 'cep') {
      const cep = arg1 || rest[0];
      const data = await providers.fetchCEP(cep);
      console.log(JSON.stringify(data, null, 2)); return;
    }
    if (cmd === 'cnpj') {
      const cnpj = arg1 || rest[0];
      const data = await providers.fetchCNPJ(cnpj);
      console.log(JSON.stringify(data, null, 2)); return;
    }
    if (cmd === 'boleto') {
      const sub = arg1;
      const value = rest.join(' ');
      if (sub === 'validar') { console.log(isValidBoletoLinhaDigitavel(value)); return; }
      if (sub === 'parse') { console.log(JSON.stringify(parseBoleto(value), null, 2)); return; }
      usage(); process.exit(1);
    }
    if (cmd === 'brl') {
      const num = Number(arg1);
      console.log(formatBRL(num)); return;
    }
    usage(); process.exit(1);
  } catch (e:any) {
    console.error(e.message || String(e));
    process.exit(2);
  }
}

main();
