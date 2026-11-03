# Tutorial ao vivo das telas

O tutorial ao vivo (também chamado de tour guiado) explica a tela sobre ela mesma. O usuário clica no botão com o ícone de informação na barra do topo; a página escurece, a parte explicada fica em destaque com um anel pulsante e um cartão ao lado diz o que ela faz. A Central de Ajuda continua sendo o lugar das explicações completas; o tutorial mostra onde cada coisa está.

**Toda tela de negócio nova deve ter seu tutorial.** Telas existentes ganham o tutorial quando forem alteradas. As referências são o Painel (`components/Dashboard/Overview/overviewTour.ts`) e o módulo de Alunos (`components/Inclusion/Students/studentTours.ts`), com listagem, cadastro, edição e prontuário.

## Como funciona

| Peça | Onde fica | Papel |
| --- | --- | --- |
| `GuidedTourProvider` | `components/UI/GuidedTour/`, montado no `AppLayout` | Guarda o tutorial da tela atual e abre o cartão |
| `GuidedTour` e `GuidedTourTrail` | `components/UI/GuidedTour/` | Destaque, cartão, progresso e a lista "Ver todos os passos" |
| `TopBarTourAction` | `components/Navigation/TopBarPrimary/` | Botão da barra do topo; só aparece quando a tela tem tutorial |
| Prop `tour` do `BusinessPage` | `components/Navigation/BusinessPage/` | Registra o tutorial da página e acrescenta os passos comuns |
| Prop `tour` do `TableListLayout` | `components/Tables/TableList/` | Acrescenta os passos padrão das listagens (`tableListTour.ts`) |
| `openDisclosureDemo` e `pressKey` | `components/UI/GuidedTour/guidedTourDemos.ts` | Ajudam a montar demonstrações que se desfazem sozinhas |
| Passos de componentes | Junto do componente, em `<componente>Tour.ts` | Explicação padrão do componente, igual em todas as telas |

O `BusinessPage` começa todo tutorial pela moldura: trilha de navegação (`pageBreadcrumbTour.ts`), nome da tela e ações do cabeçalho (`pageTitleTour.ts`). Depois vêm os passos da página. O último passo, "Pronto!", é acrescentado sozinho e oferece o artigo da Central de Ajuda quando a página informa `helpHref`.

## Escrever o tutorial de uma tela

1. Crie `<recurso>Tour.ts` (uma tela) ou `<recurso>Tours.ts` (várias telas do recurso) na pasta do recurso, com os alvos e um `GuidedTourPageConfig` por tela, exportado como constante de módulo.
2. Marque cada bloco explicado com `data-tour`. `CardBox`, `RevenueSummaryCard`, `InlineMetricsCard`, `FormSection`, `FormActions`, `PersonPhotoUpload`, `Tabs` e `PageTabs` aceitam `tourTarget`, e cada item de `Tabs` aceita `tourTarget` no botão da aba, que continua visível no celular; `EventCalendar` aceita `tourTargets` para a navegação, os botões de visão e a grade; em marcação própria, use o atributo direto. Os nomes dos alvos ficam num objeto de constantes, nunca repetidos como texto solto.
3. Passe a constante ao `BusinessPage` pela prop `tour`. Não monte o tutorial dentro do componente: um objeto novo a cada renderização registra o tutorial de novo e fecha o cartão aberto. Em layouts persistentes, como `SettingsLayout`, que renderiza o `BusinessPage` e não recebe props das páginas, o layout escolhe o tutorial pela aba aberta (`Settings/settingsTours.ts`).
4. Quando os botões do cabeçalho não são só "Cadastrar", troque o texto do passo comum "Ações da tela" com `actions`.
5. Informe `helpHref` com o artigo da tela (`helpUrls.show('<slug>', '<âncora da seção>')`) quando ele existir.

```ts
export const overviewTour: GuidedTourPageConfig = {
    helpHref: helpUrls.show('painel'),
    steps: [
        {
            id: 'feed',
            target: OVERVIEW_TOUR_TARGETS.feed,
            group: 'Atividades recentes',
            title: 'Atividades recentes',
            content: ['Aqui aparecem as últimas mudanças...', 'Clique na frase para abrir o documento.'],
        },
    ],
};
```

Campos de cada passo (`GuidedTourStep`):

| Campo | Uso |
| --- | --- |
| `id` | Identificador estável dentro do tutorial |
| `target` | Valor de `data-tour`. Uma lista destaca a área que envolve todos os alvos, como um grupo de gráficos. Sem alvo, o cartão fica no centro |
| `title` | Nome curto da parte destacada, igual ao rótulo da tela quando houver |
| `content` | Explicação; cada item da lista vira um parágrafo |
| `group` | Agrupa passos em "Ver todos os passos" |
| `availableWith` | Alvo que garante o passo no tutorial quando o próprio alvo só aparece depois do `onEnter`, como uma seção de outra aba |
| `onEnter` | Demonstração ao entrar no passo. Devolve a função que desfaz ao sair ou um `GuidedTourDemo` com `undo` e `note`, a frase em destaque sobre o que aconteceu na tela |

## Ordem e conteúdo

