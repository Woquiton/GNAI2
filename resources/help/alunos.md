---
titulo: Alunos e prontuário
resumo: Como cadastrar e editar alunos, definir a situação e o tipo de acompanhamento, consultar o prontuário, vincular cursos, gerar a ficha em PDF e excluir um cadastro.
categoria: Atendimento
palavras-chave: aluno, alunos, estudante, cadastrar aluno, novo aluno, matrícula, cpf, foto do aluno, editar aluno, status do aluno, ativo, trancado, concluído, desistente, atendimento completo, prontuário, ficha do aluno, abas, histórico, pdf do aluno, ficha em pdf, curso do aluno, vincular curso, matricular em curso, curso atual, tornar atual, ano letivo, período do curso, semestre do aluno, frequência escolar, disciplinas com reprovação, risco de insucesso, dependência, dependências, aprovada na dependência, reprovação por semestre, excluir aluno, remover aluno, laudo, status do atendimento, tutorial, tour, como usar a tela de alunos
ordem: 10
permissoes: student.view
---

O cadastro de alunos reúne os dados pessoais e acadêmicos de cada estudante atendido pelo núcleo e dá acesso ao prontuário, onde ficam responsáveis, perfis de atendimento, cursos, documentos, planos e o histórico de atendimentos. A tela fica em **Atendimento → Alunos**.

## Conhecer as telas de alunos com o tutorial

