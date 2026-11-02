---
titulo: Alunos e prontuário
resumo: Como cadastrar e editar alunos, alterar o status, consultar o prontuário com suas abas, vincular cursos, gerar a ficha em PDF e excluir um cadastro.
categoria: Atendimento
palavras-chave: aluno, alunos, estudante, cadastrar aluno, novo aluno, matrícula, cpf, foto do aluno, editar aluno, status do aluno, ativo, trancado, concluído, desistente, atendimento completo, prontuário, ficha do aluno, abas, histórico, pdf do aluno, ficha em pdf, curso do aluno, vincular curso, matricular em curso, curso atual, tornar atual, ano letivo, frequência escolar, disciplinas com reprovação, risco de insucesso, excluir aluno, remover aluno, laudo, status do atendimento
ordem: 10
permissoes: student.view
---

O cadastro de alunos reúne os dados pessoais e acadêmicos de cada estudante atendido pelo núcleo e dá acesso ao prontuário, onde ficam responsáveis, perfis de atendimento, cursos, documentos, planos e o histórico de atendimentos. A tela fica em **Atendimento → Alunos**.

## Encontrar um aluno na listagem

A listagem mostra **Nome**, **Telefone**, **E-mail**, **Status** e **Ingresso**. Pelo seletor de colunas é possível exibir também **Matrícula**, **CPF**, **Nascimento**, **Idade** e **Gênero**.

1. Acesse **Atendimento → Alunos**.
2. Use os filtros **Nome do aluno**, **Status** e **Curso**. Em **Mais filtros** há **Telefone**, **E-mail** e **Perfil de atendimento**.
3. Nos filtros de curso e de perfil, as opções **Sem curso** e **Sem perfil de atendimento** mostram os alunos ainda sem esse vínculo.

> **Importante:** usuários vinculados a um cadastro de professor veem apenas os alunos dos cursos em que lecionam.

## Cadastrar um aluno

1. Acesse **Atendimento → Alunos** e clique em **Cadastrar**.
2. Preencha a seção **Dados Pessoais** e, se quiser, adicione a **Foto do Aluno**.
3. Preencha a seção **Dados Acadêmicos**.
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

Todo aluno novo começa com o status **Ativo**. O status só pode ser alterado na edição.

### Foto do aluno

Clique no círculo da foto, arraste uma imagem para ele ou use a câmera (no celular abre a câmera do aparelho; no computador, a webcam). A foto deve estar em JPG ou PNG e ter no máximo 2 MB. Enquanto a imagem é preparada, o botão **Salvar** fica indisponível.

## Editar os dados ou o status de um aluno

1. Abra o prontuário do aluno pela listagem (ação de visualizar).
2. No rodapé, clique em **Editar**.
3. Altere os campos necessários. Na edição aparece também o campo **Status do Aluno** (obrigatório).
4. Para trocar a foto, envie outra imagem; para retirá-la, use a remoção no próprio campo da foto.
5. Clique em **Salvar**. O sistema mostra "Aluno atualizado com sucesso.".

### O que significa cada status

| Status | Efeito no sistema |
| --- | --- |
| **Ativo** | Aceita qualquer tipo de agendamento e demais registros. |
| **Atendimento Completo** | Aceita agendamentos de AEE e pedagógicos. |
| **Atendimento Educacional Especializado** | Aceita somente agendamentos de AEE. |
| **Atendimento Pedagógico** | Aceita somente agendamentos pedagógicos. |
| **Trancado**, **Concluído** ou **Desistente** | O aluno fica inativo: não pode ser agendado nem receber novos cursos, responsáveis, perfis de atendimento, documentos ou PEI. |

## Consultar o prontuário do aluno

O prontuário abre ao visualizar um aluno ou logo depois de cadastrá-lo. No topo ficam a faixa compacta de identificação, com foto, matrícula, status e perfis de atendimento, e o painel **Status do atendimento**.

### Painel Status do atendimento

O painel mostra a sequência do acompanhamento e só oferece uma ação quando os pré-requisitos e a permissão do usuário permitem:

| Caixa | Como fica "ok" | Atalho |
| --- | --- | --- |
| **Vínculo com curso** | O aluno tem uma matrícula vigente. | **Ver** abre o vínculo atual; **Iniciar** abre o cadastro quando ainda não há curso vigente. |
| **Laudo** | Há um documento do tipo Laudo anexado. | **Ver** abre a aba **Documentos**; **Iniciar** abre o envio de documento. |
| **Estudo de Caso** | O Estudo de Caso atual está concluído. | **Ver**, **Continuar** ou **Iniciar** abre a etapa correspondente. |
| **PAEE** | Há um PAEE ativo. | **Ver** abre o PAEE; **Iniciar** aparece quando o fluxo permite criar um. |
| **PEI** | Há um PEI atual. | **Ver** abre o PEI; **Iniciar** aparece quando o aluno tem situação ativa, curso e PAEE vigentes e semestre atual. |

O painel também avisa quando o PAEE está com a revisão vencida ou quando o PAEE ativo não está apoiado por um Estudo de Caso concluído nem por um laudo anexado.

