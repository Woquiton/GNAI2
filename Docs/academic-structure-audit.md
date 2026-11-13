# Auditoria da estrutura acadêmica: cursos, disciplinas, professores, alunos e PEI

> Registro histórico: descreve a revisão ou o procedimento na data indicada. Não representa, por si só, o estado atual do código nem uma instrução geral de deploy. Consulte o [índice da documentação](../docs/README.md).

Data: 2026-11-02. Escopo: os vínculos entre cursos, disciplinas, professores, semestres, matrículas, PEI, PAEE e responsáveis no domínio `Inclusion`. A auditoria foi feita por leitura de código. Nada foi executado, então os cenários de risco devem ser reproduzidos na homologação antes da correção.

## Conclusão

A base é aproveitável. O catálogo único de disciplinas (`disciplines`), a matriz curso–disciplina (`course_disciplines`) e o vínculo do professor por curso e disciplina (`teacher_course_disciplines`) seguem o modelo dos sistemas acadêmicos reais. Os problemas estão em três frentes:

- exclusões em cascata que podem apagar PEIs sem aviso;
- a falta da noção de período do curso e de oferta por semestre;
- vínculos que não guardam histórico.

## Riscos imediatos

Estes pontos independem de redesenho e devem ser corrigidos primeiro.

1. **Excluir um profissional ou professor pode apagar PEIs.** `DeleteProfessionalAction` e `DeleteTeacherAction` excluem o usuário de forma definitiva, e nenhum model usa `SoftDeletes`. As chaves `creator_id` de `peis`, `paees`, `case_studies` e `pei_disciplines`, além de `reviewer_id` de `paee_reviews` e `pei_discipline_revisions` e `author_id` de `case_study_contributions`, usam `cascadeOnDelete`. `ProfessionalHasLinkedRecordsQuery` não verifica nenhum desses registros. O professor só é barrado quando é responsável por alguma adaptação (`peiDisciplines`).
2. **Excluir um semestre pode apagar PEIs de outro semestre.** `SemesterHasLinkedRecordsQuery` verifica só documentos e PEIs do próprio semestre. `case_studies.semester_id` e `paees.semester_id` usam cascata, e `peis.paee_id` também. Um PEI de 2026.2 ligado a um PAEE de 2026.1 some quando 2026.1 é excluído.
3. **Excluir um curso pode apagar PEIs.** `CourseHasStudentsQuery` verifica só `student_courses`. Se a matrícula for removida antes, o curso é excluído e `peis.course_id` leva os PEIs em cascata. `DeleteStudentCourseAction` não verifica PEIs no curso.
4. **Excluir uma disciplina pode apagar adaptações de PEI.** Depois de tirar a disciplina da matriz e dos professores, `DeleteDisciplineAction` permite a exclusão, e `pei_disciplines.discipline_id` apaga as adaptações em cascata. A guarda não consulta `pei_disciplines`. A sincronização da matriz em `Course::assignCurriculum` também não verifica adaptações, vínculos de professor nem reprovações e riscos.
5. **Uma nova versão do PEI repete o curso do PEI anterior.** `CreatePeiAction` usa `$currentPei->course` e ignora a matrícula vigente. Um aluno que mudou de curso recebe um PEI novo no curso antigo.
6. **Adaptações antigas ficam bloqueadas para edição.** `UpdatePeiDisciplineAction` revalida o vínculo do professor em `teacher_course_disciplines` e exige que a disciplina esteja ativa em toda gravação. Depois da troca de professor no semestre seguinte, a adaptação antiga não pode ser corrigida nem em texto.
7. **O professor vê mais do que precisa.** `ListAllPeisQuery` e `ListStudentsQuery` mostram ao professor todos os PEIs e alunos de qualquer curso em que ele lecione uma disciplina, e não só os alunos dele. Os dados de deficiência são sensíveis segundo a Lei Geral de Proteção de Dados (LGPD).
8. **Só quem criou o PEI pode finalizá-lo ou excluí-lo.** `Pei::ensureCanBeManagedBy` compara apenas o `creator_id`. Se essa pessoa sair do NAPNE, o PEI fica travado.
9. **Pontos menores:**
   - Não há unicidade de nome em `courses` nem em `disciplines`, nem no banco nem na validação.
   - O banco não garante um único `is_current` por aluno em `student_courses`; isso depende das actions.
   - A tabela legada `discipline_teacher` continua existindo sem uso.
   - A tela de disciplinas do professor lista só cursos e disciplinas ativos. Ao salvar, `Teacher::assignCourseDisciplines` apaga sem aviso os vínculos com itens inativos.
   - Em `PeiDisciplineFormQuery::forUpdate`, a edição oferece todas as disciplinas do sistema, e não só as do curso. O backend rejeita depois, mas a tela confunde.

