
/* Simple, zero-deps CLI */
import { fetchCEP, fetchCNPJ } from "./providers";
import { formatBRL, maskCPF, maskCNPJ, maskCEP } from "./formatters";

const args = process.argv.slice(2);
const cmd = args[0];

function help() {
  console.log(`
br-data-kit CLI

Comandos:
  cep <CEP>            → busca CEP (BrasilAPI→ViaCEP)
  cnpj <CNPJ>          → busca CNPJ (BrasilAPI→Receitaws)
  mask cpf <valor>     → aplica máscara CPF
  mask cnpj <valor>    → aplica máscara CNPJ
  mask cep <valor>     → aplica máscara CEP
  brl <numero>         → formata em BRL
  --help               → ajuda
`);
}

async function main() {
  try {
    switch (cmd) {
      case "cep": {
        const cep = args[1] || "";
        const r = await fetchCEP(cep);
        console.log(JSON.stringify(r, null, 2));
        break;
      }
      case "cnpj": {
        const cnpj = args[1] || "";
        const r = await fetchCNPJ(cnpj);
        console.log(JSON.stringify(r, null, 2));
        break;
      }
      case "mask": {
        const type = args[1];
        const value = args[2] || "";
        if (type === "cpf") console.log(maskCPF(value));
        else if (type === "cnpj") console.log(maskCNPJ(value));
        else if (type === "cep") console.log(maskCEP(value));
        else help();
        break;
      }
      case "brl": {
        const n = Number(args[1] || 0);
        console.log(formatBRL(n));
        break;
      }
      default: help();
    }
  } catch (e: any) {
    console.error("Erro:", e?.message || String(e));
    process.exit(1);
  }
}

main();
