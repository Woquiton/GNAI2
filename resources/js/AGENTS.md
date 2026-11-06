# Desenvolvimento React

Base React/TypeScript do Gnai. As regras gerais estão no `AGENTS.md` da raiz, que indica qual convenção de `docs/ai-conventions/` ler para cada tipo de tarefa. Aqui ficam só as regras de escrita do código desta pasta.

- `pages/` contém só entradas Inertia (`pages/Recurso/Acao.tsx`); cada recurso tem `components/<Recurso>/` com `Form/`, `List/` e `Details/`.
- CSS fica em `resources/css/`, espelhando a organização dos componentes e páginas; importe por `@styles/`. Imagens processadas pelo Vite ficam em `resources/images/`.
- Em TSX, expanda componentes, props, condicionais e callbacks complexos em várias linhas. Mantenha o `return` declarativo: calcule rótulos, condicionais encadeadas e opções antes dele.
- Confirmações destrutivas usam `UI/ConfirmActionModal` (custombox Ubold, cabeçalho grafite, conteúdo centralizado). Suas ações ficam só com ícones, com `title` e `aria-label` derivados dos rótulos de confirmar e cancelar. Nunca use `window.confirm`.
- Interface em pt-BR. O catálogo demonstrativo do tema foi removido; preserve os componentes convertidos e os assets de terceiros utilizados pelo Gnai.
