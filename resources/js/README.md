# React

Frontend React/TypeScript integrado ao Laravel com Inertia.

- Código: `resources/js` (alias `@/`).
- Estilos: `resources/css` (alias `@styles/`), com os caminhos dos componentes espelhados.
- Imagens processadas pelo Vite: `resources/images`.
- Imagens públicas: `public/images`.
- Plugins, fontes e scripts de terceiros: `public/assets/{plugins,fonts,js}`.

Na raiz do projeto:

```bash
npm ci
npm run dev
npm run check
npm run build
```

No ambiente Docker existente, use o
serviço `node` para os comandos npm. Não há servidor React separado.

Para usar o PhpStorm ou outro editor instalado no computador, execute `npm ci`
também no terminal local, na raiz do projeto. O Docker mantém as dependências em
um volume próprio, que não preenche a pasta `node_modules` vista pelo editor.
A instalação local permite resolver `react/jsx-runtime`, os tipos do React e o
TypeScript. Os comandos de desenvolvimento da aplicação continuam no serviço
`node` do Docker.

Controllers de telas retornam `Inertia::render('Recurso/Acao', $props)`.
O identificador resolve diretamente o arquivo `pages/Recurso/Acao.tsx`.
As páginas de negócio compõem os componentes do Gnai. Os dados enviados pelos controllers ficam
disponíveis como props ou por `usePage()` do Inertia.

`main.tsx` inicializa o Inertia. A única entrada HTML é `resources/views/inertia.php`,
um documento PHP mínimo, sem layout Blade. O middleware compartilha usuário,
mensagens de sessão e erros de validação. Listagens usam respostas Inertia,
inclusive em requisições AJAX, sem fragmentos HTML de tabelas.

Os templates e estilos antigos das telas podem ser consultados no histórico do git.
Os scripts e estilos Blade antigos foram removidos. CSS global, tokens e estilos
dos componentes ficam em `resources/css`; `variables.css` continua importado por
`tokens.css`. Templates para PDFs e e-mails continuam dedicados a essas saídas. O Bootstrap instalado pelo npm foi removido; os plugins locais
utilizados pelos componentes React continuam em `public/assets`.

Reutilize os componentes com imports diretos, por exemplo:

```tsx
import Button from '@/components/UI/Button/Button';
import TextInput from '@/components/Forms/TextInput/TextInput';
```

A entrada React carrega reset, tokens e estilos globais próprios. Os componentes
carregam seus estilos e plugins locais. As páginas de negócio recebem os dados dos módulos pelos controllers.
O catálogo demonstrativo do Ubold foi removido. Componentes convertidos e os plugins que eles utilizam permanecem disponíveis para
o Gnai, com seus arquivos minificados, fontes, imagens necessárias e licenças.
Pacotes sem uso foram removidos de `public/assets/plugins/`; dependências
embutidas nos bundles preservados não precisam de cópias separadas.
