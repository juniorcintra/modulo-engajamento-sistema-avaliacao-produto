# Módulo de Engajamento — Sistema de Avaliação de Produto

Plataforma web onde pessoas poderão avaliar produtos (notas em estrelas e comentários). Este repositório é o **ponto de partida** do projeto e, por enquanto, entrega uma única funcionalidade: **a criação de conta (sign-up)**.

> Projeto de estudo da Pós-Graduação em Engenharia de IA Aplicada.

---

## Em uma frase

Uma pessoa abre a página, preenche nome, sobrenome, e-mail e senha, e sua conta é criada de forma segura no banco de dados.

## O que já funciona

| Funcionalidade | Onde |
| --- | --- |
| Tela de criação de conta, com validação em tempo real | `/auth/sign-up` |
| Tela de confirmação após criar a conta | `/auth/sign-up/success` |
| API para criar conta | `POST /api/v1/sign-up` |
| Senha armazenada de forma segura (hash + salt) | Servidor |

**Ainda não existe:** login, avaliações de produtos, envio de e-mails. Isso está fora do escopo atual (ver [`specs/sign-up.md`](specs/sign-up.md)).

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

# 4. Crie a tabela no banco
#    Copie o conteúdo de supabase/migrations/20261117000000_create_accounts.sql
#    e execute no "SQL Editor" do painel do Supabase

# 5. Inicie o projeto
npm run dev
```

Abra <http://localhost:3000/auth/sign-up> no navegador.

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` é uma chave secreta. Use-a **somente no servidor**, nunca a publique nem envie para o Git (o `.env.local` já é ignorado).

### Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm start` | Executa a versão de produção |
| `npm run lint` | Verifica a qualidade do código (Biome) |
| `npm run format` | Formata o código automaticamente |

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

| Campo | Regra |
| --- | --- |
| `firstName`, `lastName` | Obrigatórios, até 100 caracteres |
| `email` | Formato válido (é salvo em minúsculas) |
| `password` | De 8 a 72 caracteres |
| `confirmPassword` | Deve ser igual a `password` |

**Respostas**

| Status | Significado | Corpo |
| --- | --- | --- |
| `201` | Conta criada | `{ "id": "..." }` |
| `400` | Dados inválidos ou JSON malformado | `{ "message": "Dados inválidos", "errors": { ... } }` |
| `409` | E-mail já cadastrado | `{ "message": "Este email já tem uma conta. Use outro email." }` |
| `500` | Erro interno | `{ "message": "Erro interno do servidor" }` |

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/api/v1/sign-up \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Maria","lastName":"Silva","email":"maria@exemplo.com","password":"minhasenha123","confirmPassword":"minhasenha123"}'
```

---

## Banco de dados

Tabela `accounts` (definida em [`supabase/migrations`](supabase/migrations)):

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | text | Identificador único gerado com `nanoid` |
| `first_name` / `last_name` | text | Nome e sobrenome |
| `email` | text | Único (não permite repetir) |
| `password` | text | Hash bcrypt, nunca a senha real |
| `salt` | text | Salt usado no hash |
| `active` | boolean | Padrão `true` |
| `created_at` / `updated_at` | timestamptz | Datas automáticas |

A tabela usa Row Level Security sem políticas públicas: **só o servidor** (via service role) consegue acessá-la.

---

## Tecnologias

| Camada | Ferramentas |
| --- | --- |
| Front-end | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, React Query |
| Validação | Zod (o mesmo schema vale no navegador e no servidor) |
| Back-end | Next.js (rotas de API), tRPC, bcryptjs, nanoid |
| Banco de dados | Supabase (PostgreSQL) |
| Qualidade | Biome (lint e formatação) |
| Hospedagem prevista | Vercel |
| Automação prevista | n8n; agentes internos com Mastra.ai |

Detalhes em [`docs/architecture.md`](docs/architecture.md).

---

## Estrutura do projeto

```
├── docs/                  Documentação de arquitetura
├── specs/                 Especificações das funcionalidades (comece por aqui!)
│   ├── _template.md       Modelo para novas specs
│   └── sign-up.md         Spec da criação de conta
├── supabase/migrations/   Scripts SQL do banco
└── src/
    ├── app/               Páginas e rotas de API (Next.js)
    │   ├── auth/sign-up/  Telas de cadastro e sucesso
    │   └── api/           /api/v1/sign-up e /api/trpc
    ├── components/        Componentes visuais (formulário, campos, botões)
    ├── lib/schemas/       Regras de validação (Zod)
    └── server/            Lógica do servidor: banco, tRPC, serviços
```

---

## Feature: avaliações de produto (feedback)

Página pública de detalhes do produto em **`/products/[id]`**: mostra o produto (imagem, nome, descrição, nota média e botão para o link externo), todas as avaliações (mais recentes primeiro, com nome + inicial do sobrenome, avatar, estrelas, comentário e data) e, por último, o formulário para avaliar. Quem não está logado vê um bloco "Entre para avaliar" com os botões **Entrar** e **Criar conta**; quem está logado envia nota de 1 a 5 + comentário. Cada pessoa pode avaliar o mesmo produto mais de uma vez. Produto inexistente mostra a página "Produto não encontrado".

### `POST /api/v1/products/{id}/feedbacks`

Exige sessão (cookie de login). O autor é sempre a pessoa logada.

```json
{ "score": 5, "comment": "Produto excelente!" }
```

| Status | Significado |
| --- | --- |
| `201` | Avaliação criada: `{ "id": "..." }` |
| `400` | Nota fora de 1-5, comentário vazio/maior que 1000 caracteres ou JSON inválido |
| `401` | Sem login |
| `404` | Produto não existe |
| `500` | Erro interno |

Depois de gravar, a nota média do produto (`products.score`) é recalculada.

### Tabela `products_feedbacks`

Migration: `supabase/migrations/20261117020000_create_products_feedbacks.sql` (precisa das tabelas `accounts` e `products`).

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | text | `nanoid` |
| `score` | int | Nota de 1 a 5 |
| `comment` | text | Comentário |
| `created_at` | timestamptz | Automático |
| `created_by` | text | Referência a `accounts.id` |
| `product_id` | text | Referência a `products.id` (apaga junto com o produto) |

Também usa Row Level Security sem políticas públicas: só o servidor acessa.

---

## Como contribuir

O projeto segue **desenvolvimento guiado por especificação**: toda funcionalidade nova começa com um arquivo em `specs/` (use [`specs/_template.md`](specs/_template.md)) descrevendo contexto, requisitos e critérios de aceitação.

Padrões de código e interface estão em [`CLAUDE.md`](CLAUDE.md). Os principais:

- Todo botão/elemento clicável usa `cursor-pointer`.
- Todo campo de senha usa o componente `PasswordField` (com botão de mostrar/ocultar).
- Cores e fontes vêm das variáveis de `src/app/globals.css`, sem hex soltos.
- Interface responsiva, com foco visível, contraste adequado e respeito a `prefers-reduced-motion`.

Antes de abrir um PR, rode `npm run lint`.
