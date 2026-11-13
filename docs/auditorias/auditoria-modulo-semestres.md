# Auditoria: módulo de semestres e períodos letivos

> Registro histórico: descreve a revisão ou o procedimento na data indicada. Não representa, por si só, o estado atual do código nem uma instrução geral de deploy. Consulte o [índice da documentação](../README.md).

Data: 02/11/2026. Base do código: commit `8fece578` (branch `feat/react`).

Escopo: leitura do código, das migrations, dos seeders, das telas React, dos PDFs, dos relatórios e dos artigos de ajuda que tratam de semestres, mais pesquisa em documentação pública de outros sistemas educacionais. Nada foi alterado no código ou no banco. Nenhum servidor, teste ou banco foi executado. As conclusões sobre dados existentes em produção são inferidas do esquema; os dados reais não foram consultados (ver [Limitações](#limitações-desta-auditoria)).

Convenções deste documento:

- **Comprovado**: o comportamento decorre diretamente do código citado.
- **Hipotético**: depende de dados, de uso ou de runtime que não foram verificados.
- Os caminhos são relativos à raiz do repositório.

---

## 1. Resumo executivo

O módulo de semestres funciona hoje como um **cadastro manual** com um **marcador de "semestre atual"** (`semesters.is_current`) que um administrador liga e desliga. Esse marcador é usado como carimbo obrigatório na criação de quatro tipos de registro: documentos do aluno, Estudos de Caso, PAEEs e PEIs. Um quinto vínculo, opcional e escolhido à mão, existe na matrícula em curso. O resto do sistema (atendimentos, registros pedagógicos, solicitações, dashboard, Radar) não usa período.

Principais conclusões:

1. **Há risco real de perda de dados.** Excluir um semestre apaga em cascata Estudos de Caso e PAEEs daquele semestre e, por encadeamento, PEIs de **outros** semestres ligados a esses PAEEs. A checagem que deveria impedir a exclusão só olha documentos e PEIs. É o problema mais grave e pode ser corrigido sem esperar a nova arquitetura.
2. **O "semestre atual" não tem relação com o calendário.** Ele só muda quando alguém lembra de mudá-lo. Se ninguém mudar, registros de novembro continuam carimbados como 2026.1. Se alguém desmarcar o atual na edição, o sistema bloqueia a criação de documentos, Estudos de Caso, PAEEs e PEIs.
3. **O histórico pode ser reescrito.** Ano, período e datas de um semestre com registros vinculados continuam editáveis, o que reclassifica todos esses registros e muda a janela do acompanhamento do PEI.
4. **Relatórios quebrados.** As fontes de relatório de Estudos de Caso e PAEE leem `semester.name`, atributo que não existe. A coluna sai vazia e o filtro por semestre tende a gerar erro de SQL.
5. **A integração está incompleta, mas não deve ser "completada" com uma FK em toda tabela.** A maior parte dos dados sem período (atendimentos, registros, solicitações, revisões) já tem uma data própria; o período deles pode ser derivado da data na consulta.

**Recomendação:** substituir o cadastro manual por um **calendário calculado a partir de uma configuração única** (periodicidade semestral por padrão, alinhada ao ano civil), com os períodos **gravados sob demanda** na tabela `semesters` já existente. O período atual passa a ser calculado pela data de hoje, sem tarefa agendada. Novos registros recebem o período da sua **data de referência**, não o "atual no momento do clique". Registros datados não ganham FK: são filtrados por intervalo de datas. Os semestres legados ficam preservados como estão. Nenhum registro antigo é reclassificado automaticamente.

A tela de semestres vira uma área de **consulta**. O administrador só escolhe a periodicidade em **Configurações**, e a mudança vale a partir do ano seguinte.

---

## 2. Estado atual

### 2.1 Modelo de dados

A tabela `semesters` (`database/migrations/2026_01_07_154518_create_semesters_table.php`) tem:

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `year` | `YEAR` | 1901–2155 (limite do tipo MySQL). |
| `term` | `tinyint`, padrão 1 | Validado como 1 ou 2 em seis lugares diferentes. |
| `label` | `string`, nulo | Derivado como `"{ano}.{período}"` pelo modelo; o seeder grava `"{ano}/{período}"`. |
| `start_date`, `end_date` | `date`, nulos | Opcionais; ou as duas ou nenhuma. |
| `is_current` | `boolean` | Um único atual, garantido só pela aplicação. |
| — | `unique(year, term)` | Única restrição do banco. |

### 2.2 Ciclo de vida

| Operação | Onde | Comportamento |
| --- | --- | --- |
| Criar | `CreateSemesterAction` | Valida ano/período/datas. Se `is_current`, desmarca o atual anterior dentro da transação. |
| Editar | `UpdateSemesterAction` | Mesmo fluxo. Permite alterar ano, período e datas mesmo com registros vinculados. Grava `is_current = false` se o toggle vier desligado, inclusive no semestre que era o atual. |
| Definir como atual | `SetCurrentSemesterAction` | Desmarca os demais e marca o escolhido (com `lockForUpdate`). |
| Excluir | `DeleteSemesterAction` + `Semester::ensureCanBeDeleted` | Bloqueia se for o atual ou se `SemesterHasLinkedRecordsQuery` encontrar documentos ou PEIs. |
| Consultar atual | `CurrentSemesterQuery` | `where is_current = true ... sharedLock()->first()`, sem ordenação. |
| Encerrar | — | **Não existe.** Um semestre só deixa de ser atual quando outro é marcado. |
| Transição automática | — | **Não existe.** Nenhum comando agendado, listener ou cálculo por data. |

### 2.3 Como o período chega aos registros

- **Carimbo automático na criação, pelo marcador `is_current`:** `CreateStudentDocumentAction`, `CreateCaseStudyAction`, `CreatePaeeAction` e `CreatePeiAction`. Sem semestre atual, todas lançam exceção ("O sistema não possui semestre atual cadastrado"). O carimbo nunca é recalculado nas edições.
- **Escolha manual opcional:** matrícula em curso (`student_courses.semester_id`), em select com todos os semestres, ao lado de um `academic_year` independente.
- **Janela de datas:** `PeiAttendanceSummaryQuery` usa `start_date`/`end_date` do semestre do PEI para reunir atendimentos AEE, registros pedagógicos e devolutivas às famílias.
- **Filtros:** listagens gerais de PEI, Estudo de Caso e PAEE filtram por `semester_id` no servidor; a lista de opções é a mesma para os três (`PeiFilterOptionsQuery::semesters`).
- **Exibição:** rótulo do semestre nas visualizações, no prontuário do aluno, no Portal do Professor e nos PDFs.
- **Interface do aluno:** `StudentController::show` (painel de status) esconde os botões "Iniciar" de laudo, Estudo de Caso, PAEE e PEI quando não há semestre atual.

### 2.4 Registros históricos

O histórico é tratado por **versionamento por aluno** (`version` + `is_current` em `case_studies`, `paees` e `peis`), não por período. O semestre é só um atributo da versão, gravado na criação. Não há regra que impeça mudar os dados do semestre ao qual registros antigos apontam (ver P03), nem regra que proteja esses registros na exclusão do semestre (ver P01).

---

## 3. Inventário técnico

### 3.1 Backend do módulo

| Camada | Arquivos |
| --- | --- |
| Modelo | `app/Domains/Inclusion/Domain/Models/Semester.php` (`register`, `revise`, `markCurrentAsHistorical`, `ensureCanBeDeleted`, `ensureValidPeriod`; relações só com `studentDocuments` e `peis`) |
| DTOs | `app/Domains/Inclusion/Domain/DTOs/Semesters/{Create,Update}SemesterDTO.php` |
| Exceção | `app/Domains/Inclusion/Domain/Exceptions/InvalidSemester.php` |
| Data (validação) | `app/Domains/Inclusion/Application/Data/Semesters/{Create,Update,List}SemestersData.php` |
| Actions | `app/Domains/Inclusion/Application/Actions/Semesters/{Create,Update,Delete,SetCurrent}SemesterAction.php` |
| Queries | `app/Domains/Inclusion/Application/Queries/Semesters/{Current,List,Show}SemesterQuery.php`, `SemesterHasLinkedRecordsQuery.php` |
| Controller | `app/Domains/Inclusion/UI/Controllers/SemesterController.php` |
| Rotas | `routes/modules/inclusion.php:304-312` — `/inclusao/semestres`, nomes `specialized-educational-support.semesters.*`, permissões `semester.{view,create,update,delete}` |
| Navegação | `app/Shared/Infrastructure/Navigation/AppNavigation.php:131` |
| Relatório | `app/Domains/Inclusion/Infrastructure/Reporting/SemestersReportSource.php` |
| Auditoria | `Semester` implementa `Auditable`; registrado em `InclusionServiceProvider.php:99` |
| Seeder e factory | `database/seeders/Inclusion/SemesterSeeder.php`, `database/factories/Domains/Inclusion/SemesterFactory.php` |

### 3.2 Frontend do módulo

- Páginas: `resources/react/pages/Inclusion/Semesters/{Index,Show,Create,Edit}.tsx`.
- Componentes: `resources/react/components/Inclusion/Semesters/` — `List/{SemesterList,SemesterFilters,semesterColumns,SemesterCurrentNotice}`, `Form/{SemesterForm,useSemesterForm}`, `Details/{SemesterDetails,SemesterDetailsActions}`, `SemesterDeleteModal`, `Semesters.{types,constants,routes}.ts`.
- Os filtros são enviados ao servidor; não há filtro de período aplicado só no cliente.

### 3.3 Tabelas que referenciam `semesters`

| Tabela | Coluna | Nulo | FK e `ON DELETE` | Migration |
| --- | --- | --- | --- | --- |
| `student_documents` | `semester_id` | não | **sem FK** | `2026_02_16_132412_create_student_documents_table.php:27` |
| `peis` | `semester_id` | não | `CASCADE` | `2026_02_28_155512_create_peis_table.php:18` |
| `case_studies` | `semester_id` | não | `CASCADE` | `2026_10_03_150000_create_case_studies_table.php:15` |
| `paees` | `semester_id` | não | `CASCADE` | `2026_10_03_150400_create_paees_table.php:16` |
| `student_courses` | `semester_id` | sim | `SET NULL` | `2026_10_08_130000_add_semester_id_to_student_courses_table.php:12` |
| `student_contexts` (removida) | `semester_id` | não | `CASCADE` | criada em `2026_01_31_173716`, apagada em `2026_10_04_120200` |

Cadeias de cascata relevantes: `paees.case_study_id → case_studies` (`CASCADE`) e `peis.paee_id → paees` (`CASCADE`, `2026_10_04_120100_replace_student_context_with_paee_in_peis_table.php:17`).

### 3.4 Consumidores do semestre fora do módulo

| Uso | Arquivos |
| --- | --- |
| Carimbo pelo semestre atual | `Actions/StudentDocuments/CreateStudentDocumentAction.php:43`, `Actions/CaseStudies/CreateCaseStudyAction.php:52`, `Actions/Paees/CreatePaeeAction.php:59`, `Actions/Peis/CreatePeiAction.php:62` |
| Formulários que exigem o atual | `Queries/StudentDocuments/StudentDocumentFormQuery.php`, `Queries/Peis/PeiFormQuery.php:39` |
| Escolha manual | `Data/StudentCourses/{Create,Update}StudentCourseData.php`, `Queries/StudentCourses/StudentCourseFormQuery.php:71`, `components/Inclusion/StudentCourses/Form/StudentCourseEnrollmentFields.tsx:71` |
| Janela de datas | `Queries/Peis/PeiAttendanceSummaryQuery.php:81` (`withinSemester`) |
| Filtros de listagem | `Queries/Peis/{ListAllPeisQuery,ListStudentPeisQuery}.php`, `Queries/CaseStudies/ListCaseStudiesQuery.php:21`, `Queries/Paees/ListPaeesQuery.php:20`, opções em `Queries/Peis/PeiFilterOptionsQuery.php:28` |
| Painel de status do aluno | `UI/Controllers/StudentController.php:118`, `UI/Presenters/StudentPagePresenter.php:203-297` |
| Relatórios | `Infrastructure/Reporting/{StudentDocuments,Peis,PeiDisciplines,CaseStudies,Paees,Semesters}ReportSource.php` |
| PDFs | `resources/views/pages/inclusion/{case-studies,paees}/pdf.blade.php`, `peis/{pdf,pdf-complete,pdf-family}.blade.php`, `students/pdf.blade.php` |
| Ajuda | `resources/help/cadastros-do-atendimento.md` (seção Semestres), `pei.md`, `paee.md`, `fluxo-de-acompanhamento.md`, `alunos.md`, `alunos-responsaveis-e-documentos.md` |

Os caminhos curtos acima ficam em `app/Domains/Inclusion/Application/` ou `app/Domains/Inclusion/`.

### 3.5 Infraestrutura disponível para a evolução

- Tabela `settings` com uma linha por categoria e `payload` JSON (`2026_10_31_120000_create_settings_table.php`), enum `app/Domains/Settings/Domain/Enums/SettingCategory.php` e padrão de Value Object + Query + Action no domínio `Settings`. É o lugar natural da periodicidade.
- Fuso da aplicação: `config/app.php:68` (`America/Bahia`). `config/database.php` não define fuso para a conexão.

---

## 4. Matriz de integração

Classificação usada: **Permanente** (existe independentemente do período), **Carimbado** (documento com versão que pertence a um período), **Datado** (fato com data própria; o período pode ser derivado), **Configuração**.

| Módulo / entidade | Classe | Período necessário? | Integração hoje | Correta? | Problemas | Recomendação | Efeito em dados antigos |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Alunos, pessoas, responsáveis, perfis de atendimento | Permanente | Não | Nenhuma | Sim | — | Manter sem período. | Nenhum. |
| Matrícula em curso (`student_courses`) | Permanente com ano | Duvidoso | `academic_year` obrigatório + `semester_id` opcional e manual | Não | P09: sem significado definido, sem coerência com o ano; a matrícula é única por aluno e curso, então não guarda histórico por período | Definir o significado (D2). Na falta de uso claro, manter só `academic_year`. | Registros anteriores a 08/10/2026 têm `semester_id` nulo; não inferir. |
| Documentos do aluno | Carimbado (data de envio) | Sim, para organização | Carimbo pelo atual na criação | Parcial | P08, P10 (sem FK), P11 (edição mostra o atual) | Carimbar pela data de envio; criar FK `RESTRICT` depois de checar órfãos. | Carimbo atual preservado; checar órfãos antes da FK. |
| Solicitações de atendimento | Datado (`request_date`) | Só para filtro/relatório | Nenhuma | Sim | — | Derivar por data, sem FK. | Nenhum. |
| Estudo de Caso | Carimbado | Sim | Carimbo pelo atual | Parcial | P01 (cascata), P05 (relatório), P08 (`study_date` retroativa ignorada) | Carimbar pela `study_date`, ou pela criação na ausência dela; FK `RESTRICT`. | Preservar carimbo; listar divergências sem corrigir sozinho. |
| PAEE e revisões | Carimbado; revisões datadas | Sim (PAEE); não (revisões) | Carimbo pelo atual | Parcial | P01, P05 | Carimbar pela data de criação; revisões por `reviewed_at`. A revisão de 6 meses (`Paee.php:152`) é regra própria e continua independente do período. | Idem. |
| PEI, disciplinas e revisões do PEI | Carimbado (filhos herdam) | Sim | Carimbo pelo atual + janela de datas no acompanhamento | Parcial | P01, P06 | Carimbar pela criação; janela do acompanhamento conforme D3. Filhos continuam sem FK. | Janela dos PEIs antigos depende das datas dos semestres legados; não alterar essas datas. |
| Atendimentos (sessões, registros AEE, registros pedagógicos) | Datado (`session_date`, tipo `DATE`) | Só para filtro/consulta | Indireta, via acompanhamento do PEI | Parcial | P06, P07 (lacunas de datas deixam atendimentos fora) | Derivar por data. **Não** adicionar FK. Filtro opcional por período na listagem. | Nenhum: a data já classifica com segurança. |
| Agenda, conflitos, disponibilidade | Datado | Não | Nenhuma | Sim | — | Manter por mês/dia. | — |
| Pendências | Datado (`due_date`) | Não | Nenhuma | Sim | — | Manter. | — |
| Portal do Professor | Consumidor | Indireto | Mostra o rótulo do Estudo de Caso | Sim | — | Trocar o termo "Semestre" por "Período" se a periodicidade mudar. | — |
| Relatórios | Consumidor | Sim | Relações por `semester` em 6 fontes | Não | P05 | Corrigir `semester.label`; opcional: coluna "Período" derivada nas fontes datadas. | — |
| Dashboard | Consumidor | Opcional | Totais gerais e janela móvel de 6 meses | Sim | Não usa período, mas não está errado | Não mudar agora; seletor de período fica como evolução opcional. | — |
| PDFs | Consumidor | Exibição | Rótulo do semestre | Sim | Termo fixo "Semestre" | Usar o rótulo do período. | — |
| Radar Inclusivo (barreiras, vistorias, itens, empréstimos) | Institucional, datado | Não | Nenhuma | Sim | — | Não vincular: o Radar não é acadêmico. Relatórios por data bastam. | — |
| Publicações e site | Conteúdo | Não | Nenhuma | Sim | — | — | — |
| Cursos, disciplinas, professores e vínculos | Configuração | Não (por ora) | Nenhuma | Sim | — | Não versionar por período sem demanda explícita. | — |
| Auditoria | Transversal | Não | Campos `semester_id` exibidos via `AuditedField::reference(..., 'label')` | Sim | Exibição degrada se o semestre referenciado for apagado | Com FKs `RESTRICT`, deixa de ocorrer. | — |
| Configurações | Configuração | — | Não há configuração de período | — | — | Nova categoria `academic_periods`. | — |

---

## 5. Problemas e inconsistências

Gravidade: **Crítica** (perda de dados), **Alta** (dados errados ou operação bloqueada), **Média** (inconsistência com contorno), **Baixa** (UX, texto ou manutenção).

| ID | Gravidade | Tipo | Problema | Evidência |
| --- | --- | --- | --- | --- |
| P01 | Crítica | Comprovado | A exclusão de semestre apaga Estudos de Caso e PAEEs em cascata e, por encadeamento, PEIs de outros semestres. A matrícula perde o semestre sem aviso. | `SemesterHasLinkedRecordsQuery::execute` só verifica `studentDocuments` e `peis`; FKs `CASCADE` em `case_studies`, `paees`, `peis` e `paees.case_study_id`, `peis.paee_id`; `SET NULL` em `student_courses`. |
| P02 | Alta | Comprovado | O semestre atual é um marcador manual sem relação com as datas: se ninguém trocar, novos registros recebem um semestre já encerrado. | `CurrentSemesterQuery::execute`; não há checagem de `start_date`/`end_date` nem rotina de transição. |
| P03 | Alta | Comprovado | Ano, período e datas de semestres com registros vinculados podem ser editados. Isso renomeia o período de todos os registros e muda a janela do acompanhamento dos PEIs. | `UpdateSemesterAction::execute` não consulta `SemesterHasLinkedRecordsQuery`. |
| P04 | Alta | Comprovado | Editar o semestre atual com o toggle desligado deixa o sistema sem semestre atual e bloqueia a criação de laudos, Estudos de Caso, PAEEs e PEIs. | `Semester::attributesFrom` grava `is_current` do formulário; `SemesterForm.tsx` mostra o toggle "Este é o semestre atual" na edição. |
| P05 | Alta | Comprovado no código; erro de runtime não executado | Os relatórios de Estudos de Caso e PAEE leem `semester.name`. A coluna sai vazia e o filtro gera `whereHas('semester', name ...)` numa coluna inexistente. | `CaseStudiesReportSource.php:47`, `PaeesReportSource.php:48`; `EloquentReportSource::value` e `::applyFilter`. As demais fontes usam `semester.label`. |
| P06 | Média | Comprovado | O acompanhamento do PEI depende das datas do semestre: sem datas, **não filtra** e mostra todos os atendimentos da vida do aluno; com datas, ignora atendimentos posteriores, embora o PEI continue vigente. | `PeiAttendanceSummaryQuery::withinSemester`; `start_date`/`end_date` são opcionais. |
| P07 | Média | Comprovado | Não há validação de sobreposição ou lacuna entre semestres, nem de coerência entre o ano e as datas. O seeder cria lacunas (janeiro, julho e 16–31/12) em que atendimentos não entram no acompanhamento de nenhum PEI. | `Semester::ensureValidPeriod`; `SemesterSeeder.php`. |
| P08 | Média | Comprovado | O período vem do "atual no momento do salvamento", não da data do fato. Um Estudo de Caso com `study_date` no semestre anterior recebe o semestre corrente. | `CreateCaseStudyAction.php:52`; `study_date` aceita qualquer data (`CreateCaseStudyData.php:40`). |
| P09 | Média | Comprovado | Na matrícula, `semester_id` é opcional, manual e sem relação com `academic_year`. A matrícula é única por aluno e curso, então o campo não registra histórico. O significado do campo não está documentado. | `StudentCourse::register`/`revise`; `unique(student_id, course_id)` em `2026_02_06_154423`; `CreateStudentCourseData.php:40`. |
| P10 | Média | Comprovado | `student_documents.semester_id` não tem chave estrangeira; órfãos são possíveis. | `2026_02_16_132412_create_student_documents_table.php:27`. |
| P11 | Baixa | Comprovado | A edição de documento mostra no campo "Semestre Atual" o semestre atual do sistema, não o semestre do documento. | `StudentDocumentFormQuery::forUpdate` (linha 49); `StudentDocumentInfoFields.tsx:57`. |
| P12 | Baixa | Comprovado | A interface e a ajuda dizem que o semestre atual é "selecionado por padrão", mas na prática ele é obrigatório e não pode ser trocado. A ajuda descreve a regra de exclusão incompleta. | `SemesterCurrentNotice.tsx`; `resources/help/cadastros-do-atendimento.md:60,84`. |
| P13 | Baixa | Comprovado | Todo semestre não atual aparece como "Histórico", inclusive os futuros. | `semesterColumns.tsx` (coluna `status`). |
| P14 | Baixa | Comprovado | O seeder grava o rótulo `2026/1` (o modelo usa `2026.1`) e fixa 2026.1 como atual. | `SemesterSeeder.php`. |
| P15 | Baixa | Risco hipotético | A unicidade do semestre atual só existe na aplicação; `CurrentSemesterQuery` não ordena. Com dois atuais (importação, SQL manual), a escolha seria arbitrária. | `CurrentSemesterQuery.php`; migration sem restrição. |
| P16 | Baixa | Comprovado | "Período ∈ {1, 2}" está repetido em `CreateSemesterData`, `UpdateSemesterData`, `ListSemestersData`, `Semester::ensureValidPeriod`, `Semesters.constants.ts` e `SemesterForm.tsx` (`max={2}`). Mudar a periodicidade exige alterar todos esses pontos. | Arquivos citados. |
| P17 | Alta para restauração de banco antigo | Risco hipotético | Restaurar um banco antigo e rodar as migrations atuais: `2026_10_04_120100` adiciona `peis.paee_id` `NOT NULL` com FK, o que falha se já houver PEIs; `2026_10_04_120200` apaga `student_contexts` (que tinha `semester_id`) sem volta. | Migrations citadas. Depende da versão do banco restaurado. |

Problemas pesquisados e **não encontrados**: filtro de período aplicado só no frontend; regras de período diferentes entre módulos para o mesmo conceito (há uma única fonte, o marcador atual, com as falhas acima); semestres duplicados por ano e período (o banco impede com `unique(year, term)`).

---

## 6. Alternativas arquiteturais

### 6.1 Gerenciamento manual (estado atual, corrigido)

Manter o CRUD e corrigir P01–P05.

- A favor: menor mudança; permite datas reais da instituição.
- Contra: o problema principal (P02) depende de disciplina humana e continua existindo; o sistema para quando falta o atual (P04); a qualidade das datas depende de quem cadastra (P06, P07). Contraria o objetivo de reduzir trabalho manual.

### 6.2 Totalmente automático, sem persistência

Os períodos são só um cálculo (`ano`, `número`) sobre a data. Nenhuma tabela; cada registro guarda `period_year`/`period_term` ou nem isso.

- A favor: zero manutenção e nenhuma lacuna ou sobreposição possível.
- Contra: cinco tabelas já têm `semester_id` com FK, e relatórios, auditoria e PDFs leem `semester.label`. Abandonar a tabela exige migrar todas elas, sem ganho funcional. Não há como representar os semestres legados com datas próprias. Uma mudança de periodicidade reclassificaria retroativamente tudo o que não estiver gravado.

### 6.3 Híbrido: calendário calculado e materializado sob demanda (recomendado)

O calendário é calculado a partir de uma configuração única. Cada período, quando é necessário pela primeira vez, vira uma linha em `semesters`. O período atual é calculado pela data. Linhas antigas, legadas ou geradas nunca são reescritas.

| Critério | Manual | Automático puro | Híbrido materializado |
| --- | --- | --- | --- |
| Trabalho do usuário | Alto e recorrente | Nenhum | Uma configuração |
| Período atual correto | Depende de pessoa | Sempre | Sempre |
| Lacunas e sobreposições | Possíveis | Impossíveis | Impossíveis nos períodos gerados |
| Compatível com FKs existentes | Sim | Não | Sim |
| Preserva legados | Sim | Não | Sim |
| Mudança de periodicidade | N/A | Reescreve o passado | Vale só para anos futuros |
| Tarefa agendada | Não | Não | Não |
| Tamanho da mudança | Pequeno | Grande | Médio |

### 6.4 Respostas às perguntas da seção 5 do pedido

- **O usuário precisa criar períodos?** Não. Para um calendário único e regular, o cadastro manual só introduz erro.
- **Podem ser calculados?** Sim, com ano civil e duração fixa (6, 3 ou 2 meses), por aritmética simples: `número = floor((mês − 1) / meses_por_período) + 1`.
- **É preciso persistir?** Sim, mas só por compatibilidade e estabilidade: FKs, rótulos em auditoria, relatórios e congelamento do histórico. Grava-se sob demanda, sem pré-gerar anos futuros.
- **Período atual:** `resolver(hoje)` no fuso da aplicação. O marcador `is_current` deixa de ser fonte de verdade.
- **Transição:** é implícita. No primeiro uso em 1º de julho, o resolvedor cria ou encontra o período 2 e passa a retorná-lo. Nenhum cron.
- **Proteger períodos históricos:** linhas de período não são editáveis nem excluíveis pela interface, e as FKs passam a `RESTRICT`. Os registros já seguem as próprias travas (Estudo de Caso concluído, PEI finalizado, versões históricas).
- **Cadastros retroativos:** o período vem da data de referência do registro (seção 8.4), então um Estudo de Caso datado de maio, registrado em agosto, fica no período de maio.
- **Mudança de periodicidade:** só vale a partir de 1º de janeiro de um ano futuro. Dentro de um ano existe uma única periodicidade, o que mantém `unique(year, term)` válido e evita períodos sobrepostos. Anos passados não mudam.
- **Primeiro ano de uso:** o calendário se aplica a partir de um **ano de adoção**. Datas anteriores a ele só encontram período se houver semestre legado que as cubra; caso contrário, ficam sem período (seção 9).
- **Ajustes manuais excepcionais:** não há necessidade comprovada. O período no GinAI é uma forma de organizar os registros, não o calendário acadêmico oficial. Datas reais de aula, greves e reposições não precisam ser refletidas. Se surgir demanda, a exceção mínima seria ajustar datas de um período **futuro** que ainda não tenha registros; não é recomendada na primeira entrega.
- **Ano civil × data inicial configurável:** uma data inicial livre (por exemplo, 01/02) faz o 2º semestre atravessar o ano (agosto a janeiro). Isso deixa o rótulo ambíguo, exige guardar a âncora e muda o "ano" de registros de janeiro. O ano civil cobre o ano inteiro sem lacunas, é previsível e coincide com os exemplos do pedido. Se a instituição precisar mesmo de outro início, a forma menos danosa é um **mês de início** (não uma data), aplicado do mesmo jeito: só em anos futuros (D1).
- **Bimestres e trimestres:** o mesmo cálculo cobre qualquer duração que divida 12. Na prática, PAEE (revisão de 6 meses) e PEI funcionam em ritmo semestral; bimestres criariam seis períodos por ano para documentos que raramente mudam nesse intervalo, sem benefício claro para os filtros. Recomenda-se oferecer semestral (padrão) e trimestral, e bimestral só se houver demanda (D1).

---

## 7. Pesquisa de referências externas

A pesquisa se limitou a documentação oficial, especificações e código-fonte público. **[C]** indica o que a fonte confirma; **[I]**, inferência desta auditoria.

### 7.1 Fontes consultadas

| Sistema | Fontes |
| --- | --- |
| Canvas LMS | Código: [`enrollment_term.rb`](https://raw.githubusercontent.com/instructure/canvas-lms/master/app/models/enrollment_term.rb), [`account.rb`](https://raw.githubusercontent.com/instructure/canvas-lms/master/app/models/account.rb), [`course.rb`](https://raw.githubusercontent.com/instructure/canvas-lms/master/app/models/course.rb). Documentação: [API Enrollment Terms](https://canvas.instructure.com/doc/api/enrollment_terms.html), [Yale: term dates vs course dates](https://help.canvas.yale.edu/a/714572-term-dates-vs-course-dates-concluding-resetting-courses) |
| Moodle | [Course settings](https://docs.moodle.org/405/en/Course_settings), [Course overview](https://docs.moodle.org/405/en/Course_overview) |
| Gibbon | Repositório [GibbonEdu/core](https://github.com/GibbonEdu/core) (v28): `gibbon.sql`, `modules/School Admin/schoolYear_manage*.php`, `modules/User Admin/rollover.php` |
| OpenEMIS Core | [Documentação de períodos acadêmicos](https://support.openemis.org/core/?p=1931). O código (`AcademicPeriodsTable.php`) foi lido num fork público, não no repositório oficial; deve ser tratado como espelho. |
| openSIS | Artigos de ajuda em `help.opensis.com` sobre configuração de *marking periods* e *rollover* de ano letivo |
| RosarioSIS | [School Administrator Handbook](https://www.rosariosis.org/documentation/school-administrator-handbook/) e código-fonte `functions/GetMP.php` |
| OneRoster 1.2 (1EdTech) | [Rostering Information Model](https://www.imsglobal.org/spec/oneroster/v1p2/rostering/info) |
| Ed-Fi | Repositório Ed-Fi-ODS, Data Standard 5.2.0: `Ed-Fi-Core.xsd` e `0020-Tables.sql` |
| Google Classroom | [Manage grading periods](https://developers.google.com/classroom/grading-periods/manage-grading-periods) |

Não foram consultados: Microsoft School Data Sync (a página de *academic sessions* retornou 404), Fedena e SchoolTool (sem documentação técnica pública encontrada).

### 7.2 O que as fontes mostram

| Tema | Achados |
| --- | --- |
| Persistência | [C] Todos os sistemas pesquisados guardam o período como linha com nome e datas: `EnrollmentTerm` (Canvas), `gibbonSchoolYear`/`gibbonSchoolYearTerm` (Gibbon), `academic_periods` (OpenEMIS), `AcademicSession` (OneRoster), `Session` (Ed-Fi). Nenhuma fonte gera períodos só pela periodicidade sem gravá-los. |
| Período atual por data | [C] O Canvas não tem marcador de atual: usa escopos `started`, `ended`, `not_ended` e `not_started`, derivados de `start_at`/`end_at`; as datas decidem se o curso aparece como atual ou passado. [C] No RosarioSIS, `GetCurrentMP` busca o período cuja faixa contém a data e, se não houver, mostra "You are not currently in a marking period". [C] No Moodle, o curso fica "In progress" ou "Past" conforme a data atual e as datas do curso. |
| Período atual por marcador | [C] Gibbon (`status` Past/Current/Upcoming, com "Enforces a single current school year"), OpenEMIS (`current`, zerando os demais ao salvar) e Ed-Fi (`CurrentSchoolYear`). Nos dois primeiros, a virada acontece por uma ação administrativa de **rollover**. O Gibbon alerta que mudar o ano à mão pode afetar a visibilidade de dados e recomenda o rollover. |
| Transição | [C] openSIS e RosarioSIS fazem a virada por rollover, que reproduz a estrutura de períodos no ano seguinte; o administrador informa as datas novas. O rollover do openSIS é irreversível. |
| Exclusão | [C] O Canvas faz exclusão lógica e recusa apagar o term padrão ou um term com cursos ativos ("Cannot delete a term with active courses"). [C] O Gibbon não exclui o ano atual. [C] O OneRoster usa `status = tobedeleted`, sem obrigar a exclusão física. |
| Histórico | [C] No Canvas, cursos encerrados pelas datas do term continuam visíveis, mas não editáveis. [C] O OpenEMIS separa `editable` (congela edição) de `visible` (oculta). [C] openSIS e RosarioSIS têm seletor de ano para consultar períodos passados. |
| Sobreposição | [C] O RosarioSIS proíbe sobreposição entre períodos do mesmo nível; o Google Classroom exige períodos sem sobreposição e em ordem. |
| Registros sem período e legados | [C] O Canvas cria um "Default Term" (`first_or_create`) e atribui a ele todo curso sem term. [C] O RosarioSIS tem "History Marking Periods" para notas anteriores à implantação ou de alunos transferidos. [C] O Google Classroom, ao aplicar períodos a tarefas existentes, vincula cada tarefa ao período cuja faixa contém a data de entrega; a tarefa sem data correspondente fica sem período. |
| Tipos e hierarquia | [C] O OneRoster define `schoolYear`, `semester`, `term` e `gradingPeriod` num enum extensível, com `parent` opcional e datas inclusivas. [C] O openSIS usa a hierarquia Full Year → Semester → Quarter → Progress Period. [C] O Ed-Fi recomenda datas inclusivas. |

### 7.3 O que se aplica ao GinAI

| Prática | Fontes | Aplicação |
| --- | --- | --- |
| Período persistido, com FK nos registros | Canvas, Gibbon, OneRoster, Ed-Fi | Confirma a decisão de manter a tabela `semesters` e materializar os períodos (seção 8.3). |
| Período atual derivado da data | Canvas, RosarioSIS, Moodle | Base da eliminação do `is_current` manual (P02, P04). |
| Marcador manual exige rollover administrativo | Gibbon, OpenEMIS, openSIS | Mostra o custo do modelo atual: quem usa marcador também precisa de uma ação periódica de virada, que é justamente o trabalho manual que se quer eliminar. |
| Bloquear exclusão com vínculos e preferir exclusão lógica | Canvas, Gibbon, OneRoster | Sustenta a correção de P01 e a remoção da exclusão pela interface. |
| Período encerrado visível e só leitura | Canvas, OpenEMIS, openSIS/RosarioSIS | Sustenta a tela de consulta (seção 10) e a regra de carimbo imutável após conclusão. |
| Sem sobreposição; regra explícita para datas fora de qualquer período | RosarioSIS, Google Classroom | O calendário calculado garante cobertura sem lacunas a partir da adoção; antes dela, "Período não identificado". |
| Atribuir registros existentes pela data | Google Classroom | Apoia a classificação por data **só** para registros sem período (seção 9.3). |
| Períodos de histórico para dados anteriores à implantação | RosarioSIS | Análogo à marcação `source = legacy` dos semestres existentes. |
| Período padrão para o que não tem período | Canvas | Avaliado e não adotado: no GinAI, um período artificial apareceria em filtros e relatórios como se fosse real. `NULL` com rótulo explícito separa "desconhecido" de "período" (seção 9.3). |

Não aplicável, por complexidade sem necessidade comprovada: hierarquia ano → semestre → bimestre (openSIS, OneRoster `parent`), períodos por curso ou turma (Google Classroom, *overrides* de datas do Canvas) e descritores configuráveis do Ed-Fi.

[I] Gerar o calendário a partir da periodicidade, sem cadastro e sem rollover, é uma adaptação desta auditoria. Nenhuma das fontes faz exatamente isso; o mais próximo é o rollover do openSIS, que copia a estrutura e pede só as datas. A adaptação é viável no GinAI porque o período é usado para organizar os registros, não para controlar notas ou frequência, como nesses sistemas.

---

## 8. Proposta arquitetural recomendada

### 8.1 Configuração

- Nova categoria `academic_periods` em `SettingCategory`, payload `{ "periodicity": "semester" | "trimester" | "bimester", "adopted_from_year": 2027, "changes": [{ "from_year": 2028, "periodicity": "trimester" }] }`. O histórico de mudanças é necessário para resolver datas de anos passados com a periodicidade da época.
- Padrão: semestral, que é compatível com todos os dados existentes.
- Tela: um bloco em **Configurações** com a periodicidade vigente, a do próximo ano e o aviso de que a mudança só vale a partir de 1º de janeiro seguinte.

### 8.2 Calendário (domínio puro, sem banco)

Um Value Object/serviço, por exemplo `AcademicCalendar`, com `periodFor(CarbonImmutable $date): PeriodSpec` (`year`, `term`, `start`, `end`, `periodicity`, rótulo curto `2026.2`, rótulo longo `2º semestre de 2026`). As durações são 6, 3 ou 2 meses, alinhadas a janeiro. O cálculo centraliza a regra hoje espalhada (P16).

### 8.3 Resolvedor com materialização

`ResolveAcademicPeriod::forDate($date): ?Semester`:

1. Se a data for anterior ao ano de adoção: procurar um semestre **legado** cujo intervalo contenha a data. Havendo exatamente um, retorná-lo. Caso contrário, retornar `null` (período não identificado). Nunca criar.
2. Se não: calcular `PeriodSpec` e buscar por `(year, term)`. Se não existir, inserir (`insertOrIgnore` + nova leitura, para suportar concorrência com `unique(year, term)`).
3. `currentPeriod()` é `forDate(today())` no fuso `config('app.timezone')`.

Mudanças na tabela `semesters` (nome mantido para não mexer em rotas, permissões e FKs; na interface passa a se chamar "Período letivo"):

- `periodicity` (string) e `source` (`legacy` | `generated`).
- `is_current` deixa de ser gravado e passa a ser derivado; a coluna pode ser removida numa fase de limpeza.
- `label` gravado de forma uniforme na geração.

### 8.4 Regra de carimbo

| Registro | Data de referência | Quando o período é (re)calculado |
| --- | --- | --- |
| Documento do aluno | Data de envio (`created_at`, no fuso da aplicação) | Só na criação |
| Estudo de Caso | `study_date`; na falta, data de criação | Na criação e quando `study_date` mudar enquanto o estudo não estiver concluído |
| PAEE | Data de criação | Só na criação |
| PEI | Data de criação | Só na criação |
| Matrícula | Conforme D2 | — |

Regras gerais:

- O período de um registro concluído, finalizado ou histórico nunca muda.
- Sem período resolvível (data anterior à adoção e sem legado que a cubra), o registro é aceito com período nulo e exibido como "Período não identificado", sem bloquear o fluxo. Para registros novos isso não acontece, porque a data de hoje sempre resolve.
- A ausência de "semestre atual" deixa de bloquear qualquer operação, o que elimina P04 e as condições `hasCurrentSemester` do painel do aluno.

### 8.5 Registros datados

Atendimentos, registros pedagógicos e AEE, solicitações, revisões de PAEE e PEI e empréstimos **não** recebem FK. O filtro por período vira `whereBetween(data, período.start, período.end)` por meio de um único helper reutilizável (escopo ou método de Query). Assim, nenhuma tabela permanente é alterada.

### 8.6 Integridade

- Todas as FKs para `semesters` passam a `RESTRICT`, e `student_documents.semester_id` ganha FK.
- Períodos não são excluídos nem editados pela interface. A exclusão de um período legado sem registros pode continuar para administradores, com checagem completa em todas as tabelas.
- `SemesterHasLinkedRecordsQuery` cobre todas as tabelas referenciadas, enquanto existir.

### 8.7 Justificativa

A proposta resolve P01–P08 e P16 com uma regra única e mantém o modelo relacional atual. Não exige agendador, não reescreve dados antigos e não adiciona colunas a tabelas permanentes. É menor que um "gerenciador de calendários": uma configuração, um cálculo e uma tabela que já existe.

---

## 9. Estratégia para dados legados

### 9.1 O que se pode afirmar sem ver os dados

| Tabela | Situação do período | Classificável com segurança? |
| --- | --- | --- |
| `peis`, `case_studies`, `paees` | Sempre têm `semester_id` (NOT NULL) desde a criação das tabelas | O vínculo existe, mas pode estar **errado**, porque veio do marcador manual (P02, P08). |
| `student_documents` | NOT NULL, sem FK | Idem; e pode haver órfãos (P10). |
| `student_courses` | Nulo para registros anteriores a 08/10/2026 e opcional depois | Só o **ano** (`academic_year`) é confiável. O semestre não pode ser inferido. |
| Sessões, registros AEE e pedagógicos | Sem FK, com `session_date` (`DATE`) | Sim, pela data, sem migração. |
| Solicitações, revisões, empréstimos | Sem FK, com data própria | Sim, pela data, sem migração. |
| `semesters` | Datas opcionais, rótulos `2026.1` ou `2026/1`, possíveis lacunas e sobreposições | Exige diagnóstico. |

### 9.2 Diagnóstico somente leitura (antes de qualquer migração)

Executar no banco de produção ou no banco restaurado, **antes** de rodar novas migrations, e anexar o resultado ao plano. Todas as consultas são `SELECT`.

```sql
-- Semestres sem datas, com rótulo fora do padrão ou mais de um atual
SELECT id, year, term, label, start_date, end_date, is_current
FROM semesters
WHERE start_date IS NULL OR label IS NULL OR label <> CONCAT(year, '.', term);
SELECT COUNT(*) AS atuais FROM semesters WHERE is_current = 1;

-- Semestres com datas sobrepostas
SELECT a.id, a.label, b.id, b.label
FROM semesters a JOIN semesters b ON a.id < b.id
WHERE a.start_date <= b.end_date AND b.start_date <= a.end_date;

-- Registros cuja data de criação está fora das datas do semestre carimbado
SELECT 'peis' AS tabela, p.id, p.created_at, s.label
FROM peis p JOIN semesters s ON s.id = p.semester_id
WHERE s.start_date IS NOT NULL AND DATE(p.created_at) NOT BETWEEN s.start_date AND s.end_date;
-- repetir para case_studies (preferindo study_date), paees e student_documents

-- Documentos com semestre inexistente
SELECT d.id FROM student_documents d LEFT JOIN semesters s ON s.id = d.semester_id WHERE s.id IS NULL;

-- Matrículas sem semestre ou com semestre de outro ano
SELECT sc.id, sc.academic_year, s.year
FROM student_courses sc LEFT JOIN semesters s ON s.id = sc.semester_id
WHERE sc.semester_id IS NULL OR s.year <> sc.academic_year;
```

### 9.3 Alternativas para dados sem período ou com período duvidoso

| Alternativa | Avaliação |
| --- | --- |
| Atribuir ao período atual | **Rejeitada.** Falsifica o histórico. |
| Classificar pela data | Adequada para registros **sem** período e com data confiável. Para registros que já têm período, só como diagnóstico: o período gravado reflete uma decisão operacional da época e não deve ser sobrescrito automaticamente. |
| Período artificial "Legado" | **Não recomendada.** Polui filtros e relatórios, não tem datas e mistura "desconhecido" com um valor. |
| Relacionamento opcional (`NULL` = não identificado) | **Recomendada** para o que não puder ser classificado, com rótulo explícito na interface e filtro "Sem período". Tornar `semester_id` anulável em `case_studies`, `paees`, `peis` e `student_documents` só se uma importação realmente trouxer registros sem período. |
| Revisão manual guiada | Para as divergências do diagnóstico 9.2: gerar uma lista e deixar a decisão com a equipe. Correções viram registros auditados. |

### 9.4 Sequência de migração segura

1. Backup completo (o domínio `Backup` já existe) e diagnóstico 9.2.
2. Trocar as FKs para `RESTRICT`. Esta etapa não perde dados e pode ser feita antes de todo o resto.
3. Adicionar `periodicity` e `source` a `semesters` e marcar todas as linhas existentes como `legacy`, sem alterar datas nem rótulos dos semestres que têm registros. Uniformizar o rótulo só onde não houver vínculos, ou só na exibição.
4. Definir o **ano de adoção**. Recomenda-se o ano seguinte ao deploy, ou o ano corrente se o deploy ocorrer em janeiro. Os períodos do ano de adoção em diante são gerados. Se já existir um legado com o mesmo `(year, term)` no ano de adoção, ele é **reaproveitado** com suas datas (ver D4).
5. Criar a FK de `student_documents` só depois de resolver os órfãos.
6. Não tocar em `student_courses.semester_id` até D2.

### 9.5 Restauração de um banco antigo de produção

- Descobrir a versão do esquema pela tabela `migrations` **antes** de rodar `migrate`.
- Se o banco for anterior a `2026_10_04_120100`, a migration do `paee_id` tende a falhar com PEIs existentes, e `2026_10_04_120200` apagará `student_contexts`, onde estava parte do histórico com semestre (P17). Isso exige um plano de migração próprio, fora do escopo desta auditoria.
- Rodar o diagnóstico 9.2 no banco restaurado e comparar com o atual antes de qualquer mescla.

---

## 10. Impactos futuros no backend e no frontend

### Backend

- Novo: `AcademicCalendar` (domínio), `ResolveAcademicPeriod` (Application/Queries ou Actions), categoria `academic_periods` em `Settings` (Value Object, Data, Query e Action, seguindo o padrão de `BackupSettings`).
- Substituir `CurrentSemesterQuery` nos quatro `Create*Action` e em `PeiFormQuery` e `StudentDocumentFormQuery` pelo resolvedor por data de referência.
- Remover `CreateSemesterAction`, `UpdateSemesterAction`, `SetCurrentSemesterAction`, os Data de criação e edição e as rotas `create`, `store`, `edit`, `update` e `setCurrent`. Manter `index`, `show` e, opcionalmente, `destroy` restrito. Os nomes de rota e a permissão `semester.view` continuam iguais. `semester.create` e `semester.update` ficam obsoletas; removê-las exige atualizar os cargos.
- `StudentController`/`StudentPagePresenter`: retirar `hasCurrentSemester`.
- `PeiAttendanceSummaryQuery`: janela conforme D3, sempre com datas.
- Relatórios: `semester.label` em `CaseStudiesReportSource` e `PaeesReportSource`. Rótulo da relação passa a "Período".
- Migrations: FKs `RESTRICT`, FK em `student_documents`, colunas novas em `semesters`.
- Seeder e factory: gerar pelo calendário, sem atual fixo.

### Frontend

- `Semesters/`: a listagem vira consulta, com o período atual em destaque, os anteriores, contagem de registros e links para as listagens filtradas. Remover formulário, toggle, "Definir como atual" e o aviso `SemesterCurrentNotice`. Status: "Atual", "Encerrado" e, se existir, "Futuro".
- Formulário de documento: mostrar o período do documento na edição (P11).
- Matrícula: campo conforme D2.
- Filtros de PEI, Estudo de Caso e PAEE: manter "Todos" como padrão, para não esconder o histórico, e acrescentar o atalho "Período atual" e a opção "Sem período". Filtro por período nas listagens de atendimentos fica opcional.
- Termo "Semestre" → rótulo vindo do servidor ("Semestre" ou "Trimestre"), inclusive nos PDFs e nas colunas.
- Ajuda: atualizar `cadastros-do-atendimento.md`, `pei.md`, `paee.md`, `fluxo-de-acompanhamento.md`, `alunos.md` e `alunos-responsaveis-e-documentos.md`.

---

## 11. Riscos e pontos de atenção

| Risco | Tipo | Mitigação |
| --- | --- | --- |
| Perda de dados ao excluir semestre (P01) | Comprovado, presente hoje | Corrigir antes de qualquer outra etapa. |
| Registros já carimbados no semestre errado | Hipotético (depende do uso real) | Diagnóstico 9.2 e revisão manual. Nunca corrigir em massa. |
| Mudança de periodicidade no meio do ano | Hipotético | Só vale a partir do ano seguinte; registrar o histórico na configuração. |
| Limites de período e fuso | Hipotético | Usar `DATE` e o fuso da aplicação; intervalo fechado `[start, end]`; derivar a data de `created_at` com `->timezone(config('app.timezone'))->toDateString()`. |
| Concorrência na criação sob demanda | Hipotético | `unique(year, term)` + `insertOrIgnore` + releitura. |
| Dependência excessiva do "atual" | Comprovado (P02, P04) | O atual passa a ser derivado; nenhuma operação depende dele existir. |
| Janela do acompanhamento do PEI mudar para PEIs antigos | Hipotético | Não alterar datas de legados; mudar a regra (D3) só para novos ou deixar explícito na ajuda. |
| Adicionar período a tabelas permanentes sem necessidade | Recomendação | Seguir a matriz (seção 4): só carimbados têm FK. |
| Rótulos `2026/1` × `2026.1` em filtros por texto | Comprovado (P14) | Uniformizar na exibição ou em linhas sem vínculo. |
| Restauração de banco antigo | Hipotético (P17) | Seção 9.5. |
| Termo "semestre" em textos, permissões e nomes internos | Comprovado | Trocar só a interface; nomes internos e de permissão ficam estáveis (regra do `AGENTS.md`). |

---

## 12. Plano de evolução

| Fase | Conteúdo | Dependências | Tamanho |
| --- | --- | --- | --- |
| 0. Correções imediatas | P01 (FKs `RESTRICT` + checagem completa), P05 (`semester.label`), bloquear edição de ano, período e datas com vínculos (P03), impedir desmarcar o atual (P04), P11 e textos da ajuda (P12) | Nenhuma | Pequeno |
| 1. Diagnóstico | Rodar 9.2 em produção ou no banco restaurado; decidir D2–D4 | Acesso ao banco | Pequeno |
| 2. Calendário | Configuração, `AcademicCalendar`, resolvedor, colunas `periodicity`/`source`, marcação de legados, período atual derivado; os cadastros passam a usar o resolvedor | Fase 1 | Médio |
| 3. Interface de consulta | Tela de períodos só leitura, filtros com "Período atual" e "Sem período", rótulos genéricos, ajuda | Fase 2 | Médio |
| 4. Carimbo por data de referência | `study_date` no Estudo de Caso; janela do PEI conforme D3; FK de `student_documents` | Fase 2 | Pequeno |
| 5. Consultas por período em datados (opcional) | Filtro de período em atendimentos, solicitações e relatórios | Fase 2 | Pequeno |
| 6. Limpeza | Remover `is_current`, as actions e rotas de CRUD e as permissões obsoletas | Fases 2–4 estáveis | Pequeno |

A fase 0 vale por si só, mesmo que a arquitetura proposta não seja adotada.

---

## 13. Decisões pendentes

| ID | Decisão | Recomendação |
| --- | --- | --- |
| D1 | Periodicidades oferecidas e se o mês de início será configurável | Semestral (padrão) e trimestral, alinhadas a janeiro. Bimestral e mês de início configurável só com demanda concreta. |
| D2 | O que `student_courses.semester_id` significa: período de ingresso, período corrente da matrícula ou nada | Se não houver uso claro, deixar de exibir e manter só `academic_year`, preservando os valores gravados. |
| D3 | Janela do acompanhamento do PEI: período de criação (hoje) ou vigência do PEI (da criação até ser substituído ou finalizado) | Vigência, porque o PEI pode permanecer atual por mais de um período. Exige confirmar a leitura da Portaria MEC 421/2026 citada no código. |
| D4 | Ano de adoção e tratamento dos semestres legados do ano de adoção com datas diferentes do calendário (por exemplo, 01/02–30/06) | Congelar os legados como estão e reaproveitá-los se tiverem o mesmo ano e período; o calendário calculado vale para os períodos ainda não materializados. |

---

## 14. Conclusão

O módulo atual resolve uma necessidade real, que é saber a que período um documento pertence, mas com um mecanismo frágil: um marcador manual, desligado do calendário, com edição e exclusão que podem reescrever ou apagar o histórico. A integração "incompleta" não pede FKs novas em todo o sistema. A maior parte dos dados restantes já tem uma data, e a data é a melhor fonte de período.

Recomendação final para o GinAI:

1. Corrigir já a exclusão em cascata e os relatórios (fase 0).
2. Adotar um **calendário único, calculado a partir de uma configuração**, com períodos **materializados sob demanda** na tabela existente, período atual **derivado da data** e mudança de periodicidade **só para anos futuros**.
3. Carimbar apenas Estudos de Caso, PAEEs, PEIs e documentos, pela **data de referência**. Filtrar todo o resto por intervalo de datas.
4. Preservar os semestres e os carimbos legados, tratar o desconhecido como "Período não identificado" e nunca reclassificar em massa.
5. Transformar a tela de semestres numa área de consulta, sem CRUD.

---

## Limitações desta auditoria

- Nenhum banco foi consultado. O estado real dos dados (semestres sem datas, divergências, órfãos, duplicidade do atual) é desconhecido; as consultas da seção 9.2 servem para levantá-lo.
- O comportamento em runtime (por exemplo, o erro de SQL em P05) foi deduzido do código, não executado.
- Não foi possível verificar a versão do esquema de um eventual banco antigo de produção.
- A interpretação normativa da janela do PEI (D3) depende de leitura jurídica da Portaria citada no código, não verificada aqui.
