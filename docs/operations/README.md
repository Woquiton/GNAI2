# Instalação, deploy e manutenção

Este guia descreve os fluxos implementados no [Makefile](../../Makefile), no
[executor operacional](../../docker/operations/run.sh) e no
[entrypoint PHP](../../docker/php/entrypoint.sh). O resumo para começar está no
[README](../../README.md). Os comandos deste documento são para execução pelo
operador; não constituem homologação do ambiente.

## Ambientes e persistência

| Ambiente | Configuração | Compose | Imagem PHP |
| --- | --- | --- | --- |
| Desenvolvimento | `.env.dev`, copiado de `.env.example` | `docker-compose.dev.yml` | `gnai-php:dev` |
| Produção | `.env.prod`, copiado de `.env.prod.example` | `docker-compose.prod.yml` | `gnai-php:prod` |

Cada comando Make pergunta o ambiente. O padrão do menu é desenvolvimento;
`ENV=dev` ou `ENV=prod` permite selecionar explicitamente sem o menu. Operações
destrutivas ainda pedem confirmação. Não faça `source` desses arquivos: Compose
lê os valores, sem passar as credenciais pelo parser do Make ou por `eval`.

O MySQL persiste em volume Docker. Uploads, logs e arquivos operacionais ficam
em `storage`; `bootstrap/cache` também é persistido em produção. Os arquivos
`.env` não entram na imagem. Não use `make down-v` para atualizar: ele remove os
volumes, incluindo os dados do MySQL, e exige confirmação.

No desenvolvimento, o código é montado do host; em produção, é copiado para
`/var/www` durante a construção. Fila e scheduler usam a mesma imagem do FPM.
O `opcache` de produção não revalida timestamps, portanto mudanças de PHP exigem
recriação ou reinício do serviço correspondente, além dos assets do frontend.

## Desenvolvimento

1. Copie `.env.example` para `.env.dev` e preencha a conexão MySQL.
2. Mantenha `DB_HOST=db` e `DB_PORT=3306` para o serviço local.
3. Use `APP_URL=http://localhost` para o Nginx padrão na porta `80`.
4. Execute `make deploy`, escolhendo desenvolvimento.
5. Execute `make up`, também em desenvolvimento, para iniciar Nginx e Vite.
6. Execute `make create-admin` para cadastrar o administrador superior.

O deploy prepara `APP_KEY`, migrations e catálogo de permissões. O entrypoint
instala as dependências PHP de desenvolvimento no volume do checkout. O serviço
Node mantém dependências em volume próprio e inicia o Vite em `5173`.
O banco também fica acessível pelo host em `127.0.0.1:3307`.

