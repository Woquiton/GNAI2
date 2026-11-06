# GNAI

Sistema de Gestão do Núcleo de Acessibilidade e Inclusão do IF Baiano —
Campus Guanambi. Ele reúne, em um só lugar, tudo que hoje seria feito em
planilhas e papel para acompanhar o apoio aos alunos com deficiência ou
necessidades específicas.

O sistema tem dois módulos principais:

- **Atendimento Educacional Especializado (AEE)** — cadastro de alunos,
  Estudo de Caso, PAEE, PEI (adaptações por disciplina), atendimentos do AEE
  e do pedagogo, e o feed de atividades do dashboard.
- **Radar Inclusivo** — mapa e controle de tecnologias assistivas, materiais
  pedagógicos acessíveis, empréstimos e barreiras de acessibilidade pelo
  campus.

Por baixo, é uma aplicação Laravel 12 (PHP 8.3) com MySQL 8, usando Docker
Compose para rodar tudo de forma isolada — tanto no computador de
desenvolvimento quanto no servidor de produção.

O frontend é React/TypeScript com Inertia e fica em `resources/js`.
Controllers de telas respondem com componentes React e props; os assets ficam
em `public/assets`. Os componentes reutilizáveis ficam em
`resources/js/components`. Consulte o [guia React](resources/js/README.md).

## O que você precisa ter instalado

- Git;
- Docker Engine;
- Docker Compose (o comando `docker compose`, sem hífen);
- Make (para usar os atalhos do `Makefile`);
- Apache 2 — **só é necessário se você for publicar o sistema usando o
  método "Apache + domínio próprio" descrito mais abaixo.** Se for usar
  Cloudflare Tunnel (o método usado hoje no servidor principal), o Apache
  não é necessário.

## Rodando o projeto no seu computador (desenvolvimento)

### 1. Criar o arquivo de configuração

Na raiz do projeto:

```bash
cp .env.example .env.dev
```

Esse arquivo guarda as configurações do seu ambiente local (senha do banco,
modo debug, etc.) e **não deve ser enviado para o Git** — cada pessoa tem o
seu.

Abra o `.env.dev` e confira principalmente estas linhas:

```env
APP_ENV=local
APP_KEY=base64:chave_gerada
APP_DEBUG=true
APP_URL=http://localhost

DB_HOST=db
DB_PORT=3306
DB_DATABASE=gnai_db
DB_USERNAME=gnai_user
DB_PASSWORD=troque_esta_senha
MYSQL_ROOT_PASSWORD=troque_esta_senha
```

O `APP_KEY` é a chave que o Laravel usa para criptografar sessões e dados
sensíveis — cada ambiente deve ter a sua. Gere uma nova com:

```bash
printf 'base64:%s\n' "$(openssl rand -base64 32)"
```

Copie a saída completa (incluindo o `base64:` do início) para `APP_KEY`.

### 2. Subir os containers

```bash
make build
make up
```

O primeiro comando constrói as imagens Docker (só precisa rodar de novo se
você mudar o `Dockerfile` ou dependências do PHP). O segundo sobe os
containers (aplicação, banco de dados, etc.).

Depois de subir, o sistema fica disponível em:

- aplicação: `http://localhost`;
- Vite (recarrega o navegador sozinho ao salvar um arquivo CSS/JS):
  `http://localhost:5173`;
- phpMyAdmin (opcional, para ver o banco pelo navegador): `http://localhost:8081`.

O phpMyAdmin não sobe junto por padrão — só quando você precisa dele:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml --profile tools up -d
```

As migrations (criação das tabelas) rodam sozinhas ao subir o ambiente. Para
popular o banco com dados de exemplo (alunos, profissionais etc. fictícios):

```bash
make seed
```

### 3. Comandos do dia a dia

```bash
make logs              # acompanhar os logs de todos os containers
make test               # rodar os testes automatizados
make art migrate:status # ver quais migrations já rodaram
make tinker              # abrir um console PHP interativo dentro do container
make down               # desligar os containers
```

`make art` é um atalho genérico: qualquer coisa que você escrever depois
dele vira um comando `artisan` dentro do container. Exemplo:
`make art route:list`.

### Problema comum: porta 80 ocupada

O Nginx de desenvolvimento usa a porta `80`. Se o Apache já estiver rodando
na sua máquina, pare-o antes:

```bash
sudo systemctl stop apache2
```

## Colocando o sistema no ar (produção)

Existem dois jeitos de publicar o GNAI. Escolha o que combina com a
infraestrutura disponível.

### Opção A — Cloudflare Tunnel (é o método usado hoje em produção)

Esse é o método usado no servidor atual (`gnai.guanambi.com.br`). Ele é
indicado quando o servidor **não tem IP público livre** ou a porta 80/443
já está ocupada por outro serviço no host. Em vez do Apache conversar
direto com a internet, um serviço chamado `cloudflared` cria um túnel
seguro até a Cloudflare, que entrega o HTTPS e redireciona o tráfego para
um Nginx que roda dentro de um container Docker.

Resumo da arquitetura:

```
Internet → Cloudflare (HTTPS) → cloudflared (no host) → Nginx (container, porta 8082) → PHP-FPM (container "app", porta 9000) → MySQL (container "db")
```

1. **Configurar o `.env.prod`** (mesma lógica do `.env.dev`, mas com dados
   reais de produção — ver seção "Preparar o `.env.prod`" abaixo).
2. **Instalar e configurar o `cloudflared`** no host, apontando o túnel para
   `http://localhost:8082` (a porta que o Nginx do container expõe). Essa
   parte é feita fora deste repositório, direto no painel da Cloudflare.
