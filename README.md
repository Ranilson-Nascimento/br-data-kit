
# br-data-kit

[![npm version](https://badge.fury.io/js/br-data-kit.svg)](https://badge.fury.io/js/br-data-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Utilitários Brasil prontos para produção: validar e mascarar CPF/CNPJ, formatar BRL/telefone/CEP, e buscar CEP/CNPJ com fallback (BrasilAPI → ViaCEP/Receitaws) + cache TTL. Inclui hooks para React Native (debounce + estados prontos) e **CLI**.

## Instalação

```bash
npm i br-data-kit
```

## Uso rápido (Node/TS)

```ts
import { isCPF, isCNPJ, maskCPF, maskCNPJ, formatBRL, providers } from "br-data-kit";

// Validação
isCPF("390.533.447-05"); // true
isCNPJ("19131243000197"); // true

// Máscara
maskCPF("39053344705"); // "390.533.447-05"
maskCNPJ("19131243000197"); // "19.131.243/0001-97"

// Formatação
formatBRL(1234.56); // "R$ 1.234,56"

// Busca com cache e fallback
const cep = await providers.fetchCEP("01001000");
// { cep: "01001000", state: "SP", city: "São Paulo", ... }

const cnpj = await providers.fetchCNPJ("19131243000197");
// { razao_social: "...", ... }
```

## CLI

```bash
# Buscar CEP
npx br-data-kit cep 01001000

# Buscar CNPJ
npx br-data-kit cnpj 19131243000197

# Aplicar máscara
npx br-data-kit mask cpf 39053344705
npx br-data-kit mask cnpj 19131243000197
npx br-data-kit mask cep 01001000

# Formatar BRL
npx br-data-kit brl 1234.56

# Ajuda
npx br-data-kit --help
```

### Hooks (React Native)

```tsx
import { useCep, useCnpj, useDebouncedValue } from "br-data-kit/react";

function MyComponent() {
  const { data: cepData, loading, error } = useCep("01001000");
  const { data: cnpjData, loading: cnpjLoading } = useCnpj("19131243000197");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // ...
}
```

## API Reference

### Validações
- `isCPF(value: string): boolean`
- `isCNPJ(value: string): boolean`

### Máscaras
- `maskCPF(value: string): string`
- `maskCNPJ(value: string): string`
- `maskCEP(value: string): string`

### Formatação
- `formatBRL(value: number): string`

### Providers (com cache TTL)
- `providers.fetchCEP(cep: string, opts?: { ttlMs?: number }): Promise<CepResponse>`
- `providers.fetchCNPJ(cnpj: string, opts?: { ttlMs?: number }): Promise<CnpjResponse>`

### Hooks React
- `useCep(cep: string): { data, loading, error }`
- `useCnpj(cnpj: string): { data, loading, error }`
- `useDebouncedValue(value: any, delay: number): any`

## Desenvolvimento

```bash
npm i
npm run build
npm test
npm run dev  # watch mode
```

## Contribuição
Leia **CONTRIBUTING.md** e **CODE_OF_CONDUCT.md**. Issues e PRs são bem-vindos.

## Publicação automática (GitHub → npm)
1. Crie o repositório no GitHub e ajuste o `repository.url` em `package.json` para o seu usuário.
2. No GitHub, adicione o secret **NPM_TOKEN** (token *Automation* do npm).
3. Faça push para a branch `main` com uma nova versão no `package.json`. O workflow publica no npm automaticamente se a versão não existir.

## Licença
MIT
