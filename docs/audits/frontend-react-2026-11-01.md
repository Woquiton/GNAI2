# Auditoria do frontend React do Gnai

Data: 01/11/2026. Base inspecionada: commit `60e8263b`.

## Situação após a refatoração do working tree

Esta atualização corresponde ao código atual do Gnai; o inventário numérico e os achados originais abaixo registram a base anterior. O catálogo demonstrativo fica fora da prioridade de refatoração. Sobre nós conserva sua implementação Blade e seu CSS próprios, por solicitação do usuário; não é uma pendência de migração. O guia de uso também tem uma rota Blade existente e não foi alterado nesta revisão.

**A estrutura foi migrada, mas a adoção integral do padrão ainda está pendente.** A pesquisa encontrou 159 entradas TSX de produto (excluindo a entrada do catálogo), nenhum uso restante de `PageScaffold` nem as molduras vazias identificadas anteriormente. Os 159 destinos literais distintos de `Inertia::render` pesquisados em rotas e domínios têm arquivo correspondente; esse conjunto inclui o catálogo e não inclui nomes construídos dinamicamente. Existência de arquivo não comprova paridade funcional nem homologação visual.

| Área | Situação confirmada no código | Próximo ajuste |
| --- | --- | --- |
| Abas de Agendamentos | `PageTabs` já consumia o indicador de `Tabs.css`, mas links GET remontavam a página. `SessionWorkspace` passou a solicitar `preserveState`, mantendo o indicador montado. A preferência por movimento reduzido é respeitada. | Conferir manualmente a transição calendário/listagem nas duas centrais, geral e pessoal. |
| Filtros de AEE, Estudos de Caso e Atendimentos Pedagógicos | `AeeRecordFilters`, `CaseStudyList` e `PedagogicalRecordList` ainda compõem formulário/grade/limpeza próprios, em vez de `TableListFilters`. | Adotar o componente compartilhado preservando campos, parâmetros, opções e filtros complementares de cada recurso. |
| Tabelas de atendimentos e prontuários | Há consumidores de `TableListTable` que ainda montam `tr`/`td`, como `SessionList`, `AeeRecordList`, `PedagogicalRecordList` e `CaseStudyList`. Não significa ausência de tabela compartilhada, mas adoção parcial de sua API por dados. | Migrar colunas e células para `rows`, `rowKey` e `render`, sem perder permissões e estados vazios. |
| Envio na autenticação | `LoginForm`, `ForgotPasswordForm`, `TeacherAccessRequestForm` e `TeacherAccessConfirmForm` usam `useForm` diretamente, sem `useFormSubmission` ou callbacks locais de falha HTTP/conexão. | Uniformizar envio e feedback preservando os layouts de autenticação e o consumo explícito do link mágico. |
| Separação entre página e formulário | `AeeRecordForm`, `CaseStudyForm`, `PedagogicalRecordForm`, `SessionForm` e `PeiDisciplineForm` ainda montam `BusinessPage` dentro do formulário. | Levar título e navegação às entradas Inertia; manter campos, estado e envio no formulário. |
| Exclusão de atendimento pedagógico | `pages/Inclusion/PedagogicalRecords/Show.tsx` mantém estado, trava e `router.delete` próprios, apesar de já existir `useConfirmedAction`. | Usar a ação compartilhada, preservando `student_id` e o retorno ao prontuário. |

Essa lista registra pendências verificadas, não uma certificação de todos os fluxos. A revisão foi de código; não foram executados navegador, build, typecheck ou testes. As correções anteriores de scaffolds não autorizam declarar a padronização inteira concluída.

## Escopo e limites

Inventário estático de `resources/react`, leitura da entrada Inertia, layouts, componentes centrais, formulários, listagens, detalhes, loaders de plugins, assets locais e convenções. Itens foi examinado como módulo de referência; outros módulos foram comparados para identificar recorrências. O histórico Blade foi consultado nos casos de perda de Rich Text.

Foram pesquisadas documentações oficiais de React, Inertia, Vite, WAI-ARIA, jQuery e Bootstrap. Nenhuma aplicação, navegador, build, typecheck ou suíte de testes foi executada. Não houve refatoração de código nesta auditoria. Inventário abrangente não significa revisão manual de todas as linhas de todos os arquivos; os achados abaixo têm evidências concretas, e os riscos de runtime estão identificados como tais.

