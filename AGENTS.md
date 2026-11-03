# Gnai: instruções do repositório

Gnai é o sistema de acessibilidade e inclusão do Núcleo de Acessibilidade e Inclusão, com os módulos AEE e Radar Inclusivo, originado como projeto acadêmico. Instruções do usuário prevalecem no escopo da tarefa; uma exceção pedida para uma tela não redefine o padrão global. Preserve as instruções específicas do diretório em que estiver trabalhando.

## Convenções: leia só as que a tarefa exige

| Tarefa | Leia antes de implementar |
| --- | --- |
| Qualquer alteração no frontend React | [arquitetura](docs/ai-conventions/frontend/architecture.md), com pastas, componentes, tokens, Prettier e ESLint; o módulo de Itens é a referência completa |
| Formulários (criar, editar, migrar) | [formulários](docs/ai-conventions/frontend/form-pages.md) |
| Listagens | [listagens](docs/ai-conventions/frontend/list-pages.md) |
| Visualizações e prontuários | [detalhes](docs/ai-conventions/frontend/detail-pages.md) |
| Cabeçalho, botões, cores, logo, imagens | [identidade visual](docs/ai-conventions/frontend/identity.md) |
| Mensagens de sucesso, erro, aviso e carregamento | [feedback de operações](docs/ai-conventions/frontend/feedback.md) |
| Componentes novos, foco, teclado, atalhos | [acessibilidade](docs/ai-conventions/frontend/accessibility.md) |
| Criar, alterar ou remover testes | [testes do backend](docs/ai-conventions/backend/tests.md) |
| Alterar uma funcionalidade documentada na Central de Ajuda | [artigos de ajuda](docs/ai-conventions/content/help-articles.md); atualize o artigo em `resources/help/` |

Novas convenções vão para `docs/ai-conventions/` e entram nesta tabela. Atualize o documento quando uma mudança autorizada alterar o padrão oficial. Não crie convenção por tela nem documentos vazios.

## Arquitetura e caminhos reais

- **Backend:** Laravel 12, PHP `^8.2` no Composer e 8.3-FPM no `Dockerfile`, MySQL 8 em Docker. Desenvolvimento usa Nginx; produção usa Apache no host encaminhando ao PHP-FPM.
- **Domínios** em `app/Domains/`: `Audit`, `Auth`, `Backup`, `Dashboard`, `Help` (Central de Ajuda), `Inclusion` (domínio único de inclusão: AEE, radar, publicações e cadastros de apoio), `Notifications`, `Reporting`, `Settings` e `Website` (site público white label). Controllers em `UI/Controllers`; validação e normalização em `Application/Data` e `Application/Rules` (Spatie Laravel Data, não só Form Requests); operações em `Application/Actions`; consultas em `Application/Queries`; modelos, enums e DTOs em `Domain`. Código transversal em `app/Shared`. Não existe `app/Http/Controllers` convencional.
- **Rotas:** `routes/web.php`, `routes/auth.php` e `routes/modules/{inclusion,audit,reporting,backup,settings,website,help}.php`; middlewares e exceções em `bootstrap/app.php`. `inclusion.php` usa o prefixo único `/inclusao`. Os nomes internos `inclusive-radar.` e `specialized-educational-support.` são históricos e ficam estáveis para permissões; não são divisões de pasta. Site público em `/site` (páginas `Website/Public/*`, sem `AppLayout`), retaguarda em `/administracao-do-site`. Publicações ficam em `Publication`, rotas `inclusive-radar.publications.*`.
- **URLs** de negócio em português sem acentos, inclusive ações (`criar`, `salvar`, `visualizar`, `editar`): `/autenticacao`, `/autenticacao/painel`, `/configuracoes`, `/relatorios`, `/ajuda`. Preserve nomes de rotas, parâmetros de model binding, permissões e chaves de domínio. Não mantenha aliases ou redirecionamentos para caminhos antigos. O catálogo técnico fica em `/react`.
- **Frontend:** React 19 + TypeScript + Inertia em `resources/react/` (entrada `main.tsx`, alias `@/`). `vite.config.js` compila só a entrada React. Componentes em `.tsx`; lógica e tipos sem markup em `.ts`. Controllers usam `Inertia::render('Dominio/Recurso/Acao', $props)`, resolvido em `resources/react/pages/Dominio/Recurso/Acao.tsx`, com o documento mínimo `resources/views/inertia.php`.
- **Estilos:** `resources/react/styles/{reset,tokens,globals,accessibility,app-shell,icons}.css` e CSS junto de componentes e páginas. Assets do tema em `public/assets/react/`; `resources/css/variables.css` fornece os tokens legados.
- **Blade em uso**, a preservar: `inertia.php`, a página Sobre (`pages/about-us.blade.php` com `resources/css/pages/about-us.css`, identidade própria aprovada, não é tela pendente), os PDFs (`pages/inclusion/*/pdf*.blade.php`, `student-history-pdf.blade.php`, `reports/pdf.blade.php` com `components/pdf/`) e os e-mails em `emails/`. As telas Blade antigas foram removidas em 2026-10-31 e não devem ser recriadas; consulte o legado pelo git, por exemplo `git show f0bad6a2:resources/views/pages/inclusion/students/create.blade.php`. `resources/js/` e os estilos de telas em `resources/css/` são legado.
- **Testes** em `tests/`, `app/Domains/*/Tests/` e `phpunit.xml`; documentação de domínio em `Docs/`, especialmente `Docs/inclusive-radar/`.

## Estado da migração

