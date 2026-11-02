# Convenção de acessibilidade do frontend

Vale para as telas e os componentes do Gnai em `resources/react/` (área autenticada, Portal do Professor, autenticação e site público). Exemplos demonstrativos do catálogo (`resources/react/catalog/`) e componentes de referência do template não precisam seguir este padrão.

## Base normativa

- **LBI — Lei Brasileira de Inclusão (Lei 13.146/2015), art. 63**: sítios mantidos por órgãos de governo ou instituições públicas devem ser acessíveis segundo as melhores práticas e diretrizes internacionais.
- **eMAG 3.1 — Modelo de Acessibilidade em Governo Eletrônico**, padrão do gov.br: atalhos de teclado para conteúdo, menu, busca e rodapé; barra de acessibilidade no topo; alto contraste; foco visível; ordem lógica de navegação.
- **WCAG 2.2, nível AA** (referência do eMAG e da ABNT NBR 17225:2025): em especial 1.4.3 Contraste mínimo, 1.4.11 Contraste não textual, 2.1.1 Teclado, 2.4.1 Ignorar blocos, 2.4.3 Ordem do foco, 2.4.7 Foco visível, 2.4.11 Foco não encoberto, 2.5.3 Rótulo no nome e 2.3.3 Animação a partir de interações.

## Foco: clique discreto, teclado reforçado

`utils/accessibilityPreferences.ts` grava em `<html data-focus-mode>` se a última interação foi pelo teclado (`keyboard`) ou por mouse, toque ou caneta (`pointer`). `main.tsx` instala esse controle uma única vez.

- **Clique:** cada componente mantém seu foco discreto, como a borda roxa dos campos.
- **Teclado:** `styles/accessibility.css` aplica a todo elemento com `:focus-visible` um anel de 3 px que acompanha o arredondamento do controle, com fresta clara e halo translúcido.
- O anel usa `!important` de propósito, para vencer resets `outline: 0` de plugins legados. Não crie outro estilo de foco por tela.

Os tokens ficam em `styles/tokens.css` e podem ser redefinidos localmente por um componente:

| Token | Função |
| --- | --- |
| `--ui-focus-keyboard-color` | Cor do anel (padrão: roxo de foco dos campos) |
| `--ui-focus-keyboard-width` | Espessura do anel |
| `--ui-focus-keyboard-offset` | Distância do controle; negativo desenha por dentro |
| `--ui-focus-keyboard-gap-color` | Cor da fresta entre o controle e o anel |
| `--ui-focus-keyboard-halo-size` e `--ui-focus-keyboard-halo-strength` | Tamanho e opacidade do halo |
| `--ui-focus-keyboard-shadow` | Defina `none` para remover fresta e halo |

Regras de uso:

- **Fundos escuros ou roxos** (sidebar, topbar, barra do portal) redefinem a cor para um tom claro. Exemplos: `SidebarPrimary.css`, `TopBarPrimary.css` e `TeacherPortalLayout.css`.
- **Itens dentro de áreas com rolagem ou `overflow: hidden`** usam deslocamento negativo e `--ui-focus-keyboard-shadow: none`, para o anel não ser cortado.
- **Controles com input nativo oculto** precisam mostrar o anel na parte visível. Checkbox e radio já o mostram no `label::before`; Select2 e `FileUploadButton`, no contêiner. Siga esse modelo em novos controles do tipo.
- **Regiões que recebem foco programático** (`tabindex="-1"`, como o conteúdo principal e diálogos) não ganham anel.
- Nunca remova o foco (`outline: 0`) sem oferecer substituto visível equivalente.

## Atalhos de acessibilidade (padrão gov.br)

`Navigation/SkipLinks` é a barra de atalhos do eMAG. Ela fica fora da tela, aparece no topo ao receber o primeiro Tab e é o primeiro elemento focável dos layouts.

| Tecla | Atalho | Destino |
| --- | --- | --- |
| 1 | Conteúdo | `#conteudo`, área de conteúdo do layout |
| 2 | Página inicial | Painel (`/autenticacao/painel`) ou início do portal (`/professor`) |
| 3 | Menu | `#sidebar-menu`; no celular, abre o menu lateral antes do foco |
| 4 | Rodapé | `#rodape`, o `AppFooter` |