As propostas deste documento ainda não substituem as convenções oficiais em `docs/ai-conventions/`.

## Diagnóstico

A aplicação já tem uma biblioteca compartilhada útil. A dificuldade de manutenção vem da adoção desigual dessa biblioteca, da mistura entre catálogo e negócio, de limites de responsabilidade pouco evidentes e de contratos diferentes para componentes com funções semelhantes.

Separar arquivos somente pela extensão não resolve esse problema. `.tsx` deve conter JSX; `.ts` deve conter lógica e tipos sem JSX. Ambos podem pertencer à mesma funcionalidade. A organização precisa mostrar quem é dono de cada componente, estilo, tipo e integração.

Manter jQuery é compatível com React quando cada plugin fica encapsulado em um adaptador, com uma região própria de DOM, sincronização de estado e limpeza no desmontar. Essa abordagem é prevista na [documentação do React sobre Effects](https://react.dev/learn/synchronizing-with-effects). O risco aparece quando dois sistemas disputam o mesmo DOM ou quando o adaptador não tem contrato consistente.

## Inventário

| Medida estática | Resultado | Interpretação |
| --- | ---: | --- |
| Arquivos `.tsx` em `resources/react` | 602 | Incluem páginas, componentes e demonstrações; não são 602 telas de negócio |
| Arquivos `.ts` | 297 | Incluem tipos, hooks, utilitários e dados demonstrativos |
| Arquivos `.css` | 308 | Incluem estilos locais, globais e CSS de plugins |
| `.tsx` sob `pages/Inclusion` | 219 | Mistura entradas Inertia com componentes auxiliares |
| Pastas de recursos em `pages/Inclusion` | 29 | Com organizações e níveis de extração diferentes |
| Destinos literais distintos de `Inertia::render` encontrados em `app`, excluindo testes | 158 | Todos têm arquivo TSX correspondente; chamadas dinâmicas não entram nessa contagem |
| Destinos ainda usando `PageScaffold` | 4 arquivos encontrados | Três em áreas de negócio/autenticação e um Sobre; presença de arquivo não garante tela implementada |

Entre os arquivos nas pastas de negócio/autenticação examinadas, 68 usam `BusinessPage` diretamente, 38 usam `TableListTable` e 34 chamam `useTableListVisit`. Esses números não representam cobertura de telas: wrappers também compõem essas peças indiretamente.

## O que já está bem encaminhado

- `main.tsx` atribui o layout autenticado por padrão; o site público e a autenticação têm tratamentos próprios.
- `BusinessPage` centraliza `Head`, breadcrumb, `PageTitle` e erro geral. A ideia de cabeçalho reutilizável solicitada pelo usuário já está implementada.
- `TableList` centraliza moldura, carregamento, cabeçalho, seletor de colunas, redimensionamento, limpar filtros, mais filtros, paginação e estados vazios.
- `useAutoListFilters`, `useTableListVisit` e `useTableListAction` evitam repetir debounce, visitas e tratamento de operações nas listagens.
- `FormLayout`, `FormGrid`, `FormSection`, `FormField`, `FormActions` e os controles compartilhados já estabelecem a estrutura de formulários.
- `FlashNotifications` é montado nos layouts, sem exigir um consumidor por tela.
- `SummernoteEditor` já encapsula assets locais, callbacks, estado de bloqueio, erros, overlays e limpeza. `SelectField` tem fallback nativo quando o aprimoramento não carrega.
- `RichTextContent` e `ExpandableContent` já cobrem HTML sanitizado e expansão de textos extensos.
- `ConfirmActionModal` já tem foco inicial, contenção por Tab e retorno ao disparador. A documentação local não reflete inteiramente esse avanço.
- A busca estática de imports não identificou componentes compartilhados importando páginas, nem hooks de `hooks/` importando componentes de UI.
- Não foi encontrado import do Bootstrap CSS global na entrada React. CSS de plugins como Summernote tem isolamento explícito por seletores do adaptador.

## Achados priorizados

Prioridade alta indica impacto funcional, estado de campos ou dependências. Prioridade média indica divergência estrutural e manutenção. Não é uma classificação CVSS.

### A01 — Alta: fluxos publicados ainda são scaffolds

**Atualização após implementação e revisão de escopo:** os três fluxos ativos abaixo foram implementados em React: redefinição de senha, permissões globais e disciplinas de professores. A página pública Sobre já estava pronta em Blade e deve conservar sua identidade visual e seu CSS; a substituição por React foi desfeita a pedido do usuário, e a entrada React sem uso foi removida. `PageScaffold` foi removido. As evidências a seguir registram o estado da auditoria, não o estado atual desses arquivos. A homologação em runtime continua manual.

Evidências:

- `resources/react/pages/Auth/ResetPassword.tsx`: renderiza apenas `PageScaffold`, sem formulário de nova senha. `ResetPasswordController` envia token/e-mail para essa página.
- `pages/Inclusion/Teachers/GlobalPermissions.tsx` e `Disciplines.tsx`: também renderizam apenas título; há rotas e operações correspondentes.
- `pages/AboutUs/AboutUs.tsx`: outro scaffold; a página Sobre efetivamente publicada ainda é Blade, portanto esse arquivo sozinho não comprova um fluxo ativo incompleto.

Impacto: uma reorganização de pastas pode deixar a árvore bonita e continuar com fluxos incompletos. Redefinição de senha merece prioridade sobre mudanças cosméticas.

Recomendação: manter um inventário explícito das entradas implementadas, parciais e demonstrativas. Concluir os três fluxos efetivamente ligados a controllers antes de declarar paridade funcional.

### A02 — Alta: assets ativos antigos e fora do inventário npm

Os cabeçalhos dos arquivos locais declaram jQuery **2.1.4**, Bootstrap **3.3.5**, Select2 **3.5.2** e Summernote **0.6.16**. `useSummernote.ts:30` carrega diretamente os arquivos locais de jQuery, Bootstrap e Summernote; SelectField também usa o Select2 local.

Há correções de segurança oficiais posteriores às versões declaradas de jQuery e Bootstrap: [jQuery 3.5.0](https://blog.jquery.com/2020/04/10/jquery-3-5-0-released/) e [Bootstrap 3.4.1](https://blog.getbootstrap.com/2019/02/13/bootstrap-4-3-1-and-3-4-1/). Isso identifica uma pendência real de gestão de dependências; não comprova por si só um caminho de exploração no Gnai, nem exclui patches locais não inventariados.

Recomendação: catalogar versões, origem, licença, patches locais e consumidores. Atualizar por família de plugins, com validação de compatibilidade. Manter jQuery não exige manter essas versões. Não substituir todos os assets por versões novas de uma vez, porque os plugins antigos podem depender das APIs existentes.

### A03 — Alta: contratos dos adaptadores de plugins são desiguais

`DatePicker` recebe `value`, sincroniza alterações externas e oferece bloqueio/erro. `SummernoteEditor` tem `disabled`, `invalid`, `describedBy` e `onLoadError`, com `defaultValue` inicial documentado.

Já `ClockPicker.tsx:26` expõe `defaultValue`, mas não `value`, `disabled` ou callback de falha; em `:133`, falha de inicialização vai apenas para `console.error`. `TimePicker` tem limitações semelhantes. `ToggleControl.tsx:113` inicia uma Promise sem tratamento de rejeição local. Os controles nativos podem permanecer utilizáveis em alguns desses casos, mas a política de fallback não é uniforme.

Recomendação: definir o contrato mínimo por tipo de adaptador: estado controlado ou inicial explicitamente documentado, bloqueio, associação de erro, política de fallback, callback de falha, atualização de props e destruição. Não adicionar `value` a um editor imperativo sem definir como preservar seleção e conteúdo durante a sincronização.

### A04 — Alta: identidade por índice em coleções removíveis

`Forms/RepeaterField/RepeaterField.tsx:50` usa `key={index}`. Remover um item intermediário muda a associação entre a instância React e os itens seguintes. Isso é especialmente arriscado ao envolver controles com estado interno ou plugins que leem `defaultValue` somente na montagem.

Publicações já tem chaves estáveis para participantes; Backups passou a manter identidade estável para horários. São soluções locais para um problema que deveria ter suporte compartilhado.

Recomendação: o repetidor receber `getItemKey`, ou trabalhar com uma chave de UI estável que não altere o payload do backend. Índices podem continuar nos nomes enviados e nos caminhos dos erros. A orientação sobre identidade está na [documentação de listas do React](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key).

### A05 — Alta: outras perdas de Rich Text confirmadas no legado

`Peis/Disciplines/PeiDisciplineForm.tsx:270` e `TeacherPortal/DisciplineEdit.tsx:185` usam `TextArea` para conteúdos da adaptação. O Blade de edição de disciplinas do PEI no commit `4d187fbb` usava `x-forms.textarea`, com Rich Text ativado por padrão. O mesmo padrão foi confirmado em campos do formulário pedagógico legado, hoje renderizados em `PedagogicalRecordForm.tsx:229` como texto simples.

Recomendação: uma frente própria de paridade desses campos, incluindo sanitização, armazenamento, leitura, PDF e limites. Não transformar automaticamente objetivos, recursos e todo `TextArea` em editor: a distinção depende do requisito legado.

### A06 — Média: catálogo e negócio dividem a mesma árvore

`pages/` contém tanto `Inclusion`, `Settings`, `Reports` e outros módulos reais quanto `Buttons`, `FormElements`, `ChartsPage`, `DashboardOne`, CRM e e-commerce demonstrativos. Há dados de catálogo com milhares de linhas. `main.tsx:12` usa `import.meta.glob('./pages/**/*.tsx')`, incluindo auxiliares e demonstrações como candidatos de resolução.

Isso não torna cada arquivo uma rota HTTP nem prova download de todo o catálogo na carga inicial: controllers e imports dinâmicos continuam determinando o acesso e o carregamento. O problema confirmado é a falta de fronteira de organização; o efeito em tamanho de bundles precisa ser medido em uma etapa autorizada.

Recomendação: mover as demonstrações para `catalog/` e restringir o resolver de páginas de negócio às entradas corretas. Manter assets de terceiros em `public/assets/react/`, preservando licenças. Componentes do tema usados pelo produto continuam nos componentes compartilhados; não mover todos para uma pasta de demo.

### A07 — Média: adoção desigual do cabeçalho de negócio

`Items/Index.tsx` usa `BusinessPage`; Create/Edit usam `ItemPage`, que delega ao mesmo componente. Entretanto, `Items/Show.tsx:125` monta `main`, `Head`, breadcrumb e `PageTitle` diretamente. Foi a única ocorrência direta de `<PageTitle>` encontrada nas pastas de negócio examinadas.

`Items/Show.css` repete `min-width`, `padding-bottom`, cor de página e regra de foco que têm equivalentes na estrutura compartilhada. As grids e tags do item, por outro lado, são estilos locais legítimos.

Recomendação: a visualização consumir `BusinessPage` ou o wrapper do módulo. Não criar outro PageHeader para substituir peças já existentes. `PageHeader` do tema e `PageTitle` de negócio precisam de papéis explicitamente distintos no catálogo.

### A08 — Média: páginas, partes, contratos e constantes misturados

A pasta Items tem oito TSX no nível principal, dois TS e dois CSS, além da visualização de vistoria em subpasta. `ItemPage` não é uma segunda tela: é um wrapper. `ItemList` é a tabela daquele recurso; `ItemFilters` descreve seus filtros; `ItemForm` atende criação e edição.

`Items.types.ts:54` também exporta URL, rótulos e filtros iniciais. `ItemForm.types.ts` separa corretamente contratos de formulário, mas `Show.tsx:20` declara outro contrato de item localmente. Há cinco arquivos `*.types.ts` com exports de valores encontrados no inventário.

Recomendação: páginas de entrada pequenas; componentes de recurso em pastas por função; tipos com dono e nomes explícitos; valores em `*.constants.ts` ou `*.options.ts`; URLs em helper próprio quando houver responsabilidade real. Não criar um `types/` global com todos os domínios e não acrescentar subpastas vazias.

### A09 — Média: módulos consomem utilitários e CSS com dono errado

48 TSX fora de pastas chamadas Students, dentro do recorte de negócio, importam `Students.utils`. O arquivo mistura URLs de aluno com máscaras e formatação geral. Três telas fora de Students importam `Students.css`: PEI, disciplinas do PEI e estudo de caso. `PeiConfirmAction` usa `useStudentRequest`, que apenas fornece mensagens genéricas de falha.

Há ainda imports entre páginas de AEE/PEI para reaproveitar CSS de outra tela. Isso cria dependência implícita: mudar um prontuário pode alterar outro módulo.

Recomendação: formatação geral em `utils/`; navegação do aluno no módulo de aluno; helpers genéricos de operação em um hook compartilhado; resumo de pessoa/prontuário em componente com CSS próprio. Uma tela não deve importar CSS de outra para obter um padrão comum.

### A10 — Média: composição das listagens é repetida, mas parte da variação é correta

`TableList.tsx` e `TableListTable.tsx` já centralizam o comportamento e a apresentação. `ItemList` não recria a biblioteca de tabela: informa colunas e renderiza células do domínio. `ItemFilters.css` organiza os campos específicos.

O que ainda se repete entre os Index é a composição de cabeçalho, botão cadastrar, card, filtros, tabela, paginação e modal. O fluxo de listagem existe, mas falta uma composição superior que torne esse conjunto evidente e uniforme.

Recomendação: depois do piloto, considerar um `ListPage` com slots de ações, filtros, conteúdo e rodapé, apoiado nos componentes atuais. Colunas, permissões e renderização de célula continuam no módulo. Não criar uma tabela universal cheia de condições de negócio ou inferida dos atributos do model.

Ponto adicional: `TableListTable.tsx:63` oculta células por posição e espera linhas `<tr>` com filhos correspondentes à configuração das colunas. Esse contrato é frágil para linhas encapsuladas em componentes ou células condicionais. Documentar a restrição atual; uma futura API de renderização de células deve usar o ID da coluna, preservando redimensionamento e seleção.

### A11 — Média: política de CSS e tipografia incompletamente consolidada

Ter `Show.css` separado não é um erro. O erro é ele passar a definir o que deveria pertencer ao sistema inteiro. Foram encontradas repetições de grids de detalhes em itens, PEI, estudo de caso e outros módulos.

Os tokens mantêm fontes do tema e fontes Gnai com papéis diferentes. `--ui-color-primary` permanece azul, enquanto `--ui-color-gnai-primary` referencia o roxo institucional. `Button.css` ainda tem variantes com cores fixas e `!important`. Isso explica parte das correções recorrentes de tom e foco.

Recomendação: uma política central para papéis tipográficos, foco, ações, bordas, espaçamentos e grids recorrentes. CSS local deve cuidar da composição específica. Manter prefixos por componente no CSS atual. CSS Modules é uma opção suportada pelo [Vite](https://vite.dev/guide/features.html#css-modules) para estilos privados, mas sua adoção seria uma decisão posterior; não é requisito para corrigir a organização.

### A12 — Média: carregamento de CSS de plugin não tem a mesma recuperação dos scripts

`loadExternalScript.ts` marca tags que falharam e permite recriá-las. `loadExternalStylesheet.ts:5` reutiliza a tag existente, mas não registra falha. Se a primeira tentativa de stylesheet falhar e a tag permanecer, uma nova chamada pode esperar eventos que já ocorreram, sem resolver nem rejeitar.

Recomendação: uniformizar deduplicação, estado de carregamento e tentativa após falha. Preservar a limpeza de instâncias nos adaptadores; tags compartilhadas não devem ser removidas indiscriminadamente ao desmontar um controle.

### A13 — Média: acessibilidade corrigida em alguns wrappers, pendente em outros

- `ConfirmActionModal` tem gestão de foco; o `Modal` básico não fornece a mesma proteção para todos os consumidores.
- `Modal` já usa `useId`; a afirmação de ID fixo na documentação está desatualizada.
- `Tooltip.tsx:55` substitui `aria-describedby` do filho, em vez de compor com a descrição existente. `Button` atualmente encaminha esse atributo, ao contrário do que ainda consta no AGENTS.
- `Button.css` remove outline globalmente; alguns wrappers e variantes o recolocam. A garantia de foco deve pertencer ao componente compartilhado, sem depender da página.
- `ChoiceControl` associa input/label, mas não oferece o mesmo conjunto de props de erro e descrição de outros controles; grupos já podem carregar parte dessas informações.

Recomendação: consolidar contratos no componente base e conferir foco dos diálogos conforme o [padrão WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). A revisão estática não substitui uma verificação de teclado e leitor de tela.

### A14 — Média: formatação e fronteiras não têm verificação automatizada declarada

`package.json` tem comandos de desenvolvimento, typecheck e build; não declara lint ou formatter. `tsconfig.json` tem `strict: true`, o que é positivo, mas não define a política de arquitetura. Não foi encontrada configuração em `.github` no inventário desta auditoria.

Recomendação: numa etapa autorizada, padronizar formatação, regras de hooks e restrições de importação. Essas ferramentas devem verificar o padrão escolhido, não servir de justificativa para reescrever o frontend. Não adicionar uma biblioteca de estado, formulários ou CSS só para reorganizar arquivos.

### A15 — Média: documentação já diverge do código atual

O AGENTS ainda diz que não há layout de negócio completo, que a autenticação não tem logo, que Modal usa ID fixo e que Button não encaminha `aria-describedby`. O código atual contradiz essas afirmações em `AppLayout`, `AuthLayout`, `Modal` e `Button`.

Recomendação: atualizar a documentação junto das futuras correções, distinguindo implementação existente, limitação confirmada e proposta. Não usar as notas antigas como prova de um defeito já resolvido.

## Como organizar o módulo de itens

A proposta abaixo usa a estrutura de componentes de negócio que o repositório já possui. É uma recomendação para um piloto, não uma mudança executada:

```text
resources/react/
  pages/
    Inclusion/Items/
      Index.tsx
      Create.tsx
      Edit.tsx
      Show.tsx
      Inspections/Show.tsx

  components/
    Inclusion/Items/
      ItemPage.tsx
      Items.types.ts
      Items.constants.ts
      Items.urls.ts
      Form/
        ItemForm.tsx
        ItemForm.types.ts
        useItemForm.ts             # somente se houver lógica suficiente
        ItemIdentificationFields.tsx
        ItemInspectionFields.tsx
        ItemForm.css              # somente se houver estilos próprios
      List/
        ItemFilters.tsx
        ItemFilters.css
        ItemList.tsx
        ItemList.columns.ts
      Details/
        ItemDetails.tsx
        ItemDetails.css

    Navigation/BusinessPage/
    Forms/
    Tables/TableList/
    UI/

  catalog/
    pages/
    data/
    app/
```

`components/Inclusion/Items` é uma localização sugerida por aproveitar o agrupamento Inclusion já existente. Um diretório `features/inclusion/items` também seria possível, mas introduzir duas organizações concorrentes ao mesmo tempo agravaria o problema. Escolher uma e registrar a convenção antes da migração em escala.

Separações úteis dependem de responsabilidade, não de quantidade de linhas. `ItemForm` tem 707 linhas, mas não deve ser dividido em dezenas de componentes que só embrulham um input. Identificação e vistoria têm responsabilidades próprias; essa é uma fronteira melhor. Tipos usados só pelo formulário podem continuar ao lado dele; tipos de resumo, detalhe e payload precisam ter nomes que expressem suas diferenças reais.

`Index.tsx`, `Create.tsx`, `Edit.tsx` e `Show.tsx` continuam como entradas resolvidas pelo Inertia. O componente de página recebe props e compõe o módulo; isso está de acordo com a [documentação de páginas do Inertia](https://inertiajs.com/docs/v3/the-basics/pages). O AppLayout continua responsável pela navegação geral, conforme o [modelo de layouts compartilhados](https://inertiajs.com/docs/v3/the-basics/layouts).

## Responsabilidades de apresentação

| Camada | Deve controlar | Não deve decidir |
| --- | --- | --- |
| Tokens/estilos globais | Paleta, fontes, papéis de texto, foco e variáveis | Layout particular de itens ou PEI |
| AppLayout/AuthLayout/SiteLayout | Estrutura geral, navegação e consumidores globais | Campos e colunas de cada recurso |
| BusinessPage | Título, subtítulo, breadcrumb, metadados e moldura | Tipos de negócio ou regras do cadastro |
| Composição de listagem | Ordem e espaçamento dos blocos, carregamento e slots | Campos internos do model |
| TableList | Cabeçalho, seleção/redimensionamento, tabela e rodapé padronizado | Quais dados o usuário pode acessar |
| Módulo do recurso | Colunas, filtros, células, labels, props e permissões recebidas | Reimplementar CSS e interações da tabela |
| Controle/adaptador | Input, plugin, teclado, estado e limpeza | Salvar o formulário automaticamente |
| CSS local | Grid e exceções específicas do proprietário | Recriar botão, label, breadcrumb ou paleta |

A faixa do cabeçalho, o menu de colunas, a tipografia da tabela, o botão limpar, o acordeão de mais filtros e a paginação devem mudar em um lugar compartilhado. Colunas como patrimônio, disponibilidade e natureza do item continuam sendo configuração de itens. A configuração local é necessária; a repetição do mecanismo é que deve ser eliminada.

## Contrato desejado para React com jQuery

1. React recebe os dados e decide o valor do formulário.
2. O adaptador fornece ao plugin um nó obtido por ref; o plugin controla somente essa região e seus overlays identificados.
3. Eventos do plugin são convertidos em `onChange`, sem requests de negócio dentro do adaptador.
4. Alterações de valor, disabled e erro têm comportamento definido e uniforme.
5. A montagem trata carregamento assíncrono cancelado, dependências ausentes e falhas de rede.
6. O desmontar remove listeners, instâncias, timers e overlays pertencentes àquela instância.
7. Mensagens operacionais usam o transporte de toast existente; falhas específicas do controle permanecem associadas ao campo.
8. Tipos do runtime e CSS do plugin ficam junto do adaptador; dados demonstrativos ficam no catálogo.

Isso preserva a escolha tecnológica do Gnai. A [orientação do React sobre refs](https://react.dev/learn/manipulating-the-dom-with-refs) reforça que manipulações imperativas precisam respeitar a região de DOM controlada pelo React. A [orientação sobre componentes](https://react.dev/learn/thinking-in-react) recomenda separar responsabilidades; ela não impõe uma árvore universal de pastas.

## Sequência recomendada

1. Tratar lacunas funcionais e inventariar dependências antigas: scaffolds, paridade Rich Text, contratos dos adaptadores e identidade dos repetidores.
2. Aprovar uma organização única e atualizar as convenções desatualizadas.
3. Usar itens como piloto: entradas finas, um cabeçalho de negócio, pastas de formulário/listagem/detalhes e retirada de valores de `*.types.ts`.
4. Extrair apenas padrões de apresentação comprovadamente repetidos: grid de detalhes, resumo e casca de listagem.
5. Levar o padrão aos demais módulos por grupos pequenos, preservando contratos, permissões, URLs e feedbacks.
6. Separar o catálogo do produto e ajustar o resolver, mantendo as referências visuais e assets licenciados.
7. Aplicar verificações de arquitetura e formatação e realizar a validação técnica/visual autorizada para cada frente.

Critérios de conclusão de cada módulo: mesma funcionalidade antes/depois; uma única origem para título/breadcrumb; nenhum import de CSS de outra página; tipos e valores com responsabilidade explícita; plugins com cleanup e política de falha; ações, permissões, estados vazios e feedbacks preservados; nenhuma dependência de dados demonstrativos para o produto.

## O que não foi comprovado nesta etapa

Não foram medidos bundles, tempo de renderização ou memória. Não foram executados scanners de vulnerabilidade nem reproduzidas explorações. Não foi feita homologação completa de teclado, mobile ou leitor de tela. Não foi declarada paridade de todas as telas com o Blade: as divergências de Rich Text citadas foram verificadas em campos específicos.

Nenhuma migração em massa de pastas, CSS Modules, substituição de jQuery ou nova abstração de tabela foi aplicada. O único artefato produzido é este relatório.
