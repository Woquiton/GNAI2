# Backup e restauração em Docker

O Gnai usa Spatie Laravel Backup por meio das Actions de negócio. O Dockerfile
já instala o cliente MySQL e a extensão ZIP; não é necessário instalar pacotes
manualmente em um container em execução. O [guia de operação](../docs/operations/README.md)
descreve ambiente, deploy, usuários e persistência.

## Gerar e listar

```bash
make backup
make backup-db
make list-bkp
```

Escolha desenvolvimento ou produção no menu. Para seleção explícita, `ENV=dev`
ou `ENV=prod` continua aceito. `make backup` chama `backup:automatic`, que usa
`GenerateBackupAction`: gera o ZIP, registra o backup no banco e aplica a retenção
definida em **Sistema → Configurações → Backups**. O responsável no terminal é
**Sistema**. Não substitua esse fluxo por `backup:run` ao querer manter o catálogo
do Gnai atualizado.

O ZIP inclui o banco e `storage/app`, excluindo diretórios de trabalho e a própria
pasta dos backups. O disco `local` tem raiz em `storage/app/private`; o diretório
padrão é `storage/app/private/GNAIbackups`, conforme `BACKUP_DISK_NAME`.
O `.env`, a `APP_KEY` e o código não estão incluídos. Preserve-os separadamente.

`make backup-db` produz somente SQL, em
`storage/app/private/<BACKUP_DISK_NAME>/db/`. Não cria um registro de backup
completo. O dump é escrito em arquivo parcial privado e só recebe o nome final
após sucesso, sem ignorar o código de saída do MySQL.

`make list-bkp` usa a listagem de arquivos do Spatie. Para conferir o catálogo
de registros, consulte também **Sistema → Backups**.

## Configurações

- `BACKUP_DISK_NAME`: nome da pasta de arquivos no disco privado.
- `BACKUP_MYSQL_BINARY_PATH`: caminho dos binários MySQL; `/usr/bin` na imagem.
- `BACKUP_MYSQL_EXTRA_OPTIONS`: opções usadas pela infraestrutura de backup.
- `BACKUP_ARCHIVE_PASSWORD`: senha opcional dos ZIPs, que deve ser preservada
  junto da cópia correspondente para uma restauração posterior.
- Horários e retenção: configuração pela interface, não por alteração manual
  de rotinas de agendamento. O scheduler precisa permanecer ativo.

Após alterar a infraestrutura ou o ambiente em produção, publique com
`make deploy`. Depois de atualizar os arquivos do projeto, esse comando também
inclui os comandos Artisan de manutenção usados pelos assistentes abaixo.

## Restaurar SQL

```bash
make restore-db
make restore-db FILE="/caminho/backup.sql"
```

Sem `FILE`, o assistente lista os SQLs na pasta privada de backups. Com `FILE`, o
arquivo do host é montado somente para leitura em um container temporário.
Confira o ambiente e a confirmação do banco de destino antes de prosseguir.
O arquivo deve ser compatível com a estrutura e com a versão do código usada.

## Restaurar ZIP completo

```bash
make restore-full
make restore-full FILE="/caminho/backup.zip"
```

Sem `FILE`, o assistente lista os registros restauráveis com arquivo disponível.
Um ZIP externo é validado pela infraestrutura do sistema e importado após
confirmação. A restauração usa `RestoreBackupAction`, com as mesmas regras de
validação e extração do fluxo da aplicação. Ela sobrescreve banco e uploads;
não transforma automaticamente esquemas antigos em novas versões.

O procedimento específico de conversão do backup de 2026-11-06 fica no
[registro histórico](../docs/operations/restaurar-backup-2026-11-06.md).
Não execute `migrate:fresh` após restaurar um banco com dados.

## Confirmação, manutenção e falhas

Antes de executar, o Make confirma o ambiente e pausa somente os workers que
estavam ativos. O comando PHP pede a confirmação do arquivo. Após confirmar a
restauração, coloca a aplicação em manutenção; uma manutenção preexistente é
preservada. Os workers são retomados em caso de sucesso ou cancelamento anterior
à alteração dos dados.

Uma falha não é apresentada como sucesso e não retoma os workers automaticamente.
Se a alteração de dados já começou, a aplicação permanece em manutenção. Confira
o erro e o estado de banco e arquivos antes de retomar. Não há rollback automático
de todo o banco importado. `make logs-app` auxilia no diagnóstico.

`make db` e os comandos SQL usam a conexão Laravel. As credenciais ficam em um
arquivo temporário privado, removido ao concluir ou falhar; a senha não é
interpolada em comandos shell nem aparece nos argumentos do cliente MySQL.

## Diagnóstico

| Sintoma | Verificação |
| --- | --- |
| Cliente MySQL ou extensão ZIP ausente | Reconstrua e publique a imagem atual com `make deploy`. |
| Falha de escrita | Confira os volumes e execute `make perm` no ambiente correto. |
| Conexão recusada | Confira host, porta e credenciais existentes; alterar o `.env` não altera usuários do MySQL. |
| ZIP inválido ou criptografado | Confira integridade, conteúdo compatível e a senha usada ao gerar o arquivo. |
| Não encontra o backup | Confira arquivo físico e catálogo; use `FILE` para um arquivo externo. |
| Dados criptografados ilegíveis após restaurar | Confira se a instalação usa a `APP_KEY` original. |

Para uso da interface e permissões, consulte [Backups na Central de Ajuda](../resources/help/backups.md).