3. **Subir os containers**, incluindo o Nginx do túnel:

   ```bash
   docker compose --env-file .env.prod -f docker-compose.prod.yml -f docker-compose.tunnel.yml up -d --build
   ```

4. **Rodar as migrations** (primeira vez ou depois de puxar mudanças que
   alteram o banco):

   ```bash
   docker exec gnai-app-1 php artisan migrate --force
   ```

O arquivo `nginx/nginx.tunnel.conf` já vem pronto com as configurações
necessárias para esse cenário (cache de assets, bloqueio de arquivos
sensíveis como `.env` e `.git`, e os cabeçalhos que o Laravel precisa para
saber que a conexão chegou em HTTPS, mesmo o Nginx só enxergando HTTP puro
internamente).

### Opção B — Apache no próprio host, com domínio e certificado próprios

Esse método é indicado quando o servidor tem um domínio e certificado SSL
próprios, sem depender da Cloudflare. Aqui, o Apache instalado diretamente
no servidor recebe as requisições e repassa os arquivos PHP para o
PHP-FPM do container.

```
Internet → Apache (no host, HTTPS) → PHP-FPM (container "app", porta 9000) → MySQL (container "db")
```

#### 1. Preparar o `.env.prod`

```bash
cp .env.prod.example .env.prod
```

Configure ao menos:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://gnai.example.edu.br

DB_HOST=db
DB_PORT=3306
DB_DATABASE=gnai_db
DB_USERNAME=gnai_user
DB_PASSWORD=troque_esta_senha
MYSQL_ROOT_PASSWORD=troque_esta_senha
```

Preencha também as configurações reais de backup. O e-mail (usado no envio de
links de acesso e notificações) pode ser configurado pela interface, em
Configurações > E-mail; os valores `MAIL_*` do `.env` são usados somente
enquanto não houver configuração cadastrada. A senha de e-mail cadastrada é
criptografada com a `APP_KEY`: se ela mudar, cadastre a senha novamente.
Retenção e horários dos backups automáticos ficam em Configurações > Backups.
Gere a `APP_KEY` do mesmo jeito que no ambiente de desenvolvimento:

```bash
printf 'base64:%s\n' "$(openssl rand -base64 32)"
```

O `.env.prod` contém senhas e chaves reais — nunca deve ser enviado para o
Git nem compartilhado fora do time.

#### 2. Instalar e configurar o Apache

Em Debian ou Ubuntu:

```bash
sudo apt update
sudo apt install -y apache2
sudo a2enmod proxy proxy_fcgi setenvif rewrite headers
sudo systemctl enable --now apache2
```

Crie `/etc/apache2/sites-available/gnai.conf` trocando os valores de
exemplo (domínio, IP) pelos do servidor real:

```apache
<VirtualHost *:80>
    ServerName gnai.example.edu.br
    ServerAlias gnai.interno.example.edu.br 192.0.2.10
    ServerAdmin webmaster@localhost

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

Esse exemplo supõe que o HTTPS é encerrado por um proxy da instituição
antes de chegar ao Apache (por isso as variáveis `HTTPS`/`X-Forwarded-Proto`
são forçadas manualmente). Se o próprio Apache for cuidar do certificado,
habilite o módulo `ssl` e use um `VirtualHost *:443` com os caminhos do
certificado. Se o acesso for só HTTP (sem certificado nenhum), remova essas
variáveis de HTTPS e use uma `APP_URL` começando com `http://`.

Ative o site e confirme que não há erro de configuração:

