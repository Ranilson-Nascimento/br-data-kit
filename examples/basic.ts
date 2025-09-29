import { isCPF, maskCPF, providers, formatBRL, reactPhone, reactCurrency } from "br-data-kit";

async function demo() {
  console.log(isCPF("39053344705"));
  console.log(maskCPF("39053344705"));
  console.log(formatBRL(12345.67));
  const cep = await providers.fetchCEP("01001000");
  console.log(cep);
}
demo();
