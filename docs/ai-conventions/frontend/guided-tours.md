# Tutorial ao vivo das telas

O tutorial ao vivo (também chamado de tour guiado) explica a tela sobre ela mesma. O usuário clica no botão com o ícone de informação na barra do topo; a página escurece, a parte explicada fica em destaque com um anel pulsante e um cartão ao lado diz o que ela faz. A Central de Ajuda continua sendo o lugar das explicações completas; o tutorial mostra onde cada coisa está.

**Toda tela de negócio nova deve ter seu tutorial.** Telas existentes ganham o tutorial quando forem alteradas. A referência é o Painel (`components/Dashboard/Overview/overviewTour.ts`).

## Como funciona

| Peça | Onde fica | Papel |
| --- | --- | --- |
| `GuidedTourProvider` | `components/UI/GuidedTour/`, montado no `AppLayout` | Guarda o tutorial da tela atual e abre o cartão |
| `GuidedTour` e `GuidedTourTrail` | `components/UI/GuidedTour/` | Destaque, cartão, progresso e a lista "Ver todos os passos" |
| `TopBarTourAction` | `components/Navigation/TopBarPrimary/` | Botão da barra do topo; só aparece quando a tela tem tutorial |
| Prop `tour` do `BusinessPage` | `components/Navigation/BusinessPage/` | Registra o tutorial da página e acrescenta os passos comuns |
| Passos de componentes | Junto do componente, em `<componente>Tour.ts` | Explicação padrão do componente, igual em todas as telas |

O `BusinessPage` começa todo tutorial pela moldura: trilha de navegação (`pageBreadcrumbTour.ts`), nome da tela e ações do cabeçalho (`pageTitleTour.ts`). Depois vêm os passos da página. O último passo, "Pronto!", é acrescentado sozinho e oferece o artigo da Central de Ajuda quando a página informa `helpHref`.

## Escrever o tutorial de uma tela

1. Crie `<Recurso>Tour.ts` (ou `<recurso>Tour.ts`) na pasta do recurso, com os alvos e um `GuidedTourPageConfig` exportado como constante de módulo.
2. Marque cada bloco explicado com `data-tour`. `CardBox`, `RevenueSummaryCard` e `InlineMetricsCard` aceitam `tourTarget`; em marcação própria, use o atributo direto. Os nomes dos alvos ficam num objeto de constantes, nunca repetidos como texto solto.
3. Passe a constante ao `BusinessPage` pela prop `tour`. Não monte o tutorial dentro do componente: um objeto novo a cada renderização registra o tutorial de novo e fecha o cartão aberto.
4. Informe `helpHref` com o artigo da tela (`helpUrls.show('<slug>')`) quando ele existir.

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
| `onEnter` | Demonstração ao entrar no passo; devolve a função que desfaz ao sair |

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

Para as listagens, `TableListLayout` deve ganhar um `tableListTour.ts` quando a primeira listagem receber o tutorial: filtros, pesquisa e limpar filtros (borracha), seletor de colunas, redimensionamento, registros por página, paginação e ações da linha. Passos com demonstração, como abrir o seletor de colunas ou arrastar uma coluna, usam `onEnter` e sempre desfazem a demonstração na função devolvida, sem alterar as preferências salvas do usuário.

## Acessibilidade

O cartão não é modal: a página continua utilizável, a parte destacada pode ser clicada e o foco não fica preso.

- Ao abrir, o foco vai ao título do passo. Ao avançar, fica no botão usado; uma região viva anuncia o novo passo.
- **Próximo**, **Voltar**, **Concluir**, **Ver todos os passos** e o **X** são botões. As setas do teclado trocam de passo com o foco no cartão, e **Esc** fecha o tutorial de qualquer lugar.
- Ao fechar, o foco volta ao botão da barra do topo. Navegar para outra tela fecha o tutorial.
- Com movimento reduzido, a rolagem é instantânea e o anel deixa de pulsar.
- Telas com menos de 768 px mostram o cartão preso à base da tela.