```bash
sudo a2ensite gnai.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

O `apache2ctl configtest` deve responder `Syntax OK`.

#### 3. Publicar o sistema

Na raiz do projeto:

```bash
make deploy
```

Esse comando faz tudo de uma vez: constrói a imagem, publica os arquivos
estáticos (CSS/JS), cria o link de `storage` (pasta de uploads), sobe os
containers, roda as migrations pendentes e ajusta as permissões de
arquivo.

## Conferindo se deu certo

Na primeira implantação, crie o administrador superior do Gnai. Essa conta
administra as unidades e é a única que concede ou retira o acesso de
administrador interno; ela não aparece como membro da equipe:

```bash
make create-admin ENV=prod
```

Para redefinir a senha do administrador superior (a senha é solicitada de forma
oculta e não fica no histórico do terminal):

```bash
make reset-admin-password ENV=prod
```

Depois de publicar (qualquer uma das duas opções):

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
curl -I https://gnai.example.edu.br
```

O `curl` deve responder `HTTP/1.1 200` (ou `HTTP/2 200`). Qualquer outra
coisa (502, 504, erro de conexão) indica que algo no meio do caminho não
subiu — comece verificando se o container `app` está com status `healthy`.

## Tarefas comuns depois que o sistema já está no ar

### Processar rejeições de e-mail do Gmail

O Gnai pode ler os avisos técnicos de falha do Gmail por IMAP e atualizar o
histórico para **E-mail não entregue**. O aceite SMTP aparece como **Aceito pelo
servidor de envio** e não confirma a entrega ou leitura. O processamento não
reenvia a mensagem, não apaga avisos e não os marca como lidos.

1. Na conta remetente, use verificação em duas etapas e uma **senha de app**.
   A conta precisa permitir autenticação IMAP com essa senha. Em Google
   Workspace, confira as políticas com o administrador. Contas que exigem
   exclusivamente OAuth não são atendidas por esta integração.
2. Em **Sistema → Configurações → E-mail**, selecione **SMTP**, o servidor
   **Gmail / Google Workspace** e cadastre a conta remetente e sua chave de
   aplicativo. Na seção **Rejeições do Gmail**, marque **Monitorar rejeições do
   Gmail** e salve. A ativação vale para a instalação e respeita as permissões
   existentes das configurações. Não depende de variáveis extras no `.env`.
   A leitura usa a mesma conta e senha criptografada do envio.
3. A **Pasta dos avisos de rejeição** é **INBOX** por padrão. Mantenha os avisos
   nessa pasta ou cadastre a pasta IMAP usada pelos seus filtros. O servidor é fixo:
   `imap.gmail.com:993`, com TLS e validação de certificado.
4. Antes da ativação, reconstrua a imagem PHP e recrie os serviços conforme as instruções de
   atualização abaixo. O Dockerfile inclui a extensão IMAP; fora do Docker,
   instale essa extensão no PHP que executa o agendador. Recarregue também o
   cache de configuração caso seja usado no ambiente. A tela impede a ativação
   se o PHP da aplicação não tiver IMAP. O PHP do agendador também precisa dessa
   extensão. Depois da preparação, cada instalação configura o monitoramento
   pela interface, sem alterar arquivos do servidor.
5. Com o agendador ativo, a consulta ocorre a cada cinco minutos. Para executar
   uma consulta manual no ambiente, use `php artisan emails:process-gmail-bounces`.

Para desativar, desmarque **Monitorar rejeições do Gmail** e salve. Salvar as
configurações não testa a conexão IMAP. O botão **Enviar teste** verifica apenas
o envio SMTP; homologue a leitura com um aviso real e o comando acima.

O processamento consulta avisos estruturados `multipart/report` do subsistema de
entrega do Gmail, dos últimos 30 dias, em lotes de até 100 avisos por execução.
O cursor é separado por conta, pasta e UIDVALIDITY; perder o cache pode repetir
a leitura, mas não o envio. Apenas rejeições definitivas (`Action: failed`,
status `5.x.x`) são registradas. Avisos de atraso não são tratados como falha
definitiva. A associação exige o `Message-ID` original e o destinatário do
registro; mensagens sem essa correspondência são ignoradas. Isso também permite
associar avisos anteriores à integração quando o identificador já foi registrado.
O corpo original e o diagnóstico livre do aviso não são persistidos; somente o
código técnico da rejeição fica no histórico. Não é confirmação de entrega.

