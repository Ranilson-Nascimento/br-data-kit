
# br-data-kit

[![npm version](https://badge.fury.io/js/br-data-kit.svg)](https://badge.fury.io/js/br-data-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red)](https://github.com/sponsors/Ranilson-Nascimento)

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

// Datasets
import { datasets } from "br-data-kit";
console.log(datasets.ddd);    // Lista de códigos DDD
console.log(datasets.banks);  // Lista de bancos

```ts
// Hooks React
const { value, setValue, data, loading } = reactExtra.useCepAuto("");
```

## Demo interativa

Veja uma demonstração interativa do pacote (validações, máscaras, CEP, formatação) hospedada em GitHub Pages: [Demo ao vivo](https://ranilson-nascimento.github.io/br-data-kit/) (o site é servido a partir da pasta `docs/` no repositório).

Se preferir rodar localmente, abra `docs/index.html` no seu navegador ou rode um servidor simples com:

```bash
# Python 3: python -m http.server 8000 --directory docs
```
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
npx br-data-kit validate ie PR 1234567801         # true
npx br-data-kit validate ie MG 1234567890123      # true

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

## Funcionalidades

### Validações
- **CPF/CNPJ**: Validação completa com dígitos verificadores
- **CEP**: Validação estrutural
- **Telefone**: Validação de números brasileiros
- **PIS/PASEP**: Validação com dígito verificador
- **RENAVAM**: Validação de 11 dígitos
- **CNH**: Validação estrutural
- **Placa Mercosul**: Suporte a placas antigas (ABC-1234) e novas (ABC1D23)
- **Inscrição Estadual (IE)**: Validação estrutural para todas as UFs, com dígitos verificadores oficiais para SP, RJ, PR, MG

### Máscaras e Formatação
- Máscaras automáticas para todos os documentos
- Formatação BRL com opções de localização
- Suporte a diferentes formatos de telefone

### Busca de Dados (com cache)
- **CEP**: Busca via BrasilAPI + ViaCEP com fallback automático
- **CNPJ**: Busca de dados empresariais
- Cache TTL configurável para otimizar performance

### IBGE
- Lista completa de municípios por UF
- Dados atualizados diretamente da API do IBGE

### Boleto Bancário
- Validação de linha digitável
- Parsing completo com valor, vencimento, beneficiário
- Suporte a boletos bancários e concessionárias

### Datasets Internos
- Lista de códigos DDD brasileiros
- Lista de bancos com códigos e nomes
- Dados carregados automaticamente com cache em runtime

### Hooks React
- `useCepAuto`: Autocomplete de CEP com busca automática
- `usePhoneMask`: Máscara automática para telefone
- `useCurrencyMask`: Máscara para valores monetários

### CLI Completo
- Validação de todos os documentos
- Aplicação de máscaras
- Busca de CEP/CNPJ
- Parsing de boletos
- Formatação BRL
- Zero dependências externas

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
 
 
