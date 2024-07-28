# Testes do Projeto

## Padrões de Testes

### Tipos de Testes

- **Testes Unitários**: Arquivos terminados em `.spec.ts`.
- **Testes de Integração**: Arquivos terminados em `.test.ts`.

## Localização dos Testes

Os testes devem ser localizados juntamente com o código que eles testam. Por exemplo:

- Arquivo de código: `src/app/api/v1/status/route.ts`
- Arquivo de teste correspondente: `src/app/api/v1/status/route.test.ts`

### Exceção para Arquivos de Páginas

Os arquivos dentro de `src/app/*` (exceto `src/app/api`) são considerados arquivos de páginas. Os testes para essas páginas ficarão localizados em `tests/app/`.

## Diferença entre Testes Unitários e Testes de Integração

### Testes Unitários

Os testes unitários focam em verificar o comportamento de pequenas unidades de código isoladamente, geralmente funções ou métodos. Eles são rápidos e isolados de outras partes do sistema.

#### Exemplo de Teste Unitário

```typescript
import { describe, it, expect } from 'vitest';
import { sum } from './math';

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

### Testes de Integração

Os testes de integração verificam a interação entre diferentes partes do sistema para garantir que funcionem corretamente quando combinadas. Eles são mais amplos e podem incluir interações com banco de dados, APIs e outros componentes externos.

#### Exemplo de Teste de Integração

```typescript
import { describe, it, expect } from 'vitest';

const API_BASE_URL = 'http://localhost:3000';

describe('/api/v1/status', () => {
  it('should return a response with status 200 and body "OK"', async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/status`);
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(text).toBe('OK');
  });
});
```

## Executando os Testes

**Para rodar todos os testes**:

```sh
npm test
```

**Para rodar apenas os testes unitários**:

```sh
npm run test:unit
```

**Para rodar apenas os testes de integração**:

```sh
npm run test:integration
```

Certifique-se de que os testes estão corretamente configurados e localizados conforme os padrões mencionados para manter a consistência e organização do projeto.
