# Arquitetura do frontend React

Esta convenção define a organização de pastas, os níveis de componentes, os contratos compartilhados e a formatação do frontend React do Gnai. As convenções de [formulários](form-pages.md), [listagens](list-pages.md) e [detalhes](detail-pages.md) detalham cada tipo de tela. O módulo de **Itens** é a referência completa desta organização.

## Organização de pastas

```text
resources/js/
  main.tsx                     # resolve somente pages/**; atribui AppLayout às telas de negócio
  pages/<Recurso>/   # entradas Inertia: Index, Create, Edit, Show e subtelas
  components/
    Forms/ Tables/ Navigation/ UI/   # nível global
    <Recurso>/                       # recursos de negócio, sem módulo agregador
      <Recurso>.types.ts             # contratos recebidos dos controllers
      <Recurso>.constants.ts         # rótulos, filtros vazios, opções e mapas de tom
      <Recurso>.routes.ts            # URLs das rotas e breadcrumb do recurso
      <Recurso>DeleteModal.tsx       # peças compartilhadas pelas telas do recurso
      Form/  List/  Details/         # partes por responsabilidade
  hooks/ utils/                # somente o que é realmente transversal e sem UI
resources/css/
  reset.css tokens.css globals.css accessibility.css app-shell.css icons.css variables.css
  components/                  # espelha os proprietários em resources/js/components/
  pages/                       # estilos de páginas, incluindo about-us.css
resources/images/              # imagens processadas pelo Vite
public/images/                 # imagens servidas diretamente
public/assets/
  js/ fonts/ plugins/          # dependências locais, recursos e licenças
```

- `pages/` contém apenas as entradas resolvidas por `Inertia::render('Recurso/Acao')`. Uma página recebe as props do controller, chama os hooks do recurso e compõe os componentes; não define formulários, colunas, tipos ou CSS próprios.
- `components/<Recurso>/` guarda tudo o que pertence ao recurso. Use as subpastas somente quando houver conteúdo: `Form/` (formulário, seções, `use<Recurso>Form.ts`, tipos do payload), `List/` (filtros, colunas e tabela) e `Details/` (blocos da visualização e ações do rodapé).
- Tipos, constantes e hooks ficam com seu proprietário em `resources/js/`. CSS fica em `resources/css/`, espelhando o caminho do proprietário, e é importado por `@styles/`. Não crie `types/`, `constants/` ou `hooks/` globais para conteúdo de um domínio. Valores não ficam em `*.types.ts`.
- O catálogo demonstrativo do Ubold foi removido. Componentes convertidos, incluindo widgets genéricos (gráficos, painéis e tabelas de plugins), permanecem em `components/` para uso do produto. Assets de terceiros e suas licenças permanecem em `public/assets/`.

## Três níveis de reutilização

| Nível | Onde fica | Exemplos |
| --- | --- | --- |
| Global | `components/{Forms,Tables,Navigation,UI}` | `FormFields`, `FormLayout`, `TableListLayout`, `TableListFilters`, `BusinessPage`, `DetailGrid`, `ConfirmActionModal` |
| Domínio | `components/<Recurso>/` (ou `components/` para peças de vários recursos) | `ItemDeleteModal`, `itemBreadcrumb`, `GeoMap`, `Inspections/*` |
| Específico | Subpastas `Form/`, `List/`, `Details/` | `ItemIdentificationFields`, `itemColumns`, `ItemDetails` |

Extraia um componente quando ele tiver responsabilidade própria (uma seção de formulário, a configuração das colunas, um bloco de detalhes) ou for reutilizado. Não crie componentes que apenas envolvem um único campo.

## Base compartilhada

Os caminhos são relativos a `resources/js/components/`.

