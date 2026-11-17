# Orquestração das 3 features (sign-in, home, feedback)

Status: **aguardando aprovação**

Planos: [`sign-in.md`](sign-in.md) · [`home.md`](home.md) · [`feedback.md`](feedback.md)

## Como será a execução

- Um subagent por feature, rodando em paralelo, cada um em seu próprio **git worktree** (branch `feat/sign-in`, `feat/home`, `feat/feedback`). Assim ninguém sobrescreve o trabalho do outro.
- O orquestrador (eu) não implementa: define contratos, faz o merge, resolve conflitos, roda a verificação final e atualiza o README.
- Ordem de merge: **sign-in → home → feedback** (do mais fundamental ao mais dependente).

## Dependências entre as features

```
sign-in  ──► fornece: layout base com header, getSession(), cookie de sessão
home     ──► fornece: tabela products, serviço de produtos, página "/"
feedback ──► consome: getSession() (sign-in) e tabela products (home); fornece: tabela products_feedbacks, página /products/[id]
```

Como rodam em paralelo, cada agente codifica contra os **contratos** abaixo (não contra o código do outro).

## Contratos compartilhados (fixos para os 3 agentes)

| Item                        | Contrato                                                                                                                                       | Dono      |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Sessão                      | `getSession(): Promise<{ accountId: string; firstName: string; lastName: string; email: string } \| null>` em `src/server/auth/session.ts`     | sign-in   |
| Env novas                   | `SESSION_SECRET` (sign-in), `ADMIN_API_KEY` (home) em `.env.example`                                                                           | cada dono |
| Layout                      | Route group `src/app/(platform)/` com `layout.tsx` (header + container). `/` e `/products/[id]` ficam dentro dele; páginas `auth/*` ficam fora | sign-in   |
| Tabela `products`           | `id text pk, name text, description text null, image_url text, external_link text, score numeric(2,1) default 0, created_at, updated_at`       | home      |
| Tabela `products_feedbacks` | `id, score int (1-5), comment text, created_at, created_by → accounts.id, product_id → products.id`                                            | feedback  |
| Migrations                  | `20261117010000_create_products.sql` (home) e `20261117020000_create_products_feedbacks.sql` (feedback)                                        | cada dono |
| Rota de detalhe             | `/products/[id]` (a home só linka para ela)                                                                                                    | feedback  |
| README                      | Cada agente edita **apenas a sua seção**, para evitar conflito; o orquestrador consolida                                                       | todos     |

## Arquivos que mais podem conflitar

`package.json` / `package-lock.json`, `.env.example`, `README.md`, `src/app/layout.tsx`, `src/server/routers/_app.ts`. Resolução manual no merge.

## Verificação final (responsabilidade do orquestrador)

1. `npm run lint`, `npx tsc --noEmit` e `npm run build` sem erros.
2. Fluxo ponta a ponta no navegador: home pública → detalhe → ver bloco "faça login" → sign-in → avaliar → avaliação aparece.
3. Checagem de cada critério de aceitação das 3 specs.
4. README atualizado conforme a regra do `CLAUDE.md`.

## Pontos que dependem da sua decisão

Estão listados no fim de cada plano, na seção **Ambiguidades**. As mais importantes:

1. `products.score` está como `boolean` na spec, mas o conceito é nota. Proposta: nota média numérica.
2. A spec da home não tem coluna de imagem, mas exige imagem. Proposta: `image_url`.
3. `POST /api/v1/products` ficaria público. Proposta: proteger com `ADMIN_API_KEY`.
4. "Bunjs" aparece na stack, mas o projeto usa Node/npm. Proposta: manter npm.
5. Não há spec de logout. Proposta: incluir um mínimo (necessário para testar o estado "logado").
6. Quem aplica as migrations no Supabase (você ou os agentes, se houver acesso)?