### Correção sugerida para os riscos

- Trocar por `restrictOnDelete` as cascatas que atingem PEI, PAEE, estudo de caso, revisões e pareceres.
- Completar as guardas de exclusão de semestre, curso, disciplina, matrícula, professor e profissional.
- Desativar o acesso do usuário em vez de excluí-lo quando ele for autor de registros pedagógicos.
- Usar o curso da matrícula vigente na criação de uma nova versão do PEI.
- Na edição de uma adaptação, validar professor e disciplina só quando forem alterados.
- Restringir a visão do professor aos PEIs com adaptações sob sua responsabilidade.
- Permitir que a equipe do NAPNE, por permissão, gerencie PEIs de outros autores.

## Problemas estruturais

- **A matriz não tem período.** `course_disciplines` é um par simples curso–disciplina. O PEI oferece todas as disciplinas do curso, de todos os semestres, e a equipe precisa saber de cabeça o que o aluno cursa agora.
- **O vínculo do professor não tem tempo.** `teacher_course_disciplines` não tem semestre. Quando o professor muda, o vínculo é apagado e se perde quem lecionava o quê em cada período.
- **Reprovações e riscos não têm data.** `student_course_disciplines` fica preso à matrícula no curso e não ao semestre. Não dá para saber quando o aluno reprovou nem se já refez a disciplina.
- **A matrícula impede reingresso.** O índice único em `student_id` e `course_id` de `student_courses` impede uma nova matrícula no mesmo curso.

Os vínculos com responsáveis (`student_guardians` e `pedagogical_record_guardians`) estão consistentes: exclusão protegida e pessoa preservada quando tem outros papéis.

## Referências de mercado

Os sistemas pesquisados compartilham a mesma estrutura:

- **SUAP**, usado pelos Institutos Federais, tem Matriz, Componente Curricular com período, Turma, Diário (componente + período letivo), Professor do Diário e Matrícula no Diário com situação final.
- **SIGAA**, da UFRN, define a turma como o conjunto de discentes cursando um componente num período específico.
- **OneRoster** separa Course, Class (a oferta num período), Enrollment com papel de aluno ou professor e Result.
- **Ed-Fi** separa Course, CourseOffering, Section, as associações de professor e aluno com a seção e o CourseTranscript com o resultado.
- **Moodle** suspende a inscrição em vez de apagá-la, o que preserva os dados.
- **A IN 07/2020 do IFRS** organiza o PEI por estudante, componente curricular, semestre e docente.

Modelo comum:

```
Curso 1─N Matriz
Matriz N─N Componente  via ComponenteMatriz {período, obrigatório, carga horária}
Período letivo {ano, período, datas}
Oferta {componente, curso, período letivo}
Professor N─N Oferta {papel, início, fim}
Aluno 1─N MatrículaPeríodo {período letivo, período do curso, situação}
Aluno N─N Oferta {situação, resultado: aprovado, reprovado, cursando}
```

Padrões de lançamento em lote:

- O SUAP gera turmas e diários a partir da matriz e matricula a turma inteira de uma vez.
- O PowerSchool promove todos por padrão e marca só os retidos.
- Moodle e Canvas importam CSV com prévia, resumo de exceções e limite contra exclusões em massa.

## Proposta em fases

