# Semestres e histórico das operações

Data: 2026-11-03. Levantamento por leitura dos modelos, actions, migrations e fontes de relatórios. Não confirma o esquema aplicado nem o preenchimento da base. O mapa abaixo registra a situação encontrada antes da alteração. A seção de entrega descreve o que foi implementado nesta revisão.

## Objetivo

Consultar o contexto de um semestre: o que começou nele, o que continuou de semestres anteriores, o que foi concluído e o que permaneceu aberto. A troca do semestre atual deve preservar a origem e o histórico de cada registro.

Semestre letivo e data da ocorrência são informações distintas. Um lançamento retroativo não pertence automaticamente ao semestre atual. Uma solicitação pode pertencer academicamente a um semestre e ter movimentações em outro.

## Mapa do código atual

| Registro | Referência temporal existente | Lacuna |
| --- | --- | --- |
| Semestre | Ano, período, início, fim e indicação manual de atual | Datas opcionais; sem validação de sobreposição |
| Matrícula e período do curso | Semestre de referência e histórico em `student_course_semesters` | O histórico de período não é histórico completo da frequência e da situação do aluno |
| Reprovação, risco e dependência | Semestre de ocorrência e semestre de aprovação da dependência | Registros legados receberam semestre por aproximação na migration; precisam de revisão |
| Professor–curso–disciplina | Semestre explícito | Não equivale a uma oferta com turma e matrícula individual por disciplina |
| Estudo de Caso, PAEE e PEI | Semestre explícito, com documentos filhos vinculados ao pai | Relatórios de Estudo de Caso e PAEE usam `semester.name`; o campo é `label` |
| Documento do aluno | Semestre explícito | A data do upload não substitui o semestre acadêmico |
| Agendamento | `session_date`, início e fim | Sem semestre explícito |
| Registro AEE e pedagógico | Data acessível pelo agendamento | Semestre deve acompanhar o agendamento; evitar cópias independentes inconsistentes |
| Empréstimo | Saída, previsão e devolução efetiva | Sem semestre; listagem sem filtro temporal; relatório filtra datas manualmente |
| Fila de espera | Solicitação e status atual | Sem semestre, datas próprias das transições ou vínculo direto ao empréstimo que a atendeu |
| Solicitação de atendimento | Data da solicitação, curso e status atual | Sem semestre e sem linha do tempo própria das etapas |
| Pendência | Criação, prazo e indicador de conclusão | Sem semestre e sem data própria de conclusão |
| Barreira | Identificação, resolução e vistorias | Sem semestre; reabertura limpa a resolução atual, portanto o par de datas não descreve todos os ciclos |
| Vistoria | Data da vistoria | Sem semestre; evidências devem acompanhar a vistoria |
| Publicação/evento | Datas de início e fim | Pode atravessar semestres; data de publicação é distinta da realização |
| Catálogos | Cursos, disciplinas, itens, locais, categorias e pessoas | Cadastro permanente; sua existência não deve ficar restrita a um semestre |

A auditoria de alterações existente pode ajudar na revisão de dados, mas não foi validada como fonte completa para reconstrução temporal de todas essas entidades. `updated_at` não significa notificação, atendimento, devolução ou conclusão.

## Regra proposta para revisão

1. Guardar o semestre acadêmico de referência nos registros de negócio que o exigem. Filhos consultam o semestre do pai quando representam o mesmo contexto: atendimento e seus registros, vistoria e suas evidências, plano e seus componentes.
2. Guardar as datas das ocorrências independentemente do semestre de referência. Nas operações com várias etapas, manter transições com estado anterior, novo estado, data efetiva e responsável. Registrar também quando a transição foi lançada, para distinguir lançamento retroativo.
3. Preservar o mesmo registro quando ele atravessa semestres. Não duplicar fila nem empréstimo, não reiniciar prioridade e não marcar conclusão na virada. A continuidade foi adotada na implementação solicitada, preservando origem, prioridade e identidade do registro.
4. Usar o calendário para consultas de participação no período. A origem acadêmica e os semestres atravessados devem ser filtros distintos, com rótulos claros.
5. Sugerir semestre pela data efetiva quando houver correspondência única no calendário. Sem correspondência, com datas ausentes ou múltiplas correspondências, exigir definição/revisão; nunca escolher silenciosamente o atual para registros históricos.
6. Ao corrigir datas do calendário ou o semestre de um registro, não reatribuir em massa os vínculos já persistidos. As consultas cronológicas passam a usar o calendário corrigido; o contexto acadêmico persistido só muda por correção explícita e auditada.
7. Proteger a exclusão de semestres com vínculos e atualizar `SemesterHasLinkedRecordsQuery` junto de cada nova relação.

## Perguntas que a consulta deve responder

| Área | Consultas necessárias |
| --- | --- |
| Empréstimos | Originados no semestre; retirados nele; devolvidos nele; em uso durante ele; abertos no encerramento |
| Fila | Solicitadas; em espera durante o período; notificadas; atendidas; canceladas; ainda abertas no encerramento; tempo até atendimento |
| Atendimento | Solicitados; agendados para o período; realizados; cancelados; ausências; modalidade e curso no contexto consultado |
| Pendências | Abertas; vencidas; concluídas no período; abertas ao encerramento |
| Barreiras | Identificadas; existentes durante o período; resolvidas; reabertas; vistorias realizadas |
| Acadêmico | Curso e período do aluno naquele semestre; reprovações e riscos daquele semestre; dependências pendentes naquela referência |
| Eventos | Realizados ou em andamento no semestre, separados de publicações feitas nele |

Para um intervalo de atividade, há participação quando seu início é anterior ao fim exclusivo do semestre e seu encerramento é posterior ao início do semestre, ou ainda não ocorreu. Os limites devem respeitar a granularidade: empréstimos têm horário; identificação de barreiras usa data. Operações pontuais usam a data efetiva dentro do semestre. A previsão de encerramento não substitui o encerramento real.

