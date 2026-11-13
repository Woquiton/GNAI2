#!/bin/sh
set -eu

command_name=${1:-help}
if [ "$command_name" = help ]; then
    cat <<'HELP'
Gnai — escolha o ambiente em cada comando (ou informe ENV=dev / ENV=prod).

Aplicação:  up down build deploy app database logs logs-app
Serviços:   scheduler perm storage-link composer cache-dev cache-prod
Banco:      db migrate seed reset-db
Backups:    backup backup-db list-bkp restore-db restore-full
Acesso:     create-admin reset-admin-password permissions-sync permissions-prune
Frontend:   npm-build npm-dev build-assets dev-assets
PHP:        art ARGS="migrate:status" | tinker | make ARGS="create_example_table"
Verificação (somente quando solicitada): test TEST=caminho | coverage TEST=caminho
Destrutivo: down-v (apaga volumes), reset-db (apaga tabelas e carrega exemplos)

Restauração: FILE=caminho opcional; sem FILE, o assistente lista os backups.
Nenhum comando desconhecido é ignorado. Cancelar não executa a operação.
HELP
    exit 0
fi

environment=${GNAI_ENV:-}
if [ -z "$environment" ]; then
    if [ ! -t 0 ]; then
        echo 'Sem terminal interativo. Informe ENV=dev ou ENV=prod.' >&2
        exit 1
    fi
    printf 'Ambiente: 1) Desenvolvimento  2) Produção  [1]: '
    read -r environment
    case "$environment" in
        ''|1|dev) environment=dev ;;
        2|prod) environment=prod ;;
        *) echo 'Ambiente inválido.' >&2; exit 1 ;;
    esac
fi
case "$environment" in dev|prod) ;; *) echo 'Use ENV=dev ou ENV=prod.' >&2; exit 1 ;; esac
printf 'Ambiente selecionado: %s\n' "$environment"
env_file=".env.$environment"
compose_file="docker-compose.$environment.yml"
image="gnai-php:$environment"

compose() { docker compose --env-file "$env_file" -f "$compose_file" "$@"; }
artisan() { compose exec app php artisan "$@"; }
confirm() {
    if [ ! -t 0 ]; then
        echo 'Esta operação exige confirmação em terminal interativo.' >&2
        exit 1
    fi
    printf '%s [%s]. Digite sim para continuar: ' "$1" "$environment"
    read -r answer
    if [ "$answer" != sim ]; then echo 'Cancelado.'; exit 0; fi
}
ensure_env() {
    if [ ! -f "$env_file" ]; then
        case "$environment" in prod) template=.env.prod.example ;; dev) template=.env.example ;; esac
        (umask 077; cp "$template" "$env_file")
        printf '%s criado. Preencha as configurações antes de publicar.\n' "$env_file"
    fi
}
need_env() {
    if [ ! -f "$env_file" ]; then echo "Configure $env_file primeiro (make app ou make database)." >&2; exit 1; fi
}
link_storage() {
    if [ -L public/storage ] || [ ! -e public/storage ]; then
        ln -sfn ../storage/app/public public/storage
    else
        echo 'public/storage existe e não é um link. Preserve seu conteúdo antes de substituir.' >&2
        exit 1
    fi
}
sync_assets() {
    asset_container=$(docker create "$image")
    asset_stage=
    trap 'docker rm "$asset_container" >/dev/null; if [ -n "$asset_stage" ] && [ -d "$asset_stage" ]; then rm -rf "$asset_stage"; fi' EXIT HUP INT TERM
    # Copia antes de substituir a versão publicada, sem anunciar sucesso se docker cp falhar.
    asset_stage=$(mktemp -d public/.build-XXXXXX)
    if ! docker cp "$asset_container:/var/www/public/build/." "$asset_stage/"; then
        rmdir "$asset_stage" 2>/dev/null || true
        exit 1
    fi
    chmod -R u+rwX,go+rX "$asset_stage"
    rm -rf public/build
    mv "$asset_stage" public/build
    docker rm "$asset_container" >/dev/null
    trap - EXIT HUP INT TERM
}
prepare_key() {
    chmod 600 "$env_file"
    docker run --rm --user "$(id -u):$(id -g)" \
        -v "$(pwd)/$env_file:/deploy/environment" \
        -v "$(pwd)/docker/deploy/prepare-environment.php:/deploy/prepare.php:ro" \
        "$image" php /deploy/prepare.php "$environment"
}
deploy() {
    compose build app
    prepare_key
    compose up -d --wait db
    compose stop app queue scheduler
    compose run --rm --no-deps app sh /var/www/docker/php/entrypoint.sh deploy
    if [ "$environment" = prod ]; then sync_assets; fi
    link_storage
    compose up -d --wait app queue scheduler
    echo 'Deploy concluído. No primeiro ambiente, use make create-admin.'
}
configure() {
    ensure_env
    chmod 600 "$env_file"
    compose build app
    set +e
    compose run --rm --no-deps --user "$(id -u):$(id -g)" \
        -v "$(pwd)/$env_file:/deploy/environment" \
        -v "$(pwd)/docker/deploy/configure-environment.php:/deploy/configure.php:ro" \
        --entrypoint php app /deploy/configure.php "$command_name" "$environment"
    configure_status=$?
    set -e
    case "$configure_status" in 0) deploy ;; 2) exit 0 ;; *) exit "$configure_status" ;; esac
}
restore() {
    case "$command_name" in
        seed) confirm 'Carregar dados demonstrativos no banco selecionado' ;;
        reset-db) confirm 'Apagar todas as tabelas e carregar dados demonstrativos no banco selecionado' ;;
        *) confirm 'Restaurar backup e sobrescrever dados? Haverá indisponibilidade' ;;
    esac
    # O comando Artisan valida e pede confirmação do arquivo antes de alterar dados.
    # Só são reiniciados os workers que estavam em execução.
    workers=$(compose ps --services --status running | sed -n '/^queue$/p; /^scheduler$/p')
    for worker in $workers; do compose stop "$worker"; done
    set +e
    if [ -n "${GNAI_FILE:-}" ] && [ "$command_name" != seed ] && [ "$command_name" != reset-db ]; then
        if [ ! -f "$GNAI_FILE" ]; then
            echo 'FILE deve apontar para um arquivo existente no host.' >&2
            restore_status=2
        else
            restore_source=$(cd "$(dirname "$GNAI_FILE")" && pwd)/$(basename "$GNAI_FILE")
            compose run --rm --no-deps --entrypoint php \
                -v "$restore_source:/operations/input:ro" app artisan "$@" --file=/operations/input
            restore_status=$?
        fi
    else
        artisan "$@"
        restore_status=$?
    fi
    set -e
    if [ "$restore_status" -eq 0 ] || [ "$restore_status" -eq 2 ]; then
        for worker in $workers; do compose up -d "$worker"; done
        [ "$restore_status" -ne 2 ] || echo 'Operação cancelada antes da alteração dos dados.'
    else
        echo 'Operação falhou. Workers permanecem parados; confira o erro e o estado do banco antes de retomar.' >&2
        exit "$restore_status"
    fi
}

