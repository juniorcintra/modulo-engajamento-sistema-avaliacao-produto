# Padrões do projeto

Regras que valem para todo o código deste repositório. Leia antes de criar ou alterar interface.

## Interface (UI)

### Botões e elementos clicáveis

- Todo botão, ou qualquer elemento que dispare uma ação (`<button>`, links estilizados como botão, ícones clicáveis), deve ter `cursor-pointer`.
- O componente `Button` (`src/components/ui/button.tsx`) já inclui `cursor-pointer` na base, então `buttonVariants` aplicado em `<Link>` também herda. Ao criar um `<button>` cru, adicione `cursor-pointer` manualmente.
- Botão desabilitado não mostra cursor de ação (`disabled:pointer-events-none`).

### Campos de senha

- **Todo** campo de senha e **todo** campo de confirmação de senha devem ter o botão de mostrar/ocultar o que foi digitado.
- Use sempre `PasswordField` (`src/components/ui/password-field.tsx`); nunca um `<Input type="password">` direto. Cada campo controla a própria visibilidade, de forma independente.
- O botão tem `aria-label` ("Mostrar senha" / "Ocultar senha"), `aria-pressed` e `cursor-pointer`.

## Design visual

- Siga `.agents/skills/frontend-design/SKILL.md` em qualquer mudança visual: plano (cores, tipografia, layout), revisão contra o genérico, depois código.
- Tokens de cor e fontes ficam em `src/app/globals.css`; use as variáveis (`bg-primary`, `text-muted-foreground`, `bg-panel`, `text-star`...) em vez de hex soltos.
- Piso de qualidade: responsivo, foco visível, `prefers-reduced-motion` respeitado, contraste adequado.