### Abas do prontuário

Cada aba só aparece para quem tem permissão de consultá-la. As abas com tabelas carregam seus registros quando são abertas pela primeira vez; a estrutura e o indicador de carregamento aparecem imediatamente, e os registros permanecem disponíveis ao voltar para uma aba já consultada. Use os filtros acima de cada tabela para localizar registros dentro da aba.

| Aba | Conteúdo |
| --- | --- |
| **Dados pessoais** | Nome, gênero, CPF, nascimento, idade, e-mail, telefone e endereço. |
| **Informações acadêmicas** | Status atual, data de ingresso e a tabela de cursos do aluno. |
| **Perfis de atendimento** | Perfis vinculados ao aluno, com severidade. |
| **Responsáveis** | Responsáveis cadastrados, vínculo e contato. |
| **Estudos de Caso** | Versões do Estudo de Caso, com **Ver Histórico**. |
| **PAEE** | Versões do PAEE, com **Gerenciar PAEE**. |
| **PEIs** | Planos Educacionais Individualizados por semestre e curso. |
| **Documentos** | Arquivos do aluno, como laudos e relatórios. |
| **Atendimentos AEE** | Registros de atendimento AEE do aluno, com **Histórico em PDF**. |
| **Atendimentos pedagógicos** | Atendimentos pedagógicos do aluno, com **Histórico em PDF**. |
| **Empréstimos** | Itens emprestados ao aluno (para quem consulta empréstimos). |

Responsáveis, perfis de atendimento e documentos são explicados em [Responsáveis, perfis e documentos do aluno](/ajuda/alunos-responsaveis-e-documentos). Os atendimentos estão em [Atendimentos Especializados](/ajuda/atendimentos-especializados) e [Atendimentos Pedagógicos](/ajuda/atendimentos-pedagogicos).

## Vincular um curso ao aluno

1. No prontuário, abra a aba **Informações acadêmicas** e clique em **Cadastrar**.
2. Escolha o **Curso / Série** (obrigatório) e informe o **Ano Letivo** (obrigatório, com 4 dígitos). O **Semestre** é opcional.
3. Marque **Definir este como o curso atual do aluno** se ele for o curso em andamento. No primeiro curso do aluno essa opção já vem marcada e não pode ser desmarcada.
4. Para o curso atual, preencha se quiser o **Acompanhamento Acadêmico do Curso Atual**: **Situação da Frequência Escolar**, **Disciplinas com Reprovação** e **Disciplinas com Risco de Insucesso Acadêmico**.
5. Clique em **Salvar**. O sistema mostra "Matrícula realizada com sucesso.".

Ao marcar um novo curso como atual, o curso atual anterior passa para o histórico.

## Editar, tornar atual ou excluir um curso do aluno

Na aba **Informações acadêmicas**, visualize o curso desejado. No rodapé:

- **Editar** aparece somente para o curso atual. Cursos do histórico não podem mais ser editados.
- **Tornar Atual** aparece para cursos do histórico e pede a confirmação "Deseja tornar este o curso atual do aluno? O curso atual será movido para o histórico.".
- **Excluir** remove o curso do histórico do aluno. Se o curso excluído era o atual, o curso mais recente que restar passa a ser o atual.

## Gerar a ficha do aluno em PDF

No rodapé do prontuário, clique em **PDF**. A ficha abre em uma nova aba com os dados do aluno e o histórico dos atendimentos AEE e pedagógicos que você tem permissão de ver.

## Excluir um aluno

1. Na listagem, use a ação de excluir da linha do aluno, ou clique em **Excluir** no rodapé do prontuário.
2. Confirme na janela **Excluir Aluno**.

O sistema volta para a listagem e mostra "Aluno removido com sucesso.". A exclusão só é permitida para alunos sem nenhum vínculo: responsáveis, perfis de atendimento, PEIs, cursos, documentos, agendamentos, avaliações de atendimento AEE, empréstimos ou solicitações na fila de espera.

## Dúvidas comuns

**Aparece "Este aluno possui registros acadêmicos ou de atendimento vinculados e não pode ser excluído."**
O aluno tem algum dos vínculos listados acima. Para encerrar o acompanhamento sem perder o histórico, altere o status para **Concluído** ou **Desistente**.

**Aparece "O aluno ... não está ativo e não pode realizar esta ação."**
O status do aluno é **Trancado**, **Concluído** ou **Desistente**. Edite o aluno e escolha um status ativo antes de vincular cursos, responsáveis, perfis ou documentos.

**Aparece "Esta matrícula já está cadastrada para outro aluno." ou "Este CPF já está cadastrado para outra pessoa."**
A matrícula e o CPF são únicos. Procure o aluno na listagem antes de cadastrá-lo novamente.

**Aparece "Este aluno já possui vínculo com o curso selecionado."**
Cada curso só pode ser vinculado uma vez ao mesmo aluno. Se o curso estiver no histórico, use **Tornar Atual**.

**Aparece "Este curso está desativado e não pode ser vinculado."**
O curso foi desativado em **Gestão do núcleo → Cadastros → Cursos**.
