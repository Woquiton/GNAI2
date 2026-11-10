# Restaurar o backup de produção de 2026-11-06

O arquivo original `2026-11-06-12-05-02.zip` foi copiado para a raiz sem alteração.
O arquivo pronto para as migrations atuais é
`2026-11-06-12-05-02-atualizado.zip`, também na raiz. Ambos ficam fora do Git e da
imagem Docker. A conversão e a restauração foram executadas somente no MySQL local;
nenhum servidor de produção foi acessado.

## Origem e destino

- SHA-256 do ZIP original: `db926874473c975fefc4a66dbbc0e55f5752e466a887ec27db12199b3abae405`.
- SHA-256 do ZIP convertido: `c07c7b3815cea9dc633ba13aea8d74c76368ee1dd4d60bb8eae2ca0bdb26300f`.
- Histórico usado para converter os dados: commit `0af6f380a3557908a54669c601f99645551de545`.
- Estrutura de destino: commit `11198d3b`, com 80 migrations, uma por tabela.
- O ZIP convertido contém o SQL completo, `restore/manifest.json` e os 133 arquivos
  de storage do ZIP original. O manifesto inclui contagens, hashes dos registros
  por tabela e o de/para. Não contém nomes de pessoas ou valores dos registros.

## De/para aplicado

As migrations históricas pendentes foram executadas em um banco temporário,
sem conectar ao banco de produção. Depois, as tabelas atuais foram recriadas pelas
80 migrations e receberam somente as colunas de destino, preservando os IDs.
O histórico antigo de migrations não foi copiado: o SQL convertido já contém as
80 migrations atuais marcadas como aplicadas.

| Origem | Destino e regra |
| --- | --- |
| `assistive_technologies` | `items`, com os mesmos IDs e `item_type=assistive_technology` |
| `accessible_educational_materials` | `items`, com ID antigo + 14; não havia materiais neste backup |
| Pivôs de perfis dos recursos antigos | `item_deficiency`, remapeando a coluna do recurso para `item_id` |
| Pivô de acessibilidade dos materiais | `item_accessibility_feature`; origem vazia |
| `loans`, `waitlists`, `inspections` | Referências polimórficas dos recursos passam para `item`; campos e registros preservados |
| `institutional_events` | `publications`; origem vazia |
| `students.status` | Situação e modalidade separadas pela regra histórica: `active`/`full_attendance` viram `active` + `both`; `aee_only` vira `active` + `aee`; `pedagogical_only` vira `active` + `pedagogical`; inativos mantêm a situação |
| Vínculos acadêmicos | Recebem os campos de semestre pelas regras históricas; a matrícula usa o semestre atual como fallback quando não tinha semestre |
| Operações | Recebem `semester_id` apenas se a data identifica um único semestre; não é inventado histórico de transições |
| Permissões de tecnologias e materiais | Unificadas em `item.*`, com união dos vínculos por cargo |
| Permissões de eventos institucionais | Remapeadas para `publication.*`, preservando os vínculos |
| `users` | IDs, e-mails e hashes das senhas preservados; a regra histórica identifica o administrador superior sem vínculo com a equipe |
| `student_contexts` | **3 registros de teste descartados por instrução do usuário**; não foram criados Estudos de Caso nem PAEEs |
| `peis` | **1 PEI de teste descartado por instrução do usuário**, junto de seus dependentes; não havia adaptações por disciplina |
| `teacher_courses`, `discipline_teacher` | Tabelas antigas vazias não integram o esquema final |
| Tabelas novas | Criadas vazias, exceto as sete etiquetas iniciais e o catálogo de permissões |

O catálogo ficou com 208 permissões: contempla o catálogo atual e mantém entradas
históricas remanescentes. Os vínculos com cargos passaram de 479 para 453 pela
unificação de permissões equivalentes; não foi executado `permissions:sync --prune`.
Foram preservadas 12 contas, incluindo os três administradores e o administrador
superior identificado pela regra histórica. Nenhuma senha foi redefinida.

## Validação local realizada

- Restauração do próprio ZIP convertido no MySQL local, após recriação do esquema.
- Comparação do esquema: 80 tabelas de aplicação, 752 colunas, 250 índices e 128
  chaves estrangeiras iguais às migrations atuais.
- Comparação de contagens e SHA-256 dos registros das 81 tabelas, incluindo o
  repositório de migrations, antes de liberar novamente a aplicação.
- Nenhuma chave estrangeira ou referência polimórfica órfã.
- As 80 migrations atuais aparecem como aplicadas, sem pendências.
- Leitura dos modelos centrais com casts e enums, sem falhas de hidratação.
- Os 133 arquivos de storage conferem byte a byte com o ZIP convertido.
- As 61 fotos referenciadas, os 26 documentos de alunos e as 35 evidências existem.
- As 30 entradas históricas de backup foram preservadas como metadados. Os ZIPs
  antigos correspondentes não estão incluídos no backup original.

O validador é somente leitura. Deve ser executado imediatamente após a importação,
com a aplicação em manutenção e os workers pausados: sessões, cache e outros
registros podem mudar quando o sistema voltar a atender requisições.

## Restauração em produção

Transfira o **ZIP atualizado**, publique o código atual e mantenha a configuração
de produção, incluindo o `APP_KEY` existente. Execute na raiz do projeto:

