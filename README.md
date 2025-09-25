
# br-data-kit

[![npm version](https://badge.fury.io/js/br-data-kit.svg)](https://badge.fury.io/js/br-data-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Kit completo de utilitários brasileiros: **CPF/CNPJ/CEP**, **máscaras**, **formatação BRL**, **busca CEP/CNPJ** com cache (BrasilAPI + ViaCEP), **boleto bancário**, **placa Mercosul**, **RENAVAM**, **CNH**, **PIS/PASEP**, **IBGE (municípios)**, **hooks React/React Native** e **CLI** — _zero dependências_.

## Instalação

```bash
npm i br-data-kit
```

## Uso rápido

```ts
import {
  isCPF, maskCPF, isCNPJ, maskCNPJ, isCEP, maskCEP,
  isPhoneBR, maskPhoneBR, isPIS, isRENAVAM, isCNH, isPlateBR, maskPlate,
  parseBoleto, isValidBoletoLinhaDigitavel, formatBRL, fetchMunicipios, providers,
  reactExtra
} from "br-data-kit";

// Validações
isCPF("39053344705"); // true
isCNPJ("27865757000102"); // true
isCEP("01001000"); // true
isPhoneBR("11988887777"); // true

// Máscaras
maskCPF("39053344705"); // "390.533.447-05"
maskCNPJ("27865757000102"); // "27.865.757/0001-02"
maskCEP("01001000"); // "01001-000"
maskPhoneBR("11988887777"); // "(11) 98888-7777"

// Formatação
formatBRL(1234.56); // "R$ 1.234,56"

// Busca com cache
const cep = await providers.fetchCEP("01001000");
// { cep: "01001000", state: "SP", city: "São Paulo", ... }

const cnpj = await providers.fetchCNPJ("27865757000102");
// { razao_social: "EMPRESA EXEMPLO LTDA", ... }

// IBGE
const municipiosSP = await fetchMunicipios("SP");
// [{ id: 3550308, nome: "São Paulo" }, ...]

// Boleto
const boletoInfo = parseBoleto("34191.79001 01043.510047 91020.150008 3 95500000002000");
// { valor: 2000, vencimento: Date, ... }

// Hooks React
const { value, setValue, data, loading } = reactExtra.useCepAuto("");
```

## CLI (zero dependências)

```bash
# Validações
npx br-data-kit validate cpf 39053344705          # true
npx br-data-kit validate cnpj 27865757000102      # true
npx br-data-kit validate cep 01001000             # true
npx br-data-kit validate phone 11988887777        # true
npx br-data-kit validate pis 12345678901          # true
npx br-data-kit validate renavam 12345678901      # true
npx br-data-kit validate cnh 12345678901          # true
npx br-data-kit validate placa ABC1234            # true
npx br-data-kit validate placa ABC1D23            # true (Mercosul)
npx br-data-kit validate ie SP 110042490114       # true
npx br-data-kit validate ie RJ 12345670           # true

# Máscaras
npx br-data-kit mask cpf 39053344705              # 390.533.447-05
npx br-data-kit mask cnpj 27865757000102          # 27.865.757/0001-02
npx br-data-kit mask cep 01001000                 # 01001-000
npx br-data-kit mask phone 11988887777            # (11) 98888-7777
npx br-data-kit mask pis 12345678901              # 123.45678.90-1
npx br-data-kit mask renavam 12345678901          # 123456789-0
npx br-data-kit mask placa ABC1234                # ABC-1234

# Buscas
npx br-data-kit cep 01001000                      # JSON com dados do CEP
npx br-data-kit cnpj 27865757000102               # JSON com dados da empresa

# Boleto
npx br-data-kit boleto validar "34191.79001 01043.510047 91020.150008 3 95500000002000"
npx br-data-kit boleto parse "34191.79001 01043.510047 91020.150008 3 95500000002000"

# Formatação
npx br-data-kit brl 1234.56                       # R$ 1.234,56

# Ajuda
npx br-data-kit --help
```

## API Reference

### Validações
```ts
isCPF(value: string): boolean
isCNPJ(value: string): boolean
isCEP(value: string): boolean
isPhoneBR(value: string): boolean
isPIS(value: string): boolean
isRENAVAM(value: string): boolean
isCNH(value: string): boolean
isPlateBR(value: string): boolean
isIE(uf: string, value: string): boolean  // Estrutural
isIEWithChecksum(uf: string, value: string): boolean  // Com DV (SP, RJ, PR, MG)
```

### Máscaras
```ts
maskCPF(value: string): string
maskCNPJ(value: string): string
maskCEP(value: string): string
maskPhoneBR(value: string): string
maskPIS(value: string): string
maskRENAVAM(value: string): string
maskPlate(value: string): string
```

### Formatação
```ts
formatBRL(value: number, opts?: Intl.NumberFormatOptions): string
```

### Providers (com cache TTL)
```ts
providers.fetchCEP(cep: string, opts?: { ttlMs?: number }): Promise<CepResponse>
providers.fetchCNPJ(cnpj: string, opts?: { ttlMs?: number }): Promise<CnpjResponse>
```

### IBGE
```ts
fetchMunicipios(uf: string): Promise<Municipio[]>
```

### Boleto
```ts
isValidBoletoLinhaDigitavel(linha: string): boolean
parseBoleto(linha: string): BoletoInfo | null
```

### Datasets
```ts
import { datasets } from "br-data-kit";
datasets.ddd     // Lista de códigos DDD
datasets.banks   // Lista de bancos
```

### Hooks React
```tsx
import { reactExtra } from "br-data-kit";

// CEP com autocomplete
const { value, setValue, data, loading, error } = reactExtra.useCepAuto("");

// Máscara telefone
const { value, setValue, masked } = reactExtra.usePhoneMask("");

// Máscara moeda
const { value, setValue, masked, raw } = reactExtra.useCurrencyMask(0);
```

## Tratamento de Erros

```ts
try {
  const data = await providers.fetchCEP("99999999");
  // Sucesso
} catch (error) {
  console.error("Erro:", error.message);
  // Fallback ou tratamento
}
```

## Desenvolvimento

```bash
npm i
npm run build
npm test
npm run dev  # watch mode
```

## Contribuição

Leia **CONTRIBUTING.md** e **CODE_OF_CONDUCT.md**. Issues e PRs são bem-vindos.

## Licença

MIT

## Instalação
```bash
npm i br-data-kit
```

## Uso rápido
```ts
import {
  isCPF, maskCPF, isCNPJ, maskCNPJ, isCEP, maskCEP,
  isPhoneBR, maskPhoneBR, isPIS, isRENAVAM, isCNH, isPlateBR, maskPlate,
  parseBoleto, isValidBoletoLinhaDigitavel, formatBRL, fetchMunicipios, providers,
  reactExtra
} from "br-data-kit";

isCPF("39053344705"); // true
maskCPF("39053344705"); // "390.533.447-05"

const cep = await providers.fetchCEP("01001000");
const municipiosSP = await fetchMunicipios("SP");

const { value, setValue, data, loading } = reactExtra.useCepAuto("");
```

## CLI (zero dependências)
```bash
npx br-data-kit validate cpf 39053344705
npx br-data-kit validate cnpj 27865757000102
npx br-data-kit mask phone 11988887777
npx br-data-kit cep 01001000
npx br-data-kit boleto validar "34191.79001 01043.510047 91020.150008 3 95500000002000"
```


## Inscrição Estadual (IE) — v1.2.0
Suporte **estrutural** para IE por UF (tamanho e padrão), incluindo **SP/RJ/MG/PR** e demais UFs.
> Nota: os cálculos de dígitos verificadores variam por UF. A API `isIEWithChecksum(uf, ie)` já existe para futura expansão; por ora ela usa a validação estrutural.

Exemplos:
```bash
npx br-data-kit validate ie SP 110042490114
npx br-data-kit validate ie SP P011004249011
npx br-data-kit validate ie RJ 99999999
```


## IE com dígito verificador — v1.3.0
- **RJ**: DV oficial implementado (mód 11, regra: 11 - (soma % 11), ≥10 → 0).
- **PR**: 2 DVs oficiais implementados (mód 11 com pesos 3,2,7,6,5,4,3,2).
- **SP** e **MG**: por enquanto **estrutural** (DV virá na próxima versão).

Uso:
```ts
import { isIEWithChecksum } from "br-data-kit";

isIEWithChecksum("RJ", "12345670"); // true/false
isIEWithChecksum("PR", "1234567801"); // true/false
```
CLI:
```bash
npx br-data-kit validate ie RJ 12345670
npx br-data-kit validate ie PR 1234567801
```


## v1.4.0 — Datasets, Hooks extras e Boleto Concessionária (estrutura)
- **Datasets**: `datasets.ddd`, `datasets.banks` (JSON internos com cache do runtime).
- **Hooks**: `reactPhone.usePhoneMask`, `reactCurrency.useCurrencyMask`.
- **Boleto Concessionária (48 dígitos)**: validação estrutural por **4 blocos** (11+DV), 
  com detecção de **módulo 10 ou 11** pelo 3º dígito (6/7 → mod10, 8/9 → mod11).  
  > Observação: carteiras específicas podem ter exceções; casos especiais serão adicionados futuramente.


## v1.5.0 — IE SP/MG com DV oficial + Vitest
- **SP**: implementado cálculo **oficial** de ambos os DVs (9º e 12º), conforme SEFAZ-SP.
- **MG**: implementados **dois DVs** conforme prática documentada (inserção de zero após 3º dígito, soma por pesos alternados 1/2 com soma de dígitos; segundo DV por módulo 11 com pesos [3,2,11,10,9,8,7,6,5,4,3,2]).
- **Vitest**: suite mínima adicionada (`npm test`).

```bash
npm run build
npm test
```


## CI
Status: CI com GitHub Actions executando build e testes a cada PR/commit.
