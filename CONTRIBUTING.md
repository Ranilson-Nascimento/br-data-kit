
# Contribuindo

Obrigado por contribuir! Siga estes passos para uma contribuição suave:

## Como contribuir

1. **Fork e branch**: Faça fork do repositório e crie um branch descritivo:
   ```bash
   git checkout -b feat/minha-nova-feature
   # ou
   git checkout -b fix/correcao-bug
   ```

2. **Desenvolvimento**:
   - Instale dependências: `npm i`
   - Rode testes: `npm test`
   - Build: `npm run build`
   - Formate código: `npm run format`
   - Lint: `npm run lint`

3. **Testes**: Garanta cobertura para novas funções. Use mocks para APIs externas.

4. **Commits**: Use mensagens claras (ex: "feat: add support for telefone mask").

5. **Pull Request**: Abra PR com descrição detalhada incluindo:
   - Motivação da mudança
   - Como testar
   - Breaking changes (se houver)

## Regras de código
- TypeScript strict
- ESLint + Prettier
- Testes com Vitest
- Documentação em português (README, comentários)

## Issues
- Bugs: Use template de bug
- Features: Descreva claramente o problema e solução proposta

Dúvidas? Abra uma issue!