| Fase | Mudança | Ganho para quem usa |
| --- | --- | --- |
| 0 | Corrigir os riscos imediatos | Fim das perdas silenciosas de dados |
| 1 | Período do curso em `course_disciplines` e período atual em `student_courses` | O PEI já sugere as disciplinas do período do aluno |
| 2 | Professor por disciplina, curso e semestre, com ação "copiar do semestre anterior" | Histórico preservado, e a troca de semestre vira um clique |
| 3 | Reprovação e risco registrados por semestre | Dependências e repetições aparecem sem cadastro extra |
| 4 | Virada de semestre em lote | Todos avançam de período e só as exceções são marcadas |
| Opcional | Importação de diários e boletins do SUAP por CSV ou API | Menos digitação |

Princípios para não sobrecarregar o NAPNE:

- **A aprovação é implícita.** Ninguém marca aprovação aluno por aluno. O NAPNE registra só reprovação e risco, que são poucos e já foram pedidos por ele.
- **Dependências aparecem sozinhas.** Uma reprovação em semestre anterior sem aprovação posterior indica dependência. Ao abrir o próximo PEI, o sistema sugere incluí-la junto com as disciplinas do período.
- **A virada de semestre fica em uma tela.** O usuário escolhe o curso, confirma o avanço de todos para o próximo período e desmarca quem ficou retido ou trancou.
- **Uma tabela própria de oferta fica para depois.** As fases 1 a 3 cobrem quase todo o ganho com mudanças pequenas no banco. A oferta só compensa se houver turmas, turnos ou vários professores por disciplina.

A fase 0 é urgente e não muda nada para o usuário final. As fases 1 a 4 alteram banco e regras de negócio e dependem de decisão do projeto.

## Situação da implementação

Atualizado em 2026-11-03. As fases 0 a 4 foram implementadas no código e aguardam homologação manual. A integração com o SUAP continua opcional e pendente.

**Fase 0, riscos imediatos.** A migration `2026_11_03_100000_protect_pedagogical_records_from_cascading_deletes` troca as cascatas de PEI, adaptações, revisões, PAEE, pareceres, estudos de caso e contribuições por bloqueio, e remove a tabela `discipline_teacher`. Guardas novas:

- semestre: PAEE, estudo de caso, matrícula, período do aluno e vínculo de professor também bloqueiam;
- curso: PEIs bloqueiam a exclusão; retirar disciplina da matriz é bloqueado quando há adaptação de PEI ou reprovação e risco no curso, e remove os vínculos de professor daquela disciplina no curso;
- disciplina: adaptações de PEI bloqueiam a exclusão;
- PAEE: PEI vinculado bloqueia a exclusão;
- professor e profissional: a autoria de PEI, PAEE, estudo de caso, revisões e contribuições bloqueia a exclusão (`UserHasAuthoredPedagogicalRecordsQuery`).

Também mudou:

- a nova versão do PEI usa o curso da matrícula vigente;
- a edição de adaptação só revalida professor e disciplina quando eles mudam;
- o professor vê apenas PEIs com adaptação sob sua responsabilidade, nas listagens, na aba do aluno, na visualização e nos PDFs (`TeacherPeiAccessQuery`);
- administradores podem finalizar, excluir e editar PEIs e adaptações de outros autores;
- cursos e disciplinas não aceitam nomes repetidos na validação;
- a tela de disciplinas do professor preserva vínculos com cursos ou disciplinas inativos;
- a edição de adaptação oferece só as disciplinas do curso, mais a atual.

**Fase 1, período do curso.** A migration `2026_11_03_110000_add_course_periods_and_student_course_semesters` cria `course_disciplines.course_period` e a tabela `student_course_semesters`, com um registro por matrícula e semestre. O formulário do curso pede o período de cada disciplina marcada. A matrícula ganhou o campo **Período do Curso**, gravado para o semestre informado, e a visualização mostra o histórico por semestre. O cadastro de adaptações do PEI mostra primeiro as disciplinas do período do aluno no semestre do PEI.

**Fase 2, professor por semestre.** A migration `2026_11_03_120000_add_semester_to_teacher_course_disciplines` torna `semester_id` obrigatório no vínculo, com os registros existentes levados ao semestre atual ou ao mais recente e repetidos nos semestres que já têm PEI, para que os PEIs antigos continuem aceitando os mesmos professores. A migration falha de propósito se houver vínculos e nenhum semestre cadastrado. A tela **Gerenciar Disciplinas** escolhe o semestre e copia os vínculos do semestre anterior; a listagem de professores copia os vínculos de todos para o semestre atual. O PEI valida e lista professores pelo semestre do PEI. A listagem de alunos do professor considera as matrículas vigentes nos cursos em que ele leciona no semestre atual.

