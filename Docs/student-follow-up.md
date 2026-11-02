# Situação e tipo de acompanhamento do aluno

`students.status` representa somente a situação cadastral: `active`, `locked`, `completed` ou `dropped`. `students.follow_up_type` representa o acompanhamento atual: `aee`, `pedagogical` ou `both`. O valor nulo identifica informação não recuperada do legado, não uma quarta modalidade de acompanhamento.

Novos cadastros exigem a modalidade. Alunos inativos podem manter o valor nulo; para reativar ou salvar um aluno ativo, é obrigatório definir uma modalidade. A situação determina a atividade do aluno e a modalidade restringe a criação e a edição de agendamentos. Nenhuma mudança reclassifica atendimentos históricos ou cancela agendamentos existentes automaticamente. Os demais fluxos mantêm as regras de atividade já existentes, sem novos bloqueios de planos baseados apenas na modalidade.

## Conversão dos dados existentes

A migration `2026_11_02_120000_separate_student_follow_up_type_from_status.php` adiciona a coluna e converte os valores:

| Status antigo | Situação | Acompanhamento |
| --- | --- | --- |
| `active` | `active` | `both` |
| `full_attendance` | `active` | `both` |
| `aee_only` | `active` | `aee` |
| `pedagogical_only` | `active` | `pedagogical` |
| `locked`, `completed`, `dropped` | Preservada | `null` |

`active` passa a `both` por compatibilidade com a regra anterior de agendamento. Isso não confirma uma decisão de acompanhamento nem a realização de ambas as modalidades. Esses cadastros podem precisar de revisão. Não inferir exclusividade pela ausência de registros de uma modalidade.

Situações não reconhecidas interrompem a migration antes da criação da coluna. Os registros de auditoria antigos não são reescritos; seus valores históricos continuam tendo rótulos legíveis. Mudanças futuras registram situação e acompanhamento separadamente.

O rollback recompõe as modalidades nos status ativos e remove a coluna. Ele não recupera a distinção original entre `active` e `full_attendance`, nem consegue preservar o acompanhamento de inativos no esquema antigo. Portanto, não é uma restauração integral dos dados anteriores; preserve uma cópia do banco antes da atualização.

## Backup legado e implantação

O restaurador de backups importa SQL e arquivos; ele não executa conversões de esquema automaticamente. Um backup antigo precisa passar pelo processo de atualização de esquema antes de ser usado pela versão atual da aplicação. A migration deve estar aplicada antes de disponibilizar o código que usa o novo enum de situação.

Na preparação da base legada, confira a versão do esquema e o histórico da tabela `migrations`, aplique as migrations pendentes em ambiente isolado e revise os mapeamentos acima. Se o SQL já tiver sido transformado externamente, não reaplique a mesma transformação sem conciliar o esquema e o histórico de migrations.

Na homologação, confira as quantidades por situação e modalidade, a preservação de IDs e vínculos e os cadastros sem acompanhamento. O filtro **Não informado** da listagem de alunos encontra os valores nulos. Confirme também criação, edição e reativação do aluno, agendamentos AEE e pedagógicos, PDF, relatórios e rótulos da auditoria histórica.

Esta mudança prepara a conversão; não restaura nem modifica o arquivo de um backup legado por conta própria.