A listagem, o cadastro, a edição e o prontuário do aluno têm um tutorial na própria tela, assim como as telas de cursos do aluno. Clique no botão com o ícone de informação, na barra do topo, para abrir. Na listagem, ele mostra os filtros, o botão de colunas, como ajustar a largura das colunas e a quantidade de registros por página. No prontuário, ele mostra o resumo, os cards de **Status do atendimento**, as abas e os botões do rodapé. Veja como navegar pelo tutorial em [Conhecer a tela com o tutorial](/ajuda/primeiros-passos#conhecer-a-tela-com-o-tutorial).

## Encontrar um aluno na listagem

A listagem mostra **Nome**, **Telefone**, **E-mail**, **Situação**, **Tipo de acompanhamento** e **Ingresso**. Pelo seletor de colunas é possível exibir também **Matrícula**, **CPF**, **Nascimento**, **Idade** e **Gênero**.

1. Acesse **Atendimento → Alunos**.
2. Use os filtros **Nome do aluno**, **Situação** e **Curso**. Em **Mais filtros** há **Tipo de acompanhamento**, **Telefone**, **E-mail** e **Perfil de atendimento**. A opção **Não informado** do acompanhamento localiza cadastros que precisam de revisão.
3. Nos filtros de curso e de perfil, as opções **Sem curso** e **Sem perfil de atendimento** mostram os alunos ainda sem esse vínculo.

> **Importante:** usuários vinculados a um cadastro de professor veem apenas os alunos dos cursos em que lecionam.

## Cadastrar um aluno

1. Acesse **Atendimento → Alunos** e clique em **Cadastrar**.
2. Preencha a seção **Dados Pessoais** e, se quiser, adicione a **Foto do Aluno**.
3. Preencha a seção **Dados Acadêmicos**, escolhendo **Em acolhimento** quando estiver registrando a demanda inicial ao núcleo, ou a outra situação adequada.
4. Clique em **Salvar**. O sistema abre o prontuário do aluno e mostra "Aluno cadastrado com sucesso.".

| Campo | Observação |
| --- | --- |
| **Nome Completo** (obrigatório) | Entre 3 e 255 caracteres. |
| **E-mail** (obrigatório) | Usado também para avisos de agendamentos. |
| **CPF** | Opcional. Precisa ser válido e não pode estar cadastrado para outra pessoa. |
| **Data de Nascimento** (obrigatório) | Não pode estar no futuro. |
| **Gênero** (obrigatório) | Masculino, Feminino, Outro ou Não informado. |
| **Telefone** | Opcional, com DDD (10 ou 11 dígitos). |
| **Endereço** | Opcional, em editor de texto. |
| **Matrícula** (obrigatório) | Até 50 caracteres; não pode repetir a de outro aluno. |
| **Data de Ingresso** | Opcional; não pode ser anterior à data de nascimento. |
| **Situação do aluno** | Ativo, Em acolhimento, Trancado, Concluído ou Desistente. |
| **Tipo de acompanhamento** | Somente AEE, Somente pedagógico ou AEE e pedagógico. Obrigatório para alunos ativos. |

A **Situação do aluno** pode ser escolhida no cadastro e alterada na edição. O padrão continua **Ativo**. Use **Em acolhimento** para registrar um aluno cuja demanda inicial ainda está sendo recebida ou analisada pelo núcleo. Para alunos ativos, o **Tipo de acompanhamento** é obrigatório; em acolhimento, pode ficar como **Não informado**.

### Foto do aluno

Clique no círculo da foto, arraste uma imagem para ele ou use a câmera (no celular abre a câmera do aparelho; no computador, a webcam). A foto deve estar em JPG ou PNG e ter no máximo 2 MB. Enquanto a imagem é preparada, o botão **Salvar** fica indisponível.

## Editar os dados ou a situação de um aluno

1. Abra o prontuário do aluno pela listagem (ação de visualizar).
2. No rodapé, clique em **Editar**.
3. Altere os campos necessários. O campo **Situação do aluno** (obrigatório) permite alterar a situação escolhida no cadastro. O **Tipo de acompanhamento** deve estar preenchido para manter ou tornar o aluno ativo.
4. Para trocar a foto, envie outra imagem; para retirá-la, use a remoção no próprio campo da foto.
5. Clique em **Salvar**. O sistema mostra "Aluno atualizado com sucesso.".

### O que significa cada situação

| Situação | Efeito no sistema |
| --- | --- |
| **Em acolhimento** | Permite cadastrar somente solicitações de atendimento, com seus anexos e análise. Bloqueia novos vínculos, empréstimos, fila de recursos, agendamentos, registros de atendimento e planos. A mudança para Ativo é manual, com definição do tipo de acompanhamento. |
| **Ativo** | Permite novos registros e agendamentos compatíveis com o tipo de acompanhamento. |
| **Trancado**, **Concluído** ou **Desistente** | O aluno fica inativo: não pode ser agendado nem receber novos cursos, responsáveis, perfis de atendimento, documentos ou PEI. |

### O que significa o tipo de acompanhamento

| Tipo de acompanhamento | Modalidades permitidas no agendamento |
| --- | --- |
| **Somente AEE** | Atendimento Educacional Especializado. |
| **Somente pedagógico** | Atendimento Pedagógico. |
| **AEE e pedagógico** | Ambas as modalidades. |

O acompanhamento é uma configuração atual do aluno, independente da situação e dos perfis de atendimento vinculados. Um aluno trancado pode manter o acompanhamento definido, mas continua impedido de receber novos agendamentos.

Cadastros antigos inativos podem apresentar **Não informado**. Defina uma das modalidades antes de reativá-los. Na conversão dos dados antigos, **Ativo** e **Atendimento Completo** passam a permitir **AEE e pedagógico**, preservando a regra anterior; essa conversão não comprova quais atendimentos foram realizados e deve ser revisada quando necessário.

Mudar o acompanhamento não altera nem cancela agendamentos existentes e não reclassifica registros históricos. A criação e a edição de agendamentos verificam a configuração atual do aluno.

## Consultar o prontuário do aluno

O prontuário abre ao visualizar um aluno ou logo depois de cadastrá-lo. No topo fica a faixa compacta de identificação, com foto, matrícula, situação, tipo de acompanhamento, data de ingresso e perfis de atendimento. Logo abaixo ficam os quatro cards de **Status do atendimento**, acima das abas.

### Cards de Status do atendimento

Os quatro cards mostram a situação de **Laudo**, **Estudo de Caso**, **PAEE** e **PEI**. As ações só aparecem quando os pré-requisitos e a permissão do usuário permitem. Em telas menores, os cards se organizam em menos colunas.

| Etapa | Como fica "ok" | Atalho |
| --- | --- | --- |
| **Laudo** | Há um documento do tipo Laudo anexado. | **Ver** abre a aba **Documentos**; **Iniciar** abre o envio de documento. |
| **Estudo de Caso** | O Estudo de Caso atual está concluído. | **Ver**, **Continuar** ou **Iniciar** abre a etapa correspondente. |
| **PAEE** | Há um PAEE ativo. | **Ver** abre o PAEE; **Iniciar** aparece quando o fluxo permite criar um. |
| **PEI** | Há um PEI atual. | **Ver** abre o PEI; **Iniciar** aparece quando o aluno tem situação ativa, curso e PAEE vigentes e semestre atual. |

Abaixo dos cards aparecem os avisos quando o PAEE está com a revisão vencida ou quando o PAEE ativo não está apoiado por um Estudo de Caso concluído nem por um laudo anexado. Solicitações de atendimento e vínculos com cursos continuam disponíveis nas abas próprias.

### Abas do prontuário

Cada aba só aparece para quem tem permissão de consultá-la. O conteúdo aparece diretamente abaixo das abas, sem repetir o título da aba selecionada. Quando houver mais abas do que o espaço disponível, elas continuam na linha seguinte, inclusive no celular, sem precisar rolar para os lados. As abas com tabelas carregam seus registros quando são abertas pela primeira vez; a estrutura e o indicador de carregamento aparecem imediatamente, e os registros permanecem disponíveis ao voltar para uma aba já consultada. Use os filtros acima de cada tabela para localizar registros dentro da aba.

| Aba | Conteúdo |
| --- | --- |
| **Dados pessoais** | Nome, gênero, CPF, nascimento, idade, e-mail, telefone e endereço. |
| **Cursos do aluno** | Vínculos com cursos atuais e históricos do aluno. |
| **Perfis de atendimento** | Perfis vinculados ao aluno, com severidade. |
| **Responsáveis** | Responsáveis cadastrados, vínculo e contato. |
| **Estudos de Caso** | Todas as versões do Estudo de Caso, da mais recente para a mais antiga. |
| **PAEE** | Todas as versões do PAEE, da mais recente para a mais antiga, com indicação da atual. |
| **PEIs** | Planos Educacionais Individualizados por semestre e curso. |
| **Documentos** | Arquivos do aluno, como laudos e relatórios. |
| **Atendimentos AEE** | Registros de atendimento AEE do aluno, com **Histórico em PDF**. |
| **Atendimentos pedagógicos** | Atendimentos pedagógicos do aluno, com **Histórico em PDF**. |
| **Empréstimos** | Itens emprestados ao aluno (para quem consulta empréstimos). |
| **Solicitações** | Solicitações de atendimento do aluno, com filtros, cadastro, visualização e exclusão conforme as permissões. |

Responsáveis, perfis de atendimento e documentos são explicados em [Responsáveis, perfis e documentos do aluno](/ajuda/alunos-responsaveis-e-documentos). Os atendimentos estão em [Atendimentos Especializados](/ajuda/atendimentos-especializados) e [Atendimentos Pedagógicos](/ajuda/atendimentos-pedagogicos).

Concluir uma solicitação não torna o aluno ativo. Enquanto permanecer **Em acolhimento**, as restrições continuam valendo. O aluno pode ser cadastrado diretamente como **Ativo** sem uma solicitação de atendimento prévia.

## Registrar ou consultar uma solicitação de atendimento

Ao final das abas do prontuário, **Solicitações** mostra todos os registros daquele aluno. Use **Cadastrar** acima da tabela para iniciar uma solicitação com o aluno selecionado. A consulta e o cadastro dependem de suas respectivas permissões. Ao voltar, cancelar ou excluir um registro aberto por essa aba, o sistema retorna à própria aba. Veja [Solicitações de Atendimento](/ajuda/solicitacoes-de-atendimento).

## Vincular um curso ao aluno

1. No prontuário, abra a aba **Cursos do aluno** e clique em **Cadastrar**.
2. Escolha o **Curso / Série** (obrigatório) e informe o **Ano Letivo** (obrigatório, com 4 dígitos). O **Semestre** é opcional.
3. Em **Período do Curso**, informe se quiser o período (semestre ou série) em que o aluno está no semestre escolhido. Para informar o período, o **Semestre** passa a ser obrigatório.
4. Marque **Definir este como o curso atual do aluno** se ele for o curso em andamento. No primeiro curso do aluno essa opção já vem marcada e não pode ser desmarcada.
5. Para o curso atual, preencha se quiser o **Acompanhamento Acadêmico no Semestre**: **Situação da Frequência Escolar**, **Disciplinas com Reprovação** e **Disciplinas com Risco de Insucesso Acadêmico**. Reprovações e riscos ficam registrados no **Semestre** escolhido, que no cadastro já vem com o semestre atual. Marque só as exceções: as disciplinas não marcadas são consideradas sem reprovação.
6. Clique em **Salvar**. O sistema mostra "Matrícula realizada com sucesso.".

Ao marcar um novo curso como atual, o curso atual anterior passa para o histórico.

### Período do aluno em cada semestre

O período fica guardado por semestre. Na virada de semestre, use **Virada de semestre** na visualização do curso para registrar todos os alunos de uma vez. Veja [Fazer a virada de semestre dos alunos](/ajuda/cadastros-do-atendimento#fazer-a-virada-de-semestre-dos-alunos). Para um aluno só, edite o curso atual, escolha o novo **Semestre** e o novo **Período do Curso** e salve: o registro do semestre anterior é mantido. A visualização do curso do aluno mostra o **Período do Curso** no semestre da matrícula e o histórico em **Períodos por Semestre**. Deixar o período como **Sem período definido** apaga o registro daquele semestre.

Com o período informado, o PEI mostra primeiro as disciplinas desse período do curso. Veja [PEI](/ajuda/pei#cadastrar-as-adaptacoes-por-disciplina).

## Reprovações, riscos e dependências por semestre

Reprovações e riscos de insucesso são registrados por semestre. Na edição do curso atual, ao trocar o **Semestre**, a tela carrega o período, as reprovações e os riscos já registrados nele; os outros semestres não mudam ao salvar.

Uma reprovação de um semestre anterior que ainda não foi aprovada é uma **dependência**. Não é preciso registrar as aprovações de todas as disciplinas, só as das dependências:

1. Edite o curso atual do aluno e escolha o semestre em que ele foi aprovado.
2. Em **Dependências aprovadas neste semestre**, marque as disciplinas que ele concluiu. Cada uma mostra o semestre da reprovação.
3. Clique em **Salvar**.

A visualização do curso do aluno mostra as **Dependências Pendentes** e o histórico em **Reprovações e Riscos por Semestre**, com as dependências aprovadas em cada semestre. O PEI sugere as dependências pendentes junto com as disciplinas do período.

## Editar, tornar atual ou excluir um curso do aluno

Na aba **Cursos do aluno**, visualize o curso desejado. No rodapé:

- **Editar** aparece somente para o curso atual. Cursos do histórico não podem mais ser editados.
- **Tornar Atual** aparece para cursos do histórico e pede a confirmação "Deseja tornar este o curso atual do aluno? O curso atual será movido para o histórico.".
- **Excluir** remove o curso do histórico do aluno. Se o curso excluído era o atual, o curso mais recente que restar passa a ser o atual.

## Gerar a ficha do aluno em PDF

No rodapé do prontuário, clique em **PDF**. A ficha abre em uma nova aba com os dados do aluno e o histórico dos atendimentos AEE e pedagógicos que você tem permissão de ver.

Os atendimentos aparecem ao final da ficha, separados por modalidade, do mais recente para o mais antigo, sem limite de quantidade. Cada registro mostra data, profissional e presença. Nos atendimentos AEE, a ficha inclui participação e avaliação do desenvolvimento; nos pedagógicos, o registro do acompanhamento. Em caso de falta, mostra o motivo da ausência.

## Excluir um aluno

1. Na listagem, use a ação de excluir da linha do aluno, ou clique em **Excluir** no rodapé do prontuário.
2. Confirme na janela **Excluir Aluno**.

O sistema volta para a listagem e mostra "Aluno removido com sucesso.". A exclusão só é permitida para alunos sem nenhum vínculo: responsáveis, perfis de atendimento, PEIs, cursos, documentos, agendamentos, avaliações de atendimento AEE, empréstimos, solicitações de atendimento ou solicitações na fila de espera.

A pessoa, sua foto e os demais papéis permanecem no [cadastro central de pessoas](/ajuda/pessoas).

## Dúvidas comuns

**Aparece "O aluno está em acolhimento. Nesta situação, somente solicitações de atendimento podem ser cadastradas."**
Durante o acolhimento, registre e acompanhe a solicitação em **Atendimento → Solicitações de Atendimento**. Para liberar outros vínculos, a equipe precisa alterar manualmente a situação do aluno para **Ativo**, quando isso for adequado.


**Aparece "Este aluno possui registros acadêmicos ou de atendimento vinculados e não pode ser excluído."**
O aluno tem algum dos vínculos listados acima. Para encerrar o acompanhamento sem perder o histórico, altere a situação para **Concluído** ou **Desistente**.

**Aparece "O aluno ... não está ativo e não pode realizar esta ação."**
A situação do aluno é **Em acolhimento**, **Trancado**, **Concluído** ou **Desistente**. Edite o aluno e escolha **Ativo**, informando também o tipo de acompanhamento, antes de vincular cursos, responsáveis, perfis ou documentos.

**Aparece "Esta matrícula já está cadastrada para outro aluno." ou "Este CPF já está cadastrado para outra pessoa."**
A matrícula e o CPF são únicos. Procure o aluno na listagem antes de cadastrá-lo novamente.

**Aparece "Este aluno já possui vínculo com o curso selecionado."**
Cada curso só pode ser vinculado uma vez ao mesmo aluno. Se o curso estiver no histórico, use **Tornar Atual**.

**Aparece "Este curso está desativado e não pode ser vinculado."**
O curso foi desativado em **Gestão do núcleo → Cadastros → Cursos**.
