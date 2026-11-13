# Frontend React

React 19 e TypeScript integrados ao Laravel com Inertia. O [README do projeto](../../README.md)
e o [guia de operação](../../docs/operations/README.md) descrevem a inicialização
com Docker. Não há servidor React separado do Laravel; Vite fornece os assets
no desenvolvimento e publica o bundle na construção da imagem.

## Executar e verificar

Com o ambiente de desenvolvimento preparado:

```bash
make npm-dev
make npm-build
```

Escolha desenvolvimento no menu. O primeiro comando inicia o serviço `node`
com Vite. O segundo instala as dependências no volume Node e executa o build,
que inclui typecheck. Em produção, `make npm-build` e `make build-assets`
executam o deploy completo, para manter PHP e assets na mesma versão.

Para executar verificações específicas, use o serviço Node:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec node npm run check
docker compose --env-file .env.dev -f docker-compose.dev.yml exec node npm run lint
docker compose --env-file .env.dev -f docker-compose.dev.yml exec node npm run format:check
```

Não há `npm test` nem suíte de testes de frontend no projeto. A homologação
visual e funcional das telas é manual.

Para o editor no host resolver os tipos, `npm ci` local é opcional. O Docker
usa um volume próprio de `node_modules`, que não preenche a pasta vista pelo
editor. Não mantenha um segundo Vite local usando a mesma porta do serviço Node.

## Organização e contratos

- Entrada: `main.tsx`; páginas Inertia em `pages/<Recurso>/<Acao>.tsx`.
- Componentes: `components/Forms`, `Tables`, `Navigation`, `UI` e pastas por recurso.
- Alias de código: `@/`; estilos em `resources/css`, importados por `@styles/`.
- Imagens processadas pelo Vite: `resources/images`; imagens públicas: `public/images`.
- Plugins, fontes e scripts locais de terceiros: `public/assets/{plugins,fonts,js}`.

Controllers usam `Inertia::render('Recurso/Acao', $props)`. `main.tsx` resolve a
página e atribui o layout de negócio. O documento de entrada é
`resources/views/inertia.php`. O middleware compartilha usuário, flash e erros.
Listagens e recargas parciais usam respostas Inertia, sem fragmentos HTML por AJAX.

Reutilize os componentes existentes com imports diretos:

```tsx
import Button from '@/components/UI/Button/Button';
import TextInput from '@/components/Forms/TextInput/TextInput';
```

As regras de componentes, tokens, formulários, listagens, acessibilidade e
tutoriais estão nas [convenções de arquitetura](../../docs/ai-conventions/frontend/architecture.md)
e no [AGENTS local](AGENTS.md). Itens é o módulo de referência.

O catálogo demonstrativo do tema e as telas Blade antigas foram removidos;
consulte o histórico Git quando precisar do legado. A página Sobre, os PDFs e
os e-mails mantêm seus templates dedicados. Preserve licenças e dependências
embutidas dos assets de terceiros usados pelos componentes.
