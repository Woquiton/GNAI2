# Auditoria da estrutura acadêmica: cursos, disciplinas, professores, alunos e PEI

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