case "$command_name" in
    app|database) configure; exit 0 ;;
    deploy) ensure_env; deploy; exit 0 ;;
esac
need_env
case "$command_name" in
    up) compose up -d --wait ;;
    down) compose down ;;
    down-v) confirm 'Apagar os volumes deste ambiente, incluindo o banco'; compose down -v ;;
    build) compose build app ;;
    logs) compose logs -f ;;
    logs-app) compose logs app -f --tail=50 ;;
    scheduler) compose up -d scheduler ;;
    perm)
        compose run --rm --no-deps --user root --entrypoint sh app -ec \
            'mkdir -p storage/app/public storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache; chown -R "$(id -u www-data):$(id -g www-data)" storage bootstrap/cache; chmod -R ug+rwX storage bootstrap/cache'
        ;;
    composer)
        if [ "$environment" = prod ]; then deploy
        else compose exec app composer install; compose restart app queue scheduler; fi
        ;;
    storage-link)
        artisan storage:link
        if [ "$environment" = prod ]; then link_storage; fi
        ;;
    host-storage-link) link_storage ;;
    cache-dev)
        if [ "$environment" != dev ]; then echo 'Use make cache-prod para produção.' >&2; exit 1; fi
        artisan config:clear; artisan route:clear; artisan view:clear; artisan cache:clear
        ;;
    cache-prod)
        if [ "$environment" != prod ]; then echo 'Use make cache-dev para desenvolvimento.' >&2; exit 1; fi
        artisan config:cache; artisan route:cache; artisan view:cache
        compose restart app queue scheduler
        ;;
    migrate)
        if [ "$environment" = prod ]; then confirm 'Aplicar migrations pendentes em produção'; fi
        artisan migrate --force
        ;;
    seed) restore database:maintain seed ;;
    reset-db) restore database:maintain reset ;;
    permissions-prune) confirm 'Remover permissões que não aparecem mais no código'; artisan permissions:sync --prune ;;
    permissions-sync) artisan permissions:sync ;;
    create-admin) artisan auth:create-admin ;;
    reset-admin-password) artisan auth:reset-admin-password ;;
    npm-build|build-assets)
        if [ "$environment" = prod ]; then deploy
        else compose run --rm --no-deps --entrypoint sh node -ec 'npm ci --no-audit --no-fund; npm run build'; fi
        ;;
    npm-dev|dev-assets)
        if [ "$environment" != dev ]; then echo 'O servidor Vite é exclusivo de desenvolvimento.' >&2; exit 1; fi
        compose up -d node
        ;;
    sync-public-build)
        if [ "$environment" != prod ]; then echo 'A publicação de assets da imagem é exclusiva de produção.' >&2; exit 1; fi
        sync_assets
        ;;
    db) artisan database:maintain console ;;
    backup) artisan backup:automatic ;;
    backup-db) artisan database:maintain dump ;;
    list-bkp) artisan backup:list ;;
    restore-db) restore database:maintain restore ;;
    restore-full) restore backup:restore ;;
    tinker) artisan tinker ;;
    art|make)
        if [ -z "${GNAI_ARGS:-}" ]; then echo 'Informe ARGS (ex.: make art ARGS="migrate:status").' >&2; exit 1; fi
        # Expansão intencional em palavras, sem eval ou execução de substituições.
        set -f
        set -- $GNAI_ARGS
        if [ "$command_name" = make ]; then artisan make:migration "$@"; else artisan "$@"; fi
        ;;
    test|coverage)
        if [ "$environment" != dev ]; then echo 'Verificações são exclusivas de desenvolvimento.' >&2; exit 1; fi
        set -- test
        if [ "$command_name" = coverage ]; then set -- "$@" --coverage; fi
        if [ -n "${GNAI_TEST:-}" ]; then set -- "$@" "$GNAI_TEST"; else set -- "$@" --testsuite=Unit,Domains,Feature; fi
        if [ "$command_name" = coverage ]; then compose exec -e XDEBUG_MODE=coverage app php artisan "$@"; else artisan "$@"; fi
        ;;
    *) echo "Comando desconhecido: $command_name" >&2; exit 1 ;;
esac