Na homologação manual, confira um envio válido e um endereço inexistente, espere
o retorno do Gmail e execute a consulta. O segundo registro deve passar para
**E-mail não entregue**, com o código da rejeição nos detalhes. Execute novamente
para conferir que o resultado se mantém e nenhum e-mail é reenviado. Na Central,
use **Atualizar** para consultar uma rejeição que chegou depois do aceite.

### Receber respostas aos e-mails do Gnai

Aplique também a migration `2026_11_04_190000_add_incoming_email_metadata`, que
acrescenta data de recebimento, vínculo com a mensagem anterior e índice de
Message-ID. Em **Configurações → E-mail → Respostas do Gmail**, ative
**Importar respostas do Gmail** e configure **Pasta das respostas recebidas**
(padrão `INBOX`). Não há novas credenciais ou variáveis de ambiente.

O agendador executa `emails:sync-gmail-replies` a cada minuto. O mesmo processamento
pode ser iniciado por **Buscar respostas** na Inbox. Usa IMAP somente para
leitura, com certificados verificados, e considera os últimos 30 dias, em lotes
de até 50 candidatos. Só persiste respostas cujos cabeçalhos In-Reply-To ou
References correspondam a envios rastreados do Gnai; não usa assunto como chave.
Respostas diretas a avisos de autenticação são ignoradas para preservar links pessoais.
O cursor é separado por conta, pasta e UIDVALIDITY; a chave de deduplicação por
conta e Message-ID evita repetir importações caso o cursor seja perdido.

Corpo e anexos são processados com limites em `config/email_inbox.php`. HTML
recebido é sanitizado, imagens remotas não são carregadas, e anexos ficam no
disco privado. Conteúdo omitido por limite gera aviso na leitura. Favoritos,
marcadores e leitura continuam individuais no Gnai. As pastas podem ser
sincronizadas conforme a opção abaixo. Homologue com uma resposta real a um envio rastreado, confira o
vínculo com a mensagem original, repita a busca para verificar deduplicação e
confira que a resposta enviada pelo Gnai se destina ao remetente correto.

### Sincronizar pastas com o Gmail

A migration `2026_11_04_200000_add_gmail_folder_sync_to_email_deliveries` acrescenta
o vínculo por conta e X-GM-MSGID, a pasta compartilhada e a data da última consulta.
Ative **Sincronizar pastas com o Gmail** em **Configurações → E-mail → Pastas do Gmail**.
A opção é por instalação, inicialmente desativada, e independe do recebimento de
respostas e do monitoramento de rejeições.

