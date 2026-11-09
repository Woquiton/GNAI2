# Identidade visual do Gnai

A migração moderniza a tecnologia e a apresentação do Gnai preservando identidade visual, padrões de interação, feedbacks e funcionalidade. Antes de criar algo novo, procure o que o próprio Gnai já possui. Componentes do tema são ferramentas; logo, conteúdo, imagens e navegação demonstrativos do tema removido não são padrões do produto. Detalhes de campos, seções e envio ficam na [convenção de formulários](form-pages.md).

## Marca e tokens

- Interface em pt-BR e marca **Gnai**. Não exponha "Bold", "Interface", nomes do template ou dados fictícios do catálogo; revise menus, títulos e rodapé dos componentes reutilizados.
- `resources/css/tokens.css` consolida cores, tipografia, espaçamento, raios e foco. `--ui-color-primary` aponta para o roxo institucional (`--ui-color-gnai-primary`, `#322b75` em `resources/css/variables.css`); o azul do tema fica isolado em `--ui-color-theme-blue`.
- A paleta temática vigente é a **Digital moderna**: verde `#16a34a`, azul `#3b82f6`, âmbar `#f59e0b`, vermelho `#ef4444`, ciano `#06b6d4`, grafite `#64748b` e verde-azulado `#14b8a6`. Esses tons substituem a paleta Ubold de 2014–2016 nos tokens sem alterar o roxo institucional do Gnai.
- Etiquetas especiais usam dourado (`--ui-color-special-tag`, `#b8860b`). Nas listagens e no select unificado de etiquetas de pessoas, uma estrela dourada identifica o tipo, com tooltip “Etiqueta Especial” no hover e no foco por teclado.
- Não fixe cores de marca nas páginas, não crie paletas ou variantes locais de roxo/azul e não importe todo o CSS legado. `UI/Button` define seus tons só por variáveis, sem `!important`.
- Evite dimensões rígidas que quebrem telas menores; preserve labels, foco, teclado e apresentação acessível dos erros.
- Uma reprodução temporária de outro tema, pedida pelo usuário, vale apenas para a tela indicada.
- Modais usam texto principal e auxiliar em `--ui-color-text` sobre superfície opaca; o cabeçalho grafite mantém texto branco. O desfoque fica restrito ao fundo, inclusive durante as animações, e o botão de fechar mantém opacidade integral.

## Cabeçalho e navegação da página

- `Navigation/PageTitle`, usado por `BusinessPage`, é o cabeçalho de negócio: título roxo escuro, peso 700, fonte legada, até 2 rem; subtítulo na fonte legada, 1 rem, cinza do antigo `text-muted`. Usa `h1` sem mudar a aparência e recebe ações por `actions`, à direita, com quebra responsiva. `Navigation/PageHeader` permanece só como referência Ubold.
- Cada módulo e cadastro da sidebar usa um ícone distinto, com significado relacionado à sua função. Confira os itens e subitens de `AppNavigation` antes de escolher um ícone das bibliotecas já disponíveis no Gnai.
- `Navigation/PageBreadcrumb`: links azuis (`#337ab7`), hover e foco em azul escuro (`#23527c`). Não reproduza cabeçalho ou breadcrumb por página.

## Ações e rodapé

- Nas telas de visualizar, criar e editar, as ações principais ficam em `Forms/FormActions`, logo depois do conteúdo, sem repetição no cabeçalho. Ações secundárias, como PDF, usam a prop `secondary`, à esquerda.
- No celular (até 767 px) o rodapé fica colado à base da tela, de ponta a ponta. A ação principal (`tone="save"` ou `tone="warning"`, como Salvar e Editar) mostra o rótulo; as demais ficam só com ícone e usam o `title` como nome.
- Botões têm ícone pertinente e texto curto (`Salvar`, `Cancelar`, `Voltar`, `Editar`, `Excluir`, `PDF`) e sempre `title`. Ações só com ícone exigem `aria-label`. `iconOnly` só em exceções autorizadas; remova o ícone só quando pedido (`showIcon={false}`).
- Botões que abrem o site público em nova aba, como **Ver no site**, **Abrir no site** e **Ver site**, usam `tone="dark-blue"` e ícone `fa fa-external-link`.
- Salvar usa check no verde semântico de sucesso (`tone="save"`), o mesmo das etiquetas positivas; cancelar e voltar usam X cinza (`tone="cancel"`). Preserve desabilitação e indicação de processamento durante o envio.
- Cadastrar usa `tone="create"`, no mesmo verde de Salvar. Ações de navegação de listagens, como Meus Atendimentos e Todos os Atendimentos, usam `tone="list-action"` no roxo institucional; seus tokens não dependem dos de Salvar.

## Assets próprios confirmados

| Asset | Uso real |
| --- | --- |
| `public/images/logo.png`, `logo2.png`, `gnai.png` | Identidade: o login e a sidebar Blade legados usavam `logo.png` e `logo2.png`; o cabeçalho dos PDFs (`components/pdf/header.blade.php`) usa `gnai.png`. Não substitua por logo do template. |
| `public/images/favicon.png` | Página Sobre (`pages/about-us.blade.php`); ainda não ligado a `resources/views/inertia.php`. |
| `public/images/default-user.jpg`, `public/images/team/` | Avatar padrão de `User`/`Person` e fotos da equipe na página Sobre. |
| `resources/images/icons/select-down.svg` e `public/images/icons/select-down.svg` | Seta dos filtros. Não há biblioteca própria extensa de ícones institucionais. |

`public/images/` preserva apenas a textura de autenticação e o indicador de carregamento usados pelo Gnai; fotos e imagens demonstrativas do tema foram removidas. A autenticação React usa a textura `agsquare.png` via `Navigation/AccountLayout`, sem a logo do login legado; não há outra imagem própria de fundo (confira `resources/css/auth/login.css` no histórico). Escolha assets pelo uso real, não pelo nome.
