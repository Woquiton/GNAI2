# Convenção de acessibilidade do frontend

Vale para as telas e os componentes do Gnai em `resources/js/` (área autenticada, Portal do Professor, autenticação e site público). O catálogo demonstrativo do tema foi removido. Componentes preservados como referência devem seguir este padrão ao serem integrados a uma tela.

## Base normativa

- **LBI — Lei Brasileira de Inclusão (Lei 13.146/2015), art. 63**: sítios mantidos por empresas com sede ou representação comercial no País ou por órgãos de governo devem ser acessíveis segundo as melhores práticas e diretrizes internacionais.
- **eMAG 3.1 — Modelo de Acessibilidade em Governo Eletrônico**, padrão do gov.br: atalhos de teclado para conteúdo, menu, busca e rodapé; barra de acessibilidade no topo; alto contraste; foco visível; ordem lógica de navegação.
- **WCAG 2.2, nível AA** (referência do eMAG e da ABNT NBR 17225:2025): em especial 1.4.3 Contraste mínimo, 1.4.11 Contraste não textual, 2.1.1 Teclado, 2.4.1 Ignorar blocos, 2.4.3 Ordem do foco, 2.4.7 Foco visível, 2.4.11 Foco não encoberto, 2.5.3 Rótulo no nome e 2.3.3 Animação a partir de interações.

## Foco: clique discreto, teclado reforçado

`utils/accessibilityPreferences.ts` grava em `<html data-focus-mode>` se a última interação foi pelo teclado (`keyboard`) ou por mouse, toque ou caneta (`pointer`). `main.tsx` instala esse controle uma única vez.

- **Clique:** cada componente mantém seu foco discreto, como a borda roxa dos campos.
- **Teclado:** `styles/accessibility.css` aplica a todo elemento com `:focus-visible` um anel de 3 px que acompanha o arredondamento do controle, com fresta clara e halo translúcido.
- O anel usa `!important` de propósito, para vencer resets `outline: 0` de plugins legados. Não crie outro estilo de foco por tela.