`GmailImapClient` usa PHP cURL com suporte a `imaps`, TLS e certificado verificado,
com host fixo `imap.gmail.com:993` e as mesmas credenciais do SMTP. Isso permite
usar os comandos IMAP4 que a pesquisa IMAP2 da extensão PHP não expõe. Não requer
OAuth, dependências Composer adicionais ou novas credenciais. Pastas são
descobertas por Special-Use, sem nomes traduzidos fixos. A associação começa pelo
Message-ID e passa a usar X-GM-MSGID, estável entre pastas. Consulte as
[extensões oficiais do Gmail](https://developers.google.com/workspace/gmail/imap/imap-extensions).

Spam, Lixeira, Arquivar e Restaurar alteram somente marcadores de pasta da mensagem
selecionada, preservando seus outros marcadores. Não há EXPUNGE ou exclusão
definitiva. O estado local compartilhado só muda após a confirmação remota.
A conferência combina os marcadores retornados e a presença na pasta selecionada,
pois o Gmail pode omitir de X-GM-LABELS o marcador dessa própria pasta. Essa presença
também é considerada ao remover Spam ou Lixeira para arquivar ou restaurar.
`email.send`, além de `email.view`, é exigida para essas ações quando a integração
está ativa. Estrelas, leitura e marcadores pessoais não são enviados ao Gmail.
Mensagens sem envio real continuam locais; mensagens rastreadas não encontradas
no Gmail geram falha na ação. Lotes podem terminar parcialmente e informam seus
resultados sem anunciar conclusão integral.

O comando `emails:sync-gmail-folders`, agendado a cada minuto, consulta até 20
registros por lote, com prioridade para os consultados há mais tempo. O botão
**Sincronizar pastas** executa a mesma consulta. A consulta só lê metadados de
mensagens já registradas, inclusive em Todas as mensagens, Spam e Lixeira. Não
reaplica organização pessoal antiga ao Gmail nem remove o histórico caso uma
mensagem tenha sido apagada externamente. Mensagens de contas anteriores não são
alteradas na conta atual. Homologue Spam, Lixeira, Arquivar e Restaurar nos dois
sentidos e confira os resultados de falha e os efeitos em outro usuário da instalação.

### Etiquetas por módulo e marcadores da Inbox

A migration `2026_11_04_210000_add_tag_modules_and_inbox_markers` adiciona módulo
e cor ao cadastro existente de etiquetas. As etiquetas anteriores permanecem em
Publicações; a unicidade do nome passa a valer por módulo. Inbox ganha as etiquetas
Importante, Trabalho e Pessoal, também incluídas no seeder para novas instalações.
Os antigos valores de `email_mailbox_states.label` são convertidos para `tag_id`,
com chave estrangeira que remove somente o vínculo ao excluir uma etiqueta.

O cadastro permite selecionar Publicações ou Inbox, situação e cor hexadecimal pela
paleta Ubold local. Etiquetas em uso não podem trocar de módulo. Publicações validam
e listam somente etiquetas do seu módulo. A Inbox usa as etiquetas ativas do módulo
Inbox na aplicação de marcadores; etiquetas inativas já aplicadas permanecem
consultáveis e removíveis. Nome e cor vêm do cadastro, sem enum de marcadores fixos.
Os marcadores permanecem pessoais no Gnai e não são enviados como rótulos ao Gmail.

`Forms/ColorPicker` encapsula o plugin existente, com digitação hexadecimal,
desabilitação, associação de erros, fechamento por Escape e limpeza ao desmontar.
Se a paleta não carregar, oferece o seletor nativo. Não importa CSS de Bootstrap
global nem componentes do catálogo. Homologue cadastro, edição, inativação,
unicidade por módulo, aplicação e filtro dos marcadores e preservação dos vínculos.

### Operações de manutenção

Após atualizar para a Inbox com escrita e organização de e-mails, aplique as
migrations e sincronize o catálogo de permissões no PHP do ambiente:

```bash
php artisan migrate --force
php artisan permissions:sync
```

A tabela `email_mailbox_states` guarda a organização individual por operador.
Os rascunhos usam o registro de e-mail existente e são privados ao autor.
Conceda `email.send`, além de `email.view`, aos perfis autorizados a escrever e
enviar. Os anexos são armazenados no disco privado `local`; downloads exigem
autenticação e a mesma autorização da mensagem. O agendador e o worker de fila
continuam necessários. Homologue escrita, rascunho, cópias/Cco, anexos, resposta,
encaminhamento, ações em lote e restauração da lixeira.

Estas são as operações mais usadas no dia a dia, depois do primeiro deploy:

**Aplicar uma mudança de código** (depois de atualizar os arquivos no
servidor):

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml [-f docker-compose.tunnel.yml] build app
docker compose --env-file .env.prod -f docker-compose.prod.yml [-f docker-compose.tunnel.yml] up -d --force-recreate app scheduler queue
```

(inclua `-f docker-compose.tunnel.yml` só se o servidor usar a Opção A —
Cloudflare Tunnel.)

**Rodar uma migration nova** (depois de atualizar o código):

```bash
docker exec gnai-app-1 php artisan migrate --force
```

**Limpar o cache de telas**, quando uma mudança visual não aparece:

```bash
docker exec gnai-app-1 php artisan view:clear
```

**Ver os logs em tempo real**, para investigar um erro:

```bash
make logs-app ENV=prod
```

**Ativar a tela de manutenção**:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec app php artisan down --retry=60
```

O Gnai mostra a tela de manutenção baseada no Ubold, com o ícone de engrenagem,
sem a navegação da área autenticada. A resposta mantém o status HTTP 503 e o
prazo `Retry-After`. Outras indisponibilidades 503 continuam usando a tela de erro.
A página não consulta usuário, navegação ou dados de negócio.

Para reabrir o sistema:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec app php artisan up
```

Essa integração usa o modo normal de manutenção, com os assets React publicados.
A opção `down --render` gera uma resposta estática antes de carregar a aplicação
e não usa a tela React.

**Depois de mudar a configuração do Apache** (só na Opção B), sempre valide
antes de recarregar:

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

Todos os domínios, IPs e caminhos de exemplo deste README são fictícios.
Substitua pelos valores reais do seu ambiente e nunca publique senhas,
chaves ou endereços internos em repositórios públicos.

## Bloqueio e encerramento por inatividade

Os limites são gerenciados em **Sistema → Configurações → Segurança e sessões**,
em minutos, com as permissões existentes de consulta e alteração de configurações.
Os valores salvos na tabela de configurações prevalecem sobre o `.env` e alcançam
as sessões abertas na próxima verificação. Enquanto nada for salvo, o `.env`
fornece os valores iniciais:

```env
SESSION_LOCK_AFTER=15
SESSION_LOGOUT_AFTER=60
```

O primeiro limite bloqueia a tela de contas com senha própria; o segundo encerra
completamente a sessão, contado desde a última atividade, inclusive enquanto a
tela está bloqueada. O formulário exige encerramento maior que o bloqueio. Os valores iniciais
inválidos do ambiente são ajustados para um minuto acima do bloqueio. O middleware
de configurações garante que o tempo de vida da sessão Laravel seja pelo menos
o prazo de encerramento salvo, antes de a sessão ser carregada.
Depois de alterar as variáveis, atualize o cache de configuração se ele estiver em uso.

Requisições automáticas não contam como atividade. O estado é compartilhado entre
as abas da mesma sessão, usando o cache Laravel e seus locks atômicos. Use um
cache persistente e compartilhado pelos processos da aplicação, como o `database`
já configurado no projeto. Limpar esse cache encerra as sessões no próximo acesso,
para impedir que a perda do estado remova um bloqueio. A tela bloqueada exige a
senha para retomar o acesso.
Professores que só acessam por link não passam pela tela de senha, mas também são
desconectados por inatividade e precisam solicitar outro link. O acesso por link
não mantém mais um cookie de login permanente.

A migration `2026_11_03_150000_add_password_configured_to_users.php` registra se
uma conta de professor tem senha própria. Para contas antigas, não é possível
inferir isso pelo hash, pois o acesso por link também gerava uma senha aleatória.
Um login bem-sucedido com senha, a definição no perfil ou a redefinição de senha
confirma essa condição. Cadastros novos com senha também são identificados.
Sessões antigas passam a contar a inatividade a partir do primeiro acesso após
a atualização. Durante a personificação, aplica-se o encerramento automático;
o bloqueio por senha fica disponível ao retornar à própria conta.

## Motor compartilhado de e-mails transacionais

Os módulos usam `Notifications/Application/Actions/Email/QueueEmailAction` com um
`EmailMessageDTO`: destinatário, assunto, views, dados e vínculo com a operação.
O motor registra a solicitação em `email_deliveries` depois do commit e só então
enfileira `SendEmailDelivery`. Uma chave de deduplicação fornecida pelo módulo
impede repetir o mesmo aviso. Destinatário e conteúdo são criptografados no banco.

O empréstimo, a confirmação de devolução para alunos, a confirmação de entrada
na fila de espera e o aviso de disponibilidade da fila já consomem esse motor. A inscrição e a disponibilidade
usam finalidades e chaves de deduplicação diferentes, preservando os dois avisos.
O modelo visual `emails.notifications.summary` segue o `billing.html` do
Ubold e pode ser usado pelos demais módulos. O motor também aceita outras views.
Falhas de preparação, enfileiramento ou envio não revertem a operação de origem.

Os avisos de agendamento (criação, atualização, cancelamento e exclusão), o link
de acesso do professor e a recuperação de senha também usam esse motor e a fila.
Os agendamentos guardam os destinatários e o conteúdo do aviso, sem depender de
consultar o registro durante o envio. Pedidos diferentes de acesso ou mudanças
no agendamento geram avisos próprios; as tentativas do mesmo aviso reutilizam o
registro central. Validade, uso único e limitação de pedidos dos links continuam
sob as regras de autenticação.

Esses fluxos e o teste de Configurações usam `emails.notifications.alert` e sua
versão de texto, baseados no `alert.html` do Ubold: cabeçalho grafite, card branco
e botão de ação opcional no roxo institucional `#322b75`. Sessões mantêm seus
detalhes e os e-mails de autenticação incluem o endereço alternativo do botão.
As classes e views específicas substituídas foram removidas. O histórico antigo
em `sent_emails` não recebe novas gravações nem é usado como confirmação de envio.

O teste de Configurações usa `SendEmailNowAction`: registra por
`RegisterEmailAction` e executa o mesmo `SendEmailAction` da fila, de forma
síncrona, para preservar o diagnóstico imediato, o modo de log e os erros de SMTP.
Os demais consumidores usam `QueueEmailAction`, que compartilha esse registro.

### Parâmetros de envio automático e conexão da fila

Em **Configurações → E-mails automáticos** (`/configuracoes/emails-automaticos`),
quem possui `setting.update` escolhe os eventos que geram avisos para todas as
próximas operações. A leitura exige `setting.view`. Os valores ficam na categoria
`automatic_emails` da tabela `settings`, sem nova migration. Criação, atualização,
cancelamento e exclusão de agendamentos começam desativados; confirmações de
empréstimo/devolução e inscrição/disponibilidade na fila de espera mantêm o padrão
ativado. Os campos `send_notification` foram removidos dos contratos de agendamentos.

`EmailQueueHandler` consulta o parâmetro depois do commit, antes de registrar a
mensagem. Eventos desativados não criam entrega. A configuração vale no momento
da preparação; mudanças não cancelam jobs existentes nem geram avisos retroativos.
Recuperação de senha, acesso do professor, mensagens manuais e o teste de envio
não dependem desses parâmetros. As restrições de destinatários e de datas dos
módulos continuam valendo.

`SendEmailDelivery` usa `queue.email_connection`, definido por
`MAIL_QUEUE_CONNECTION=database` por padrão, independentemente de `QUEUE_CONNECTION`.
São aceitos os drivers persistentes `database`, `redis`, `beanstalkd` e `sqs`.
Conexões síncronas, descartáveis ou com fallback para execução local são rejeitadas;
a falha é rastreada sem executar SMTP na requisição e sem reverter a operação.
Os Compose de desenvolvimento e produção já possuem o serviço `queue`; seu
entrypoint consome essa mesma conexão. Em instalações fora do Compose, use
`php artisan queue:work database --sleep=3 --tries=3` ou substitua `database` pela
conexão configurada em `MAIL_QUEUE_CONNECTION`. Após publicar, atualize o cache
de configuração em uso e reinicie o worker. O teste de envio das Configurações
continua síncrono para apresentar o diagnóstico imediato.

Aplique a migration `2026_11_03_170000_create_email_deliveries_table.php` e mantenha
o worker da fila atualizado após publicar mudanças no código. Não é necessário
adicionar colunas de e-mail em cada tabela de negócio. Os estados, tentativas,
última tentativa, identificação da mensagem e aceite pelo serviço ficam no
registro central. SMTP aceito não significa mensagem lida ou entregue na caixa
de entrada; o modo de registro em log não é classificado como envio real.

O resultado do transporte também é guardado temporariamente em
`storage/app/private/email-delivery-receipts`, sem destinatário nem conteúdo.
Se a atualização final no banco falhar, a tarefa agendada
`email-deliveries:recover-results` recupera o resultado a cada minuto, sem reenviar
a mensagem. Mantenha o agendador Laravel ativo e esse diretório persistente;
em instalações com vários servidores, o worker e o agendador precisam acessar
o mesmo volume. O comprovante é removido depois da gravação no banco.
Processamentos interrompidos por mais de cinco minutos sem comprovante recebem
o estado `unconfirmed`, sem reenvio automático nem consulta periódica permanente.

Envios anteriores sem rastreamento continuam sem registro; o sistema não presume
que foram enviados nem os reenvia automaticamente. A ausência da estrutura de
rastreamento é registrada nos logs e impede um novo envio sem registro.

Os indicadores das listagens reutilizam `UI/EmailDeliveryIndicator` e o hook
`useEmailDeliveryPolling`. Empréstimos e fila de espera usam uma primeira coluna
sem título visual, preservando o nome acessível, com os metadados fornecidos pelo
`EmailDeliveryPresenter` comum. A consulta periódica funciona apenas enquanto as
linhas exibidas têm confirmações pendentes e recarrega somente a coleção da tela.
A atualização usa o transporte comum `useTableListVisit`, preserva filtros e
paginação e é suspensa enquanto a aba está oculta ou uma visita do usuário está
em andamento. Uma nova visita cancela a consulta em segundo plano.

## Inbox

O módulo em `/emails` reúne os registros reais de `email_deliveries`, com a
composição do Inbox do Ubold: pastas, listagem, leitura em conversa e composição
de mensagens. O menu fica em **Sistema → Inbox**. As rotas de consulta exigem `auth` e
`can:email.view`; administradores têm acesso pelo mecanismo existente de Gates.
Para delegar a consulta a um cargo, sincronize as permissões e conceda
**Visualizar Central de E-mails** no cadastro de cargos:

```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml exec app php artisan permissions:sync
```

Em produção, use `.env.prod` e `docker-compose.prod.yml`. A migration
`2026_11_04_010000_add_email_delivery_history_indexes.php` acrescenta índices para
as consultas por data, status e origem, sem alterar os registros do histórico.

O módulo permite pesquisar assunto e filtrar origem, status e período de
registro, com contagens por status e paginação. O destinatário é descriptografado
somente nos registros exibidos; a busca por assunto não consulta os campos
criptografados do destinatário. As listagens não carregam o payload da mensagem.
A visualização retorna somente os campos de conteúdo necessários à leitura,
sem URLs de autenticação, tokens, payload bruto ou detalhes técnicos de exceções.
Os registros pendentes são atualizados pelo transporte compartilhado de listagens;
a Inbox também consulta novas respostas periodicamente. Cada mensagem ocupa uma
linha e a leitura reúne seu fio, posicionando a página na mensagem selecionada.
Com `email.send`, o módulo permite escrever, salvar rascunhos, responder e
encaminhar, com destinatários, cópias, cópias ocultas e anexos privados.
A organização inclui favoritos, leitura, marcadores e pastas, com a integração
opcional ao Gmail descrita acima. Não há exclusão definitiva nem reenvio automático
de mensagens sem confirmação. O artigo da Central de Ajuda fica em
`resources/help/central-de-emails.md`.

As Actions coordenam as operações; Data e Rules validam as entradas, Policies
verificam o acesso e Handlers tratam os anexos. Operações da caixa usam enum,
resultados usam DTO e Presenters preparam conteúdo e mensagens para a interface.
Os adaptadores IMAP e o armazenamento privado ficam em Infrastructure.

## Listagem e catálogo de itens

Em `/itens`, os modos **Listagem** e **Catálogo** usam o mesmo paginador,
os filtros e as permissões existentes. O catálogo segue a composição dos produtos
do Ubold, com animação de entrada e reposicionamento dos cards e respeito a
`prefers-reduced-motion`. A tabela permanece montada ao alternar os modos.
O seletor usa `UI/SegmentedControl`, compartilhado com a prévia Computador/Celular
do builder e com a visualização Formatado/Log técnico da auditoria.
O modo escolhido é salvo em `user_table_preferences.settings.view_mode`, na chave
da rota e para o usuário autenticado, pelo mesmo mecanismo de colunas e tamanho
de página. O endpoint `PUT /autenticacao/preferencias/tabelas/visualizacao` aceita
`list` ou `catalog`. A escolha volta em `tablePreferences.viewMode`, inclusive em
outros navegadores e sessões; durante personificação, vale só para a visita. A
gravação mescla as configurações sob bloqueio para preservar alterações paralelas.
O catálogo reutiliza o Isotope original do tema, com transições de 750 ms ao
filtrar pelo campo Tipo da barra principal (`item_type`), preservando a busca,
os demais critérios e a paginação do servidor. Cards ocultos
saem do foco e da árvore de acessibilidade. O carregamento respeita as capas com
`loading="lazy"`, sem esperar imagens fora da área visível para iniciar o layout.
A instância do Isotope é mantida durante as respostas dos filtros: os cards
existentes conservam seus modelos e transições, enquanto novos cards entram pelo
próprio plugin. O layout acompanha a largura do container com `ResizeObserver`.
O tipo aplicado à animação acompanha o resultado do servidor, sem esconder os
cards da página anterior enquanto o filtro ainda aguarda a resposta. O catálogo
usa lotes de 12, 24, 48 ou 96 registros, por `TableListFooter.pageSizeOptions`,
para preencher linhas nas páginas completas. Esses tamanhos são aceitos e salvos
pelo mesmo mecanismo de preferências; as opções padrão das tabelas são mantidas.
O tutorial compõe os passos compartilhados da tabela com os do catálogo e usa
uma ponte para alternar apenas a visão local. As ações do card ficam visíveis no
seu destaque; sair do passo restaura a visão escolhida, sem gravar preferências
ou recarregar a quantidade por página durante a demonstração.

A migration `2026_11_04_020000_add_cover_evidence_to_items.php` acrescenta
`items.cover_evidence_id`, uma referência opcional à imagem favorita de uma
vistoria. A seleção requer `item.update` e `item.inspection.show`, valida o vínculo
da evidência com o item e usa transação, bloqueio e conferência da capa anterior.
`SetItemCoverAction` coordena os bloqueios e a persistência; `Item::setCover`
concentra as regras de vínculo, formato de imagem e conferência da capa anterior.
A troca passa pela auditoria existente e a confirmação mostra as duas imagens.
Nas vistorias, a escolha fica na estrela sobre cada imagem do Owl, sem outra
grade de miniaturas. `OwlCarousel.onAction` encaminha os cliques dos slides
montados pelo plugin, e preserva a posição ao atualizar a favorita. Com seleção
habilitada, não há rotação automática nem clones de slides interativos.
Todos que podem consultar a listagem podem ver a capa, conforme regra do módulo;
as demais evidências mantêm suas permissões. Sem favorita, a consulta usa a
primeira imagem da vistoria mais recente com fotos. O carregamento é adiantado e
limitado por item, sem enviar os dados das vistorias na listagem.