```bash
unzip 2026-11-06-12-05-02-atualizado.zip -d storage/app/private/restauracao-20261106

docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T app php artisan down
docker compose --env-file .env.prod -f docker-compose.prod.yml stop queue scheduler

# Apaga as tabelas do banco configurado em produção, inclusive as tabelas legadas.
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T app php artisan db:wipe --force

docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T db sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u"$MYSQL_USER" "$MYSQL_DATABASE"' < storage/app/private/restauracao-20261106/db-dumps/mysql-gnai_db-atualizado.sql

cp -R storage/app/private/restauracao-20261106/var/www/storage/app/. storage/app/

docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T app php scripts/backup/validate-restored-database.php storage/app/private/restauracao-20261106/restore/manifest.json
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T app php artisan migrate:status
```

Continue somente se o validador terminar com sucesso. O SQL já contém a estrutura
atual e o histórico correto; **não execute `migrate:fresh` depois da importação**.
Então libere o ambiente:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T app php artisan cache:clear
docker compose --env-file .env.prod -f docker-compose.prod.yml start queue scheduler
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T app php artisan up
```

A homologação manual deve conferir login com uma conta existente, prontuário,
empréstimos, perfis dos itens e abertura de fotos, documentos e evidências.

## Contagens por tabela de origem

As contagens abaixo são agregadas. O manifesto no ZIP contém os hashes usados na
validação exata dos registros convertidos.

| Tabela original | Registros originais | Tabela atual | Registros no destino |
| --- | ---: | --- | ---: |
| `accessibility_features` | 0 | `accessibility_features` | 0 |
| `accessible_educational_material_accessibility` | 0 | `item_accessibility_feature` | 0 |
| `accessible_educational_material_deficiency` | 0 | `item_deficiency` | 377 |
| `accessible_educational_materials` | 0 | `items` | 14 |
| `aee_records` | 1 | `aee_records` | 1 |
| `aee_student_evaluations` | 1 | `aee_student_evaluations` | 1 |
| `assistive_technologies` | 14 | `items` | 14 |
| `assistive_technology_deficiency` | 377 | `item_deficiency` | 377 |
| `attendance_session_student` | 12 | `attendance_session_student` | 12 |
| `attendance_sessions` | 13 | `attendance_sessions` | 13 |
| `backups` | 30 | `backups` | 30 |
| `barrier_categories` | 0 | `barrier_categories` | 0 |
| `barrier_deficiency` | 0 | `barrier_deficiency` | 0 |
| `barriers` | 0 | `barriers` | 0 |
| `cache` | 15 | `cache` | 15 |
| `cache_locks` | 0 | `cache_locks` | 0 |
| `course_disciplines` | 3 | `course_disciplines` | 3 |
| `courses` | 43 | `courses` | 43 |
| `deficiencies` | 27 | `deficiencies` | 27 |
| `discipline_teacher` | 0 | `Removida` | — |
| `disciplines` | 1 | `disciplines` | 1 |
| `failed_jobs` | 0 | `failed_jobs` | 0 |
| `inspection_evidences` | 35 | `inspection_evidences` | 35 |
| `inspections` | 18 | `inspections` | 18 |
| `institutional_events` | 0 | `publications` | 0 |
| `institutions` | 1 | `institutions` | 1 |
| `job_batches` | 0 | `job_batches` | 0 |
| `jobs` | 0 | `jobs` | 0 |
| `loans` | 2 | `loans` | 2 |
| `locations` | 1 | `locations` | 1 |
| `migrations` | 62 | `migrations` | 80 |
| `notifications` | 0 | `notifications` | 0 |
| `password_reset_tokens` | 4 | `password_reset_tokens` | 4 |
| `pedagogical_record_guardians` | 1 | `pedagogical_record_guardians` | 1 |
| `pedagogical_records` | 4 | `pedagogical_records` | 4 |
| `pei_disciplines` | 0 | `pei_disciplines` | 0 |
| `peis` | 1 | `peis` | 0 |
| `pendencies` | 0 | `pendencies` | 0 |
| `people` | 113 | `people` | 113 |
| `permission_position` | 479 | `permission_position` | 453 |
| `permissions` | 188 | `permissions` | 208 |
| `positions` | 6 | `positions` | 6 |
| `professionals` | 10 | `professionals` | 10 |
| `semesters` | 2 | `semesters` | 2 |
| `sessions` | 41 | `sessions` | 41 |
| `student_contexts` | 3 | `Removida` | — |
| `student_course_disciplines` | 0 | `student_course_disciplines` | 0 |
| `student_courses` | 84 | `student_courses` | 84 |
| `student_documents` | 26 | `student_documents` | 26 |
| `student_guardians` | 13 | `student_guardians` | 13 |
| `students` | 88 | `students` | 88 |
| `students_deficiencies` | 112 | `students_deficiencies` | 112 |
| `teacher_course_disciplines` | 0 | `teacher_course_disciplines` | 0 |
| `teacher_courses` | 0 | `Removida` | — |
| `teacher_global_permissions` | 0 | `teacher_global_permissions` | 0 |
| `teachers` | 0 | `teachers` | 0 |
| `users` | 12 | `users` | 12 |
| `waitlists` | 0 | `waitlists` | 0 |
