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

Preencha também as configurações reais de e-mail (para o envio de links de
acesso e notificações) e de backup. Gere a `APP_KEY` do mesmo jeito que no
ambiente de desenvolvimento:

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

Depois de publicar (qualquer uma das duas opções):

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
curl -I https://gnai.example.edu.br
```

O `curl` deve responder `HTTP/1.1 200` (ou `HTTP/2 200`). Qualquer outra
coisa (502, 504, erro de conexão) indica que algo no meio do caminho não
subiu — comece verificando se o container `app` está com status `healthy`.

## Tarefas comuns depois que o sistema já está no ar

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