Uma entrada Inertia não comprova paridade funcional: confira conteúdo e contratos. Procure telas de negócio concluídas antes de cada migração e siga seus padrões. O catálogo (`/react/index.html`, só em `local`/`testing`) fica em `resources/react/catalog/`; consulte o código de `catalog/pages/{FormElements,FormValidation,AccountPages}` como referência de composição, sem tratar dados, links ou submits demonstrativos como integração real, e sem precisar executá-lo. Não reintroduza renderização Blade nem fragmentos HTML nas listagens.

## Reconstruir uma tela

Fluxo: **legado e requisitos → contratos → assets e padrões Gnai → reutilizar componentes → implementar React com identidade e acessibilidade → ajustar integrações → comparar com o legado e revisar o diff → entregar.**

1. Localize o legado no git (commit `f0bad6a2` ou anteriores), com partials e scripts. Pesquise no repositório antes de pedir caminhos ao usuário.
2. Rastreie rotas, controllers, Data/Rules, Queries/Actions, permissões (`can:*` e `app/Domains/Auth/`) e contratos. Criar e editar costumam ter contratos diferentes; em alunos, por exemplo, `remove_photo` só existe na edição, enquanto `status` é aceito no cadastro e na edição.
3. Inventarie campos, valores iniciais, opções, máscaras, uploads, textos, botões, estados, condicionais, métodos HTTP, nomes de campos, props, redirects, mensagens, erros inline, loading e recuperação após falhas.
4. Reconstrua em TSX por composição, sem tradução mecânica do HTML/CSS antigo, e compare o código com o inventário, incluindo estados vazios e falhas.

Paridade e limites:

- Preserve campos, validações, loading, erros, sucesso, redirects, filtros, busca, paginação, modais, confirmações, permissões, enums e formatos aceitos pelo backend, inclusive uploads e remoção de arquivos. Validação no cliente não substitui a do servidor.
- Preserve o significado dos textos; corrija erros evidentes e branding herdado. Não adicione campos ou fluxos por iniciativa própria nem remova funcionalidades por parecerem antigas; remoções exigem pedido explícito ou razão técnica relatada.
- Ajustes pequenos de integração em controllers, props, Queries, Data, flash ou rotas são permitidos quando necessários para dados que o legado já usava. Não altere banco, migrations ou regras de negócio por conveniência do frontend; explique antes de ampliar o escopo. Relate oportunidades fora do escopo em vez de refatorar.

## Integração React

- Páginas compõem componentes e coordenam estado; evite páginas monolíticas, cópias de componentes e extrações triviais. Procure primeiro em `resources/react/components/` e leia a API real antes de usar; estenda o equivalente em vez de recriá-lo.
- Toda tela de negócio usa `Navigation/BusinessPage`, diretamente ou por `TableListLayout`; `AppLayout` vem de `main.tsx`. Não repita header, footer ou navegação por página.
- Consuma as props reais do controller. `HandleInertiaRequests` compartilha `auth.user` e `flash`; o usuário compartilhado não traz mapa de permissões, então não invente capacidades nem troque autorização do servidor por condicionais visuais.
- Listagens usam respostas Inertia, inclusive em recargas parciais; não recrie tabelas HTML via AJAX.
- Preserve a limpeza de listeners e instâncias de plugins ao desmontar, licenças de `public/assets/react/` e não importe Bootstrap global.
- Acessibilidade mínima em toda tela: HTML semântico, títulos em ordem, labels ligadas, obrigatórios compreensíveis, foco visível, teclado nas ações, botão para ação e link para navegação, estados comunicados também por texto ou ícone. Base: LBI art. 63, eMAG 3.1 e WCAG 2.2 AA.

## Execução e homologação

O agente investiga, implementa, revisa o diff e entrega; a homologação visual e funcional é manual, feita pelo usuário. Sem pedido explícito, ou sem que a tarefa seja testar o ambiente:

- Não execute build, typecheck, lint, PHPUnit, testes de frontend ou E2E.
- Não inicie Vite, Laravel, Docker, Nginx ou outros servidores, não abra navegador, não acesse URLs e não gere screenshots.
- Não crie testes, mocks, scripts temporários, banco SQLite, fixtures ou infraestrutura de teste só porque uma tela foi migrada. Testes existentes podem ser lidos como documentação.

Comandos de referência, para quando forem pedidos:

| Finalidade | Comando |
| --- | --- |
| Vite | `npm run dev` ou `make npm-dev` |
| Typecheck / build com typecheck | `npm run check` / `npm run build` |
| Lint e formatação | `npm run lint`, `npm run format:check` (correção: `lint:fix`, `format`) |
| Testes Unit + Domains (sem a suíte `Feature` da raiz) | `make test`; específico: `make test TEST=<caminho>` |
| Todos os testes no PHP local | `composer test` |
| Integração das páginas Inertia | `make test TEST=tests/Feature/InertiaPagesTest.php` |
| Estilo PHP | `vendor/bin/pint --test <arquivo.php>` |

No Docker, use o serviço `node` para npm e `app` para PHP (`docker compose --env-file .env.dev -f docker-compose.dev.yml exec node npm run check`). Não há testes de frontend; não invente `npm test`. Respeite `.editorconfig`, `.prettierrc.json` e `eslint.config.js`.

## Entrega

Uma migração está concluída quando os arquivos React estão implementados com componentes existentes, a integração com os contratos está feita e o código foi comparado com o inventário e revisado. Entregue um resumo curto: arquivos alterados, telas, componentes reutilizados, funcionalidades preservadas, ajustes de backend e pontos para a homologação manual. Quando algo depender de runtime, diga: "Implementado no código; comportamento em runtime deve ser conferido na homologação manual." Não trate a ausência de testes ou servidores como problema.