Se a porta `80` já estiver ocupada, resolva o conflito no host ou ajuste o
mapeamento do Compose e `APP_URL` em conjunto. A ferramenta opcional phpMyAdmin
pode ser iniciada com o perfil `tools`:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml --profile tools up -d phpmyadmin
```

Não é necessário instalar npm no host para executar o projeto. Para o editor
resolver os tipos localmente, a instalação local de dependências é opcional;
consulte [React](../../resources/js/README.md).

## Produção

### Preparar o ambiente

Copie `.env.prod.example` para `.env.prod` e configure domínio, banco, senhas e
parâmetros de e-mail/backup. Mantenha `APP_DEBUG=false` e `APP_ENV=production`.
As credenciais padrão `change_me` impedem a publicação. Em um banco existente,
use os usuários e senhas já provisionados: alterar `MYSQL_*` no arquivo não
modifica usuários de um volume MySQL já inicializado.

O `make deploy` gera `APP_KEY` somente quando vazia e salva a chave no arquivo,
sem imprimi-la. Ele restringe o acesso ao arquivo a seu dono. Preserve a chave
original em restaurações: sessões e dados criptografados dependem dela.
Guarde uma cópia segura do arquivo junto dos backups; o ZIP de dados não o inclui.

### Publicar e atualizar

```bash
git pull
make deploy
```

Escolha produção. O fluxo:

1. Constrói a imagem PHP, as dependências e o frontend com o Dockerfile.
2. Valida as configurações e prepara a chave, preservando um valor existente.
3. Aguarda o serviço MySQL e interrompe FPM, fila e scheduler.
4. Executa o bootstrap, limpa caches antigos, aplica migrations com `--force`
   e sincroniza o catálogo de permissões em um container temporário.
5. Extrai os assets da imagem para `public/build` do host e prepara `public/storage`.
6. Inicia FPM, fila e scheduler com a imagem atualizada e aguarda a disponibilidade
   dos serviços. A aplicação recria os caches de configuração, rotas e views.

A disponibilidade do FPM no healthcheck não valida login, regras de negócio ou
funcionalidades. Confira o ambiente manualmente após o deploy. Há indisponibilidade
durante a atualização e nenhuma reversão automática de migrations. Se houver
falha, confira o erro antes de repetir; não reinicie workers durante uma
restauração incompleta.

### Apache no host

O Compose padrão publica o FPM somente em `127.0.0.1:9000`. Apache serve o
`public/` do checkout e encaminha scripts para `/var/www/public` dentro do
container. Em Debian/Ubuntu, prepare os módulos no host:

```bash
sudo apt install apache2
sudo a2enmod proxy proxy_fcgi rewrite headers
```

Exemplo de `/etc/apache2/sites-available/gnai.conf` para HTTPS terminado por um
proxy institucional antes do Apache. Substitua domínio e caminho do checkout:

```apache
<VirtualHost *:80>
    ServerName gnai.example.edu.br
    DocumentRoot /srv/gnai/public
    DirectoryIndex index.php

    <Directory /srv/gnai/public>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <Directory /srv/gnai/storage/app/public>
        Options FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    <FilesMatch "\.php$">
        SetHandler "proxy:fcgi://127.0.0.1:9000"
    </FilesMatch>

    ProxyFCGISetEnvIf "true" HTTP_HOST "gnai.example.edu.br"
    ProxyFCGISetEnvIf "true" SERVER_NAME "gnai.example.edu.br"
    ProxyFCGISetEnvIf "true" SERVER_PORT "443"
    ProxyFCGISetEnvIf "true" HTTPS "on"
    ProxyFCGISetEnvIf "true" HTTP_X_FORWARDED_PROTO "https"
    ProxyFCGISetEnvIf "true" SCRIPT_FILENAME "/var/www/public%{reqenv:SCRIPT_NAME}"

    ErrorLog ${APACHE_LOG_DIR}/gnai_error.log
    CustomLog ${APACHE_LOG_DIR}/gnai_access.log combined
</VirtualHost>
```

Só force os indicadores de HTTPS quando essa for a topologia real e o acesso ao
Apache estiver restrito ao proxy confiável. Se o próprio Apache terminar TLS,
configure um VirtualHost `*:443`, o módulo `ssl` e os certificados correspondentes.
Não aplique as variáveis de HTTPS a uma instalação que só atende HTTP.

Depois de preparar o VirtualHost:

```bash
sudo a2ensite gnai.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

O mapeamento de `SCRIPT_FILENAME` é necessário porque o caminho do checkout no
host pode ser diferente de `/var/www` dentro do FPM. Não exponha a porta FPM à
rede externa.

### Compatibilidade com Cloudflare Tunnel

Os arquivos [docker-compose.tunnel.yml](../../docker-compose.tunnel.yml) e
[nginx.tunnel.conf](../../nginx/nginx.tunnel.conf) permanecem disponíveis e não
são usados pelo deploy padrão. Se a instalação já utiliza essa alternativa,
preserve a configuração de `cloudflared` no host, o domínio e o encaminhamento
para o Nginx em `127.0.0.1:8082`.