- **Teclas de acesso:** Alt + número no Chrome e no Edge, Alt + Shift + número no Firefox e Control + Option + número no Safari.
- **Numeração estável:** o Gnai não tem busca global, então o atalho "Busca" do gov.br não existe. O Portal do Professor não tem menu lateral e mantém os números 1, 2 e 4.
- **Locais de uso:** `Navigation/AppLayout` e `Navigation/TeacherPortalLayout` montam a barra. Não a repita em páginas, em `BusinessPage` ou em wrappers de domínio.
- **Site público:** `Website/SiteLayout` mantém seu link "Pular para o conteúdo", com a identidade white label do site.

## Navegação por teclado na sidebar

- Ativar um item pelo teclado (Enter) mantém o foco nele. Só o clique do mouse remove o foco.
- **Menu expandido:** Enter abre e fecha os grupos. Os submenus fechados ficam `inert` e saem da ordem do Tab.
- **Menu recolhido:** o foco mostra o nome do item, como o hover. Enter ou seta para a direita abrem o submenu flutuante e levam o foco ao primeiro link.
- **Dentro do submenu flutuante:** Esc ou seta para a esquerda fecham e devolvem o foco ao item. Tab no último link segue para o próximo item do menu, e Shift + Tab no primeiro volta ao item de origem.
- **Marcação:** o menu fica em `<nav id="sidebar-menu" aria-label="Menu principal">`, e o item atual usa `aria-current="page"`.

## Marcação por teclado

- **Checkbox:** `Forms/ChoiceControl` usa o checkbox nativo e alterna somente com Espaço, como define o padrão de checkbox da WAI-ARIA e como fazem o gov.br e os leitores de tela. Não adicione Enter: usuários de teclado esperam o Espaço, e o Enter fica reservado a ativar botões e links e a enviar formulários.
- **Interruptor:** `Forms/ToggleControl` expõe `role="switch"` e alterna com Espaço e Enter.
- **Radio:** mantém o padrão nativo. As setas mudam a opção do grupo e Espaço marca a opção focada.

## Foco não encoberto

`styles/accessibility.css` aplica `scroll-padding` ao documento quando há topbar fixa (`AppLayout` e Portal do Professor) ou rodapé fixo de ações (`Forms/FormActions`). Assim, o foco pelo Tab e os alvos dos atalhos não ficam escondidos atrás dessas barras. Novas barras fixas devem entrar nessa regra.

## Movimento reduzido

Com `prefers-reduced-motion: reduce` ativo no sistema, animações, transições e rolagem suave ficam praticamente instantâneas para todo o frontend.

## Componentes compartilhados

- `FormField` fornece label e IDs de dica e erro; o consumidor passa o `id` ao controle e liga `aria-describedby`. Os campos de `Forms/FormFields` já fazem essa ligação.
- `Button` diferencia botão de link, sempre apresenta `title` e aceita `aria-label`. `title` e `UI/Tooltip` são complementares e não substituem o nome acessível.
- `Tooltip` abre por hover e foco, usa `role="tooltip"`/`aria-describedby`, sobrescreve a descrição anterior e depende de o filho encaminhar o atributo (`Button` encaminha). Confira a composição real.
- `Modal` e `ConfirmActionModal` têm `role="dialog"`, `aria-modal`, Escape, título ligado por `useId` e, via `useDialogFocus`, foco inicial, contenção do Tab e retorno ao disparador. Use `initialFocus` quando o fluxo exigir outro alvo.
- `NotificationToast` usa `role="alert"` e botão de fechar. `InlineAlert` não cria região de anúncio. A opção `confirm` do toast é demonstração com `window.alert`, não confirmação de negócio. Registre lacunas para o componente comum, sem criar sistema paralelo.

## Checklist por tela ou componente

- **Teclado:** todas as ações funcionam por teclado, na ordem visual, sem armadilhas de foco. Modais usam `useDialogFocus`.
- **Elementos:** ações usam `<button>` e navegação usa link. Ações só com ícone têm `aria-label`, e o texto visível está contido no nome acessível.
- **Formulários:** campos têm label ligada por `htmlFor`/`id`. Erros usam `aria-invalid` e `aria-describedby`, e a obrigatoriedade é indicada também por texto.
- **Percepção:** estados não dependem só de cor. O contraste mínimo é 4,5:1 para texto e 3:1 para ícones, bordas de controles e anel de foco.
- **Estrutura:** há um único `<main>` por tela (`BusinessPage`), títulos em ordem e imagens informativas com `alt`; as decorativas usam `alt=""`.
- **Foco:** o anel de teclado aparece em todos os controles novos, inclusive em fundos escuros e áreas com rolagem.