Os tokens ficam em `resources/css/tokens.css` e podem ser redefinidos localmente por um componente:

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
- **Editor de texto:** `Forms/SummernoteEditor` não captura Tab nem Shift + Tab, que movem o foco como em qualquer campo (WCAG 2.1.2). O recuo fica em Ctrl + ] e Ctrl + [ (Command no Mac).

## Foco não encoberto

`styles/accessibility.css` aplica `scroll-padding` ao documento quando há topbar fixa (`AppLayout` e Portal do Professor) ou rodapé fixo de ações (`Forms/FormActions`). Assim, o foco pelo Tab e os alvos dos atalhos não ficam escondidos atrás dessas barras. Novas barras fixas devem entrar nessa regra.

## Movimento reduzido

Com `prefers-reduced-motion: reduce` ativo no sistema, animações, transições e rolagem suave ficam praticamente instantâneas para todo o frontend.

## Componentes compartilhados

- `FormField` fornece label e IDs de dica e erro; o consumidor passa o `id` ao controle e liga `aria-describedby`. Os campos de `Forms/FormFields` já fazem essa ligação.
- `Button` diferencia botão de link, sempre apresenta `title` e aceita `aria-label`. `title` e `UI/Tooltip` são complementares e não substituem o nome acessível.
- `Tooltip` abre por hover e foco, usa `role="tooltip"`/`aria-describedby`, sobrescreve a descrição anterior e depende de o filho encaminhar o atributo (`Button` encaminha). Confira a composição real.
- `DropdownMenu` usa botões para itens com `onSelect` sem `href` e links para navegação. Enter e Espaço executam ações; setas navegam e Esc fecha o menu e devolve o foco ao disparador.
- `Modal` e `ConfirmActionModal` têm `role="dialog"`, `aria-modal`, Escape, título ligado por `useId` e, via `useDialogFocus`, foco inicial, contenção do Tab e retorno ao disparador. Use `initialFocus` quando o fluxo exigir outro alvo.
- `NotificationToast` usa `role="alert"` e botão de fechar. `InlineAlert` não cria região de anúncio. A opção `confirm` do toast é demonstração com `window.alert`, não confirmação de negócio. Registre lacunas para o componente comum, sem criar sistema paralelo.

## Checklist por tela ou componente

- **Teclado:** todas as ações funcionam por teclado, na ordem visual, sem armadilhas de foco. Modais usam `useDialogFocus`.
- **Elementos:** ações usam `<button>` e navegação usa link. Ações só com ícone têm `aria-label`, e o texto visível está contido no nome acessível.
- **Formulários:** campos têm label ligada por `htmlFor`/`id`. Erros usam `aria-invalid` e `aria-describedby`, e a obrigatoriedade é indicada também por texto.
- **Percepção:** estados não dependem só de cor. O contraste mínimo é 4,5:1 para texto e 3:1 para ícones, bordas de controles e anel de foco.
- **Estrutura:** há um único `<main>` por tela (`BusinessPage`), títulos em ordem e imagens informativas com `alt`; as decorativas usam `alt=""`.
- **Foco:** o anel de teclado aparece em todos os controles novos, inclusive em fundos escuros e áreas com rolagem.

## Preferências de apresentação

A topbar oferece o ícone de acessibilidade, que abre as opções em `TopBarAccessibilityAction`,
pelo diálogo UI/AccessibilityPreferencesDialog. O site público usa o painel lateral Website/SiteAccessibility com preferências próprias. Alto contraste redefine os tokens em `tokens.css`:
fundo preto, texto branco, links e foco amarelos. `accessibility.css` cobre também
cores fixas de componentes legados, sem inverter as imagens.
Na topbar, na sidebar e nos links apresentados como botões, o alto contraste não acrescenta
sublinhado a textos, logos ou ícones. Links no corpo dos textos continuam sublinhados.
O destaque de foco por teclado permanece ativo.

O ajuste de tamanho vai de 90% a 150%, em passos de 10%. Usa zoom do documento
para ampliar também fontes em pixels e os controles que as contêm. Não limita o zoom
nativo do navegador. A impressão mantém escala 1.

`utils/accessibilityPreferences.ts` aplica as preferências antes da renderização e
salva em `localStorage` (`gnai.accessibility`). O hook compartilhado sincroniza os
controles e outras abas; armazenamento indisponível não impede o uso na página atual.
Não são preferências da conta nem eventos de auditoria de registros de negócio.

A página autenticada `/acessibilidade`, disponível na sidebar em Sistema, explica
contraste, tamanho, teclado, atalhos, leitura e movimento reduzido, e tem tutorial ao vivo.

## Autoria acessível no construtor do site

O construtor segue também o princípio das [ATAG 2.0](https://www.w3.org/WAI/standards-guidelines/atag/):
o editor precisa ser operável e ajudar o autor a produzir conteúdo acessível.

- WebsiteAccessibility, em Application/Rules/Website, complementa UpdateWebsiteData com regras de conteúdo nas seções habilitadas: títulos, pares de texto/destino de ações, identificação de materiais, respostas de FAQ, descrições de imagens e âncoras locais.
- Imagens mantidas são identificadas pelo ID e tipo da seção já salva, nunca por caminhos enviados pelo cliente. Sobre nós exige descrição; imagens de fundo no banner textual são decorativas e têm alternativa no próprio texto.
- Conteúdo formatado é sanitizado antes da verificação. Imagens precisam de descrição; links precisam de nome e destino; subtítulos começam em h3; tabelas precisam de legenda e cabeçalhos com escopo. As cores do corpo vêm da aparência da seção, sem cores inline que contornem a análise.
- WebsiteAppearanceAccessibility resolve cores herdadas do tema e compara texto/fundo com mínimo conservador de 4,5:1, inclusive para títulos. WebsiteContrast calcula luminância sRGB, contraste sem arredondar o resultado e o pior contraste no percurso contínuo de degradês sRGB. Hover é verificado separadamente. O banner textual recebe painel opaco para não depender da luminância desconhecida de fotografias.
- A revisão do builder apresenta pendências com acesso ao campo correspondente. BuilderRichTextFields oferece edição por teclado das descrições e títulos de tabelas, sem exigir HTML; a conversão da primeira linha em cabeçalho é uma decisão explícita do autor.
- SummernoteEditor aceita value controlado e styleTags opcionais. Atualizações vindas dos campos auxiliares sincronizam o editor; conteúdo idêntico não é reescrito para preservar o cursor. Os demais consumidores podem continuar com defaultValue.
- A prévia é inerte: a edição equivalente permanece disponível na lista e nos campos. Não coloque controles de edição exclusivos de clique duplo ou arraste.
- SiteLayout reutiliza SkipLinks e o painel Website/SiteAccessibility; o menu fecha com Escape e devolve o foco. Carrosséis param ao receber foco, só retomam por ação explícita e respeitam movimento reduzido. Slides inativos continuam inertes.
- Não anuncie conformidade integral apenas porque a validação passou. Qualidade editorial das alternativas, conteúdo externo, tecnologias assistivas e reflow precisam de homologação manual.

Referências: [LBI, art. 63](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm),
[eMAG 3.1](https://emag.governoeletronico.gov.br/),
[WCAG 2.2](https://www.w3.org/TR/WCAG22/) e
[padrão de carrossel da WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).

## Painel de acessibilidade do site público

O site usa um lançador flutuante com símbolo de acessibilidade e painel lateral de ferramentas
em cartões, na identidade roxa do Gnai. A apresentação do painel é exclusiva do site; a topbar
administrativa mantém seu diálogo compacto.

Website/SiteAccessibility reutiliza Modal e Button. Todos os ajustes de leitura do site ficam em useSiteAccessibilityPreferences
e no armazenamento gnai.site.accessibility: tamanho de texto, contraste, entrelinha, alinhamento, fonte simples, tons de
cinza, máscara de leitura, imagens ocultas, pausa de movimento, destaque de links e foco.
A prévia do builder não recebe esses ajustes pessoais.

O lançador e o painel ficam em portal fora de SiteLayout, para não serem afetados pelos filtros
de leitura. A máscara é transparente, não intercepta eventos e acompanha também o foco por
teclado; ela sai enquanto o painel está aberto. Ocultar imagens usa opacidade, preservando
as alternativas na árvore de acessibilidade.

BootstrapCarousel observa data-site-pause-motion e suspende sua rotação quando solicitado,
além de respeitar movimento reduzido e pausa por foco. A ferramenta Estrutura da página lista
títulos disponíveis de h1 a h6, indica o nível visualmente e no nome acessível e recua as
subseções. Só move o foco ao destino depois que o diálogo termina de fechar.
Todos os listeners, observers e quadros pendentes são removidos ao desmontar.

O destaque extra de links é optativo; não reintroduza sublinhados por padrão nos controles.

## Comportamento das ferramentas de leitura

O comportamento foi conferido em navegador no site de referência
[Espaço Empresarial SAJ](https://espacoempresarialsaj.com.br/), pelo acionamento das ferramentas
habilitadas e leitura de seus efeitos. O Gnai aplica as seguintes adaptações:

| Ferramenta | Comportamento do Gnai |
| --- | --- |
| Tamanho | 100%, 125%, 150%, 175% e 200%; mede os tamanhos naturais em lote, amplia cada texto uma vez e preserva a proporção das linhas. O painel fica fora do conteúdo ampliado. |
| Entrelinha | Multiplicadores 1,3×, 1,6× e 2× sobre a altura natural; não fixa uma altura menor que a do texto ampliado. |
| Alinhamento | Padrão, esquerda, centro ou direita; não força justificação. |
| Fonte simples | Arial/Helvetica; preserva fontes de ícones. |
| Contraste | Padrão, escuro, claro e alto contraste; paletas explícitas sem inverter fotografias e sem tornar opacas as camadas de sobreposição. |
| Tons de cinza | Filtra o conteúdo, preservando o painel e os atalhos. |
| Ocultar imagens | Usa opacidade para preservar as descrições na árvore de acessibilidade, em vez de visibility:hidden. |
| Pausar animações | Suspende CSS e a rotação JavaScript dos carrosséis; o movimento reduzido do sistema continua sendo respeitado. |
| Destacar links | Fundo amarelo, texto preto e contorno; no hover/foco, fundo laranja. Inclui links com imagens e permanece optativo. |
| Máscara | Faixa transparente com escurecimento externo, acompanhando ponteiro ou foco e sem bloquear interações. |
| Foco | Reforço de contorno opcional; foco básico de teclado é permanente. |
| Estrutura | Tela própria com H1 a H6, recuo, nomes acessíveis e retorno às ferramentas; o foco segue ao destino após fechar. |

useSiteTextPresentation remove seus estilos antes de medir novamente, evita multiplicar heranças,
acompanha conteúdo novo e mudanças de largura e restaura os estilos originais ao desativar ou sair.
A altura real do cabeçalho define a margem de rolagem para não encobrir o destino do foco.

Ao entrar no site público, SiteLayout aplica temporariamente tamanho e contraste neutros ao
documento; ao sair, restaura as preferências administrativas salvas. A migração inicial das
preferências antigas não altera o armazenamento do painel administrativo.

Referências complementares:
[uso de cor, WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html),
[ampliação, 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html),
[reflow, 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[espaçamento, 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html),
[foco, 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) e
[pausar movimento, 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
A conformidade do conteúdo final continua dependendo de homologação manual.