| Necessidade | Componente ou hook |
| --- | --- |
| Moldura de página de negócio | `Navigation/BusinessPage`: `title`, `subtitle`, `documentTitle`, `breadcrumbItems`, `actions`, `error`, `busy`, `tour` |
| Tutorial ao vivo da tela | `UI/GuidedTour` pela prop `tour` do `BusinessPage`; veja a [convenção](guided-tours.md) |
| Breadcrumb de recurso | `Navigation/PageBreadcrumb/resourceBreadcrumb.ts`: Home › Coleção › Registro › Etapa |
| Página de listagem | `Tables/TableList`: `TableListLayout` (cabeçalho, card, filtros, tabela, diálogos) |
| Estado da listagem | `useTableListFilters`: filtros com atraso, limpeza, paginação (`selectPage`) e `loading` |
| Barra de filtros | `TableListFilters`: grade responsiva, limpar e `moreFilters` |
| Tabela por dados | `TableListTable` com `rows`, `rowKey`, `rowClassName` e, em cada coluna, `render`/`cellTitle`; as células são associadas pelo `id` da coluna |
| Pessoa na primeira coluna | `TableListPersonCell` (foto e nome com reticências) |
| Ações da linha | `TableListRowActions`: `view`/`edit` (com `newTab`), `download`, `remove` e ações extras em `children` |
| Campos de formulário | `Forms/FormFields`: `TextInputField`, `TextAreaField`, `SelectInputField`, `MaskedInputField`, `DateInputField`, `RichTextField`, `CheckboxListField` |
| Opções de select | `optionsFromRecord`, `optionsFromNamed`, `booleanOptions` (em `Forms/FormFields`) |
| Envio do formulário | `Forms/FormLayout/useFormSubmission`: trava de envio duplo, multipart com `_method`, `transform` por operação, foco no primeiro erro e toasts de falha |
| Erro de controle isolado | `Forms/FormField/FieldError` + `fieldErrorId` |
| Ação confirmada | `UI/ConfirmActionModal/useConfirmedAction` + `ConfirmActionModal` (listagens e visualizações) |
| Visualização | `UI/DetailGrid` + `UI/DetailField` (`wide`, `preserveLineBreaks`), `UI/TagList`, `UI/TableLabel`, `UI/RichTextContent` |
| Seção, lista ou aba sem registros | `UI/EmptyText` (texto discreto); tabelas usam `TableListEmpty` e valores múltiplos usam `TagList` |
| Prontuários | `UI/RecordSummary` (foto, nome e dados essenciais) + `Navigation/RecordTabs` (faixa horizontal compartilhada) |
| Diálogos | `UI/Modal` (foco inicial, contenção por Tab e retorno ao disparador; `initialFocus`) e `UI/ConfirmActionModal` |
| Falhas de operação | `UI/NotificationToast/operationFeedback`: `notifyOperationFailure`, `notifyConnectionFailure` |
| Controles isolados | `Forms/`: `TextInput`, `TextArea`, `SelectField`, `ChoiceControl`, `ChoiceGroup`, `ToggleControl`, `MaskedInput`, `DatePicker`, `FileUploadButton`, `FileDropzone`, `EvidenceUpload`, `ImageUploadField`, `PersonPhotoUpload`, `FormSection`, `FormActions` |
| Agrupamento, ações e estados | `UI/Button`, `UI/CardBox`, `UI/Panel`, `UI/InlineAlert`, `UI/AppLoader`, `UI/ErrorState`, `UI/Tooltip`, `UI/SearchInput` |
| Alternar modos de visualização | `UI/SegmentedControl`: grupo grafite com `value`, `options` e `onChange`; usado no builder, na auditoria e em Listagem/Catálogo |
| Navegação e tabelas | `Navigation/Tabs`, `Navigation/Pagination`, `Navigation/PageTitle`, `Navigation/PageBreadcrumb`, `Tables/Table`, `Tables/DataTable`; `Navigation/PageHeader` é só referência Ubold |
| Estrutura compartilhada | `Navigation/AppLayout` (atribuído em `main.tsx`), `AuthLayout` com `AccountLayout`, `TeacherPortalLayout`, `TopBarPrimary`, `SidebarPrimary`, `AppFooter`, `SkipLinks`. Não repita header, footer, barras ou navegação por página |

`useTableListAction` continua disponível como alias de `useConfirmedAction` nas listagens existentes.

Abas que navegam entre URLs usam `Navigation/PageTabs`. Quando representam visualizações do mesmo componente Inertia, como calendário e listagem de agendamentos, passe `preserveState` para manter a navegação montada e permitir o deslizamento do indicador compartilhado. Entre páginas diferentes, a continuidade depende de um layout persistente, como `SettingsLayout`; não replique a animação em CSS do recurso. A preferência do usuário por movimento reduzido desativa a transição.

