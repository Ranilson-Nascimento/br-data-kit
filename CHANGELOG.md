# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.1] - 2025-09-25
### Added
- LICENSE (MIT), CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.
- GitHub Actions CI (build + test).
- `.npmignore` e `.gitignore`.
- Exemplos de uso em `examples/`.
### Changed
- `package.json` com `repository`, `bugs`, `homepage`, `keywords`.

## [1.5.0] - 2025-09-25
### Added
- IE **SP** e **MG** com **dígitos verificadores oficiais**.
- Testes com **Vitest** e scripts `npm test`.

## [1.4.0] - 2025-09-25
### Added
- Datasets: `datasets.ddd`, `datasets.banks`.
- Hooks: `reactPhone.usePhoneMask`, `reactCurrency.useCurrencyMask`.
- Boleto concessionária (48 dígitos): validação estrutural (blocos 11+DV) com autodetecção de módulo 10/11.

## [1.3.0] - 2025-09-25
### Added
- IE com **checksum oficial** para **RJ** e **PR**.

## [1.2.0] - 2025-09-25
### Added
- Validação **estrutural** de IE para todas as UFs (SP com caso 'P' para IE rural).
- CLI com suporte a `validate ie <UF> <inscricao>`.

## [1.1.0] - 2025-09-25
### Added
- Novos validadores (phone, PIS, RENAVAM, CNH, placa).
- Novas máscaras (phone, PIS, RENAVAM, placa).
- Boleto bancário (47) parse/validação; IBGE municípios; hook `useCepAuto`.
- CLI com comandos `validate`, `mask`, `cep`, `cnpj`, `boleto`, `brl`.

## [1.0.0] - 2025-09-25
### Added
- Primeira versão com CPF/CNPJ/CEP + máscaras + providers com cache.