Exemplo: solicitação em 2026.1, notificação e atendimento em 2026.2. A origem continua 2026.1; houve espera em ambos os semestres; o atendimento conta em 2026.2. A ligação ao empréstimo permite explicar como a solicitação foi atendida.

## Migração e entrega

- Inventariar datas do calendário e resolver sobreposições antes de inferir vínculos.
- Migrar somente vínculos demonstráveis. Separar registros sem informação ou ambíguos para revisão; não inventar datas de encerramento com `updated_at`.
- Preservar status e ordem atuais das filas. Registros finalizados sem data conhecida não podem ser tratados como ainda abertos nem incluídos em contagens históricas exatas sem indicação de informação incompleta.
- Implementar a referência temporal e as transições por fluxo completo, incluindo criação, edição, cancelamento, atendimento automático de fila e notificações.
- Integrar filtros e identificação do semestre em listagens, detalhes, relatórios e PDFs; atualizar a Central de Ajuda e os tutoriais correspondentes.
- Conferir origem retroativa, passagem de semestre, datas no limite, solicitação atendida por empréstimo, registro filho com contexto do pai e base legada sem datas.

Este trabalho deve abranger todos os fluxos do mapa. Acrescentar somente `semester_id` em empréstimos não resolve o objetivo.

## Entrega desta revisão

Implementado no código:

- `semester_id` persistido em empréstimos, filas, agendamentos, solicitações, pendências, barreiras, vistorias e publicações. A origem de publicações considera `published_at`; a realização de eventos usa as datas do evento em filtro próprio.
- Identificação pela data efetiva, somente com correspondência única. Alterar o semestre atual ou editar o calendário não reatribui os vínculos existentes. Uma correção explícita da data de origem da operação recalcula seu vínculo e entra na auditoria.
- Datas obrigatórias ao criar ou editar semestre, rejeição de sobreposição e preenchimento de vínculos ausentes ao salvar um calendário válido. O preenchimento é auditado nos modelos auditáveis. Os registros sem correspondência permanecem nulos, inclusive atividades fora do calendário; não foi criado um seletor manual de origem em cada formulário.
- Datas de notificação, atendimento e cancelamento da fila; ligação ao empréstimo que a atendeu. A data de atendimento automático usa a saída efetiva do empréstimo e só atende solicitações já existentes naquela data. Datas mostradas nas listas são as últimas ocorrências de cada etapa; repetições ficam preservadas no histórico.
- Data de conclusão de pendência. Histórico de transições de situação para filas, empréstimos, agendamentos e solicitações; de conclusão para pendências; de resolução/reabertura para barreiras. As transições são gravadas na transação da operação, com data efetiva, data do registro, ator e semestre da movimentação.
- Histórico acessível como relação nos relatórios, sem uma fonte primária que misture livremente todos os registros. Não foram criados eventos retroativos para estados antigos desconhecidos. O agendamento tem origem pela data prevista, mas sua criação e alterações de situação têm data de movimentação própria.
- Filtros e identificação de origem nas listas, detalhes, colunas complementares e PDFs de empréstimos e filas. As listas distinguem origem, início, continuidade e encerramento. O status mostrado continua atual.
- Origem em todos os relatórios operacionais mapeados, incluindo uma fonte de solicitações de atendimento. AEE e pedagógico consultam a origem e a data pelo agendamento. As demais listagens e fichas específicas ainda usam suas interfaces anteriores; a consulta de semestre dessas áreas está nos relatórios.
- Filtros cronológicos de início nos relatórios operacionais; continuidade e encerramento em empréstimos, filas e pendências; realização de eventos separada da publicação.
- Exclusão de semestre protegida pelos novos vínculos e movimentações; empréstimo que atendeu fila protegido contra exclusão, com mensagem de negócio. Histórico de movimentações preservado mesmo se a operação for excluída pelos fluxos que ainda permitem exclusão.
- Correção de `semester.name` para `semester.label` nos relatórios de Estudo de Caso e PAEE. Artigos e tutoriais atualizados.

Limites que continuam exigindo tratamento próprio:

- O histórico completo de situação/frequência do aluno e o contexto de curso de cada atendimento não foram reconstruídos. O histórico acadêmico de períodos, reprovações e dependências já existente permanece como estava.
- Os relatórios não oferecem uma fotografia completa de todos os campos mutáveis do sistema em uma data passada. O novo histórico cobre as transições descritas acima, a partir desta atualização.
- Barreiras têm histórico de resolução/reabertura, mas não um filtro agregado de todos os intervalos de existência anteriores. Consulte as movimentações por semestre; não infira todos os ciclos a partir do `resolved_at` atual.
- Não é possível recuperar datas de atendimento/cancelamento de filas antigas ou conclusão de pendências antigas somente pelo status atual. Esses registros continuam com datas desconhecidas e são excluídos dos filtros que exigem comprovação de encerramento/continuidade. Não se usa `updated_at` para preencher essas lacunas.
- Semestres antigos ainda podem estar sem datas ou sobrepostos, pois a migration não inventa nem corrige o calendário. Devem ser revisados na tela de semestres.

A migration `2026_11_03_140000_link_operations_to_semesters` foi aplicada com sucesso no ambiente de desenvolvimento desta sessão.

Homologação manual: conferir uma operação iniciada antes e encerrada durante o semestre, uma ainda aberta, uma encerrada sem data legada, lançamentos na última data do semestre, calendário sem datas/sobreposto, fila atendida por empréstimo, reabertura de barreira e dados de atendimento herdados do agendamento. As interfaces e relatórios devem ser conferidos em runtime na homologação manual.