`Tabs` horizontal e `PageTabs` compartilham `Navigation/Tabs/TabNavigation`: altura mínima de 46 px, texto de 14 px, padding de 10 × 18 px (10 × 14 px no celular), linha na largura disponível e indicador elástico limitado à aba selecionada. Abas ocupam a largura do próprio conteúdo. Quando excedem a faixa, o componente habilita arraste com `grab`/`grabbing`, toque e controles de borda; arrastar não ativa uma aba. Use esse padrão também por `RecordTabs`, sem duplicar medidas ou animações no domínio.

### Contrato dos campos

Todos os campos compostos recebem `id`, `label`, `error`, `required`, `hint`/`hintLabel` e `fieldClassName`. O campo liga sozinho `aria-describedby` à dica e ao erro e marca o controle como inválido. `onChange` sempre entrega o valor (`string`, `string[]`, `number[]`), nunca o evento. Para composições que os campos não cobrem, use `FormField` com o controle isolado e `fieldDescribedBy` de `Forms/FormField/fieldDescription.ts`. `TextInput`, `TextArea` e `SelectField` aceitam `invalid`.

### Adaptadores de plugins

Select2, Summernote, Datepicker, Clockpicker, Timepicker, Switchery e demais plugins jQuery continuam encapsulados em seus componentes. Cada adaptador recebe um nó por ref, converte eventos em `onChange`, aceita `disabled`/`invalid` e descrição acessível, informa falhas de carregamento (`onLoadError` ou fallback nativo) e remove instâncias e listeners ao desmontar. Páginas não inicializam plugins nem fazem requisições dentro de adaptadores. `loadExternalScript` e `loadExternalStylesheet` deduplicam tags e recriam as que falharam.

### Listas removíveis

`RepeaterField` oferece `variant="fields"` para linhas de campos simples sem moldura nem título duplicado, mantendo o nome acessível do grupo. A variante padrão `blocks` conserva a moldura e o título. O componente mantém chaves internas estáveis por bloco; informe `getItemKey` quando o item tiver identidade própria (por exemplo, `id` de registro salvo). Não use índices como `key` em listas que permitem remover itens intermediários. Índices continuam válidos nos nomes enviados (`items[0][campo]`) e nos caminhos de erro.

## Estilos e tokens

- `resources/css/tokens.css` é a fonte de cores, tipografia, espaçamento (`--ui-space-*`), raios (`--ui-radius-*`) e foco (`--ui-focus-ring-*`). `--ui-color-primary` é o roxo institucional; o azul do tema permanece somente como `--ui-color-theme-blue`.
- `UI/Button` define cada tom apenas por variáveis `--button-*`; o anel de foco é o mesmo para todos os tons. Não fixe cores, raios ou anéis de foco em páginas.
- CSS local organiza somente a composição particular do proprietário. Grades de filtros, grades de detalhes, etiquetas e espaçamentos de cards vêm dos componentes globais. Uma tela nunca importa CSS de outra tela ou recurso; padrões comuns viram componente.
- Evite `style` inline, exceto para valores calculados em tempo de execução (largura medida, variável CSS derivada de props).

## Formatação e verificação

| Comando | Finalidade |
| --- | --- |
| `npm run format` / `npm run format:check` | Prettier: 4 espaços, aspas simples no TS, aspas duplas no JSX, vírgula final, 100 colunas |
| `npm run lint` / `npm run lint:fix` | ESLint: TypeScript, React, Hooks, jsx-a11y e fronteiras de importação |
| `npm run check` | Typecheck com o TypeScript 7 |

O typescript-eslint ainda não suporta o TypeScript 7 nativo; `eslint.config.js` resolve o parser com o pacote `typescript-eslint-runtime` (TypeScript 6) somente para o lint.

O ESLint impede que componentes, hooks e utilitários importem páginas, que hooks e utilitários importem componentes. Erros devem ficar em zero; avisos indicam débitos a corrigir quando a área for alterada.

Na escrita do JSX, mantenha o `return` declarativo: extraia condicionais encadeadas, rótulos calculados e montagens de opções para variáveis ou funções antes do `return`, e mova blocos extensos para componentes com responsabilidade própria.
