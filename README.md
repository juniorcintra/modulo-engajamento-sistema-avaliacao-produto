# Módulo de Engajamento — Sistema de Avaliação de Produto

Plataforma web onde pessoas veem uma lista de produtos e, depois de entrar na conta, deixam avaliações (nota de 1 a 5 estrelas e comentário).

> Projeto de estudo da Pós-Graduação em Engenharia de IA Aplicada.

---

## Em uma frase

Qualquer pessoa navega pelos produtos; quem tem conta entra e avalia.

## O que já funciona

| Funcionalidade                                                   | Onde                              |
| ---------------------------------------------------------------- | --------------------------------- |
| Home pública com lista de produtos e rolagem infinita            | `/`                               |
| Detalhes do produto com avaliações (público)                     | `/products/{id}`                  |
| Avaliar um produto (só logado: nota 1-5 + comentário)            | `/products/{id}`                  |
| Resumo das avaliações gerado por IA (destacado com selo "IA")    | `/products/{id}`                  |
| Criar conta, com validação em tempo real                         | `/auth/sign-up`                   |
| Entrar e sair da conta (cabeçalho com avatar, nome e email)      | `/auth/sign-in`                   |
| API de produtos (listar e cadastrar), contas, login e avaliações | `/api/v1/...` (ver seções abaixo) |
| Senha armazenada de forma segura (hash + salt)                   | Servidor                          |

**Ainda não existe:** envio de e-mails, recuperação de senha e painel para gerenciar produtos (eles são cadastrados via API). Specs de cada funcionalidade em [`specs/`](specs/).

---

## Como funciona (para quem não é técnico)

1. A pessoa preenche o formulário.
2. O formulário confere os dados antes de enviar (e-mail válido, senha com no mínimo 8 caracteres, senhas iguais).
3. Se tudo estiver certo, os dados vão ao servidor, que **embaralha a senha de forma irreversível**. Ninguém, nem a equipe, consegue ler a senha original.
4. A conta é salva no banco de dados.
5. A pessoa vê a tela de sucesso. Se algo der errado (por exemplo, e-mail já cadastrado), aparece um aviso vermelho no formulário.

```
 Navegador            Servidor (Next.js)              Banco (Supabase)
 ─────────            ──────────────────              ────────────────
 Formulário ──────►  valida os dados
                     gera hash da senha  ─────────►  grava em "accounts"
 Tela de sucesso ◄──  responde 201 Created ◄────────  ok
```

---