- Siga a ordem visual da tela, de cima para baixo. O tutorial sempre abre no primeiro passo, a trilha de navegação, e o usuário pode pular para qualquer passo pela lista.
- Em grupos de blocos parecidos (gráficos, indicadores), faça um passo que destaca o grupo inteiro e depois um passo por bloco.
- Passos cujo alvo não está na tela, como um botão que depende de permissão ou de dados, saem do tutorial sozinhos. Não crie condicionais de permissão no tutorial.
- Explique o que a parte mostra e o que o usuário pode fazer com ela. Não descreva regras que a tela não tem; confira o artigo da Central de Ajuda e o código.

## Linguagem simples

O tutorial é lido por qualquer pessoa da equipe, sem conhecimento técnico.

- Frases curtas, uma ideia por frase, até dois parágrafos por passo.
- Fale com o usuário: "Clique aqui para...", "Você pode...".
- Use as palavras da tela, em vez de termos técnicos. Diga "trilha de navegação", não "breadcrumb"; "lista", não "grid"; "filtro", não "query".
- Siglas do domínio, como PEI e PAEE, podem aparecer quando estão na própria tela.
- Não use tom de alerta, imperativos duros ou palavras fortes. Sem travessões.

## Componentes compartilhados com passos padrão

Um componente usado em várias telas guarda sua explicação junto dele, em `<componente>Tour.ts`, e exporta o alvo e o passo. A tela inclui o passo pronto em vez de reescrever o texto. Hoje existem `pageBreadcrumbTour.ts` e `pageTitleTour.ts`.

### Listagens

`TableListLayout` recebe `tour` do tipo `TableListTourConfig` e monta, depois da moldura, os passos de `tableListTour.ts`:

| Grupo | Passos |
| --- | --- |
| Filtros | Filtros e pesquisa; Mais filtros, que abre a área para mostrar; Limpar filtros, a borracha |
| Tabela | Colunas; Escolher colunas, que abre o menu e explica que a escolha fica salva; Tabela; Largura das colunas, numa linha de redimensionar sorteada a cada visita; Veja como funciona, que arrasta a linha para um lado sorteado e conta o que mudou; Ações de cada linha |
| Páginas | Registros por página, que fica salvo para a tela; Páginas |

A tela troca só os textos que falam dos próprios registros (`filters`, `moreFilters` e `table`), informa `helpHref` e `actions` e pode acrescentar passos em `steps`. Telas que montam a listagem sem `TableListLayout`, como a agenda de agendamentos, usam `tableListTourSteps` direto e podem intercalar passos próprios entre os grupos de `TABLE_LIST_TOUR_GROUPS`; passos de uma visão que não está aberta saem sozinhos. Os demais textos são padrão e não devem ser reescritos por tela.

### Demonstrações

- Demonstrações usam `onEnter` e desfazem tudo ao sair do passo. As preferências salvas do usuário precisam ficar como estavam: abrir e fechar de novo um controle que lembra o estado é aceitável; trocar a quantidade por página, que recarrega a lista e grava a preferência no servidor, não é.
- `openDisclosureDemo` abre um controle com `aria-expanded` e o fecha ao sair, só se o tutorial o abriu. `pressKey` simula o teclado, como no arraste da coluna. Toques seguidos precisam de intervalo, para o componente medir a tela já atualizada.
- Controles que fecham ao clicar fora devem ignorar cliques dentro de `[data-guided-tour]`, como faz o menu de colunas.
- Quando a demonstração depende de plugins (Select2, editores) ou de estado assíncrono, não simule cliques: o componente expõe as próprias ações ao tutorial por uma ponte, como `Reports/Form/reportTourBridge.ts`. O gerador de relatórios monta um exemplo só com o formulário vazio, mantém o exemplo entre passos seguidos e o desfaz ao sair do último passo ou fechar o tutorial (`Reports/reportTours.ts`).
- Formulários com abas: o tutorial descarta, ao abrir, passos cujo alvo está numa aba fechada. Destaque o card das abas ou use `availableWith` com o card e um `onEnter` que abre a aba, lendo a aba atual depois de um `setTimeout`, para a volta do passo anterior já ter acontecido.
- Janelas (`UI/Modal`) podem ser abertas pela demonstração: o cartão do tutorial fica acima delas e o controle de foco do diálogo não puxa o foco do cartão nem prende o Tab enquanto o usuário estiver nele. Abra a janela pelo mesmo botão do usuário e use `createDemoSession` (`guidedTourDemos.ts`) para mantê-la aberta entre os passos que a explicam e fechá-la ao sair do último. Não feche janelas que o usuário abriu. Exemplo: detalhes da Auditoria (`Audit/auditTours.ts`).
- Não demonstre controles que viram diálogo modal em telas menores, como a lateral de status do prontuário abaixo de 1280 px.

## Acessibilidade

O cartão não é modal: a página continua utilizável, a parte destacada pode ser clicada e o foco não fica preso.

- Ao abrir, o foco vai ao título do passo. Ao avançar, fica no botão usado; uma região viva anuncia o novo passo.
- **Próximo**, **Voltar**, **Concluir**, **Ver todos os passos** e o **X** são botões. As setas do teclado trocam de passo com o foco no cartão, e **Esc** fecha o tutorial de qualquer lugar.
- Ao fechar, o foco volta ao botão da barra do topo. Navegar para outra tela fecha o tutorial.
- Com movimento reduzido, a rolagem é instantânea e o anel deixa de pulsar.
- Telas com menos de 768 px mostram o cartão preso à base da tela.
