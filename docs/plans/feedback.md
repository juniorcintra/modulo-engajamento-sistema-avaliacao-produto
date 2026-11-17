# Plano: Feedback (avaliações de produto)

Spec: [`specs/feedback.md`](../../specs/feedback.md) · Status: **aguardando aprovação** · Branch: `feat/feedback`

## Objetivo

Criar a página de detalhes `/products/[id]`: mostra o produto, todas as avaliações existentes e, por último, um formulário para avaliar. Só pessoas logadas avaliam; as demais veem um bloco pedindo login.

## O que será entregue

1. Tabela `products_feedbacks` + migration.
2. `POST /api/v1/products/{id}/feedbacks` (exige login).
3. Página pública `/products/[id]`.
4. Formulário de avaliação (nota 1-5 + comentário).

## Dependências (contratos, ver `00-orquestracao.md`)

- `getSession()` de `src/server/auth/session.ts` (feature _sign-in_).
- Tabela `products` (feature _home_). Como as features rodam em paralelo, vou codar contra o schema combinado e só validar de ponta a ponta depois do merge.

## Banco de dados

Migration `supabase/migrations/20261117020000_create_products_feedbacks.sql`:

| Coluna       | Tipo                      | Observação                              |
| ------------ | ------------------------- | --------------------------------------- |
| `id`         | text pk                   | `nanoid`                                |
| `score`      | int not null              | `check (score between 1 and 5)`         |
| `comment`    | text not null             |                                         |
| `created_at` | timestamptz default now() |                                         |
| `created_by` | text not null             | FK → `accounts.id`                      |
| `product_id` | text not null             | FK → `products.id`, `on delete cascade` |

Índice em `(product_id, created_at desc)`. RLS ativada, sem policies públicas.

## API

### `POST /api/v1/products/{id}/feedbacks`

- Corpo: `{ score: 1-5, comment }`, validado com Zod (`src/lib/schemas/feedback.ts`); comentário com limite de 1000 caracteres, com trim.
- Autor vem **sempre da sessão** (`created_by = session.accountId`), nunca do corpo.
- Respostas: `201` `{ id }`, `400` dados inválidos, `401` sem sessão, `404` produto inexistente, `500`.
- Depois de gravar, recalcula `products.score` (média das notas) para a home refletir a nota.

## Página `/products/[id]`

Server Component dentro de `(platform)`; busca produto e avaliações direto pelos serviços (sem HTTP interno). Se o produto não existe → `notFound()`.

Ordem na tela (como na spec):

1. **Produto**: imagem, nome, descrição, nota média + quantidade de avaliações, botão para o `external_link` (nova aba, `rel="noopener noreferrer"`).
2. **Avaliações**: lista de todas, mais recentes primeiro, com nome do autor (nome + inicial do sobrenome, sem expor email), avatar DiceBear, estrelas, comentário e data (`date-fns`, pt-BR). Estado vazio: "Seja a primeira pessoa a avaliar".
3. **Formulário** (`FeedbackSection`):
   - Deslogado: bloco "Entre para avaliar" com botões **Entrar** e **Criar conta**. Sem formulário.
   - Logado: seletor de estrelas acessível (radio group, navegável por teclado) + textarea + botão enviar. Validação no cliente com React Hook Form + Zod; erro em alert vermelho; no sucesso, `router.refresh()` limpa o form e mostra a nova avaliação.

Design seguindo `frontend-design` e os tokens do `globals.css`, reaproveitando `stars.tsx`, `Alert`, `Button`, `Field`. Responsivo, foco visível, `prefers-reduced-motion`.

## Arquivos

| Novo                                                                                                                                                   | Alterado                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| `supabase/migrations/20261117020000_create_products_feedbacks.sql`                                                                                     | `.env.example` (nada previsto) |
| `src/lib/schemas/feedback.ts`                                                                                                                          | `README.md` (sua seção)        |
| `src/server/services/product-detail.ts` (produto por id) e `feedbacks.ts` (listar/criar)                                                               |                                |
| `src/app/api/v1/products/[id]/feedbacks/route.ts`                                                                                                      |                                |
| `src/app/(platform)/products/[id]/page.tsx` (+ `not-found.tsx`)                                                                                        |                                |
| `src/components/products/product-detail.tsx`, `feedback-list.tsx`, `feedback-form.tsx`, `feedback-section.tsx`, `ui/textarea.tsx`, `ui/star-input.tsx` |                                |

## Passos

1. Migration + schema Zod.
2. Serviços e rota POST (sessão, 404, recálculo do score).
3. Página de detalhe + lista de avaliações.
4. Formulário e bloco de login.
5. README, lint, `tsc`, `build`.

## Verificação

- `curl`: 401 sem cookie, 400 (nota 0 ou 6, comentário vazio), 404 (produto inexistente), 201 com cookie.
- Navegador deslogado: vê produto e avaliações, e o bloco de login no lugar do formulário.
- Navegador logado: envia avaliação, ela aparece na lista e a nota média atualiza.
- Home mostra a nota atualizada do produto.

## Ambiguidades e decisões que preciso de você

1. **Uma avaliação por pessoa por produto?** A spec não limita. Proposta: permitir várias (sem constraint única), simples e fiel à spec. Prefere limitar a uma?
2. **Recalcular `products.score`**: a spec não pede, mas a home mostra a nota. Proposta: recalcular a média a cada avaliação (depende da decisão sobre o `score` na home). Aprova?
3. **Resultado da spec** diz que pessoas "não conseguem adicionar comentários" sem login, o que o bloco de login cobre. Também será garantido no servidor (`401`).
4. **Paginação das avaliações**: a spec pede "todos os comentários". Vou listar todos agora; se um produto tiver muitas, vale paginar depois.
5. **Redirecionar de volta após login**: o sign-in volta sempre para `/` (spec). Quem entra pelo bloco do produto cai na home. Posso adicionar um `?next=` depois, se quiser.
6. **Spec**: "Você não deve" copiado do sign-up e stack com "Bunjs"; vou interpretar pelo contexto e manter npm.