## Como rodar no seu computador

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recente) e npm
- Um projeto gratuito no [Supabase](https://supabase.com/)

### Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. Crie seu arquivo de configuração
cp .env.example .env.local        # no Windows (PowerShell): Copy-Item .env.example .env.local

# 3. Preencha o .env.local com os dados do seu projeto Supabase
#    SUPABASE_URL=...
#    SUPABASE_SERVICE_ROLE_KEY=...
#    SESSION_SECRET=...   (texto aleatório com 32+ caracteres, assina o cookie de login)
#    OPENAI_API_KEY=...   (opcional; habilita o resumo das avaliações por IA)

# 4. Crie as tabelas no banco
#    No "SQL Editor" do painel do Supabase, execute NESTA ORDEM o conteúdo de:
#      supabase/migrations/20261117000000_create_accounts.sql
#      supabase/migrations/20261117010000_create_products.sql
#      supabase/migrations/20261117020000_create_products_feedbacks.sql
#      supabase/migrations/20261117030000_add_ai_summary_to_products.sql

# 5. Inicie o projeto
npm run dev

# 6. (Opcional) Cadastre produtos de exemplo
node scripts/seed-products.mjs 15
```

Abra <http://localhost:3000> no navegador.

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` é uma chave secreta. Use-a **somente no servidor**, nunca a publique nem envie para o Git (o `.env.local` já é ignorado).

### Comandos úteis

| Comando          | O que faz                              |
| ---------------- | -------------------------------------- |
| `npm run dev`    | Inicia em modo desenvolvimento         |
| `npm run build`  | Gera a versão de produção              |
| `npm start`      | Executa a versão de produção           |
| `npm run lint`   | Verifica a qualidade do código (Biome) |
| `npm run format` | Formata o código automaticamente       |

---

## Referência da API

### `POST /api/v1/sign-up`

**Corpo (JSON):**

```json
{
  "firstName": "Maria",
  "lastName": "Silva",
  "email": "maria@exemplo.com",
  "password": "minhasenha123",
  "confirmPassword": "minhasenha123"
}
```

**Regras de validação**

| Campo                   | Regra                                  |
| ----------------------- | -------------------------------------- |
| `firstName`, `lastName` | Obrigatórios, até 100 caracteres       |
| `email`                 | Formato válido (é salvo em minúsculas) |
| `password`              | De 8 a 72 caracteres                   |
| `confirmPassword`       | Deve ser igual a `password`            |

**Respostas**

| Status | Significado                        | Corpo                                                            |
| ------ | ---------------------------------- | ---------------------------------------------------------------- |
| `201`  | Conta criada                       | `{ "id": "..." }`                                                |
| `400`  | Dados inválidos ou JSON malformado | `{ "message": "Dados inválidos", "errors": { ... } }`            |
| `409`  | E-mail já cadastrado               | `{ "message": "Este email já tem uma conta. Use outro email." }` |
| `500`  | Erro interno                       | `{ "message": "Erro interno do servidor" }`                      |

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/api/v1/sign-up \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Maria","lastName":"Silva","email":"maria@exemplo.com","password":"minhasenha123","confirmPassword":"minhasenha123"}'
```

---

## Banco de dados

Tabela `accounts` (definida em [`supabase/migrations`](supabase/migrations)):

| Coluna                      | Tipo        | Observação                              |
| --------------------------- | ----------- | --------------------------------------- |
| `id`                        | text        | Identificador único gerado com `nanoid` |
| `first_name` / `last_name`  | text        | Nome e sobrenome                        |
| `email`                     | text        | Único (não permite repetir)             |
| `password`                  | text        | Hash bcrypt, nunca a senha real         |
| `salt`                      | text        | Salt usado no hash                      |
| `active`                    | boolean     | Padrão `true`                           |
| `created_at` / `updated_at` | timestamptz | Datas automáticas                       |

A tabela usa Row Level Security sem políticas públicas: **só o servidor** (via service role) consegue acessá-la.

---

## Home — listagem de produtos

A página inicial (`/`) é pública e mostra os produtos em cards (imagem, nome, descrição curta e nota). Ao rolar, novos produtos são carregados automaticamente (_infinite scroll_). Clicar no nome (ou em "Ver produto") leva a `/products/{id}`.

**Configuração:** execute `supabase/migrations/20261117010000_create_products.sql` no SQL Editor do Supabase.

### `GET /api/v1/products` (público)

Query: `limit` (padrão 12, máximo 50) e `cursor` (opaco, vindo de `nextCursor`).

```json
{
  "items": [
    {
      "id": "...",
      "name": "...",
      "description": null,
      "imageUrl": "...",
      "externalLink": "...",
      "score": 0,
      "createdAt": "..."
    }
  ],
  "nextCursor": "..."
}
```

`nextCursor` é `null` na última página; sem produtos, `items` é `[]`. `400` para `limit` ou `cursor` inválidos.

### `POST /api/v1/products` (público, sem autenticação)

Recebe um JSON com `name`, `link` (URL http/https do produto, salva em `external_link`), `image` (URL http/https da imagem, salva em `image_url`) e `description` (opcional). Respostas: `201 { "id" }`, `400` dados inválidos (com o detalhe por campo) e `500` erro interno.

> ⚠️ Como não exige autenticação, qualquer pessoa que conheça a URL consegue cadastrar produtos. Se isso virar um problema, vale voltar a proteger com uma chave.

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Fone XYZ","link":"https://exemplo.com/xyz","image":"https://exemplo.com/xyz.jpg"}'
```

Para popular com exemplos: `node scripts/seed-products.mjs 15`.

### Tabela `products`

| Coluna                      | Tipo         | Observação                      |
| --------------------------- | ------------ | ------------------------------- |
| `id`                        | text         | `nanoid` gerado na API          |
| `name`                      | text         | Nome do produto                 |
| `description`               | text         | Opcional                        |
| `image_url`                 | text         | URL da imagem                   |
| `external_link`             | text         | Link externo do produto         |
| `score`                     | numeric(2,1) | Nota média (0 a 5), começa em 0 |
| `created_at` / `updated_at` | timestamptz  | Datas automáticas               |

Mesma política da `accounts`: RLS sem policies públicas; só o servidor acessa.

---

## Tecnologias

| Camada              | Ferramentas                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| Front-end           | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, React Query |
| Validação           | Zod (o mesmo schema vale no navegador e no servidor)                              |
| Back-end            | Next.js (rotas de API), tRPC, bcryptjs, nanoid                                    |
| Banco de dados      | Supabase (PostgreSQL)                                                             |
| Qualidade           | Biome (lint e formatação)                                                         |
| Hospedagem prevista | Vercel                                                                            |
| Automação prevista  | n8n                                                                               |
| IA                  | Mastra.ai (agentes) + OpenAI `gpt-4o-mini`                                        |

Detalhes em [`docs/architecture.md`](docs/architecture.md).

---

## Estrutura do projeto

```
├── docs/                  Documentação de arquitetura
├── specs/                 Especificações das funcionalidades (comece por aqui!)
│   ├── _template.md       Modelo para novas specs
│   └── sign-up, sign-in, home, feedback
├── supabase/migrations/   Scripts SQL do banco
├── scripts/               Utilitários (seed de produtos)
└── src/
    ├── app/
    │   ├── (platform)/    Páginas com cabeçalho: home (/) e /products/[id]
    │   ├── auth/          Telas de sign-in, sign-up e sucesso
    │   └── api/           /api/v1/{sign-up,sign-in,sign-out,products,...} e /api/trpc
    ├── components/        Componentes visuais (layout, produtos, formulários, ui)
    ├── lib/schemas/       Regras de validação (Zod)
    └── server/            Lógica do servidor: auth/sessão, banco, tRPC, serviços
```

---

## Feature: avaliações de produto (feedback)

Página pública de detalhes do produto em **`/products/[id]`**: mostra o produto (imagem, nome, descrição, nota média e botão para o link externo), todas as avaliações (mais recentes primeiro, com nome + inicial do sobrenome, avatar, estrelas, comentário e data) e, por último, o formulário para avaliar. Quem não está logado vê um bloco "Entre para avaliar" com os botões **Entrar** e **Criar conta**; quem está logado envia nota de 1 a 5 + comentário. Cada pessoa pode avaliar o mesmo produto mais de uma vez. Produto inexistente mostra a página "Produto não encontrado".

### `POST /api/v1/products/{id}/feedbacks`

Exige sessão (cookie de login). O autor é sempre a pessoa logada.

```json
{ "score": 5, "comment": "Produto excelente!" }
```

| Status | Significado                                                                   |
| ------ | ----------------------------------------------------------------------------- |
| `201`  | Avaliação criada: `{ "id": "..." }`                                           |
| `400`  | Nota fora de 1-5, comentário vazio/maior que 1000 caracteres ou JSON inválido |
| `401`  | Sem login                                                                     |
| `404`  | Produto não existe                                                            |
| `500`  | Erro interno                                                                  |

Depois de gravar, a nota média do produto (`products.score`) é recalculada.

### Tabela `products_feedbacks`

Migration: `supabase/migrations/20261117020000_create_products_feedbacks.sql` (precisa das tabelas `accounts` e `products`).

| Coluna       | Tipo        | Observação                                             |
| ------------ | ----------- | ------------------------------------------------------ |
| `id`         | text        | `nanoid`                                               |
| `score`      | int         | Nota de 1 a 5                                          |
| `comment`    | text        | Comentário                                             |
| `created_at` | timestamptz | Automático                                             |
| `created_by` | text        | Referência a `accounts.id`                             |
| `product_id` | text        | Referência a `products.id` (apaga junto com o produto) |

Também usa Row Level Security sem políticas públicas: só o servidor acessa.

---

## Resumo das avaliações por IA

Na página `/products/{id}`, entre as informações do produto e a lista de avaliações, aparece um cartão destacado com o selo **IA**: um resumo geral de todos os comentários, escrito em português por um agente de IA.

**Como funciona**

1. Um agente do [Mastra](https://mastra.ai) (`src/mastra/agents/review-summary-agent.ts`) usa o modelo `openai/gpt-4o-mini`.
2. Ele recebe o nome do produto, as notas e os comentários (até as 200 avaliações mais recentes, 500 caracteres cada) e devolve um parágrafo curto com o consenso, os elogios e as críticas.
3. O resumo é salvo na tabela `products` (cache), então a IA **não** é chamada a cada visita.
4. Ele é gerado em segundo plano logo depois de uma nova avaliação e, como garantia, quando alguém abre um produto cujo resumo está ausente ou desatualizado. Enquanto isso, o cartão mostra "A IA está preparando o resumo...".
5. Os comentários são tratados só como dados: o agente ignora instruções escritas dentro deles.

**Para ativar**

- Defina `OPENAI_API_KEY` no `.env.local`. Sem a chave, o cartão fica oculto e nada quebra.
- Execute `supabase/migrations/20261117030000_add_ai_summary_to_products.sql` no SQL Editor do Supabase.
- Opcional: `AI_SUMMARY_MODEL` troca o modelo (padrão `openai/gpt-4o-mini`).

Colunas novas em `products`: `ai_summary` (texto), `ai_summary_feedback_count` (quantas avaliações o resumo considerou) e `ai_summary_updated_at`.

Código: `src/server/services/ai-summary.ts` (gera e salva) e `src/components/products/ai-summary.tsx` (cartão).

---

## Como contribuir

O projeto segue **desenvolvimento guiado por especificação**: toda funcionalidade nova começa com um arquivo em `specs/` (use [`specs/_template.md`](specs/_template.md)) descrevendo contexto, requisitos e critérios de aceitação.

Padrões de código e interface estão em [`CLAUDE.md`](CLAUDE.md). Os principais:

- Todo botão/elemento clicável usa `cursor-pointer`.
- Todo campo de senha usa o componente `PasswordField` (com botão de mostrar/ocultar).
- Cores e fontes vêm das variáveis de `src/app/globals.css`, sem hex soltos.
- Interface responsiva, com foco visível, contraste adequado e respeito a `prefers-reduced-motion`.

Antes de abrir um PR, rode `npm run lint`.

## Login, sessão e cabeçalho (sign-in)

Pessoas com conta entram em `/auth/sign-in` com email e senha.

- **Tela de login** (`/auth/sign-in`): formulário validado no navegador; erros de credencial aparecem em um alerta vermelho com a mensagem genérica "Email ou senha inválidos". Sucesso leva para `/`.
- **Última avaliação no painel lateral**: as telas de login e de criação de conta mostram, no painel da esquerda (telas largas), a avaliação mais recente feita na plataforma: autor, produto (com link), nota, comentário e quando foi feita. Sem avaliações, o painel fica sem o cartão. Componente: `src/components/auth/latest-review.tsx`.
- **Layout da plataforma**: grupo de rotas `src/app/(platform)/` com cabeçalho. Deslogado mostra o botão **Entrar**; logado mostra avatar (DiceBear), nome completo e email, com menu para **Sair**. As páginas `auth/*` ficam fora desse layout.
- **Sessão**: cookie `session` (httpOnly, `sameSite=lax`, `secure` em produção, 7 dias) com JWT assinado (HS256, biblioteca `jose`). Para ler a sessão no servidor use `getSession()` de `src/server/auth/session.ts` (retorna `{ accountId, firstName, lastName, email }` ou `null`).
- **Variável nova**: `SESSION_SECRET` no `.env.local` (segredo com 32+ caracteres para assinar o cookie).

### `POST /api/v1/sign-in`

Corpo JSON: `{ "email": "...", "password": "..." }`.

| Status | Significado                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------- |
| `200`  | Login feito; cookie definido; retorna `{ id, firstName, lastName, email }`                      |
| `400`  | Dados mal formatados                                                                            |
| `401`  | Email ou senha inválidos (mesma resposta para email inexistente, senha errada ou conta inativa) |
| `500`  | Erro interno                                                                                    |

### `POST /api/v1/sign-out`

Remove o cookie de sessão e responde `204`.