Após publicar a aplicação pelo fluxo padrão, o serviço adicional pode ser iniciado
com a configuração existente:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml -f docker-compose.tunnel.yml up -d --no-deps nginx
```

O Nginx adicional encaminha o PHP ao serviço `app:9000`. Essa alternativa não
instala nem configura o `cloudflared`, DNS ou certificados no host.

## Alterar configurações

`make app` pergunta nome e URL. `make database` pergunta host, porta, nome de um
banco existente, usuário e senha. Ambos usam o ambiente escolhido no menu.
Enter mantém o valor atual; senhas ficam ocultas e o resumo não as mostra.
Digite `sim` para salvar e executar o deploy no mesmo ambiente.

O assistente do banco valida o acesso antes de salvar. O serviço MySQL precisa
estar acessível; não são criados bancos, usuários nem cópias de dados. A senha
root não é alterada. No primeiro ambiente, configure-a diretamente no arquivo.
As migrations do deploy serão aplicadas no banco de destino. Se a publicação
falhar após salvar, o arquivo mantém os novos valores: corrija o erro e repita
o deploy.

## Serviços, dependências e manutenção

- `make scheduler`: inicia o serviço agendador existente, sem criar um segundo processo.
- `make composer`: instala dependências em desenvolvimento; em produção, reconstrói
  e publica pela imagem. Não modifica apenas o filesystem descartável do container.
- `make perm`: corrige dono e escrita em `storage` e `bootstrap/cache`, sem
  executar `chown` no repositório inteiro.
- `make storage-link`: prepara o link interno e, em produção, o link público no host.
- `make cache-dev`: limpa configuração, rotas, views e cache do desenvolvimento.
- `make cache-prod`: recria os caches de produção e reinicia FPM e workers.
- `make npm-build` / `make build-assets`: no desenvolvimento, usa Node no Docker;
  em produção, executa o deploy completo para manter imagem e assets compatíveis.
- `make npm-dev` / `make dev-assets`: inicia o serviço Vite, apenas no desenvolvimento.

Para manutenção explícita:

```bash
make art ARGS="down --retry=60"
make art ARGS="up"
```

O modo normal de manutenção usa a tela React publicada. `down --render` gera uma
resposta estática e não usa essa tela. Fila e scheduler são serviços independentes;
colocar a aplicação em manutenção não equivale a parar todos os processos.

## Backups, dados demonstrativos e banco

Consulte o [guia de backup](../../Docs/backup_spatie_docker_guia.md) para geração,
seleção de arquivos, confirmação e recuperação após falhas. O cliente de `make db`
usa a conexão Laravel e não coloca a senha na linha de comando.

`make seed` carrega dados demonstrativos; `make reset-db` apaga as tabelas e
carrega esses dados. Não são etapas do deploy. Ambos exigem confirmação digitando
o nome do banco e pausam os workers. O reset sincroniza permissões após recriar
as tabelas. Se uma etapa falhar, o fluxo não anuncia sucesso nem reabre a aplicação.

As migrations históricas foram reorganizadas em 2026-11-10. Não use `migrate:fresh`
para atualizar uma instalação com dados. O procedimento específico do backup de
2026-11-06 está [registrado separadamente](restaurar-backup-2026-11-06.md); não é
uma receita de instalação nova nem uma autorização para recriar produção.

## E-mails, fila e agendador

O envio usa fila persistente, configurada em `MAIL_QUEUE_CONNECTION` (padrão
`database`). Fila e scheduler precisam permanecer ativos para avisos, respostas,
rejeições do Gmail e backups automáticos. O teste de envio das Configurações é
síncrono para apresentar o diagnóstico imediato. SMTP aceito não comprova leitura
ou chegada à caixa de entrada.

As opções de e-mail, eventos automáticos, horários e retenção de backups e limites
de inatividade são gerenciadas na interface. Os valores `.env` fornecem os padrões
quando ainda não há configuração salva. Consulte [e-mails](../../Docs/notifications.md),
[sessões](../../Docs/authentication.md) e os [artigos de ajuda](../../resources/help/).

## Diagnóstico

- Código PHP antigo após `git pull`: execute `make deploy`, escolhendo o ambiente correto.
- Assets ausentes: confira o término do deploy e `public/build/manifest.json`.
- Erro de escrita: confira usuário dos containers e execute `make perm` no ambiente correto.
- Erro de banco: confira a conexão existente; mudar senhas no `.env` não as altera no MySQL.
- Avisos não processados: confira os serviços `queue` e `scheduler`, os logs e a configuração da fila.
- Falha de deploy ou restauração: preserve a mensagem de erro e confira os serviços
  antes de reabrir o sistema. Não há rollback automático do banco.

Use `make logs` ou `make logs-app`. Logs e backups podem conter dados internos;
não os publique junto do código. A homologação funcional é manual.
