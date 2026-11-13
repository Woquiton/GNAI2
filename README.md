# Gnai

Sistema de gestão do Núcleo de Acessibilidade e Inclusão, originado como projeto
acadêmico. Reúne o Atendimento Educacional Especializado (AEE) e o Radar Inclusivo:
alunos, equipe, agendamentos, atendimentos, Estudo de Caso, PAEE, PEI, recursos de
acessibilidade, empréstimos, barreiras e vistorias. Inclui site institucional,
Central de Ajuda, e-mails, relatórios, backups e auditoria.

## Arquitetura

- Laravel 12 e PHP `^8.2`; a imagem Docker usa PHP 8.3-FPM.
- MySQL 8, fila persistente e agendador em serviços Docker separados.
- React 19, TypeScript e Inertia; Vite publica os assets, sem servidor React separado.
- Desenvolvimento: Nginx e Vite em containers, com o código montado do host.
- Produção padrão: Apache no host encaminha PHP ao FPM em `127.0.0.1:9000`.
  O código PHP fica dentro da imagem; `git pull` sozinho não atualiza os containers.
- A configuração adicional de Cloudflare Tunnel permanece disponível para
  instalações que já utilizam essa alternativa.

O backend fica em `app/Domains/{Application,Domain,Infrastructure,Tests,UI}`;
código transversal em `app/Shared`. O frontend fica em `resources/js` e
`resources/css`. PDFs, e-mails e a página Sobre mantêm templates Blade próprios.

## Requisitos

Git, Docker Engine, Docker Compose com suporte a `up --wait` e GNU Make.
PHP, Composer e Node locais são opcionais; os comandos operacionais usam Docker.
Para produção com Apache, configure também domínio, HTTPS e o encaminhamento
para o FPM conforme o [guia de operação](docs/operations/README.md).

## Começar em desenvolvimento

Na raiz do checkout:

```bash
cp .env.example .env.dev
```

Configure `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` e `MYSQL_ROOT_PASSWORD`.
O host do MySQL entre os containers é `db`, na porta `3306`. O Nginx de
desenvolvimento atende em `http://localhost`, porta `80`; ajuste `APP_URL`
se o endereço da sua instalação for diferente.

```bash
make deploy
make up
make create-admin
```

Escolha **1: desenvolvimento** em cada comando. O deploy constrói a imagem,
gera `APP_KEY` se estiver vazia, instala dependências PHP, aplica migrations e
sincroniza permissões. `make up` também inicia Nginx e Vite. O último comando
solicita os dados do administrador superior, com senha oculta.

Não há dados demonstrativos na inicialização padrão. Para carregá-los, use
`make seed`, confira o ambiente e confirme o banco informado. `make reset-db`
apaga as tabelas e carrega dados demonstrativos; não é uma etapa de instalação.

O MySQL de desenvolvimento pode ser acessado pelo host em `127.0.0.1:3307`.
O Vite usa `5173`. A ferramenta opcional phpMyAdmin depende do perfil `tools`
do Compose; não é necessária para executar a aplicação.

## Publicar em produção

```bash
cp .env.prod.example .env.prod
```

Preencha os dados reais, mantenha `APP_ENV=production` e `APP_DEBUG=false` e
configure `APP_URL` com o endereço HTTPS. Defina as senhas do banco e a senha
root. Não reutilize `change_me`. Deixe `APP_KEY` vazia apenas em uma instalação
nova; ao restaurar uma instalação, recupere a chave original junto do backup.

```bash
make deploy
make create-admin
```

Escolha **2: produção**. O deploy gera e salva uma chave ausente sem exibi-la;
chaves existentes são preservadas. Depois da construção, aguarda o banco,
interrompe aplicação e workers, aplica migrations, sincroniza permissões,
publica `public/build`, prepara o link de uploads e inicia os serviços atualizados.
Os caches são recriados na inicialização da aplicação.

Para atualizar uma instalação existente:

```bash
git pull
make deploy
```

Há uma janela de indisponibilidade. Uma falha interrompe o fluxo, sem rollback
automático das migrations. Não basta executar `npm run build` ou reiniciar um
container antigo para atualizar o PHP da imagem. Veja [deploy, Apache e túnel](docs/operations/README.md#produção).

## Comandos Make

Sem `ENV=`, cada comando pergunta o ambiente:

```text
Ambiente: 1) Desenvolvimento  2) Produção  [1]:
```

Enter escolhe desenvolvimento. Em automações sem terminal, informe `ENV=dev` ou
`ENV=prod`. Comandos destrutivos continuam exigindo confirmação interativa.
`make` ou `make help` lista os comandos sem executar operações.

| Objetivo | Comandos |
| --- | --- |
| Iniciar, parar e construir | `make up`, `make down`, `make build` |
| Publicar código e assets | `make deploy` |
| Editar nome/URL ou conexão | `make app`, `make database` |
| Logs | `make logs`, `make logs-app` |
| Banco e migrations | `make db`, `make migrate` |
| Backups | `make backup`, `make backup-db`, `make list-bkp` |
| Restaurar com seleção de arquivo | `make restore-db`, `make restore-full` |
| Administrador superior | `make create-admin`, `make reset-admin-password` |
| Permissões de acesso | `make permissions-sync`, `make permissions-prune` |
| Escrita e uploads | `make perm`, `make storage-link` |
| Caches | `make cache-dev`, `make cache-prod` |
| Dependências PHP e agendador | `make composer`, `make scheduler` |
| Frontend | `make npm-dev`, `make npm-build` |
| Dados demonstrativos | `make seed`, `make reset-db` |

`make app` e `make database` mantêm o valor atual com Enter, mostram um resumo
sem senhas e só salvam após confirmação. Depois executam o deploy no mesmo
ambiente. Alterar a conexão aponta para um banco existente, sem renomear banco,
transferir dados ou alterar usuários do MySQL. As migrations do deploy serão
aplicadas no destino; o acesso é validado antes de salvar.

`make scheduler` gerencia o serviço existente. `make perm` limita a correção a
`storage` e `bootstrap/cache`. Em produção, `make composer`, `make npm-build` e
`make build-assets` executam o deploy para manter imagem e assets compatíveis.

Argumentos Artisan usam `ARGS`, sem avaliação de expressões shell:

```bash
make art ARGS="migrate:status"
make art ARGS="route:list --path=alunos"
make make ARGS="create_example_table"
```

`make art migrate:status` continua disponível por compatibilidade. `ARGS` separa
argumentos por espaços; não interpreta aspas internas para valores com espaços.
Comandos desconhecidos geram erro.

## Verificações de desenvolvimento

Execute estas verificações quando precisar, no ambiente de desenvolvimento:

```bash
make test
make test TEST=tests/Feature/InertiaPagesTest.php
make coverage
```

Para typecheck, lint e formatação, use o serviço `node`, como descrito no
[guia React](resources/js/README.md). Não há `npm test` neste projeto.
A homologação visual e funcional das telas é manual.

## Documentação

- [Índice e organização dos documentos](docs/README.md).
- [Instalação, deploy e manutenção](docs/operations/README.md).
- [Backup e restauração](Docs/backup_spatie_docker_guia.md).
- [Arquitetura e convenções para contribuir](AGENTS.md).
- [Frontend React](resources/js/README.md).
- [Artigos da Central de Ajuda](resources/help/): uso das funcionalidades, permissões e tutoriais.

Os exemplos usam valores genéricos. Configurações reais, uploads, dumps, chaves
e arquivos de backup ficam fora do Git. Não rode desenvolvimento e produção
simultaneamente no mesmo checkout: eles compartilham diretórios persistentes do host.
