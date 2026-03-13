
# br-data-kit

[![npm version](https://badge.fury.io/js/br-data-kit.svg)](https://badge.fury.io/js/br-data-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red)](https://github.com/sponsors/Ranilson-Nascimento)

Kit completo de utilitários brasileiros: **CPF/CNPJ/CEP**, **máscaras**, **formatação BRL**, **busca CEP/CNPJ** com cache (BrasilAPI + ViaCEP), **boleto bancário**, **placa Mercosul**, **RENAVAM**, **CNH**, **PIS/PASEP**, **IBGE (municípios)**, **hooks React/React Native** e **CLI** — _zero dependências_.

## Instalação

```bash
npm i br-data-kit
```
## Demo interativa

Veja uma demonstração interativa do pacote (validações, máscaras, CEP, formatação) hospedada em GitHub Pages: [Demo ao vivo](https://ranilson-nascimento.github.io/br-data-kit/) (o site é servido a partir da pasta `docs/` no repositório).

Se preferir rodar localmente, abra `docs/index.html` no seu navegador ou rode um servidor simples com:

```bash
# Python 3: python -m http.server 8000 --directory docs
```
## Uso rápido (sem enrolação)

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
// Hooks React (exemplos principais)
// CEP com autocomplete e debounce
const { data, loading, error, masked } = reactExtra.useCep(cepInput);

// CNPJ com fallback automático (BrasilAPI + Receitaws)
const { data: cnpj, loading: loadingCnpj, error: errorCnpj } = reactExtra.useCnpj(cnpjInput);

// Telefone com máscara dinâmica
const { value: phoneMasked, setValue: setPhone } = reactExtra.usePhoneMask("");

// Moeda BRL com máscara e valor numérico
const { value, masked, raw, setValue } = reactExtra.useCurrencyMask(0);
```

## CLI (zero dependências, ideal pra scripts)

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
- `useCepAuto`: Autocomplete de CEP simples com busca automática
- `useCep`: Hook completo de CEP com debounce, loading, erro e TTL configurável
- `useCnpj`: Hook para CNPJ com fallback BrasilAPI + Receitaws, debounce e TTL configurável
- `usePhoneMask`: Máscara automática para telefone (ideal para inputs controlados)
- `useCurrencyMask`: Máscara para valores monetários em BRL, retornando valor formatado e numérico

### CLI Completo
- Validação de todos os documentos
- Aplicação de máscaras
- Busca de CEP/CNPJ
- Parsing de boletos
- Formatação BRL
- Zero dependências externas

## Receitas prontas (copiar e colar)

### Receita 1: Checkout PF (CPF + endereço + total)

Fluxo clássico de e-commerce BR: o usuário digita CPF, CEP e valor da compra; você mascara, valida e ainda busca o endereço automaticamente.

```tsx
import { useState } from "react";
import { reactExtra, providers, formatBRL } from "br-data-kit";

export function CheckoutPF() {
  const [cpfInput, setCpfInput] = useState("");
  const [cepInput, setCepInput] = useState("");
  const [valorRaw, setValorRaw] = useState(0);

  const cpf = reactExtra.useBrField("cpf", cpfInput);
  const cep = reactExtra.useCep(cepInput);
  const moeda = reactExtra.useCurrencyMask(valorRaw);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf.valid) {
      alert("CPF inválido");
      return;
    }
    const endereco = cep.data || (await providers.fetchCEP(cepInput));
    alert(
      `Enviando pedido de ${moeda.raw} para ${endereco.street}, ${endereco.city}/${endereco.state}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>CPF</label>
      <input
        value={cpf.masked}
        onChange={(e) => {
          cpf.onChange(e.target.value);
          setCpfInput(e.target.value);
        }}
        placeholder="000.000.000-00"
      />
      {cpf.error && <small>{cpf.error}</small>}

      <label>CEP</label>
      <input
        value={cep.masked}
        onChange={(e) => setCepInput(e.target.value)}
        placeholder="00000-000"
      />
      {cep.loading && <small>Buscando endereço...</small>}
      {cep.data && <small>{cep.data.street} — {cep.data.city}/{cep.data.state}</small>}

      <label>Valor</label>
      <input
        value={moeda.value}
        onChange={(e) => moeda.setValue(e.target.value)}
        placeholder="R$ 0,00"
      />
      <p>Total bruto: {formatBRL(moeda.raw)}</p>

      <button type="submit">Fechar pedido</button>
    </form>
  );
}
```

### Receita 2: Cadastro PJ simples (CNPJ + IE + endereço)

```tsx
import { useState } from "react";
import { reactExtra, isIE, providers } from "br-data-kit";

export function CadastroPJ() {
  const [cnpjInput, setCnpjInput] = useState("");
  const [ieUf, setIeUf] = useState("SP");
  const [ieValue, setIeValue] = useState("");
  const [cepInput, setCepInput] = useState("");

  const cnpj = reactExtra.useCnpj(cnpjInput);
  const cep = reactExtra.useCep(cepInput);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIE(ieUf, ieValue)) {
      alert("Inscrição estadual inválida para a UF informada");
      return;
    }
    const endereco = cep.data || (await providers.fetchCEP(cepInput));
    alert(
      `Empresa ${cnpj.data?.razao_social || "sem nome"} em ${endereco.city}/${endereco.state}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>CNPJ</label>
      <input
        value={cnpjInput}
        onChange={(e) => setCnpjInput(e.target.value)}
        placeholder="00.000.000/0000-00"
      />
      {cnpj.data && <small>{cnpj.data.razao_social}</small>}

      <label>UF / Inscrição Estadual</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={ieUf}
          onChange={(e) => setIeUf(e.target.value.toUpperCase())}
          placeholder="SP"
          style={{ width: 60 }}
        />
        <input
          value={ieValue}
          onChange={(e) => setIeValue(e.target.value)}
          placeholder="IE"
        />
      </div>

      <label>CEP</label>
      <input
        value={cep.masked}
        onChange={(e) => setCepInput(e.target.value)}
        placeholder="00000-000"
      />
      {cep.data && <small>{cep.data.street} — {cep.data.city}/{cep.data.state}</small>}

      <button type="submit">Cadastrar empresa</button>
    </form>
  );
}
```

## API Reference

### Tipos principais (TypeScript)
```ts
// Tipos utilitários exportados
type CepResponse = import("br-data-kit").CepResponse;
type CnpjResponse = import("br-data-kit").CnpjResponse;
type BoletoInfo = import("br-data-kit").BoletoInfo;
type UF = import("br-data-kit").UF;
type UseCurrencyMaskResult = import("br-data-kit").UseCurrencyMaskResult;
```

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

// CEP com autocomplete + dados remotos (BrasilAPI/ViaCEP)
const { data, loading, error, masked } = reactExtra.useCep(cepInput);

// CNPJ com fallback (BrasilAPI + Receitaws)
const { data: cnpj, loading: loadingCnpj, error: errorCnpj } = reactExtra.useCnpj(cnpjInput);

// Máscara telefone controlada
const phone = reactExtra.usePhoneMask("");
// phone.value => string mascarada, phone.setValue(next: string)

// Máscara moeda BRL
const moeda = reactExtra.useCurrencyMask(0);
// moeda.value / moeda.masked => "R$ 1.234,56"
// moeda.raw => 1234.56 (number)
// moeda.setValue(199.9) ou moeda.setValue("199,90")

// Campo de alto nível unificado (máscara + validação)
const cpfField = reactExtra.useBrField("cpf");
// cpfField.masked, cpfField.valid, cpfField.error, cpfField.onChange(next: string)
// Ideal para integrar com bibliotecas de formulário (react-hook-form, Formik, etc.)
```

### Exemplo de formulário React completo (Brasil)

```tsx
import { useState } from "react";
import { reactExtra } from "br-data-kit";

export function FormularioBrasil() {
  const [cepInput, setCepInput] = useState("");
  const [cnpjInput, setCnpjInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  const cep = reactExtra.useCep(cepInput);
  const cnpj = reactExtra.useCnpj(cnpjInput);
  const phone = reactExtra.usePhoneMask(phoneInput);
  const moeda = reactExtra.useCurrencyMask(0);

  return (
    <form>
      <input
        placeholder="CEP"
        value={cep.masked}
        onChange={(e) => setCepInput(e.target.value)}
      />
      {cep.loading && <span>Buscando endereço...</span>}
      {cep.data && <span>{cep.data.city} - {cep.data.state}</span>}

      <input
        placeholder="CNPJ"
        value={cnpjInput}
        onChange={(e) => setCnpjInput(e.target.value)}
      />
      {cnpj.data && <span>{cnpj.data.razao_social}</span>}

      <input
        placeholder="Telefone"
        value={phone.value}
        onChange={(e) => phone.setValue(e.target.value)}
      />

      <input
        placeholder="Valor"
        value={moeda.value}
        onChange={(e) => moeda.setValue(e.target.value)}
      />
    </form>
  );
}
```

### Integração com `react-hook-form` (sugestão de uso)

O pacote não depende de nenhuma lib de formulário, mas você pode combiná-lo facilmente com `react-hook-form` usando `useBrField`:

```tsx
import { useForm, Controller } from "react-hook-form";
import { reactExtra } from "br-data-kit";

type FormData = {
  cpf: string;
  cep: string;
  valor: string;
};

export function FormularioComReactHookForm() {
  const { control, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Enviado:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="cpf"
        control={control}
        defaultValue=""
        render={({ field }) => {
          const cpf = reactExtra.useBrField("cpf", field.value);
          return (
            <div>
              <input
                placeholder="CPF"
                value={cpf.masked}
                onChange={(e) => {
                  cpf.onChange(e.target.value);
                  field.onChange(cpf.raw);
                }}
              />
              {cpf.error && <span>{cpf.error}</span>}
            </div>
          );
        }}
      />

      <Controller
        name="cep"
        control={control}
        defaultValue=""
        render={({ field }) => {
          const cep = reactExtra.useBrField("cep", field.value);
          return (
            <input
              placeholder="CEP"
              value={cep.masked}
              onChange={(e) => {
                cep.onChange(e.target.value);
                field.onChange(cep.raw);
              }}
            />
          );
        }}
      />

      <Controller
        name="valor"
        control={control}
        defaultValue=""
        render={({ field }) => {
          const moeda = reactExtra.useBrField("currency", field.value);
          return (
            <input
              placeholder="Valor"
              value={moeda.masked}
              onChange={(e) => {
                moeda.onChange(e.target.value);
                field.onChange(String(moeda.raw));
              }}
            />
          );
        }}
      />

      <button type="submit">Enviar</button>
    </form>
  );
}
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
