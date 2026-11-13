.DEFAULT_GOAL := help

# Sem ENV, o assistente pergunta antes de executar. Valores explícitos servem para CI.
ENV ?=
export GNAI_ENV := $(ENV)
export GNAI_FILE := $(FILE)
export GNAI_TEST := $(TEST)
export GNAI_ARGS := $(ARGS)

COMMANDS := help up down down-v build logs logs-app art tinker scheduler perm make \
    composer storage-link cache-dev cache-prod migrate seed reset-db \
    permissions-sync permissions-prune create-admin reset-admin-password \
    npm-build npm-dev dev-assets build-assets test coverage db backup backup-db \
    list-bkp restore-db restore-full sync-public-build host-storage-link deploy app database

# Compatibilidade com make art migrate:status e make make create_example_table.
# Apenas esses dois comandos aceitam metas adicionais como argumentos.
ifneq (,$(filter art make,$(firstword $(MAKECMDGOALS))))
LEGACY_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
ifeq ($(strip $(ARGS)),)
export GNAI_ARGS := $(LEGACY_ARGS)
endif
.PHONY: $(MAKECMDGOALS)
$(firstword $(MAKECMDGOALS)):
	@sh docker/operations/run.sh $@
ifneq ($(strip $(LEGACY_ARGS)),)
$(LEGACY_ARGS):
	@:
endif
else
.PHONY: $(COMMANDS)
$(COMMANDS):
	@sh docker/operations/run.sh $@
endif
