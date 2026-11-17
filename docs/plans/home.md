# Plano: Home (listagem de produtos)

Spec: [`specs/home.md`](../../specs/home.md) · Status: **aguardando aprovação** · Branch: `feat/home`

## Objetivo

A home pública (sem login) lista todos os produtos com **scroll infinito**. Cada card mostra imagem, nome e uma descrição curta; clicar no nome leva ao detalhe do produto.

## O que será entregue

1. Tabela `products` + migration do Supabase.
2. `GET /api/v1/products` paginado.
3. `POST /api/v1/products` para cadastrar produtos manualmente.
4. Home com grade de produtos e infinite scroll (substitui o esqueleto criado pela feature _sign-in_).

## Banco de dados

Migration `supabase/migrations/20261117010000_create_products.sql`:

| Coluna                      | Tipo                            | Observação             |
| --------------------------- | ------------------------------- | ---------------------- |
| `id`                        | text pk                         | `nanoid` gerado na API |
| `name`                      | text not null                   |                        |
| `description`               | text null                       | opcional               |
| `image_url`                 | text not null                   | URL da imagem          |
| `external_link`             | text not null                   |                        |
| `score`                     | numeric(2,1) not null default 0 | nota média (0 a 5)     |
| `created_at` / `updated_at` | timestamptz default now()       |                        |

RLS ativada, sem policies públicas (acesso só pelo servidor, igual à `accounts`). Índice em `(created_at desc, id)` para a paginação.

## API

### `GET /api/v1/products` (público)

- Query: `limit` (padrão 12, máx. 50) e `cursor` (opaco, baseado em `created_at` + `id`).
- Paginação por **cursor** em vez de offset: estável quando entram produtos novos durante o scroll e mais rápida.
- `200` com `{ "items": [...], "nextCursor": "..." | null }`. Sem produtos: `items: []`.
- `400` se `limit`/`cursor` inválidos.

### `POST /api/v1/products` (protegido)

- Corpo JSON: `{ name, externalLink, imageUrl, description? }`, validado com Zod (`src/lib/schemas/product.ts`). `externalLink` e `imageUrl` precisam ser URLs `http(s)`.
- Header `x-api-key` comparado com `ADMIN_API_KEY` (novo no `.env.example`).
- `201` com `{ id }`, `400` dados inválidos, `401` chave ausente/inválida.

## Front-end

- `src/app/(platform)/page.tsx` renderiza o título e o `ProductFeed` (client component).
- `ProductFeed` usa `useInfiniteQuery` (React Query, já instalado) + `IntersectionObserver` num sentinela no fim da lista; carrega a próxima página antes de chegar ao fim.
- `ProductCard`: imagem (proporção fixa, `loading="lazy"`), nome como `<Link href="/products/{id}">`, descrição com `line-clamp-2`, nota em estrelas (reaproveitando `stars.tsx`) e botão "Ver produto".
- Estados: carregando (skeleton), vazio ("Ainda não há produtos"), erro com botão "Tentar de novo", fim da lista.
- Imagens: `<img>` com `object-cover`, pois os domínios das URLs são livres. Alternativa seria configurar `images.remotePatterns` no `next.config.ts`.
- Design conforme `frontend-design` e tokens do `globals.css`; grade responsiva (1 → 2 → 3/4 colunas), foco visível e `prefers-reduced-motion`.
- O link para `/products/[id]` pode dar 404 até a feature _feedback_ ser integrada (esperado).

## Arquivos

| Novo                                                                                        | Alterado                                            |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `supabase/migrations/20261117010000_create_products.sql`                                    | `src/app/(platform)/page.tsx`                       |
| `src/lib/schemas/product.ts`                                                                | `src/server/routers/_app.ts` (só se expor via tRPC) |
| `src/server/services/products.ts` (`listProducts`, `createProduct`)                         | `.env.example`                                      |
| `src/app/api/v1/products/route.ts` (GET + POST)                                             | `README.md` (sua seção)                             |
| `src/components/products/product-feed.tsx`, `product-card.tsx`, `product-card-skeleton.tsx` |                                                     |

## Passos

1. Migration + schema Zod.
2. Serviço de produtos e rota GET/POST.
3. Componentes e página da home.
4. (Opcional) script/seed com alguns produtos de exemplo via `POST`, para a demonstração.
5. README, lint, `tsc`, `build`.

## Verificação

- `curl` em GET (vazio, com dados, com `cursor`, `limit` inválido) e POST (201, 400, 401).
- Com mais de 12 produtos, o scroll carrega novas páginas sem duplicar itens.
- Home acessível sem login; clicar no nome navega para `/products/{id}`.

## Ambiguidades e decisões que preciso de você

1. **`score: boolean`** parece erro de digitação (produto tem nota). Proposta: `numeric(2,1)` com a nota média, recalculada pela feature _feedback_. Aprova?
2. **Imagem**: a spec exige imagem no card e no POST, mas não tem coluna. Proposta: `image_url` recebendo uma URL. Se preferir **upload de arquivo**, usaria Supabase Storage (mais trabalho). Qual?
3. **Segurança do POST**: sem proteção, qualquer pessoa cadastraria produtos. Proposta: `ADMIN_API_KEY`. Ou prefere aberto por ora, como a spec sugere?
4. **Formato da resposta**: a spec diz "array vazio". Com paginação por cursor preciso de um envelope (`{ items, nextCursor }`). Aceita? Se quiser array puro, usaria `limit/offset` e cabeçalho para o total.
5. **Texto da spec**: "criar uma nova conta... tabela products" é erro de cópia (é um novo produto), e "Você não deve" é copiado do sign-up. Vou interpretar pelo contexto.
6. **Bunjs** aparece na stack, mas vou manter Node/npm.
