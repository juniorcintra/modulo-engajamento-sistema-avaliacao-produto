# Plano: Sign-In (Autenticação)

Spec: [`specs/sign-in.md`](../../specs/sign-in.md) · Status: **aguardando aprovação** · Branch: `feat/sign-in`

## Objetivo

Pessoas com conta entram na plataforma com email e senha. O cabeçalho passa a mostrar "Entrar" (deslogado) ou avatar + nome + email (logado). Esta feature também entrega o **layout base** que as outras duas usam.

## O que será entregue

1. Página `/auth/sign-in` com formulário validado.
2. Endpoint `POST /api/v1/sign-in` que cria a sessão por cookie.
3. Layout base da plataforma com cabeçalho.
4. Home mínima (título + esqueleto) em `/`, hoje ela só redireciona para o sign-up.
5. Utilitário `getSession()` reutilizável (contrato usado por _feedback_).

## Decisões técnicas

### Sessão

- Cookie **httpOnly**, `sameSite=lax`, `secure` em produção, validade 7 dias.
- Conteúdo: JWT assinado (HS256) com a biblioteca `jose`, guardando `accountId`, `firstName`, `lastName`, `email`.
- Segredo em `SESSION_SECRET` (novo no `.env.example`).
- Escolhi `jose` em vez de `iron-session` por ser leve e não depender de runtime específico.

### Endpoint `POST /api/v1/sign-in`

- Corpo: `{ email, password }`, validado com Zod (`src/lib/schemas/sign-in.ts`), mesmo schema no cliente e no servidor.
- Busca a conta por `email` (minúsculo) na tabela `accounts` e compara com `bcrypt.compare` contra a coluna `password`.
- Só aceita contas com `active = true`.
- Respostas: `200` (cookie definido, retorna `{ id, firstName, lastName, email }`), `400` formato inválido, `401` credenciais inválidas, `500` erro interno.
- Segurança: mensagem **genérica** ("Email ou senha inválidos") tanto para email inexistente quanto senha errada, e conta inativa. Para email inexistente, executa um `bcrypt.compare` falso, evitando revelar contas pelo tempo de resposta.

### Layout e cabeçalho

- Route group `src/app/(platform)/` com `layout.tsx` (header + conteúdo). As páginas `auth/*` mantêm o `AuthShell` atual (tela cheia, sem header).
- `SiteHeader` é Server Component e lê `getSession()`:
  - Deslogado: logo + botão **Entrar** (`/auth/sign-in`).
  - Logado: avatar (DiceBear `initials`, usando `Nome Sobrenome` como seed) + nome completo + email. No mobile, o texto colapsa e fica só o avatar.
- Avatar com `<img>` simples, pois o `next/image` bloqueia SVG por padrão.
- Home: `(platform)/page.tsx` com título e esqueleto (cards "fantasma"). Será substituída pela feature _home_.

### Design

Seguir `.agents/skills/frontend-design/SKILL.md` e os tokens de `globals.css` (`bg-panel`, `text-star` etc.). Reaproveitar `AuthShell`, `Field`, `PasswordField`, `Alert`, `Button`. Responsivo, foco visível, `prefers-reduced-motion`. Links cruzados entre sign-in e sign-up.

## Arquivos

| Novo                                                                                        | Alterado                                                   |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/lib/schemas/sign-in.ts`                                                                | `src/app/page.tsx` (movido para `(platform)/page.tsx`)     |
| `src/server/services/sign-in.ts`                                                            | `src/app/layout.tsx` (se necessário)                       |
| `src/server/auth/session.ts` (`createSession`, `getSession`, `destroySession`)              | `src/components/sign-up-screen.tsx` (link "Já tem conta?") |
| `src/app/api/v1/sign-in/route.ts`                                                           | `.env.example`, `package.json` (`jose`)                    |
| `src/app/auth/sign-in/page.tsx` + `src/components/sign-in-screen.tsx`                       | `README.md` (sua seção)                                    |
| `src/app/(platform)/layout.tsx`, `src/components/layout/site-header.tsx`, `user-avatar.tsx` |                                                            |

## Passos

1. Instalar `jose`, adicionar `SESSION_SECRET` ao `.env.example`.
2. Criar `session.ts` (contrato fixo, ver orquestração).
3. Schema + serviço + rota `POST /api/v1/sign-in`.
4. Layout `(platform)` + `SiteHeader` + home esqueleto.
5. Página e formulário de sign-in (erro em alert vermelho, redireciona para `/` no sucesso e `router.refresh()` para atualizar o header).
6. Atualizar README e rodar lint, `tsc` e `build`.

## Verificação

- `curl`: 200 + `Set-Cookie`, 400, 401 (senha errada e email inexistente com a mesma mensagem).
- Navegador: formulário valida, erro em vermelho, sucesso vai a `/`, header mostra o avatar, sem cookie mostra "Entrar".
- Cookie `HttpOnly` visível nas ferramentas do navegador.

## Ambiguidades e decisões que preciso de você

1. **Logout**: a spec não pede, mas sem ele não dá para testar o estado deslogado depois de entrar. Proposta: incluir um botão mínimo no menu do avatar + `POST /api/v1/sign-out`. Aprova?
2. **Seção "Você não deve"** está copiada da spec de sign-up (fala de "criação de contas" e email). Vou interpretar como "não implementar nada fora do sign-in".
3. **Critério de aceitação** diz "página para criar a nova conta em `/auth/sign-in`", claramente erro de copiar/colar. Vou tratar como "página de login".
4. **Stack cita Bunjs**: o projeto usa Node/npm e vou manter assim.
