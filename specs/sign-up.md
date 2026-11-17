# Nome da funcionalidade

## Escopo

Front-End, Back-End, Banco de dados

## Contexto

Precisamos implementar o fluxo de criacao de contas na plataforma, as pessoas precisarao fornecer:

- Nome
- Sobrenome
- Email
- Senha
- Confirmacao de senha

## Requisitos funcionais

1. Precisamos adicionar validacao no formulario na camada de cliente
   1.1. Caso o formulario esteja valido, podemos enviar a requisicao para a API
2. Os campos de nome e sobrenome devem ser separados
3. Precisamos criar uma nova conta no banco de dados na tabela de accounts
   3.1. `id`: nanoid (gerado com `nanoid` na camada de API)
   3.2. `first_name` text
   3.3. `last_name`: text
   3.4. `created_at`: timestamp
   3.5. `updated_at`: timestamp
   3.6. `active`: boolean
   3.7. `email`: text
   3.8. `password`: text (hashed)
   3.9. `salt`: text (hashed)
4. A requisicao deve ser um `POST` para `/api/v1/sign-up` e receber os dados com JSON no `body`
5. Caso tudo de certo, retornar `201` ou erros de acordo com a validacao:
   5.1 `400`: Ma formatacao de dados

## Requisitos nao funcionais

- Seguranca: Precisamos salvar as senhas de forma segura no banco de dados
  - Precisamos receber os dados do cliente de forma segura usando HTTPS (para previnir network sniff)
- UI/UX: Boa experiencia de uso atraves de uma interface bonita, elegante e moderna
- Performance: O processo de criacao de conta precisa ser rapido

## Voce deve

- Criar a base do projeto com um endpoint inicial para criacao de conta
- Criar a base do projeto com uma pagina inicial para a interface de criacao de conta
- Configurar as bibliotecas base

## Voce nao deve

- Implementar qualquer outra funcionalidade que nao esteja relacionada com sign-up (criacao de contas)
- Nao vamos realizar nenhum envio de email no momento, apenas processar a requisicao, salvar no banco de dados e retornar um sucesso ou erro

## Tecnologias (Stack)

React.js, Next.js, React-hook-form, Shadcn, TailWindCSS, Supabase, TRPC

## Criterios de aceitacao

- Temos uma pagina para criar a nova conta em `auth/sign-up`
- A pagina contem um formulario com validacao
- A plataforma consegue se comunicar com a API para enviar os dados e receber uma resposta
- Estamos informando possiveis erros
  - Mostrar um alert em vermelho no formulario
- Estamos informando o sucesso de criacao da conta
  - Navegar para `auth/sign-up/success`

## Resultado

Pessoas conseguem criar uma nova conta na plataforma