**Fase 3, reprovação e risco por semestre.** A migration `2026_11_03_130000_add_semester_to_student_course_disciplines` torna `semester_id` obrigatório em `student_course_disciplines` e cria `resolved_semester_id`, o semestre em que uma reprovação foi aprovada. Os registros existentes vão para o semestre da matrícula ou, sem ele, para o atual ou o mais recente. Regras:

- reprovação e risco são gravados no semestre escolhido na matrícula, sem alterar os outros semestres; o cadastro já vem com o semestre atual;
- dependência é a reprovação de semestre anterior sem aprovação antes do semestre consultado; ela é aprovada pelo campo **Dependências aprovadas neste semestre**, sem registrar aprovações das demais disciplinas;
- a visualização da matrícula mostra as dependências pendentes e o histórico por semestre;
- o PEI sugere as dependências pendentes no semestre do PEI junto com as disciplinas do período;
- relatório de matrículas e PDF do aluno mostram reprovação e risco do semestre da matrícula;
- o histórico de alterações passa a registrar reprovações, riscos e dependências aprovadas por semestre, mantendo a leitura dos registros antigos.

**Fase 4, virada de semestre em lote.** A tela **Virada de semestre**, aberta pela visualização do curso (`courses.rollover`, permissão `student-course.update`), lista os alunos ativos com matrícula vigente no curso e o período no último semestre anterior ao de destino. Por padrão todos avançam um período; a equipe marca só quem permanece ou não deve ser registrado e escolhe o período de quem não tem histórico. Ao salvar, `RolloverCourseSemesterAction` grava o período no semestre de destino e passa a matrícula para esse semestre e o ano dele, um registro por vez, para a auditoria. Não houve migration nesta fase.

**Pontos para a homologação.**

- Rodar as migrations numa cópia do banco de produção antes, porque elas alteram chaves estrangeiras e preenchem o semestre dos vínculos.
- Depois de migrar, conferir os vínculos dos professores no semestre atual. Os semestres com PEI recebem uma cópia dos vínculos atuais, que pode ser ajustada em **Gerenciar Disciplinas**.
- Rodar `php artisan permissions:sync` não é necessário: as novas rotas usam a permissão existente `teacher.update`.

## Fontes

- SUAP, API pública: https://suap.ifrn.edu.br/api/openapi.json
- SUAP, turmas e diários: https://wiki.ifpe.edu.br/books/ensino---proden/page/manual-do-suap-edu-turmas-e-di%C3%A1riosgerar-turma-e-di%C3%A1rios/export/pdf
- SUAP, virada de período: https://wiki.ifac.edu.br/sistemas/suap/edu/guia_para_virada_de_periodo
- SUAP, matrícula por período: https://wiki.ifac.edu.br/sistemas/suap/edu/procedimentos-matricula-periodo-ano
- SIGAA, turmas: https://conhecimento.sti.ufpb.br/books/turmas/export/pdf
- OneRoster 1.1: https://www.imsglobal.org/oneroster-v11-final-specification
- Ed-Fi: https://docs.ed-fi.org/reference/data-exchange/data-standard/model-reference/teaching-and-learning-domain/entities-references-and-descriptors
- Moodle, inscrições: https://moodledev.io/docs/apis/subsystems/enrol
- Moodle, upload de usuários: https://docs.moodle.org/en/Upload_users
- Canvas, SIS CSV: https://canvas.instructure.com/doc/api/file.sis_csv.html
- PowerSchool, promoção: https://support.powerschool.com/help/sms/843/SchoolUser/Content/Topics/Set_the_students_promot.htm
- IFRS, IN 07/2020 (PEI): https://ifrs.edu.br/erechim/wp-content/uploads/sites/3/2020/09/IN-07-2020-Plano-Educacional-Individualizado-PEI.pdf
